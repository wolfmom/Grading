# Canvas Grading Copilot (Edge Extension)

This Microsoft Edge Manifest V3 extension injects a **movable, resizable grading assistant panel** into Canvas-like grading pages.

## What this version supports

- CSU Global 3-location feedback protocol:
  1. Within the submission itself
  2. Rubric comments for point deductions
  3. Gradebook/assignment comment area
- Right-side panel that can now be moved anywhere and resized larger/smaller.
- Updated visual styling:
  - pink top bar
  - green **Analyze Pasted Text** button
  - dark red section headers
  - larger default font for readability
- 2–3 sentence feedback comments throughout generated output.
- Expanded comment bank with:
  - Executive Summary
  - Background & Management Issue
  - Analysis Using Course Tools
  - Recommendations
  - APA, Research & Writing Quality
  - BUS131 CLO 7 guidance
  - quick-hit deduction comments

## Install in Edge (Developer Mode)

1. Open `edge://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder (`/workspace/Grading`).
5. Open your Canvas grading page and run the panel.

## Usage

1. Click **Analyze Open Page** to read visible Canvas text.
2. Or paste full submission/rubric text and click **Analyze Pasted Text**.
3. Drag the header to move the panel.
4. Drag the bottom-right corner to resize.
5. Copy outputs using per-item **Copy** buttons or **Copy Full Report**.

## Notes

- The tool uses deterministic heuristics (no external AI API required).
- If content is inside a restricted iframe, paste full text manually.
