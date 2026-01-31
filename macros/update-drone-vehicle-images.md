(async () => {
  const BASE = "modules/sinlesscsb/assets/images";

  // Drone mappings (pages 145-148). Some are best-guess; see notes in the response.
  const DRONE_IMAGES = {
    "Bug-Spy": `${BASE}/SinlessDrones/white/p145_img1_xref741.png`,
    "Disc": `${BASE}/SinlessDrones/white/p145_img2_xref745.png`,
    "Orb": `${BASE}/SinlessDrones/white/p145_img3_xref749.png`,

    "VSTOL Bird": `${BASE}/SinlessDrones/white/p146_img1_xref756.png`,
    "Roto-Drone": `${BASE}/SinlessDrones/white/p146_img2_xref760.png`,
    "Shield Drone": `${BASE}/SinlessDrones/white/p146_img3_xref764.png`,
    "Dog-Patrol Drone": `${BASE}/SinlessDrones/white/p146_img4_xref768.png`,

    // Anthro-patrol image mapped to Anthrodroid (confirm if you want a different mapping)
    "Anthrodroid": `${BASE}/SinlessDrones/white/p147_img1_xref775.png`,
    "Mobile Sentinel": `${BASE}/SinlessDrones/white/p147_img2_xref779.png`,
    "Hawk": `${BASE}/SinlessDrones/white/p147_img3_xref783.png`,
    "Shield-Wall Drone": `${BASE}/SinlessDrones/white/p147_img4_xref787.png`,

    // Page 148: Anthrobruiser / Gladiator / Aerial Warden images (confirm mappings)
    "Anthrobrute": `${BASE}/SinlessDrones/white/p148_img1_xref794.png`,
    "Gladiator": `${BASE}/SinlessDrones/white/p148_img2_xref798.png`,
    "Aerial Warden": `${BASE}/SinlessDrones/white/p148_img3_xref802.png`
  };

  // Vehicle mappings (pages 154-159). Scooter removed; Skate is its own item.
  const VEHICLE_IMAGES = {
    "Battle Cycle": `${BASE}/SinlessVehicles/white/p154_img1_xref824.png`,
    "Motorcycle": `${BASE}/SinlessVehicles/white/p154_img2_xref826.png`,
    "Chopper": `${BASE}/SinlessVehicles/white/p154_img3_xref828.png`,
    "Skate": `${BASE}/SinlessVehicles/white/skate.png`,

    "Sports Sedan": `${BASE}/SinlessVehicles/white/p155_img1_xref835.png`,
    "Two-Seater": `${BASE}/SinlessVehicles/white/p155_img2_xref837.png`,
    "Sports Car": `${BASE}/SinlessVehicles/white/p155_img3_xref839.png`,
    "Racing Bike": `${BASE}/SinlessVehicles/white/p155_img4_xref841.png`,

    "Limousine": `${BASE}/SinlessVehicles/white/p156_img1_xref846.png`,
    "Luxury Sedan": `${BASE}/SinlessVehicles/white/p156_img2_xref848.png`,
    "Pickup": `${BASE}/SinlessVehicles/white/p156_img3_xref850.png`,
    "Family Sedan": `${BASE}/SinlessVehicles/white/p156_img4_xref852.png`,

    "Armored Car": `${BASE}/SinlessVehicles/white/p157_img1_xref857.png`,
    "Luxury Van": `${BASE}/SinlessVehicles/white/p157_img2_xref859.png`,
    "Small Boat": `${BASE}/SinlessVehicles/white/p157_img3_xref861.png`,
    "Delivery Van": `${BASE}/SinlessVehicles/white/p157_img4_xref863.png`,

    "Nightwing": `${BASE}/SinlessVehicles/white/p158_img1_xref868.png`,
    "Patrol Boat": `${BASE}/SinlessVehicles/white/p158_img2_xref870.png`,
    "Seaplane": `${BASE}/SinlessVehicles/white/p158_img3_xref872.png`,
    "Speedboat": `${BASE}/SinlessVehicles/white/p158_img4_xref874.png`,

    "Transport Helicopter": `${BASE}/SinlessVehicles/white/p159_img1_xref879.png`,
    "Cargo Helicopter": `${BASE}/SinlessVehicles/white/p159_img2_xref881.png`
  };

  const findFolder = (type, name) =>
    game.folders?.find?.(f => f.type === type && f.name === name && !f.folder) || null;

  const docsByName = (docs, folder) =>
    new Map((docs ?? []).filter(d => d.folder?.id === folder?.id).map(d => [d.name, d]));

  async function updateDocs(map, docsMap, label) {
    let updated = 0;
    const missingDocs = [];
    for (const [name, img] of Object.entries(map)) {
      const doc = docsMap.get(name);
      if (!doc) {
        missingDocs.push(name);
        continue;
      }
      try {
        await doc.update({ img });
        updated += 1;
      } catch (e) {
        console.warn(`${label}: failed to update ${name}`, e);
      }
    }

    const missingImages = [];
    for (const name of docsMap.keys()) {
      if (!map[name]) missingImages.push(name);
    }

    console.log(`${label}: updated ${updated}. Missing docs:`, missingDocs);
    console.log(`${label}: docs without mapping:`, missingImages);

    ui.notifications?.info?.(`${label}: updated ${updated}. See console for missing items.`);
  }

  // Drones
  const droneActorFolder = findFolder("Actor", "DroneHangar");
  const droneItemFolder = findFolder("Item", "DroneItems");
  if (droneActorFolder) {
    const actors = docsByName(game.actors, droneActorFolder);
    await updateDocs(DRONE_IMAGES, actors, "Drone actor images");
  } else {
    ui.notifications?.warn?.("DroneHangar folder not found (actors not updated).");
  }
  if (droneItemFolder) {
    const items = docsByName(game.items, droneItemFolder);
    await updateDocs(DRONE_IMAGES, items, "Drone item images");
  } else {
    ui.notifications?.warn?.("DroneItems folder not found (items not updated).");
  }

  // Vehicles
  const vehicleActorFolder = findFolder("Actor", "VehicleHangar");
  const vehicleItemFolder = findFolder("Item", "VehicleItems");
  if (vehicleActorFolder) {
    const actors = docsByName(game.actors, vehicleActorFolder);
    await updateDocs(VEHICLE_IMAGES, actors, "Vehicle actor images");
  } else {
    ui.notifications?.warn?.("VehicleHangar folder not found (actors not updated).");
  }
  if (vehicleItemFolder) {
    const items = docsByName(game.items, vehicleItemFolder);
    await updateDocs(VEHICLE_IMAGES, items, "Vehicle item images");
  } else {
    ui.notifications?.warn?.("VehicleItems folder not found (items not updated).");
  }
})();
