# Folder Tree (Actors + Items)

- World: **PacificNorthWestMarches**
- Generated (ISO): 2026-02-15T16:49:23.486Z
- Format: `sinlesscsb-folder-tree-v2`

## Parse Rules
- Treat `folderId` and `parentFolderId` as canonical hierarchy keys.
- Use `path` only as a convenience label; duplicate names can exist.
- Actors are filtered to top-level folders: PCs, NPCs, DroneHangar, VehicleHangar, Templates.
- Use the JSON section for deterministic machine parsing.

## Actors - Tree
- [FOLDER] PCs {id:bGGgYtFXJvPyXTLo, parent:null, depth:0, path:"PCs"}
  - [ACTOR] Crime by Day, Rave by Night {id:3UvKepdZNQcxmmIe, type:character, folderId:bGGgYtFXJvPyXTLo}
  - [ACTOR] PC Sheet (duplicate & rename) {id:qXmqhVfZkE8eEbd6, type:character, folderId:bGGgYtFXJvPyXTLo}
  - [ACTOR] TestSpell {id:eMbezua6UThIStwT, type:character, folderId:bGGgYtFXJvPyXTLo}
  - [FOLDER] pcControlled {id:T2tb1RlCWPfkdVR5, parent:bGGgYtFXJvPyXTLo, depth:1, path:"PCs/pcControlled"}
  - [FOLDER] PreGens {id:tlB8baeczfAB1tEw, parent:bGGgYtFXJvPyXTLo, depth:1, path:"PCs/PreGens"}
    - [ACTOR] ARCHMAG {id:iDwCzeasOdOeW3lz, type:character, folderId:tlB8baeczfAB1tEw}
    - [ACTOR] ASSASSIN {id:i6WYCzWY0pveTact, type:character, folderId:tlB8baeczfAB1tEw}
    - [ACTOR] COVERT OPERATIVE {id:D5WzoYijRz7njQMS, type:character, folderId:tlB8baeczfAB1tEw}
    - [ACTOR] Cybered Recon {id:TURaFIPLhla4F7iL, type:character, folderId:tlB8baeczfAB1tEw}
    - [ACTOR] DETECTIVE {id:rQ9WKtl8r6sZBhdi, type:character, folderId:tlB8baeczfAB1tEw}
    - [ACTOR] DRIVER {id:8vzQkDQUAT7qEO2m, type:character, folderId:tlB8baeczfAB1tEw}
    - [ACTOR] Gorilla hacker {id:q5cumBez1mzzRSNL, type:character, folderId:tlB8baeczfAB1tEw}
    - [ACTOR] Luci-0 {id:pwsZfNAdGgAvus4X, type:character, folderId:tlB8baeczfAB1tEw}
    - [ACTOR] MARTIAL ARTIST {id:9HqlPECYxaacY01V, type:character, folderId:tlB8baeczfAB1tEw}
    - [ACTOR] POP IDOL {id:JF5REvziVWvRoj60, type:character, folderId:tlB8baeczfAB1tEw}
    - [ACTOR] Rigger Sleuth {id:pt3aAa7sgQZv3xsy, type:character, folderId:tlB8baeczfAB1tEw}
    - [ACTOR] Vamp Face {id:UwUS1iZD5q7M0ggU, type:character, folderId:tlB8baeczfAB1tEw}
    - [ACTOR] WASTELAND MAGE {id:eMIR1Wvxh4VxXWES, type:character, folderId:tlB8baeczfAB1tEw}
- [FOLDER] NPCs {id:p6hbQkfl32SKkvGO, parent:null, depth:0, path:"NPCs"}
  - [ACTOR] Session Settings {id:U8ITLI4BCWctTKnY, type:character, folderId:p6hbQkfl32SKkvGO}
  - [FOLDER] Animals {id:bO6yVDTjF5UQw2ZU, parent:p6hbQkfl32SKkvGO, depth:1, path:"NPCs/Animals"}
    - [ACTOR] Bear {id:8S6qaeWInLOl4qc4, type:character, folderId:bO6yVDTjF5UQw2ZU}
    - [ACTOR] Cat {id:BWA3pls6uk73KGlq, type:character, folderId:bO6yVDTjF5UQw2ZU}
    - [ACTOR] Dog {id:ClylecXaREys3eYe, type:character, folderId:bO6yVDTjF5UQw2ZU}
    - [ACTOR] Elephant {id:0uZ2brFL5XVRcPPC, type:character, folderId:bO6yVDTjF5UQw2ZU}
    - [ACTOR] Gorilla {id:ZItdsgolntxNF8p0, type:character, folderId:bO6yVDTjF5UQw2ZU}
    - [ACTOR] Hawk {id:AOBith7wwuUmP7VP, type:character, folderId:bO6yVDTjF5UQw2ZU}
    - [ACTOR] Horse {id:PF0aRBByTy67TOdS, type:character, folderId:bO6yVDTjF5UQw2ZU}
    - [ACTOR] Wildcat/Panther {id:M1QAEppPYWtjhe1Q, type:character, folderId:bO6yVDTjF5UQw2ZU}
    - [ACTOR] Wolf {id:HHSCId1xRVp5z8gw, type:character, folderId:bO6yVDTjF5UQw2ZU}
  - [FOLDER] Drones {id:w2u228ARPzSzv5YK, parent:p6hbQkfl32SKkvGO, depth:1, path:"NPCs/Drones"}
    - [ACTOR] Citizen Aid Drone (Anthrodroid) {id:WACnBF6xJEpVXLJW, type:character, folderId:w2u228ARPzSzv5YK}
    - [ACTOR] Orb Turret (Orb) {id:i6aGaAYoyv5IhaMk, type:character, folderId:w2u228ARPzSzv5YK}
    - [ACTOR] Stationary Turret - Autocannon {id:qmj9R05UI6Nfw1ep, type:character, folderId:w2u228ARPzSzv5YK}
    - [ACTOR] Stormtrooper Drones (Anthrobrute) {id:0e3viE19AKyJomoy, type:character, folderId:w2u228ARPzSzv5YK}
    - [ACTOR] Talos (Gladiator) {id:RQKHlqg6Jh3eHUdU, type:character, folderId:w2u228ARPzSzv5YK}
  - [FOLDER] Goons {id:p8IVu82dgB2UKnoT, parent:p6hbQkfl32SKkvGO, depth:1, path:"NPCs/Goons"}
    - [ACTOR] Mall Cop {id:5owR2J5jTBBx243h, type:character, folderId:p8IVu82dgB2UKnoT}
    - [ACTOR] Security Personnel {id:ZCuiAfQTed3YgLqj, type:character, folderId:p8IVu82dgB2UKnoT}
    - [ACTOR] Stormtroopers {id:8Jy0Egk4NFRRDPbL, type:character, folderId:p8IVu82dgB2UKnoT}
    - [ACTOR] Street Cop {id:doukrqZ3qHeyFnGO, type:character, folderId:p8IVu82dgB2UKnoT}
    - [ACTOR] Street Thug {id:KpdfJNI181fAqT3O, type:character, folderId:p8IVu82dgB2UKnoT}
    - [ACTOR] Street Thug, Armed {id:uxu1jGg3oE4BSE19, type:character, folderId:p8IVu82dgB2UKnoT}
    - [ACTOR] Street Thug, Lieutenant {id:BKaLlFGTV0nrvZEm, type:character, folderId:p8IVu82dgB2UKnoT}
  - [FOLDER] Iniquitates {id:N3RsHmS7ZofXCTDB, parent:p6hbQkfl32SKkvGO, depth:1, path:"NPCs/Iniquitates"}
    - [ACTOR] Alzebo {id:DmxBBuPGu7Qn6SYi, type:character, folderId:N3RsHmS7ZofXCTDB}
    - [ACTOR] Deodand {id:bdEn1g74T6R9eZCp, type:character, folderId:N3RsHmS7ZofXCTDB}
    - [ACTOR] Refuse Goblins {id:eAvD0hNiHmKJUF1J, type:character, folderId:N3RsHmS7ZofXCTDB}
  - [FOLDER] Programs {id:OHGJHoWG4unr64QM, parent:p6hbQkfl32SKkvGO, depth:1, path:"NPCs/Programs"}
    - [ACTOR] Belligerent Engram Eradicators (Bees) {id:WV8ywxnHfXd7813a, type:character, folderId:OHGJHoWG4unr64QM}
    - [ACTOR] Defensive Daemon {id:vF1UCqQkxwI5Bkfp, type:character, folderId:OHGJHoWG4unr64QM}
    - [ACTOR] Reconstruct Network Integrity Daemon (RNID) {id:cGwZZjJycrDZeByR, type:character, folderId:OHGJHoWG4unr64QM}
    - [ACTOR] Sensor Daemon {id:NDqQGQkb1BlQNDMZ, type:character, folderId:OHGJHoWG4unr64QM}
    - [ACTOR] Warrior Agent Security Patrol (Wasps) {id:fO0ipCs30IlbIyJn, type:character, folderId:OHGJHoWG4unr64QM}
  - [FOLDER] Spirits {id:ZMsiW2FSdQ2KSvnq, parent:p6hbQkfl32SKkvGO, depth:1, path:"NPCs/Spirits"}
    - [ACTOR] Aqua Deambulatio {id:l3fWGM4RfBzM6mk4, type:character, folderId:ZMsiW2FSdQ2KSvnq}
    - [ACTOR] Attash Aazaar {id:FVj98iE0FcyVCtcx, type:character, folderId:ZMsiW2FSdQ2KSvnq}
    - [ACTOR] Chainsaw Skeletons {id:L2gYl5mblmAkXz3d, type:character, folderId:ZMsiW2FSdQ2KSvnq}
    - [ACTOR] Gaoh {id:O4gvFyhSz0gQ37IB, type:character, folderId:ZMsiW2FSdQ2KSvnq}
    - [ACTOR] Ignis Dicen {id:t3MdfTvAFYZSM6nZ, type:character, folderId:ZMsiW2FSdQ2KSvnq}
    - [ACTOR] Lapsae Caelum {id:CUlUOyrHL5YXUDmN, type:character, folderId:ZMsiW2FSdQ2KSvnq}
    - [ACTOR] Miasma {id:yY7v2ESAOGUbgQhL, type:character, folderId:ZMsiW2FSdQ2KSvnq}
    - [ACTOR] Moryana {id:Yqd790UKKPn0eKfx, type:character, folderId:ZMsiW2FSdQ2KSvnq}
    - [ACTOR] Mound of Skulls {id:S5HJSHyWWEI7SAGJ, type:character, folderId:ZMsiW2FSdQ2KSvnq}
    - [ACTOR] Pacha Mama {id:FQDcxI8oYgbJui2Z, type:character, folderId:ZMsiW2FSdQ2KSvnq}
    - [ACTOR] Stormwing {id:eNG6ra9AAfbkuxuj, type:character, folderId:ZMsiW2FSdQ2KSvnq}
    - [ACTOR] Terra Factorem {id:KiwePQ0zQvozm6xC, type:character, folderId:ZMsiW2FSdQ2KSvnq}
    - [ACTOR] Zeek Electricity Spirit {id:msTIIV2QHErNVW1z, type:character, folderId:ZMsiW2FSdQ2KSvnq}
- [FOLDER] DroneHangar {id:C9SZJMPMSIoSKI67, parent:null, depth:0, path:"DroneHangar"}
  - [ACTOR] Aerial Warden {id:2vh1c8FVTf6cBwtE, type:character, folderId:C9SZJMPMSIoSKI67}
  - [ACTOR] Anthrobrute {id:tluL0tIn8eARzMwa, type:character, folderId:C9SZJMPMSIoSKI67}
  - [ACTOR] Anthrodroid {id:btyAqEbWpT9FbmGH, type:character, folderId:C9SZJMPMSIoSKI67}
  - [ACTOR] Bug-Spy {id:35HRFJoHgWTt3x8f, type:character, folderId:C9SZJMPMSIoSKI67}
  - [ACTOR] Disc {id:KMXnuSsA1IEnSivh, type:character, folderId:C9SZJMPMSIoSKI67}
  - [ACTOR] Dog-Patrol Drone {id:32ejekBhTDE5cOSF, type:character, folderId:C9SZJMPMSIoSKI67}
  - [ACTOR] Gladiator {id:Kvr6pUqEwt73QXcs, type:character, folderId:C9SZJMPMSIoSKI67}
  - [ACTOR] Hawk {id:q3Udsyg7zovQ5FoD, type:character, folderId:C9SZJMPMSIoSKI67}
  - [ACTOR] Mobile Sentinel {id:1fJQnIQ76TnvqdAz, type:character, folderId:C9SZJMPMSIoSKI67}
  - [ACTOR] Orb {id:Fn9V6LmM5QzdLAkY, type:character, folderId:C9SZJMPMSIoSKI67}
  - [ACTOR] Roto-Drone {id:QMHLg5Nh2Qub92O5, type:character, folderId:C9SZJMPMSIoSKI67}
  - [ACTOR] Shield Drone {id:hZummIxj1gYPgpOg, type:character, folderId:C9SZJMPMSIoSKI67}
  - [ACTOR] Shield-Wall Drone {id:JOnBPPrrMCimY5wx, type:character, folderId:C9SZJMPMSIoSKI67}
  - [ACTOR] VSTOL Bird {id:HK9rSt7Bw28kC91e, type:character, folderId:C9SZJMPMSIoSKI67}
- [FOLDER] VehicleHangar {id:I8VLhxriauMW5wH0, parent:null, depth:0, path:"VehicleHangar"}
  - [ACTOR] Armored Car {id:YrcHYiZz2DClrx73, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Battle Cycle {id:gMuob9Zc3oQMJL5t, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Cargo Heli {id:E1wseQJRW9U60tPV, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Chopper {id:VYIuxgZfPk6cmEDl, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Delivery Van {id:49b7xlC8WpfdAm6V, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Family Sedan {id:kgW5UuRTN9aVJQLO, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Limo {id:bIItnnGuiSDXOTGF, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Luxury Sedan {id:9IxyUuPhLM41J1K9, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Luxury Van {id:zoWqMukGSFHMTslC, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Motorcycle {id:x1fpvHM6WLE7B3R7, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Nightwing {id:ahGHLlVgXRWFMKCO, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Patrol Boat {id:dHLNbMrpXPNXoTJU, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Pickup {id:CQuecuTEcXCQ9U19, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Racing Bike {id:pZvqrFWKnqyFClRU, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Seaplane {id:3oi9ZXxABUPPPdkc, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Skate {id:HdkLKHrN5N6l0lSL, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Small Boat {id:vEev6mqgzdeNRqei, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Speedboat {id:zDoAsiN3JeWwuvnl, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Sports Car {id:zPjI6U6SqDotTVmI, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Sports Sedan {id:LAY2VmmdyyuyMLRa, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Transport Heli {id:6ZaXDQU7FcPyh3Kg, type:character, folderId:I8VLhxriauMW5wH0}
  - [ACTOR] Two-Seater {id:Cr8G5z5z7R6gikRB, type:character, folderId:I8VLhxriauMW5wH0}
- [FOLDER] Templates {id:eJiZ5ojJouMYFr9R, parent:null, depth:0, path:"Templates"}
  - [ACTOR] Brand Template {id:uI4SrMJ9fuLk7UN0, type:_template, folderId:eJiZ5ojJouMYFr9R}
  - [ACTOR] Drone Template {id:lL9MiN64F7mRGhuj, type:_template, folderId:eJiZ5ojJouMYFr9R}
  - [ACTOR] Session Settings Template {id:DubVcAsia226PlV0, type:_template, folderId:eJiZ5ojJouMYFr9R}
  - [ACTOR] Sinless NPC {id:694838d341f4407b, type:_template, folderId:eJiZ5ojJouMYFr9R}
  - [ACTOR] Sinless PC {id:409875cd45a544c0, type:_template, folderId:eJiZ5ojJouMYFr9R}
  - [ACTOR] Sinless PC (Copy) {id:OXKxlTnNPzmAbRn2, type:_template, folderId:eJiZ5ojJouMYFr9R}
  - [ACTOR] Vehicle Template {id:9YbyOSIZBhfekbLK, type:_template, folderId:eJiZ5ojJouMYFr9R}

### Actors - Folder Index
| path | folderId | parentFolderId | depth | sort | sorting |
| --- | --- | --- | ---: | ---: | --- |
| DroneHangar | C9SZJMPMSIoSKI67 |  | 0 | -25000 | a |
| NPCs | p6hbQkfl32SKkvGO |  | 0 | -50000 | a |
| PCs | bGGgYtFXJvPyXTLo |  | 0 | -100000 | a |
| Templates | eJiZ5ojJouMYFr9R |  | 0 | -18750 | a |
| VehicleHangar | I8VLhxriauMW5wH0 |  | 0 | -21875 | a |
| NPCs/Animals | bO6yVDTjF5UQw2ZU | p6hbQkfl32SKkvGO | 1 | 0 | a |
| NPCs/Drones | w2u228ARPzSzv5YK | p6hbQkfl32SKkvGO | 1 | 0 | a |
| NPCs/Goons | p8IVu82dgB2UKnoT | p6hbQkfl32SKkvGO | 1 | 0 | a |
| NPCs/Iniquitates | N3RsHmS7ZofXCTDB | p6hbQkfl32SKkvGO | 1 | 0 | a |
| NPCs/Programs | OHGJHoWG4unr64QM | p6hbQkfl32SKkvGO | 1 | 0 | a |
| NPCs/Spirits | ZMsiW2FSdQ2KSvnq | p6hbQkfl32SKkvGO | 1 | 0 | a |
| PCs/pcControlled | T2tb1RlCWPfkdVR5 | bGGgYtFXJvPyXTLo | 1 | 0 | a |
| PCs/PreGens | tlB8baeczfAB1tEw | bGGgYtFXJvPyXTLo | 1 | 0 | a |

### Actors - Document Index
| path | documentId | name | subtype | folderId |
| --- | --- | --- | --- | --- |
| DroneHangar/Aerial Warden | 2vh1c8FVTf6cBwtE | Aerial Warden | character | C9SZJMPMSIoSKI67 |
| DroneHangar/Anthrobrute | tluL0tIn8eARzMwa | Anthrobrute | character | C9SZJMPMSIoSKI67 |
| DroneHangar/Anthrodroid | btyAqEbWpT9FbmGH | Anthrodroid | character | C9SZJMPMSIoSKI67 |
| DroneHangar/Bug-Spy | 35HRFJoHgWTt3x8f | Bug-Spy | character | C9SZJMPMSIoSKI67 |
| DroneHangar/Disc | KMXnuSsA1IEnSivh | Disc | character | C9SZJMPMSIoSKI67 |
| DroneHangar/Dog-Patrol Drone | 32ejekBhTDE5cOSF | Dog-Patrol Drone | character | C9SZJMPMSIoSKI67 |
| DroneHangar/Gladiator | Kvr6pUqEwt73QXcs | Gladiator | character | C9SZJMPMSIoSKI67 |
| DroneHangar/Hawk | q3Udsyg7zovQ5FoD | Hawk | character | C9SZJMPMSIoSKI67 |
| DroneHangar/Mobile Sentinel | 1fJQnIQ76TnvqdAz | Mobile Sentinel | character | C9SZJMPMSIoSKI67 |
| DroneHangar/Orb | Fn9V6LmM5QzdLAkY | Orb | character | C9SZJMPMSIoSKI67 |
| DroneHangar/Roto-Drone | QMHLg5Nh2Qub92O5 | Roto-Drone | character | C9SZJMPMSIoSKI67 |
| DroneHangar/Shield Drone | hZummIxj1gYPgpOg | Shield Drone | character | C9SZJMPMSIoSKI67 |
| DroneHangar/Shield-Wall Drone | JOnBPPrrMCimY5wx | Shield-Wall Drone | character | C9SZJMPMSIoSKI67 |
| DroneHangar/VSTOL Bird | HK9rSt7Bw28kC91e | VSTOL Bird | character | C9SZJMPMSIoSKI67 |
| NPCs/Animals/Bear | 8S6qaeWInLOl4qc4 | Bear | character | bO6yVDTjF5UQw2ZU |
| NPCs/Animals/Cat | BWA3pls6uk73KGlq | Cat | character | bO6yVDTjF5UQw2ZU |
| NPCs/Animals/Dog | ClylecXaREys3eYe | Dog | character | bO6yVDTjF5UQw2ZU |
| NPCs/Animals/Elephant | 0uZ2brFL5XVRcPPC | Elephant | character | bO6yVDTjF5UQw2ZU |
| NPCs/Animals/Gorilla | ZItdsgolntxNF8p0 | Gorilla | character | bO6yVDTjF5UQw2ZU |
| NPCs/Animals/Hawk | AOBith7wwuUmP7VP | Hawk | character | bO6yVDTjF5UQw2ZU |
| NPCs/Animals/Horse | PF0aRBByTy67TOdS | Horse | character | bO6yVDTjF5UQw2ZU |
| NPCs/Animals/Wildcat/Panther | M1QAEppPYWtjhe1Q | Wildcat/Panther | character | bO6yVDTjF5UQw2ZU |
| NPCs/Animals/Wolf | HHSCId1xRVp5z8gw | Wolf | character | bO6yVDTjF5UQw2ZU |
| NPCs/Drones/Citizen Aid Drone (Anthrodroid) | WACnBF6xJEpVXLJW | Citizen Aid Drone (Anthrodroid) | character | w2u228ARPzSzv5YK |
| NPCs/Drones/Orb Turret (Orb) | i6aGaAYoyv5IhaMk | Orb Turret (Orb) | character | w2u228ARPzSzv5YK |
| NPCs/Drones/Stationary Turret - Autocannon | qmj9R05UI6Nfw1ep | Stationary Turret - Autocannon | character | w2u228ARPzSzv5YK |
| NPCs/Drones/Stormtrooper Drones (Anthrobrute) | 0e3viE19AKyJomoy | Stormtrooper Drones (Anthrobrute) | character | w2u228ARPzSzv5YK |
| NPCs/Drones/Talos (Gladiator) | RQKHlqg6Jh3eHUdU | Talos (Gladiator) | character | w2u228ARPzSzv5YK |
| NPCs/Goons/Mall Cop | 5owR2J5jTBBx243h | Mall Cop | character | p8IVu82dgB2UKnoT |
| NPCs/Goons/Security Personnel | ZCuiAfQTed3YgLqj | Security Personnel | character | p8IVu82dgB2UKnoT |
| NPCs/Goons/Stormtroopers | 8Jy0Egk4NFRRDPbL | Stormtroopers | character | p8IVu82dgB2UKnoT |
| NPCs/Goons/Street Cop | doukrqZ3qHeyFnGO | Street Cop | character | p8IVu82dgB2UKnoT |
| NPCs/Goons/Street Thug | KpdfJNI181fAqT3O | Street Thug | character | p8IVu82dgB2UKnoT |
| NPCs/Goons/Street Thug, Armed | uxu1jGg3oE4BSE19 | Street Thug, Armed | character | p8IVu82dgB2UKnoT |
| NPCs/Goons/Street Thug, Lieutenant | BKaLlFGTV0nrvZEm | Street Thug, Lieutenant | character | p8IVu82dgB2UKnoT |
| NPCs/Iniquitates/Alzebo | DmxBBuPGu7Qn6SYi | Alzebo | character | N3RsHmS7ZofXCTDB |
| NPCs/Iniquitates/Deodand | bdEn1g74T6R9eZCp | Deodand | character | N3RsHmS7ZofXCTDB |
| NPCs/Iniquitates/Refuse Goblins | eAvD0hNiHmKJUF1J | Refuse Goblins | character | N3RsHmS7ZofXCTDB |
| NPCs/Programs/Belligerent Engram Eradicators (Bees) | WV8ywxnHfXd7813a | Belligerent Engram Eradicators (Bees) | character | OHGJHoWG4unr64QM |
| NPCs/Programs/Defensive Daemon | vF1UCqQkxwI5Bkfp | Defensive Daemon | character | OHGJHoWG4unr64QM |
| NPCs/Programs/Reconstruct Network Integrity Daemon (RNID) | cGwZZjJycrDZeByR | Reconstruct Network Integrity Daemon (RNID) | character | OHGJHoWG4unr64QM |
| NPCs/Programs/Sensor Daemon | NDqQGQkb1BlQNDMZ | Sensor Daemon | character | OHGJHoWG4unr64QM |
| NPCs/Programs/Warrior Agent Security Patrol (Wasps) | fO0ipCs30IlbIyJn | Warrior Agent Security Patrol (Wasps) | character | OHGJHoWG4unr64QM |
| NPCs/Session Settings | U8ITLI4BCWctTKnY | Session Settings | character | p6hbQkfl32SKkvGO |
| NPCs/Spirits/Aqua Deambulatio | l3fWGM4RfBzM6mk4 | Aqua Deambulatio | character | ZMsiW2FSdQ2KSvnq |
| NPCs/Spirits/Attash Aazaar | FVj98iE0FcyVCtcx | Attash Aazaar | character | ZMsiW2FSdQ2KSvnq |
| NPCs/Spirits/Chainsaw Skeletons | L2gYl5mblmAkXz3d | Chainsaw Skeletons | character | ZMsiW2FSdQ2KSvnq |
| NPCs/Spirits/Gaoh | O4gvFyhSz0gQ37IB | Gaoh | character | ZMsiW2FSdQ2KSvnq |
| NPCs/Spirits/Ignis Dicen | t3MdfTvAFYZSM6nZ | Ignis Dicen | character | ZMsiW2FSdQ2KSvnq |
| NPCs/Spirits/Lapsae Caelum | CUlUOyrHL5YXUDmN | Lapsae Caelum | character | ZMsiW2FSdQ2KSvnq |
| NPCs/Spirits/Miasma | yY7v2ESAOGUbgQhL | Miasma | character | ZMsiW2FSdQ2KSvnq |
| NPCs/Spirits/Moryana | Yqd790UKKPn0eKfx | Moryana | character | ZMsiW2FSdQ2KSvnq |
| NPCs/Spirits/Mound of Skulls | S5HJSHyWWEI7SAGJ | Mound of Skulls | character | ZMsiW2FSdQ2KSvnq |
| NPCs/Spirits/Pacha Mama | FQDcxI8oYgbJui2Z | Pacha Mama | character | ZMsiW2FSdQ2KSvnq |
| NPCs/Spirits/Stormwing | eNG6ra9AAfbkuxuj | Stormwing | character | ZMsiW2FSdQ2KSvnq |
| NPCs/Spirits/Terra Factorem | KiwePQ0zQvozm6xC | Terra Factorem | character | ZMsiW2FSdQ2KSvnq |
| NPCs/Spirits/Zeek Electricity Spirit | msTIIV2QHErNVW1z | Zeek Electricity Spirit | character | ZMsiW2FSdQ2KSvnq |
| PCs/Crime by Day, Rave by Night | 3UvKepdZNQcxmmIe | Crime by Day, Rave by Night | character | bGGgYtFXJvPyXTLo |
| PCs/PC Sheet (duplicate & rename) | qXmqhVfZkE8eEbd6 | PC Sheet (duplicate & rename) | character | bGGgYtFXJvPyXTLo |
| PCs/PreGens/ARCHMAG | iDwCzeasOdOeW3lz | ARCHMAG | character | tlB8baeczfAB1tEw |
| PCs/PreGens/ASSASSIN | i6WYCzWY0pveTact | ASSASSIN | character | tlB8baeczfAB1tEw |
| PCs/PreGens/COVERT OPERATIVE | D5WzoYijRz7njQMS | COVERT OPERATIVE | character | tlB8baeczfAB1tEw |
| PCs/PreGens/Cybered Recon | TURaFIPLhla4F7iL | Cybered Recon | character | tlB8baeczfAB1tEw |
| PCs/PreGens/DETECTIVE | rQ9WKtl8r6sZBhdi | DETECTIVE | character | tlB8baeczfAB1tEw |
| PCs/PreGens/DRIVER | 8vzQkDQUAT7qEO2m | DRIVER | character | tlB8baeczfAB1tEw |
| PCs/PreGens/Gorilla hacker | q5cumBez1mzzRSNL | Gorilla hacker | character | tlB8baeczfAB1tEw |
| PCs/PreGens/Luci-0 | pwsZfNAdGgAvus4X | Luci-0 | character | tlB8baeczfAB1tEw |
| PCs/PreGens/MARTIAL ARTIST | 9HqlPECYxaacY01V | MARTIAL ARTIST | character | tlB8baeczfAB1tEw |
| PCs/PreGens/POP IDOL | JF5REvziVWvRoj60 | POP IDOL | character | tlB8baeczfAB1tEw |
| PCs/PreGens/Rigger Sleuth | pt3aAa7sgQZv3xsy | Rigger Sleuth | character | tlB8baeczfAB1tEw |
| PCs/PreGens/Vamp Face | UwUS1iZD5q7M0ggU | Vamp Face | character | tlB8baeczfAB1tEw |
| PCs/PreGens/WASTELAND MAGE | eMIR1Wvxh4VxXWES | WASTELAND MAGE | character | tlB8baeczfAB1tEw |
| PCs/TestSpell | eMbezua6UThIStwT | TestSpell | character | bGGgYtFXJvPyXTLo |
| Templates/Brand Template | uI4SrMJ9fuLk7UN0 | Brand Template | _template | eJiZ5ojJouMYFr9R |
| Templates/Drone Template | lL9MiN64F7mRGhuj | Drone Template | _template | eJiZ5ojJouMYFr9R |
| Templates/Session Settings Template | DubVcAsia226PlV0 | Session Settings Template | _template | eJiZ5ojJouMYFr9R |
| Templates/Sinless NPC | 694838d341f4407b | Sinless NPC | _template | eJiZ5ojJouMYFr9R |
| Templates/Sinless PC | 409875cd45a544c0 | Sinless PC | _template | eJiZ5ojJouMYFr9R |
| Templates/Sinless PC (Copy) | OXKxlTnNPzmAbRn2 | Sinless PC (Copy) | _template | eJiZ5ojJouMYFr9R |
| Templates/Vehicle Template | 9YbyOSIZBhfekbLK | Vehicle Template | _template | eJiZ5ojJouMYFr9R |
| VehicleHangar/Armored Car | YrcHYiZz2DClrx73 | Armored Car | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Battle Cycle | gMuob9Zc3oQMJL5t | Battle Cycle | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Cargo Heli | E1wseQJRW9U60tPV | Cargo Heli | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Chopper | VYIuxgZfPk6cmEDl | Chopper | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Delivery Van | 49b7xlC8WpfdAm6V | Delivery Van | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Family Sedan | kgW5UuRTN9aVJQLO | Family Sedan | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Limo | bIItnnGuiSDXOTGF | Limo | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Luxury Sedan | 9IxyUuPhLM41J1K9 | Luxury Sedan | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Luxury Van | zoWqMukGSFHMTslC | Luxury Van | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Motorcycle | x1fpvHM6WLE7B3R7 | Motorcycle | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Nightwing | ahGHLlVgXRWFMKCO | Nightwing | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Patrol Boat | dHLNbMrpXPNXoTJU | Patrol Boat | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Pickup | CQuecuTEcXCQ9U19 | Pickup | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Racing Bike | pZvqrFWKnqyFClRU | Racing Bike | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Seaplane | 3oi9ZXxABUPPPdkc | Seaplane | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Skate | HdkLKHrN5N6l0lSL | Skate | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Small Boat | vEev6mqgzdeNRqei | Small Boat | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Speedboat | zDoAsiN3JeWwuvnl | Speedboat | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Sports Car | zPjI6U6SqDotTVmI | Sports Car | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Sports Sedan | LAY2VmmdyyuyMLRa | Sports Sedan | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Transport Heli | 6ZaXDQU7FcPyh3Kg | Transport Heli | character | I8VLhxriauMW5wH0 |
| VehicleHangar/Two-Seater | Cr8G5z5z7R6gikRB | Two-Seater | character | I8VLhxriauMW5wH0 |

## Items - Tree
- [FOLDER] CSB - Embedded Items Folder - DO NOT RENAME OR REMOVE {id:rCTnl7myqTtxE5gl, parent:null, depth:0, path:"CSB - Embedded Items Folder - DO NOT RENAME OR REMOVE"}
- [FOLDER] Weapons {id:l7jcqzFSJr3Qemeu, parent:null, depth:0, path:"Weapons"}
  - [FOLDER] Melee {id:aHRmcytEr2emGb1Y, parent:l7jcqzFSJr3Qemeu, depth:1, path:"Weapons/Melee"}
    - [ITEM] Arm-Blades {id:0daOJGQ48dXnHZZa, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Axe {id:BTW4PyIim7prBcFE, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Baton {id:lH75H9fJrqbo5Z2r, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Brass Knuckles {id:4ZCs36PxolFYXO14, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Cudgel {id:accqdYWCGWA6nDEW, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Iron Fist (Amp) {id:degDSYZ7eHq0PLlw, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Katana {id:nwhegwvxSNdLg9d1, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Knife {id:GlwaJ3s2mcJ8ePV9, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Monofilament Whip {id:FGjswkp0rdvBToet, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Plasma Axe {id:HrhTRoAFwRLdDA3s, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Plasma Sword {id:2i5n6ftVc1kAeuVp, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Polearm {id:bpqgdDGmy6sUhMjM, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Power Fist {id:iitakviAjKbnUk89, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Sickstick {id:6qCMcLsrUfUcZMEn, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Staff {id:kSVBE0zHnrlsOybT, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Stun Baton {id:lqVM9pAttbThHlQ0, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Sword {id:4ywbbdZWhPkxPscf, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Vibroaxe {id:Xh0YY8FoHfTksUTL, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
    - [ITEM] Vibrosword {id:eDo0cyA310ehtqu0, type:equippableItem, folderId:aHRmcytEr2emGb1Y}
  - [FOLDER] Thrown {id:rpm8CmOJ32570KoC, parent:l7jcqzFSJr3Qemeu, depth:1, path:"Weapons/Thrown"}
    - [ITEM] Explosive Grenade {id:l5AGZbNMPAsfNhUM, type:equippableItem, folderId:rpm8CmOJ32570KoC}
    - [ITEM] Incendiary Grenade {id:ifQfoPyLKRbY9tic, type:equippableItem, folderId:rpm8CmOJ32570KoC}
    - [ITEM] Knife {id:2Y7bqp8oi16DoAAy, type:equippableItem, folderId:rpm8CmOJ32570KoC}
    - [ITEM] Shock Grenade {id:9GvjupjpEfsoK0iZ, type:equippableItem, folderId:rpm8CmOJ32570KoC}
    - [ITEM] Shuriken {id:3KE2WlZwBRFGUmb1, type:equippableItem, folderId:rpm8CmOJ32570KoC}
    - [ITEM] Smoke Grenade {id:ArS7o2qlHKKBMEnq, type:equippableItem, folderId:rpm8CmOJ32570KoC}
  - [FOLDER] Projectile {id:9kmoBQyRvIQEoTi1, parent:l7jcqzFSJr3Qemeu, depth:1, path:"Weapons/Projectile"}
    - [ITEM] Compound Bow {id:8CBpDFpd7hMOxStt, type:equippableItem, folderId:9kmoBQyRvIQEoTi1}
    - [ITEM] Light Crossbow {id:FrfP5RFJPkTIF2zN, type:equippableItem, folderId:9kmoBQyRvIQEoTi1}
    - [ITEM] Crossbow {id:WB3YQ6dJoAvis6xp, type:equippableItem, folderId:9kmoBQyRvIQEoTi1}
    - [ITEM] Heavy Crossbow {id:OVi2ocSSjHJRtwKi, type:equippableItem, folderId:9kmoBQyRvIQEoTi1}
  - [FOLDER] Firearms {id:5KWDwkU23whetOIV, parent:l7jcqzFSJr3Qemeu, depth:1, path:"Weapons/Firearms"}
    - [ITEM] 450 Tek-Urban {id:GFmWuFB6xJb7arB7, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] Defender {id:iPJklFqcxXQnpixG, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] DV-662 Devotion {id:YKwbzBeRrnfrS9Zz, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] Hardliner {id:ffPDvZYRKOHN590W, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] Highwayman {id:L9Hlqu934i6AKgv6, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] Ironbark SMT {id:KHE8xKFdz5m1mlUP, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] Kaos-9x {id:kMSGhNzJlURbWBpW, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] KL-.89 Klaw {id:lpRyorx71E3kFHKF, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] Reaper {id:Rbrsv9QfRM6o4IxF, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] Ripper {id:6EXDTul4GijPoeeG, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] S-U Epsilon 'Sunshine' {id:NPEOlxwi2waNG2FE, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] Sentinel {id:bosPZcSjee0l9ZWG, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] Slimline Defender {id:wFCxw3ImuSKXPOIM, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] Syncsight Hunter {id:xa7tHLKTrGmQIcwd, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] Tiger Beat {id:BxYCAIPNbh6CIVSp, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] TRGT-9 "Target" {id:3u6oWFldM7Nv7n5t, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] V-100 Vigilant {id:FZlN9lqdBemx6Gf8, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] Viper {id:Wn66N0hrwd7LmQpE, type:equippableItem, folderId:5KWDwkU23whetOIV}
    - [ITEM] Warhammer H40mm-ER {id:NOcsV7VXP4o0ck0k, type:equippableItem, folderId:5KWDwkU23whetOIV}
  - [FOLDER] Energy {id:fFGfPC4Uqyeabnvo, parent:l7jcqzFSJr3Qemeu, depth:1, path:"Weapons/Energy"}
    - [ITEM] Neon Fang {id:DVSf33GWdiNKYoD5, type:equippableItem, folderId:fFGfPC4Uqyeabnvo}
    - [ITEM] Photon Reaver Ei-7 {id:n5dCqzXOOBOTEgkH, type:equippableItem, folderId:fFGfPC4Uqyeabnvo}
    - [ITEM] Thunderbolt Vanguard {id:5iMNTMh5UCx0ushc, type:equippableItem, folderId:fFGfPC4Uqyeabnvo}
- [FOLDER] Decking {id:2idKfyaV1KZVqL6V, parent:null, depth:0, path:"Decking"}
  - [FOLDER] Cyberdecks {id:TpyOdo9rRmcJZwT2, parent:2idKfyaV1KZVqL6V, depth:1, path:"Decking/Cyberdecks"}
    - [ITEM] MasterDeck {id:tn1WVRqrAoPCjIWp, type:equippableItem, folderId:TpyOdo9rRmcJZwT2}
    - [ITEM] Shingo Activa {id:jguZaaNdVKo7bs7q, type:equippableItem, folderId:TpyOdo9rRmcJZwT2}
    - [ITEM] Semi Point Razor {id:rZ6vcAquAxsVA8dg, type:equippableItem, folderId:TpyOdo9rRmcJZwT2}
    - [ITEM] Mars Claymore {id:fzQqP7oUYtJb8rHo, type:equippableItem, folderId:TpyOdo9rRmcJZwT2}
    - [ITEM] Fujitsu Edge {id:EXplZQVrK4Iuq2Cs, type:equippableItem, folderId:TpyOdo9rRmcJZwT2}
    - [ITEM] Orb Epsilon {id:DD5aVFTQACYYq90Q, type:equippableItem, folderId:TpyOdo9rRmcJZwT2}
    - [ITEM] Orpheus Dreamweaver {id:zAzoB1sPvfjonoAo, type:equippableItem, folderId:TpyOdo9rRmcJZwT2}
    - [ITEM] Royal Durandal {id:PunQ75zoS4ML4Lt0, type:equippableItem, folderId:TpyOdo9rRmcJZwT2}
  - [FOLDER] Hacking Threads {id:92dSVkunMksoE7g2, parent:2idKfyaV1KZVqL6V, depth:1, path:"Decking/Hacking Threads"}
    - [ITEM] Alert Monitor {id:CRfCfHczDcdxvQG7, type:equippableItem, folderId:92dSVkunMksoE7g2}
    - [ITEM] Crack Encryption {id:K68bkQAH3YKDUtXO, type:equippableItem, folderId:92dSVkunMksoE7g2}
    - [ITEM] Decoy {id:PpNXIX1skyoL0TUd, type:equippableItem, folderId:92dSVkunMksoE7g2}
    - [ITEM] Electric Strike {id:2IYdU2FRR7FrlnCZ, type:equippableItem, folderId:92dSVkunMksoE7g2}
    - [ITEM] Emotional Influence {id:DHu7KLrwWwZrhsYw, type:equippableItem, folderId:92dSVkunMksoE7g2}
    - [ITEM] Encrypt File {id:gtZmJ4A2HHiiCa3t, type:equippableItem, folderId:92dSVkunMksoE7g2}
    - [ITEM] Ghost Protocol {id:TbZIiS4wj4ebQr3v, type:equippableItem, folderId:92dSVkunMksoE7g2}
    - [ITEM] Shadow Protocols {id:dmVJnyLDngBKpJCJ, type:equippableItem, folderId:92dSVkunMksoE7g2}
    - [ITEM] Situational Advantage {id:qqUde7IByVn3p8fg, type:equippableItem, folderId:92dSVkunMksoE7g2}
    - [ITEM] Sonic Sickness {id:vn6vAJjPvYlkvHdb, type:equippableItem, folderId:92dSVkunMksoE7g2}
    - [ITEM] Universal Translator {id:RcFycLrZJN8Cp0BO, type:equippableItem, folderId:92dSVkunMksoE7g2}
    - [ITEM] Vent Gas {id:vvfsVWv2MAqEncOz, type:equippableItem, folderId:92dSVkunMksoE7g2}
  - [FOLDER] E War Threads {id:FBqDldU0lm0kCoRQ, parent:2idKfyaV1KZVqL6V, depth:1, path:"Decking/E War Threads"}
    - [ITEM] Acid Burn {id:RtvBoN5fIK9yC9mU, type:equippableItem, folderId:FBqDldU0lm0kCoRQ}
    - [ITEM] Analysis Locus {id:I9QQRZWWtVSvIQ3Z, type:equippableItem, folderId:FBqDldU0lm0kCoRQ}
    - [ITEM] Corrupt IFF {id:DZYaFjVnnjOzRTj4, type:equippableItem, folderId:FBqDldU0lm0kCoRQ}
    - [ITEM] De-Rez {id:FQmvFTag1EMZwk94, type:equippableItem, folderId:FBqDldU0lm0kCoRQ}
    - [ITEM] Device Control {id:EZPyN7GodhwHFB0G, type:equippableItem, folderId:FBqDldU0lm0kCoRQ}
    - [ITEM] Hypnotic Projection {id:Qbp5AmTBLPIWvHK0, type:equippableItem, folderId:FBqDldU0lm0kCoRQ}
    - [ITEM] Refraction Field {id:7IRs6MwcbyHAALRp, type:equippableItem, folderId:FBqDldU0lm0kCoRQ}
    - [ITEM] Targeted Disruption {id:FQj1PGA1AKF4pfvZ, type:equippableItem, folderId:FBqDldU0lm0kCoRQ}
    - [ITEM] Vermin Call {id:oRz0KfIjh0V4CbbD, type:equippableItem, folderId:FBqDldU0lm0kCoRQ}
- [FOLDER] Rigging {id:bRI78s2WG6gVDJ4C, parent:null, depth:0, path:"Rigging"}
  - [FOLDER] VCR {id:d3QnO994LfRud9yy, parent:bRI78s2WG6gVDJ4C, depth:1, path:"Rigging/VCR"}
    - [ITEM] Basic VCR {id:LscCW4itUp2kDBcW, type:equippableItem, folderId:d3QnO994LfRud9yy}
    - [ITEM] Advanced VCR {id:CEbtVznH20MTfOMq, type:equippableItem, folderId:d3QnO994LfRud9yy}
    - [ITEM] Master VCR {id:9KGkTsyVjFvsGlQB, type:equippableItem, folderId:d3QnO994LfRud9yy}
  - [FOLDER] Drones {id:DswGzl1e1TynhREL, parent:bRI78s2WG6gVDJ4C, depth:1, path:"Rigging/Drones"}
    - [ITEM] Aerial Warden {id:j2TO3k0UCvhq0zMp, type:equippableItem, folderId:DswGzl1e1TynhREL}
    - [ITEM] Anthrobrute {id:Cmiv9ISEWVXlfIep, type:equippableItem, folderId:DswGzl1e1TynhREL}
    - [ITEM] Anthrodroid {id:O1BeA1bQVwldwFjM, type:equippableItem, folderId:DswGzl1e1TynhREL}
    - [ITEM] Bug-Spy {id:sHUxTiNfIMWKLLpU, type:equippableItem, folderId:DswGzl1e1TynhREL}
    - [ITEM] Disc {id:88t9RA3Lr03dK5FA, type:equippableItem, folderId:DswGzl1e1TynhREL}
    - [ITEM] Dog-Patrol Drone {id:NTIuILjbu1ZRXzdO, type:equippableItem, folderId:DswGzl1e1TynhREL}
    - [ITEM] Gladiator {id:7UnpG6sa1ERc4quJ, type:equippableItem, folderId:DswGzl1e1TynhREL}
    - [ITEM] Hawk {id:juM3IWGwmAWwNsNU, type:equippableItem, folderId:DswGzl1e1TynhREL}
    - [ITEM] Mobile Sentinel {id:O7LxMs1Xzm3zR6cd, type:equippableItem, folderId:DswGzl1e1TynhREL}
    - [ITEM] Orb {id:IWWXsOuVPxSJzFTd, type:equippableItem, folderId:DswGzl1e1TynhREL}
    - [ITEM] Roto-Drone {id:noRkOeDYXhGrqcw6, type:equippableItem, folderId:DswGzl1e1TynhREL}
    - [ITEM] Shield Drone {id:N0nGXBPq2IZtEQhK, type:equippableItem, folderId:DswGzl1e1TynhREL}
    - [ITEM] Shield-Wall Drone {id:4yjS4jBEs3quNMix, type:equippableItem, folderId:DswGzl1e1TynhREL}
    - [ITEM] VSTOL Bird {id:M7So1h7MRAT1YZg6, type:equippableItem, folderId:DswGzl1e1TynhREL}
  - [FOLDER] Vehicles {id:ic8w75E9GFrktS4x, parent:bRI78s2WG6gVDJ4C, depth:1, path:"Rigging/Vehicles"}
    - [ITEM] Armored Car {id:iF76z6HNwoe7KFDM, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Battle Cycle {id:Lbykgev8L1eM42l2, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Cargo Heli {id:pVrVqEfRZYveTYqx, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Chopper {id:CnzRIbXniQf9JF3q, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Delivery Van {id:CbUwPb2OlX1tVQO8, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Family Sedan {id:IcoAJ9g1kdBLfNgP, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Limo {id:SKhFtaxNq8qNDBBg, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Luxury Sedan {id:szksglBlzFRLHTcL, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Luxury Van {id:YjAu5xvT1EctHL3f, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Motorcycle {id:c2M82No6wNHg2rjr, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Nightwing {id:Ia1ZF9O89cNtK8v9, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Patrol Boat {id:SqYhlebJcOUP0JOG, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Pickup {id:UqPgsRmU7wP6CJFr, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Racing Bike {id:Z1Yju9ro1qZ6tiKM, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Seaplane {id:3wxbKv1qbF78RPiZ, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Seaplane {id:sB4bCmeH6O5UgRC6, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Skate {id:6ne6fzg1iDEfs4Ml, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Small Boat {id:vNwPr9TXEX6ocKpd, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Speedboat {id:truw72AdxFdTcjbK, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Sports Car {id:v5eSV1dG8L5hVWiM, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Sports Sedan {id:vzsVDNUQTQPnqmAx, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Transport Heli {id:VTACzqAhjIWQaMEB, type:equippableItem, folderId:ic8w75E9GFrktS4x}
    - [ITEM] Two-Seater {id:0f6uWLCvtOmijcT8, type:equippableItem, folderId:ic8w75E9GFrktS4x}
  - [FOLDER] Drive / Fly Skills {id:wpNVoTaalbsoL0Lv, parent:bRI78s2WG6gVDJ4C, depth:1, path:"Rigging/Drive / Fly Skills"}
    - [ITEM] Drive Test {id:XeDvGfyyLWIV3W6d, type:equippableItem, folderId:wpNVoTaalbsoL0Lv}
    - [ITEM] Fly Test {id:9r3BqvpSWhMDaOea, type:equippableItem, folderId:wpNVoTaalbsoL0Lv}
    - [ITEM] OverDrive {id:D2MVrqrWzJz1gzHi, type:equippableItem, folderId:wpNVoTaalbsoL0Lv}
    - [ITEM] OverFly {id:osyORzOHrscc27l5, type:equippableItem, folderId:wpNVoTaalbsoL0Lv}
  - [FOLDER] Drone Weapons {id:Ts6jM2x9mZugV8R4, parent:bRI78s2WG6gVDJ4C, depth:1, path:"Rigging/Drone Weapons"}
    - [ITEM] Autocannon {id:pgnn8Bj8C1NwNani, type:equippableItem, folderId:Ts6jM2x9mZugV8R4}
    - [ITEM] Dazzleray {id:cUyOhkMFHDKJaoTv, type:equippableItem, folderId:Ts6jM2x9mZugV8R4}
    - [ITEM] Grenade Launcher {id:qqR35Es8BrDxGtdN, type:equippableItem, folderId:Ts6jM2x9mZugV8R4}
    - [ITEM] Heavy Swell {id:VlKxbR4O9PAjKPlt, type:equippableItem, folderId:Ts6jM2x9mZugV8R4}
    - [ITEM] Mini gun {id:UjON0AYL52oPkkV1, type:equippableItem, folderId:Ts6jM2x9mZugV8R4}
    - [ITEM] Missile Launcher {id:w5YJ9JQJ7RZoEYoR, type:equippableItem, folderId:Ts6jM2x9mZugV8R4}
    - [ITEM] Oil Slick {id:eNdj5MZgMVFb6RuU, type:equippableItem, folderId:Ts6jM2x9mZugV8R4}
    - [ITEM] Particle Projectile Cannon {id:PpC6UAT4zduBN1JO, type:equippableItem, folderId:Ts6jM2x9mZugV8R4}
    - [ITEM] Pulse Minigun {id:vTQqSWLjjgrjOWNo, type:equippableItem, folderId:Ts6jM2x9mZugV8R4}
    - [ITEM] Pulse Rifle {id:ym0IkelGLpxsvuI9, type:equippableItem, folderId:Ts6jM2x9mZugV8R4}
    - [ITEM] Railgun {id:qsCaLt48mRGOee5a, type:equippableItem, folderId:Ts6jM2x9mZugV8R4}
    - [ITEM] Recoilless Gun {id:dwlzDpgJn2neQNoH, type:equippableItem, folderId:Ts6jM2x9mZugV8R4}
    - [ITEM] Recoilless Rifle {id:TsowecCMZQ6f430o, type:equippableItem, folderId:Ts6jM2x9mZugV8R4}
    - [ITEM] Sentry Gun {id:X1212y9y0s2goiHv, type:equippableItem, folderId:Ts6jM2x9mZugV8R4}
    - [ITEM] Smokescreen {id:6uAvCA8vSKXWrCoO, type:equippableItem, folderId:Ts6jM2x9mZugV8R4}
    - [ITEM] Sonic Disruption {id:RN9PjdKiUr8W2tiL, type:equippableItem, folderId:Ts6jM2x9mZugV8R4}
  - [FOLDER] Vehicle Weapons {id:17SxKReYD26TEIrd, parent:bRI78s2WG6gVDJ4C, depth:1, path:"Rigging/Vehicle Weapons"}
    - [ITEM] 25mm Cannon {id:AOzKYI8tzM42kLgc, type:equippableItem, folderId:17SxKReYD26TEIrd}
    - [ITEM] 30mm Cannon {id:bbz11AaRqOPO81U0, type:equippableItem, folderId:17SxKReYD26TEIrd}
    - [ITEM] Autocannons {id:ykFPEIiHMrOI37CP, type:equippableItem, folderId:17SxKReYD26TEIrd}
    - [ITEM] Machine Guns {id:xP2eZsJJHNzoVAPS, type:equippableItem, folderId:17SxKReYD26TEIrd}
    - [ITEM] Missile Launcher {id:2ePOa0yQDvIUycaz, type:equippableItem, folderId:17SxKReYD26TEIrd}
    - [ITEM] Oil Slick {id:GumvtgZjJAiTLSvS, type:equippableItem, folderId:17SxKReYD26TEIrd}
    - [ITEM] Particle Projection Cannon {id:9TZCWyKWwDZPmGzQ, type:equippableItem, folderId:17SxKReYD26TEIrd}
    - [ITEM] Plasma Cannons {id:7QVxicRmXZLS4HNk, type:equippableItem, folderId:17SxKReYD26TEIrd}
    - [ITEM] Pulse Cannon {id:pP9E1ZOT9RBk5xwe, type:equippableItem, folderId:17SxKReYD26TEIrd}
    - [ITEM] Railgun {id:0ypLeyA8IH9bQUzZ, type:equippableItem, folderId:17SxKReYD26TEIrd}
    - [ITEM] Rocket Propelled Grenade Launcher {id:lulF2OYD9eevBZ8v, type:equippableItem, folderId:17SxKReYD26TEIrd}
    - [ITEM] Tactical Tsunami {id:ZwGjyDbtc10lzfqt, type:equippableItem, folderId:17SxKReYD26TEIrd}
    - [ITEM] Tank Cannon {id:Sw5LolCVrO7vGX75, type:equippableItem, folderId:17SxKReYD26TEIrd}
    - [ITEM] Vulcan Cannon {id:zU4IZrnZmb7Mmxc3, type:equippableItem, folderId:17SxKReYD26TEIrd}
- [FOLDER] Manon {id:oWRM8pNMOUkbZHoV, parent:null, depth:0, path:"Manon"}
  - [FOLDER] Sorcery {id:fzpbw6RIBAzBp9kN, parent:oWRM8pNMOUkbZHoV, depth:1, path:"Manon/Sorcery"}
    - [FOLDER] Astral Umbra {id:6OffBG8bkUnp7Ixf, parent:fzpbw6RIBAzBp9kN, depth:2, path:"Manon/Sorcery/Astral Umbra"}
      - [ITEM] Black Bolt of Uthal {id:wMZ6hE3wNGN1pidi, type:equippableItem, folderId:6OffBG8bkUnp7Ixf}
      - [ITEM] Cloak of Night {id:gEakhlOVhvXvAXHC, type:equippableItem, folderId:6OffBG8bkUnp7Ixf}
      - [ITEM] Create Darkenbeast {id:udPmRpLEYBuiPawZ, type:equippableItem, folderId:6OffBG8bkUnp7Ixf}
      - [ITEM] Dire Touch of Ennui {id:tZvdDTKB020lN7Rd, type:equippableItem, folderId:6OffBG8bkUnp7Ixf}
      - [ITEM] Evocation of the Frail Beam of Debility {id:jRZ2bN2LcV7UCJZr, type:equippableItem, folderId:6OffBG8bkUnp7Ixf}
      - [ITEM] Horrors of the Unknown Dark {id:4cKQxb6BJNmXLLBF, type:equippableItem, folderId:6OffBG8bkUnp7Ixf}
      - [ITEM] Moment of Eclipse {id:zHCnZBzRIRRQeuxn, type:equippableItem, folderId:6OffBG8bkUnp7Ixf}
      - [ITEM] Night's Chill {id:RFR0w21azVr0RKzE, type:equippableItem, folderId:6OffBG8bkUnp7Ixf}
      - [ITEM] Shadow Anchor {id:qOZpEsrQZXMFzOFG, type:equippableItem, folderId:6OffBG8bkUnp7Ixf}
      - [ITEM] Shadow Path of Vile Ether {id:M1Sq9cOCQqk3QZpy, type:equippableItem, folderId:6OffBG8bkUnp7Ixf}
      - [ITEM] Sorcery of the Wraith's Flight {id:hch7HYXSTsyIQZLG, type:equippableItem, folderId:6OffBG8bkUnp7Ixf}
      - [ITEM] The Marvelous Cursed Sigil of Athozog {id:fIUfZv7WoVVS98vS, type:equippableItem, folderId:6OffBG8bkUnp7Ixf}
      - [ITEM] The Serene Conjuration of Ehon's Gate {id:JLUfuvXTmCKQBKdK, type:equippableItem, folderId:6OffBG8bkUnp7Ixf}
      - [ITEM] The Thirty Cursed Servant of Athozog {id:7sh0HvJFqJZEUj1H, type:equippableItem, folderId:6OffBG8bkUnp7Ixf}
      - [ITEM] The Uncountable Tendrils of Ehon {id:vaom688y77coLKF5, type:equippableItem, folderId:6OffBG8bkUnp7Ixf}
    - [FOLDER] Auralurgy {id:v0lGsMbGnlKF7Dvi, parent:fzpbw6RIBAzBp9kN, depth:2, path:"Manon/Sorcery/Auralurgy"}
      - [ITEM] Chant of Dire Malady {id:iOFEgVhP1YVeuKd6, type:equippableItem, folderId:v0lGsMbGnlKF7Dvi}
      - [ITEM] Forbidden Glamour of Accord {id:zv2KSMaHLwY4ZncN, type:equippableItem, folderId:v0lGsMbGnlKF7Dvi}
      - [ITEM] Rune of the Unspeakable Alarm {id:50m5hoClUIYxbKkl, type:equippableItem, folderId:v0lGsMbGnlKF7Dvi}
      - [ITEM] Rune of Vicious Rage and Sorrow {id:GCm0ZGlyLdCKeZZ1, type:equippableItem, folderId:v0lGsMbGnlKF7Dvi}
      - [ITEM] The Ancestral Working of the Savage Peal {id:AYdqDQdbW2xk12R2, type:equippableItem, folderId:v0lGsMbGnlKF7Dvi}
      - [ITEM] The Blessed Chime of Glorious Release {id:VVG0Ued9MRUNISkr, type:equippableItem, folderId:v0lGsMbGnlKF7Dvi}
      - [ITEM] The Charm of Raucous Cacophony {id:B0D2Rb9oVfc0wmfz, type:equippableItem, folderId:v0lGsMbGnlKF7Dvi}
      - [ITEM] The Confounding Rhythms of Dire Doom {id:cqyctWPyXciS2MCX, type:equippableItem, folderId:v0lGsMbGnlKF7Dvi}
      - [ITEM] The Horrid Call of Za'lota {id:ArZu3vnqew24kDCZ, type:equippableItem, folderId:v0lGsMbGnlKF7Dvi}
      - [ITEM] The Infinite Illusion of Spiritual Separation {id:47cvrcCNzQgFv0zJ, type:equippableItem, folderId:v0lGsMbGnlKF7Dvi}
      - [ITEM] The Seven Chimes of Forceful Approbation {id:KLtQFOnEufzeequ6, type:equippableItem, folderId:v0lGsMbGnlKF7Dvi}
    - [FOLDER] Incantor {id:m0jRApcb3Al3Dh3t, parent:fzpbw6RIBAzBp9kN, depth:2, path:"Manon/Sorcery/Incantor"}
      - [ITEM] Create Barrier {id:F7nnEgp2BFrAZoM6, type:equippableItem, folderId:m0jRApcb3Al3Dh3t}
      - [ITEM] Disguise Astral Aura {id:z4j0meQXdN4UbjCf, type:equippableItem, folderId:m0jRApcb3Al3Dh3t}
      - [ITEM] Flight {id:peYTrrhtyPX936nQ, type:equippableItem, folderId:m0jRApcb3Al3Dh3t}
      - [ITEM] Haste {id:z03u4RkWUT6reu5I, type:equippableItem, folderId:m0jRApcb3Al3Dh3t}
      - [ITEM] Light {id:1BguZDRzlB2HOsFJ, type:equippableItem, folderId:m0jRApcb3Al3Dh3t}
      - [ITEM] Manon Ball {id:PLhpz890RUQlN9sE, type:equippableItem, folderId:m0jRApcb3Al3Dh3t}
      - [ITEM] Manon Bolt {id:rfBenAJCXNSu17pw, type:equippableItem, folderId:m0jRApcb3Al3Dh3t}
      - [ITEM] Mind Link {id:kbJJyKSyb1SbSOn0, type:equippableItem, folderId:m0jRApcb3Al3Dh3t}
      - [ITEM] Power Bolt {id:9g8k9hws9BxlMQfy, type:equippableItem, folderId:m0jRApcb3Al3Dh3t}
      - [ITEM] Powerball {id:obioXfChLEoIVQXV, type:equippableItem, folderId:m0jRApcb3Al3Dh3t}
      - [ITEM] Shatter Ward {id:5PvxPeY9H49oYW14, type:equippableItem, folderId:m0jRApcb3Al3Dh3t}
    - [FOLDER] Mentalism {id:xuhgaKb2rgkuMPKA, parent:fzpbw6RIBAzBp9kN, depth:2, path:"Manon/Sorcery/Mentalism"}
      - [ITEM] Calm {id:odnghuR7oBmKEWJa, type:equippableItem, folderId:xuhgaKb2rgkuMPKA}
      - [ITEM] Charm {id:d0Wgmxh6GljCq4XU, type:equippableItem, folderId:xuhgaKb2rgkuMPKA}
      - [ITEM] Command {id:RAPZeJUn661k06e9, type:equippableItem, folderId:xuhgaKb2rgkuMPKA}
      - [ITEM] Confusion {id:7nqFvtjO5Pf1m3Gd, type:equippableItem, folderId:xuhgaKb2rgkuMPKA}
      - [ITEM] Despair {id:wxb9bpvoT2BdRvrq, type:equippableItem, folderId:xuhgaKb2rgkuMPKA}
      - [ITEM] Ensorcell {id:UJjEzGPHGOJeqErU, type:equippableItem, folderId:xuhgaKb2rgkuMPKA}
      - [ITEM] Enthrall {id:lEeAuuYtXSf2Jn37, type:equippableItem, folderId:xuhgaKb2rgkuMPKA}
      - [ITEM] Forget {id:eco8hS4iYlOx00lF, type:equippableItem, folderId:xuhgaKb2rgkuMPKA}
      - [ITEM] Fumble {id:9dUEsX7OZDbNiXRF, type:equippableItem, folderId:xuhgaKb2rgkuMPKA}
      - [ITEM] Geas {id:udIyuyFgrSpIZlx2, type:equippableItem, folderId:xuhgaKb2rgkuMPKA}
      - [ITEM] Hold {id:NDFOBjYGbBQrQlEX, type:equippableItem, folderId:xuhgaKb2rgkuMPKA}
      - [ITEM] Insight {id:JbZ0mgTnnmqgOEXQ, type:equippableItem, folderId:xuhgaKb2rgkuMPKA}
      - [ITEM] Laughter {id:o88LZmyWafqXeU37, type:equippableItem, folderId:xuhgaKb2rgkuMPKA}
      - [ITEM] Suggestion {id:phYaJHE7fxQa9g2h, type:equippableItem, folderId:xuhgaKb2rgkuMPKA}
      - [ITEM] Taunt {id:izJCGVgmpCWuPgsJ, type:equippableItem, folderId:xuhgaKb2rgkuMPKA}
    - [FOLDER] The Bound {id:Fi8plai5LkNJGnNE, parent:fzpbw6RIBAzBp9kN, depth:2, path:"Manon/Sorcery/The Bound"}
      - [ITEM] Blight {id:ivbEv26WTcjIN88i, type:equippableItem, folderId:Fi8plai5LkNJGnNE}
      - [ITEM] Bound Servant {id:jogoGLJrueqF2lbl, type:equippableItem, folderId:Fi8plai5LkNJGnNE}
      - [ITEM] Fiery Lash {id:oIIOVJ8IdLpV1FTr, type:equippableItem, folderId:Fi8plai5LkNJGnNE}
      - [ITEM] Fires of the Earth {id:jXFqAXjCahwFNZBu, type:equippableItem, folderId:Fi8plai5LkNJGnNE}
      - [ITEM] Firestorm {id:YGvvpLokF7dHnu8w, type:equippableItem, folderId:Fi8plai5LkNJGnNE}
      - [ITEM] Grasp of Spring {id:YQnYwSjfBK2crsmh, type:equippableItem, folderId:Fi8plai5LkNJGnNE}
      - [ITEM] Healing {id:B0g2y4CAVtIohOpM, type:equippableItem, folderId:Fi8plai5LkNJGnNE}
      - [ITEM] Lightning Strike {id:UqxfotlqKznC1GJh, type:equippableItem, folderId:Fi8plai5LkNJGnNE}
      - [ITEM] Massage the Bones of the Earth {id:fUzFacKdgJTfkbrW, type:equippableItem, folderId:Fi8plai5LkNJGnNE}
      - [ITEM] Natural Fury {id:HYkym6OvMFX7OTE0, type:equippableItem, folderId:Fi8plai5LkNJGnNE}
      - [ITEM] Shapeshift {id:9CehX0nF2LRIAH9A, type:equippableItem, folderId:Fi8plai5LkNJGnNE}
      - [ITEM] Summon Elemental {id:quYSnPS1X9CvpznC, type:equippableItem, folderId:Fi8plai5LkNJGnNE}
  - [FOLDER] Conjuring {id:6whq1Osyvu4GSURS, parent:oWRM8pNMOUkbZHoV, depth:1, path:"Manon/Conjuring"}
    - [FOLDER] Spirit Maps {id:aHvlIdpJNdmTmDRg, parent:6whq1Osyvu4GSURS, depth:2, path:"Manon/Conjuring/Spirit Maps"}
      - [ITEM] Shaman Spirit Map {id:yrkX7EvtmlE2n2ML, type:equippableItem, folderId:aHvlIdpJNdmTmDRg}
    - [FOLDER] Spirits (Shaman) {id:JrXjUPTbu2Jj2AuN, parent:6whq1Osyvu4GSURS, depth:2, path:"Manon/Conjuring/Spirits (Shaman)"}
      - [ITEM] Aqua Deambulatio {id:E5OWiUE5QpLNlGcE, type:equippableItem, folderId:JrXjUPTbu2Jj2AuN}
      - [ITEM] Attash Aazaar {id:0PP8kolvMwJhJNKD, type:equippableItem, folderId:JrXjUPTbu2Jj2AuN}
      - [ITEM] Gaoh {id:Sb06F76Od5OntLAp, type:equippableItem, folderId:JrXjUPTbu2Jj2AuN}
      - [ITEM] Ignis Dicen {id:Lt71JzIxenESP1pO, type:equippableItem, folderId:JrXjUPTbu2Jj2AuN}
      - [ITEM] Lapsae Caelum {id:aJR54vvHU7ifcT3x, type:equippableItem, folderId:JrXjUPTbu2Jj2AuN}
      - [ITEM] Miasma {id:sDW8RKaqw20LJgZr, type:equippableItem, folderId:JrXjUPTbu2Jj2AuN}
      - [ITEM] Moryana {id:TEKGswwJx0xK6yrE, type:equippableItem, folderId:JrXjUPTbu2Jj2AuN}
      - [ITEM] Mound of Skulls {id:lb99tCjEOeLbIULg, type:equippableItem, folderId:JrXjUPTbu2Jj2AuN}
      - [ITEM] Pacha Mama {id:5y1pLcZT9TAJ48Y5, type:equippableItem, folderId:JrXjUPTbu2Jj2AuN}
      - [ITEM] Stormwing {id:yFmEhhXWBMPzEmT6, type:equippableItem, folderId:JrXjUPTbu2Jj2AuN}
      - [ITEM] Terra Factorem {id:DYPps0dldfLQk5QR, type:equippableItem, folderId:JrXjUPTbu2Jj2AuN}
      - [ITEM] Zeek {id:f5IUCrWJlZcm5HVh, type:equippableItem, folderId:JrXjUPTbu2Jj2AuN}
  - [FOLDER] Amplification {id:TOqDCNaMbz4McNIl, parent:oWRM8pNMOUkbZHoV, depth:1, path:"Manon/Amplification"}
    - [ITEM] Adrenaline Boost {id:f08CtBQkKaE5ZSXC, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Aspect of the Chelonian {id:tiO7BsSvlJyiMZdm, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Astral Resistance {id:clxvfazev8xp55w9, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Attribute Boost {id:Qmdd6jmXad0HSEtF, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Attribute Increase {id:aSqlb66DuhAGgJ9S, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Body Equilibrium {id:0nao5SdoAsmBjfmD, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Combat Mastery {id:tj6IMltdhTINSLmA, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Expertise {id:h1ob9dBv1IeacGdb, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Eyes of the Raptor {id:8wLvjrHRdf5eNklf, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Fade From Vision {id:ou0adA5kalAf2frn, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Far Sight {id:McsiqvcEaBaen8JV, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Flash Step {id:Dd2oHvDor0doH4zU, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Flying Crane {id:sbGWtLY4WmT5r34H, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Ghost {id:WnQzcFG3H1MWgllo, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Hidden Presence {id:X7XeDOGy2FkWCcb3, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Iron Fist {id:6lqyTjaujr2dq4sp, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Perfect Situational Awareness {id:0BfN5Awg4ZNR1Fjs, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Rasputin's Blessing {id:ZBB3t6Fv3G8QJ6de, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Returning the Fang {id:X5LQgz36flJj9tK9, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Self-healing {id:48RI3LsyHTy9oT9L, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Shadow Double {id:Zw3U5vwPY0jMseBs, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Suspended Animation {id:oEyETooOB5OI3TP5, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Telekinesis {id:qqOhECCfkuqDzFXc, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
    - [ITEM] Touch of the Spider {id:uGseiglBA4iPtOGe, type:equippableItem, folderId:TOqDCNaMbz4McNIl}
  - [FOLDER] Rituals {id:6lAsZV9lPeO51DJT, parent:oWRM8pNMOUkbZHoV, depth:1, path:"Manon/Rituals"}
    - [ITEM] Break Ward {id:pAeXL4bxymLOmQ1q, type:equippableItem, folderId:6lAsZV9lPeO51DJT}
    - [ITEM] Cottage Refuge {id:2Z7K60JuGEHHUK2k, type:equippableItem, folderId:6lAsZV9lPeO51DJT}
    - [ITEM] Locating a Person {id:H9Oc08Axpd1f7xCZ, type:equippableItem, folderId:6lAsZV9lPeO51DJT}
    - [ITEM] Preservation {id:pm2Sbn87hDqbibED, type:equippableItem, folderId:6lAsZV9lPeO51DJT}
    - [ITEM] Raise Ward {id:5abTs2EYqMYCY0LY, type:equippableItem, folderId:6lAsZV9lPeO51DJT}
    - [ITEM] Recall Device {id:dzPdlWhhLazVJNSM, type:equippableItem, folderId:6lAsZV9lPeO51DJT}
    - [ITEM] Sterilize {id:KkLU4mjqG6VoMWrL, type:equippableItem, folderId:6lAsZV9lPeO51DJT}
    - [ITEM] Travel Over Distance {id:XsZ2Rv5ft5OeHlzM, type:equippableItem, folderId:6lAsZV9lPeO51DJT}
    - [ITEM] Weather Protection {id:wFH9HWFtsZhdVGLx, type:equippableItem, folderId:6lAsZV9lPeO51DJT}
- [FOLDER] Brand {id:U0xPHn13he6mwKNg, parent:null, depth:0, path:"Brand"}
  - [FOLDER] Resources {id:tH4sjhPKYwIEC0KT, parent:U0xPHn13he6mwKNg, depth:1, path:"Brand/Resources"}
    - [ITEM] ResourceTest {id:WFTBh6F3W11sBXdI, type:equippableItem, folderId:tH4sjhPKYwIEC0KT}
  - [FOLDER] Assets {id:76RtzViuhpI874RJ, parent:U0xPHn13he6mwKNg, depth:1, path:"Brand/Assets"}
    - [ITEM] Acrocolypse {id:Z38ou2v0Z1pZM3ju, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Adeedus {id:Mcx3SDAlZxF9m6fz, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Albert Knox {id:oi0odB14S1OqEKAV, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Albretcht {id:pOmANkEY6fRxdjvy, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Alexis Marin {id:AUfaA4bLVgPvyHQQ, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Alistair {id:dZ0JOX3Fduo5Ze2Y, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Ann Thorpe {id:ctIPDwgVl3F8UYi7, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Anthony Chow {id:UoBXn1mdgeZoQmMF, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Ashes Crane {id:5VhKI0xFZ9rkzaf9, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Ben Chang {id:jDTq4VrONmXOjGiJ, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Big Al (Vehicle Emporium) {id:iEpG4ocTIlyof9vN, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Bill Blanca {id:sY92lA3ViKSKmsrH, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Bluebeard {id:rYcM9zckU1OqmyLR, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Bo Darville {id:AjYtUnEfYqDnWObC, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Bob Gadling {id:qYB73UqzU9quv4t2, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Bob Loblaw {id:H1F4PocoKuGxfDDC, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Bobby Jones {id:QgaQnk5pir3PL8w1, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Bubbles {id:Dm4h25H4gncTQNOO, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Bunny Delish {id:Q54KhyqOMDDm2M4y, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Catapult {id:wlHVCFiKF2kejtBQ, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Cavern Johnson {id:fvf45qHRRDuepacl, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Clarence Boddicker {id:XI7vblnqwhNVlEbA, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Clefton {id:YTL7Tc422boXIQDO, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Corentin Latreille Mador {id:oV8r3LT1N8sqSCDY, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Cover Girl {id:Dg74VG8yR6DUyb9R, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Cy-klops {id:rk99X2Lur5pU764H, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Dan {id:oCqXG1EMgmSbmIcf, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Diane {id:PHHGu9w2JkQD4OJQ, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Diaz Baha {id:vfr61Nhcggj9jFom, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Dom Rotetto {id:K8X8GdePbib1J1FG, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Don Bruno Carino {id:kbNTz6Uu48JOS3lj, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Donna {id:gooFlfWNEYNZiOwm, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Double Helix {id:EyfGOs9JI5aUT4E5, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Dr. Brainrule {id:hRDNKTkSfYMOgobM, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Dr. Mind-twister {id:gL0sixLnxpFbYIbO, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Dr. Ween {id:u2NpxG05E6BA6f5U, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Duke {id:g3wre14vQkk1zDae, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Easy E {id:jH6QuoBmNIYmbpZv, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] El Mostafa Urbano {id:GeXSPn0QSKPewn3K, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Ember Flint {id:rcNoaOYHJARz4IaV, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Eric Gross {id:O6kYu4LS7q5AtqIy, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Flash Moresloth {id:Jj5cx3uAJCXcwCOy, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Fungor {id:EvuwtWCwM3IH3CWf, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Grandmaw {id:u2hIcGuNi9sRkEEw, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Harlequin {id:kZZHAF2Kw2GBuoyc, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Harold Francis Callahan {id:2qYfdmRBoOMV7l05, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Hobo Pirate {id:jk0aEciJELAplXfa, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Huxley {id:tBLPu8h4tGxrR9lM, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Issac on Rails {id:GDMn234kFHIkasz8, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Jack Point {id:nZydJBYlZTgfeuh5, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] James Connor {id:CB0Gzv062xbqQQIX, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] James McCullen {id:5rZLSY5EcQRqelVI, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Jet Black {id:9gWz5KwAAp7tBYsW, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Jimbo {id:encmmM6hAcVzcXxu, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Joe {id:lCVuoBGxZDJDYL1c, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] John Smith {id:UbuWusPlf9Nh9agx, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Johnny {id:4a8QBO3SZD9aYgL3, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Juinan {id:QBz1qZLpGk9e2YN5, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Kasper Dixon {id:e0vl6UaFL40XDZjz, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Kate Barker {id:WeXfJUBywZFomble, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Katia Frangos {id:7IE6Ny6aHEq6CEn9, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Kestrel {id:cy0RGoMoA2JRe62W, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] King of Lost Socks {id:RwEfojmv54Wq6jMW, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Lem Walnanespanct {id:rSekDuRsGEbDtl2j, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Lena {id:z9eKOANEg4TkIQnC, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Levi Hochstetler {id:KZ6CuElYwiH5UH1n, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Lynn Murray Griffon {id:YJkj7KPI8ajkRc2O, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Mac & Bo {id:x3XEA6s6V66NrYkS, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Madelyn Bishop Bates {id:1MvpRB7J9EDeyMCa, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Max Born {id:eG7AOUS7Nqi46HYC, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] May {id:McjskLAeRDyRWqnh, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] May O'Neil {id:gzjdZEGV5hMwD2UQ, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Melfidius {id:voaz2flGjQOaBY0W, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Melody Myers {id:hA04rcfC2a9VbI0H, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Michelle King {id:gcNBqfmiurcc8KlT, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Modesty Blaze {id:h9ucxoVcKxy6ppMf, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Moe Lester {id:T8QkW6edGMTGY2H4, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Morgana Powers {id:1ROVj7pJ1XEZNnp3, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Mr. Chief {id:YTUy5v74L0KqaoyK, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Murdok Mark {id:3eyVQJEQ0xgt0uHm, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Nathaniel Essex {id:ezt3hK8NS68Oabyx, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Odiphus {id:MFdVxtWPDhGMOKH1, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Pantharo {id:C7iVsP6VKaosQKHj, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Paris Bueller {id:xcngir5nZ4nDWula, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Pearl Pearlman {id:IT5bEYagj5D3uokk, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Perkaedo {id:Kesa0BW3AkbVjvLP, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Phizzvan {id:Cu59hxRQwAXCaFSf, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Present Head {id:GcokevNd5x45FPyl, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Q {id:02iK8ZeUBPPsagnX, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Quill Quaz {id:jabYQ3QugTpDwfrx, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Rat {id:ZYWuUos7DnjBQxOR, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Razor {id:6p8zbqxbhhpVsPcg, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Rebecca {id:KW99wiP6eArdw7ju, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Reverand Dr. Syn {id:1b8cKQOmUYP5tPrL, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Risleb the Immortal {id:LHkxI83ax0PwqoGz, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Robert {id:7uKRvcNgRrOnJonV, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Robert Savage {id:0hjXojRSTGywbceU, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Roberto {id:JxpYLPdmydbbKwKc, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Royal Continental {id:mijOI5UupDMnOjlk, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Russ "The String" Bell {id:L2UoKT4Iu1KlkJjf, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Sammon Shamon Al-Baz {id:666bx83ceQHsoBpn, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Sarah Konnor {id:Le4yZ18sSKktViJK, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Scarab {id:eNHJvhZKNMtqEHft, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Serpent Pliskin {id:oJvqD5v4tO1djz5h, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Skeletron {id:kJfucVrQcLqEaWhd, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Snap-Jaw {id:2Oykf6XPWxD5q4VM, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Snowball {id:EQL9qZU53ZiArlCU, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Spearmint {id:JVV7tp0rQkgJCdrj, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Sydney Greenstreet the Duckpin {id:YhAKWJtw6pEcNzee, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Techno-viking {id:zwrzi9Knj7bWp3d7, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] The Blue Meanies {id:k4fYca9yscm5gHe6, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] The Certified Accountant {id:rP8a3IR0OBEsxzSj, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] The Coughing Man {id:VYlR7cYmmgJuu5vL, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] The Countess {id:kWKEev9fMlvOgFHP, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] The Gimcrak King {id:JNMLOmY7PRx1NfpA, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Thumper {id:gUgkxHMGoWwyvyMv, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Tibor Phrenczy {id:UZ7foI7EdHLPpm30, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Tooth Spitter {id:ID9dSrSnFgWFrL0A, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Turret {id:TXUzSM3wblfJvdVc, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Tyrel Melchor {id:F1geklb0vncVzx82, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] W. H. Loh {id:mSmghLY4ofUqaSkB, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Warden Hand {id:P4ZliFjv32dOi8Nt, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Weird {id:ovPYIBvPsWe4njgy, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] William Kilgore {id:nhTkSzOfSyu0y4Pk, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Yahya Boulos {id:eE8lmGwmE4kgOrjc, type:equippableItem, folderId:76RtzViuhpI874RJ}
    - [ITEM] Zane {id:x7uOelnHCPtdL5yy, type:equippableItem, folderId:76RtzViuhpI874RJ}
- [FOLDER] _Templates {id:lm14M8GJkCltaS3J, parent:null, depth:0, path:"_Templates"}
  - [ITEM] Amps Template {id:XtU8rTt7uOjlTxx0, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Asset Template {id:uGhQTkXb74uXkwPd, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Cyberdeck Template {id:b2F3cWZSzUeZvam8, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Drone Ballistic Template {id:8L2WHN9Spx1TyIys, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Drone Energy W Template {id:lOAPMavVjtRre3OI, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] DroneItems Template {id:UOzfdwCey4axeP6O, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] E War Threads Template {id:lBNLLAeL3gcJs2RQ, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Energy Wep Template {id:hMNA1M25JzNfOz0c, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Firearms Template {id:WpDhy1PMWFkO6tOc, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Hacking Threads Template {id:8CMq8JmyHbRCglOv, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Melee Weapon Template {id:beEN7M4Y3hg8U06n, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Projectile Template {id:dsFXOOLAla95Lj3y, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Resources Template {id:wi8dx0sNDbpFXrKU, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Rig Drive Skill Template {id:QtMNKYb9rrdKwv0k, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Rig Fly Skill Template {id:mCc3spF6itnvgfou, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Ritual Template {id:25Qy5a7maYi8KQOX, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Sinless Roll Config {id:ejf8ndmNAUPCzJAC, type:subTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Sorcery Template {id:SpelTplSinlssA1X, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Spirit Map Template {id:rWePU1Kam0pG00VD, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Spirits Template {id:QyToiPEwE2Tp36YK, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Thrown Weapon Template {id:J7lCjK5RwvIF4gUw, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] VCR Template {id:3LTlu5bj85Ic7pQS, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Vehicle Ballistic Template {id:WQoI2Ir3qVKJASl3, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] Vehicle Energy W Template {id:jM4PHhDREfU7OUZ4, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
  - [ITEM] VehicleItems Template {id:GHO6zyIPQXdSYR8a, type:_equippableItemTemplate, folderId:lm14M8GJkCltaS3J}
- [FOLDER] (Unfoldered) {id:null, parent:null, depth:0, path:"(Unfoldered)"}
  - [ITEM] Active Effects {id:xP13QucJZoaeEKyq, type:activeEffectContainer, folderId:null}
  - [ITEM] Device Control {id:KtQoPc0pupgHyxgm, type:equippableItem, folderId:null}
  - [ITEM] Ewar {id:WY25OJUJECjpkwcP, type:equippableItem, folderId:null}
  - [ITEM] Asset Test {id:YBo4xuxE8RqcKFWZ, type:equippableItem, folderId:null}
  - [ITEM] Hacking {id:4fv3HY7jwOQE2wrN, type:equippableItem, folderId:null}

### Items - Folder Index
| path | folderId | parentFolderId | depth | sort | sorting |
| --- | --- | --- | ---: | ---: | --- |
| _Templates | lm14M8GJkCltaS3J |  | 0 | 650000 | a |
| Brand | U0xPHn13he6mwKNg |  | 0 | 325000 | a |
| CSB - Embedded Items Folder - DO NOT RENAME OR REMOVE | rCTnl7myqTtxE5gl |  | 0 | -200000 | a |
| Decking | 2idKfyaV1KZVqL6V |  | 0 | 25000 | a |
| Manon | oWRM8pNMOUkbZHoV |  | 0 | 237500 | m |
| Rigging | bRI78s2WG6gVDJ4C |  | 0 | 150000 | m |
| Weapons | l7jcqzFSJr3Qemeu |  | 0 | -100000 | m |
| Brand/Assets | 76RtzViuhpI874RJ | U0xPHn13he6mwKNg | 1 | 100000 | a |
| Brand/Resources | tH4sjhPKYwIEC0KT | U0xPHn13he6mwKNg | 1 | 0 | a |
| Decking/Cyberdecks | TpyOdo9rRmcJZwT2 | 2idKfyaV1KZVqL6V | 1 | 0 | m |
| Decking/E War Threads | FBqDldU0lm0kCoRQ | 2idKfyaV1KZVqL6V | 1 | 200000 | a |
| Decking/Hacking Threads | 92dSVkunMksoE7g2 | 2idKfyaV1KZVqL6V | 1 | 100000 | a |
| Manon/Amplification | TOqDCNaMbz4McNIl | oWRM8pNMOUkbZHoV | 1 | 25000 | a |
| Manon/Conjuring | 6whq1Osyvu4GSURS | oWRM8pNMOUkbZHoV | 1 | 0 | m |
| Manon/Rituals | 6lAsZV9lPeO51DJT | oWRM8pNMOUkbZHoV | 1 | 50000 | m |
| Manon/Sorcery | fzpbw6RIBAzBp9kN | oWRM8pNMOUkbZHoV | 1 | -100000 | m |
| Rigging/Drive / Fly Skills | wpNVoTaalbsoL0Lv | bRI78s2WG6gVDJ4C | 1 | 100000 | a |
| Rigging/Drone Weapons | Ts6jM2x9mZugV8R4 | bRI78s2WG6gVDJ4C | 1 | 125000 | a |
| Rigging/Drones | DswGzl1e1TynhREL | bRI78s2WG6gVDJ4C | 1 | -100000 | a |
| Rigging/VCR | d3QnO994LfRud9yy | bRI78s2WG6gVDJ4C | 1 | -200000 | m |
| Rigging/Vehicle Weapons | 17SxKReYD26TEIrd | bRI78s2WG6gVDJ4C | 1 | 150000 | a |
| Rigging/Vehicles | ic8w75E9GFrktS4x | bRI78s2WG6gVDJ4C | 1 | 0 | a |
| Weapons/Energy | fFGfPC4Uqyeabnvo | l7jcqzFSJr3Qemeu | 1 | 175000 | a |
| Weapons/Firearms | 5KWDwkU23whetOIV | l7jcqzFSJr3Qemeu | 1 | 162500 | a |
| Weapons/Melee | aHRmcytEr2emGb1Y | l7jcqzFSJr3Qemeu | 1 | 100000 | a |
| Weapons/Projectile | 9kmoBQyRvIQEoTi1 | l7jcqzFSJr3Qemeu | 1 | 150000 | m |
| Weapons/Thrown | rpm8CmOJ32570KoC | l7jcqzFSJr3Qemeu | 1 | 125000 | a |
| Manon/Conjuring/Spirit Maps | aHvlIdpJNdmTmDRg | 6whq1Osyvu4GSURS | 2 | 0 | a |
| Manon/Conjuring/Spirits (Shaman) | JrXjUPTbu2Jj2AuN | 6whq1Osyvu4GSURS | 2 | 0 | a |
| Manon/Sorcery/Astral Umbra | 6OffBG8bkUnp7Ixf | fzpbw6RIBAzBp9kN | 2 | 0 | a |
| Manon/Sorcery/Auralurgy | v0lGsMbGnlKF7Dvi | fzpbw6RIBAzBp9kN | 2 | 150000 | a |
| Manon/Sorcery/Incantor | m0jRApcb3Al3Dh3t | fzpbw6RIBAzBp9kN | 2 | 300000 | a |
| Manon/Sorcery/Mentalism | xuhgaKb2rgkuMPKA | fzpbw6RIBAzBp9kN | 2 | 400000 | a |
| Manon/Sorcery/The Bound | Fi8plai5LkNJGnNE | fzpbw6RIBAzBp9kN | 2 | 450000 | a |

### Items - Document Index
| path | documentId | name | subtype | folderId |
| --- | --- | --- | --- | --- |
| _Templates/Amps Template | XtU8rTt7uOjlTxx0 | Amps Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Asset Template | uGhQTkXb74uXkwPd | Asset Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Cyberdeck Template | b2F3cWZSzUeZvam8 | Cyberdeck Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Drone Ballistic Template | 8L2WHN9Spx1TyIys | Drone Ballistic Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Drone Energy W Template | lOAPMavVjtRre3OI | Drone Energy W Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/DroneItems Template | UOzfdwCey4axeP6O | DroneItems Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/E War Threads Template | lBNLLAeL3gcJs2RQ | E War Threads Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Energy Wep Template | hMNA1M25JzNfOz0c | Energy Wep Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Firearms Template | WpDhy1PMWFkO6tOc | Firearms Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Hacking Threads Template | 8CMq8JmyHbRCglOv | Hacking Threads Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Melee Weapon Template | beEN7M4Y3hg8U06n | Melee Weapon Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Projectile Template | dsFXOOLAla95Lj3y | Projectile Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Resources Template | wi8dx0sNDbpFXrKU | Resources Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Rig Drive Skill Template | QtMNKYb9rrdKwv0k | Rig Drive Skill Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Rig Fly Skill Template | mCc3spF6itnvgfou | Rig Fly Skill Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Ritual Template | 25Qy5a7maYi8KQOX | Ritual Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Sinless Roll Config | ejf8ndmNAUPCzJAC | Sinless Roll Config | subTemplate | lm14M8GJkCltaS3J |
| _Templates/Sorcery Template | SpelTplSinlssA1X | Sorcery Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Spirit Map Template | rWePU1Kam0pG00VD | Spirit Map Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Spirits Template | QyToiPEwE2Tp36YK | Spirits Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Thrown Weapon Template | J7lCjK5RwvIF4gUw | Thrown Weapon Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/VCR Template | 3LTlu5bj85Ic7pQS | VCR Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Vehicle Ballistic Template | WQoI2Ir3qVKJASl3 | Vehicle Ballistic Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/Vehicle Energy W Template | jM4PHhDREfU7OUZ4 | Vehicle Energy W Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| _Templates/VehicleItems Template | GHO6zyIPQXdSYR8a | VehicleItems Template | _equippableItemTemplate | lm14M8GJkCltaS3J |
| Active Effects | xP13QucJZoaeEKyq | Active Effects | activeEffectContainer |  |
| Asset Test | YBo4xuxE8RqcKFWZ | Asset Test | equippableItem |  |
| Brand/Assets/Acrocolypse | Z38ou2v0Z1pZM3ju | Acrocolypse | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Adeedus | Mcx3SDAlZxF9m6fz | Adeedus | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Albert Knox | oi0odB14S1OqEKAV | Albert Knox | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Albretcht | pOmANkEY6fRxdjvy | Albretcht | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Alexis Marin | AUfaA4bLVgPvyHQQ | Alexis Marin | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Alistair | dZ0JOX3Fduo5Ze2Y | Alistair | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Ann Thorpe | ctIPDwgVl3F8UYi7 | Ann Thorpe | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Anthony Chow | UoBXn1mdgeZoQmMF | Anthony Chow | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Ashes Crane | 5VhKI0xFZ9rkzaf9 | Ashes Crane | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Ben Chang | jDTq4VrONmXOjGiJ | Ben Chang | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Big Al (Vehicle Emporium) | iEpG4ocTIlyof9vN | Big Al (Vehicle Emporium) | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Bill Blanca | sY92lA3ViKSKmsrH | Bill Blanca | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Bluebeard | rYcM9zckU1OqmyLR | Bluebeard | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Bo Darville | AjYtUnEfYqDnWObC | Bo Darville | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Bob Gadling | qYB73UqzU9quv4t2 | Bob Gadling | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Bob Loblaw | H1F4PocoKuGxfDDC | Bob Loblaw | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Bobby Jones | QgaQnk5pir3PL8w1 | Bobby Jones | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Bubbles | Dm4h25H4gncTQNOO | Bubbles | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Bunny Delish | Q54KhyqOMDDm2M4y | Bunny Delish | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Catapult | wlHVCFiKF2kejtBQ | Catapult | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Cavern Johnson | fvf45qHRRDuepacl | Cavern Johnson | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Clarence Boddicker | XI7vblnqwhNVlEbA | Clarence Boddicker | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Clefton | YTL7Tc422boXIQDO | Clefton | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Corentin Latreille Mador | oV8r3LT1N8sqSCDY | Corentin Latreille Mador | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Cover Girl | Dg74VG8yR6DUyb9R | Cover Girl | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Cy-klops | rk99X2Lur5pU764H | Cy-klops | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Dan | oCqXG1EMgmSbmIcf | Dan | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Diane | PHHGu9w2JkQD4OJQ | Diane | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Diaz Baha | vfr61Nhcggj9jFom | Diaz Baha | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Dom Rotetto | K8X8GdePbib1J1FG | Dom Rotetto | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Don Bruno Carino | kbNTz6Uu48JOS3lj | Don Bruno Carino | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Donna | gooFlfWNEYNZiOwm | Donna | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Double Helix | EyfGOs9JI5aUT4E5 | Double Helix | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Dr. Brainrule | hRDNKTkSfYMOgobM | Dr. Brainrule | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Dr. Mind-twister | gL0sixLnxpFbYIbO | Dr. Mind-twister | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Dr. Ween | u2NpxG05E6BA6f5U | Dr. Ween | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Duke | g3wre14vQkk1zDae | Duke | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Easy E | jH6QuoBmNIYmbpZv | Easy E | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/El Mostafa Urbano | GeXSPn0QSKPewn3K | El Mostafa Urbano | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Ember Flint | rcNoaOYHJARz4IaV | Ember Flint | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Eric Gross | O6kYu4LS7q5AtqIy | Eric Gross | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Flash Moresloth | Jj5cx3uAJCXcwCOy | Flash Moresloth | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Fungor | EvuwtWCwM3IH3CWf | Fungor | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Grandmaw | u2hIcGuNi9sRkEEw | Grandmaw | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Harlequin | kZZHAF2Kw2GBuoyc | Harlequin | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Harold Francis Callahan | 2qYfdmRBoOMV7l05 | Harold Francis Callahan | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Hobo Pirate | jk0aEciJELAplXfa | Hobo Pirate | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Huxley | tBLPu8h4tGxrR9lM | Huxley | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Issac on Rails | GDMn234kFHIkasz8 | Issac on Rails | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Jack Point | nZydJBYlZTgfeuh5 | Jack Point | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/James Connor | CB0Gzv062xbqQQIX | James Connor | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/James McCullen | 5rZLSY5EcQRqelVI | James McCullen | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Jet Black | 9gWz5KwAAp7tBYsW | Jet Black | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Jimbo | encmmM6hAcVzcXxu | Jimbo | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Joe | lCVuoBGxZDJDYL1c | Joe | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/John Smith | UbuWusPlf9Nh9agx | John Smith | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Johnny | 4a8QBO3SZD9aYgL3 | Johnny | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Juinan | QBz1qZLpGk9e2YN5 | Juinan | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Kasper Dixon | e0vl6UaFL40XDZjz | Kasper Dixon | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Kate Barker | WeXfJUBywZFomble | Kate Barker | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Katia Frangos | 7IE6Ny6aHEq6CEn9 | Katia Frangos | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Kestrel | cy0RGoMoA2JRe62W | Kestrel | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/King of Lost Socks | RwEfojmv54Wq6jMW | King of Lost Socks | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Lem Walnanespanct | rSekDuRsGEbDtl2j | Lem Walnanespanct | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Lena | z9eKOANEg4TkIQnC | Lena | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Levi Hochstetler | KZ6CuElYwiH5UH1n | Levi Hochstetler | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Lynn Murray Griffon | YJkj7KPI8ajkRc2O | Lynn Murray Griffon | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Mac & Bo | x3XEA6s6V66NrYkS | Mac & Bo | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Madelyn Bishop Bates | 1MvpRB7J9EDeyMCa | Madelyn Bishop Bates | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Max Born | eG7AOUS7Nqi46HYC | Max Born | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/May | McjskLAeRDyRWqnh | May | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/May O'Neil | gzjdZEGV5hMwD2UQ | May O'Neil | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Melfidius | voaz2flGjQOaBY0W | Melfidius | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Melody Myers | hA04rcfC2a9VbI0H | Melody Myers | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Michelle King | gcNBqfmiurcc8KlT | Michelle King | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Modesty Blaze | h9ucxoVcKxy6ppMf | Modesty Blaze | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Moe Lester | T8QkW6edGMTGY2H4 | Moe Lester | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Morgana Powers | 1ROVj7pJ1XEZNnp3 | Morgana Powers | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Mr. Chief | YTUy5v74L0KqaoyK | Mr. Chief | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Murdok Mark | 3eyVQJEQ0xgt0uHm | Murdok Mark | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Nathaniel Essex | ezt3hK8NS68Oabyx | Nathaniel Essex | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Odiphus | MFdVxtWPDhGMOKH1 | Odiphus | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Pantharo | C7iVsP6VKaosQKHj | Pantharo | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Paris Bueller | xcngir5nZ4nDWula | Paris Bueller | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Pearl Pearlman | IT5bEYagj5D3uokk | Pearl Pearlman | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Perkaedo | Kesa0BW3AkbVjvLP | Perkaedo | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Phizzvan | Cu59hxRQwAXCaFSf | Phizzvan | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Present Head | GcokevNd5x45FPyl | Present Head | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Q | 02iK8ZeUBPPsagnX | Q | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Quill Quaz | jabYQ3QugTpDwfrx | Quill Quaz | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Rat | ZYWuUos7DnjBQxOR | Rat | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Razor | 6p8zbqxbhhpVsPcg | Razor | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Rebecca | KW99wiP6eArdw7ju | Rebecca | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Reverand Dr. Syn | 1b8cKQOmUYP5tPrL | Reverand Dr. Syn | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Risleb the Immortal | LHkxI83ax0PwqoGz | Risleb the Immortal | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Robert | 7uKRvcNgRrOnJonV | Robert | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Robert Savage | 0hjXojRSTGywbceU | Robert Savage | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Roberto | JxpYLPdmydbbKwKc | Roberto | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Royal Continental | mijOI5UupDMnOjlk | Royal Continental | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Russ "The String" Bell | L2UoKT4Iu1KlkJjf | Russ "The String" Bell | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Sammon Shamon Al-Baz | 666bx83ceQHsoBpn | Sammon Shamon Al-Baz | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Sarah Konnor | Le4yZ18sSKktViJK | Sarah Konnor | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Scarab | eNHJvhZKNMtqEHft | Scarab | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Serpent Pliskin | oJvqD5v4tO1djz5h | Serpent Pliskin | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Skeletron | kJfucVrQcLqEaWhd | Skeletron | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Snap-Jaw | 2Oykf6XPWxD5q4VM | Snap-Jaw | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Snowball | EQL9qZU53ZiArlCU | Snowball | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Spearmint | JVV7tp0rQkgJCdrj | Spearmint | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Sydney Greenstreet the Duckpin | YhAKWJtw6pEcNzee | Sydney Greenstreet the Duckpin | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Techno-viking | zwrzi9Knj7bWp3d7 | Techno-viking | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/The Blue Meanies | k4fYca9yscm5gHe6 | The Blue Meanies | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/The Certified Accountant | rP8a3IR0OBEsxzSj | The Certified Accountant | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/The Coughing Man | VYlR7cYmmgJuu5vL | The Coughing Man | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/The Countess | kWKEev9fMlvOgFHP | The Countess | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/The Gimcrak King | JNMLOmY7PRx1NfpA | The Gimcrak King | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Thumper | gUgkxHMGoWwyvyMv | Thumper | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Tibor Phrenczy | UZ7foI7EdHLPpm30 | Tibor Phrenczy | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Tooth Spitter | ID9dSrSnFgWFrL0A | Tooth Spitter | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Turret | TXUzSM3wblfJvdVc | Turret | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Tyrel Melchor | F1geklb0vncVzx82 | Tyrel Melchor | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/W. H. Loh | mSmghLY4ofUqaSkB | W. H. Loh | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Warden Hand | P4ZliFjv32dOi8Nt | Warden Hand | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Weird | ovPYIBvPsWe4njgy | Weird | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/William Kilgore | nhTkSzOfSyu0y4Pk | William Kilgore | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Yahya Boulos | eE8lmGwmE4kgOrjc | Yahya Boulos | equippableItem | 76RtzViuhpI874RJ |
| Brand/Assets/Zane | x7uOelnHCPtdL5yy | Zane | equippableItem | 76RtzViuhpI874RJ |
| Brand/Resources/ResourceTest | WFTBh6F3W11sBXdI | ResourceTest | equippableItem | tH4sjhPKYwIEC0KT |
| Decking/Cyberdecks/Fujitsu Edge | EXplZQVrK4Iuq2Cs | Fujitsu Edge | equippableItem | TpyOdo9rRmcJZwT2 |
| Decking/Cyberdecks/Mars Claymore | fzQqP7oUYtJb8rHo | Mars Claymore | equippableItem | TpyOdo9rRmcJZwT2 |
| Decking/Cyberdecks/MasterDeck | tn1WVRqrAoPCjIWp | MasterDeck | equippableItem | TpyOdo9rRmcJZwT2 |
| Decking/Cyberdecks/Orb Epsilon | DD5aVFTQACYYq90Q | Orb Epsilon | equippableItem | TpyOdo9rRmcJZwT2 |
| Decking/Cyberdecks/Orpheus Dreamweaver | zAzoB1sPvfjonoAo | Orpheus Dreamweaver | equippableItem | TpyOdo9rRmcJZwT2 |
| Decking/Cyberdecks/Royal Durandal | PunQ75zoS4ML4Lt0 | Royal Durandal | equippableItem | TpyOdo9rRmcJZwT2 |
| Decking/Cyberdecks/Semi Point Razor | rZ6vcAquAxsVA8dg | Semi Point Razor | equippableItem | TpyOdo9rRmcJZwT2 |
| Decking/Cyberdecks/Shingo Activa | jguZaaNdVKo7bs7q | Shingo Activa | equippableItem | TpyOdo9rRmcJZwT2 |
| Decking/E War Threads/Acid Burn | RtvBoN5fIK9yC9mU | Acid Burn | equippableItem | FBqDldU0lm0kCoRQ |
| Decking/E War Threads/Analysis Locus | I9QQRZWWtVSvIQ3Z | Analysis Locus | equippableItem | FBqDldU0lm0kCoRQ |
| Decking/E War Threads/Corrupt IFF | DZYaFjVnnjOzRTj4 | Corrupt IFF | equippableItem | FBqDldU0lm0kCoRQ |
| Decking/E War Threads/De-Rez | FQmvFTag1EMZwk94 | De-Rez | equippableItem | FBqDldU0lm0kCoRQ |
| Decking/E War Threads/Device Control | EZPyN7GodhwHFB0G | Device Control | equippableItem | FBqDldU0lm0kCoRQ |
| Decking/E War Threads/Hypnotic Projection | Qbp5AmTBLPIWvHK0 | Hypnotic Projection | equippableItem | FBqDldU0lm0kCoRQ |
| Decking/E War Threads/Refraction Field | 7IRs6MwcbyHAALRp | Refraction Field | equippableItem | FBqDldU0lm0kCoRQ |
| Decking/E War Threads/Targeted Disruption | FQj1PGA1AKF4pfvZ | Targeted Disruption | equippableItem | FBqDldU0lm0kCoRQ |
| Decking/E War Threads/Vermin Call | oRz0KfIjh0V4CbbD | Vermin Call | equippableItem | FBqDldU0lm0kCoRQ |
| Decking/Hacking Threads/Alert Monitor | CRfCfHczDcdxvQG7 | Alert Monitor | equippableItem | 92dSVkunMksoE7g2 |
| Decking/Hacking Threads/Crack Encryption | K68bkQAH3YKDUtXO | Crack Encryption | equippableItem | 92dSVkunMksoE7g2 |
| Decking/Hacking Threads/Decoy | PpNXIX1skyoL0TUd | Decoy | equippableItem | 92dSVkunMksoE7g2 |
| Decking/Hacking Threads/Electric Strike | 2IYdU2FRR7FrlnCZ | Electric Strike | equippableItem | 92dSVkunMksoE7g2 |
| Decking/Hacking Threads/Emotional Influence | DHu7KLrwWwZrhsYw | Emotional Influence | equippableItem | 92dSVkunMksoE7g2 |
| Decking/Hacking Threads/Encrypt File | gtZmJ4A2HHiiCa3t | Encrypt File | equippableItem | 92dSVkunMksoE7g2 |
| Decking/Hacking Threads/Ghost Protocol | TbZIiS4wj4ebQr3v | Ghost Protocol | equippableItem | 92dSVkunMksoE7g2 |
| Decking/Hacking Threads/Shadow Protocols | dmVJnyLDngBKpJCJ | Shadow Protocols | equippableItem | 92dSVkunMksoE7g2 |
| Decking/Hacking Threads/Situational Advantage | qqUde7IByVn3p8fg | Situational Advantage | equippableItem | 92dSVkunMksoE7g2 |
| Decking/Hacking Threads/Sonic Sickness | vn6vAJjPvYlkvHdb | Sonic Sickness | equippableItem | 92dSVkunMksoE7g2 |
| Decking/Hacking Threads/Universal Translator | RcFycLrZJN8Cp0BO | Universal Translator | equippableItem | 92dSVkunMksoE7g2 |
| Decking/Hacking Threads/Vent Gas | vvfsVWv2MAqEncOz | Vent Gas | equippableItem | 92dSVkunMksoE7g2 |
| Device Control | KtQoPc0pupgHyxgm | Device Control | equippableItem |  |
| Ewar | WY25OJUJECjpkwcP | Ewar | equippableItem |  |
| Hacking | 4fv3HY7jwOQE2wrN | Hacking | equippableItem |  |
| Manon/Amplification/Adrenaline Boost | f08CtBQkKaE5ZSXC | Adrenaline Boost | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Aspect of the Chelonian | tiO7BsSvlJyiMZdm | Aspect of the Chelonian | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Astral Resistance | clxvfazev8xp55w9 | Astral Resistance | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Attribute Boost | Qmdd6jmXad0HSEtF | Attribute Boost | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Attribute Increase | aSqlb66DuhAGgJ9S | Attribute Increase | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Body Equilibrium | 0nao5SdoAsmBjfmD | Body Equilibrium | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Combat Mastery | tj6IMltdhTINSLmA | Combat Mastery | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Expertise | h1ob9dBv1IeacGdb | Expertise | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Eyes of the Raptor | 8wLvjrHRdf5eNklf | Eyes of the Raptor | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Fade From Vision | ou0adA5kalAf2frn | Fade From Vision | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Far Sight | McsiqvcEaBaen8JV | Far Sight | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Flash Step | Dd2oHvDor0doH4zU | Flash Step | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Flying Crane | sbGWtLY4WmT5r34H | Flying Crane | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Ghost | WnQzcFG3H1MWgllo | Ghost | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Hidden Presence | X7XeDOGy2FkWCcb3 | Hidden Presence | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Iron Fist | 6lqyTjaujr2dq4sp | Iron Fist | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Perfect Situational Awareness | 0BfN5Awg4ZNR1Fjs | Perfect Situational Awareness | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Rasputin's Blessing | ZBB3t6Fv3G8QJ6de | Rasputin's Blessing | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Returning the Fang | X5LQgz36flJj9tK9 | Returning the Fang | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Self-healing | 48RI3LsyHTy9oT9L | Self-healing | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Shadow Double | Zw3U5vwPY0jMseBs | Shadow Double | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Suspended Animation | oEyETooOB5OI3TP5 | Suspended Animation | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Telekinesis | qqOhECCfkuqDzFXc | Telekinesis | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Amplification/Touch of the Spider | uGseiglBA4iPtOGe | Touch of the Spider | equippableItem | TOqDCNaMbz4McNIl |
| Manon/Conjuring/Spirit Maps/Shaman Spirit Map | yrkX7EvtmlE2n2ML | Shaman Spirit Map | equippableItem | aHvlIdpJNdmTmDRg |
| Manon/Conjuring/Spirits (Shaman)/Aqua Deambulatio | E5OWiUE5QpLNlGcE | Aqua Deambulatio | equippableItem | JrXjUPTbu2Jj2AuN |
| Manon/Conjuring/Spirits (Shaman)/Attash Aazaar | 0PP8kolvMwJhJNKD | Attash Aazaar | equippableItem | JrXjUPTbu2Jj2AuN |
| Manon/Conjuring/Spirits (Shaman)/Gaoh | Sb06F76Od5OntLAp | Gaoh | equippableItem | JrXjUPTbu2Jj2AuN |
| Manon/Conjuring/Spirits (Shaman)/Ignis Dicen | Lt71JzIxenESP1pO | Ignis Dicen | equippableItem | JrXjUPTbu2Jj2AuN |
| Manon/Conjuring/Spirits (Shaman)/Lapsae Caelum | aJR54vvHU7ifcT3x | Lapsae Caelum | equippableItem | JrXjUPTbu2Jj2AuN |
| Manon/Conjuring/Spirits (Shaman)/Miasma | sDW8RKaqw20LJgZr | Miasma | equippableItem | JrXjUPTbu2Jj2AuN |
| Manon/Conjuring/Spirits (Shaman)/Moryana | TEKGswwJx0xK6yrE | Moryana | equippableItem | JrXjUPTbu2Jj2AuN |
| Manon/Conjuring/Spirits (Shaman)/Mound of Skulls | lb99tCjEOeLbIULg | Mound of Skulls | equippableItem | JrXjUPTbu2Jj2AuN |
| Manon/Conjuring/Spirits (Shaman)/Pacha Mama | 5y1pLcZT9TAJ48Y5 | Pacha Mama | equippableItem | JrXjUPTbu2Jj2AuN |
| Manon/Conjuring/Spirits (Shaman)/Stormwing | yFmEhhXWBMPzEmT6 | Stormwing | equippableItem | JrXjUPTbu2Jj2AuN |
| Manon/Conjuring/Spirits (Shaman)/Terra Factorem | DYPps0dldfLQk5QR | Terra Factorem | equippableItem | JrXjUPTbu2Jj2AuN |
| Manon/Conjuring/Spirits (Shaman)/Zeek | f5IUCrWJlZcm5HVh | Zeek | equippableItem | JrXjUPTbu2Jj2AuN |
| Manon/Rituals/Break Ward | pAeXL4bxymLOmQ1q | Break Ward | equippableItem | 6lAsZV9lPeO51DJT |
| Manon/Rituals/Cottage Refuge | 2Z7K60JuGEHHUK2k | Cottage Refuge | equippableItem | 6lAsZV9lPeO51DJT |
| Manon/Rituals/Locating a Person | H9Oc08Axpd1f7xCZ | Locating a Person | equippableItem | 6lAsZV9lPeO51DJT |
| Manon/Rituals/Preservation | pm2Sbn87hDqbibED | Preservation | equippableItem | 6lAsZV9lPeO51DJT |
| Manon/Rituals/Raise Ward | 5abTs2EYqMYCY0LY | Raise Ward | equippableItem | 6lAsZV9lPeO51DJT |
| Manon/Rituals/Recall Device | dzPdlWhhLazVJNSM | Recall Device | equippableItem | 6lAsZV9lPeO51DJT |
| Manon/Rituals/Sterilize | KkLU4mjqG6VoMWrL | Sterilize | equippableItem | 6lAsZV9lPeO51DJT |
| Manon/Rituals/Travel Over Distance | XsZ2Rv5ft5OeHlzM | Travel Over Distance | equippableItem | 6lAsZV9lPeO51DJT |
| Manon/Rituals/Weather Protection | wFH9HWFtsZhdVGLx | Weather Protection | equippableItem | 6lAsZV9lPeO51DJT |
| Manon/Sorcery/Astral Umbra/Black Bolt of Uthal | wMZ6hE3wNGN1pidi | Black Bolt of Uthal | equippableItem | 6OffBG8bkUnp7Ixf |
| Manon/Sorcery/Astral Umbra/Cloak of Night | gEakhlOVhvXvAXHC | Cloak of Night | equippableItem | 6OffBG8bkUnp7Ixf |
| Manon/Sorcery/Astral Umbra/Create Darkenbeast | udPmRpLEYBuiPawZ | Create Darkenbeast | equippableItem | 6OffBG8bkUnp7Ixf |
| Manon/Sorcery/Astral Umbra/Dire Touch of Ennui | tZvdDTKB020lN7Rd | Dire Touch of Ennui | equippableItem | 6OffBG8bkUnp7Ixf |
| Manon/Sorcery/Astral Umbra/Evocation of the Frail Beam of Debility | jRZ2bN2LcV7UCJZr | Evocation of the Frail Beam of Debility | equippableItem | 6OffBG8bkUnp7Ixf |
| Manon/Sorcery/Astral Umbra/Horrors of the Unknown Dark | 4cKQxb6BJNmXLLBF | Horrors of the Unknown Dark | equippableItem | 6OffBG8bkUnp7Ixf |
| Manon/Sorcery/Astral Umbra/Moment of Eclipse | zHCnZBzRIRRQeuxn | Moment of Eclipse | equippableItem | 6OffBG8bkUnp7Ixf |
| Manon/Sorcery/Astral Umbra/Night's Chill | RFR0w21azVr0RKzE | Night's Chill | equippableItem | 6OffBG8bkUnp7Ixf |
| Manon/Sorcery/Astral Umbra/Shadow Anchor | qOZpEsrQZXMFzOFG | Shadow Anchor | equippableItem | 6OffBG8bkUnp7Ixf |
| Manon/Sorcery/Astral Umbra/Shadow Path of Vile Ether | M1Sq9cOCQqk3QZpy | Shadow Path of Vile Ether | equippableItem | 6OffBG8bkUnp7Ixf |
| Manon/Sorcery/Astral Umbra/Sorcery of the Wraith's Flight | hch7HYXSTsyIQZLG | Sorcery of the Wraith's Flight | equippableItem | 6OffBG8bkUnp7Ixf |
| Manon/Sorcery/Astral Umbra/The Marvelous Cursed Sigil of Athozog | fIUfZv7WoVVS98vS | The Marvelous Cursed Sigil of Athozog | equippableItem | 6OffBG8bkUnp7Ixf |
| Manon/Sorcery/Astral Umbra/The Serene Conjuration of Ehon's Gate | JLUfuvXTmCKQBKdK | The Serene Conjuration of Ehon's Gate | equippableItem | 6OffBG8bkUnp7Ixf |
| Manon/Sorcery/Astral Umbra/The Thirty Cursed Servant of Athozog | 7sh0HvJFqJZEUj1H | The Thirty Cursed Servant of Athozog | equippableItem | 6OffBG8bkUnp7Ixf |
| Manon/Sorcery/Astral Umbra/The Uncountable Tendrils of Ehon | vaom688y77coLKF5 | The Uncountable Tendrils of Ehon | equippableItem | 6OffBG8bkUnp7Ixf |
| Manon/Sorcery/Auralurgy/Chant of Dire Malady | iOFEgVhP1YVeuKd6 | Chant of Dire Malady | equippableItem | v0lGsMbGnlKF7Dvi |
| Manon/Sorcery/Auralurgy/Forbidden Glamour of Accord | zv2KSMaHLwY4ZncN | Forbidden Glamour of Accord | equippableItem | v0lGsMbGnlKF7Dvi |
| Manon/Sorcery/Auralurgy/Rune of the Unspeakable Alarm | 50m5hoClUIYxbKkl | Rune of the Unspeakable Alarm | equippableItem | v0lGsMbGnlKF7Dvi |
| Manon/Sorcery/Auralurgy/Rune of Vicious Rage and Sorrow | GCm0ZGlyLdCKeZZ1 | Rune of Vicious Rage and Sorrow | equippableItem | v0lGsMbGnlKF7Dvi |
| Manon/Sorcery/Auralurgy/The Ancestral Working of the Savage Peal | AYdqDQdbW2xk12R2 | The Ancestral Working of the Savage Peal | equippableItem | v0lGsMbGnlKF7Dvi |
| Manon/Sorcery/Auralurgy/The Blessed Chime of Glorious Release | VVG0Ued9MRUNISkr | The Blessed Chime of Glorious Release | equippableItem | v0lGsMbGnlKF7Dvi |
| Manon/Sorcery/Auralurgy/The Charm of Raucous Cacophony | B0D2Rb9oVfc0wmfz | The Charm of Raucous Cacophony | equippableItem | v0lGsMbGnlKF7Dvi |
| Manon/Sorcery/Auralurgy/The Confounding Rhythms of Dire Doom | cqyctWPyXciS2MCX | The Confounding Rhythms of Dire Doom | equippableItem | v0lGsMbGnlKF7Dvi |
| Manon/Sorcery/Auralurgy/The Horrid Call of Za'lota | ArZu3vnqew24kDCZ | The Horrid Call of Za'lota | equippableItem | v0lGsMbGnlKF7Dvi |
| Manon/Sorcery/Auralurgy/The Infinite Illusion of Spiritual Separation | 47cvrcCNzQgFv0zJ | The Infinite Illusion of Spiritual Separation | equippableItem | v0lGsMbGnlKF7Dvi |
| Manon/Sorcery/Auralurgy/The Seven Chimes of Forceful Approbation | KLtQFOnEufzeequ6 | The Seven Chimes of Forceful Approbation | equippableItem | v0lGsMbGnlKF7Dvi |
| Manon/Sorcery/Incantor/Create Barrier | F7nnEgp2BFrAZoM6 | Create Barrier | equippableItem | m0jRApcb3Al3Dh3t |
| Manon/Sorcery/Incantor/Disguise Astral Aura | z4j0meQXdN4UbjCf | Disguise Astral Aura | equippableItem | m0jRApcb3Al3Dh3t |
| Manon/Sorcery/Incantor/Flight | peYTrrhtyPX936nQ | Flight | equippableItem | m0jRApcb3Al3Dh3t |
| Manon/Sorcery/Incantor/Haste | z03u4RkWUT6reu5I | Haste | equippableItem | m0jRApcb3Al3Dh3t |
| Manon/Sorcery/Incantor/Light | 1BguZDRzlB2HOsFJ | Light | equippableItem | m0jRApcb3Al3Dh3t |
| Manon/Sorcery/Incantor/Manon Ball | PLhpz890RUQlN9sE | Manon Ball | equippableItem | m0jRApcb3Al3Dh3t |
| Manon/Sorcery/Incantor/Manon Bolt | rfBenAJCXNSu17pw | Manon Bolt | equippableItem | m0jRApcb3Al3Dh3t |
| Manon/Sorcery/Incantor/Mind Link | kbJJyKSyb1SbSOn0 | Mind Link | equippableItem | m0jRApcb3Al3Dh3t |
| Manon/Sorcery/Incantor/Power Bolt | 9g8k9hws9BxlMQfy | Power Bolt | equippableItem | m0jRApcb3Al3Dh3t |
| Manon/Sorcery/Incantor/Powerball | obioXfChLEoIVQXV | Powerball | equippableItem | m0jRApcb3Al3Dh3t |
| Manon/Sorcery/Incantor/Shatter Ward | 5PvxPeY9H49oYW14 | Shatter Ward | equippableItem | m0jRApcb3Al3Dh3t |
| Manon/Sorcery/Mentalism/Calm | odnghuR7oBmKEWJa | Calm | equippableItem | xuhgaKb2rgkuMPKA |
| Manon/Sorcery/Mentalism/Charm | d0Wgmxh6GljCq4XU | Charm | equippableItem | xuhgaKb2rgkuMPKA |
| Manon/Sorcery/Mentalism/Command | RAPZeJUn661k06e9 | Command | equippableItem | xuhgaKb2rgkuMPKA |
| Manon/Sorcery/Mentalism/Confusion | 7nqFvtjO5Pf1m3Gd | Confusion | equippableItem | xuhgaKb2rgkuMPKA |
| Manon/Sorcery/Mentalism/Despair | wxb9bpvoT2BdRvrq | Despair | equippableItem | xuhgaKb2rgkuMPKA |
| Manon/Sorcery/Mentalism/Ensorcell | UJjEzGPHGOJeqErU | Ensorcell | equippableItem | xuhgaKb2rgkuMPKA |
| Manon/Sorcery/Mentalism/Enthrall | lEeAuuYtXSf2Jn37 | Enthrall | equippableItem | xuhgaKb2rgkuMPKA |
| Manon/Sorcery/Mentalism/Forget | eco8hS4iYlOx00lF | Forget | equippableItem | xuhgaKb2rgkuMPKA |
| Manon/Sorcery/Mentalism/Fumble | 9dUEsX7OZDbNiXRF | Fumble | equippableItem | xuhgaKb2rgkuMPKA |
| Manon/Sorcery/Mentalism/Geas | udIyuyFgrSpIZlx2 | Geas | equippableItem | xuhgaKb2rgkuMPKA |
| Manon/Sorcery/Mentalism/Hold | NDFOBjYGbBQrQlEX | Hold | equippableItem | xuhgaKb2rgkuMPKA |
| Manon/Sorcery/Mentalism/Insight | JbZ0mgTnnmqgOEXQ | Insight | equippableItem | xuhgaKb2rgkuMPKA |
| Manon/Sorcery/Mentalism/Laughter | o88LZmyWafqXeU37 | Laughter | equippableItem | xuhgaKb2rgkuMPKA |
| Manon/Sorcery/Mentalism/Suggestion | phYaJHE7fxQa9g2h | Suggestion | equippableItem | xuhgaKb2rgkuMPKA |
| Manon/Sorcery/Mentalism/Taunt | izJCGVgmpCWuPgsJ | Taunt | equippableItem | xuhgaKb2rgkuMPKA |
| Manon/Sorcery/The Bound/Blight | ivbEv26WTcjIN88i | Blight | equippableItem | Fi8plai5LkNJGnNE |
| Manon/Sorcery/The Bound/Bound Servant | jogoGLJrueqF2lbl | Bound Servant | equippableItem | Fi8plai5LkNJGnNE |
| Manon/Sorcery/The Bound/Fiery Lash | oIIOVJ8IdLpV1FTr | Fiery Lash | equippableItem | Fi8plai5LkNJGnNE |
| Manon/Sorcery/The Bound/Fires of the Earth | jXFqAXjCahwFNZBu | Fires of the Earth | equippableItem | Fi8plai5LkNJGnNE |
| Manon/Sorcery/The Bound/Firestorm | YGvvpLokF7dHnu8w | Firestorm | equippableItem | Fi8plai5LkNJGnNE |
| Manon/Sorcery/The Bound/Grasp of Spring | YQnYwSjfBK2crsmh | Grasp of Spring | equippableItem | Fi8plai5LkNJGnNE |
| Manon/Sorcery/The Bound/Healing | B0g2y4CAVtIohOpM | Healing | equippableItem | Fi8plai5LkNJGnNE |
| Manon/Sorcery/The Bound/Lightning Strike | UqxfotlqKznC1GJh | Lightning Strike | equippableItem | Fi8plai5LkNJGnNE |
| Manon/Sorcery/The Bound/Massage the Bones of the Earth | fUzFacKdgJTfkbrW | Massage the Bones of the Earth | equippableItem | Fi8plai5LkNJGnNE |
| Manon/Sorcery/The Bound/Natural Fury | HYkym6OvMFX7OTE0 | Natural Fury | equippableItem | Fi8plai5LkNJGnNE |
| Manon/Sorcery/The Bound/Shapeshift | 9CehX0nF2LRIAH9A | Shapeshift | equippableItem | Fi8plai5LkNJGnNE |
| Manon/Sorcery/The Bound/Summon Elemental | quYSnPS1X9CvpznC | Summon Elemental | equippableItem | Fi8plai5LkNJGnNE |
| Rigging/Drive / Fly Skills/Drive Test | XeDvGfyyLWIV3W6d | Drive Test | equippableItem | wpNVoTaalbsoL0Lv |
| Rigging/Drive / Fly Skills/Fly Test | 9r3BqvpSWhMDaOea | Fly Test | equippableItem | wpNVoTaalbsoL0Lv |
| Rigging/Drive / Fly Skills/OverDrive | D2MVrqrWzJz1gzHi | OverDrive | equippableItem | wpNVoTaalbsoL0Lv |
| Rigging/Drive / Fly Skills/OverFly | osyORzOHrscc27l5 | OverFly | equippableItem | wpNVoTaalbsoL0Lv |
| Rigging/Drone Weapons/Autocannon | pgnn8Bj8C1NwNani | Autocannon | equippableItem | Ts6jM2x9mZugV8R4 |
| Rigging/Drone Weapons/Dazzleray | cUyOhkMFHDKJaoTv | Dazzleray | equippableItem | Ts6jM2x9mZugV8R4 |
| Rigging/Drone Weapons/Grenade Launcher | qqR35Es8BrDxGtdN | Grenade Launcher | equippableItem | Ts6jM2x9mZugV8R4 |
| Rigging/Drone Weapons/Heavy Swell | VlKxbR4O9PAjKPlt | Heavy Swell | equippableItem | Ts6jM2x9mZugV8R4 |
| Rigging/Drone Weapons/Mini gun | UjON0AYL52oPkkV1 | Mini gun | equippableItem | Ts6jM2x9mZugV8R4 |
| Rigging/Drone Weapons/Missile Launcher | w5YJ9JQJ7RZoEYoR | Missile Launcher | equippableItem | Ts6jM2x9mZugV8R4 |
| Rigging/Drone Weapons/Oil Slick | eNdj5MZgMVFb6RuU | Oil Slick | equippableItem | Ts6jM2x9mZugV8R4 |
| Rigging/Drone Weapons/Particle Projectile Cannon | PpC6UAT4zduBN1JO | Particle Projectile Cannon | equippableItem | Ts6jM2x9mZugV8R4 |
| Rigging/Drone Weapons/Pulse Minigun | vTQqSWLjjgrjOWNo | Pulse Minigun | equippableItem | Ts6jM2x9mZugV8R4 |
| Rigging/Drone Weapons/Pulse Rifle | ym0IkelGLpxsvuI9 | Pulse Rifle | equippableItem | Ts6jM2x9mZugV8R4 |
| Rigging/Drone Weapons/Railgun | qsCaLt48mRGOee5a | Railgun | equippableItem | Ts6jM2x9mZugV8R4 |
| Rigging/Drone Weapons/Recoilless Gun | dwlzDpgJn2neQNoH | Recoilless Gun | equippableItem | Ts6jM2x9mZugV8R4 |
| Rigging/Drone Weapons/Recoilless Rifle | TsowecCMZQ6f430o | Recoilless Rifle | equippableItem | Ts6jM2x9mZugV8R4 |
| Rigging/Drone Weapons/Sentry Gun | X1212y9y0s2goiHv | Sentry Gun | equippableItem | Ts6jM2x9mZugV8R4 |
| Rigging/Drone Weapons/Smokescreen | 6uAvCA8vSKXWrCoO | Smokescreen | equippableItem | Ts6jM2x9mZugV8R4 |
| Rigging/Drone Weapons/Sonic Disruption | RN9PjdKiUr8W2tiL | Sonic Disruption | equippableItem | Ts6jM2x9mZugV8R4 |
| Rigging/Drones/Aerial Warden | j2TO3k0UCvhq0zMp | Aerial Warden | equippableItem | DswGzl1e1TynhREL |
| Rigging/Drones/Anthrobrute | Cmiv9ISEWVXlfIep | Anthrobrute | equippableItem | DswGzl1e1TynhREL |
| Rigging/Drones/Anthrodroid | O1BeA1bQVwldwFjM | Anthrodroid | equippableItem | DswGzl1e1TynhREL |
| Rigging/Drones/Bug-Spy | sHUxTiNfIMWKLLpU | Bug-Spy | equippableItem | DswGzl1e1TynhREL |
| Rigging/Drones/Disc | 88t9RA3Lr03dK5FA | Disc | equippableItem | DswGzl1e1TynhREL |
| Rigging/Drones/Dog-Patrol Drone | NTIuILjbu1ZRXzdO | Dog-Patrol Drone | equippableItem | DswGzl1e1TynhREL |
| Rigging/Drones/Gladiator | 7UnpG6sa1ERc4quJ | Gladiator | equippableItem | DswGzl1e1TynhREL |
| Rigging/Drones/Hawk | juM3IWGwmAWwNsNU | Hawk | equippableItem | DswGzl1e1TynhREL |
| Rigging/Drones/Mobile Sentinel | O7LxMs1Xzm3zR6cd | Mobile Sentinel | equippableItem | DswGzl1e1TynhREL |
| Rigging/Drones/Orb | IWWXsOuVPxSJzFTd | Orb | equippableItem | DswGzl1e1TynhREL |
| Rigging/Drones/Roto-Drone | noRkOeDYXhGrqcw6 | Roto-Drone | equippableItem | DswGzl1e1TynhREL |
| Rigging/Drones/Shield Drone | N0nGXBPq2IZtEQhK | Shield Drone | equippableItem | DswGzl1e1TynhREL |
| Rigging/Drones/Shield-Wall Drone | 4yjS4jBEs3quNMix | Shield-Wall Drone | equippableItem | DswGzl1e1TynhREL |
| Rigging/Drones/VSTOL Bird | M7So1h7MRAT1YZg6 | VSTOL Bird | equippableItem | DswGzl1e1TynhREL |
| Rigging/VCR/Advanced VCR | CEbtVznH20MTfOMq | Advanced VCR | equippableItem | d3QnO994LfRud9yy |
| Rigging/VCR/Basic VCR | LscCW4itUp2kDBcW | Basic VCR | equippableItem | d3QnO994LfRud9yy |
| Rigging/VCR/Master VCR | 9KGkTsyVjFvsGlQB | Master VCR | equippableItem | d3QnO994LfRud9yy |
| Rigging/Vehicle Weapons/25mm Cannon | AOzKYI8tzM42kLgc | 25mm Cannon | equippableItem | 17SxKReYD26TEIrd |
| Rigging/Vehicle Weapons/30mm Cannon | bbz11AaRqOPO81U0 | 30mm Cannon | equippableItem | 17SxKReYD26TEIrd |
| Rigging/Vehicle Weapons/Autocannons | ykFPEIiHMrOI37CP | Autocannons | equippableItem | 17SxKReYD26TEIrd |
| Rigging/Vehicle Weapons/Machine Guns | xP2eZsJJHNzoVAPS | Machine Guns | equippableItem | 17SxKReYD26TEIrd |
| Rigging/Vehicle Weapons/Missile Launcher | 2ePOa0yQDvIUycaz | Missile Launcher | equippableItem | 17SxKReYD26TEIrd |
| Rigging/Vehicle Weapons/Oil Slick | GumvtgZjJAiTLSvS | Oil Slick | equippableItem | 17SxKReYD26TEIrd |
| Rigging/Vehicle Weapons/Particle Projection Cannon | 9TZCWyKWwDZPmGzQ | Particle Projection Cannon | equippableItem | 17SxKReYD26TEIrd |
| Rigging/Vehicle Weapons/Plasma Cannons | 7QVxicRmXZLS4HNk | Plasma Cannons | equippableItem | 17SxKReYD26TEIrd |
| Rigging/Vehicle Weapons/Pulse Cannon | pP9E1ZOT9RBk5xwe | Pulse Cannon | equippableItem | 17SxKReYD26TEIrd |
| Rigging/Vehicle Weapons/Railgun | 0ypLeyA8IH9bQUzZ | Railgun | equippableItem | 17SxKReYD26TEIrd |
| Rigging/Vehicle Weapons/Rocket Propelled Grenade Launcher | lulF2OYD9eevBZ8v | Rocket Propelled Grenade Launcher | equippableItem | 17SxKReYD26TEIrd |
| Rigging/Vehicle Weapons/Tactical Tsunami | ZwGjyDbtc10lzfqt | Tactical Tsunami | equippableItem | 17SxKReYD26TEIrd |
| Rigging/Vehicle Weapons/Tank Cannon | Sw5LolCVrO7vGX75 | Tank Cannon | equippableItem | 17SxKReYD26TEIrd |
| Rigging/Vehicle Weapons/Vulcan Cannon | zU4IZrnZmb7Mmxc3 | Vulcan Cannon | equippableItem | 17SxKReYD26TEIrd |
| Rigging/Vehicles/Armored Car | iF76z6HNwoe7KFDM | Armored Car | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Battle Cycle | Lbykgev8L1eM42l2 | Battle Cycle | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Cargo Heli | pVrVqEfRZYveTYqx | Cargo Heli | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Chopper | CnzRIbXniQf9JF3q | Chopper | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Delivery Van | CbUwPb2OlX1tVQO8 | Delivery Van | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Family Sedan | IcoAJ9g1kdBLfNgP | Family Sedan | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Limo | SKhFtaxNq8qNDBBg | Limo | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Luxury Sedan | szksglBlzFRLHTcL | Luxury Sedan | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Luxury Van | YjAu5xvT1EctHL3f | Luxury Van | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Motorcycle | c2M82No6wNHg2rjr | Motorcycle | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Nightwing | Ia1ZF9O89cNtK8v9 | Nightwing | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Patrol Boat | SqYhlebJcOUP0JOG | Patrol Boat | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Pickup | UqPgsRmU7wP6CJFr | Pickup | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Racing Bike | Z1Yju9ro1qZ6tiKM | Racing Bike | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Seaplane | 3wxbKv1qbF78RPiZ | Seaplane | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Seaplane | sB4bCmeH6O5UgRC6 | Seaplane | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Skate | 6ne6fzg1iDEfs4Ml | Skate | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Small Boat | vNwPr9TXEX6ocKpd | Small Boat | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Speedboat | truw72AdxFdTcjbK | Speedboat | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Sports Car | v5eSV1dG8L5hVWiM | Sports Car | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Sports Sedan | vzsVDNUQTQPnqmAx | Sports Sedan | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Transport Heli | VTACzqAhjIWQaMEB | Transport Heli | equippableItem | ic8w75E9GFrktS4x |
| Rigging/Vehicles/Two-Seater | 0f6uWLCvtOmijcT8 | Two-Seater | equippableItem | ic8w75E9GFrktS4x |
| Weapons/Energy/Neon Fang | DVSf33GWdiNKYoD5 | Neon Fang | equippableItem | fFGfPC4Uqyeabnvo |
| Weapons/Energy/Photon Reaver Ei-7 | n5dCqzXOOBOTEgkH | Photon Reaver Ei-7 | equippableItem | fFGfPC4Uqyeabnvo |
| Weapons/Energy/Thunderbolt Vanguard | 5iMNTMh5UCx0ushc | Thunderbolt Vanguard | equippableItem | fFGfPC4Uqyeabnvo |
| Weapons/Firearms/450 Tek-Urban | GFmWuFB6xJb7arB7 | 450 Tek-Urban | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/Defender | iPJklFqcxXQnpixG | Defender | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/DV-662 Devotion | YKwbzBeRrnfrS9Zz | DV-662 Devotion | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/Hardliner | ffPDvZYRKOHN590W | Hardliner | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/Highwayman | L9Hlqu934i6AKgv6 | Highwayman | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/Ironbark SMT | KHE8xKFdz5m1mlUP | Ironbark SMT | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/Kaos-9x | kMSGhNzJlURbWBpW | Kaos-9x | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/KL-.89 Klaw | lpRyorx71E3kFHKF | KL-.89 Klaw | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/Reaper | Rbrsv9QfRM6o4IxF | Reaper | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/Ripper | 6EXDTul4GijPoeeG | Ripper | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/S-U Epsilon 'Sunshine' | NPEOlxwi2waNG2FE | S-U Epsilon 'Sunshine' | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/Sentinel | bosPZcSjee0l9ZWG | Sentinel | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/Slimline Defender | wFCxw3ImuSKXPOIM | Slimline Defender | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/Syncsight Hunter | xa7tHLKTrGmQIcwd | Syncsight Hunter | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/Tiger Beat | BxYCAIPNbh6CIVSp | Tiger Beat | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/TRGT-9 "Target" | 3u6oWFldM7Nv7n5t | TRGT-9 "Target" | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/V-100 Vigilant | FZlN9lqdBemx6Gf8 | V-100 Vigilant | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/Viper | Wn66N0hrwd7LmQpE | Viper | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Firearms/Warhammer H40mm-ER | NOcsV7VXP4o0ck0k | Warhammer H40mm-ER | equippableItem | 5KWDwkU23whetOIV |
| Weapons/Melee/Arm-Blades | 0daOJGQ48dXnHZZa | Arm-Blades | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Axe | BTW4PyIim7prBcFE | Axe | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Baton | lH75H9fJrqbo5Z2r | Baton | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Brass Knuckles | 4ZCs36PxolFYXO14 | Brass Knuckles | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Cudgel | accqdYWCGWA6nDEW | Cudgel | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Iron Fist (Amp) | degDSYZ7eHq0PLlw | Iron Fist (Amp) | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Katana | nwhegwvxSNdLg9d1 | Katana | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Knife | GlwaJ3s2mcJ8ePV9 | Knife | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Monofilament Whip | FGjswkp0rdvBToet | Monofilament Whip | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Plasma Axe | HrhTRoAFwRLdDA3s | Plasma Axe | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Plasma Sword | 2i5n6ftVc1kAeuVp | Plasma Sword | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Polearm | bpqgdDGmy6sUhMjM | Polearm | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Power Fist | iitakviAjKbnUk89 | Power Fist | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Sickstick | 6qCMcLsrUfUcZMEn | Sickstick | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Staff | kSVBE0zHnrlsOybT | Staff | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Stun Baton | lqVM9pAttbThHlQ0 | Stun Baton | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Sword | 4ywbbdZWhPkxPscf | Sword | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Vibroaxe | Xh0YY8FoHfTksUTL | Vibroaxe | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Melee/Vibrosword | eDo0cyA310ehtqu0 | Vibrosword | equippableItem | aHRmcytEr2emGb1Y |
| Weapons/Projectile/Compound Bow | 8CBpDFpd7hMOxStt | Compound Bow | equippableItem | 9kmoBQyRvIQEoTi1 |
| Weapons/Projectile/Crossbow | WB3YQ6dJoAvis6xp | Crossbow | equippableItem | 9kmoBQyRvIQEoTi1 |
| Weapons/Projectile/Heavy Crossbow | OVi2ocSSjHJRtwKi | Heavy Crossbow | equippableItem | 9kmoBQyRvIQEoTi1 |
| Weapons/Projectile/Light Crossbow | FrfP5RFJPkTIF2zN | Light Crossbow | equippableItem | 9kmoBQyRvIQEoTi1 |
| Weapons/Thrown/Explosive Grenade | l5AGZbNMPAsfNhUM | Explosive Grenade | equippableItem | rpm8CmOJ32570KoC |
| Weapons/Thrown/Incendiary Grenade | ifQfoPyLKRbY9tic | Incendiary Grenade | equippableItem | rpm8CmOJ32570KoC |
| Weapons/Thrown/Knife | 2Y7bqp8oi16DoAAy | Knife | equippableItem | rpm8CmOJ32570KoC |
| Weapons/Thrown/Shock Grenade | 9GvjupjpEfsoK0iZ | Shock Grenade | equippableItem | rpm8CmOJ32570KoC |
| Weapons/Thrown/Shuriken | 3KE2WlZwBRFGUmb1 | Shuriken | equippableItem | rpm8CmOJ32570KoC |
| Weapons/Thrown/Smoke Grenade | ArS7o2qlHKKBMEnq | Smoke Grenade | equippableItem | rpm8CmOJ32570KoC |

## Machine Data (JSON)
```json
{
  "format": "sinlesscsb-folder-tree-v2",
  "world": {
    "id": "sinless",
    "title": "PacificNorthWestMarches"
  },
  "generatedAtISO": "2026-02-15T16:49:23.486Z",
  "guidance": "Use folderId + parentFolderId for hierarchy; do not infer hierarchy solely from indentation.",
  "actor": {
    "filter": {
      "topLevelFolderNames": [
        "PCs",
        "NPCs",
        "DroneHangar",
        "VehicleHangar",
        "Templates"
      ],
      "includeUnfoldered": false
    },
    "folders": [
      {
        "folderId": "C9SZJMPMSIoSKI67",
        "uuid": "Folder.C9SZJMPMSIoSKI67",
        "docType": "Actor",
        "name": "DroneHangar",
        "parentFolderId": null,
        "depth": 0,
        "sort": -25000,
        "sorting": "a",
        "path": "DroneHangar"
      },
      {
        "folderId": "p6hbQkfl32SKkvGO",
        "uuid": "Folder.p6hbQkfl32SKkvGO",
        "docType": "Actor",
        "name": "NPCs",
        "parentFolderId": null,
        "depth": 0,
        "sort": -50000,
        "sorting": "a",
        "path": "NPCs"
      },
      {
        "folderId": "bGGgYtFXJvPyXTLo",
        "uuid": "Folder.bGGgYtFXJvPyXTLo",
        "docType": "Actor",
        "name": "PCs",
        "parentFolderId": null,
        "depth": 0,
        "sort": -100000,
        "sorting": "a",
        "path": "PCs"
      },
      {
        "folderId": "eJiZ5ojJouMYFr9R",
        "uuid": "Folder.eJiZ5ojJouMYFr9R",
        "docType": "Actor",
        "name": "Templates",
        "parentFolderId": null,
        "depth": 0,
        "sort": -18750,
        "sorting": "a",
        "path": "Templates"
      },
      {
        "folderId": "I8VLhxriauMW5wH0",
        "uuid": "Folder.I8VLhxriauMW5wH0",
        "docType": "Actor",
        "name": "VehicleHangar",
        "parentFolderId": null,
        "depth": 0,
        "sort": -21875,
        "sorting": "a",
        "path": "VehicleHangar"
      },
      {
        "folderId": "bO6yVDTjF5UQw2ZU",
        "uuid": "Folder.bO6yVDTjF5UQw2ZU",
        "docType": "Actor",
        "name": "Animals",
        "parentFolderId": "p6hbQkfl32SKkvGO",
        "depth": 1,
        "sort": 0,
        "sorting": "a",
        "path": "NPCs/Animals"
      },
      {
        "folderId": "w2u228ARPzSzv5YK",
        "uuid": "Folder.w2u228ARPzSzv5YK",
        "docType": "Actor",
        "name": "Drones",
        "parentFolderId": "p6hbQkfl32SKkvGO",
        "depth": 1,
        "sort": 0,
        "sorting": "a",
        "path": "NPCs/Drones"
      },
      {
        "folderId": "p8IVu82dgB2UKnoT",
        "uuid": "Folder.p8IVu82dgB2UKnoT",
        "docType": "Actor",
        "name": "Goons",
        "parentFolderId": "p6hbQkfl32SKkvGO",
        "depth": 1,
        "sort": 0,
        "sorting": "a",
        "path": "NPCs/Goons"
      },
      {
        "folderId": "N3RsHmS7ZofXCTDB",
        "uuid": "Folder.N3RsHmS7ZofXCTDB",
        "docType": "Actor",
        "name": "Iniquitates",
        "parentFolderId": "p6hbQkfl32SKkvGO",
        "depth": 1,
        "sort": 0,
        "sorting": "a",
        "path": "NPCs/Iniquitates"
      },
      {
        "folderId": "OHGJHoWG4unr64QM",
        "uuid": "Folder.OHGJHoWG4unr64QM",
        "docType": "Actor",
        "name": "Programs",
        "parentFolderId": "p6hbQkfl32SKkvGO",
        "depth": 1,
        "sort": 0,
        "sorting": "a",
        "path": "NPCs/Programs"
      },
      {
        "folderId": "ZMsiW2FSdQ2KSvnq",
        "uuid": "Folder.ZMsiW2FSdQ2KSvnq",
        "docType": "Actor",
        "name": "Spirits",
        "parentFolderId": "p6hbQkfl32SKkvGO",
        "depth": 1,
        "sort": 0,
        "sorting": "a",
        "path": "NPCs/Spirits"
      },
      {
        "folderId": "T2tb1RlCWPfkdVR5",
        "uuid": "Folder.T2tb1RlCWPfkdVR5",
        "docType": "Actor",
        "name": "pcControlled",
        "parentFolderId": "bGGgYtFXJvPyXTLo",
        "depth": 1,
        "sort": 0,
        "sorting": "a",
        "path": "PCs/pcControlled"
      },
      {
        "folderId": "tlB8baeczfAB1tEw",
        "uuid": "Folder.tlB8baeczfAB1tEw",
        "docType": "Actor",
        "name": "PreGens",
        "parentFolderId": "bGGgYtFXJvPyXTLo",
        "depth": 1,
        "sort": 0,
        "sorting": "a",
        "path": "PCs/PreGens"
      }
    ],
    "documents": [
      {
        "documentId": "2vh1c8FVTf6cBwtE",
        "uuid": "Actor.2vh1c8FVTf6cBwtE",
        "docType": "Actor",
        "subtype": "character",
        "name": "Aerial Warden",
        "folderId": "C9SZJMPMSIoSKI67",
        "folderPath": "DroneHangar",
        "path": "DroneHangar/Aerial Warden",
        "sort": 0
      },
      {
        "documentId": "tluL0tIn8eARzMwa",
        "uuid": "Actor.tluL0tIn8eARzMwa",
        "docType": "Actor",
        "subtype": "character",
        "name": "Anthrobrute",
        "folderId": "C9SZJMPMSIoSKI67",
        "folderPath": "DroneHangar",
        "path": "DroneHangar/Anthrobrute",
        "sort": 0
      },
      {
        "documentId": "btyAqEbWpT9FbmGH",
        "uuid": "Actor.btyAqEbWpT9FbmGH",
        "docType": "Actor",
        "subtype": "character",
        "name": "Anthrodroid",
        "folderId": "C9SZJMPMSIoSKI67",
        "folderPath": "DroneHangar",
        "path": "DroneHangar/Anthrodroid",
        "sort": 0
      },
      {
        "documentId": "35HRFJoHgWTt3x8f",
        "uuid": "Actor.35HRFJoHgWTt3x8f",
        "docType": "Actor",
        "subtype": "character",
        "name": "Bug-Spy",
        "folderId": "C9SZJMPMSIoSKI67",
        "folderPath": "DroneHangar",
        "path": "DroneHangar/Bug-Spy",
        "sort": 0
      },
      {
        "documentId": "KMXnuSsA1IEnSivh",
        "uuid": "Actor.KMXnuSsA1IEnSivh",
        "docType": "Actor",
        "subtype": "character",
        "name": "Disc",
        "folderId": "C9SZJMPMSIoSKI67",
        "folderPath": "DroneHangar",
        "path": "DroneHangar/Disc",
        "sort": 0
      },
      {
        "documentId": "32ejekBhTDE5cOSF",
        "uuid": "Actor.32ejekBhTDE5cOSF",
        "docType": "Actor",
        "subtype": "character",
        "name": "Dog-Patrol Drone",
        "folderId": "C9SZJMPMSIoSKI67",
        "folderPath": "DroneHangar",
        "path": "DroneHangar/Dog-Patrol Drone",
        "sort": 0
      },
      {
        "documentId": "Kvr6pUqEwt73QXcs",
        "uuid": "Actor.Kvr6pUqEwt73QXcs",
        "docType": "Actor",
        "subtype": "character",
        "name": "Gladiator",
        "folderId": "C9SZJMPMSIoSKI67",
        "folderPath": "DroneHangar",
        "path": "DroneHangar/Gladiator",
        "sort": 0
      },
      {
        "documentId": "q3Udsyg7zovQ5FoD",
        "uuid": "Actor.q3Udsyg7zovQ5FoD",
        "docType": "Actor",
        "subtype": "character",
        "name": "Hawk",
        "folderId": "C9SZJMPMSIoSKI67",
        "folderPath": "DroneHangar",
        "path": "DroneHangar/Hawk",
        "sort": 0
      },
      {
        "documentId": "1fJQnIQ76TnvqdAz",
        "uuid": "Actor.1fJQnIQ76TnvqdAz",
        "docType": "Actor",
        "subtype": "character",
        "name": "Mobile Sentinel",
        "folderId": "C9SZJMPMSIoSKI67",
        "folderPath": "DroneHangar",
        "path": "DroneHangar/Mobile Sentinel",
        "sort": 0
      },
      {
        "documentId": "Fn9V6LmM5QzdLAkY",
        "uuid": "Actor.Fn9V6LmM5QzdLAkY",
        "docType": "Actor",
        "subtype": "character",
        "name": "Orb",
        "folderId": "C9SZJMPMSIoSKI67",
        "folderPath": "DroneHangar",
        "path": "DroneHangar/Orb",
        "sort": 0
      },
      {
        "documentId": "QMHLg5Nh2Qub92O5",
        "uuid": "Actor.QMHLg5Nh2Qub92O5",
        "docType": "Actor",
        "subtype": "character",
        "name": "Roto-Drone",
        "folderId": "C9SZJMPMSIoSKI67",
        "folderPath": "DroneHangar",
        "path": "DroneHangar/Roto-Drone",
        "sort": 0
      },
      {
        "documentId": "hZummIxj1gYPgpOg",
        "uuid": "Actor.hZummIxj1gYPgpOg",
        "docType": "Actor",
        "subtype": "character",
        "name": "Shield Drone",
        "folderId": "C9SZJMPMSIoSKI67",
        "folderPath": "DroneHangar",
        "path": "DroneHangar/Shield Drone",
        "sort": 0
      },
      {
        "documentId": "JOnBPPrrMCimY5wx",
        "uuid": "Actor.JOnBPPrrMCimY5wx",
        "docType": "Actor",
        "subtype": "character",
        "name": "Shield-Wall Drone",
        "folderId": "C9SZJMPMSIoSKI67",
        "folderPath": "DroneHangar",
        "path": "DroneHangar/Shield-Wall Drone",
        "sort": 0
      },
      {
        "documentId": "HK9rSt7Bw28kC91e",
        "uuid": "Actor.HK9rSt7Bw28kC91e",
        "docType": "Actor",
        "subtype": "character",
        "name": "VSTOL Bird",
        "folderId": "C9SZJMPMSIoSKI67",
        "folderPath": "DroneHangar",
        "path": "DroneHangar/VSTOL Bird",
        "sort": 0
      },
      {
        "documentId": "8S6qaeWInLOl4qc4",
        "uuid": "Actor.8S6qaeWInLOl4qc4",
        "docType": "Actor",
        "subtype": "character",
        "name": "Bear",
        "folderId": "bO6yVDTjF5UQw2ZU",
        "folderPath": "NPCs/Animals",
        "path": "NPCs/Animals/Bear",
        "sort": 0
      },
      {
        "documentId": "BWA3pls6uk73KGlq",
        "uuid": "Actor.BWA3pls6uk73KGlq",
        "docType": "Actor",
        "subtype": "character",
        "name": "Cat",
        "folderId": "bO6yVDTjF5UQw2ZU",
        "folderPath": "NPCs/Animals",
        "path": "NPCs/Animals/Cat",
        "sort": 0
      },
      {
        "documentId": "ClylecXaREys3eYe",
        "uuid": "Actor.ClylecXaREys3eYe",
        "docType": "Actor",
        "subtype": "character",
        "name": "Dog",
        "folderId": "bO6yVDTjF5UQw2ZU",
        "folderPath": "NPCs/Animals",
        "path": "NPCs/Animals/Dog",
        "sort": 0
      },
      {
        "documentId": "0uZ2brFL5XVRcPPC",
        "uuid": "Actor.0uZ2brFL5XVRcPPC",
        "docType": "Actor",
        "subtype": "character",
        "name": "Elephant",
        "folderId": "bO6yVDTjF5UQw2ZU",
        "folderPath": "NPCs/Animals",
        "path": "NPCs/Animals/Elephant",
        "sort": 0
      },
      {
        "documentId": "ZItdsgolntxNF8p0",
        "uuid": "Actor.ZItdsgolntxNF8p0",
        "docType": "Actor",
        "subtype": "character",
        "name": "Gorilla",
        "folderId": "bO6yVDTjF5UQw2ZU",
        "folderPath": "NPCs/Animals",
        "path": "NPCs/Animals/Gorilla",
        "sort": 0
      },
      {
        "documentId": "AOBith7wwuUmP7VP",
        "uuid": "Actor.AOBith7wwuUmP7VP",
        "docType": "Actor",
        "subtype": "character",
        "name": "Hawk",
        "folderId": "bO6yVDTjF5UQw2ZU",
        "folderPath": "NPCs/Animals",
        "path": "NPCs/Animals/Hawk",
        "sort": 0
      },
      {
        "documentId": "PF0aRBByTy67TOdS",
        "uuid": "Actor.PF0aRBByTy67TOdS",
        "docType": "Actor",
        "subtype": "character",
        "name": "Horse",
        "folderId": "bO6yVDTjF5UQw2ZU",
        "folderPath": "NPCs/Animals",
        "path": "NPCs/Animals/Horse",
        "sort": 0
      },
      {
        "documentId": "M1QAEppPYWtjhe1Q",
        "uuid": "Actor.M1QAEppPYWtjhe1Q",
        "docType": "Actor",
        "subtype": "character",
        "name": "Wildcat/Panther",
        "folderId": "bO6yVDTjF5UQw2ZU",
        "folderPath": "NPCs/Animals",
        "path": "NPCs/Animals/Wildcat/Panther",
        "sort": 0
      },
      {
        "documentId": "HHSCId1xRVp5z8gw",
        "uuid": "Actor.HHSCId1xRVp5z8gw",
        "docType": "Actor",
        "subtype": "character",
        "name": "Wolf",
        "folderId": "bO6yVDTjF5UQw2ZU",
        "folderPath": "NPCs/Animals",
        "path": "NPCs/Animals/Wolf",
        "sort": 0
      },
      {
        "documentId": "WACnBF6xJEpVXLJW",
        "uuid": "Actor.WACnBF6xJEpVXLJW",
        "docType": "Actor",
        "subtype": "character",
        "name": "Citizen Aid Drone (Anthrodroid)",
        "folderId": "w2u228ARPzSzv5YK",
        "folderPath": "NPCs/Drones",
        "path": "NPCs/Drones/Citizen Aid Drone (Anthrodroid)",
        "sort": 0
      },
      {
        "documentId": "i6aGaAYoyv5IhaMk",
        "uuid": "Actor.i6aGaAYoyv5IhaMk",
        "docType": "Actor",
        "subtype": "character",
        "name": "Orb Turret (Orb)",
        "folderId": "w2u228ARPzSzv5YK",
        "folderPath": "NPCs/Drones",
        "path": "NPCs/Drones/Orb Turret (Orb)",
        "sort": 0
      },
      {
        "documentId": "qmj9R05UI6Nfw1ep",
        "uuid": "Actor.qmj9R05UI6Nfw1ep",
        "docType": "Actor",
        "subtype": "character",
        "name": "Stationary Turret - Autocannon",
        "folderId": "w2u228ARPzSzv5YK",
        "folderPath": "NPCs/Drones",
        "path": "NPCs/Drones/Stationary Turret - Autocannon",
        "sort": 0
      },
      {
        "documentId": "0e3viE19AKyJomoy",
        "uuid": "Actor.0e3viE19AKyJomoy",
        "docType": "Actor",
        "subtype": "character",
        "name": "Stormtrooper Drones (Anthrobrute)",
        "folderId": "w2u228ARPzSzv5YK",
        "folderPath": "NPCs/Drones",
        "path": "NPCs/Drones/Stormtrooper Drones (Anthrobrute)",
        "sort": 0
      },
      {
        "documentId": "RQKHlqg6Jh3eHUdU",
        "uuid": "Actor.RQKHlqg6Jh3eHUdU",
        "docType": "Actor",
        "subtype": "character",
        "name": "Talos (Gladiator)",
        "folderId": "w2u228ARPzSzv5YK",
        "folderPath": "NPCs/Drones",
        "path": "NPCs/Drones/Talos (Gladiator)",
        "sort": 0
      },
      {
        "documentId": "5owR2J5jTBBx243h",
        "uuid": "Actor.5owR2J5jTBBx243h",
        "docType": "Actor",
        "subtype": "character",
        "name": "Mall Cop",
        "folderId": "p8IVu82dgB2UKnoT",
        "folderPath": "NPCs/Goons",
        "path": "NPCs/Goons/Mall Cop",
        "sort": 0
      },
      {
        "documentId": "ZCuiAfQTed3YgLqj",
        "uuid": "Actor.ZCuiAfQTed3YgLqj",
        "docType": "Actor",
        "subtype": "character",
        "name": "Security Personnel",
        "folderId": "p8IVu82dgB2UKnoT",
        "folderPath": "NPCs/Goons",
        "path": "NPCs/Goons/Security Personnel",
        "sort": 0
      },
      {
        "documentId": "8Jy0Egk4NFRRDPbL",
        "uuid": "Actor.8Jy0Egk4NFRRDPbL",
        "docType": "Actor",
        "subtype": "character",
        "name": "Stormtroopers",
        "folderId": "p8IVu82dgB2UKnoT",
        "folderPath": "NPCs/Goons",
        "path": "NPCs/Goons/Stormtroopers",
        "sort": 0
      },
      {
        "documentId": "doukrqZ3qHeyFnGO",
        "uuid": "Actor.doukrqZ3qHeyFnGO",
        "docType": "Actor",
        "subtype": "character",
        "name": "Street Cop",
        "folderId": "p8IVu82dgB2UKnoT",
        "folderPath": "NPCs/Goons",
        "path": "NPCs/Goons/Street Cop",
        "sort": 0
      },
      {
        "documentId": "KpdfJNI181fAqT3O",
        "uuid": "Actor.KpdfJNI181fAqT3O",
        "docType": "Actor",
        "subtype": "character",
        "name": "Street Thug",
        "folderId": "p8IVu82dgB2UKnoT",
        "folderPath": "NPCs/Goons",
        "path": "NPCs/Goons/Street Thug",
        "sort": 0
      },
      {
        "documentId": "uxu1jGg3oE4BSE19",
        "uuid": "Actor.uxu1jGg3oE4BSE19",
        "docType": "Actor",
        "subtype": "character",
        "name": "Street Thug, Armed",
        "folderId": "p8IVu82dgB2UKnoT",
        "folderPath": "NPCs/Goons",
        "path": "NPCs/Goons/Street Thug, Armed",
        "sort": 0
      },
      {
        "documentId": "BKaLlFGTV0nrvZEm",
        "uuid": "Actor.BKaLlFGTV0nrvZEm",
        "docType": "Actor",
        "subtype": "character",
        "name": "Street Thug, Lieutenant",
        "folderId": "p8IVu82dgB2UKnoT",
        "folderPath": "NPCs/Goons",
        "path": "NPCs/Goons/Street Thug, Lieutenant",
        "sort": 0
      },
      {
        "documentId": "DmxBBuPGu7Qn6SYi",
        "uuid": "Actor.DmxBBuPGu7Qn6SYi",
        "docType": "Actor",
        "subtype": "character",
        "name": "Alzebo",
        "folderId": "N3RsHmS7ZofXCTDB",
        "folderPath": "NPCs/Iniquitates",
        "path": "NPCs/Iniquitates/Alzebo",
        "sort": 0
      },
      {
        "documentId": "bdEn1g74T6R9eZCp",
        "uuid": "Actor.bdEn1g74T6R9eZCp",
        "docType": "Actor",
        "subtype": "character",
        "name": "Deodand",
        "folderId": "N3RsHmS7ZofXCTDB",
        "folderPath": "NPCs/Iniquitates",
        "path": "NPCs/Iniquitates/Deodand",
        "sort": 0
      },
      {
        "documentId": "eAvD0hNiHmKJUF1J",
        "uuid": "Actor.eAvD0hNiHmKJUF1J",
        "docType": "Actor",
        "subtype": "character",
        "name": "Refuse Goblins",
        "folderId": "N3RsHmS7ZofXCTDB",
        "folderPath": "NPCs/Iniquitates",
        "path": "NPCs/Iniquitates/Refuse Goblins",
        "sort": 0
      },
      {
        "documentId": "WV8ywxnHfXd7813a",
        "uuid": "Actor.WV8ywxnHfXd7813a",
        "docType": "Actor",
        "subtype": "character",
        "name": "Belligerent Engram Eradicators (Bees)",
        "folderId": "OHGJHoWG4unr64QM",
        "folderPath": "NPCs/Programs",
        "path": "NPCs/Programs/Belligerent Engram Eradicators (Bees)",
        "sort": 0
      },
      {
        "documentId": "vF1UCqQkxwI5Bkfp",
        "uuid": "Actor.vF1UCqQkxwI5Bkfp",
        "docType": "Actor",
        "subtype": "character",
        "name": "Defensive Daemon",
        "folderId": "OHGJHoWG4unr64QM",
        "folderPath": "NPCs/Programs",
        "path": "NPCs/Programs/Defensive Daemon",
        "sort": 0
      },
      {
        "documentId": "cGwZZjJycrDZeByR",
        "uuid": "Actor.cGwZZjJycrDZeByR",
        "docType": "Actor",
        "subtype": "character",
        "name": "Reconstruct Network Integrity Daemon (RNID)",
        "folderId": "OHGJHoWG4unr64QM",
        "folderPath": "NPCs/Programs",
        "path": "NPCs/Programs/Reconstruct Network Integrity Daemon (RNID)",
        "sort": 0
      },
      {
        "documentId": "NDqQGQkb1BlQNDMZ",
        "uuid": "Actor.NDqQGQkb1BlQNDMZ",
        "docType": "Actor",
        "subtype": "character",
        "name": "Sensor Daemon",
        "folderId": "OHGJHoWG4unr64QM",
        "folderPath": "NPCs/Programs",
        "path": "NPCs/Programs/Sensor Daemon",
        "sort": 0
      },
      {
        "documentId": "fO0ipCs30IlbIyJn",
        "uuid": "Actor.fO0ipCs30IlbIyJn",
        "docType": "Actor",
        "subtype": "character",
        "name": "Warrior Agent Security Patrol (Wasps)",
        "folderId": "OHGJHoWG4unr64QM",
        "folderPath": "NPCs/Programs",
        "path": "NPCs/Programs/Warrior Agent Security Patrol (Wasps)",
        "sort": 0
      },
      {
        "documentId": "U8ITLI4BCWctTKnY",
        "uuid": "Actor.U8ITLI4BCWctTKnY",
        "docType": "Actor",
        "subtype": "character",
        "name": "Session Settings",
        "folderId": "p6hbQkfl32SKkvGO",
        "folderPath": "NPCs",
        "path": "NPCs/Session Settings",
        "sort": 200000
      },
      {
        "documentId": "l3fWGM4RfBzM6mk4",
        "uuid": "Actor.l3fWGM4RfBzM6mk4",
        "docType": "Actor",
        "subtype": "character",
        "name": "Aqua Deambulatio",
        "folderId": "ZMsiW2FSdQ2KSvnq",
        "folderPath": "NPCs/Spirits",
        "path": "NPCs/Spirits/Aqua Deambulatio",
        "sort": 0
      },
      {
        "documentId": "FVj98iE0FcyVCtcx",
        "uuid": "Actor.FVj98iE0FcyVCtcx",
        "docType": "Actor",
        "subtype": "character",
        "name": "Attash Aazaar",
        "folderId": "ZMsiW2FSdQ2KSvnq",
        "folderPath": "NPCs/Spirits",
        "path": "NPCs/Spirits/Attash Aazaar",
        "sort": 0
      },
      {
        "documentId": "L2gYl5mblmAkXz3d",
        "uuid": "Actor.L2gYl5mblmAkXz3d",
        "docType": "Actor",
        "subtype": "character",
        "name": "Chainsaw Skeletons",
        "folderId": "ZMsiW2FSdQ2KSvnq",
        "folderPath": "NPCs/Spirits",
        "path": "NPCs/Spirits/Chainsaw Skeletons",
        "sort": 0
      },
      {
        "documentId": "O4gvFyhSz0gQ37IB",
        "uuid": "Actor.O4gvFyhSz0gQ37IB",
        "docType": "Actor",
        "subtype": "character",
        "name": "Gaoh",
        "folderId": "ZMsiW2FSdQ2KSvnq",
        "folderPath": "NPCs/Spirits",
        "path": "NPCs/Spirits/Gaoh",
        "sort": 0
      },
      {
        "documentId": "t3MdfTvAFYZSM6nZ",
        "uuid": "Actor.t3MdfTvAFYZSM6nZ",
        "docType": "Actor",
        "subtype": "character",
        "name": "Ignis Dicen",
        "folderId": "ZMsiW2FSdQ2KSvnq",
        "folderPath": "NPCs/Spirits",
        "path": "NPCs/Spirits/Ignis Dicen",
        "sort": 0
      },
      {
        "documentId": "CUlUOyrHL5YXUDmN",
        "uuid": "Actor.CUlUOyrHL5YXUDmN",
        "docType": "Actor",
        "subtype": "character",
        "name": "Lapsae Caelum",
        "folderId": "ZMsiW2FSdQ2KSvnq",
        "folderPath": "NPCs/Spirits",
        "path": "NPCs/Spirits/Lapsae Caelum",
        "sort": 0
      },
      {
        "documentId": "yY7v2ESAOGUbgQhL",
        "uuid": "Actor.yY7v2ESAOGUbgQhL",
        "docType": "Actor",
        "subtype": "character",
        "name": "Miasma",
        "folderId": "ZMsiW2FSdQ2KSvnq",
        "folderPath": "NPCs/Spirits",
        "path": "NPCs/Spirits/Miasma",
        "sort": 0
      },
      {
        "documentId": "Yqd790UKKPn0eKfx",
        "uuid": "Actor.Yqd790UKKPn0eKfx",
        "docType": "Actor",
        "subtype": "character",
        "name": "Moryana",
        "folderId": "ZMsiW2FSdQ2KSvnq",
        "folderPath": "NPCs/Spirits",
        "path": "NPCs/Spirits/Moryana",
        "sort": 0
      },
      {
        "documentId": "S5HJSHyWWEI7SAGJ",
        "uuid": "Actor.S5HJSHyWWEI7SAGJ",
        "docType": "Actor",
        "subtype": "character",
        "name": "Mound of Skulls",
        "folderId": "ZMsiW2FSdQ2KSvnq",
        "folderPath": "NPCs/Spirits",
        "path": "NPCs/Spirits/Mound of Skulls",
        "sort": 0
      },
      {
        "documentId": "FQDcxI8oYgbJui2Z",
        "uuid": "Actor.FQDcxI8oYgbJui2Z",
        "docType": "Actor",
        "subtype": "character",
        "name": "Pacha Mama",
        "folderId": "ZMsiW2FSdQ2KSvnq",
        "folderPath": "NPCs/Spirits",
        "path": "NPCs/Spirits/Pacha Mama",
        "sort": 0
      },
      {
        "documentId": "eNG6ra9AAfbkuxuj",
        "uuid": "Actor.eNG6ra9AAfbkuxuj",
        "docType": "Actor",
        "subtype": "character",
        "name": "Stormwing",
        "folderId": "ZMsiW2FSdQ2KSvnq",
        "folderPath": "NPCs/Spirits",
        "path": "NPCs/Spirits/Stormwing",
        "sort": 0
      },
      {
        "documentId": "KiwePQ0zQvozm6xC",
        "uuid": "Actor.KiwePQ0zQvozm6xC",
        "docType": "Actor",
        "subtype": "character",
        "name": "Terra Factorem",
        "folderId": "ZMsiW2FSdQ2KSvnq",
        "folderPath": "NPCs/Spirits",
        "path": "NPCs/Spirits/Terra Factorem",
        "sort": 0
      },
      {
        "documentId": "msTIIV2QHErNVW1z",
        "uuid": "Actor.msTIIV2QHErNVW1z",
        "docType": "Actor",
        "subtype": "character",
        "name": "Zeek Electricity Spirit",
        "folderId": "ZMsiW2FSdQ2KSvnq",
        "folderPath": "NPCs/Spirits",
        "path": "NPCs/Spirits/Zeek Electricity Spirit",
        "sort": 0
      },
      {
        "documentId": "3UvKepdZNQcxmmIe",
        "uuid": "Actor.3UvKepdZNQcxmmIe",
        "docType": "Actor",
        "subtype": "character",
        "name": "Crime by Day, Rave by Night",
        "folderId": "bGGgYtFXJvPyXTLo",
        "folderPath": "PCs",
        "path": "PCs/Crime by Day, Rave by Night",
        "sort": 0
      },
      {
        "documentId": "qXmqhVfZkE8eEbd6",
        "uuid": "Actor.qXmqhVfZkE8eEbd6",
        "docType": "Actor",
        "subtype": "character",
        "name": "PC Sheet (duplicate & rename)",
        "folderId": "bGGgYtFXJvPyXTLo",
        "folderPath": "PCs",
        "path": "PCs/PC Sheet (duplicate & rename)",
        "sort": 100000
      },
      {
        "documentId": "iDwCzeasOdOeW3lz",
        "uuid": "Actor.iDwCzeasOdOeW3lz",
        "docType": "Actor",
        "subtype": "character",
        "name": "ARCHMAG",
        "folderId": "tlB8baeczfAB1tEw",
        "folderPath": "PCs/PreGens",
        "path": "PCs/PreGens/ARCHMAG",
        "sort": 0
      },
      {
        "documentId": "i6WYCzWY0pveTact",
        "uuid": "Actor.i6WYCzWY0pveTact",
        "docType": "Actor",
        "subtype": "character",
        "name": "ASSASSIN",
        "folderId": "tlB8baeczfAB1tEw",
        "folderPath": "PCs/PreGens",
        "path": "PCs/PreGens/ASSASSIN",
        "sort": 0
      },
      {
        "documentId": "D5WzoYijRz7njQMS",
        "uuid": "Actor.D5WzoYijRz7njQMS",
        "docType": "Actor",
        "subtype": "character",
        "name": "COVERT OPERATIVE",
        "folderId": "tlB8baeczfAB1tEw",
        "folderPath": "PCs/PreGens",
        "path": "PCs/PreGens/COVERT OPERATIVE",
        "sort": 0
      },
      {
        "documentId": "TURaFIPLhla4F7iL",
        "uuid": "Actor.TURaFIPLhla4F7iL",
        "docType": "Actor",
        "subtype": "character",
        "name": "Cybered Recon",
        "folderId": "tlB8baeczfAB1tEw",
        "folderPath": "PCs/PreGens",
        "path": "PCs/PreGens/Cybered Recon",
        "sort": 0
      },
      {
        "documentId": "rQ9WKtl8r6sZBhdi",
        "uuid": "Actor.rQ9WKtl8r6sZBhdi",
        "docType": "Actor",
        "subtype": "character",
        "name": "DETECTIVE",
        "folderId": "tlB8baeczfAB1tEw",
        "folderPath": "PCs/PreGens",
        "path": "PCs/PreGens/DETECTIVE",
        "sort": 0
      },
      {
        "documentId": "8vzQkDQUAT7qEO2m",
        "uuid": "Actor.8vzQkDQUAT7qEO2m",
        "docType": "Actor",
        "subtype": "character",
        "name": "DRIVER",
        "folderId": "tlB8baeczfAB1tEw",
        "folderPath": "PCs/PreGens",
        "path": "PCs/PreGens/DRIVER",
        "sort": 0
      },
      {
        "documentId": "q5cumBez1mzzRSNL",
        "uuid": "Actor.q5cumBez1mzzRSNL",
        "docType": "Actor",
        "subtype": "character",
        "name": "Gorilla hacker",
        "folderId": "tlB8baeczfAB1tEw",
        "folderPath": "PCs/PreGens",
        "path": "PCs/PreGens/Gorilla hacker",
        "sort": 0
      },
      {
        "documentId": "pwsZfNAdGgAvus4X",
        "uuid": "Actor.pwsZfNAdGgAvus4X",
        "docType": "Actor",
        "subtype": "character",
        "name": "Luci-0",
        "folderId": "tlB8baeczfAB1tEw",
        "folderPath": "PCs/PreGens",
        "path": "PCs/PreGens/Luci-0",
        "sort": 100000
      },
      {
        "documentId": "9HqlPECYxaacY01V",
        "uuid": "Actor.9HqlPECYxaacY01V",
        "docType": "Actor",
        "subtype": "character",
        "name": "MARTIAL ARTIST",
        "folderId": "tlB8baeczfAB1tEw",
        "folderPath": "PCs/PreGens",
        "path": "PCs/PreGens/MARTIAL ARTIST",
        "sort": 0
      },
      {
        "documentId": "JF5REvziVWvRoj60",
        "uuid": "Actor.JF5REvziVWvRoj60",
        "docType": "Actor",
        "subtype": "character",
        "name": "POP IDOL",
        "folderId": "tlB8baeczfAB1tEw",
        "folderPath": "PCs/PreGens",
        "path": "PCs/PreGens/POP IDOL",
        "sort": 0
      },
      {
        "documentId": "pt3aAa7sgQZv3xsy",
        "uuid": "Actor.pt3aAa7sgQZv3xsy",
        "docType": "Actor",
        "subtype": "character",
        "name": "Rigger Sleuth",
        "folderId": "tlB8baeczfAB1tEw",
        "folderPath": "PCs/PreGens",
        "path": "PCs/PreGens/Rigger Sleuth",
        "sort": 0
      },
      {
        "documentId": "UwUS1iZD5q7M0ggU",
        "uuid": "Actor.UwUS1iZD5q7M0ggU",
        "docType": "Actor",
        "subtype": "character",
        "name": "Vamp Face",
        "folderId": "tlB8baeczfAB1tEw",
        "folderPath": "PCs/PreGens",
        "path": "PCs/PreGens/Vamp Face",
        "sort": 0
      },
      {
        "documentId": "eMIR1Wvxh4VxXWES",
        "uuid": "Actor.eMIR1Wvxh4VxXWES",
        "docType": "Actor",
        "subtype": "character",
        "name": "WASTELAND MAGE",
        "folderId": "tlB8baeczfAB1tEw",
        "folderPath": "PCs/PreGens",
        "path": "PCs/PreGens/WASTELAND MAGE",
        "sort": 0
      },
      {
        "documentId": "eMbezua6UThIStwT",
        "uuid": "Actor.eMbezua6UThIStwT",
        "docType": "Actor",
        "subtype": "character",
        "name": "TestSpell",
        "folderId": "bGGgYtFXJvPyXTLo",
        "folderPath": "PCs",
        "path": "PCs/TestSpell",
        "sort": 100000
      },
      {
        "documentId": "uI4SrMJ9fuLk7UN0",
        "uuid": "Actor.uI4SrMJ9fuLk7UN0",
        "docType": "Actor",
        "subtype": "_template",
        "name": "Brand Template",
        "folderId": "eJiZ5ojJouMYFr9R",
        "folderPath": "Templates",
        "path": "Templates/Brand Template",
        "sort": 0
      },
      {
        "documentId": "lL9MiN64F7mRGhuj",
        "uuid": "Actor.lL9MiN64F7mRGhuj",
        "docType": "Actor",
        "subtype": "_template",
        "name": "Drone Template",
        "folderId": "eJiZ5ojJouMYFr9R",
        "folderPath": "Templates",
        "path": "Templates/Drone Template",
        "sort": 112500
      },
      {
        "documentId": "DubVcAsia226PlV0",
        "uuid": "Actor.DubVcAsia226PlV0",
        "docType": "Actor",
        "subtype": "_template",
        "name": "Session Settings Template",
        "folderId": "eJiZ5ojJouMYFr9R",
        "folderPath": "Templates",
        "path": "Templates/Session Settings Template",
        "sort": 100000
      },
      {
        "documentId": "694838d341f4407b",
        "uuid": "Actor.694838d341f4407b",
        "docType": "Actor",
        "subtype": "_template",
        "name": "Sinless NPC",
        "folderId": "eJiZ5ojJouMYFr9R",
        "folderPath": "Templates",
        "path": "Templates/Sinless NPC",
        "sort": 200000
      },
      {
        "documentId": "409875cd45a544c0",
        "uuid": "Actor.409875cd45a544c0",
        "docType": "Actor",
        "subtype": "_template",
        "name": "Sinless PC",
        "folderId": "eJiZ5ojJouMYFr9R",
        "folderPath": "Templates",
        "path": "Templates/Sinless PC",
        "sort": 150000
      },
      {
        "documentId": "OXKxlTnNPzmAbRn2",
        "uuid": "Actor.OXKxlTnNPzmAbRn2",
        "docType": "Actor",
        "subtype": "_template",
        "name": "Sinless PC (Copy)",
        "folderId": "eJiZ5ojJouMYFr9R",
        "folderPath": "Templates",
        "path": "Templates/Sinless PC (Copy)",
        "sort": 150000
      },
      {
        "documentId": "9YbyOSIZBhfekbLK",
        "uuid": "Actor.9YbyOSIZBhfekbLK",
        "docType": "Actor",
        "subtype": "_template",
        "name": "Vehicle Template",
        "folderId": "eJiZ5ojJouMYFr9R",
        "folderPath": "Templates",
        "path": "Templates/Vehicle Template",
        "sort": 125000
      },
      {
        "documentId": "YrcHYiZz2DClrx73",
        "uuid": "Actor.YrcHYiZz2DClrx73",
        "docType": "Actor",
        "subtype": "character",
        "name": "Armored Car",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Armored Car",
        "sort": 0
      },
      {
        "documentId": "gMuob9Zc3oQMJL5t",
        "uuid": "Actor.gMuob9Zc3oQMJL5t",
        "docType": "Actor",
        "subtype": "character",
        "name": "Battle Cycle",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Battle Cycle",
        "sort": 0
      },
      {
        "documentId": "E1wseQJRW9U60tPV",
        "uuid": "Actor.E1wseQJRW9U60tPV",
        "docType": "Actor",
        "subtype": "character",
        "name": "Cargo Heli",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Cargo Heli",
        "sort": 0
      },
      {
        "documentId": "VYIuxgZfPk6cmEDl",
        "uuid": "Actor.VYIuxgZfPk6cmEDl",
        "docType": "Actor",
        "subtype": "character",
        "name": "Chopper",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Chopper",
        "sort": 0
      },
      {
        "documentId": "49b7xlC8WpfdAm6V",
        "uuid": "Actor.49b7xlC8WpfdAm6V",
        "docType": "Actor",
        "subtype": "character",
        "name": "Delivery Van",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Delivery Van",
        "sort": 0
      },
      {
        "documentId": "kgW5UuRTN9aVJQLO",
        "uuid": "Actor.kgW5UuRTN9aVJQLO",
        "docType": "Actor",
        "subtype": "character",
        "name": "Family Sedan",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Family Sedan",
        "sort": 0
      },
      {
        "documentId": "bIItnnGuiSDXOTGF",
        "uuid": "Actor.bIItnnGuiSDXOTGF",
        "docType": "Actor",
        "subtype": "character",
        "name": "Limo",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Limo",
        "sort": 0
      },
      {
        "documentId": "9IxyUuPhLM41J1K9",
        "uuid": "Actor.9IxyUuPhLM41J1K9",
        "docType": "Actor",
        "subtype": "character",
        "name": "Luxury Sedan",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Luxury Sedan",
        "sort": 0
      },
      {
        "documentId": "zoWqMukGSFHMTslC",
        "uuid": "Actor.zoWqMukGSFHMTslC",
        "docType": "Actor",
        "subtype": "character",
        "name": "Luxury Van",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Luxury Van",
        "sort": 0
      },
      {
        "documentId": "x1fpvHM6WLE7B3R7",
        "uuid": "Actor.x1fpvHM6WLE7B3R7",
        "docType": "Actor",
        "subtype": "character",
        "name": "Motorcycle",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Motorcycle",
        "sort": 0
      },
      {
        "documentId": "ahGHLlVgXRWFMKCO",
        "uuid": "Actor.ahGHLlVgXRWFMKCO",
        "docType": "Actor",
        "subtype": "character",
        "name": "Nightwing",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Nightwing",
        "sort": 0
      },
      {
        "documentId": "dHLNbMrpXPNXoTJU",
        "uuid": "Actor.dHLNbMrpXPNXoTJU",
        "docType": "Actor",
        "subtype": "character",
        "name": "Patrol Boat",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Patrol Boat",
        "sort": 0
      },
      {
        "documentId": "CQuecuTEcXCQ9U19",
        "uuid": "Actor.CQuecuTEcXCQ9U19",
        "docType": "Actor",
        "subtype": "character",
        "name": "Pickup",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Pickup",
        "sort": 0
      },
      {
        "documentId": "pZvqrFWKnqyFClRU",
        "uuid": "Actor.pZvqrFWKnqyFClRU",
        "docType": "Actor",
        "subtype": "character",
        "name": "Racing Bike",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Racing Bike",
        "sort": 0
      },
      {
        "documentId": "3oi9ZXxABUPPPdkc",
        "uuid": "Actor.3oi9ZXxABUPPPdkc",
        "docType": "Actor",
        "subtype": "character",
        "name": "Seaplane",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Seaplane",
        "sort": 0
      },
      {
        "documentId": "HdkLKHrN5N6l0lSL",
        "uuid": "Actor.HdkLKHrN5N6l0lSL",
        "docType": "Actor",
        "subtype": "character",
        "name": "Skate",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Skate",
        "sort": 0
      },
      {
        "documentId": "vEev6mqgzdeNRqei",
        "uuid": "Actor.vEev6mqgzdeNRqei",
        "docType": "Actor",
        "subtype": "character",
        "name": "Small Boat",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Small Boat",
        "sort": 0
      },
      {
        "documentId": "zDoAsiN3JeWwuvnl",
        "uuid": "Actor.zDoAsiN3JeWwuvnl",
        "docType": "Actor",
        "subtype": "character",
        "name": "Speedboat",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Speedboat",
        "sort": 0
      },
      {
        "documentId": "zPjI6U6SqDotTVmI",
        "uuid": "Actor.zPjI6U6SqDotTVmI",
        "docType": "Actor",
        "subtype": "character",
        "name": "Sports Car",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Sports Car",
        "sort": 0
      },
      {
        "documentId": "LAY2VmmdyyuyMLRa",
        "uuid": "Actor.LAY2VmmdyyuyMLRa",
        "docType": "Actor",
        "subtype": "character",
        "name": "Sports Sedan",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Sports Sedan",
        "sort": 0
      },
      {
        "documentId": "6ZaXDQU7FcPyh3Kg",
        "uuid": "Actor.6ZaXDQU7FcPyh3Kg",
        "docType": "Actor",
        "subtype": "character",
        "name": "Transport Heli",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Transport Heli",
        "sort": 0
      },
      {
        "documentId": "Cr8G5z5z7R6gikRB",
        "uuid": "Actor.Cr8G5z5z7R6gikRB",
        "docType": "Actor",
        "subtype": "character",
        "name": "Two-Seater",
        "folderId": "I8VLhxriauMW5wH0",
        "folderPath": "VehicleHangar",
        "path": "VehicleHangar/Two-Seater",
        "sort": 0
      }
    ]
  },
  "item": {
    "folders": [
      {
        "folderId": "lm14M8GJkCltaS3J",
        "uuid": "Folder.lm14M8GJkCltaS3J",
        "docType": "Item",
        "name": "_Templates",
        "parentFolderId": null,
        "depth": 0,
        "sort": 650000,
        "sorting": "a",
        "path": "_Templates"
      },
      {
        "folderId": "U0xPHn13he6mwKNg",
        "uuid": "Folder.U0xPHn13he6mwKNg",
        "docType": "Item",
        "name": "Brand",
        "parentFolderId": null,
        "depth": 0,
        "sort": 325000,
        "sorting": "a",
        "path": "Brand"
      },
      {
        "folderId": "rCTnl7myqTtxE5gl",
        "uuid": "Folder.rCTnl7myqTtxE5gl",
        "docType": "Item",
        "name": "CSB - Embedded Items Folder - DO NOT RENAME OR REMOVE",
        "parentFolderId": null,
        "depth": 0,
        "sort": -200000,
        "sorting": "a",
        "path": "CSB - Embedded Items Folder - DO NOT RENAME OR REMOVE"
      },
      {
        "folderId": "2idKfyaV1KZVqL6V",
        "uuid": "Folder.2idKfyaV1KZVqL6V",
        "docType": "Item",
        "name": "Decking",
        "parentFolderId": null,
        "depth": 0,
        "sort": 25000,
        "sorting": "a",
        "path": "Decking"
      },
      {
        "folderId": "oWRM8pNMOUkbZHoV",
        "uuid": "Folder.oWRM8pNMOUkbZHoV",
        "docType": "Item",
        "name": "Manon",
        "parentFolderId": null,
        "depth": 0,
        "sort": 237500,
        "sorting": "m",
        "path": "Manon"
      },
      {
        "folderId": "bRI78s2WG6gVDJ4C",
        "uuid": "Folder.bRI78s2WG6gVDJ4C",
        "docType": "Item",
        "name": "Rigging",
        "parentFolderId": null,
        "depth": 0,
        "sort": 150000,
        "sorting": "m",
        "path": "Rigging"
      },
      {
        "folderId": "l7jcqzFSJr3Qemeu",
        "uuid": "Folder.l7jcqzFSJr3Qemeu",
        "docType": "Item",
        "name": "Weapons",
        "parentFolderId": null,
        "depth": 0,
        "sort": -100000,
        "sorting": "m",
        "path": "Weapons"
      },
      {
        "folderId": "76RtzViuhpI874RJ",
        "uuid": "Folder.76RtzViuhpI874RJ",
        "docType": "Item",
        "name": "Assets",
        "parentFolderId": "U0xPHn13he6mwKNg",
        "depth": 1,
        "sort": 100000,
        "sorting": "a",
        "path": "Brand/Assets"
      },
      {
        "folderId": "tH4sjhPKYwIEC0KT",
        "uuid": "Folder.tH4sjhPKYwIEC0KT",
        "docType": "Item",
        "name": "Resources",
        "parentFolderId": "U0xPHn13he6mwKNg",
        "depth": 1,
        "sort": 0,
        "sorting": "a",
        "path": "Brand/Resources"
      },
      {
        "folderId": "TpyOdo9rRmcJZwT2",
        "uuid": "Folder.TpyOdo9rRmcJZwT2",
        "docType": "Item",
        "name": "Cyberdecks",
        "parentFolderId": "2idKfyaV1KZVqL6V",
        "depth": 1,
        "sort": 0,
        "sorting": "m",
        "path": "Decking/Cyberdecks"
      },
      {
        "folderId": "FBqDldU0lm0kCoRQ",
        "uuid": "Folder.FBqDldU0lm0kCoRQ",
        "docType": "Item",
        "name": "E War Threads",
        "parentFolderId": "2idKfyaV1KZVqL6V",
        "depth": 1,
        "sort": 200000,
        "sorting": "a",
        "path": "Decking/E War Threads"
      },
      {
        "folderId": "92dSVkunMksoE7g2",
        "uuid": "Folder.92dSVkunMksoE7g2",
        "docType": "Item",
        "name": "Hacking Threads",
        "parentFolderId": "2idKfyaV1KZVqL6V",
        "depth": 1,
        "sort": 100000,
        "sorting": "a",
        "path": "Decking/Hacking Threads"
      },
      {
        "folderId": "TOqDCNaMbz4McNIl",
        "uuid": "Folder.TOqDCNaMbz4McNIl",
        "docType": "Item",
        "name": "Amplification",
        "parentFolderId": "oWRM8pNMOUkbZHoV",
        "depth": 1,
        "sort": 25000,
        "sorting": "a",
        "path": "Manon/Amplification"
      },
      {
        "folderId": "6whq1Osyvu4GSURS",
        "uuid": "Folder.6whq1Osyvu4GSURS",
        "docType": "Item",
        "name": "Conjuring",
        "parentFolderId": "oWRM8pNMOUkbZHoV",
        "depth": 1,
        "sort": 0,
        "sorting": "m",
        "path": "Manon/Conjuring"
      },
      {
        "folderId": "6lAsZV9lPeO51DJT",
        "uuid": "Folder.6lAsZV9lPeO51DJT",
        "docType": "Item",
        "name": "Rituals",
        "parentFolderId": "oWRM8pNMOUkbZHoV",
        "depth": 1,
        "sort": 50000,
        "sorting": "m",
        "path": "Manon/Rituals"
      },
      {
        "folderId": "fzpbw6RIBAzBp9kN",
        "uuid": "Folder.fzpbw6RIBAzBp9kN",
        "docType": "Item",
        "name": "Sorcery",
        "parentFolderId": "oWRM8pNMOUkbZHoV",
        "depth": 1,
        "sort": -100000,
        "sorting": "m",
        "path": "Manon/Sorcery"
      },
      {
        "folderId": "wpNVoTaalbsoL0Lv",
        "uuid": "Folder.wpNVoTaalbsoL0Lv",
        "docType": "Item",
        "name": "Drive / Fly Skills",
        "parentFolderId": "bRI78s2WG6gVDJ4C",
        "depth": 1,
        "sort": 100000,
        "sorting": "a",
        "path": "Rigging/Drive / Fly Skills"
      },
      {
        "folderId": "Ts6jM2x9mZugV8R4",
        "uuid": "Folder.Ts6jM2x9mZugV8R4",
        "docType": "Item",
        "name": "Drone Weapons",
        "parentFolderId": "bRI78s2WG6gVDJ4C",
        "depth": 1,
        "sort": 125000,
        "sorting": "a",
        "path": "Rigging/Drone Weapons"
      },
      {
        "folderId": "DswGzl1e1TynhREL",
        "uuid": "Folder.DswGzl1e1TynhREL",
        "docType": "Item",
        "name": "Drones",
        "parentFolderId": "bRI78s2WG6gVDJ4C",
        "depth": 1,
        "sort": -100000,
        "sorting": "a",
        "path": "Rigging/Drones"
      },
      {
        "folderId": "d3QnO994LfRud9yy",
        "uuid": "Folder.d3QnO994LfRud9yy",
        "docType": "Item",
        "name": "VCR",
        "parentFolderId": "bRI78s2WG6gVDJ4C",
        "depth": 1,
        "sort": -200000,
        "sorting": "m",
        "path": "Rigging/VCR"
      },
      {
        "folderId": "17SxKReYD26TEIrd",
        "uuid": "Folder.17SxKReYD26TEIrd",
        "docType": "Item",
        "name": "Vehicle Weapons",
        "parentFolderId": "bRI78s2WG6gVDJ4C",
        "depth": 1,
        "sort": 150000,
        "sorting": "a",
        "path": "Rigging/Vehicle Weapons"
      },
      {
        "folderId": "ic8w75E9GFrktS4x",
        "uuid": "Folder.ic8w75E9GFrktS4x",
        "docType": "Item",
        "name": "Vehicles",
        "parentFolderId": "bRI78s2WG6gVDJ4C",
        "depth": 1,
        "sort": 0,
        "sorting": "a",
        "path": "Rigging/Vehicles"
      },
      {
        "folderId": "fFGfPC4Uqyeabnvo",
        "uuid": "Folder.fFGfPC4Uqyeabnvo",
        "docType": "Item",
        "name": "Energy",
        "parentFolderId": "l7jcqzFSJr3Qemeu",
        "depth": 1,
        "sort": 175000,
        "sorting": "a",
        "path": "Weapons/Energy"
      },
      {
        "folderId": "5KWDwkU23whetOIV",
        "uuid": "Folder.5KWDwkU23whetOIV",
        "docType": "Item",
        "name": "Firearms",
        "parentFolderId": "l7jcqzFSJr3Qemeu",
        "depth": 1,
        "sort": 162500,
        "sorting": "a",
        "path": "Weapons/Firearms"
      },
      {
        "folderId": "aHRmcytEr2emGb1Y",
        "uuid": "Folder.aHRmcytEr2emGb1Y",
        "docType": "Item",
        "name": "Melee",
        "parentFolderId": "l7jcqzFSJr3Qemeu",
        "depth": 1,
        "sort": 100000,
        "sorting": "a",
        "path": "Weapons/Melee"
      },
      {
        "folderId": "9kmoBQyRvIQEoTi1",
        "uuid": "Folder.9kmoBQyRvIQEoTi1",
        "docType": "Item",
        "name": "Projectile",
        "parentFolderId": "l7jcqzFSJr3Qemeu",
        "depth": 1,
        "sort": 150000,
        "sorting": "m",
        "path": "Weapons/Projectile"
      },
      {
        "folderId": "rpm8CmOJ32570KoC",
        "uuid": "Folder.rpm8CmOJ32570KoC",
        "docType": "Item",
        "name": "Thrown",
        "parentFolderId": "l7jcqzFSJr3Qemeu",
        "depth": 1,
        "sort": 125000,
        "sorting": "a",
        "path": "Weapons/Thrown"
      },
      {
        "folderId": "aHvlIdpJNdmTmDRg",
        "uuid": "Folder.aHvlIdpJNdmTmDRg",
        "docType": "Item",
        "name": "Spirit Maps",
        "parentFolderId": "6whq1Osyvu4GSURS",
        "depth": 2,
        "sort": 0,
        "sorting": "a",
        "path": "Manon/Conjuring/Spirit Maps"
      },
      {
        "folderId": "JrXjUPTbu2Jj2AuN",
        "uuid": "Folder.JrXjUPTbu2Jj2AuN",
        "docType": "Item",
        "name": "Spirits (Shaman)",
        "parentFolderId": "6whq1Osyvu4GSURS",
        "depth": 2,
        "sort": 0,
        "sorting": "a",
        "path": "Manon/Conjuring/Spirits (Shaman)"
      },
      {
        "folderId": "6OffBG8bkUnp7Ixf",
        "uuid": "Folder.6OffBG8bkUnp7Ixf",
        "docType": "Item",
        "name": "Astral Umbra",
        "parentFolderId": "fzpbw6RIBAzBp9kN",
        "depth": 2,
        "sort": 0,
        "sorting": "a",
        "path": "Manon/Sorcery/Astral Umbra"
      },
      {
        "folderId": "v0lGsMbGnlKF7Dvi",
        "uuid": "Folder.v0lGsMbGnlKF7Dvi",
        "docType": "Item",
        "name": "Auralurgy",
        "parentFolderId": "fzpbw6RIBAzBp9kN",
        "depth": 2,
        "sort": 150000,
        "sorting": "a",
        "path": "Manon/Sorcery/Auralurgy"
      },
      {
        "folderId": "m0jRApcb3Al3Dh3t",
        "uuid": "Folder.m0jRApcb3Al3Dh3t",
        "docType": "Item",
        "name": "Incantor",
        "parentFolderId": "fzpbw6RIBAzBp9kN",
        "depth": 2,
        "sort": 300000,
        "sorting": "a",
        "path": "Manon/Sorcery/Incantor"
      },
      {
        "folderId": "xuhgaKb2rgkuMPKA",
        "uuid": "Folder.xuhgaKb2rgkuMPKA",
        "docType": "Item",
        "name": "Mentalism",
        "parentFolderId": "fzpbw6RIBAzBp9kN",
        "depth": 2,
        "sort": 400000,
        "sorting": "a",
        "path": "Manon/Sorcery/Mentalism"
      },
      {
        "folderId": "Fi8plai5LkNJGnNE",
        "uuid": "Folder.Fi8plai5LkNJGnNE",
        "docType": "Item",
        "name": "The Bound",
        "parentFolderId": "fzpbw6RIBAzBp9kN",
        "depth": 2,
        "sort": 450000,
        "sorting": "a",
        "path": "Manon/Sorcery/The Bound"
      }
    ],
    "documents": [
      {
        "documentId": "XtU8rTt7uOjlTxx0",
        "uuid": "Item.XtU8rTt7uOjlTxx0",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Amps Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Amps Template",
        "sort": 2200000
      },
      {
        "documentId": "uGhQTkXb74uXkwPd",
        "uuid": "Item.uGhQTkXb74uXkwPd",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Asset Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Asset Template",
        "sort": 2250000
      },
      {
        "documentId": "b2F3cWZSzUeZvam8",
        "uuid": "Item.b2F3cWZSzUeZvam8",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Cyberdeck Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Cyberdeck Template",
        "sort": 1900000
      },
      {
        "documentId": "8L2WHN9Spx1TyIys",
        "uuid": "Item.8L2WHN9Spx1TyIys",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Drone Ballistic Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Drone Ballistic Template",
        "sort": 800000
      },
      {
        "documentId": "lOAPMavVjtRre3OI",
        "uuid": "Item.lOAPMavVjtRre3OI",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Drone Energy W Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Drone Energy W Template",
        "sort": 600000
      },
      {
        "documentId": "UOzfdwCey4axeP6O",
        "uuid": "Item.UOzfdwCey4axeP6O",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "DroneItems Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/DroneItems Template",
        "sort": 1200000
      },
      {
        "documentId": "lBNLLAeL3gcJs2RQ",
        "uuid": "Item.lBNLLAeL3gcJs2RQ",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "E War Threads Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/E War Threads Template",
        "sort": 100000
      },
      {
        "documentId": "hMNA1M25JzNfOz0c",
        "uuid": "Item.hMNA1M25JzNfOz0c",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Energy Wep Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Energy Wep Template",
        "sort": 1700000
      },
      {
        "documentId": "WpDhy1PMWFkO6tOc",
        "uuid": "Item.WpDhy1PMWFkO6tOc",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Firearms Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Firearms Template",
        "sort": 1600000
      },
      {
        "documentId": "8CMq8JmyHbRCglOv",
        "uuid": "Item.8CMq8JmyHbRCglOv",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Hacking Threads Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Hacking Threads Template",
        "sort": 300000
      },
      {
        "documentId": "beEN7M4Y3hg8U06n",
        "uuid": "Item.beEN7M4Y3hg8U06n",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Melee Weapon Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Melee Weapon Template",
        "sort": 400000
      },
      {
        "documentId": "dsFXOOLAla95Lj3y",
        "uuid": "Item.dsFXOOLAla95Lj3y",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Projectile Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Projectile Template",
        "sort": 1500000
      },
      {
        "documentId": "wi8dx0sNDbpFXrKU",
        "uuid": "Item.wi8dx0sNDbpFXrKU",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Resources Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Resources Template",
        "sort": 150000
      },
      {
        "documentId": "QtMNKYb9rrdKwv0k",
        "uuid": "Item.QtMNKYb9rrdKwv0k",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Rig Drive Skill Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Rig Drive Skill Template",
        "sort": 1400000
      },
      {
        "documentId": "mCc3spF6itnvgfou",
        "uuid": "Item.mCc3spF6itnvgfou",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Rig Fly Skill Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Rig Fly Skill Template",
        "sort": 1000000
      },
      {
        "documentId": "25Qy5a7maYi8KQOX",
        "uuid": "Item.25Qy5a7maYi8KQOX",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Ritual Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Ritual Template",
        "sort": 2100000
      },
      {
        "documentId": "ejf8ndmNAUPCzJAC",
        "uuid": "Item.ejf8ndmNAUPCzJAC",
        "docType": "Item",
        "subtype": "subTemplate",
        "name": "Sinless Roll Config",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Sinless Roll Config",
        "sort": 1800000
      },
      {
        "documentId": "SpelTplSinlssA1X",
        "uuid": "Item.SpelTplSinlssA1X",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Sorcery Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Sorcery Template",
        "sort": 2000000
      },
      {
        "documentId": "rWePU1Kam0pG00VD",
        "uuid": "Item.rWePU1Kam0pG00VD",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Spirit Map Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Spirit Map Template",
        "sort": 200000
      },
      {
        "documentId": "QyToiPEwE2Tp36YK",
        "uuid": "Item.QyToiPEwE2Tp36YK",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Spirits Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Spirits Template",
        "sort": 2300000
      },
      {
        "documentId": "J7lCjK5RwvIF4gUw",
        "uuid": "Item.J7lCjK5RwvIF4gUw",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Thrown Weapon Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Thrown Weapon Template",
        "sort": 500000
      },
      {
        "documentId": "3LTlu5bj85Ic7pQS",
        "uuid": "Item.3LTlu5bj85Ic7pQS",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "VCR Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/VCR Template",
        "sort": 1100000
      },
      {
        "documentId": "WQoI2Ir3qVKJASl3",
        "uuid": "Item.WQoI2Ir3qVKJASl3",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Vehicle Ballistic Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Vehicle Ballistic Template",
        "sort": 900000
      },
      {
        "documentId": "jM4PHhDREfU7OUZ4",
        "uuid": "Item.jM4PHhDREfU7OUZ4",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "Vehicle Energy W Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/Vehicle Energy W Template",
        "sort": 700000
      },
      {
        "documentId": "GHO6zyIPQXdSYR8a",
        "uuid": "Item.GHO6zyIPQXdSYR8a",
        "docType": "Item",
        "subtype": "_equippableItemTemplate",
        "name": "VehicleItems Template",
        "folderId": "lm14M8GJkCltaS3J",
        "folderPath": "_Templates",
        "path": "_Templates/VehicleItems Template",
        "sort": 1300000
      },
      {
        "documentId": "xP13QucJZoaeEKyq",
        "uuid": "Item.xP13QucJZoaeEKyq",
        "docType": "Item",
        "subtype": "activeEffectContainer",
        "name": "Active Effects",
        "folderId": null,
        "folderPath": null,
        "path": "Active Effects",
        "sort": 100000
      },
      {
        "documentId": "YBo4xuxE8RqcKFWZ",
        "uuid": "Item.YBo4xuxE8RqcKFWZ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Asset Test",
        "folderId": null,
        "folderPath": null,
        "path": "Asset Test",
        "sort": 250000
      },
      {
        "documentId": "Z38ou2v0Z1pZM3ju",
        "uuid": "Item.Z38ou2v0Z1pZM3ju",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Acrocolypse",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Acrocolypse",
        "sort": 0
      },
      {
        "documentId": "Mcx3SDAlZxF9m6fz",
        "uuid": "Item.Mcx3SDAlZxF9m6fz",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Adeedus",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Adeedus",
        "sort": 0
      },
      {
        "documentId": "oi0odB14S1OqEKAV",
        "uuid": "Item.oi0odB14S1OqEKAV",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Albert Knox",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Albert Knox",
        "sort": 0
      },
      {
        "documentId": "pOmANkEY6fRxdjvy",
        "uuid": "Item.pOmANkEY6fRxdjvy",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Albretcht",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Albretcht",
        "sort": 0
      },
      {
        "documentId": "AUfaA4bLVgPvyHQQ",
        "uuid": "Item.AUfaA4bLVgPvyHQQ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Alexis Marin",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Alexis Marin",
        "sort": 0
      },
      {
        "documentId": "dZ0JOX3Fduo5Ze2Y",
        "uuid": "Item.dZ0JOX3Fduo5Ze2Y",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Alistair",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Alistair",
        "sort": 0
      },
      {
        "documentId": "ctIPDwgVl3F8UYi7",
        "uuid": "Item.ctIPDwgVl3F8UYi7",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Ann Thorpe",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Ann Thorpe",
        "sort": 0
      },
      {
        "documentId": "UoBXn1mdgeZoQmMF",
        "uuid": "Item.UoBXn1mdgeZoQmMF",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Anthony Chow",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Anthony Chow",
        "sort": 0
      },
      {
        "documentId": "5VhKI0xFZ9rkzaf9",
        "uuid": "Item.5VhKI0xFZ9rkzaf9",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Ashes Crane",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Ashes Crane",
        "sort": 0
      },
      {
        "documentId": "jDTq4VrONmXOjGiJ",
        "uuid": "Item.jDTq4VrONmXOjGiJ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Ben Chang",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Ben Chang",
        "sort": 0
      },
      {
        "documentId": "iEpG4ocTIlyof9vN",
        "uuid": "Item.iEpG4ocTIlyof9vN",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Big Al (Vehicle Emporium)",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Big Al (Vehicle Emporium)",
        "sort": 0
      },
      {
        "documentId": "sY92lA3ViKSKmsrH",
        "uuid": "Item.sY92lA3ViKSKmsrH",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Bill Blanca",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Bill Blanca",
        "sort": 0
      },
      {
        "documentId": "rYcM9zckU1OqmyLR",
        "uuid": "Item.rYcM9zckU1OqmyLR",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Bluebeard",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Bluebeard",
        "sort": 0
      },
      {
        "documentId": "AjYtUnEfYqDnWObC",
        "uuid": "Item.AjYtUnEfYqDnWObC",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Bo Darville",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Bo Darville",
        "sort": 0
      },
      {
        "documentId": "qYB73UqzU9quv4t2",
        "uuid": "Item.qYB73UqzU9quv4t2",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Bob Gadling",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Bob Gadling",
        "sort": 0
      },
      {
        "documentId": "H1F4PocoKuGxfDDC",
        "uuid": "Item.H1F4PocoKuGxfDDC",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Bob Loblaw",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Bob Loblaw",
        "sort": 0
      },
      {
        "documentId": "QgaQnk5pir3PL8w1",
        "uuid": "Item.QgaQnk5pir3PL8w1",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Bobby Jones",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Bobby Jones",
        "sort": 0
      },
      {
        "documentId": "Dm4h25H4gncTQNOO",
        "uuid": "Item.Dm4h25H4gncTQNOO",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Bubbles",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Bubbles",
        "sort": 0
      },
      {
        "documentId": "Q54KhyqOMDDm2M4y",
        "uuid": "Item.Q54KhyqOMDDm2M4y",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Bunny Delish",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Bunny Delish",
        "sort": 0
      },
      {
        "documentId": "wlHVCFiKF2kejtBQ",
        "uuid": "Item.wlHVCFiKF2kejtBQ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Catapult",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Catapult",
        "sort": 0
      },
      {
        "documentId": "fvf45qHRRDuepacl",
        "uuid": "Item.fvf45qHRRDuepacl",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Cavern Johnson",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Cavern Johnson",
        "sort": 0
      },
      {
        "documentId": "XI7vblnqwhNVlEbA",
        "uuid": "Item.XI7vblnqwhNVlEbA",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Clarence Boddicker",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Clarence Boddicker",
        "sort": 0
      },
      {
        "documentId": "YTL7Tc422boXIQDO",
        "uuid": "Item.YTL7Tc422boXIQDO",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Clefton",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Clefton",
        "sort": 0
      },
      {
        "documentId": "oV8r3LT1N8sqSCDY",
        "uuid": "Item.oV8r3LT1N8sqSCDY",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Corentin Latreille Mador",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Corentin Latreille Mador",
        "sort": 0
      },
      {
        "documentId": "Dg74VG8yR6DUyb9R",
        "uuid": "Item.Dg74VG8yR6DUyb9R",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Cover Girl",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Cover Girl",
        "sort": 0
      },
      {
        "documentId": "rk99X2Lur5pU764H",
        "uuid": "Item.rk99X2Lur5pU764H",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Cy-klops",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Cy-klops",
        "sort": 0
      },
      {
        "documentId": "oCqXG1EMgmSbmIcf",
        "uuid": "Item.oCqXG1EMgmSbmIcf",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Dan",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Dan",
        "sort": 0
      },
      {
        "documentId": "PHHGu9w2JkQD4OJQ",
        "uuid": "Item.PHHGu9w2JkQD4OJQ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Diane",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Diane",
        "sort": 0
      },
      {
        "documentId": "vfr61Nhcggj9jFom",
        "uuid": "Item.vfr61Nhcggj9jFom",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Diaz Baha",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Diaz Baha",
        "sort": 0
      },
      {
        "documentId": "K8X8GdePbib1J1FG",
        "uuid": "Item.K8X8GdePbib1J1FG",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Dom Rotetto",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Dom Rotetto",
        "sort": 0
      },
      {
        "documentId": "kbNTz6Uu48JOS3lj",
        "uuid": "Item.kbNTz6Uu48JOS3lj",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Don Bruno Carino",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Don Bruno Carino",
        "sort": 0
      },
      {
        "documentId": "gooFlfWNEYNZiOwm",
        "uuid": "Item.gooFlfWNEYNZiOwm",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Donna",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Donna",
        "sort": 0
      },
      {
        "documentId": "EyfGOs9JI5aUT4E5",
        "uuid": "Item.EyfGOs9JI5aUT4E5",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Double Helix",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Double Helix",
        "sort": 0
      },
      {
        "documentId": "hRDNKTkSfYMOgobM",
        "uuid": "Item.hRDNKTkSfYMOgobM",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Dr. Brainrule",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Dr. Brainrule",
        "sort": 0
      },
      {
        "documentId": "gL0sixLnxpFbYIbO",
        "uuid": "Item.gL0sixLnxpFbYIbO",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Dr. Mind-twister",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Dr. Mind-twister",
        "sort": 0
      },
      {
        "documentId": "u2NpxG05E6BA6f5U",
        "uuid": "Item.u2NpxG05E6BA6f5U",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Dr. Ween",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Dr. Ween",
        "sort": 0
      },
      {
        "documentId": "g3wre14vQkk1zDae",
        "uuid": "Item.g3wre14vQkk1zDae",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Duke",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Duke",
        "sort": 0
      },
      {
        "documentId": "jH6QuoBmNIYmbpZv",
        "uuid": "Item.jH6QuoBmNIYmbpZv",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Easy E",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Easy E",
        "sort": 0
      },
      {
        "documentId": "GeXSPn0QSKPewn3K",
        "uuid": "Item.GeXSPn0QSKPewn3K",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "El Mostafa Urbano",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/El Mostafa Urbano",
        "sort": 0
      },
      {
        "documentId": "rcNoaOYHJARz4IaV",
        "uuid": "Item.rcNoaOYHJARz4IaV",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Ember Flint",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Ember Flint",
        "sort": 0
      },
      {
        "documentId": "O6kYu4LS7q5AtqIy",
        "uuid": "Item.O6kYu4LS7q5AtqIy",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Eric Gross",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Eric Gross",
        "sort": 0
      },
      {
        "documentId": "Jj5cx3uAJCXcwCOy",
        "uuid": "Item.Jj5cx3uAJCXcwCOy",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Flash Moresloth",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Flash Moresloth",
        "sort": 0
      },
      {
        "documentId": "EvuwtWCwM3IH3CWf",
        "uuid": "Item.EvuwtWCwM3IH3CWf",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Fungor",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Fungor",
        "sort": 0
      },
      {
        "documentId": "u2hIcGuNi9sRkEEw",
        "uuid": "Item.u2hIcGuNi9sRkEEw",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Grandmaw",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Grandmaw",
        "sort": 0
      },
      {
        "documentId": "kZZHAF2Kw2GBuoyc",
        "uuid": "Item.kZZHAF2Kw2GBuoyc",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Harlequin",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Harlequin",
        "sort": 0
      },
      {
        "documentId": "2qYfdmRBoOMV7l05",
        "uuid": "Item.2qYfdmRBoOMV7l05",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Harold Francis Callahan",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Harold Francis Callahan",
        "sort": 0
      },
      {
        "documentId": "jk0aEciJELAplXfa",
        "uuid": "Item.jk0aEciJELAplXfa",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Hobo Pirate",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Hobo Pirate",
        "sort": 0
      },
      {
        "documentId": "tBLPu8h4tGxrR9lM",
        "uuid": "Item.tBLPu8h4tGxrR9lM",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Huxley",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Huxley",
        "sort": 0
      },
      {
        "documentId": "GDMn234kFHIkasz8",
        "uuid": "Item.GDMn234kFHIkasz8",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Issac on Rails",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Issac on Rails",
        "sort": 0
      },
      {
        "documentId": "nZydJBYlZTgfeuh5",
        "uuid": "Item.nZydJBYlZTgfeuh5",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Jack Point",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Jack Point",
        "sort": 0
      },
      {
        "documentId": "CB0Gzv062xbqQQIX",
        "uuid": "Item.CB0Gzv062xbqQQIX",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "James Connor",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/James Connor",
        "sort": 0
      },
      {
        "documentId": "5rZLSY5EcQRqelVI",
        "uuid": "Item.5rZLSY5EcQRqelVI",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "James McCullen",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/James McCullen",
        "sort": 0
      },
      {
        "documentId": "9gWz5KwAAp7tBYsW",
        "uuid": "Item.9gWz5KwAAp7tBYsW",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Jet Black",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Jet Black",
        "sort": 0
      },
      {
        "documentId": "encmmM6hAcVzcXxu",
        "uuid": "Item.encmmM6hAcVzcXxu",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Jimbo",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Jimbo",
        "sort": 0
      },
      {
        "documentId": "lCVuoBGxZDJDYL1c",
        "uuid": "Item.lCVuoBGxZDJDYL1c",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Joe",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Joe",
        "sort": 0
      },
      {
        "documentId": "UbuWusPlf9Nh9agx",
        "uuid": "Item.UbuWusPlf9Nh9agx",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "John Smith",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/John Smith",
        "sort": 0
      },
      {
        "documentId": "4a8QBO3SZD9aYgL3",
        "uuid": "Item.4a8QBO3SZD9aYgL3",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Johnny",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Johnny",
        "sort": 0
      },
      {
        "documentId": "QBz1qZLpGk9e2YN5",
        "uuid": "Item.QBz1qZLpGk9e2YN5",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Juinan",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Juinan",
        "sort": 0
      },
      {
        "documentId": "e0vl6UaFL40XDZjz",
        "uuid": "Item.e0vl6UaFL40XDZjz",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Kasper Dixon",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Kasper Dixon",
        "sort": 0
      },
      {
        "documentId": "WeXfJUBywZFomble",
        "uuid": "Item.WeXfJUBywZFomble",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Kate Barker",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Kate Barker",
        "sort": 0
      },
      {
        "documentId": "7IE6Ny6aHEq6CEn9",
        "uuid": "Item.7IE6Ny6aHEq6CEn9",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Katia Frangos",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Katia Frangos",
        "sort": 0
      },
      {
        "documentId": "cy0RGoMoA2JRe62W",
        "uuid": "Item.cy0RGoMoA2JRe62W",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Kestrel",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Kestrel",
        "sort": 0
      },
      {
        "documentId": "RwEfojmv54Wq6jMW",
        "uuid": "Item.RwEfojmv54Wq6jMW",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "King of Lost Socks",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/King of Lost Socks",
        "sort": 0
      },
      {
        "documentId": "rSekDuRsGEbDtl2j",
        "uuid": "Item.rSekDuRsGEbDtl2j",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Lem Walnanespanct",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Lem Walnanespanct",
        "sort": 0
      },
      {
        "documentId": "z9eKOANEg4TkIQnC",
        "uuid": "Item.z9eKOANEg4TkIQnC",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Lena",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Lena",
        "sort": 0
      },
      {
        "documentId": "KZ6CuElYwiH5UH1n",
        "uuid": "Item.KZ6CuElYwiH5UH1n",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Levi Hochstetler",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Levi Hochstetler",
        "sort": 0
      },
      {
        "documentId": "YJkj7KPI8ajkRc2O",
        "uuid": "Item.YJkj7KPI8ajkRc2O",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Lynn Murray Griffon",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Lynn Murray Griffon",
        "sort": 0
      },
      {
        "documentId": "x3XEA6s6V66NrYkS",
        "uuid": "Item.x3XEA6s6V66NrYkS",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Mac & Bo",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Mac & Bo",
        "sort": 0
      },
      {
        "documentId": "1MvpRB7J9EDeyMCa",
        "uuid": "Item.1MvpRB7J9EDeyMCa",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Madelyn Bishop Bates",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Madelyn Bishop Bates",
        "sort": 0
      },
      {
        "documentId": "eG7AOUS7Nqi46HYC",
        "uuid": "Item.eG7AOUS7Nqi46HYC",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Max Born",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Max Born",
        "sort": 0
      },
      {
        "documentId": "McjskLAeRDyRWqnh",
        "uuid": "Item.McjskLAeRDyRWqnh",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "May",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/May",
        "sort": 0
      },
      {
        "documentId": "gzjdZEGV5hMwD2UQ",
        "uuid": "Item.gzjdZEGV5hMwD2UQ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "May O'Neil",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/May O'Neil",
        "sort": 0
      },
      {
        "documentId": "voaz2flGjQOaBY0W",
        "uuid": "Item.voaz2flGjQOaBY0W",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Melfidius",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Melfidius",
        "sort": 0
      },
      {
        "documentId": "hA04rcfC2a9VbI0H",
        "uuid": "Item.hA04rcfC2a9VbI0H",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Melody Myers",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Melody Myers",
        "sort": 0
      },
      {
        "documentId": "gcNBqfmiurcc8KlT",
        "uuid": "Item.gcNBqfmiurcc8KlT",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Michelle King",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Michelle King",
        "sort": 0
      },
      {
        "documentId": "h9ucxoVcKxy6ppMf",
        "uuid": "Item.h9ucxoVcKxy6ppMf",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Modesty Blaze",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Modesty Blaze",
        "sort": 0
      },
      {
        "documentId": "T8QkW6edGMTGY2H4",
        "uuid": "Item.T8QkW6edGMTGY2H4",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Moe Lester",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Moe Lester",
        "sort": 0
      },
      {
        "documentId": "1ROVj7pJ1XEZNnp3",
        "uuid": "Item.1ROVj7pJ1XEZNnp3",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Morgana Powers",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Morgana Powers",
        "sort": 0
      },
      {
        "documentId": "YTUy5v74L0KqaoyK",
        "uuid": "Item.YTUy5v74L0KqaoyK",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Mr. Chief",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Mr. Chief",
        "sort": 0
      },
      {
        "documentId": "3eyVQJEQ0xgt0uHm",
        "uuid": "Item.3eyVQJEQ0xgt0uHm",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Murdok Mark",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Murdok Mark",
        "sort": 0
      },
      {
        "documentId": "ezt3hK8NS68Oabyx",
        "uuid": "Item.ezt3hK8NS68Oabyx",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Nathaniel Essex",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Nathaniel Essex",
        "sort": 0
      },
      {
        "documentId": "MFdVxtWPDhGMOKH1",
        "uuid": "Item.MFdVxtWPDhGMOKH1",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Odiphus",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Odiphus",
        "sort": 0
      },
      {
        "documentId": "C7iVsP6VKaosQKHj",
        "uuid": "Item.C7iVsP6VKaosQKHj",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Pantharo",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Pantharo",
        "sort": 0
      },
      {
        "documentId": "xcngir5nZ4nDWula",
        "uuid": "Item.xcngir5nZ4nDWula",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Paris Bueller",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Paris Bueller",
        "sort": 0
      },
      {
        "documentId": "IT5bEYagj5D3uokk",
        "uuid": "Item.IT5bEYagj5D3uokk",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Pearl Pearlman",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Pearl Pearlman",
        "sort": 0
      },
      {
        "documentId": "Kesa0BW3AkbVjvLP",
        "uuid": "Item.Kesa0BW3AkbVjvLP",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Perkaedo",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Perkaedo",
        "sort": 0
      },
      {
        "documentId": "Cu59hxRQwAXCaFSf",
        "uuid": "Item.Cu59hxRQwAXCaFSf",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Phizzvan",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Phizzvan",
        "sort": 0
      },
      {
        "documentId": "GcokevNd5x45FPyl",
        "uuid": "Item.GcokevNd5x45FPyl",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Present Head",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Present Head",
        "sort": 0
      },
      {
        "documentId": "02iK8ZeUBPPsagnX",
        "uuid": "Item.02iK8ZeUBPPsagnX",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Q",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Q",
        "sort": 0
      },
      {
        "documentId": "jabYQ3QugTpDwfrx",
        "uuid": "Item.jabYQ3QugTpDwfrx",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Quill Quaz",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Quill Quaz",
        "sort": 0
      },
      {
        "documentId": "ZYWuUos7DnjBQxOR",
        "uuid": "Item.ZYWuUos7DnjBQxOR",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Rat",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Rat",
        "sort": 0
      },
      {
        "documentId": "6p8zbqxbhhpVsPcg",
        "uuid": "Item.6p8zbqxbhhpVsPcg",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Razor",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Razor",
        "sort": 0
      },
      {
        "documentId": "KW99wiP6eArdw7ju",
        "uuid": "Item.KW99wiP6eArdw7ju",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Rebecca",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Rebecca",
        "sort": 0
      },
      {
        "documentId": "1b8cKQOmUYP5tPrL",
        "uuid": "Item.1b8cKQOmUYP5tPrL",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Reverand Dr. Syn",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Reverand Dr. Syn",
        "sort": 0
      },
      {
        "documentId": "LHkxI83ax0PwqoGz",
        "uuid": "Item.LHkxI83ax0PwqoGz",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Risleb the Immortal",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Risleb the Immortal",
        "sort": 0
      },
      {
        "documentId": "7uKRvcNgRrOnJonV",
        "uuid": "Item.7uKRvcNgRrOnJonV",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Robert",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Robert",
        "sort": 0
      },
      {
        "documentId": "0hjXojRSTGywbceU",
        "uuid": "Item.0hjXojRSTGywbceU",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Robert Savage",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Robert Savage",
        "sort": 0
      },
      {
        "documentId": "JxpYLPdmydbbKwKc",
        "uuid": "Item.JxpYLPdmydbbKwKc",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Roberto",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Roberto",
        "sort": 0
      },
      {
        "documentId": "mijOI5UupDMnOjlk",
        "uuid": "Item.mijOI5UupDMnOjlk",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Royal Continental",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Royal Continental",
        "sort": 0
      },
      {
        "documentId": "L2UoKT4Iu1KlkJjf",
        "uuid": "Item.L2UoKT4Iu1KlkJjf",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Russ \"The String\" Bell",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Russ \"The String\" Bell",
        "sort": 0
      },
      {
        "documentId": "666bx83ceQHsoBpn",
        "uuid": "Item.666bx83ceQHsoBpn",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Sammon Shamon Al-Baz",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Sammon Shamon Al-Baz",
        "sort": 0
      },
      {
        "documentId": "Le4yZ18sSKktViJK",
        "uuid": "Item.Le4yZ18sSKktViJK",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Sarah Konnor",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Sarah Konnor",
        "sort": 0
      },
      {
        "documentId": "eNHJvhZKNMtqEHft",
        "uuid": "Item.eNHJvhZKNMtqEHft",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Scarab",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Scarab",
        "sort": 0
      },
      {
        "documentId": "oJvqD5v4tO1djz5h",
        "uuid": "Item.oJvqD5v4tO1djz5h",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Serpent Pliskin",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Serpent Pliskin",
        "sort": 0
      },
      {
        "documentId": "kJfucVrQcLqEaWhd",
        "uuid": "Item.kJfucVrQcLqEaWhd",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Skeletron",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Skeletron",
        "sort": 0
      },
      {
        "documentId": "2Oykf6XPWxD5q4VM",
        "uuid": "Item.2Oykf6XPWxD5q4VM",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Snap-Jaw",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Snap-Jaw",
        "sort": 0
      },
      {
        "documentId": "EQL9qZU53ZiArlCU",
        "uuid": "Item.EQL9qZU53ZiArlCU",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Snowball",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Snowball",
        "sort": 0
      },
      {
        "documentId": "JVV7tp0rQkgJCdrj",
        "uuid": "Item.JVV7tp0rQkgJCdrj",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Spearmint",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Spearmint",
        "sort": 0
      },
      {
        "documentId": "YhAKWJtw6pEcNzee",
        "uuid": "Item.YhAKWJtw6pEcNzee",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Sydney Greenstreet the Duckpin",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Sydney Greenstreet the Duckpin",
        "sort": 0
      },
      {
        "documentId": "zwrzi9Knj7bWp3d7",
        "uuid": "Item.zwrzi9Knj7bWp3d7",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Techno-viking",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Techno-viking",
        "sort": 0
      },
      {
        "documentId": "k4fYca9yscm5gHe6",
        "uuid": "Item.k4fYca9yscm5gHe6",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "The Blue Meanies",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/The Blue Meanies",
        "sort": 0
      },
      {
        "documentId": "rP8a3IR0OBEsxzSj",
        "uuid": "Item.rP8a3IR0OBEsxzSj",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "The Certified Accountant",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/The Certified Accountant",
        "sort": 0
      },
      {
        "documentId": "VYlR7cYmmgJuu5vL",
        "uuid": "Item.VYlR7cYmmgJuu5vL",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "The Coughing Man",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/The Coughing Man",
        "sort": 0
      },
      {
        "documentId": "kWKEev9fMlvOgFHP",
        "uuid": "Item.kWKEev9fMlvOgFHP",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "The Countess",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/The Countess",
        "sort": 0
      },
      {
        "documentId": "JNMLOmY7PRx1NfpA",
        "uuid": "Item.JNMLOmY7PRx1NfpA",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "The Gimcrak King",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/The Gimcrak King",
        "sort": 0
      },
      {
        "documentId": "gUgkxHMGoWwyvyMv",
        "uuid": "Item.gUgkxHMGoWwyvyMv",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Thumper",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Thumper",
        "sort": 0
      },
      {
        "documentId": "UZ7foI7EdHLPpm30",
        "uuid": "Item.UZ7foI7EdHLPpm30",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Tibor Phrenczy",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Tibor Phrenczy",
        "sort": 0
      },
      {
        "documentId": "ID9dSrSnFgWFrL0A",
        "uuid": "Item.ID9dSrSnFgWFrL0A",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Tooth Spitter",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Tooth Spitter",
        "sort": 0
      },
      {
        "documentId": "TXUzSM3wblfJvdVc",
        "uuid": "Item.TXUzSM3wblfJvdVc",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Turret",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Turret",
        "sort": 0
      },
      {
        "documentId": "F1geklb0vncVzx82",
        "uuid": "Item.F1geklb0vncVzx82",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Tyrel Melchor",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Tyrel Melchor",
        "sort": 0
      },
      {
        "documentId": "mSmghLY4ofUqaSkB",
        "uuid": "Item.mSmghLY4ofUqaSkB",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "W. H. Loh",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/W. H. Loh",
        "sort": 0
      },
      {
        "documentId": "P4ZliFjv32dOi8Nt",
        "uuid": "Item.P4ZliFjv32dOi8Nt",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Warden Hand",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Warden Hand",
        "sort": 0
      },
      {
        "documentId": "ovPYIBvPsWe4njgy",
        "uuid": "Item.ovPYIBvPsWe4njgy",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Weird",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Weird",
        "sort": 0
      },
      {
        "documentId": "nhTkSzOfSyu0y4Pk",
        "uuid": "Item.nhTkSzOfSyu0y4Pk",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "William Kilgore",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/William Kilgore",
        "sort": 0
      },
      {
        "documentId": "eE8lmGwmE4kgOrjc",
        "uuid": "Item.eE8lmGwmE4kgOrjc",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Yahya Boulos",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Yahya Boulos",
        "sort": 0
      },
      {
        "documentId": "x7uOelnHCPtdL5yy",
        "uuid": "Item.x7uOelnHCPtdL5yy",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Zane",
        "folderId": "76RtzViuhpI874RJ",
        "folderPath": "Brand/Assets",
        "path": "Brand/Assets/Zane",
        "sort": 0
      },
      {
        "documentId": "WFTBh6F3W11sBXdI",
        "uuid": "Item.WFTBh6F3W11sBXdI",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "ResourceTest",
        "folderId": "tH4sjhPKYwIEC0KT",
        "folderPath": "Brand/Resources",
        "path": "Brand/Resources/ResourceTest",
        "sort": 0
      },
      {
        "documentId": "EXplZQVrK4Iuq2Cs",
        "uuid": "Item.EXplZQVrK4Iuq2Cs",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Fujitsu Edge",
        "folderId": "TpyOdo9rRmcJZwT2",
        "folderPath": "Decking/Cyberdecks",
        "path": "Decking/Cyberdecks/Fujitsu Edge",
        "sort": 375000
      },
      {
        "documentId": "fzQqP7oUYtJb8rHo",
        "uuid": "Item.fzQqP7oUYtJb8rHo",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Mars Claymore",
        "folderId": "TpyOdo9rRmcJZwT2",
        "folderPath": "Decking/Cyberdecks",
        "path": "Decking/Cyberdecks/Mars Claymore",
        "sort": 350000
      },
      {
        "documentId": "tn1WVRqrAoPCjIWp",
        "uuid": "Item.tn1WVRqrAoPCjIWp",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "MasterDeck",
        "folderId": "TpyOdo9rRmcJZwT2",
        "folderPath": "Decking/Cyberdecks",
        "path": "Decking/Cyberdecks/MasterDeck",
        "sort": 200000
      },
      {
        "documentId": "DD5aVFTQACYYq90Q",
        "uuid": "Item.DD5aVFTQACYYq90Q",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Orb Epsilon",
        "folderId": "TpyOdo9rRmcJZwT2",
        "folderPath": "Decking/Cyberdecks",
        "path": "Decking/Cyberdecks/Orb Epsilon",
        "sort": 387500
      },
      {
        "documentId": "zAzoB1sPvfjonoAo",
        "uuid": "Item.zAzoB1sPvfjonoAo",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Orpheus Dreamweaver",
        "folderId": "TpyOdo9rRmcJZwT2",
        "folderPath": "Decking/Cyberdecks",
        "path": "Decking/Cyberdecks/Orpheus Dreamweaver",
        "sort": 400000
      },
      {
        "documentId": "PunQ75zoS4ML4Lt0",
        "uuid": "Item.PunQ75zoS4ML4Lt0",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Royal Durandal",
        "folderId": "TpyOdo9rRmcJZwT2",
        "folderPath": "Decking/Cyberdecks",
        "path": "Decking/Cyberdecks/Royal Durandal",
        "sort": 800000
      },
      {
        "documentId": "rZ6vcAquAxsVA8dg",
        "uuid": "Item.rZ6vcAquAxsVA8dg",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Semi Point Razor",
        "folderId": "TpyOdo9rRmcJZwT2",
        "folderPath": "Decking/Cyberdecks",
        "path": "Decking/Cyberdecks/Semi Point Razor",
        "sort": 300000
      },
      {
        "documentId": "jguZaaNdVKo7bs7q",
        "uuid": "Item.jguZaaNdVKo7bs7q",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Shingo Activa",
        "folderId": "TpyOdo9rRmcJZwT2",
        "folderPath": "Decking/Cyberdecks",
        "path": "Decking/Cyberdecks/Shingo Activa",
        "sort": 250000
      },
      {
        "documentId": "RtvBoN5fIK9yC9mU",
        "uuid": "Item.RtvBoN5fIK9yC9mU",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Acid Burn",
        "folderId": "FBqDldU0lm0kCoRQ",
        "folderPath": "Decking/E War Threads",
        "path": "Decking/E War Threads/Acid Burn",
        "sort": 0
      },
      {
        "documentId": "I9QQRZWWtVSvIQ3Z",
        "uuid": "Item.I9QQRZWWtVSvIQ3Z",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Analysis Locus",
        "folderId": "FBqDldU0lm0kCoRQ",
        "folderPath": "Decking/E War Threads",
        "path": "Decking/E War Threads/Analysis Locus",
        "sort": 0
      },
      {
        "documentId": "DZYaFjVnnjOzRTj4",
        "uuid": "Item.DZYaFjVnnjOzRTj4",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Corrupt IFF",
        "folderId": "FBqDldU0lm0kCoRQ",
        "folderPath": "Decking/E War Threads",
        "path": "Decking/E War Threads/Corrupt IFF",
        "sort": 0
      },
      {
        "documentId": "FQmvFTag1EMZwk94",
        "uuid": "Item.FQmvFTag1EMZwk94",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "De-Rez",
        "folderId": "FBqDldU0lm0kCoRQ",
        "folderPath": "Decking/E War Threads",
        "path": "Decking/E War Threads/De-Rez",
        "sort": 0
      },
      {
        "documentId": "EZPyN7GodhwHFB0G",
        "uuid": "Item.EZPyN7GodhwHFB0G",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Device Control",
        "folderId": "FBqDldU0lm0kCoRQ",
        "folderPath": "Decking/E War Threads",
        "path": "Decking/E War Threads/Device Control",
        "sort": 0
      },
      {
        "documentId": "Qbp5AmTBLPIWvHK0",
        "uuid": "Item.Qbp5AmTBLPIWvHK0",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Hypnotic Projection",
        "folderId": "FBqDldU0lm0kCoRQ",
        "folderPath": "Decking/E War Threads",
        "path": "Decking/E War Threads/Hypnotic Projection",
        "sort": 0
      },
      {
        "documentId": "7IRs6MwcbyHAALRp",
        "uuid": "Item.7IRs6MwcbyHAALRp",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Refraction Field",
        "folderId": "FBqDldU0lm0kCoRQ",
        "folderPath": "Decking/E War Threads",
        "path": "Decking/E War Threads/Refraction Field",
        "sort": 0
      },
      {
        "documentId": "FQj1PGA1AKF4pfvZ",
        "uuid": "Item.FQj1PGA1AKF4pfvZ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Targeted Disruption",
        "folderId": "FBqDldU0lm0kCoRQ",
        "folderPath": "Decking/E War Threads",
        "path": "Decking/E War Threads/Targeted Disruption",
        "sort": 0
      },
      {
        "documentId": "oRz0KfIjh0V4CbbD",
        "uuid": "Item.oRz0KfIjh0V4CbbD",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Vermin Call",
        "folderId": "FBqDldU0lm0kCoRQ",
        "folderPath": "Decking/E War Threads",
        "path": "Decking/E War Threads/Vermin Call",
        "sort": 0
      },
      {
        "documentId": "CRfCfHczDcdxvQG7",
        "uuid": "Item.CRfCfHczDcdxvQG7",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Alert Monitor",
        "folderId": "92dSVkunMksoE7g2",
        "folderPath": "Decking/Hacking Threads",
        "path": "Decking/Hacking Threads/Alert Monitor",
        "sort": 0
      },
      {
        "documentId": "K68bkQAH3YKDUtXO",
        "uuid": "Item.K68bkQAH3YKDUtXO",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Crack Encryption",
        "folderId": "92dSVkunMksoE7g2",
        "folderPath": "Decking/Hacking Threads",
        "path": "Decking/Hacking Threads/Crack Encryption",
        "sort": 0
      },
      {
        "documentId": "PpNXIX1skyoL0TUd",
        "uuid": "Item.PpNXIX1skyoL0TUd",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Decoy",
        "folderId": "92dSVkunMksoE7g2",
        "folderPath": "Decking/Hacking Threads",
        "path": "Decking/Hacking Threads/Decoy",
        "sort": 0
      },
      {
        "documentId": "2IYdU2FRR7FrlnCZ",
        "uuid": "Item.2IYdU2FRR7FrlnCZ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Electric Strike",
        "folderId": "92dSVkunMksoE7g2",
        "folderPath": "Decking/Hacking Threads",
        "path": "Decking/Hacking Threads/Electric Strike",
        "sort": 0
      },
      {
        "documentId": "DHu7KLrwWwZrhsYw",
        "uuid": "Item.DHu7KLrwWwZrhsYw",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Emotional Influence",
        "folderId": "92dSVkunMksoE7g2",
        "folderPath": "Decking/Hacking Threads",
        "path": "Decking/Hacking Threads/Emotional Influence",
        "sort": 0
      },
      {
        "documentId": "gtZmJ4A2HHiiCa3t",
        "uuid": "Item.gtZmJ4A2HHiiCa3t",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Encrypt File",
        "folderId": "92dSVkunMksoE7g2",
        "folderPath": "Decking/Hacking Threads",
        "path": "Decking/Hacking Threads/Encrypt File",
        "sort": 0
      },
      {
        "documentId": "TbZIiS4wj4ebQr3v",
        "uuid": "Item.TbZIiS4wj4ebQr3v",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Ghost Protocol",
        "folderId": "92dSVkunMksoE7g2",
        "folderPath": "Decking/Hacking Threads",
        "path": "Decking/Hacking Threads/Ghost Protocol",
        "sort": 0
      },
      {
        "documentId": "dmVJnyLDngBKpJCJ",
        "uuid": "Item.dmVJnyLDngBKpJCJ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Shadow Protocols",
        "folderId": "92dSVkunMksoE7g2",
        "folderPath": "Decking/Hacking Threads",
        "path": "Decking/Hacking Threads/Shadow Protocols",
        "sort": 0
      },
      {
        "documentId": "qqUde7IByVn3p8fg",
        "uuid": "Item.qqUde7IByVn3p8fg",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Situational Advantage",
        "folderId": "92dSVkunMksoE7g2",
        "folderPath": "Decking/Hacking Threads",
        "path": "Decking/Hacking Threads/Situational Advantage",
        "sort": 0
      },
      {
        "documentId": "vn6vAJjPvYlkvHdb",
        "uuid": "Item.vn6vAJjPvYlkvHdb",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Sonic Sickness",
        "folderId": "92dSVkunMksoE7g2",
        "folderPath": "Decking/Hacking Threads",
        "path": "Decking/Hacking Threads/Sonic Sickness",
        "sort": 0
      },
      {
        "documentId": "RcFycLrZJN8Cp0BO",
        "uuid": "Item.RcFycLrZJN8Cp0BO",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Universal Translator",
        "folderId": "92dSVkunMksoE7g2",
        "folderPath": "Decking/Hacking Threads",
        "path": "Decking/Hacking Threads/Universal Translator",
        "sort": 0
      },
      {
        "documentId": "vvfsVWv2MAqEncOz",
        "uuid": "Item.vvfsVWv2MAqEncOz",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Vent Gas",
        "folderId": "92dSVkunMksoE7g2",
        "folderPath": "Decking/Hacking Threads",
        "path": "Decking/Hacking Threads/Vent Gas",
        "sort": 0
      },
      {
        "documentId": "KtQoPc0pupgHyxgm",
        "uuid": "Item.KtQoPc0pupgHyxgm",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Device Control",
        "folderId": null,
        "folderPath": null,
        "path": "Device Control",
        "sort": 150000
      },
      {
        "documentId": "WY25OJUJECjpkwcP",
        "uuid": "Item.WY25OJUJECjpkwcP",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Ewar",
        "folderId": null,
        "folderPath": null,
        "path": "Ewar",
        "sort": 200000
      },
      {
        "documentId": "4fv3HY7jwOQE2wrN",
        "uuid": "Item.4fv3HY7jwOQE2wrN",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Hacking",
        "folderId": null,
        "folderPath": null,
        "path": "Hacking",
        "sort": 300000
      },
      {
        "documentId": "f08CtBQkKaE5ZSXC",
        "uuid": "Item.f08CtBQkKaE5ZSXC",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Adrenaline Boost",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Adrenaline Boost",
        "sort": 0
      },
      {
        "documentId": "tiO7BsSvlJyiMZdm",
        "uuid": "Item.tiO7BsSvlJyiMZdm",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Aspect of the Chelonian",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Aspect of the Chelonian",
        "sort": 0
      },
      {
        "documentId": "clxvfazev8xp55w9",
        "uuid": "Item.clxvfazev8xp55w9",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Astral Resistance",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Astral Resistance",
        "sort": 0
      },
      {
        "documentId": "Qmdd6jmXad0HSEtF",
        "uuid": "Item.Qmdd6jmXad0HSEtF",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Attribute Boost",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Attribute Boost",
        "sort": 0
      },
      {
        "documentId": "aSqlb66DuhAGgJ9S",
        "uuid": "Item.aSqlb66DuhAGgJ9S",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Attribute Increase",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Attribute Increase",
        "sort": 0
      },
      {
        "documentId": "0nao5SdoAsmBjfmD",
        "uuid": "Item.0nao5SdoAsmBjfmD",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Body Equilibrium",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Body Equilibrium",
        "sort": 0
      },
      {
        "documentId": "tj6IMltdhTINSLmA",
        "uuid": "Item.tj6IMltdhTINSLmA",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Combat Mastery",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Combat Mastery",
        "sort": 0
      },
      {
        "documentId": "h1ob9dBv1IeacGdb",
        "uuid": "Item.h1ob9dBv1IeacGdb",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Expertise",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Expertise",
        "sort": 0
      },
      {
        "documentId": "8wLvjrHRdf5eNklf",
        "uuid": "Item.8wLvjrHRdf5eNklf",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Eyes of the Raptor",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Eyes of the Raptor",
        "sort": 0
      },
      {
        "documentId": "ou0adA5kalAf2frn",
        "uuid": "Item.ou0adA5kalAf2frn",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Fade From Vision",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Fade From Vision",
        "sort": 0
      },
      {
        "documentId": "McsiqvcEaBaen8JV",
        "uuid": "Item.McsiqvcEaBaen8JV",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Far Sight",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Far Sight",
        "sort": 0
      },
      {
        "documentId": "Dd2oHvDor0doH4zU",
        "uuid": "Item.Dd2oHvDor0doH4zU",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Flash Step",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Flash Step",
        "sort": 0
      },
      {
        "documentId": "sbGWtLY4WmT5r34H",
        "uuid": "Item.sbGWtLY4WmT5r34H",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Flying Crane",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Flying Crane",
        "sort": 0
      },
      {
        "documentId": "WnQzcFG3H1MWgllo",
        "uuid": "Item.WnQzcFG3H1MWgllo",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Ghost",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Ghost",
        "sort": 0
      },
      {
        "documentId": "X7XeDOGy2FkWCcb3",
        "uuid": "Item.X7XeDOGy2FkWCcb3",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Hidden Presence",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Hidden Presence",
        "sort": 0
      },
      {
        "documentId": "6lqyTjaujr2dq4sp",
        "uuid": "Item.6lqyTjaujr2dq4sp",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Iron Fist",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Iron Fist",
        "sort": 0
      },
      {
        "documentId": "0BfN5Awg4ZNR1Fjs",
        "uuid": "Item.0BfN5Awg4ZNR1Fjs",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Perfect Situational Awareness",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Perfect Situational Awareness",
        "sort": 0
      },
      {
        "documentId": "ZBB3t6Fv3G8QJ6de",
        "uuid": "Item.ZBB3t6Fv3G8QJ6de",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Rasputin's Blessing",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Rasputin's Blessing",
        "sort": 0
      },
      {
        "documentId": "X5LQgz36flJj9tK9",
        "uuid": "Item.X5LQgz36flJj9tK9",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Returning the Fang",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Returning the Fang",
        "sort": 0
      },
      {
        "documentId": "48RI3LsyHTy9oT9L",
        "uuid": "Item.48RI3LsyHTy9oT9L",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Self-healing",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Self-healing",
        "sort": 0
      },
      {
        "documentId": "Zw3U5vwPY0jMseBs",
        "uuid": "Item.Zw3U5vwPY0jMseBs",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Shadow Double",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Shadow Double",
        "sort": 0
      },
      {
        "documentId": "oEyETooOB5OI3TP5",
        "uuid": "Item.oEyETooOB5OI3TP5",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Suspended Animation",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Suspended Animation",
        "sort": 0
      },
      {
        "documentId": "qqOhECCfkuqDzFXc",
        "uuid": "Item.qqOhECCfkuqDzFXc",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Telekinesis",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Telekinesis",
        "sort": 0
      },
      {
        "documentId": "uGseiglBA4iPtOGe",
        "uuid": "Item.uGseiglBA4iPtOGe",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Touch of the Spider",
        "folderId": "TOqDCNaMbz4McNIl",
        "folderPath": "Manon/Amplification",
        "path": "Manon/Amplification/Touch of the Spider",
        "sort": 0
      },
      {
        "documentId": "yrkX7EvtmlE2n2ML",
        "uuid": "Item.yrkX7EvtmlE2n2ML",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Shaman Spirit Map",
        "folderId": "aHvlIdpJNdmTmDRg",
        "folderPath": "Manon/Conjuring/Spirit Maps",
        "path": "Manon/Conjuring/Spirit Maps/Shaman Spirit Map",
        "sort": 0
      },
      {
        "documentId": "E5OWiUE5QpLNlGcE",
        "uuid": "Item.E5OWiUE5QpLNlGcE",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Aqua Deambulatio",
        "folderId": "JrXjUPTbu2Jj2AuN",
        "folderPath": "Manon/Conjuring/Spirits (Shaman)",
        "path": "Manon/Conjuring/Spirits (Shaman)/Aqua Deambulatio",
        "sort": 100000
      },
      {
        "documentId": "0PP8kolvMwJhJNKD",
        "uuid": "Item.0PP8kolvMwJhJNKD",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Attash Aazaar",
        "folderId": "JrXjUPTbu2Jj2AuN",
        "folderPath": "Manon/Conjuring/Spirits (Shaman)",
        "path": "Manon/Conjuring/Spirits (Shaman)/Attash Aazaar",
        "sort": 100000
      },
      {
        "documentId": "Sb06F76Od5OntLAp",
        "uuid": "Item.Sb06F76Od5OntLAp",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Gaoh",
        "folderId": "JrXjUPTbu2Jj2AuN",
        "folderPath": "Manon/Conjuring/Spirits (Shaman)",
        "path": "Manon/Conjuring/Spirits (Shaman)/Gaoh",
        "sort": 100000
      },
      {
        "documentId": "Lt71JzIxenESP1pO",
        "uuid": "Item.Lt71JzIxenESP1pO",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Ignis Dicen",
        "folderId": "JrXjUPTbu2Jj2AuN",
        "folderPath": "Manon/Conjuring/Spirits (Shaman)",
        "path": "Manon/Conjuring/Spirits (Shaman)/Ignis Dicen",
        "sort": 100000
      },
      {
        "documentId": "aJR54vvHU7ifcT3x",
        "uuid": "Item.aJR54vvHU7ifcT3x",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Lapsae Caelum",
        "folderId": "JrXjUPTbu2Jj2AuN",
        "folderPath": "Manon/Conjuring/Spirits (Shaman)",
        "path": "Manon/Conjuring/Spirits (Shaman)/Lapsae Caelum",
        "sort": 100000
      },
      {
        "documentId": "sDW8RKaqw20LJgZr",
        "uuid": "Item.sDW8RKaqw20LJgZr",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Miasma",
        "folderId": "JrXjUPTbu2Jj2AuN",
        "folderPath": "Manon/Conjuring/Spirits (Shaman)",
        "path": "Manon/Conjuring/Spirits (Shaman)/Miasma",
        "sort": 100000
      },
      {
        "documentId": "TEKGswwJx0xK6yrE",
        "uuid": "Item.TEKGswwJx0xK6yrE",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Moryana",
        "folderId": "JrXjUPTbu2Jj2AuN",
        "folderPath": "Manon/Conjuring/Spirits (Shaman)",
        "path": "Manon/Conjuring/Spirits (Shaman)/Moryana",
        "sort": 100000
      },
      {
        "documentId": "lb99tCjEOeLbIULg",
        "uuid": "Item.lb99tCjEOeLbIULg",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Mound of Skulls",
        "folderId": "JrXjUPTbu2Jj2AuN",
        "folderPath": "Manon/Conjuring/Spirits (Shaman)",
        "path": "Manon/Conjuring/Spirits (Shaman)/Mound of Skulls",
        "sort": 100000
      },
      {
        "documentId": "5y1pLcZT9TAJ48Y5",
        "uuid": "Item.5y1pLcZT9TAJ48Y5",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Pacha Mama",
        "folderId": "JrXjUPTbu2Jj2AuN",
        "folderPath": "Manon/Conjuring/Spirits (Shaman)",
        "path": "Manon/Conjuring/Spirits (Shaman)/Pacha Mama",
        "sort": 100000
      },
      {
        "documentId": "yFmEhhXWBMPzEmT6",
        "uuid": "Item.yFmEhhXWBMPzEmT6",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Stormwing",
        "folderId": "JrXjUPTbu2Jj2AuN",
        "folderPath": "Manon/Conjuring/Spirits (Shaman)",
        "path": "Manon/Conjuring/Spirits (Shaman)/Stormwing",
        "sort": 100000
      },
      {
        "documentId": "DYPps0dldfLQk5QR",
        "uuid": "Item.DYPps0dldfLQk5QR",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Terra Factorem",
        "folderId": "JrXjUPTbu2Jj2AuN",
        "folderPath": "Manon/Conjuring/Spirits (Shaman)",
        "path": "Manon/Conjuring/Spirits (Shaman)/Terra Factorem",
        "sort": 100000
      },
      {
        "documentId": "f5IUCrWJlZcm5HVh",
        "uuid": "Item.f5IUCrWJlZcm5HVh",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Zeek",
        "folderId": "JrXjUPTbu2Jj2AuN",
        "folderPath": "Manon/Conjuring/Spirits (Shaman)",
        "path": "Manon/Conjuring/Spirits (Shaman)/Zeek",
        "sort": 100000
      },
      {
        "documentId": "pAeXL4bxymLOmQ1q",
        "uuid": "Item.pAeXL4bxymLOmQ1q",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Break Ward",
        "folderId": "6lAsZV9lPeO51DJT",
        "folderPath": "Manon/Rituals",
        "path": "Manon/Rituals/Break Ward",
        "sort": 0
      },
      {
        "documentId": "2Z7K60JuGEHHUK2k",
        "uuid": "Item.2Z7K60JuGEHHUK2k",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Cottage Refuge",
        "folderId": "6lAsZV9lPeO51DJT",
        "folderPath": "Manon/Rituals",
        "path": "Manon/Rituals/Cottage Refuge",
        "sort": 0
      },
      {
        "documentId": "H9Oc08Axpd1f7xCZ",
        "uuid": "Item.H9Oc08Axpd1f7xCZ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Locating a Person",
        "folderId": "6lAsZV9lPeO51DJT",
        "folderPath": "Manon/Rituals",
        "path": "Manon/Rituals/Locating a Person",
        "sort": 0
      },
      {
        "documentId": "pm2Sbn87hDqbibED",
        "uuid": "Item.pm2Sbn87hDqbibED",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Preservation",
        "folderId": "6lAsZV9lPeO51DJT",
        "folderPath": "Manon/Rituals",
        "path": "Manon/Rituals/Preservation",
        "sort": 0
      },
      {
        "documentId": "5abTs2EYqMYCY0LY",
        "uuid": "Item.5abTs2EYqMYCY0LY",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Raise Ward",
        "folderId": "6lAsZV9lPeO51DJT",
        "folderPath": "Manon/Rituals",
        "path": "Manon/Rituals/Raise Ward",
        "sort": 0
      },
      {
        "documentId": "dzPdlWhhLazVJNSM",
        "uuid": "Item.dzPdlWhhLazVJNSM",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Recall Device",
        "folderId": "6lAsZV9lPeO51DJT",
        "folderPath": "Manon/Rituals",
        "path": "Manon/Rituals/Recall Device",
        "sort": 0
      },
      {
        "documentId": "KkLU4mjqG6VoMWrL",
        "uuid": "Item.KkLU4mjqG6VoMWrL",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Sterilize",
        "folderId": "6lAsZV9lPeO51DJT",
        "folderPath": "Manon/Rituals",
        "path": "Manon/Rituals/Sterilize",
        "sort": 0
      },
      {
        "documentId": "XsZ2Rv5ft5OeHlzM",
        "uuid": "Item.XsZ2Rv5ft5OeHlzM",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Travel Over Distance",
        "folderId": "6lAsZV9lPeO51DJT",
        "folderPath": "Manon/Rituals",
        "path": "Manon/Rituals/Travel Over Distance",
        "sort": 0
      },
      {
        "documentId": "wFH9HWFtsZhdVGLx",
        "uuid": "Item.wFH9HWFtsZhdVGLx",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Weather Protection",
        "folderId": "6lAsZV9lPeO51DJT",
        "folderPath": "Manon/Rituals",
        "path": "Manon/Rituals/Weather Protection",
        "sort": 0
      },
      {
        "documentId": "wMZ6hE3wNGN1pidi",
        "uuid": "Item.wMZ6hE3wNGN1pidi",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Black Bolt of Uthal",
        "folderId": "6OffBG8bkUnp7Ixf",
        "folderPath": "Manon/Sorcery/Astral Umbra",
        "path": "Manon/Sorcery/Astral Umbra/Black Bolt of Uthal",
        "sort": 0
      },
      {
        "documentId": "gEakhlOVhvXvAXHC",
        "uuid": "Item.gEakhlOVhvXvAXHC",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Cloak of Night",
        "folderId": "6OffBG8bkUnp7Ixf",
        "folderPath": "Manon/Sorcery/Astral Umbra",
        "path": "Manon/Sorcery/Astral Umbra/Cloak of Night",
        "sort": 0
      },
      {
        "documentId": "udPmRpLEYBuiPawZ",
        "uuid": "Item.udPmRpLEYBuiPawZ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Create Darkenbeast",
        "folderId": "6OffBG8bkUnp7Ixf",
        "folderPath": "Manon/Sorcery/Astral Umbra",
        "path": "Manon/Sorcery/Astral Umbra/Create Darkenbeast",
        "sort": 0
      },
      {
        "documentId": "tZvdDTKB020lN7Rd",
        "uuid": "Item.tZvdDTKB020lN7Rd",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Dire Touch of Ennui",
        "folderId": "6OffBG8bkUnp7Ixf",
        "folderPath": "Manon/Sorcery/Astral Umbra",
        "path": "Manon/Sorcery/Astral Umbra/Dire Touch of Ennui",
        "sort": 0
      },
      {
        "documentId": "jRZ2bN2LcV7UCJZr",
        "uuid": "Item.jRZ2bN2LcV7UCJZr",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Evocation of the Frail Beam of Debility",
        "folderId": "6OffBG8bkUnp7Ixf",
        "folderPath": "Manon/Sorcery/Astral Umbra",
        "path": "Manon/Sorcery/Astral Umbra/Evocation of the Frail Beam of Debility",
        "sort": 0
      },
      {
        "documentId": "4cKQxb6BJNmXLLBF",
        "uuid": "Item.4cKQxb6BJNmXLLBF",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Horrors of the Unknown Dark",
        "folderId": "6OffBG8bkUnp7Ixf",
        "folderPath": "Manon/Sorcery/Astral Umbra",
        "path": "Manon/Sorcery/Astral Umbra/Horrors of the Unknown Dark",
        "sort": 0
      },
      {
        "documentId": "zHCnZBzRIRRQeuxn",
        "uuid": "Item.zHCnZBzRIRRQeuxn",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Moment of Eclipse",
        "folderId": "6OffBG8bkUnp7Ixf",
        "folderPath": "Manon/Sorcery/Astral Umbra",
        "path": "Manon/Sorcery/Astral Umbra/Moment of Eclipse",
        "sort": 0
      },
      {
        "documentId": "RFR0w21azVr0RKzE",
        "uuid": "Item.RFR0w21azVr0RKzE",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Night's Chill",
        "folderId": "6OffBG8bkUnp7Ixf",
        "folderPath": "Manon/Sorcery/Astral Umbra",
        "path": "Manon/Sorcery/Astral Umbra/Night's Chill",
        "sort": 0
      },
      {
        "documentId": "qOZpEsrQZXMFzOFG",
        "uuid": "Item.qOZpEsrQZXMFzOFG",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Shadow Anchor",
        "folderId": "6OffBG8bkUnp7Ixf",
        "folderPath": "Manon/Sorcery/Astral Umbra",
        "path": "Manon/Sorcery/Astral Umbra/Shadow Anchor",
        "sort": 0
      },
      {
        "documentId": "M1Sq9cOCQqk3QZpy",
        "uuid": "Item.M1Sq9cOCQqk3QZpy",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Shadow Path of Vile Ether",
        "folderId": "6OffBG8bkUnp7Ixf",
        "folderPath": "Manon/Sorcery/Astral Umbra",
        "path": "Manon/Sorcery/Astral Umbra/Shadow Path of Vile Ether",
        "sort": 0
      },
      {
        "documentId": "hch7HYXSTsyIQZLG",
        "uuid": "Item.hch7HYXSTsyIQZLG",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Sorcery of the Wraith's Flight",
        "folderId": "6OffBG8bkUnp7Ixf",
        "folderPath": "Manon/Sorcery/Astral Umbra",
        "path": "Manon/Sorcery/Astral Umbra/Sorcery of the Wraith's Flight",
        "sort": 0
      },
      {
        "documentId": "fIUfZv7WoVVS98vS",
        "uuid": "Item.fIUfZv7WoVVS98vS",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "The Marvelous Cursed Sigil of Athozog",
        "folderId": "6OffBG8bkUnp7Ixf",
        "folderPath": "Manon/Sorcery/Astral Umbra",
        "path": "Manon/Sorcery/Astral Umbra/The Marvelous Cursed Sigil of Athozog",
        "sort": 0
      },
      {
        "documentId": "JLUfuvXTmCKQBKdK",
        "uuid": "Item.JLUfuvXTmCKQBKdK",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "The Serene Conjuration of Ehon's Gate",
        "folderId": "6OffBG8bkUnp7Ixf",
        "folderPath": "Manon/Sorcery/Astral Umbra",
        "path": "Manon/Sorcery/Astral Umbra/The Serene Conjuration of Ehon's Gate",
        "sort": 0
      },
      {
        "documentId": "7sh0HvJFqJZEUj1H",
        "uuid": "Item.7sh0HvJFqJZEUj1H",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "The Thirty Cursed Servant of Athozog",
        "folderId": "6OffBG8bkUnp7Ixf",
        "folderPath": "Manon/Sorcery/Astral Umbra",
        "path": "Manon/Sorcery/Astral Umbra/The Thirty Cursed Servant of Athozog",
        "sort": 0
      },
      {
        "documentId": "vaom688y77coLKF5",
        "uuid": "Item.vaom688y77coLKF5",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "The Uncountable Tendrils of Ehon",
        "folderId": "6OffBG8bkUnp7Ixf",
        "folderPath": "Manon/Sorcery/Astral Umbra",
        "path": "Manon/Sorcery/Astral Umbra/The Uncountable Tendrils of Ehon",
        "sort": 0
      },
      {
        "documentId": "iOFEgVhP1YVeuKd6",
        "uuid": "Item.iOFEgVhP1YVeuKd6",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Chant of Dire Malady",
        "folderId": "v0lGsMbGnlKF7Dvi",
        "folderPath": "Manon/Sorcery/Auralurgy",
        "path": "Manon/Sorcery/Auralurgy/Chant of Dire Malady",
        "sort": 0
      },
      {
        "documentId": "zv2KSMaHLwY4ZncN",
        "uuid": "Item.zv2KSMaHLwY4ZncN",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Forbidden Glamour of Accord",
        "folderId": "v0lGsMbGnlKF7Dvi",
        "folderPath": "Manon/Sorcery/Auralurgy",
        "path": "Manon/Sorcery/Auralurgy/Forbidden Glamour of Accord",
        "sort": 0
      },
      {
        "documentId": "50m5hoClUIYxbKkl",
        "uuid": "Item.50m5hoClUIYxbKkl",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Rune of the Unspeakable Alarm",
        "folderId": "v0lGsMbGnlKF7Dvi",
        "folderPath": "Manon/Sorcery/Auralurgy",
        "path": "Manon/Sorcery/Auralurgy/Rune of the Unspeakable Alarm",
        "sort": 0
      },
      {
        "documentId": "GCm0ZGlyLdCKeZZ1",
        "uuid": "Item.GCm0ZGlyLdCKeZZ1",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Rune of Vicious Rage and Sorrow",
        "folderId": "v0lGsMbGnlKF7Dvi",
        "folderPath": "Manon/Sorcery/Auralurgy",
        "path": "Manon/Sorcery/Auralurgy/Rune of Vicious Rage and Sorrow",
        "sort": 0
      },
      {
        "documentId": "AYdqDQdbW2xk12R2",
        "uuid": "Item.AYdqDQdbW2xk12R2",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "The Ancestral Working of the Savage Peal",
        "folderId": "v0lGsMbGnlKF7Dvi",
        "folderPath": "Manon/Sorcery/Auralurgy",
        "path": "Manon/Sorcery/Auralurgy/The Ancestral Working of the Savage Peal",
        "sort": 0
      },
      {
        "documentId": "VVG0Ued9MRUNISkr",
        "uuid": "Item.VVG0Ued9MRUNISkr",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "The Blessed Chime of Glorious Release",
        "folderId": "v0lGsMbGnlKF7Dvi",
        "folderPath": "Manon/Sorcery/Auralurgy",
        "path": "Manon/Sorcery/Auralurgy/The Blessed Chime of Glorious Release",
        "sort": 0
      },
      {
        "documentId": "B0D2Rb9oVfc0wmfz",
        "uuid": "Item.B0D2Rb9oVfc0wmfz",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "The Charm of Raucous Cacophony",
        "folderId": "v0lGsMbGnlKF7Dvi",
        "folderPath": "Manon/Sorcery/Auralurgy",
        "path": "Manon/Sorcery/Auralurgy/The Charm of Raucous Cacophony",
        "sort": 0
      },
      {
        "documentId": "cqyctWPyXciS2MCX",
        "uuid": "Item.cqyctWPyXciS2MCX",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "The Confounding Rhythms of Dire Doom",
        "folderId": "v0lGsMbGnlKF7Dvi",
        "folderPath": "Manon/Sorcery/Auralurgy",
        "path": "Manon/Sorcery/Auralurgy/The Confounding Rhythms of Dire Doom",
        "sort": 0
      },
      {
        "documentId": "ArZu3vnqew24kDCZ",
        "uuid": "Item.ArZu3vnqew24kDCZ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "The Horrid Call of Za'lota",
        "folderId": "v0lGsMbGnlKF7Dvi",
        "folderPath": "Manon/Sorcery/Auralurgy",
        "path": "Manon/Sorcery/Auralurgy/The Horrid Call of Za'lota",
        "sort": 0
      },
      {
        "documentId": "47cvrcCNzQgFv0zJ",
        "uuid": "Item.47cvrcCNzQgFv0zJ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "The Infinite Illusion of Spiritual Separation",
        "folderId": "v0lGsMbGnlKF7Dvi",
        "folderPath": "Manon/Sorcery/Auralurgy",
        "path": "Manon/Sorcery/Auralurgy/The Infinite Illusion of Spiritual Separation",
        "sort": 0
      },
      {
        "documentId": "KLtQFOnEufzeequ6",
        "uuid": "Item.KLtQFOnEufzeequ6",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "The Seven Chimes of Forceful Approbation",
        "folderId": "v0lGsMbGnlKF7Dvi",
        "folderPath": "Manon/Sorcery/Auralurgy",
        "path": "Manon/Sorcery/Auralurgy/The Seven Chimes of Forceful Approbation",
        "sort": 0
      },
      {
        "documentId": "F7nnEgp2BFrAZoM6",
        "uuid": "Item.F7nnEgp2BFrAZoM6",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Create Barrier",
        "folderId": "m0jRApcb3Al3Dh3t",
        "folderPath": "Manon/Sorcery/Incantor",
        "path": "Manon/Sorcery/Incantor/Create Barrier",
        "sort": 0
      },
      {
        "documentId": "z4j0meQXdN4UbjCf",
        "uuid": "Item.z4j0meQXdN4UbjCf",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Disguise Astral Aura",
        "folderId": "m0jRApcb3Al3Dh3t",
        "folderPath": "Manon/Sorcery/Incantor",
        "path": "Manon/Sorcery/Incantor/Disguise Astral Aura",
        "sort": 0
      },
      {
        "documentId": "peYTrrhtyPX936nQ",
        "uuid": "Item.peYTrrhtyPX936nQ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Flight",
        "folderId": "m0jRApcb3Al3Dh3t",
        "folderPath": "Manon/Sorcery/Incantor",
        "path": "Manon/Sorcery/Incantor/Flight",
        "sort": 0
      },
      {
        "documentId": "z03u4RkWUT6reu5I",
        "uuid": "Item.z03u4RkWUT6reu5I",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Haste",
        "folderId": "m0jRApcb3Al3Dh3t",
        "folderPath": "Manon/Sorcery/Incantor",
        "path": "Manon/Sorcery/Incantor/Haste",
        "sort": 0
      },
      {
        "documentId": "1BguZDRzlB2HOsFJ",
        "uuid": "Item.1BguZDRzlB2HOsFJ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Light",
        "folderId": "m0jRApcb3Al3Dh3t",
        "folderPath": "Manon/Sorcery/Incantor",
        "path": "Manon/Sorcery/Incantor/Light",
        "sort": 0
      },
      {
        "documentId": "PLhpz890RUQlN9sE",
        "uuid": "Item.PLhpz890RUQlN9sE",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Manon Ball",
        "folderId": "m0jRApcb3Al3Dh3t",
        "folderPath": "Manon/Sorcery/Incantor",
        "path": "Manon/Sorcery/Incantor/Manon Ball",
        "sort": 0
      },
      {
        "documentId": "rfBenAJCXNSu17pw",
        "uuid": "Item.rfBenAJCXNSu17pw",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Manon Bolt",
        "folderId": "m0jRApcb3Al3Dh3t",
        "folderPath": "Manon/Sorcery/Incantor",
        "path": "Manon/Sorcery/Incantor/Manon Bolt",
        "sort": 0
      },
      {
        "documentId": "kbJJyKSyb1SbSOn0",
        "uuid": "Item.kbJJyKSyb1SbSOn0",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Mind Link",
        "folderId": "m0jRApcb3Al3Dh3t",
        "folderPath": "Manon/Sorcery/Incantor",
        "path": "Manon/Sorcery/Incantor/Mind Link",
        "sort": 0
      },
      {
        "documentId": "9g8k9hws9BxlMQfy",
        "uuid": "Item.9g8k9hws9BxlMQfy",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Power Bolt",
        "folderId": "m0jRApcb3Al3Dh3t",
        "folderPath": "Manon/Sorcery/Incantor",
        "path": "Manon/Sorcery/Incantor/Power Bolt",
        "sort": 0
      },
      {
        "documentId": "obioXfChLEoIVQXV",
        "uuid": "Item.obioXfChLEoIVQXV",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Powerball",
        "folderId": "m0jRApcb3Al3Dh3t",
        "folderPath": "Manon/Sorcery/Incantor",
        "path": "Manon/Sorcery/Incantor/Powerball",
        "sort": 0
      },
      {
        "documentId": "5PvxPeY9H49oYW14",
        "uuid": "Item.5PvxPeY9H49oYW14",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Shatter Ward",
        "folderId": "m0jRApcb3Al3Dh3t",
        "folderPath": "Manon/Sorcery/Incantor",
        "path": "Manon/Sorcery/Incantor/Shatter Ward",
        "sort": 0
      },
      {
        "documentId": "odnghuR7oBmKEWJa",
        "uuid": "Item.odnghuR7oBmKEWJa",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Calm",
        "folderId": "xuhgaKb2rgkuMPKA",
        "folderPath": "Manon/Sorcery/Mentalism",
        "path": "Manon/Sorcery/Mentalism/Calm",
        "sort": 0
      },
      {
        "documentId": "d0Wgmxh6GljCq4XU",
        "uuid": "Item.d0Wgmxh6GljCq4XU",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Charm",
        "folderId": "xuhgaKb2rgkuMPKA",
        "folderPath": "Manon/Sorcery/Mentalism",
        "path": "Manon/Sorcery/Mentalism/Charm",
        "sort": 0
      },
      {
        "documentId": "RAPZeJUn661k06e9",
        "uuid": "Item.RAPZeJUn661k06e9",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Command",
        "folderId": "xuhgaKb2rgkuMPKA",
        "folderPath": "Manon/Sorcery/Mentalism",
        "path": "Manon/Sorcery/Mentalism/Command",
        "sort": 0
      },
      {
        "documentId": "7nqFvtjO5Pf1m3Gd",
        "uuid": "Item.7nqFvtjO5Pf1m3Gd",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Confusion",
        "folderId": "xuhgaKb2rgkuMPKA",
        "folderPath": "Manon/Sorcery/Mentalism",
        "path": "Manon/Sorcery/Mentalism/Confusion",
        "sort": 0
      },
      {
        "documentId": "wxb9bpvoT2BdRvrq",
        "uuid": "Item.wxb9bpvoT2BdRvrq",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Despair",
        "folderId": "xuhgaKb2rgkuMPKA",
        "folderPath": "Manon/Sorcery/Mentalism",
        "path": "Manon/Sorcery/Mentalism/Despair",
        "sort": 0
      },
      {
        "documentId": "UJjEzGPHGOJeqErU",
        "uuid": "Item.UJjEzGPHGOJeqErU",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Ensorcell",
        "folderId": "xuhgaKb2rgkuMPKA",
        "folderPath": "Manon/Sorcery/Mentalism",
        "path": "Manon/Sorcery/Mentalism/Ensorcell",
        "sort": 0
      },
      {
        "documentId": "lEeAuuYtXSf2Jn37",
        "uuid": "Item.lEeAuuYtXSf2Jn37",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Enthrall",
        "folderId": "xuhgaKb2rgkuMPKA",
        "folderPath": "Manon/Sorcery/Mentalism",
        "path": "Manon/Sorcery/Mentalism/Enthrall",
        "sort": 0
      },
      {
        "documentId": "eco8hS4iYlOx00lF",
        "uuid": "Item.eco8hS4iYlOx00lF",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Forget",
        "folderId": "xuhgaKb2rgkuMPKA",
        "folderPath": "Manon/Sorcery/Mentalism",
        "path": "Manon/Sorcery/Mentalism/Forget",
        "sort": 0
      },
      {
        "documentId": "9dUEsX7OZDbNiXRF",
        "uuid": "Item.9dUEsX7OZDbNiXRF",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Fumble",
        "folderId": "xuhgaKb2rgkuMPKA",
        "folderPath": "Manon/Sorcery/Mentalism",
        "path": "Manon/Sorcery/Mentalism/Fumble",
        "sort": 0
      },
      {
        "documentId": "udIyuyFgrSpIZlx2",
        "uuid": "Item.udIyuyFgrSpIZlx2",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Geas",
        "folderId": "xuhgaKb2rgkuMPKA",
        "folderPath": "Manon/Sorcery/Mentalism",
        "path": "Manon/Sorcery/Mentalism/Geas",
        "sort": 0
      },
      {
        "documentId": "NDFOBjYGbBQrQlEX",
        "uuid": "Item.NDFOBjYGbBQrQlEX",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Hold",
        "folderId": "xuhgaKb2rgkuMPKA",
        "folderPath": "Manon/Sorcery/Mentalism",
        "path": "Manon/Sorcery/Mentalism/Hold",
        "sort": 0
      },
      {
        "documentId": "JbZ0mgTnnmqgOEXQ",
        "uuid": "Item.JbZ0mgTnnmqgOEXQ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Insight",
        "folderId": "xuhgaKb2rgkuMPKA",
        "folderPath": "Manon/Sorcery/Mentalism",
        "path": "Manon/Sorcery/Mentalism/Insight",
        "sort": 0
      },
      {
        "documentId": "o88LZmyWafqXeU37",
        "uuid": "Item.o88LZmyWafqXeU37",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Laughter",
        "folderId": "xuhgaKb2rgkuMPKA",
        "folderPath": "Manon/Sorcery/Mentalism",
        "path": "Manon/Sorcery/Mentalism/Laughter",
        "sort": 0
      },
      {
        "documentId": "phYaJHE7fxQa9g2h",
        "uuid": "Item.phYaJHE7fxQa9g2h",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Suggestion",
        "folderId": "xuhgaKb2rgkuMPKA",
        "folderPath": "Manon/Sorcery/Mentalism",
        "path": "Manon/Sorcery/Mentalism/Suggestion",
        "sort": 0
      },
      {
        "documentId": "izJCGVgmpCWuPgsJ",
        "uuid": "Item.izJCGVgmpCWuPgsJ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Taunt",
        "folderId": "xuhgaKb2rgkuMPKA",
        "folderPath": "Manon/Sorcery/Mentalism",
        "path": "Manon/Sorcery/Mentalism/Taunt",
        "sort": 0
      },
      {
        "documentId": "ivbEv26WTcjIN88i",
        "uuid": "Item.ivbEv26WTcjIN88i",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Blight",
        "folderId": "Fi8plai5LkNJGnNE",
        "folderPath": "Manon/Sorcery/The Bound",
        "path": "Manon/Sorcery/The Bound/Blight",
        "sort": 0
      },
      {
        "documentId": "jogoGLJrueqF2lbl",
        "uuid": "Item.jogoGLJrueqF2lbl",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Bound Servant",
        "folderId": "Fi8plai5LkNJGnNE",
        "folderPath": "Manon/Sorcery/The Bound",
        "path": "Manon/Sorcery/The Bound/Bound Servant",
        "sort": 0
      },
      {
        "documentId": "oIIOVJ8IdLpV1FTr",
        "uuid": "Item.oIIOVJ8IdLpV1FTr",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Fiery Lash",
        "folderId": "Fi8plai5LkNJGnNE",
        "folderPath": "Manon/Sorcery/The Bound",
        "path": "Manon/Sorcery/The Bound/Fiery Lash",
        "sort": 0
      },
      {
        "documentId": "jXFqAXjCahwFNZBu",
        "uuid": "Item.jXFqAXjCahwFNZBu",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Fires of the Earth",
        "folderId": "Fi8plai5LkNJGnNE",
        "folderPath": "Manon/Sorcery/The Bound",
        "path": "Manon/Sorcery/The Bound/Fires of the Earth",
        "sort": 0
      },
      {
        "documentId": "YGvvpLokF7dHnu8w",
        "uuid": "Item.YGvvpLokF7dHnu8w",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Firestorm",
        "folderId": "Fi8plai5LkNJGnNE",
        "folderPath": "Manon/Sorcery/The Bound",
        "path": "Manon/Sorcery/The Bound/Firestorm",
        "sort": 0
      },
      {
        "documentId": "YQnYwSjfBK2crsmh",
        "uuid": "Item.YQnYwSjfBK2crsmh",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Grasp of Spring",
        "folderId": "Fi8plai5LkNJGnNE",
        "folderPath": "Manon/Sorcery/The Bound",
        "path": "Manon/Sorcery/The Bound/Grasp of Spring",
        "sort": 0
      },
      {
        "documentId": "B0g2y4CAVtIohOpM",
        "uuid": "Item.B0g2y4CAVtIohOpM",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Healing",
        "folderId": "Fi8plai5LkNJGnNE",
        "folderPath": "Manon/Sorcery/The Bound",
        "path": "Manon/Sorcery/The Bound/Healing",
        "sort": 0
      },
      {
        "documentId": "UqxfotlqKznC1GJh",
        "uuid": "Item.UqxfotlqKznC1GJh",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Lightning Strike",
        "folderId": "Fi8plai5LkNJGnNE",
        "folderPath": "Manon/Sorcery/The Bound",
        "path": "Manon/Sorcery/The Bound/Lightning Strike",
        "sort": 0
      },
      {
        "documentId": "fUzFacKdgJTfkbrW",
        "uuid": "Item.fUzFacKdgJTfkbrW",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Massage the Bones of the Earth",
        "folderId": "Fi8plai5LkNJGnNE",
        "folderPath": "Manon/Sorcery/The Bound",
        "path": "Manon/Sorcery/The Bound/Massage the Bones of the Earth",
        "sort": 0
      },
      {
        "documentId": "HYkym6OvMFX7OTE0",
        "uuid": "Item.HYkym6OvMFX7OTE0",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Natural Fury",
        "folderId": "Fi8plai5LkNJGnNE",
        "folderPath": "Manon/Sorcery/The Bound",
        "path": "Manon/Sorcery/The Bound/Natural Fury",
        "sort": 0
      },
      {
        "documentId": "9CehX0nF2LRIAH9A",
        "uuid": "Item.9CehX0nF2LRIAH9A",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Shapeshift",
        "folderId": "Fi8plai5LkNJGnNE",
        "folderPath": "Manon/Sorcery/The Bound",
        "path": "Manon/Sorcery/The Bound/Shapeshift",
        "sort": 0
      },
      {
        "documentId": "quYSnPS1X9CvpznC",
        "uuid": "Item.quYSnPS1X9CvpznC",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Summon Elemental",
        "folderId": "Fi8plai5LkNJGnNE",
        "folderPath": "Manon/Sorcery/The Bound",
        "path": "Manon/Sorcery/The Bound/Summon Elemental",
        "sort": 0
      },
      {
        "documentId": "XeDvGfyyLWIV3W6d",
        "uuid": "Item.XeDvGfyyLWIV3W6d",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Drive Test",
        "folderId": "wpNVoTaalbsoL0Lv",
        "folderPath": "Rigging/Drive / Fly Skills",
        "path": "Rigging/Drive / Fly Skills/Drive Test",
        "sort": 0
      },
      {
        "documentId": "9r3BqvpSWhMDaOea",
        "uuid": "Item.9r3BqvpSWhMDaOea",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Fly Test",
        "folderId": "wpNVoTaalbsoL0Lv",
        "folderPath": "Rigging/Drive / Fly Skills",
        "path": "Rigging/Drive / Fly Skills/Fly Test",
        "sort": 0
      },
      {
        "documentId": "D2MVrqrWzJz1gzHi",
        "uuid": "Item.D2MVrqrWzJz1gzHi",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "OverDrive",
        "folderId": "wpNVoTaalbsoL0Lv",
        "folderPath": "Rigging/Drive / Fly Skills",
        "path": "Rigging/Drive / Fly Skills/OverDrive",
        "sort": 0
      },
      {
        "documentId": "osyORzOHrscc27l5",
        "uuid": "Item.osyORzOHrscc27l5",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "OverFly",
        "folderId": "wpNVoTaalbsoL0Lv",
        "folderPath": "Rigging/Drive / Fly Skills",
        "path": "Rigging/Drive / Fly Skills/OverFly",
        "sort": 0
      },
      {
        "documentId": "pgnn8Bj8C1NwNani",
        "uuid": "Item.pgnn8Bj8C1NwNani",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Autocannon",
        "folderId": "Ts6jM2x9mZugV8R4",
        "folderPath": "Rigging/Drone Weapons",
        "path": "Rigging/Drone Weapons/Autocannon",
        "sort": 0
      },
      {
        "documentId": "cUyOhkMFHDKJaoTv",
        "uuid": "Item.cUyOhkMFHDKJaoTv",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Dazzleray",
        "folderId": "Ts6jM2x9mZugV8R4",
        "folderPath": "Rigging/Drone Weapons",
        "path": "Rigging/Drone Weapons/Dazzleray",
        "sort": 0
      },
      {
        "documentId": "qqR35Es8BrDxGtdN",
        "uuid": "Item.qqR35Es8BrDxGtdN",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Grenade Launcher",
        "folderId": "Ts6jM2x9mZugV8R4",
        "folderPath": "Rigging/Drone Weapons",
        "path": "Rigging/Drone Weapons/Grenade Launcher",
        "sort": 0
      },
      {
        "documentId": "VlKxbR4O9PAjKPlt",
        "uuid": "Item.VlKxbR4O9PAjKPlt",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Heavy Swell",
        "folderId": "Ts6jM2x9mZugV8R4",
        "folderPath": "Rigging/Drone Weapons",
        "path": "Rigging/Drone Weapons/Heavy Swell",
        "sort": 0
      },
      {
        "documentId": "UjON0AYL52oPkkV1",
        "uuid": "Item.UjON0AYL52oPkkV1",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Mini gun",
        "folderId": "Ts6jM2x9mZugV8R4",
        "folderPath": "Rigging/Drone Weapons",
        "path": "Rigging/Drone Weapons/Mini gun",
        "sort": 0
      },
      {
        "documentId": "w5YJ9JQJ7RZoEYoR",
        "uuid": "Item.w5YJ9JQJ7RZoEYoR",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Missile Launcher",
        "folderId": "Ts6jM2x9mZugV8R4",
        "folderPath": "Rigging/Drone Weapons",
        "path": "Rigging/Drone Weapons/Missile Launcher",
        "sort": 0
      },
      {
        "documentId": "eNdj5MZgMVFb6RuU",
        "uuid": "Item.eNdj5MZgMVFb6RuU",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Oil Slick",
        "folderId": "Ts6jM2x9mZugV8R4",
        "folderPath": "Rigging/Drone Weapons",
        "path": "Rigging/Drone Weapons/Oil Slick",
        "sort": 0
      },
      {
        "documentId": "PpC6UAT4zduBN1JO",
        "uuid": "Item.PpC6UAT4zduBN1JO",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Particle Projectile Cannon",
        "folderId": "Ts6jM2x9mZugV8R4",
        "folderPath": "Rigging/Drone Weapons",
        "path": "Rigging/Drone Weapons/Particle Projectile Cannon",
        "sort": 0
      },
      {
        "documentId": "vTQqSWLjjgrjOWNo",
        "uuid": "Item.vTQqSWLjjgrjOWNo",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Pulse Minigun",
        "folderId": "Ts6jM2x9mZugV8R4",
        "folderPath": "Rigging/Drone Weapons",
        "path": "Rigging/Drone Weapons/Pulse Minigun",
        "sort": 0
      },
      {
        "documentId": "ym0IkelGLpxsvuI9",
        "uuid": "Item.ym0IkelGLpxsvuI9",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Pulse Rifle",
        "folderId": "Ts6jM2x9mZugV8R4",
        "folderPath": "Rigging/Drone Weapons",
        "path": "Rigging/Drone Weapons/Pulse Rifle",
        "sort": 0
      },
      {
        "documentId": "qsCaLt48mRGOee5a",
        "uuid": "Item.qsCaLt48mRGOee5a",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Railgun",
        "folderId": "Ts6jM2x9mZugV8R4",
        "folderPath": "Rigging/Drone Weapons",
        "path": "Rigging/Drone Weapons/Railgun",
        "sort": 0
      },
      {
        "documentId": "dwlzDpgJn2neQNoH",
        "uuid": "Item.dwlzDpgJn2neQNoH",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Recoilless Gun",
        "folderId": "Ts6jM2x9mZugV8R4",
        "folderPath": "Rigging/Drone Weapons",
        "path": "Rigging/Drone Weapons/Recoilless Gun",
        "sort": 0
      },
      {
        "documentId": "TsowecCMZQ6f430o",
        "uuid": "Item.TsowecCMZQ6f430o",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Recoilless Rifle",
        "folderId": "Ts6jM2x9mZugV8R4",
        "folderPath": "Rigging/Drone Weapons",
        "path": "Rigging/Drone Weapons/Recoilless Rifle",
        "sort": 0
      },
      {
        "documentId": "X1212y9y0s2goiHv",
        "uuid": "Item.X1212y9y0s2goiHv",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Sentry Gun",
        "folderId": "Ts6jM2x9mZugV8R4",
        "folderPath": "Rigging/Drone Weapons",
        "path": "Rigging/Drone Weapons/Sentry Gun",
        "sort": 0
      },
      {
        "documentId": "6uAvCA8vSKXWrCoO",
        "uuid": "Item.6uAvCA8vSKXWrCoO",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Smokescreen",
        "folderId": "Ts6jM2x9mZugV8R4",
        "folderPath": "Rigging/Drone Weapons",
        "path": "Rigging/Drone Weapons/Smokescreen",
        "sort": 0
      },
      {
        "documentId": "RN9PjdKiUr8W2tiL",
        "uuid": "Item.RN9PjdKiUr8W2tiL",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Sonic Disruption",
        "folderId": "Ts6jM2x9mZugV8R4",
        "folderPath": "Rigging/Drone Weapons",
        "path": "Rigging/Drone Weapons/Sonic Disruption",
        "sort": 0
      },
      {
        "documentId": "j2TO3k0UCvhq0zMp",
        "uuid": "Item.j2TO3k0UCvhq0zMp",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Aerial Warden",
        "folderId": "DswGzl1e1TynhREL",
        "folderPath": "Rigging/Drones",
        "path": "Rigging/Drones/Aerial Warden",
        "sort": 0
      },
      {
        "documentId": "Cmiv9ISEWVXlfIep",
        "uuid": "Item.Cmiv9ISEWVXlfIep",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Anthrobrute",
        "folderId": "DswGzl1e1TynhREL",
        "folderPath": "Rigging/Drones",
        "path": "Rigging/Drones/Anthrobrute",
        "sort": 0
      },
      {
        "documentId": "O1BeA1bQVwldwFjM",
        "uuid": "Item.O1BeA1bQVwldwFjM",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Anthrodroid",
        "folderId": "DswGzl1e1TynhREL",
        "folderPath": "Rigging/Drones",
        "path": "Rigging/Drones/Anthrodroid",
        "sort": 0
      },
      {
        "documentId": "sHUxTiNfIMWKLLpU",
        "uuid": "Item.sHUxTiNfIMWKLLpU",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Bug-Spy",
        "folderId": "DswGzl1e1TynhREL",
        "folderPath": "Rigging/Drones",
        "path": "Rigging/Drones/Bug-Spy",
        "sort": 0
      },
      {
        "documentId": "88t9RA3Lr03dK5FA",
        "uuid": "Item.88t9RA3Lr03dK5FA",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Disc",
        "folderId": "DswGzl1e1TynhREL",
        "folderPath": "Rigging/Drones",
        "path": "Rigging/Drones/Disc",
        "sort": 0
      },
      {
        "documentId": "NTIuILjbu1ZRXzdO",
        "uuid": "Item.NTIuILjbu1ZRXzdO",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Dog-Patrol Drone",
        "folderId": "DswGzl1e1TynhREL",
        "folderPath": "Rigging/Drones",
        "path": "Rigging/Drones/Dog-Patrol Drone",
        "sort": 0
      },
      {
        "documentId": "7UnpG6sa1ERc4quJ",
        "uuid": "Item.7UnpG6sa1ERc4quJ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Gladiator",
        "folderId": "DswGzl1e1TynhREL",
        "folderPath": "Rigging/Drones",
        "path": "Rigging/Drones/Gladiator",
        "sort": 0
      },
      {
        "documentId": "juM3IWGwmAWwNsNU",
        "uuid": "Item.juM3IWGwmAWwNsNU",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Hawk",
        "folderId": "DswGzl1e1TynhREL",
        "folderPath": "Rigging/Drones",
        "path": "Rigging/Drones/Hawk",
        "sort": 0
      },
      {
        "documentId": "O7LxMs1Xzm3zR6cd",
        "uuid": "Item.O7LxMs1Xzm3zR6cd",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Mobile Sentinel",
        "folderId": "DswGzl1e1TynhREL",
        "folderPath": "Rigging/Drones",
        "path": "Rigging/Drones/Mobile Sentinel",
        "sort": 0
      },
      {
        "documentId": "IWWXsOuVPxSJzFTd",
        "uuid": "Item.IWWXsOuVPxSJzFTd",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Orb",
        "folderId": "DswGzl1e1TynhREL",
        "folderPath": "Rigging/Drones",
        "path": "Rigging/Drones/Orb",
        "sort": 0
      },
      {
        "documentId": "noRkOeDYXhGrqcw6",
        "uuid": "Item.noRkOeDYXhGrqcw6",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Roto-Drone",
        "folderId": "DswGzl1e1TynhREL",
        "folderPath": "Rigging/Drones",
        "path": "Rigging/Drones/Roto-Drone",
        "sort": 0
      },
      {
        "documentId": "N0nGXBPq2IZtEQhK",
        "uuid": "Item.N0nGXBPq2IZtEQhK",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Shield Drone",
        "folderId": "DswGzl1e1TynhREL",
        "folderPath": "Rigging/Drones",
        "path": "Rigging/Drones/Shield Drone",
        "sort": 0
      },
      {
        "documentId": "4yjS4jBEs3quNMix",
        "uuid": "Item.4yjS4jBEs3quNMix",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Shield-Wall Drone",
        "folderId": "DswGzl1e1TynhREL",
        "folderPath": "Rigging/Drones",
        "path": "Rigging/Drones/Shield-Wall Drone",
        "sort": 0
      },
      {
        "documentId": "M7So1h7MRAT1YZg6",
        "uuid": "Item.M7So1h7MRAT1YZg6",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "VSTOL Bird",
        "folderId": "DswGzl1e1TynhREL",
        "folderPath": "Rigging/Drones",
        "path": "Rigging/Drones/VSTOL Bird",
        "sort": 0
      },
      {
        "documentId": "CEbtVznH20MTfOMq",
        "uuid": "Item.CEbtVznH20MTfOMq",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Advanced VCR",
        "folderId": "d3QnO994LfRud9yy",
        "folderPath": "Rigging/VCR",
        "path": "Rigging/VCR/Advanced VCR",
        "sort": 100000
      },
      {
        "documentId": "LscCW4itUp2kDBcW",
        "uuid": "Item.LscCW4itUp2kDBcW",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Basic VCR",
        "folderId": "d3QnO994LfRud9yy",
        "folderPath": "Rigging/VCR",
        "path": "Rigging/VCR/Basic VCR",
        "sort": 0
      },
      {
        "documentId": "9KGkTsyVjFvsGlQB",
        "uuid": "Item.9KGkTsyVjFvsGlQB",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Master VCR",
        "folderId": "d3QnO994LfRud9yy",
        "folderPath": "Rigging/VCR",
        "path": "Rigging/VCR/Master VCR",
        "sort": 200000
      },
      {
        "documentId": "AOzKYI8tzM42kLgc",
        "uuid": "Item.AOzKYI8tzM42kLgc",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "25mm Cannon",
        "folderId": "17SxKReYD26TEIrd",
        "folderPath": "Rigging/Vehicle Weapons",
        "path": "Rigging/Vehicle Weapons/25mm Cannon",
        "sort": 0
      },
      {
        "documentId": "bbz11AaRqOPO81U0",
        "uuid": "Item.bbz11AaRqOPO81U0",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "30mm Cannon",
        "folderId": "17SxKReYD26TEIrd",
        "folderPath": "Rigging/Vehicle Weapons",
        "path": "Rigging/Vehicle Weapons/30mm Cannon",
        "sort": 0
      },
      {
        "documentId": "ykFPEIiHMrOI37CP",
        "uuid": "Item.ykFPEIiHMrOI37CP",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Autocannons",
        "folderId": "17SxKReYD26TEIrd",
        "folderPath": "Rigging/Vehicle Weapons",
        "path": "Rigging/Vehicle Weapons/Autocannons",
        "sort": 0
      },
      {
        "documentId": "xP2eZsJJHNzoVAPS",
        "uuid": "Item.xP2eZsJJHNzoVAPS",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Machine Guns",
        "folderId": "17SxKReYD26TEIrd",
        "folderPath": "Rigging/Vehicle Weapons",
        "path": "Rigging/Vehicle Weapons/Machine Guns",
        "sort": 0
      },
      {
        "documentId": "2ePOa0yQDvIUycaz",
        "uuid": "Item.2ePOa0yQDvIUycaz",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Missile Launcher",
        "folderId": "17SxKReYD26TEIrd",
        "folderPath": "Rigging/Vehicle Weapons",
        "path": "Rigging/Vehicle Weapons/Missile Launcher",
        "sort": 0
      },
      {
        "documentId": "GumvtgZjJAiTLSvS",
        "uuid": "Item.GumvtgZjJAiTLSvS",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Oil Slick",
        "folderId": "17SxKReYD26TEIrd",
        "folderPath": "Rigging/Vehicle Weapons",
        "path": "Rigging/Vehicle Weapons/Oil Slick",
        "sort": 0
      },
      {
        "documentId": "9TZCWyKWwDZPmGzQ",
        "uuid": "Item.9TZCWyKWwDZPmGzQ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Particle Projection Cannon",
        "folderId": "17SxKReYD26TEIrd",
        "folderPath": "Rigging/Vehicle Weapons",
        "path": "Rigging/Vehicle Weapons/Particle Projection Cannon",
        "sort": 0
      },
      {
        "documentId": "7QVxicRmXZLS4HNk",
        "uuid": "Item.7QVxicRmXZLS4HNk",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Plasma Cannons",
        "folderId": "17SxKReYD26TEIrd",
        "folderPath": "Rigging/Vehicle Weapons",
        "path": "Rigging/Vehicle Weapons/Plasma Cannons",
        "sort": 0
      },
      {
        "documentId": "pP9E1ZOT9RBk5xwe",
        "uuid": "Item.pP9E1ZOT9RBk5xwe",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Pulse Cannon",
        "folderId": "17SxKReYD26TEIrd",
        "folderPath": "Rigging/Vehicle Weapons",
        "path": "Rigging/Vehicle Weapons/Pulse Cannon",
        "sort": 0
      },
      {
        "documentId": "0ypLeyA8IH9bQUzZ",
        "uuid": "Item.0ypLeyA8IH9bQUzZ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Railgun",
        "folderId": "17SxKReYD26TEIrd",
        "folderPath": "Rigging/Vehicle Weapons",
        "path": "Rigging/Vehicle Weapons/Railgun",
        "sort": 0
      },
      {
        "documentId": "lulF2OYD9eevBZ8v",
        "uuid": "Item.lulF2OYD9eevBZ8v",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Rocket Propelled Grenade Launcher",
        "folderId": "17SxKReYD26TEIrd",
        "folderPath": "Rigging/Vehicle Weapons",
        "path": "Rigging/Vehicle Weapons/Rocket Propelled Grenade Launcher",
        "sort": 0
      },
      {
        "documentId": "ZwGjyDbtc10lzfqt",
        "uuid": "Item.ZwGjyDbtc10lzfqt",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Tactical Tsunami",
        "folderId": "17SxKReYD26TEIrd",
        "folderPath": "Rigging/Vehicle Weapons",
        "path": "Rigging/Vehicle Weapons/Tactical Tsunami",
        "sort": 0
      },
      {
        "documentId": "Sw5LolCVrO7vGX75",
        "uuid": "Item.Sw5LolCVrO7vGX75",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Tank Cannon",
        "folderId": "17SxKReYD26TEIrd",
        "folderPath": "Rigging/Vehicle Weapons",
        "path": "Rigging/Vehicle Weapons/Tank Cannon",
        "sort": 0
      },
      {
        "documentId": "zU4IZrnZmb7Mmxc3",
        "uuid": "Item.zU4IZrnZmb7Mmxc3",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Vulcan Cannon",
        "folderId": "17SxKReYD26TEIrd",
        "folderPath": "Rigging/Vehicle Weapons",
        "path": "Rigging/Vehicle Weapons/Vulcan Cannon",
        "sort": 0
      },
      {
        "documentId": "iF76z6HNwoe7KFDM",
        "uuid": "Item.iF76z6HNwoe7KFDM",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Armored Car",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Armored Car",
        "sort": 0
      },
      {
        "documentId": "Lbykgev8L1eM42l2",
        "uuid": "Item.Lbykgev8L1eM42l2",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Battle Cycle",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Battle Cycle",
        "sort": 0
      },
      {
        "documentId": "pVrVqEfRZYveTYqx",
        "uuid": "Item.pVrVqEfRZYveTYqx",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Cargo Heli",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Cargo Heli",
        "sort": 0
      },
      {
        "documentId": "CnzRIbXniQf9JF3q",
        "uuid": "Item.CnzRIbXniQf9JF3q",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Chopper",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Chopper",
        "sort": 0
      },
      {
        "documentId": "CbUwPb2OlX1tVQO8",
        "uuid": "Item.CbUwPb2OlX1tVQO8",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Delivery Van",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Delivery Van",
        "sort": 0
      },
      {
        "documentId": "IcoAJ9g1kdBLfNgP",
        "uuid": "Item.IcoAJ9g1kdBLfNgP",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Family Sedan",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Family Sedan",
        "sort": 0
      },
      {
        "documentId": "SKhFtaxNq8qNDBBg",
        "uuid": "Item.SKhFtaxNq8qNDBBg",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Limo",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Limo",
        "sort": 0
      },
      {
        "documentId": "szksglBlzFRLHTcL",
        "uuid": "Item.szksglBlzFRLHTcL",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Luxury Sedan",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Luxury Sedan",
        "sort": 0
      },
      {
        "documentId": "YjAu5xvT1EctHL3f",
        "uuid": "Item.YjAu5xvT1EctHL3f",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Luxury Van",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Luxury Van",
        "sort": 0
      },
      {
        "documentId": "c2M82No6wNHg2rjr",
        "uuid": "Item.c2M82No6wNHg2rjr",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Motorcycle",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Motorcycle",
        "sort": 0
      },
      {
        "documentId": "Ia1ZF9O89cNtK8v9",
        "uuid": "Item.Ia1ZF9O89cNtK8v9",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Nightwing",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Nightwing",
        "sort": 0
      },
      {
        "documentId": "SqYhlebJcOUP0JOG",
        "uuid": "Item.SqYhlebJcOUP0JOG",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Patrol Boat",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Patrol Boat",
        "sort": 0
      },
      {
        "documentId": "UqPgsRmU7wP6CJFr",
        "uuid": "Item.UqPgsRmU7wP6CJFr",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Pickup",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Pickup",
        "sort": 0
      },
      {
        "documentId": "Z1Yju9ro1qZ6tiKM",
        "uuid": "Item.Z1Yju9ro1qZ6tiKM",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Racing Bike",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Racing Bike",
        "sort": 0
      },
      {
        "documentId": "3wxbKv1qbF78RPiZ",
        "uuid": "Item.3wxbKv1qbF78RPiZ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Seaplane",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Seaplane",
        "sort": 0
      },
      {
        "documentId": "sB4bCmeH6O5UgRC6",
        "uuid": "Item.sB4bCmeH6O5UgRC6",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Seaplane",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Seaplane",
        "sort": 0
      },
      {
        "documentId": "6ne6fzg1iDEfs4Ml",
        "uuid": "Item.6ne6fzg1iDEfs4Ml",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Skate",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Skate",
        "sort": 0
      },
      {
        "documentId": "vNwPr9TXEX6ocKpd",
        "uuid": "Item.vNwPr9TXEX6ocKpd",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Small Boat",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Small Boat",
        "sort": 0
      },
      {
        "documentId": "truw72AdxFdTcjbK",
        "uuid": "Item.truw72AdxFdTcjbK",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Speedboat",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Speedboat",
        "sort": 0
      },
      {
        "documentId": "v5eSV1dG8L5hVWiM",
        "uuid": "Item.v5eSV1dG8L5hVWiM",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Sports Car",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Sports Car",
        "sort": 0
      },
      {
        "documentId": "vzsVDNUQTQPnqmAx",
        "uuid": "Item.vzsVDNUQTQPnqmAx",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Sports Sedan",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Sports Sedan",
        "sort": 0
      },
      {
        "documentId": "VTACzqAhjIWQaMEB",
        "uuid": "Item.VTACzqAhjIWQaMEB",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Transport Heli",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Transport Heli",
        "sort": 0
      },
      {
        "documentId": "0f6uWLCvtOmijcT8",
        "uuid": "Item.0f6uWLCvtOmijcT8",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Two-Seater",
        "folderId": "ic8w75E9GFrktS4x",
        "folderPath": "Rigging/Vehicles",
        "path": "Rigging/Vehicles/Two-Seater",
        "sort": 0
      },
      {
        "documentId": "DVSf33GWdiNKYoD5",
        "uuid": "Item.DVSf33GWdiNKYoD5",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Neon Fang",
        "folderId": "fFGfPC4Uqyeabnvo",
        "folderPath": "Weapons/Energy",
        "path": "Weapons/Energy/Neon Fang",
        "sort": 150000
      },
      {
        "documentId": "n5dCqzXOOBOTEgkH",
        "uuid": "Item.n5dCqzXOOBOTEgkH",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Photon Reaver Ei-7",
        "folderId": "fFGfPC4Uqyeabnvo",
        "folderPath": "Weapons/Energy",
        "path": "Weapons/Energy/Photon Reaver Ei-7",
        "sort": 200000
      },
      {
        "documentId": "5iMNTMh5UCx0ushc",
        "uuid": "Item.5iMNTMh5UCx0ushc",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Thunderbolt Vanguard",
        "folderId": "fFGfPC4Uqyeabnvo",
        "folderPath": "Weapons/Energy",
        "path": "Weapons/Energy/Thunderbolt Vanguard",
        "sort": 100000
      },
      {
        "documentId": "GFmWuFB6xJb7arB7",
        "uuid": "Item.GFmWuFB6xJb7arB7",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "450 Tek-Urban",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/450 Tek-Urban",
        "sort": 0
      },
      {
        "documentId": "iPJklFqcxXQnpixG",
        "uuid": "Item.iPJklFqcxXQnpixG",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Defender",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/Defender",
        "sort": 0
      },
      {
        "documentId": "YKwbzBeRrnfrS9Zz",
        "uuid": "Item.YKwbzBeRrnfrS9Zz",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "DV-662 Devotion",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/DV-662 Devotion",
        "sort": 0
      },
      {
        "documentId": "ffPDvZYRKOHN590W",
        "uuid": "Item.ffPDvZYRKOHN590W",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Hardliner",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/Hardliner",
        "sort": 0
      },
      {
        "documentId": "L9Hlqu934i6AKgv6",
        "uuid": "Item.L9Hlqu934i6AKgv6",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Highwayman",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/Highwayman",
        "sort": 0
      },
      {
        "documentId": "KHE8xKFdz5m1mlUP",
        "uuid": "Item.KHE8xKFdz5m1mlUP",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Ironbark SMT",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/Ironbark SMT",
        "sort": 0
      },
      {
        "documentId": "kMSGhNzJlURbWBpW",
        "uuid": "Item.kMSGhNzJlURbWBpW",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Kaos-9x",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/Kaos-9x",
        "sort": 0
      },
      {
        "documentId": "lpRyorx71E3kFHKF",
        "uuid": "Item.lpRyorx71E3kFHKF",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "KL-.89 Klaw",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/KL-.89 Klaw",
        "sort": 0
      },
      {
        "documentId": "Rbrsv9QfRM6o4IxF",
        "uuid": "Item.Rbrsv9QfRM6o4IxF",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Reaper",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/Reaper",
        "sort": 0
      },
      {
        "documentId": "6EXDTul4GijPoeeG",
        "uuid": "Item.6EXDTul4GijPoeeG",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Ripper",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/Ripper",
        "sort": 0
      },
      {
        "documentId": "NPEOlxwi2waNG2FE",
        "uuid": "Item.NPEOlxwi2waNG2FE",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "S-U Epsilon 'Sunshine'",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/S-U Epsilon 'Sunshine'",
        "sort": 0
      },
      {
        "documentId": "bosPZcSjee0l9ZWG",
        "uuid": "Item.bosPZcSjee0l9ZWG",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Sentinel",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/Sentinel",
        "sort": 0
      },
      {
        "documentId": "wFCxw3ImuSKXPOIM",
        "uuid": "Item.wFCxw3ImuSKXPOIM",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Slimline Defender",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/Slimline Defender",
        "sort": 0
      },
      {
        "documentId": "xa7tHLKTrGmQIcwd",
        "uuid": "Item.xa7tHLKTrGmQIcwd",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Syncsight Hunter",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/Syncsight Hunter",
        "sort": 0
      },
      {
        "documentId": "BxYCAIPNbh6CIVSp",
        "uuid": "Item.BxYCAIPNbh6CIVSp",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Tiger Beat",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/Tiger Beat",
        "sort": 0
      },
      {
        "documentId": "3u6oWFldM7Nv7n5t",
        "uuid": "Item.3u6oWFldM7Nv7n5t",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "TRGT-9 \"Target\"",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/TRGT-9 \"Target\"",
        "sort": 0
      },
      {
        "documentId": "FZlN9lqdBemx6Gf8",
        "uuid": "Item.FZlN9lqdBemx6Gf8",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "V-100 Vigilant",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/V-100 Vigilant",
        "sort": 0
      },
      {
        "documentId": "Wn66N0hrwd7LmQpE",
        "uuid": "Item.Wn66N0hrwd7LmQpE",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Viper",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/Viper",
        "sort": 0
      },
      {
        "documentId": "NOcsV7VXP4o0ck0k",
        "uuid": "Item.NOcsV7VXP4o0ck0k",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Warhammer H40mm-ER",
        "folderId": "5KWDwkU23whetOIV",
        "folderPath": "Weapons/Firearms",
        "path": "Weapons/Firearms/Warhammer H40mm-ER",
        "sort": 0
      },
      {
        "documentId": "0daOJGQ48dXnHZZa",
        "uuid": "Item.0daOJGQ48dXnHZZa",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Arm-Blades",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Arm-Blades",
        "sort": 0
      },
      {
        "documentId": "BTW4PyIim7prBcFE",
        "uuid": "Item.BTW4PyIim7prBcFE",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Axe",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Axe",
        "sort": 0
      },
      {
        "documentId": "lH75H9fJrqbo5Z2r",
        "uuid": "Item.lH75H9fJrqbo5Z2r",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Baton",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Baton",
        "sort": 0
      },
      {
        "documentId": "4ZCs36PxolFYXO14",
        "uuid": "Item.4ZCs36PxolFYXO14",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Brass Knuckles",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Brass Knuckles",
        "sort": 0
      },
      {
        "documentId": "accqdYWCGWA6nDEW",
        "uuid": "Item.accqdYWCGWA6nDEW",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Cudgel",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Cudgel",
        "sort": 0
      },
      {
        "documentId": "degDSYZ7eHq0PLlw",
        "uuid": "Item.degDSYZ7eHq0PLlw",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Iron Fist (Amp)",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Iron Fist (Amp)",
        "sort": 0
      },
      {
        "documentId": "nwhegwvxSNdLg9d1",
        "uuid": "Item.nwhegwvxSNdLg9d1",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Katana",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Katana",
        "sort": 0
      },
      {
        "documentId": "GlwaJ3s2mcJ8ePV9",
        "uuid": "Item.GlwaJ3s2mcJ8ePV9",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Knife",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Knife",
        "sort": 0
      },
      {
        "documentId": "FGjswkp0rdvBToet",
        "uuid": "Item.FGjswkp0rdvBToet",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Monofilament Whip",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Monofilament Whip",
        "sort": 0
      },
      {
        "documentId": "HrhTRoAFwRLdDA3s",
        "uuid": "Item.HrhTRoAFwRLdDA3s",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Plasma Axe",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Plasma Axe",
        "sort": 0
      },
      {
        "documentId": "2i5n6ftVc1kAeuVp",
        "uuid": "Item.2i5n6ftVc1kAeuVp",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Plasma Sword",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Plasma Sword",
        "sort": 0
      },
      {
        "documentId": "bpqgdDGmy6sUhMjM",
        "uuid": "Item.bpqgdDGmy6sUhMjM",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Polearm",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Polearm",
        "sort": 0
      },
      {
        "documentId": "iitakviAjKbnUk89",
        "uuid": "Item.iitakviAjKbnUk89",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Power Fist",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Power Fist",
        "sort": 0
      },
      {
        "documentId": "6qCMcLsrUfUcZMEn",
        "uuid": "Item.6qCMcLsrUfUcZMEn",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Sickstick",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Sickstick",
        "sort": 0
      },
      {
        "documentId": "kSVBE0zHnrlsOybT",
        "uuid": "Item.kSVBE0zHnrlsOybT",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Staff",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Staff",
        "sort": 0
      },
      {
        "documentId": "lqVM9pAttbThHlQ0",
        "uuid": "Item.lqVM9pAttbThHlQ0",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Stun Baton",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Stun Baton",
        "sort": 0
      },
      {
        "documentId": "4ywbbdZWhPkxPscf",
        "uuid": "Item.4ywbbdZWhPkxPscf",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Sword",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Sword",
        "sort": 0
      },
      {
        "documentId": "Xh0YY8FoHfTksUTL",
        "uuid": "Item.Xh0YY8FoHfTksUTL",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Vibroaxe",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Vibroaxe",
        "sort": 0
      },
      {
        "documentId": "eDo0cyA310ehtqu0",
        "uuid": "Item.eDo0cyA310ehtqu0",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Vibrosword",
        "folderId": "aHRmcytEr2emGb1Y",
        "folderPath": "Weapons/Melee",
        "path": "Weapons/Melee/Vibrosword",
        "sort": 0
      },
      {
        "documentId": "8CBpDFpd7hMOxStt",
        "uuid": "Item.8CBpDFpd7hMOxStt",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Compound Bow",
        "folderId": "9kmoBQyRvIQEoTi1",
        "folderPath": "Weapons/Projectile",
        "path": "Weapons/Projectile/Compound Bow",
        "sort": 100000
      },
      {
        "documentId": "WB3YQ6dJoAvis6xp",
        "uuid": "Item.WB3YQ6dJoAvis6xp",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Crossbow",
        "folderId": "9kmoBQyRvIQEoTi1",
        "folderPath": "Weapons/Projectile",
        "path": "Weapons/Projectile/Crossbow",
        "sort": 200000
      },
      {
        "documentId": "OVi2ocSSjHJRtwKi",
        "uuid": "Item.OVi2ocSSjHJRtwKi",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Heavy Crossbow",
        "folderId": "9kmoBQyRvIQEoTi1",
        "folderPath": "Weapons/Projectile",
        "path": "Weapons/Projectile/Heavy Crossbow",
        "sort": 400000
      },
      {
        "documentId": "FrfP5RFJPkTIF2zN",
        "uuid": "Item.FrfP5RFJPkTIF2zN",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Light Crossbow",
        "folderId": "9kmoBQyRvIQEoTi1",
        "folderPath": "Weapons/Projectile",
        "path": "Weapons/Projectile/Light Crossbow",
        "sort": 150000
      },
      {
        "documentId": "l5AGZbNMPAsfNhUM",
        "uuid": "Item.l5AGZbNMPAsfNhUM",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Explosive Grenade",
        "folderId": "rpm8CmOJ32570KoC",
        "folderPath": "Weapons/Thrown",
        "path": "Weapons/Thrown/Explosive Grenade",
        "sort": 0
      },
      {
        "documentId": "ifQfoPyLKRbY9tic",
        "uuid": "Item.ifQfoPyLKRbY9tic",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Incendiary Grenade",
        "folderId": "rpm8CmOJ32570KoC",
        "folderPath": "Weapons/Thrown",
        "path": "Weapons/Thrown/Incendiary Grenade",
        "sort": 0
      },
      {
        "documentId": "2Y7bqp8oi16DoAAy",
        "uuid": "Item.2Y7bqp8oi16DoAAy",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Knife",
        "folderId": "rpm8CmOJ32570KoC",
        "folderPath": "Weapons/Thrown",
        "path": "Weapons/Thrown/Knife",
        "sort": 0
      },
      {
        "documentId": "9GvjupjpEfsoK0iZ",
        "uuid": "Item.9GvjupjpEfsoK0iZ",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Shock Grenade",
        "folderId": "rpm8CmOJ32570KoC",
        "folderPath": "Weapons/Thrown",
        "path": "Weapons/Thrown/Shock Grenade",
        "sort": 0
      },
      {
        "documentId": "3KE2WlZwBRFGUmb1",
        "uuid": "Item.3KE2WlZwBRFGUmb1",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Shuriken",
        "folderId": "rpm8CmOJ32570KoC",
        "folderPath": "Weapons/Thrown",
        "path": "Weapons/Thrown/Shuriken",
        "sort": 0
      },
      {
        "documentId": "ArS7o2qlHKKBMEnq",
        "uuid": "Item.ArS7o2qlHKKBMEnq",
        "docType": "Item",
        "subtype": "equippableItem",
        "name": "Smoke Grenade",
        "folderId": "rpm8CmOJ32570KoC",
        "folderPath": "Weapons/Thrown",
        "path": "Weapons/Thrown/Smoke Grenade",
        "sort": 0
      }
    ]
  }
}
```
