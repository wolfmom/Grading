(() => {
  const PANEL_ID = "cgc-panel";
  if (document.getElementById(PANEL_ID)) return;

  const RUBRIC = [
    { key: "understanding", label: "Understanding of Case & Key Issues", max: 30 },
    { key: "application", label: "Application of Business Concepts & Theories", max: 30 },
    { key: "critical", label: "Critical Thinking & Problem-Solving", max: 20 },
    { key: "organization", label: "Organization & Structure", max: 10 },
    { key: "apa", label: "APA Formatting & Citations", max: 10 }
  ];

  const COMMENT_BANK = {
    "Executive Summary": {
      "Excellent": "Strong opening here. Your executive summary gives a clear and concise snapshot of the company, the central issue, and the direction of your recommendations. It feels professional, focused, and easy to follow.",
      "Proficient": "You are on the right track here. I can clearly see the company and the general issue, though one or two pieces could be sharper. Next time, name the management issue and preview your recommendation path more directly.",
      "Fair / Developing": "This gives a general overview, but the executive summary still needs more clarity and focus. It reads a little broad, so tighten the snapshot of the company, issue, and analysis direction. The next step is to make this section more concise and purposeful.",
      "Needs Improvement": "This section is too vague to function as a strong executive summary. I need to see a clearer overview of the company, the main management issue, and the direction of recommendations. Think of this as a quick briefing that tells the reader what matters most.",
      "No Submission / Off Topic": "I did not see a usable executive summary here. This section should provide a brief, focused overview of the company, issue, and recommendations."
    },
    "Background & Management Issue": {
      "Excellent": "You provide a strong overview of the company and clearly identify a relevant management issue. I can tell exactly what the problem is and why it matters. This section gives your analysis a solid foundation.",
      "Proficient": "You explain the company and management issue well overall. A few details could be developed further to justify why this is the central management problem. Deepening that rationale would strengthen this section.",
      "Fair / Developing": "You provide some background, but the management issue is still underdeveloped. I can see what you are pointing to, yet I need a clearer explanation of why this issue deserves focus. Add stronger justification tied to case evidence.",
      "Needs Improvement": "This section needs more clarity and accuracy. The company overview is limited, and the management issue is unclear or weakly connected to the case. Slow down here and define one clearly focused problem.",
      "No Submission / Off Topic": "I did not see a clear company background or a defined management issue in this section. Both are needed before the analysis can take shape."
    },
    "Analysis Using Course Tools": {
      "Excellent": "This is the strongest part of the paper. You applied at least three course tools correctly and used them to deepen analysis rather than just name concepts. Your explanations are thoughtful and connected back to the case.",
      "Proficient": "You applied course tools appropriately, and I can see your understanding. The next step is depth, since some links are brief. Spend more time explaining how each tool clarifies the management issue.",
      "Fair / Developing": "You referenced relevant course tools, but the analysis is still limited. Right now, tools are mentioned more than they are fully used. Push further into why and how each tool explains the case.",
      "Needs Improvement": "This section needs much stronger use of course tools. The tools are either applied minimally or inaccurately, so analysis feels underdeveloped. Focus on selecting the right tools and showing exactly how they interpret the case.",
      "No Submission / Off Topic": "I did not see meaningful application of course tools in this section. This part should show how management frameworks analyze the issue."
    },
    "Recommendations": {
      "Excellent": "Your recommendations are actionable, realistic, and grounded in your analysis. I also like that they feel practical rather than generic. This section shows strong judgment and alignment between analysis and solution.",
      "Proficient": "These recommendations are generally appropriate for the case. What would strengthen them is more depth and clearer justification. Tie each recommendation back to specific analytical findings.",
      "Fair / Developing": "You offer recommendations, but they remain somewhat general or lightly supported. I can see where you are going, but I need clearer evidence for why these are the best next steps. Add stronger support from the analysis.",
      "Needs Improvement": "The recommendations feel too broad, unsupported, or unrealistic for the issue presented. Make sure each recommendation is specific, practical, and directly linked to your analysis. That connection is essential for credibility.",
      "No Submission / Off Topic": "I did not see 3–5 actionable recommendations here. This section should move from analysis into clear and realistic next steps."
    },
    "APA, Research & Writing Quality": {
      "Excellent": "Your writing is clear, professional, and easy to follow, and your research support strengthens the paper. You used credible sources effectively and handled APA well overall. The academic presentation helps your ideas come through clearly.",
      "Proficient": "You are on the right track here. The writing is generally clear, and sources support your analysis. There are a few minor APA or writing issues to clean up, but they do not significantly weaken the work.",
      "Fair / Developing": "The thinking is there, but the scholarly packaging needs more attention. I noticed APA inconsistencies and a few clarity issues in the writing. Proofread carefully and ensure citations/references are complete and consistent.",
      "Needs Improvement": "This area needs more work. I either did not see enough credible source support, or APA/writing issues made the paper harder to follow. Please use Writing Center and APA resources before the next submission.",
      "No Submission / Off Topic": "I did not see the required level of research and writing quality here. This assignment needs credible source support, APA formatting, and clear professional writing."
    },
    "BUS131 CLO 7": {
      "4 pts — Beyond Expectations": "You went beyond simply meeting the learning outcome here. I can see clear mastery in how you applied course concepts with depth and sound judgment. This feels thoughtful, confident, and well developed.",
      "3 pts — Meets Expectations": "You met expectations for this learning outcome. Your work shows solid understanding and appropriate application. Nicely done.",
      "2 pts — Developing Mastery": "You are developing in this area, and I can see the foundation forming. The next step is to push deeper in explanation and application so the learning outcome is demonstrated more fully.",
      "1 pt — Limited Evidence": "I did not yet see enough clear evidence of mastery for this learning outcome. I would like to see more direct application and clearer support.",
      "0 pts — Not Attempted": "I did not see evidence of an attempt to address this learning outcome in the assignment."
    }
  };

  const QUICK_HITS = {
    "Executive Summary": "Good start here. Tighten this section so the company, issue, and recommendation path are immediately clear.",
    "Background & Management Issue": "I can see the issue, but I would like more justification for why this is the core management problem.",
    "Analysis Using Course Tools": "You named the right tools; now go one step further and show how they explain the case.",
    "Recommendations": "These recommendations are reasonable, but they need a little more support from your analysis.",
    "APA, Research & Writing Quality": "The ideas are strong. The next step is to clean up APA and source integration so the paper feels more polished."
  };

  const root = document.createElement("div");
  root.id = PANEL_ID;
  root.className = "cgc-expanded";

  root.innerHTML = `
    <div class="cgc-header" id="cgc-drag-handle">
      <div class="cgc-title">Canvas Grading Copilot</div>
      <div class="cgc-header-actions">
        <button class="cgc-head-btn" id="cgc-min" title="Minimize">−</button>
        <button class="cgc-head-btn" id="cgc-max" title="Expand">+</button>
        <button class="cgc-head-btn cgc-close" id="cgc-close" title="Close">×</button>
      </div>
    </div>

    <div class="cgc-body">
      <div class="cgc-controls">
        <button id="cgc-analyze-page">Analyze Open Page</button>
        <button id="cgc-analyze-paste">Analyze Pasted Text</button>
      </div>

      <label for="cgc-paste">Paste assignment/rubric text (optional)</label>
      <textarea id="cgc-paste" placeholder="Paste student submission + rubric + assignment details if needed."></textarea>

      <div class="cgc-controls">
        <button id="cgc-copy-all">Copy Full Report</button>
        <button id="cgc-clear">Clear</button>
      </div>

      <div id="cgc-results"></div>
    </div>

    <button id="cgc-open-tab">Open Grader</button>
  `;

  document.body.appendChild(root);

  const el = {
    panel: root,
    dragHandle: root.querySelector("#cgc-drag-handle"),
    results: root.querySelector("#cgc-results"),
    paste: root.querySelector("#cgc-paste"),
    min: root.querySelector("#cgc-min"),
    max: root.querySelector("#cgc-max"),
    close: root.querySelector("#cgc-close"),
    openTab: root.querySelector("#cgc-open-tab"),
    analyzePage: root.querySelector("#cgc-analyze-page"),
    analyzePaste: root.querySelector("#cgc-analyze-paste"),
    copyAll: root.querySelector("#cgc-copy-all"),
    clear: root.querySelector("#cgc-clear")
  };

  const state = { report: null, dragging: false, offsetX: 0, offsetY: 0 };

  initializePanelPosition();
  initializeDrag();

  el.analyzePage.addEventListener("click", () => runAnalysis(getCanvasVisibleText()));
  el.analyzePaste.addEventListener("click", () => runAnalysis(el.paste.value));

  el.copyAll.addEventListener("click", () => {
    if (state.report) writeClipboard(formatReport(state.report));
  });

  el.clear.addEventListener("click", () => {
    state.report = null;
    el.results.innerHTML = "";
    el.paste.value = "";
  });

  el.min.addEventListener("click", () => {
    el.panel.classList.remove("cgc-expanded");
    el.panel.classList.add("cgc-minimized");
  });

  el.max.addEventListener("click", () => {
    el.panel.classList.remove("cgc-minimized");
    el.panel.classList.add("cgc-expanded");
  });

  el.close.addEventListener("click", () => {
    el.panel.classList.add("cgc-hidden");
  });

  el.openTab.addEventListener("click", () => {
    el.panel.classList.remove("cgc-hidden", "cgc-minimized");
    el.panel.classList.add("cgc-expanded");
  });

  function initializePanelPosition() {
    const width = 460;
    const startLeft = Math.max(16, window.innerWidth - width - 24);
    el.panel.style.left = `${startLeft}px`;
    el.panel.style.top = "18px";
    el.panel.style.right = "auto";
  }

  function initializeDrag() {
    el.dragHandle.addEventListener("mousedown", (event) => {
      if (event.target.closest("button")) return;
      state.dragging = true;
      const rect = el.panel.getBoundingClientRect();
      state.offsetX = event.clientX - rect.left;
      state.offsetY = event.clientY - rect.top;
      el.panel.classList.add("cgc-dragging");
      event.preventDefault();
    });

    window.addEventListener("mousemove", (event) => {
      if (!state.dragging) return;
      const maxLeft = Math.max(0, window.innerWidth - el.panel.offsetWidth);
      const maxTop = Math.max(0, window.innerHeight - 48);
      const nextLeft = clamp(event.clientX - state.offsetX, 0, maxLeft);
      const nextTop = clamp(event.clientY - state.offsetY, 0, maxTop);
      el.panel.style.left = `${nextLeft}px`;
      el.panel.style.top = `${nextTop}px`;
      el.panel.style.right = "auto";
    });

    window.addEventListener("mouseup", () => {
      state.dragging = false;
      el.panel.classList.remove("cgc-dragging");
    });
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function normalizeSpace(text) {
    return (text || "").replace(/\s{2,}/g, " ").trim();
  }

  function getCanvasVisibleText() {
    const targets = [
      document.querySelector("#content"),
      document.querySelector(".docviewer"),
      document.querySelector("iframe"),
      document.body
    ].filter(Boolean);

    for (const node of targets) {
      try {
        if (node.tagName === "IFRAME" && node.contentDocument?.body?.innerText) {
          return node.contentDocument.body.innerText;
        }
        if (node.innerText && node.innerText.trim().length > 200) return node.innerText;
      } catch {
        continue;
      }
    }

    return document.body.innerText || "";
  }

  function runAnalysis(rawInput) {
    const raw = (rawInput || "").trim();
    if (!raw) {
      el.results.innerHTML = `<p class="cgc-error">No text found. Paste text or open a Canvas page with visible submission content.</p>`;
      return;
    }

    const assignmentText = extractAssignmentText(raw);
    const rubricText = extractRubricText(raw);
    const meta = extractMeta(raw);
    const report = buildReport({ assignmentText, rubricText, meta });
    state.report = report;
    renderReport(report);
  }

  function extractAssignmentText(raw) {
    const marker = /Case Study Analysis Rubric|Criteria\s+Ratings\s+Points|Assessment\s+Grade out of 100/i;
    const parts = raw.split(marker);
    const candidate = parts[0] && parts[0].length > 300 ? parts[0] : raw;
    return normalizeSpace(candidate.replace(/Page\s+\d+\s+of\s+\d+/gi, ""));
  }

  function extractRubricText(raw) {
    const start = raw.search(/Case Study Analysis Rubric|Criteria\s+Ratings\s+Points/i);
    if (start < 0) return "";
    return normalizeSpace(raw.slice(start));
  }

  function splitSentences(text) {
    return normalizeSpace(text)
      .split(/(?<=[.!?])\s+(?=[A-Z"(])/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20);
  }

  function firstThreeWords(sentence) {
    return sentence.replace(/[^\w\s'-]/g, "").split(/\s+/).slice(0, 3).join(" ");
  }

  function keywordCount(text, words) {
    const lc = text.toLowerCase();
    return words.reduce((acc, word) => acc + (lc.includes(word) ? 1 : 0), 0);
  }

  function scoreBand(score, max) {
    const pct = score / max;
    if (pct >= 0.9) return "Excellent";
    if (pct >= 0.75) return "Proficient";
    if (pct >= 0.55) return "Fair / Developing";
    return "Needs Improvement";
  }

  function extractMeta(raw) {
    const lines = raw.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    let studentName = "Student";

    for (const line of lines.slice(0, 12)) {
      const m = line.match(/^([A-Z][a-z]+\s+[A-Z][a-z]+)\s+\d{1,2}\/\d{1,2}\/\d{2,4}$/);
      if (m) {
        studentName = m[1];
        break;
      }
    }

    const pageMatches = [...raw.matchAll(/Page\s+\d+\s+of\s+(\d+)/gi)].map((m) => Number(m[1]));
    const pageCount = pageMatches.length ? Math.max(...pageMatches) : 1;
    const submittedLine = lines.find((l) => /Submitted:\s+/i.test(l)) || "";
    const submittedValue = submittedLine.replace(/^.*Submitted:\s*/i, "").trim();

    return { studentName, pageCount, submittedValue };
  }

  function parseInstructorScores(rubricText) {
    if (!rubricText) return {};
    const map = {};

    for (const row of RUBRIC) {
      const escaped = row.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const blockRegex = new RegExp(`${escaped}[\\s\\S]{0,450}?Criterion Score\\s*(\\d+)\\s*\\/?\\s*${row.max}`, "i");
      const blockMatch = rubricText.match(blockRegex);
      if (blockMatch) map[row.key] = Number(blockMatch[1]);
    }

    return map;
  }

  function nextThursday1159MT(submittedValue) {
    if (!submittedValue) return "Thursday 11:59 p.m. MT";
    const parsed = new Date(submittedValue);
    if (Number.isNaN(parsed.getTime())) return "Thursday 11:59 p.m. MT";

    const targetDow = 4;
    const delta = (targetDow - parsed.getUTCDay() + 7) % 7 || 7;
    const due = new Date(parsed);
    due.setUTCDate(due.getUTCDate() + delta);

    const month = due.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
    return `${month} ${due.getUTCDate()}, ${due.getUTCFullYear()} by 11:59 p.m. MT`;
  }

  function heuristicScore(label, max, assignmentText, rubricText) {
    const words = assignmentText.toLowerCase();
    const sentenceCount = splitSentences(assignmentText).length;

    let raw = 0;
    let comment = "";

    if (label.includes("Understanding")) {
      raw = 12 + keywordCount(words, ["case", "issue", "challenge", "change", "stakeholder", "impact"]) * 3 + Math.min(6, Math.floor(sentenceCount / 8));
      comment = "You identify the core issue and central context with a helpful overall direction. To improve further, explain secondary issues and why each one influences outcomes. Adding one clear linkage to organizational impact would strengthen this section.";
    } else if (label.includes("Application")) {
      raw = 12 + keywordCount(words, ["model", "theory", "framework", "transformational", "incremental", "organizational"]) * 3;
      if (!/citation|reference|apa/i.test(words)) raw -= 2;
      comment = "You are using relevant concepts and there is a visible effort to apply course learning to the case. The next step is to explicitly connect each concept to a concrete case fact. Stronger theory-to-evidence links will make your analysis more persuasive.";
    } else if (label.includes("Critical")) {
      raw = 8 + keywordCount(words, ["alternative", "solution", "risk", "trade-off", "recommend", "because"]) * 2 + Math.min(4, Math.floor(sentenceCount / 10));
      comment = "Your analysis shows logical thinking and a workable direction for solving the issue. To deepen critical thinking, compare at least one alternative and explain trade-offs before finalizing recommendations. That extra evaluation step improves decision quality.";
    } else if (label.includes("Organization")) {
      raw = 5 + keywordCount(words, ["introduction", "conclusion", "first", "next", "finally"]);
      if (sentenceCount > 18) raw += 2;
      comment = "The paper is generally readable and your ideas are moving in a sensible order. Tightening transitions and giving each paragraph one clear purpose will improve flow. A clearer structure from issue to solution will strengthen readability.";
    } else if (label.includes("APA")) {
      raw = 4 + keywordCount((rubricText + " " + words).toLowerCase(), ["apa", "references", "in-text", "citation", "doi"]) * 2;
      if (!/\(.*?,\s*\d{4}\)/.test(assignmentText)) raw -= 2;
      if (!/references?/i.test(assignmentText)) raw -= 2;
      comment = "Your writing voice and organization are developing in a positive direction. APA consistency still needs attention, especially citation-reference alignment and complete source formatting. Cleaning those mechanics will help your strong ideas come through more clearly.";
    }

    const score = Math.max(0, Math.min(max, Math.round(raw)));
    return { score, band: scoreBand(score, max), comment: `${scoreBand(score, max)}: ${comment}` };
  }

  function rubricComment(item) {
    const { label, score, max } = item;
    const deducted = max - score;
    if (deducted <= 0) {
      return "You met expectations in this category with clear evidence of skill and thoughtful execution. Keep this same level of depth and clarity in future assignments to maintain strong results.";
    }

    if (label.includes("APA")) {
      return "You are on the right track in this category, and the core ideas are present. The deduction is tied to APA/source consistency, so tighten in-text citations and full reference details. Addressing those issues should help recover full points next time.";
    }

    return "You show a workable foundation in this area, and I can see progress in your approach. The deduction reflects limited depth or incomplete support in key parts of the analysis. For next time, add clearer evidence and tighter concept-to-case explanation to fully meet expectations.";
  }

  function selectSentence(sentences, matcher, fallbackIndex = 0) {
    return sentences.find((s) => matcher(s.toLowerCase())) || sentences[fallbackIndex] || "";
  }

  function extractGrammarIssues(sentences) {
    const issues = [];

    for (const sentence of sentences) {
      if (/\b(\w+)\s+\1\b/i.test(sentence)) {
        issues.push({ anchor: firstThreeWords(sentence), issue: "Possible repeated word.", suggestion: "Remove the duplicated word and reread for smooth flow." });
      }
      if (/\badjustments\s+an\s+adjustment\b/i.test(sentence)) {
        issues.push({ anchor: firstThreeWords(sentence), issue: "Awkward duplicated phrasing.", suggestion: "Replace this with one concise phrase so the sentence reads cleanly." });
      }
      if (/\bstaff members for candid\b/i.test(sentence)) {
        issues.push({ anchor: firstThreeWords(sentence), issue: "Sentence appears incomplete.", suggestion: "Finish the phrase clearly (for example, 'for candid feedback')." });
      }
      if (issues.length >= 2) break;
    }

    while (issues.length < 2) {
      const fallback = sentences[issues.length] || "No clear sentence detected.";
      issues.push({ anchor: firstThreeWords(fallback), issue: "Potential grammar/style issue.", suggestion: "Review punctuation and concision to improve readability." });
    }

    return issues.slice(0, 2);
  }

  function bandToLibrary(rubric) {
    const avg = rubric.reduce((acc, r) => acc + r.score / r.max, 0) / rubric.length;
    if (avg >= 0.9) return "Excellent";
    if (avg >= 0.75) return "Proficient";
    if (avg >= 0.55) return "Fair / Developing";
    return "Needs Improvement";
  }

  function buildReport({ assignmentText, rubricText, meta }) {
    const sentences = splitSentences(assignmentText);
    const instructorScores = parseInstructorScores(rubricText);

    const rubric = RUBRIC.map((item) => {
      const guessed = heuristicScore(item.label, item.max, assignmentText, rubricText);
      const score = Number.isFinite(instructorScores[item.key]) ? instructorScores[item.key] : guessed.score;
      return {
        key: item.key,
        label: item.label,
        max: item.max,
        score,
        band: scoreBand(score, item.max),
        comment: Number.isFinite(instructorScores[item.key])
          ? `${scoreBand(score, item.max)}: ${rubricComment({ label: item.label, score, max: item.max })}`
          : guessed.comment
      };
    });

    const inSubmissionComments = [
      {
        type: "Positive Content",
        sentence: selectSentence(sentences, (s) => /case|issue|turning point|challenge/i.test(s), 0),
        comment: "Strong opening and issue framing in this section. You clearly establish what the case is about and why the problem matters. That clarity gives your analysis a confident start."
      },
      {
        type: "Positive Content",
        sentence: selectSentence(sentences, (s) => /model|theory|transformational|incremental|organizational/i.test(s), 1),
        comment: "You do a good job connecting course concepts to the case context. The analysis moves beyond summary and starts to interpret meaning. Keep building this by adding one more evidence-based explanation." 
      },
      {
        type: "Content Improvement",
        sentence: selectSentence(sentences, (s) => /solution|recommend|should|because|therefore/i.test(s), 2),
        comment: "This point has potential, but it needs deeper justification. Compare at least one alternative so the final recommendation feels fully earned. That extra step will improve critical-thinking alignment with the rubric."
      },
      {
        type: "Feed Forward",
        sentence: selectSentence(sentences, (s) => /conclusion|analysis|this shift|overall/i.test(s), 3),
        comment: "For future submissions, continue this approach and add one stronger source-supported example. That will deepen credibility and make your conclusions more persuasive. You are close to a very strong analytical pattern." 
      },
      {
        type: "APA/Mechanics",
        sentence: selectSentence(sentences, (s) => /reference|citation|apa|source/i.test(s), 4),
        comment: "Your core ideas are clear, and this is a manageable revision area. Make sure each paraphrased idea has an in-text citation and a matching reference entry. That cleanup will strengthen the scholarly polish of your work."
      }
    ].map((item) => ({ ...item, anchor: firstThreeWords(item.sentence) }));

    const pageMinimum = Math.max(1, meta.pageCount);
    const recommendation = `Leave at least ${pageMinimum} substantive in-document comment(s), with roughly 80% content-focused guidance and 20% APA/mechanics guidance.`;

    const rubricDeductions = rubric.filter((r) => r.score < r.max).map((r) => ({
      label: r.label,
      deduction: r.max - r.score,
      comment: rubricComment(r)
    }));

    const gradebookComment = `Hi ${meta.studentName}, strong effort here. You show clear progress in case understanding and concept application, and your analysis has a solid foundation. The key next step is to deepen support for recommendations while tightening APA consistency, which will make your strong ideas even more compelling.`;

    const libraryBand = bandToLibrary(rubric);
    const librarySuggestions = [
      { category: "Executive Summary", text: COMMENT_BANK["Executive Summary"][libraryBand] },
      { category: "Background & Management Issue", text: COMMENT_BANK["Background & Management Issue"][libraryBand] },
      { category: "Analysis Using Course Tools", text: COMMENT_BANK["Analysis Using Course Tools"][libraryBand] },
      { category: "Recommendations", text: COMMENT_BANK["Recommendations"][libraryBand] },
      { category: "APA, Research & Writing Quality", text: COMMENT_BANK["APA, Research & Writing Quality"][libraryBand] }
    ];

    return {
      rubric,
      inSubmissionComments,
      rubricDeductions,
      grammar: extractGrammarIssues(sentences),
      generalImprovement: {
        anchor: firstThreeWords(selectSentence(sentences, (s) => /analysis|structure|transition|paragraph/i.test(s), 5)),
        comment: "Reduce repetition and make each paragraph carry one focused analytical purpose. Then use a transition sentence to connect each section to your final recommendation. This will improve clarity and flow."
      },
      positives: inSubmissionComments.filter((c) => c.type === "Positive Content").map((c) => ({ anchor: c.anchor, comment: c.comment })),
      processChecklist: [
        "Within-submission feedback prepared",
        rubricDeductions.length ? "Rubric deduction comments generated for reduced-score categories" : "No rubric deductions detected",
        "Gradebook summary comment generated",
        `Timeliness reminder: if submitted by Sunday 11:59 p.m. MT, grade by ${nextThursday1159MT(meta.submittedValue)}`
      ],
      gradebookComment,
      recommendation,
      libraryBand,
      librarySuggestions
    };
  }

  function copyBtn(text) {
    return `<button class="cgc-copy" data-copy="${encodeURIComponent(text)}">Copy</button>`;
  }

  function renderReport(report) {
    const rubricHtml = report.rubric.map((item) => `
      <div class="cgc-block">
        <div class="cgc-row"><strong>${item.label}</strong> ${copyBtn(`${item.label} = score: ${item.score}/${item.max} comment: ${item.comment}`)}</div>
        <div>score: <b>${item.score}/${item.max}</b></div>
        <div>comment: ${item.comment}</div>
      </div>`).join("");

    const inSubmissionHtml = report.inSubmissionComments.map((c) =>
      `<li><b>${c.type}</b> [Find: "${c.anchor}"] ${c.comment} ${copyBtn(`${c.type} [${c.anchor}] ${c.comment}`)}</li>`
    ).join("");

    const deductionHtml = report.rubricDeductions.length
      ? report.rubricDeductions.map((d) => `<li><b>${d.label}</b> (-${d.deduction}): ${d.comment} ${copyBtn(`${d.label} deduction: ${d.comment}`)}</li>`).join("")
      : `<li>No deduction comments required because all rubric categories are at full points.</li>`;

    const grammarHtml = report.grammar.map((g) => `<li>[Find: "${g.anchor}"] ${g.issue} ${g.suggestion} ${copyBtn(`[${g.anchor}] ${g.issue} ${g.suggestion}`)}</li>`).join("");
    const positivesHtml = report.positives.map((p) => `<li>[Find: "${p.anchor}"] ${p.comment} ${copyBtn(`[${p.anchor}] ${p.comment}`)}</li>`).join("");
    const checklistHtml = report.processChecklist.map((item) => `<li>${item}</li>`).join("");
    const libraryHtml = report.librarySuggestions.map((item) => `<li><b>${item.category} (${report.libraryBand})</b>: ${item.text} ${copyBtn(`${item.category}: ${item.text}`)}</li>`).join("");
    const quickHitHtml = Object.entries(QUICK_HITS).map(([k, v]) => `<li><b>${k}</b>: ${v} ${copyBtn(`${k}: ${v}`)}</li>`).join("");

    el.results.innerHTML = `
      <div class="cgc-block">
        <strong>CSU Global Protocol Reminder (3 required feedback locations)</strong>
        <ol>
          <li>Within the submission itself</li>
          <li>Rubric comments for any point deductions</li>
          <li>Gradebook / assignment comments area (never blank)</li>
        </ol>
        <div>${report.recommendation}</div>
      </div>

      ${rubricHtml}

      <div class="cgc-block">
        <strong>1) Within Submission: Suggested Annotation Comments</strong>
        <ul>${inSubmissionHtml}</ul>
      </div>

      <div class="cgc-block">
        <strong>2) Rubric: Comments for Point Deductions</strong>
        <ul>${deductionHtml}</ul>
      </div>

      <div class="cgc-block">
        <strong>3) Gradebook/Assignment Comment</strong>
        <div>${report.gradebookComment}</div>
        ${copyBtn(report.gradebookComment)}
      </div>

      <div class="cgc-block">
        <strong>Comment Library Suggestions (${report.libraryBand})</strong>
        <ul>${libraryHtml}</ul>
      </div>

      <div class="cgc-block">
        <strong>Quick-Hit Deduction Comments</strong>
        <ul>${quickHitHtml}</ul>
      </div>

      <div class="cgc-block">
        <strong>2 grammatical/typo errors</strong>
        <ul>${grammarHtml}</ul>
      </div>

      <div class="cgc-block">
        <strong>1 general improvement feedback</strong>
        <div>[Find: "${report.generalImprovement.anchor}"] ${report.generalImprovement.comment} ${copyBtn(`[${report.generalImprovement.anchor}] ${report.generalImprovement.comment}`)}</div>
      </div>

      <div class="cgc-block">
        <strong>3 positive feedback comments</strong>
        <ul>${positivesHtml}</ul>
      </div>

      <div class="cgc-block">
        <strong>Final Practical Checklist Before Submit Assessment</strong>
        <ul>${checklistHtml}</ul>
      </div>
    `;

    el.results.querySelectorAll(".cgc-copy").forEach((btn) => {
      btn.addEventListener("click", () => writeClipboard(decodeURIComponent(btn.getAttribute("data-copy") || "")));
    });
  }

  function formatReport(report) {
    const lines = [];
    lines.push("CSU Global Protocol Reminder:");
    lines.push("1) Within submission feedback");
    lines.push("2) Rubric comments for deductions");
    lines.push("3) Gradebook/assignment comment");
    lines.push(report.recommendation);

    lines.push("\nRubric scores/comments:");
    report.rubric.forEach((r) => lines.push(`- ${r.label} = score: ${r.score}/${r.max} comment: ${r.comment}`));

    lines.push("\nWithin Submission comments:");
    report.inSubmissionComments.forEach((c) => lines.push(`- ${c.type} [${c.anchor}]: ${c.comment}`));

    lines.push("\nRubric deduction comments:");
    if (report.rubricDeductions.length) {
      report.rubricDeductions.forEach((d) => lines.push(`- ${d.label} (-${d.deduction}): ${d.comment}`));
    } else {
      lines.push("- None (all categories at full points).");
    }

    lines.push("\nComment library suggestions:");
    report.librarySuggestions.forEach((s) => lines.push(`- ${s.category} (${report.libraryBand}): ${s.text}`));

    lines.push("\nGradebook comment:");
    lines.push(report.gradebookComment);

    lines.push("\nGrammar/typo notes:");
    report.grammar.forEach((g) => lines.push(`- [${g.anchor}] ${g.issue} ${g.suggestion}`));

    lines.push("\nGeneral improvement:");
    lines.push(`- [${report.generalImprovement.anchor}] ${report.generalImprovement.comment}`);

    lines.push("\nPositive comments:");
    report.positives.forEach((p) => lines.push(`- [${p.anchor}] ${p.comment}`));

    return lines.join("\n");
  }

  async function writeClipboard(text) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const temp = document.createElement("textarea");
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
    }
  }
})();
