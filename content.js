(() => {
  const PANEL_ID = "wolf-grading-assistant";
  const existing = document.getElementById(PANEL_ID);
  if (existing) {
    existing.classList.toggle("wga-hidden");
    return;
  }

  const RUBRIC_ROWS = [
    { key: "requirements", label: "Requirements", max: 15 },
    { key: "content", label: "Content", max: 25 },
    { key: "critical", label: "Critical Analysis", max: 25 },
    { key: "college", label: "Demonstrates college-level proficiency", max: 5 },
    { key: "apa", label: "APA style", max: 5 }
  ];

  const COMMENT_BANK = {
    Requirements: {
      Excellent: [
        "You addressed the assignment components with clear completeness and focus. The submission reflects careful attention to what was asked and keeps the work aligned with expectations. Keep this level of precision in future modules.",
        "This section is fully developed and aligned to required components. You covered each requested element clearly and avoided missing pieces. That consistency strengthens your overall score."
      ],
      Proficient: [
        "You covered most requirements and the overall structure is moving in the right direction. A few components need fuller detail to be fully complete. Tightening those missing pieces will raise this category quickly.",
        "The foundation is solid and most required elements are present. There are a couple of components that are partially developed or too brief. Expanding those sections will improve alignment with the rubric."
      ],
      "Fair / Developing": [
        "Some required components are present, but the section feels uneven in completeness. I can see effort, though several assignment expectations are still underdeveloped. Use the prompt checklist line-by-line before submitting.",
        "You included part of what was required, but key components are still missing or too brief. The next step is to ensure every requested element is clearly addressed. A structured checklist will help close those gaps."
      ],
      "Needs Improvement": [
        "This area needs stronger alignment with assignment requirements. Several required elements are missing or minimally addressed, which limits the score. Rebuild this section directly from prompt requirements to ensure full coverage.",
        "The submission does not yet demonstrate enough required components for this category. I need to see clearer inclusion of the assignment expectations in this section. Center the revision on the requirement list first."
      ],
      "No Submission / Off Topic": [
        "I did not see enough evidence of the required assignment components in this section. Please revise by explicitly addressing each required part from the prompt."
      ]
    },
    Content: {
      Excellent: [
        "Your content knowledge is strong and accurately applied. Explanations are clear, grounded in course ideas, and connected to the assignment focus. This gives the paper strong academic value.",
        "You demonstrate clear mastery of core content in this section. Concepts are explained with confidence and tied well to the task context. Keep using this evidence-based approach."
      ],
      Proficient: [
        "Your content understanding is generally accurate and appropriate. Some areas would benefit from deeper explanation or stronger support. Expanding your reasoning in those spots will strengthen this category.",
        "This section shows solid content knowledge and a workable analytical approach. I would like slightly more depth in a few key explanations. One added example per claim would make this stronger."
      ],
      "Fair / Developing": [
        "There is a workable foundation of content understanding, but depth is limited in places. Some explanations feel generalized and need stronger support. Push further into why your points matter in the case context.",
        "You reference the right ideas, but content development is still uneven. Several claims need stronger detail or source-based support. Strengthening evidence integration will improve the score."
      ],
      "Needs Improvement": [
        "This section currently has major gaps in content development. Key concepts are missing, underexplained, or inconsistently applied. Focus on accurate concept explanation and evidence-supported discussion.",
        "I do not yet see consistent demonstration of content mastery in this section. Ideas need clearer explanation and better alignment to course learning. Rework this section with direct references to course concepts."
      ],
      "No Submission / Off Topic": [
        "I did not see sufficient content evidence for this category. Please revise with stronger course-concept application and clearer explanatory depth."
      ]
    },
    "Critical Analysis": {
      Excellent: [
        "Your critical analysis is thoughtful, logical, and well supported. You evaluate ideas rather than simply describe them, which strengthens decision quality. This is strong analytical work.",
        "This section shows strong interpretation and sound critical thinking. You move beyond summary and explain implications with good judgment. Keep this same analytical depth across all sections."
      ],
      Proficient: [
        "Your analysis is generally logical and directionally strong. To improve, compare alternatives more directly and explain why your chosen direction is strongest. That additional evaluation will boost rigor.",
        "I can see solid analytical effort in this section and a clear line of reasoning. A deeper comparison of options would strengthen your conclusions. Add one trade-off discussion before final recommendations."
      ],
      "Fair / Developing": [
        "There is some analytical thinking present, but depth is still limited. Important claims need clearer evaluation and stronger justification. Push into why your conclusions are preferable over alternatives.",
        "Your interpretation is developing, but several points remain descriptive rather than analytical. Expand your evaluation of consequences and alternatives. That will make your reasoning more convincing."
      ],
      "Needs Improvement": [
        "This section needs much stronger critical analysis. Right now, ideas are largely descriptive and not sufficiently evaluated. Rebuild with explicit comparison, justification, and evidence-based reasoning.",
        "I do not yet see enough analytical depth in this category. Conclusions are present, but supporting evaluation is limited. Focus on alternative analysis and clear justification for your choices."
      ],
      "No Submission / Off Topic": [
        "I did not see meaningful critical analysis for this category. Please revise by adding evaluation, justification, and interpretation of implications."
      ]
    },
    "Demonstrates college-level proficiency": {
      Excellent: [
        "Organization and writing quality are strong in this section. The structure is clear, language is professional, and readability supports your ideas. This reflects college-level proficiency.",
        "Your writing here is polished and logically organized. Sentence and paragraph flow make the analysis easy to follow. Keep this same level of clarity throughout the full submission."
      ],
      Proficient: [
        "The writing is generally organized and understandable. A few transitions or sentence-level edits would improve flow and precision. With light proofreading, this category can move higher.",
        "This section is readable and mostly well structured. Some wording and organization choices can be tightened for stronger clarity. Focus on transition quality and concise sentence design."
      ],
      "Fair / Developing": [
        "The core ideas are present, but writing quality and organization are uneven. I noticed areas where flow and sentence clarity break down. Strengthen paragraph structure and proofread for grammar consistency.",
        "Organization is partially visible, though several parts feel disjointed. Sentence quality and clarity need more revision for college-level polish. A focused editing pass will help significantly."
      ],
      "Needs Improvement": [
        "This area needs substantial revision in organization and writing quality. Clarity issues and structural gaps make the analysis difficult to follow. Reorganize by section purpose and complete a careful proofreading pass.",
        "Writing and structure are currently below expected proficiency for this category. Ideas are difficult to follow due to organization and sentence-level issues. Rebuild flow first, then edit for clarity and correctness."
      ],
      "No Submission / Off Topic": [
        "I did not see sufficient college-level organization/writing evidence for this category. Please revise for clearer structure, sentence quality, and grammatical accuracy."
      ]
    },
    "APA style": {
      Excellent: [
        "APA formatting is handled effectively and supports professional presentation. Citation and reference style are consistent enough to keep focus on your ideas. Nice work maintaining scholarly standards.",
        "This section demonstrates strong APA control and clear source presentation. Citation mechanics do not distract from content. Keep this same consistency in future submissions."
      ],
      Proficient: [
        "APA use is generally on track, with only minor formatting inconsistencies. A quick review of citation-reference alignment will strengthen this category. Your ideas are strong and will stand out more with tighter formatting.",
        "You are close to full-credit APA performance in this section. I noticed small formatting inconsistencies that are easy to correct. Clean up citation details and reference formatting for a polished final result."
      ],
      "Fair / Developing": [
        "There are noticeable APA inconsistencies in citation and/or reference formatting. The core ideas are present, but formatting issues reduce scholarly polish. Use CSU APA resources to standardize style before resubmission.",
        "This section needs more attention to APA detail. I see multiple formatting issues that affect professionalism and consistency. A focused APA cleanup pass will improve this score quickly."
      ],
      "Needs Improvement": [
        "APA style needs substantial revision in this section. Frequent citation/reference errors are limiting the score and clarity of source support. Please use the APA guide and verify every in-text citation against references.",
        "I did not yet see acceptable APA consistency for this category. Formatting and citation issues are significant enough to affect overall quality. Rework this section with strict APA alignment."
      ],
      "No Submission / Off Topic": [
        "I did not see enough APA evidence in this category. Please add accurate citation and reference formatting based on CSU APA guidance."
      ]
    }
  };

  const QUICK_HIT_OPTIONS = {
    Requirements: [
      "Good start here. Tighten this section so all required components are clearly present.",
      "Most required elements are present; add missing components for full alignment."
    ],
    Content: [
      "Your ideas are directionally strong; add deeper support for key claims.",
      "Good foundation. Expand explanation to show stronger concept mastery."
    ],
    "Critical Analysis": [
      "Your reasoning is visible; add one clear alternatives comparison.",
      "Push beyond summary and justify why your recommendation is strongest."
    ],
    "Demonstrates college-level proficiency": [
      "Clear structure overall; strengthen transitions and sentence precision.",
      "Readable draft. A focused editing pass will improve clarity and flow."
    ],
    "APA style": [
      "Good direction. Align all in-text citations with references.",
      "Clean up APA details so your strong ideas read more professionally."
    ]
  };

  const panel = document.createElement("div");
  panel.id = PANEL_ID;
  panel.innerHTML = `
    <div class="wga-header" id="wga-drag-handle">
      <div class="wga-title">WOLF GRADING ASSISTANT</div>
      <div class="wga-header-actions">
        <button class="wga-head-btn" id="wga-min" title="Minimize">−</button>
        <button class="wga-head-btn" id="wga-max" title="Expand">+</button>
        <button class="wga-head-btn" id="wga-close" title="Close">×</button>
      </div>
    </div>
    <div class="wga-body">
      <label for="wga-paste">Paste assignment/rubric text (optional)</label>
      <textarea id="wga-paste" placeholder="Paste student submission + rubric text here, then click Analyze."></textarea>
      <div class="wga-controls">
        <button id="wga-analyze-paste">Analyze Pasted Text</button>
        <button id="wga-clear">Clear</button>
      </div>
      <div id="wga-results"></div>
    </div>
    <button id="wga-open-tab">Open</button>
  `;

  document.body.appendChild(panel);

  const el = {
    panel,
    dragHandle: panel.querySelector("#wga-drag-handle"),
    paste: panel.querySelector("#wga-paste"),
    analyzePaste: panel.querySelector("#wga-analyze-paste"),
    clear: panel.querySelector("#wga-clear"),
    results: panel.querySelector("#wga-results"),
    min: panel.querySelector("#wga-min"),
    max: panel.querySelector("#wga-max"),
    close: panel.querySelector("#wga-close"),
    open: panel.querySelector("#wga-open-tab")
  };

  const state = { report: null, dragging: false, ox: 0, oy: 0 };
  initializePanelPosition();
  initializeDrag();

  el.analyzePaste.addEventListener("click", () => runAnalysis(el.paste.value || getCanvasVisibleText()));
  el.clear.addEventListener("click", () => {
    el.paste.value = "";
    el.results.innerHTML = "";
  });
  el.min.addEventListener("click", () => el.panel.classList.add("wga-minimized"));
  el.max.addEventListener("click", () => el.panel.classList.remove("wga-minimized", "wga-hidden"));
  el.close.addEventListener("click", () => el.panel.classList.add("wga-hidden"));
  el.open.addEventListener("click", () => el.panel.classList.remove("wga-hidden", "wga-minimized"));

  // Auto-analyze current page when summoned.
  runAnalysis(getCanvasVisibleText());

  function initializePanelPosition() {
    const startLeft = Math.max(10, window.innerWidth - 520);
    el.panel.style.left = `${startLeft}px`;
    el.panel.style.top = "16px";
    el.panel.style.right = "auto";
  }

  function initializeDrag() {
    el.dragHandle.addEventListener("mousedown", (ev) => {
      if (ev.target.closest("button")) return;
      state.dragging = true;
      const rect = el.panel.getBoundingClientRect();
      state.ox = ev.clientX - rect.left;
      state.oy = ev.clientY - rect.top;
      el.panel.classList.add("wga-dragging");
      ev.preventDefault();
    });

    window.addEventListener("mousemove", (ev) => {
      if (!state.dragging) return;
      const maxLeft = Math.max(0, window.innerWidth - el.panel.offsetWidth);
      const maxTop = Math.max(0, window.innerHeight - 40);
      const left = Math.min(maxLeft, Math.max(0, ev.clientX - state.ox));
      const top = Math.min(maxTop, Math.max(0, ev.clientY - state.oy));
      el.panel.style.left = `${left}px`;
      el.panel.style.top = `${top}px`;
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
        if (node.innerText && node.innerText.length > 200) return node.innerText;
      } catch {
        continue;
      }
    }
    return document.body.innerText || "";
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

  function pick(arr, seed) {
    if (!arr?.length) return "";
    return arr[Math.abs(seed) % arr.length];
  }

  function hashText(t) {
    let h = 0;
    for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0;
    return h;
  }

  function extractMeta(raw) {
    const lines = raw.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    let firstName = "Student";
    for (const line of lines.slice(0, 20)) {
      const m = line.match(/^([A-Z][a-z]+)\s+[A-Z][a-z]+/);
      if (m) {
        firstName = m[1];
        break;
      }
    }
    const pages = [...raw.matchAll(/Page\s+\d+\s+of\s+(\d+)/gi)].map((m) => Number(m[1]));
    return { firstName, pageCount: pages.length ? Math.max(...pages) : 1 };
  }

  function parseRubricScores(raw) {
    const lines = raw.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const rows = [];

    for (let i = 0; i < lines.length; i++) {
      if (/^Criterion Score$/i.test(lines[i]) && i + 2 < lines.length) {
        const score = Number((lines[i + 1] || "").replace(/[^\d]/g, ""));
        const maxMatch = (lines[i + 2] || "").match(/\/?\s*(\d+)\s*pts?/i);
        const max = maxMatch ? Number(maxMatch[1]) : 0;

        let label = "Criterion";
        for (let j = i - 1; j >= Math.max(0, i - 25); j--) {
          const s = lines[j];
          if (/Comment|Selected|Meets Expectation|Approaches Expectation|Below Expectation|Limited Evidence|Criteria|Ratings|Points/i.test(s)) continue;
          if (/\d+\s+to\s*>\d+\s+pts?/i.test(s)) continue;
          if (s.length > 2) {
            label = s;
            break;
          }
        }
        if (max > 0) rows.push({ label, score, max });
      }
    }

    if (rows.length >= 3) return rows;
    return RUBRIC_ROWS.map((r) => ({ label: r.label, score: Math.round(r.max * 0.75), max: r.max }));
  }

  function mapToStandardLabel(label) {
    const l = label.toLowerCase();
    if (/requirement/i.test(l)) return "Requirements";
    if (/content/i.test(l)) return "Content";
    if (/critical/i.test(l)) return "Critical Analysis";
    if (/college|organization|grammar|style/i.test(l)) return "Demonstrates college-level proficiency";
    if (/apa/i.test(l)) return "APA style";
    return label;
  }

  function band(score, max) {
    const p = max ? score / max : 0;
    if (score === 0) return "No Submission / Off Topic";
    if (p >= 0.9) return "Excellent";
    if (p >= 0.75) return "Proficient";
    if (p >= 0.55) return "Fair / Developing";
    return "Needs Improvement";
  }

  function scoreColor(score, max) {
    if (score === 0 || max === 0) return "#b00020";
    const hue = Math.round((score / max) * 120);
    return `hsl(${hue} 80% 35%)`;
  }

  function commentFor(label, b, paperText, firstName) {
    const std = mapToStandardLabel(label);
    const options = COMMENT_BANK[std]?.[b] || COMMENT_BANK[std]?.Proficient || ["You are progressing in this category and should keep developing depth."];

    const seed = hashText(`${paperText.slice(0, 300)}|${std}|${b}`);
    let text = pick(options, seed);

    if (/Critical Analysis/.test(std) && /recommend/i.test(paperText) && !/alternative/i.test(paperText)) {
      text += " I recommend adding one short comparison of alternatives to show why your final choice is strongest.";
    }
    if (/APA style/.test(std) && !/\(.*?,\s*\d{4}\)/.test(paperText)) {
      text += " I also recommend adding consistent in-text citations where ideas are paraphrased.";
    }

    return `${firstName}, ${text}`;
  }

  function submissionComments(sentences, pageCount, firstName, text) {
    const templates = [
      "${name}, strong opening move in this section. You clearly introduce the key point and give the reader useful direction. Keep this clarity while expanding support in the next paragraph.",
      "${name}, you are using relevant ideas here, and the structure is promising. Add one specific example or evidence line to strengthen your claim. That extra support will improve credibility.",
      "${name}, this is a good analytical start. To deepen the section, compare at least one alternative before finalizing your recommendation. That comparison will strengthen your critical-thinking impact.",
      "${name}, your writing voice is clear and readable in this section. Tightening transitions between paragraphs will make your argument flow more smoothly. Keep the same focused tone as you revise.",
      "${name}, this point is useful and directionally correct. Push one step deeper into why this idea matters for outcomes. That will improve both depth and persuasiveness."
    ];

    const needed = Math.max(3, pageCount * 3);
    const comments = [];
    const baseSeed = hashText(text);
    for (let i = 0; i < needed; i++) {
      const sentence = sentences[i % Math.max(1, sentences.length)] || "";
      const t = pick(templates, baseSeed + i).replaceAll("${name}", firstName);
      comments.push({ anchor: firstThreeWords(sentence), comment: t });
    }
    return comments;
  }

  function grammarComments(sentences, firstName) {
    const out = [];
    for (const s of sentences) {
      if (/\b(\w+)\s+\1\b/i.test(s)) {
        out.push({ anchor: firstThreeWords(s), comment: `${firstName}, this sentence appears to repeat a word. Remove the duplicate and reread for smoother flow.` });
      }
      if (/\badjustments\s+an\s+adjustment\b/i.test(s)) {
        out.push({ anchor: firstThreeWords(s), comment: `${firstName}, this phrase is duplicated and reads awkwardly. Revise it to one concise expression for clarity.` });
      }
      if (out.length >= 2) break;
    }
    while (out.length < 2) {
      const fallback = sentences[out.length] || "No clear sentence detected.";
      out.push({ anchor: firstThreeWords(fallback), comment: `${firstName}, this sentence would benefit from a quick grammar and punctuation review. A concise rewrite will improve readability.` });
    }
    return out;
  }

  function buildReport(text) {
    const meta = extractMeta(text);
    const sentences = splitSentences(text);
    const rubricRaw = parseRubricScores(text);

    const rubric = rubricRaw.map((r) => {
      const standardLabel = mapToStandardLabel(r.label);
      const b = band(r.score, r.max);
      return {
        label: standardLabel,
        score: r.score,
        max: r.max,
        scoreColor: scoreColor(r.score, r.max),
        comment: commentFor(standardLabel, b, text, meta.firstName)
      };
    });

    return {
      meta,
      rubric,
      within: submissionComments(sentences, meta.pageCount, meta.firstName, text),
      grammar: grammarComments(sentences, meta.firstName)
    };
  }

  function runAnalysis(raw) {
    const text = normalizeSpace(raw || "");
    if (!text) {
      el.results.innerHTML = `<p class="wga-error">No readable text found. Paste text and click Analyze.</p>`;
      return;
    }

    state.report = buildReport(text);
    render(state.report);
  }

  function dropdownQuickHit(label, firstName) {
    const options = QUICK_HIT_OPTIONS[label] || ["Good start here. Continue deepening your explanation."];
    const optionsHtml = options.map((o, idx) => `<option value="${encodeURIComponent(`${firstName}, ${o}`)}">${idx + 1}. ${o}</option>`).join("");
    return `
      <details class="wga-quickhit">
        <summary>Quick-Hit Options</summary>
        <div class="wga-quickhit-inner">
          <select class="wga-select">${optionsHtml}</select>
          <button class="wga-copy-select">Copy</button>
        </div>
      </details>
    `;
  }

  function render(report) {
    const rubricCards = report.rubric.map((r) => `
      <div class="wga-block">
        <div class="wga-row">
          <strong>${r.label}</strong>
          <button class="wga-copy" data-copy="${encodeURIComponent(r.comment)}">Copy</button>
        </div>
        <div class="wga-score" style="color:${r.scoreColor}"><b>SCORE:</b> ${r.score}/${r.max}</div>
        <div><b>COMMENT:</b> <span class="wga-highlight">${r.comment}</span></div>
        ${dropdownQuickHit(r.label, report.meta.firstName)}
      </div>
    `).join("");

    const within = report.within.map((c) => `
      <li>
        [Find: <span class="wga-find">${c.anchor}</span>]
        <div><b>COMMENT:</b> <span class="wga-highlight">${c.comment}</span></div>
        <div class="wga-mini-actions">
          <button class="wga-copy" data-copy="${encodeURIComponent(c.anchor)}">Copy</button>
          <button class="wga-copy" data-copy="${encodeURIComponent(c.comment)}">Copy</button>
        </div>
      </li>
    `).join("");

    const grammar = report.grammar.map((g) => `
      <li>
        [Find: <span class="wga-find">${g.anchor}</span>]
        <div><b>COMMENT:</b> <span class="wga-highlight">${g.comment}</span></div>
        <div class="wga-mini-actions">
          <button class="wga-copy" data-copy="${encodeURIComponent(g.anchor)}">Copy</button>
          <button class="wga-copy" data-copy="${encodeURIComponent(g.comment)}">Copy</button>
        </div>
      </li>
    `).join("");

    el.results.innerHTML = `
      ${rubricCards}

      <div class="wga-block">
        <strong>1) Within Submission Comments (minimum 3 per page)</strong>
        <ul>${within}</ul>
      </div>

      <div class="wga-block">
        <strong>2 grammatical/typo comments</strong>
        <ul>${grammar}</ul>
      </div>
    `;

    el.results.querySelectorAll(".wga-copy").forEach((btn) => {
      btn.addEventListener("click", () => writeClipboard(decodeURIComponent(btn.getAttribute("data-copy") || "")));
    });

    el.results.querySelectorAll(".wga-copy-select").forEach((btn) => {
      btn.addEventListener("click", () => {
        const select = btn.parentElement.querySelector(".wga-select");
        if (!select) return;
        writeClipboard(decodeURIComponent(select.value || ""));
      });
    });
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
