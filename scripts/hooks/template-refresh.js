const MOD_ID = "sinlesscsb";
const ACTOR_TEMPLATE_PACK = `${MOD_ID}.sinlesscsb-actor-templates`;
const AUTO_REFRESH_SETTING = "autoRefreshActorTemplatesOnUpdate";
const LAST_REFRESH_VERSION_SETTING = "actorTemplateRefreshLastVersion";

function text(value, fallback = "") {
  return String(value ?? fallback).trim();
}

function isTemplateActor(actor) {
  return actor?.documentName === "Actor" && actor?.type === "_template";
}

function isCharacterActor(actor) {
  return actor?.documentName === "Actor" && actor?.type !== "_template";
}

function getTemplateVersion(actor) {
  const raw = actor?.system?.templateSystemUniqueVersion;
  return text(raw);
}

function getActorTemplateRef(actor) {
  return text(actor?.system?.template);
}

function logDebug(...args) {
  if (!game.settings?.get?.(MOD_ID, "debugLogs")) return;
  console.log("SinlessCSB |", ...args);
}

function getProgressApi() {
  return globalThis.SceneNavigation;
}

function updateProgress(label, pct) {
  const api = getProgressApi();
  if (!api?.displayProgressBar) return;
  api.displayProgressBar({ label, pct });
}

async function getActorTemplatePack() {
  const pack = game.packs?.get?.(ACTOR_TEMPLATE_PACK) ?? null;
  if (!pack) {
    ui.notifications?.warn?.(`SinlessCSB | Actor template pack missing: ${ACTOR_TEMPLATE_PACK}`);
    return null;
  }
  return pack;
}

function getTemplateSourceId(packTemplate) {
  return text(packTemplate?.uuid);
}

function getWorldTemplateCandidatesByName(packTemplate) {
  const name = text(packTemplate?.name);
  if (!name) return [];
  return (game.actors?.contents ?? []).filter((actor) => isTemplateActor(actor) && text(actor.name) === name);
}

function findMatchingWorldTemplate(packTemplate) {
  if (!isTemplateActor(packTemplate)) return { actor: null, match: "not-template" };

  const exactId = game.actors?.get?.(packTemplate.id) ?? null;
  if (isTemplateActor(exactId)) return { actor: exactId, match: "id" };

  const sourceId = getTemplateSourceId(packTemplate);
  if (sourceId) {
    const bySourceId = (game.actors?.contents ?? []).find((actor) => {
      if (!isTemplateActor(actor)) return false;
      return text(actor.getFlag?.("core", "sourceId")) === sourceId;
    }) ?? null;
    if (bySourceId) return { actor: bySourceId, match: "sourceId" };
  }

  const byName = getWorldTemplateCandidatesByName(packTemplate);
  if (byName.length) return { actor: null, match: "name-only-unmanaged" };

  return { actor: null, match: "missing" };
}

function buildTemplateUpdateData(packTemplate) {
  const source = packTemplate.toObject();
  return {
    img: source.img,
    prototypeToken: source.prototypeToken,
    system: source.system
  };
}

async function refreshWorldTemplateFromPack(worldTemplate, packTemplate) {
  const updateData = buildTemplateUpdateData(packTemplate);
  await worldTemplate.update(updateData, { diff: false, recursive: false });

  const sourceId = getTemplateSourceId(packTemplate);
  if (sourceId && text(worldTemplate.getFlag?.("core", "sourceId")) !== sourceId) {
    try {
      await worldTemplate.setFlag("core", "sourceId", sourceId);
    } catch (err) {
      console.warn("SinlessCSB | failed setting core.sourceId on template", {
        template: worldTemplate.name,
        sourceId,
        err
      });
    }
  }
}

function findDependentActors(worldTemplate) {
  return (game.actors?.contents ?? []).filter((actor) => {
    if (!isCharacterActor(actor)) return false;
    return getActorTemplateRef(actor) === worldTemplate.id;
  });
}

async function reloadDependentActor(actor) {
  const reloader = actor?.templateSystem?.reloadTemplate;
  if (typeof reloader === "function") {
    await reloader.call(actor.templateSystem);
    try { actor.sheet?.render?.(true); } catch (_err) {}
    return true;
  }

  console.warn("SinlessCSB | templateSystem.reloadTemplate unavailable for actor", actor?.name);
  return false;
}

export async function refreshActorTemplatesFromModule({
  force = false,
  notify = true
} = {}) {
  if (!game.user?.isGM) {
    ui.notifications?.warn?.("SinlessCSB | Template refresh requires GM permissions.");
    return { ok: false, reason: "not-gm" };
  }

  const moduleVersion = text(game.modules?.get?.(MOD_ID)?.version);
  const lastVersion = text(game.settings?.get?.(MOD_ID, LAST_REFRESH_VERSION_SETTING));
  if (!force && moduleVersion && lastVersion === moduleVersion) {
    logDebug("template refresh skipped; already applied for version", moduleVersion);
    return { ok: true, skipped: true, moduleVersion };
  }

  const pack = await getActorTemplatePack();
  if (!pack) return { ok: false, reason: "missing-pack" };

  const documents = await pack.getDocuments();
  const templates = documents.filter((doc) => isTemplateActor(doc));
  const result = {
    ok: true,
    moduleVersion,
    templatesSeen: templates.length,
    templatesUpdated: 0,
    actorsReloaded: 0,
    skippedTemplates: [],
    errors: []
  };

  let processed = 0;
  for (const packTemplate of templates) {
    processed += 1;
    updateProgress(`SinlessCSB | Refreshing templates ${processed}/${templates.length}`, Math.round((processed * 100) / Math.max(templates.length, 1)));

    try {
      const match = findMatchingWorldTemplate(packTemplate);
      if (!match.actor) {
        result.skippedTemplates.push({
          template: packTemplate.name,
          reason: match.match
        });
        continue;
      }

      const worldTemplate = match.actor;
      const packVersion = getTemplateVersion(packTemplate);
      const worldVersion = getTemplateVersion(worldTemplate);
      const templateNeedsUpdate = force || !packVersion || packVersion !== worldVersion;

      if (templateNeedsUpdate) {
        await refreshWorldTemplateFromPack(worldTemplate, packTemplate);
        result.templatesUpdated += 1;
        logDebug("template refreshed from pack", {
          template: packTemplate.name,
          match: match.match,
          from: worldVersion || "(blank)",
          to: packVersion || "(blank)"
        });
      }

      const dependents = findDependentActors(worldTemplate);
      const reloadTargets = templateNeedsUpdate
        ? dependents
        : dependents.filter((actor) => {
            const actorVersion = getTemplateVersion(actor);
            return force || (!!packVersion && actorVersion !== packVersion);
          });

      for (const actor of reloadTargets) {
        const reloaded = await reloadDependentActor(actor);
        if (reloaded) result.actorsReloaded += 1;
      }
    } catch (err) {
      console.error("SinlessCSB | template refresh failed", {
        template: packTemplate?.name,
        err
      });
      result.errors.push({
        template: packTemplate?.name ?? "(unknown)",
        message: err?.message ?? String(err)
      });
    }
  }

  updateProgress("SinlessCSB | Template refresh finished", 100);

  if (result.errors.length) {
    result.ok = false;
  }

  if (moduleVersion && !result.errors.length) {
    await game.settings?.set?.(MOD_ID, LAST_REFRESH_VERSION_SETTING, moduleVersion);
  }

  if (notify) {
    if (result.errors.length) {
      ui.notifications?.warn?.(
        `SinlessCSB | Template refresh updated ${result.templatesUpdated} template(s), reloaded ${result.actorsReloaded} actor(s), with ${result.errors.length} error(s).`
      );
    } else if (result.templatesUpdated || result.actorsReloaded || force) {
      ui.notifications?.info?.(
        `SinlessCSB | Template refresh updated ${result.templatesUpdated} template(s) and reloaded ${result.actorsReloaded} actor(s).`
      );
    }
  }

  logDebug("template refresh result", result);
  return result;
}

export function registerTemplateRefreshHooks() {
  game.settings.register(MOD_ID, AUTO_REFRESH_SETTING, {
    name: "Allow module updates to templates to auto refresh prior created dependents using templates",
    hint: "Opt-in safety toggle. When enabled, a new module version will refresh matching managed world templates imported from the SinlessCSB actor-template compendium, then reload dependent actors. Per-actor values should remain, but edits made directly to the managed world template itself will be replaced.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MOD_ID, LAST_REFRESH_VERSION_SETTING, {
    name: "Last actor template refresh version",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });

  Hooks.once("ready", () => {
    if (!game.user?.isGM) return;
    const enabled = Boolean(game.settings?.get?.(MOD_ID, AUTO_REFRESH_SETTING));
    if (!enabled) return;

    refreshActorTemplatesFromModule({ force: false, notify: true }).catch((err) => {
      console.error("SinlessCSB | automatic template refresh failed", err);
      ui.notifications?.warn?.("SinlessCSB | Automatic template refresh failed. See console.");
    });
  });
}
