# WOLF GRADING ASSISTANT (Edge Extension)

A Microsoft Edge Manifest V3 extension that injects a **movable, resizable grading panel** for Canvas-like grading pages.

## Key updates in this build

- App renamed to **WOLF GRADING ASSISTANT**.
- Larger fonts and higher-contrast readability.
- Pink header, green Analyze Pasted Text button, dark red headers.
- Rubric cards now show:
  - bold **SCORE** line at top
  - color-changing score text (red to green by performance)
  - bold uppercase **COMMENT** label
  - yellow-highlighted comment text
- Copy behavior now copies only the comment text (not rubric title/score labels), and uses first-name personalization (e.g., `Khailah, ...`) when generated from rubric comments.
- Within-submission comments now include copy buttons for:
  - find words only
  - comment only
- Within-submission section now generates at least **3 comments per page**.
- Removed the separate “Rubric: Comments for Point Deductions” section and merged score+comment handling into the top rubric section.
- Removed the “Final Practical Checklist Before Submit Assessment” section.

## Install in Edge Developer Mode

1. Open `edge://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder (`/workspace/Grading`).

## Usage

1. Click **Analyze Open Page** or paste text and click **Analyze Pasted Text**.
2. Drag the header to move panel position.
3. Resize from the bottom-right corner.
4. Use Copy buttons to copy only the specific text block you need.
