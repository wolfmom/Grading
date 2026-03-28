# WOLF GRADING ASSISTANT (Edge Extension)

Edge Manifest V3 extension for grading support in Canvas-like pages.

## Important behavior

- The panel appears **only when you click the extension icon** in the browser toolbar.
- Clicking the icon again toggles hide/show.
- No always-on auto panel injection.

## Current rubric labels used

- Requirements
- Content
- Critical Analysis
- APA review

## UI updates

- Removed **Analyze Open Page** button.
- Removed **Copy Full Report** button.
- Removed **Rubric Scores + Comments** header block.
- Copy buttons now show only **Copy**.
- Rubric card copy action copies only the personalized comment text.
- Quick-Hit comment bank is compact as a dropdown (`details + select`).
- Note: binary icon assets removed from this branch to avoid PR systems that reject binary files.
- Student first name extraction now prioritizes the top-right Canvas header name.

## Install

1. Open `edge://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder.
5. Click the extension icon to summon the panel.
