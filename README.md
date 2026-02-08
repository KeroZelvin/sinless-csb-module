# sinless-csb-module
Foundry VTT Sinless module for Custom System Builder

This product is based on the Sinless Cyber-Sorcery
Table Top Role Playing Game, published by Courtney Campbell/Hack & Slash Publishing. This product is published under license. Sinless is copyright of
Courtney Campbell. All rights reserved. 

For additional information, visit
www.sinlessrpg.com or contact agonarch@sinlessrpg.com

Game assets are used with permission from Courtney Campbell, please do not re-use without express permission from the artist per this license:

[Sinless Third Party License](https://www.patreon.com/posts/sinless-license-120365187)

If you love SINless consider supporting future content at Courtney's [Patreon](https://patreon.com/hackandslash?utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=creatorshare_fan&utm_content=join_link)

#####

Alpha Sinless Foundry VTT module running on the Custom System Builder system.

To use: 
1: Create foundry world with Custom System Builder as system.
2: Install sinlesscsb module from [manifest:](https://github.com/KeroZelvin/sinless-csb-module/releases/latest/download/module.json)

The module has not been extensively bug tested, please let me know if you find any issues.

Implemented:

Roll from pools which can be depleted by skill rolls and are refreshed each combat round.

Initiative implemented following Sinless rules.

Track PC body and stun track and display / modify on map tokens.

Drag weapon / action items to character sheet with automated rolls.

Customise weapons with mods and use bonus and dice mod fields to automate customisations.

Drag VCR to player actor and apply variables to rolls.   Implemented automation for VCR bonus dice which are used first when available in drone skill rolls.

Drones / vehicle items draggable from items to PC sheet.  This automatically makes these instances of that drone archetype custom to the player and creates a PC drones or Vehicles folder to keep track of customised / modded versions that is only visible to player / GM. 

Deploy drone or vehicle to battle map with deploy button.

Can open specific drone / vehicle actor from PC sheet drone inventory to help manage when owning alternate / differently modded versions of the same drone type.

Can drag drone or vehicle weapons / skills to specific drones item displayer to customise and automate drone attacks.  Can roll attacks from either drone sheet or directly from PC sheet.

Cyberdecks items added, when dragged to PC sheet they influence Decking rolls.

MCP bonus dice implemented and are automatically used first before pools in Decking skills rolls.

Decking Program skill items implemented, draggable to PC actor sheet.

Spells API implemented.

Sorcery spell items implemented.

Speakers implemented, including automated mod of pool max totals managed through API.

Amps implemented.  (not automated, but individual effects can be automated by player by adjusting diceMod or Bonus dice field on impacted skills, or by directly adjusting armor, zoetic potential, other fields. etc. on the PC actor sheet)

Car chase mechanics implemented/ automated

GM control panel (Session Settings actor) implemented with ability to track alert (partially automated through API now), set / change mission Target Number, manage car chase (shuffle deck, deal cards etc) mechanics.

To Do:
    add NPCs / critters

    add pregen characters from book / QuickStart 

    Add domain play / sector / Brand stuff

    AGENTS rollable table

    UI polish

    help files, documentation on how to use module features.

Courtney Campbell has graciously allowed his awesome art to be used in the module, and that art MAY NOT be used elsewhere without his express permission.  Other art is found from other Foundry cyberpunk modules, etc.  If anyone wants to make bespoke art or icons for items in the module, please reach out!  Currently all the non-(energy weapon and firearm art made by Courtney Campbell) weapon art is slop filler, and would love human creative energy.

Some icons originally from the Foundry Cyberpunk Red module:
https://gitlab.com/cyberpunk-red-team/fvtt-cyberpunk-red-core

    Icons were created by the talented folks over at www.game-icons.net and used under the terms of Creative Commons 3.0 BY license.
    https://creativecommons.org/licenses/by/3.0/

    For further information or links to the icon authors please visit:
    https://game-icons.net/about.html

Some icons originally from the Foundry Shadowrun 5 module:
https://github.com/SR5-FoundryVTT/SR5-FoundryVTT

    Icons : © Bella Carvalho, licensed under CC BY-SA 4.0. Source: [https://github.com/SR5-FoundryVTT/SR5-FoundryVTT](https://github.com/SR5-FoundryVTT/SR5-FoundryVTT). Changes: <none>. License: https://creativecommons.org/licenses/by-sa/4.0/  (Bella's Icons marked in folder with license info)

    Non Bella Carvalho Icons in the SR5 are sourced from game-icons.net, see atributions in that folder.

Some icons originally from the Foundry Shadowrun 6 module:
https://github.com/yjeroen/foundry-shadowrun6-eden

    Icons were created by the talented folks over at www.game-icons.net and used under the terms of Creative Commons 3.0 BY license.
    https://creativecommons.org/licenses/by/3.0/

    For further information or links to the icon authors please visit:
    https://game-icons.net/about.html

   