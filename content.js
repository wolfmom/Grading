(() => {
  const PANEL_ID = "wolf-grading-assistant";
  if (document.getElementById(PANEL_ID)) return;

  const DEFAULT_RUBRIC = [
    { key: "understanding", label: "Understanding of Case & Key Issues", max: 30 },
    { key: "application", label: "Application of Business Concepts & Theories", max: 30 },
    { key: "critical", label: "Critical Thinking & Problem-Solving", max: 20 },
    { key: "organization", label: "Organization & Structure", max: 10 },
    { key: "apa", label: "APA Formatting & Citations", max: 10 }
  ];

  const CATEGORY_BANK = {
    "Executive Summary": {
      "Excellent": "Strong opening here. Your executive summary gives a clear, concise snapshot of the company and the central issue. It also points the reader toward your recommendations in a professional way.",
      "Proficient": "You are on the right track here and the main direction is visible. A few details could be sharper so the issue and recommendation path are even clearer. Tightening specificity will strengthen this section quickly.",
      "Fair / Developing": "This section gives a general overview, but it still feels broad in places. I need a tighter summary of the company, issue, and where your analysis is going. Focus on clarity and purpose in each sentence.",
      "Needs Improvement": "This section is too vague to function as a strong executive summary. I need a clearer snapshot of the company, core issue, and direction of recommendations. Think of this as a short briefing for a busy decision-maker.",
      "No Submission / Off Topic": "I did not see a usable executive summary here. This section should briefly summarize the company, central issue, and recommendation direction."
    },
    "Background & Management Issue": {
      "Excellent": "You provide a strong company overview and identify a relevant management issue clearly. I can tell what the problem is and why it matters. This gives your analysis a strong foundation.",
      "Proficient": "Your background explanation is generally clear and the issue is identifiable. I would like slightly stronger justification for why this is the central management problem. Add one more concrete link to the case context.",
      "Fair / Developing": "You provide some background, but the management issue is still underdeveloped. I can see your direction, though I need clearer justification for why this issue deserves priority. Add evidence that supports your focus.",
      "Needs Improvement": "This section needs clearer framing and stronger issue definition. The background is limited and the management problem is not yet well connected to the case. Slow down and define one focused issue clearly.",
      "No Submission / Off Topic": "I did not see a clear company background or defined management issue in this section. Both are needed before the analysis can fully develop."
    },
    "Analysis Using Course Tools": {
      "Excellent": "This is a strong analytical section with effective use of course tools. You apply concepts to deepen interpretation rather than just naming frameworks. The case connections are clear and meaningful.",
      "Proficient": "You applied the course tools appropriately and your understanding is visible. The next step is depth, because some links are brief. Spend more time showing how each tool explains the issue.",
      "Fair / Developing": "Relevant tools are referenced, but the analysis remains limited. Right now the tools are mentioned more than fully used. Push further into why and how each tool changes interpretation.",
      "Needs Improvement": "This section needs stronger use of course tools. The tools are minimally or inconsistently applied, which weakens analysis depth. Focus on correct tool selection and explicit case application.",
      "No Submission / Off Topic": "I did not see meaningful use of course tools here. This section should demonstrate how frameworks help analyze the management issue."
    },
    "Recommendations": {
      "Excellent": "Your recommendations are practical, actionable, and aligned with your analysis. They feel realistic and not generic. This section shows strong judgment and clear solution fit.",
      "Proficient": "Your recommendations are generally appropriate and directionally sound. They would be stronger with deeper justification linked to analysis. Tie each recommendation to a specific finding.",
      "Fair / Developing": "You offer recommendations, but they remain somewhat general or lightly supported. I can follow your intent, but I need stronger explanation for why these are the best next steps. Add direct evidence support.",
      "Needs Improvement": "These recommendations are too broad or insufficiently supported for the issue presented. Each recommendation should be specific, realistic, and clearly tied to analysis findings. Strengthen that alignment.",
      "No Submission / Off Topic": "I did not see 3–5 actionable recommendations in this section. This part should convert analysis into realistic next steps."
    },
    "APA, Research & Writing Quality": {
      "Excellent": "Your writing is clear, professional, and easy to follow. Source support is used effectively and APA is handled well overall. This polished presentation helps your ideas come through with confidence.",
      "Proficient": "You are on the right track and the writing is generally clear. Sources support your claims, though there are minor APA or style issues to clean up. Fixing those details will strengthen polish.",
      "Fair / Developing": "Your core thinking is present, but writing mechanics and APA consistency need attention. I noticed citation or clarity issues that reduce overall impact. Proofread carefully and verify citation-reference alignment.",
      "Needs Improvement": "This area needs significant improvement in research support and/or APA consistency. Writing and formatting issues are making ideas harder to follow. Please use Writing Center and APA resources before the next submission.",
      "No Submission / Off Topic": "I did not see the required level of research and writing quality here. The assignment needs credible sources, APA formatting, and clearer academic writing."
    }
  };

  const QUICK_HITS = {
    "Executive Summary": "Good start here. Tighten this section so the company, issue, and recommendation path are immediately clear.",
    "Background & Management Issue": "I can see the issue, but I’d like a little more justification for why this is the core management problem.",
    "Analysis Using Course Tools": "You named the right tools; now show how they actually explain the case in deeper detail.",
    "Recommendations": "These recommendations are reasonable, but they need a little more direct support from your analysis.",
    "APA, Research & Writing Quality": "The ideas are strong. The next step is to clean up APA and source integration for a more polished result."
  };

  const root = document.createElement("div");
  root.id = PANEL_ID;
  root.innerHTML = `
    <div class="wga-header" id="wga-drag-handle">
      <div class="wga-title">WOLF GRADING ASSISTANT</div>
      <div class="wga-header-actions">
        <button class="wga-head-btn" id="wga-min" title="Minimize">−</button>
        <button class="wga-head-btn" id="wga-max" title="Expand">+</button>
        <button class="wga-head-btn" id="wga-close" title="Close">×</button>
      </div>
    </div>
    <div class="wga-body">
      <div class="wga-controls">
        <button id="wga-analyze-page">Analyze Open Page</button>
        <button id="wga-analyze-paste">Analyze Pasted Text</button>
      </div>
      <label for="wga-paste">Paste assignment/rubric text (optional)</label>
      <textarea id="wga-paste" placeholder="Paste student submission + rubric + assignment details if needed."></textarea>
      <div class="wga-controls">
        <button id="wga-copy-all">Copy Full Report</button>
        <button id="wga-clear">Clear</button>
      </div>
      <div id="wga-results"></div>
    </div>
    <button id="wga-open-tab">Open Grader</button>
  `;
  document.body.appendChild(root);

  const el = {
    panel: root,
    dragHandle: root.querySelector("#wga-drag-handle"),
    results: root.querySelector("#wga-results"),
    paste: root.querySelector("#wga-paste"),
    min: root.querySelector("#wga-min"),
    max: root.querySelector("#wga-max"),
    close: root.querySelector("#wga-close"),
    openTab: root.querySelector("#wga-open-tab"),
    analyzePage: root.querySelector("#wga-analyze-page"),
    analyzePaste: root.querySelector("#wga-analyze-paste"),
    copyAll: root.querySelector("#wga-copy-all"),
    clear: root.querySelector("#wga-clear")
  };

  const state = { report: null, dragging: false, offsetX: 0, offsetY: 0 };
  initializePanelPosition();
  initializeDrag();

  el.analyzePage.addEventListener("click", () => runAnalysis(getCanvasVisibleText()));
  el.analyzePaste.addEventListener("click", () => runAnalysis(el.paste.value));
  el.copyAll.addEventListener("click", () => state.report && writeClipboard(formatReport(state.report)));
  el.clear.addEventListener("click", () => {
    state.report = null;
    el.results.innerHTML = "";
    el.paste.value = "";
  });

  el.min.addEventListener("click", () => el.panel.classList.add("wga-minimized"));
  el.max.addEventListener("click", () => {
    el.panel.classList.remove("wga-minimized", "wga-hidden");
  });
  el.close.addEventListener("click", () => el.panel.classList.add("wga-hidden"));
  el.openTab.addEventListener("click", () => {
    el.panel.classList.remove("wga-hidden", "wga-minimized");
  });

  function initializePanelPosition() {
    const startLeft = Math.max(10, window.innerWidth - 520);
    el.panel.style.left = `${startLeft}px`;
    el.panel.style.top = "16px";
    el.panel.style.right = "auto";
  }

  function initializeDrag() {
    el.dragHandle.addEventListener("mousedown", (event) => {
      if (event.target.closest("button")) return;
      state.dragging = true;
      const rect = el.panel.getBoundingClientRect();
      state.offsetX = event.clientX - rect.left;
      state.offsetY = event.clientY - rect.top;
      el.panel.classList.add("wga-dragging");
      event.preventDefault();
    });

    window.addEventListener("mousemove", (event) => {
      if (!state.dragging) return;
      const maxLeft = Math.max(0, window.innerWidth - el.panel.offsetWidth);
      const maxTop = Math.max(0, window.innerHeight - 40);
      const nextLeft = Math.min(maxLeft, Math.max(0, event.clientX - state.offsetX));
      const nextTop = Math.min(maxTop, Math.max(0, event.clientY - state.offsetY));
      el.panel.style.left = `${nextLeft}px`;
      el.panel.style.top = `${nextTop}px`;
      el.panel.style.right = "auto";
    });

    window.addEventListener("mouseup", () => {
      state.dragging = false;
      el.panel.classList.remove("wga-dragging");
    });
  }

  function normalizeSpace(text) {
    return (text || "").replace(/\s{2,}/g, " ").trim();
  }

  function getCanvasVisibleText() {
    const targets = [document.querySelector("#content"), document.querySelector(".docviewer"), document.querySelector("iframe"), document.body].filter(Boolean);
    for (const node of targets) {
      try {
        if (node.tagName === "IFRAME" && node.contentDocument?.body?.innerText) return node.contentDocument.body.innerText;
        if (node.innerText && node.innerText.trim().length > 200) return node.innerText;
      } catch {
        continue;
      }
    }
    return document.body.innerText || "";
  }

  function extractAssignmentText(raw) {
    const marker = /Case Study Analysis Rubric|Criteria\s+Ratings\s+Points|Assessment\s+Grade out of 100|Module\s+\d+:\s+Critical Thinking/i;
    const parts = raw.split(marker);
    const candidate = parts[0] && parts[0].length > 250 ? parts[0] : raw;
    return normalizeSpace(candidate.replace(/Page\s+\d+\s+of\s+\d+/gi, ""));
  }

  function extractRubricText(raw) {
    const start = raw.search(/Case Study Analysis Rubric|Module\s+\d+:\s+Critical Thinking|Criteria\s+Ratings\s+Points/i);
    return start < 0 ? "" : normalizeSpace(raw.slice(start));
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

  function extractMeta(raw) {
    const lines = raw.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    let studentName = "Student";
    for (const line of lines.slice(0, 16)) {
      const m = line.match(/^([A-Z][a-z]+)\s+([A-Z][a-z]+)(\s+\d{1,2}\/\d{1,2}\/\d{2,4})?$/);
      if (m) {
        studentName = `${m[1]} ${m[2]}`;
        break;
      }
    }
    const firstName = studentName.split(" ")[0] || "Student";
    const pages = [...raw.matchAll(/Page\s+\d+\s+of\s+(\d+)/gi)].map((m) => Number(m[1]));
    return { studentName, firstName, pageCount: pages.length ? Math.max(...pages) : 1 };
  }

  function parseDynamicRubricRows(rubricText) {
    if (!rubricText) return [];
    const lines = rubricText.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const rows = [];

    for (let i = 0; i < lines.length; i++) {
      if (/^Criterion Score$/i.test(lines[i]) && i + 2 < lines.length) {
        const score = Number((lines[i + 1] || "").replace(/[^\d]/g, ""));
        const maxMatch = (lines[i + 2] || "").match(/\/?\s*(\d+)\s*pts?/i);
        const max = maxMatch ? Number(maxMatch[1]) : 0;
        let label = "Criterion";
        for (let j = i - 1; j >= Math.max(0, i - 25); j--) {
          if (/^Comment$/i.test(lines[j])) continue;
          if (/Selected|Meets Expectation|Approaches Expectation|Below Expectation|Limited Evidence/i.test(lines[j])) continue;
          if (/\d+\s+to\s*>\d+\s+pts?/i.test(lines[j])) continue;
          if (lines[j].length > 3 && !/^Criteria|Ratings|Points$/i.test(lines[j])) {
            label = lines[j];
            break;
          }
        }
        if (max > 0) rows.push({ key: `dyn_${rows.length + 1}`, label, score, max });
      }
    }
    return rows;
  }

  function scoreBand(score, max) {
    const pct = max === 0 ? 0 : score / max;
    if (pct >= 0.9) return "Excellent";
    if (pct >= 0.75) return "Proficient";
    if (pct >= 0.55) return "Fair / Developing";
    if (score === 0) return "No Submission / Off Topic";
    return "Needs Improvement";
  }

  function keywordCount(text, words) {
    const lc = text.toLowerCase();
    return words.reduce((acc, w) => acc + (lc.includes(w) ? 1 : 0), 0);
  }

  function heuristicRubric(defaultRows, assignmentText) {
    const sentences = splitSentences(assignmentText).length;
    return defaultRows.map((row) => {
      let raw = 0;
      const words = assignmentText.toLowerCase();
      if (/understanding|requirements|background/i.test(row.label)) raw = 8 + keywordCount(words, ["issue", "case", "problem", "context", "leadership"]) * 2 + Math.floor(sentences / 10);
      else if (/application|content|tools|concept/i.test(row.label)) raw = 8 + keywordCount(words, ["theory", "model", "framework", "analysis", "leadership"]) * 2;
      else if (/critical|recommend/i.test(row.label)) raw = 6 + keywordCount(words, ["recommend", "alternative", "because", "evidence", "solution"]) * 2;
      else if (/organization|writing|grammar|style/i.test(row.label)) raw = 4 + keywordCount(words, ["introduction", "conclusion", "transition"]) * 1;
      else if (/apa|citation|research/i.test(row.label)) raw = 3 + keywordCount(words, ["citation", "reference", "apa", "source"]) * 2;
      else raw = Math.floor(row.max * 0.75);

      const score = Math.max(0, Math.min(row.max, Math.round(raw)));
      return { ...row, score };
    });
  }

  function mapLabelToBank(label) {
    const l = label.toLowerCase();
    if (/executive summary/.test(l)) return "Executive Summary";
    if (/background|management issue|requirements/.test(l)) return "Background & Management Issue";
    if (/course tools|analysis|content|critical/.test(l)) return "Analysis Using Course Tools";
    if (/recommend/.test(l)) return "Recommendations";
    if (/apa|research|writing|grammar|style/.test(l)) return "APA, Research & Writing Quality";
    return "Analysis Using Course Tools";
  }

  function rubricCommentFor(label, band) {
    const bankCat = mapLabelToBank(label);
    const selected = CATEGORY_BANK[bankCat][band] || CATEGORY_BANK[bankCat]["Proficient"];
    return selected;
  }

  function scoreColor(score, max) {
    if (max === 0 || score === 0) return "#b00020";
    const pct = score / max;
    const hue = Math.round(0 + pct * 120); // red to green
    return `hsl(${hue} 80% 35%)`;
  }

  function makeCopyComment(firstName, commentText) {
    return `${firstName}, ${commentText}`;
  }

  function selectSentence(sentences, matcher, fallback = 0) {
    return sentences.find((s) => matcher(s.toLowerCase())) || sentences[fallback] || "";
  }

  function generateSubmissionComments(sentences, pageCount, firstName) {
    const base = [
      {
        type: "Positive Content",
        sentence: selectSentence(sentences, (s) => /issue|challenge|problem|purpose/.test(s), 0),
        comment: `${firstName}, strong issue framing in this section. You identify an important direction and give the reader a clear starting point. Keep this same clarity as you move into deeper analysis.`
      },
      {
        type: "Concept Application",
        sentence: selectSentence(sentences, (s) => /theory|model|framework|leadership|analysis/.test(s), 1),
        comment: `${firstName}, this concept connection is moving in the right direction. Push one step deeper by tying the concept to a very specific case fact. That stronger link will make your argument more convincing.`
      },
      {
        type: "Feed Forward",
        sentence: selectSentence(sentences, (s) => /conclusion|overall|recommend|therefore/.test(s), 2),
        comment: `${firstName}, for your next assignment, keep this structure but compare at least one alternative before your final recommendation. That habit will strengthen your critical thinking score. You are very close to a stronger evaluation pattern.`
      },
      {
        type: "APA/Mechanics",
        sentence: selectSentence(sentences, (s) => /citation|reference|source|apa/.test(s), 3),
        comment: `${firstName}, this is a good draft and your ideas are clear. Please make sure each paraphrased claim has an in-text citation and a matching reference entry. That revision will improve the scholarly polish of your paper.`
      }
    ];

    const needed = Math.max(3, pageCount * 3);
    const comments = [];
    for (let i = 0; i < needed; i++) {
      const item = base[i % base.length];
      comments.push({ ...item, anchor: firstThreeWords(item.sentence || "") });
    }
    return comments;
  }

  function extractGrammarIssues(sentences, firstName) {
    const issues = [];
    for (const s of sentences) {
      if (/\b(\w+)\s+\1\b/i.test(s)) {
        issues.push({ anchor: firstThreeWords(s), comment: `${firstName}, this sentence appears to repeat a word. Remove the duplicated word and reread the line for smoother flow.` });
      }
      if (/\badjustments\s+an\s+adjustment\b/i.test(s)) {
        issues.push({ anchor: firstThreeWords(s), comment: `${firstName}, this phrase is currently duplicated and reads awkwardly. Revise it to one concise phrase so the sentence is cleaner and clearer.` });
      }
      if (issues.length >= 2) break;
    }
    while (issues.length < 2) {
      const fallback = sentences[issues.length] || "No clear sentence detected.";
      issues.push({ anchor: firstThreeWords(fallback), comment: `${firstName}, this sentence would benefit from a quick grammar and clarity review. Tightening punctuation and wording will improve readability.` });
    }
    return issues;
  }

  function buildReport({ assignmentText, rubricText, meta }) {
    const sentences = splitSentences(assignmentText);
    const dynamic = parseDynamicRubricRows(rubricText);
    const rubricRows = dynamic.length >= 2 ? dynamic : heuristicRubric(DEFAULT_RUBRIC, assignmentText);

    const rubric = rubricRows.map((row) => {
      const band = scoreBand(row.score, row.max);
      const comment = rubricCommentFor(row.label, band);
      return { ...row, band, comment, scoreColor: scoreColor(row.score, row.max) };
    });

    const withinSubmission = generateSubmissionComments(sentences, meta.pageCount, meta.firstName);
    const grammar = extractGrammarIssues(sentences, meta.firstName);

    const quickBank = rubric.map((r) => ({ category: mapLabelToBank(r.label), comment: QUICK_HITS[mapLabelToBank(r.label)] || QUICK_HITS["Analysis Using Course Tools"] }));

    return {
      meta,
      rubric,
      withinSubmission,
      grammar,
      generalImprovement: `${meta.firstName}, your analysis has a solid start and clear intent. The next step is to reduce repetition and make each paragraph focus on one analytical purpose. Strong transitions between paragraphs will make your final argument much more persuasive.`,
      quickBank,
      gradebookComment: `Hi ${meta.firstName}, thank you for your submission. I can see effort and progress in your analysis, especially in your attempt to connect ideas to course concepts. For your next submission, focus on deeper evidence support and cleaner APA consistency so your strongest ideas stand out even more clearly.`
    };
  }

  function runAnalysis(rawInput) {
    const raw = (rawInput || "").trim();
    if (!raw) {
      el.results.innerHTML = `<p class="wga-error">No text found. Paste text or open a Canvas page with visible submission content.</p>`;
      return;
    }

    const assignmentText = extractAssignmentText(raw);
    const rubricText = extractRubricText(raw);
    const meta = extractMeta(raw);
    const report = buildReport({ assignmentText, rubricText, meta });
    state.report = report;
    renderReport(report);
  }

  function renderReport(report) {
    const rubricHtml = report.rubric.map((item) => {
      const copyComment = makeCopyComment(report.meta.firstName, item.comment);
      return `
        <div class="wga-block">
          <div class="wga-row">
            <strong>${item.label}</strong>
            <button class="wga-copy" data-copy="${encodeURIComponent(copyComment)}">Copy Comment</button>
          </div>
          <div class="wga-score" style="color:${item.scoreColor}"><b>SCORE:</b> ${item.score}/${item.max}</div>
          <div><b>COMMENT:</b> <span class="wga-highlight">${item.comment}</span></div>
        </div>`;
    }).join("");

    const submissionHtml = report.withinSubmission.map((c) => {
      const copyComment = c.comment;
      const copyFind = c.anchor;
      return `
        <li>
          <b>${c.type}</b> [Find: <span class="wga-find">${c.anchor}</span>] 
          <div class="wga-comment-line"><b>COMMENT:</b> <span class="wga-highlight">${c.comment}</span></div>
          <div class="wga-mini-actions">
            <button class="wga-copy" data-copy="${encodeURIComponent(copyFind)}">Copy Find Words</button>
            <button class="wga-copy" data-copy="${encodeURIComponent(copyComment)}">Copy Comment</button>
          </div>
        </li>`;
    }).join("");

    const grammarHtml = report.grammar.map((g) => `
      <li>
        [Find: <span class="wga-find">${g.anchor}</span>]
        <div class="wga-comment-line"><b>COMMENT:</b> <span class="wga-highlight">${g.comment}</span></div>
        <div class="wga-mini-actions">
          <button class="wga-copy" data-copy="${encodeURIComponent(g.anchor)}">Copy Find Words</button>
          <button class="wga-copy" data-copy="${encodeURIComponent(g.comment)}">Copy Comment</button>
        </div>
      </li>`).join("");

    const quickBankHtml = report.quickBank.map((q) => `
      <li>
        <b>${q.category}</b>
        <div class="wga-comment-line"><b>COMMENT:</b> <span class="wga-highlight">${q.comment}</span></div>
        <button class="wga-copy" data-copy="${encodeURIComponent(`${report.meta.firstName}, ${q.comment}`)}">Copy Comment</button>
      </li>`).join("");

    el.results.innerHTML = `
      <div class="wga-block">
        <strong>Rubric Scores + Comments</strong>
        <div>This section now includes score and comments together, so there is no separate deduction section.</div>
      </div>

      ${rubricHtml}

      <div class="wga-block">
        <strong>1) Within Submission Comments (minimum 3 per page)</strong>
        <ul>${submissionHtml}</ul>
      </div>

      <div class="wga-block">
        <strong>Quick-Hit Comment Bank (auto-appropriate)</strong>
        <ul>${quickBankHtml}</ul>
      </div>

      <div class="wga-block">
        <strong>2 grammatical/typo comments</strong>
        <ul>${grammarHtml}</ul>
      </div>

      <div class="wga-block">
        <strong>General Improvement</strong>
        <div class="wga-comment-line"><b>COMMENT:</b> <span class="wga-highlight">${report.generalImprovement}</span></div>
        <button class="wga-copy" data-copy="${encodeURIComponent(report.generalImprovement)}">Copy Comment</button>
      </div>

      <div class="wga-block">
        <strong>Gradebook / Assignment Comment</strong>
        <div class="wga-comment-line"><b>COMMENT:</b> <span class="wga-highlight">${report.gradebookComment}</span></div>
        <button class="wga-copy" data-copy="${encodeURIComponent(report.gradebookComment)}">Copy Comment</button>
      </div>
    `;

    el.results.querySelectorAll(".wga-copy").forEach((btn) => {
      btn.addEventListener("click", () => writeClipboard(decodeURIComponent(btn.getAttribute("data-copy") || "")));
    });
  }

  function formatReport(report) {
    const lines = [];
    report.rubric.forEach((r) => lines.push(`${r.label} | SCORE: ${r.score}/${r.max} | COMMENT: ${r.comment}`));
    report.withinSubmission.forEach((c) => lines.push(`Find: ${c.anchor} | COMMENT: ${c.comment}`));
    report.grammar.forEach((g) => lines.push(`Find: ${g.anchor} | COMMENT: ${g.comment}`));
    lines.push(`General Improvement: ${report.generalImprovement}`);
    lines.push(`Gradebook: ${report.gradebookComment}`);
    return lines.join("\n");
  }

  async function writeClipboard(text) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
  }
})();
