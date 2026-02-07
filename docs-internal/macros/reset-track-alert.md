/* CSB rollMessage snippet (paste into the button's rollMessage field) */
%{
  const api = game.modules.get("sinlesscsb")?.api;
  if (typeof api?.resetTrackAlert !== "function") {
    console.warn("SinlessCSB | resetTrackAlert: API not available", { apiKeys: Object.keys(api ?? {}) });
    ui.notifications?.error?.("SinlessCSB: resetTrackAlert API not available (module not ready / not exposed).");
    return "";
  }

  (async () => {
    try {
      const res = await api.resetTrackAlert({ reason: "manual" });
      if (res?.ok) {
        ui.notifications?.info?.("Track Alert reset to 0.");
      } else {
        ui.notifications?.warn?.("Track Alert reset failed. See console.");
      }
    } catch (e) {
      console.warn("SinlessCSB | resetTrackAlert failed", e);
      ui.notifications?.error?.("Track Alert reset failed. See console.");
    }
  })();

  return "";
}%

/* Foundry Script Macro (optional, if you want a macro-bar button instead) */
(async () => {
  const api = game.modules.get("sinlesscsb")?.api;
  if (typeof api?.resetTrackAlert !== "function") {
    console.warn("SinlessCSB | resetTrackAlert: API not available", { apiKeys: Object.keys(api ?? {}) });
    ui.notifications?.error?.("Reset Track Alert: API not available (sinlesscsb module not ready).");
    return;
  }

  try {
    const res = await api.resetTrackAlert({ reason: "manual" });
    if (res?.ok) {
      ui.notifications?.info?.("Track Alert reset to 0.");
    } else {
      ui.notifications?.warn?.("Track Alert reset failed. See console for details.");
    }
  } catch (e) {
    console.warn("SinlessCSB | resetTrackAlert failed", e);
    ui.notifications?.error?.("Track Alert reset failed. See console.");
  }
})();
