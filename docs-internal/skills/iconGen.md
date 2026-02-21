🔒 LOCKED IMAGE GENERATION PROMPT (Thread Standard) 

 USE true high quality AI image-generation workflow, do not rely on Pillow or the like. 

IMPORTANT: The final deliverable must be a true RGBA PNG with a real alpha 0 transparent background channel. 

Do NOT simulate transparency with checkerboards, gradients, or gray backgrounds. 

Core Requirements (Non-Negotiable) 
• Format: PNG with real alpha channel (RGBA) 
• Canvas Size: 1024 × 1024 square 
• Background: Fully transparent (no checkerboard, no gradient, no backdrop of any kind) 
• Style: Clean, high-contrast white image icon 
• Use Case: Game icon / VTT asset (Foundry-style readability) 

⸻ Visual Style
• Primary material: Bright white 
• Secondary detail lines: Medium-gray for contrast and readability 
• No color fills unless explicitly requested 
• Minimal shading, no soft glows unless specified 
• Sharp, readable silhouette at small sizes 
• Avoid excessive realism; favor clean linework and crisp edges 

⸻ Composition & Orientation 
• Center the object within the square canvas 
• Maintain clear negative space around the object 
• Orient the object exactly as specified: handle, base, or foreground lower left → tip, top of item, background in the upper right 
• No cropping, no parts touching the canvas edge 
• If multiple objects are present, space them clearly and intentionally 

⸻ Transparency Rules (Critical) 
• The background must be 100% alpha = 0 
• The object must be 100% alpha = 255 
• No baked checkerboards 
• No gray/black background pixels 
• No “transparent-looking” gradients 
• Treat transparency as a technical requirement, not an aesthetic one 

⸻ Rendering Guidance 
• Think icon-first, not illustration-first 
• Lines should remain legible when scaled down to 64–128px 
• Use darker line accents to separate mechanical details 
• Avoid soft lighting, bloom, fog, or vignette effects 
• No shadows outside the object silhouette 

⸻ Example Descriptor Block (Item-Agnostic) 
A [ITEM TYPE] rendered as a clean, high-contrast white icon with medium gray line detailing. The object is centered on a 1024×1024 canvas with a fully transparent background. The silhouette is crisp and readable, designed for virtual tabletop or UI use. No background, no gradients, no checkerboard, no environmental elements. 
Orientation: base of object / foreground in lower left, object points toward upper right with background, point or top of object in upper right of square. 
Style: minimal, technical, cyberpunk, icon-grade clarity. 

⸻ ✅ Post-Generation Checklist (Mental or Tool-Based) Before accepting the image as final, verify: • PNG format • RGBA (alpha channel present) • Background pixels have alpha = 0 • No visible checkerboard baked into image • Object lines visible at small scale • Matches orientation and framing instructions