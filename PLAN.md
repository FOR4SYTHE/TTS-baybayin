# PLAN.md: Root-Cause Analysis and Resolution for "TAGALOG" Text Clipping ("AGALO")

## Problem Statement
The user reported that on their partner's laptop running Chrome, the arched header title renders as **"AGALO"** (missing the initial **"T"** and trailing **"G"**), whereas on mobile / smaller viewports, the entire title **"TAGALOG"** renders correctly.
User explicitly requested:
- Diagnose why this happens on Chrome on a laptop without breaking the AI translator or Supreme Lens.
- Adhere strictly to `AGENTS.md` and user global instructions.

---

## 1. Root Cause Analysis (Deep Architectural Diagnosis)

### A. The Mechanics of SVG `<textPath>` Rendering
In `src/App.tsx` (lines 1196–1271):
```tsx
<div className="relative w-[320px] md:w-[380px] h-[100px] -mb-6 z-20">
  <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
    <path id="tagalog-curve" fill="transparent" d="M 20,100 Q 200,10 380,100" />
    ...
    <text width="400" className="text-6xl md:text-7xl uppercase tracking-wide" ...>
      <textPath href="#tagalog-curve" startOffset="50%" textAnchor="middle">
        TAGALOG
      </textPath>
    </text>
  </svg>
</div>
```

1. **Path Arc Length**:
   The path `d="M 20,100 Q 200,10 380,100"` has a chord length of 360 and a sagitta of 45.
   Its total arc length is approximately **374.7 SVG user units**.

2. **Responsive CSS Font Inflation (`md:text-7xl`)**:
   - On mobile screens (`< 768px`), Tailwind applies `text-6xl` (`3.75rem` = `60px`). In Dela Gothic One, 7 uppercase glyphs at 60px have a width of ~335px. Because 335px < 374.7px, the text fits inside the path.
   - On laptops and desktops (`>= 768px`), Tailwind's `md:` breakpoint applies `md:text-7xl` (`4.5rem` = `72px`).
   - At 72px + `tracking-wide` (letter spacing), the glyph advance of "TAGALOG" inflates to **~425px** inside the 400-unit SVG coordinate space!

3. **W3C SVG Specification Violation**:
   - With `startOffset="50%"` (center at 187.35) and `textAnchor="middle"`, a 425px text string attempts to span from **-25px** to **+400px**.
   - Per the W3C SVG specification (and Chromium / Blink's `<textPath>` implementation):
     > *If the advance of a glyph falls before 0 or past the end of the path (`pathLength`), that glyph is clipped and MUST NOT be rendered.*
   - Consequently:
     - The first letter **"T"** (positioned < 0px) is dropped by the browser.
     - The last letter **"G"** (positioned > 374.7px) is dropped by the browser.
     - Only the remaining inner letters **"A G A L O"** fit within the [0, 374.7] range.
     - Result: Exactly the **"AGALO"** visual glitch shown in the user's screenshot!

4. **Double Scaling Anti-Pattern**:
   - The SVG element already uses `viewBox="0 0 400 120"` with `className="w-full h-full"`.
   - When the parent container expands from `w-[320px]` to `md:w-[380px]`, the vector graphics and text **already scale up automatically by 18.75%**.
   - Applying `md:text-7xl` on top of that applied an artificial second font expansion, breaking the coordinate bounds of the viewBox.

---

## 2. Proposed Architectural Solution

1. **Lock SVG Font Sizing to ViewBox User Units**:
   - Remove `text-6xl md:text-7xl` from the `<text>` elements.
   - Set an explicit, calibrated SVG font size of `56px` (e.g. `style={{ fontFamily: "'Dela Gothic One', sans-serif", fontSize: '56px' }}`).
   - This ensures the font size is always 100% proportional to the 400x120 SVG coordinate space regardless of device screen size, OS display scaling, or browser zoom level.

2. **Extend the Path Safety Runway**:
   - Update `tagalog-curve` to `d="M 0,110 Q 200,10 400,110"`.
   - This follows the exact same parabolic trajectory, but extends the arc length from ~375px to ~416px.
   - Provides ~45px of safety margin on both ends, guaranteeing that "T" and "G" will never be clipped under any font metric or fallback scenario.

3. **Retain Full System Stability**:
   - Zero changes to `api/` or backend.
   - Zero changes to `SupremeLens.tsx` or translator logic.
   - Preserves all visual styles, drop shadows, white outline strokes, and fiesta banderitas alignment.

---

## 3. Implementation Steps
1. Edit `src/App.tsx` around lines 1198–1271:
   - Adjust `<path id="tagalog-curve" d="M 0,110 Q 200,10 400,110" />`.
   - Update `<text>` tags: remove `text-6xl md:text-7xl`, set `fontSize: '56px'`, remove `tracking-wide` (or keep normal spacing) to avoid artificial text dilation.
2. Verify TypeScript / build status:
   - Ask for confirmation to run `npm run build` or inspect code.
3. Review against `AGENTS.md` and user requirements.
