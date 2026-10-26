# PLAN.md: Auto-Pan Onboarding Tour & Non-Blocking Subtle Entrance Resolution

## 1. Problem Diagnosis from User Feedback & Screenshots

### A. Auto-Pan Failure in Onboarding Tour (Images 1 & 3)
- In Step 3 (Input Card) and Step 4 (Supreme Lens), mobile screens do not auto-scroll.
- The user had to look at an empty area because the spotlight target was below the fold.
- `targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })` was never invoked.
- `spotlightRect` was measured once before scroll, causing the spotlight hole-punch and tooltip to misalign or fall off-screen.

### B. Blank Screen After Onboarding / Invalidation of Page Content (Image 2)
- The entire main content area disappeared (`opacity: 0`) after the entrance/onboarding, requiring a hard refresh to see anything.
- **Root Cause**: Conditional Framer Motion variants (`isFirstVisit ? entranceContainerVariants : undefined`). When state toggled from `true` to `false`, Framer Motion lost its `variants` definitions mid-stream, stranding the layout container at `opacity: 0`.

### C. "Everything Should Be Seen Even by the Entrance"
- The user explicitly requested: *"everything should be seen even by the entrance"*.
- The full-screen veil overlay blocked the page and felt like an obstruction.
- The entrance must be non-blocking, subtle, and keep all elements completely visible without hiding the UI.

---

## 2. Architectural Solution

### 1. Remove Full-Screen Veil Overlay & Fragile Motion Variants
- Remove the full-screen `<AnimatePresence>` entrance veil completely.
- Remove conditional `isFirstVisit ? variants : undefined` from layout containers.
- Ensure all elements are permanent, robust DOM nodes that default to 100% visible (`opacity: 1`), completely eliminating the blank screen glitch (Image 2).
- Apply a subtle, lightweight, non-blocking page entrance on initial mount that gracefully settles the page in 0.5s without ever hiding or blocking content.

### 2. Auto-Pan Onboarding Tour (`targetRef.current.scrollIntoView`)
- In `useEffect([tourStep])`:
  - When `tourStep` activates (1, 2, 3, or 4):
    - Smoothly scroll target into center view: `targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })`.
    - Run an active tracking interval (every 40ms for 600ms) to recalculate `spotlightRect` continuously during the smooth scroll.
    - Clamp tooltip positioning so it stays comfortably inside the mobile viewport at all times.

### 3. Verification & Safety
- Protect `api/`, `SupremeLens.tsx`, and all audio and translation mechanisms.
- Build check with `npm run build`.
