# Canvas Grading Copilot (Edge Extension)

This Microsoft Edge Manifest V3 extension injects a **tall, right-side grading assistant panel** into Canvas-like grading pages.

## What this updated version now enforces

It now explicitly supports the CSU Global grading protocol by generating feedback in **3 required locations**:

1. **Within the submission itself** (annotation suggestions)
2. **Rubric comments for any point deductions**
3. **Gradebook/assignment comments area** (non-blank personalized summary)

It also includes:

- rubric-aligned score/comment blocks
- feed up, feedback, feed forward suggestions
- first-three-word anchors for quick `Ctrl+F`
- 2 grammar/typo notes
- 1 general improvement note
- 3 positive feedback comments
- quick copy buttons for each output block
- close/minimize/expand controls (`X`, `−`, `+`)
- practical checklist + grading timeliness reminder

## Install in Edge (Developer Mode)

1. Open `edge://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder (`/workspace/Grading`).
5. Open your Canvas grading page and run the panel from the right side.

## Usage

1. Click **Analyze Open Page** to read visible Canvas text.
2. Or paste full submission/rubric text and click **Analyze Pasted Text**.
3. Copy outputs using per-item **Copy** buttons or **Copy Full Report**.

## Notes

- The tool uses deterministic heuristics (no external AI API required).
- If content is inside a restricted iframe, paste the full text manually.
