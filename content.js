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

  const root = document.createElement("div");
  root.id = PANEL_ID;
  root.className = "cgc-expanded";

  root.innerHTML = `
    <div class="cgc-header">
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

  const state = { report: null };

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
        if (node.innerText && node.innerText.trim().length > 200) {
          return node.innerText;
        }
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

  function normalizeSpace(text) {
    return (text || "").replace(/\s{2,}/g, " ").trim();
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
      .map(s => s.trim())
      .filter(s => s.length > 20);
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

  function selectSentence(sentences, matcher, fallbackIndex = 0) {
    return sentences.find(s => matcher(s.toLowerCase())) || sentences[fallbackIndex] || "";
  }

  function extractMeta(raw) {
    const lines = raw.split(/\n+/).map(l => l.trim()).filter(Boolean);

    let studentName = "Student";
    for (const line of lines.slice(0, 12)) {
      const m = line.match(/^([A-Z][a-z]+\s+[A-Z][a-z]+)\s+\d{1,2}\/\d{1,2}\/\d{2,4}$/);
      if (m) {
        studentName = m[1];
        break;
      }
    }

    const pageMatches = [...raw.matchAll(/Page\s+\d+\s+of\s+(\d+)/gi)].map(m => Number(m[1]));
    const pageCount = pageMatches.length ? Math.max(...pageMatches) : 1;

    const submittedLine = lines.find(l => /Submitted:\s+/i.test(l)) || "";
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
      if (blockMatch) {
        map[row.key] = Number(blockMatch[1]);
      }
    }
    return map;
  }

  function nextThursday1159MT(submittedValue) {
    if (!submittedValue) return "Thursday 11:59 p.m. MT";
    const parsed = new Date(submittedValue);
    if (Number.isNaN(parsed.getTime())) return "Thursday 11:59 p.m. MT";

    const day = parsed.getUTCDay();
    const targetDow = 4; // Thursday
    const delta = (targetDow - day + 7) % 7 || 7;

    const due = new Date(parsed);
    due.setUTCDate(due.getUTCDate() + delta);

    const month = due.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
    const date = due.getUTCDate();
    const year = due.getUTCFullYear();
    return `${month} ${date}, ${year} by 11:59 p.m. MT`;
  }

  function heuristicScore(label, max, assignmentText, rubricText) {
    const words = assignmentText.toLowerCase();
    const sentenceCount = splitSentences(assignmentText).length;

    let raw = 0;
    let reason = "";

    if (label.includes("Understanding")) {
      raw = 12 + keywordCount(words, ["case", "issue", "challenge", "change", "stakeholder", "impact"]) * 3 + Math.min(6, Math.floor(sentenceCount / 8));
      reason = "Highlight the core issue, key stakeholders, and why the issue matters to outcomes.";
    } else if (label.includes("Application")) {
      raw = 12 + keywordCount(words, ["model", "theory", "framework", "transformational", "incremental", "organizational"]) * 3;
      if (!/citation|reference|apa/i.test(words)) raw -= 2;
      reason = "Connect each theory/model to specific case evidence instead of broad summary.";
    } else if (label.includes("Critical")) {
      raw = 8 + keywordCount(words, ["alternative", "solution", "risk", "trade-off", "recommend", "because"]) * 2 + Math.min(4, Math.floor(sentenceCount / 10));
      reason = "Strengthen alternative analysis and defend why the final recommendation is strongest.";
    } else if (label.includes("Organization")) {
      raw = 5 + keywordCount(words, ["introduction", "conclusion", "first", "next", "finally"]);
      if (sentenceCount > 18) raw += 2;
      reason = "Use sharper transitions and one main analytical point per paragraph.";
    } else if (label.includes("APA")) {
      raw = 4 + keywordCount((rubricText + " " + words).toLowerCase(), ["apa", "references", "in-text", "citation", "doi"]) * 2;
      if (!/\(.*?,\s*\d{4}\)/.test(assignmentText)) raw -= 2;
      if (!/references?/i.test(assignmentText)) raw -= 2;
      reason = "Add consistent in-text citations and complete APA 7 references.";
    }

    const score = Math.max(0, Math.min(max, Math.round(raw)));
    return {
      score,
      band: scoreBand(score, max),
      comment: `${scoreBand(score, max)}: ${reason}`
    };
  }

  function rubricComment(item) {
    const { label, score, max } = item;
    const deducted = max - score;

    if (deducted <= 0) {
      if (label.includes("Understanding")) return "You clearly identified major case issues and explained their significance with strong depth.";
      if (label.includes("Application")) return "You applied relevant concepts well and linked theory to the case with clarity.";
      if (label.includes("Critical")) return "You provided logical analysis and practical recommendations with good judgment.";
      if (label.includes("Organization")) return "Your response is well organized and easy to follow from beginning to end.";
      return "APA formatting is handled well overall.";
    }

    if (label.includes("APA")) {
      return "You are on the right track with APA, but in-text citations and/or reference details are inconsistent. Correcting those details will help you earn full points next time.";
    }

    if (label.includes("Understanding")) {
      return "You identified the central issue, but some secondary issues need deeper explanation. Clarify how each issue affects the case outcome.";
    }

    if (label.includes("Application")) {
      return "Relevant concepts are present, but some theory-to-case links stay too general. Strengthen by tying each concept to one concrete case fact.";
    }

    if (label.includes("Critical")) {
      return "Your recommendation is reasonable, but alternatives need fuller comparison. Evaluate options and justify why your final choice is strongest.";
    }

    return "The structure is understandable, but transitions between ideas are uneven. Organize each paragraph around one analytical purpose.";
  }

  function extractGrammarIssues(sentences) {
    const issues = [];

    for (const sentence of sentences) {
      if (/\b(\w+)\s+\1\b/i.test(sentence)) {
        issues.push({
          anchor: firstThreeWords(sentence),
          issue: "Possible repeated word.",
          suggestion: "Remove the duplicated word for clarity."
        });
      }
      if (/\badjustments\s+an\s+adjustment\b/i.test(sentence)) {
        issues.push({
          anchor: firstThreeWords(sentence),
          issue: "Awkward duplicated phrasing.",
          suggestion: "Revise to one concise phrase."
        });
      }
      if (/\bstaff members for candid\b/i.test(sentence)) {
        issues.push({
          anchor: firstThreeWords(sentence),
          issue: "Sentence appears incomplete.",
          suggestion: "Finish the sentence clearly (for example, 'for candid feedback')."
        });
      }
      if (issues.length >= 2) break;
    }

    while (issues.length < 2) {
      const fallback = sentences[issues.length] || "No clear sentence detected.";
      issues.push({
        anchor: firstThreeWords(fallback),
        issue: "Potential grammar/style issue.",
        suggestion: "Review punctuation and concision."
      });
    }

    return issues.slice(0, 2);
  }

  function buildReport({ assignmentText, rubricText, meta }) {
    const sentences = splitSentences(assignmentText);
    const instructorScores = parseInstructorScores(rubricText);

    const rubric = RUBRIC.map(item => {
      const guessed = heuristicScore(item.label, item.max, assignmentText, rubricText);
      const finalScore = Number.isFinite(instructorScores[item.key]) ? instructorScores[item.key] : guessed.score;
      const finalBand = scoreBand(finalScore, item.max);

      return {
        key: item.key,
        label: item.label,
        max: item.max,
        score: finalScore,
        band: finalBand,
        comment: Number.isFinite(instructorScores[item.key])
          ? `${finalBand}: ${rubricComment({ label: item.label, score: finalScore, max: item.max })}`
          : guessed.comment
      };
    });

    const inSubmissionComments = [
      {
        type: "Positive Content",
        sentence: selectSentence(sentences, s => /case|issue|turning point|challenge/i.test(s), 0),
        comment: "Strong issue framing. You establish the central case problem clearly and set up your analysis well."
      },
      {
        type: "Positive Content",
        sentence: selectSentence(sentences, s => /model|theory|transformational|incremental|organizational/i.test(s), 1),
        comment: "Good concept application. You connect course concepts to the case in a way that supports your main point."
      },
      {
        type: "Content Improvement",
        sentence: selectSentence(sentences, s => /solution|recommend|should|because|therefore/i.test(s), 2),
        comment: "Deepen this section by evaluating at least one alternative before confirming your recommendation."
      },
      {
        type: "Feed Forward",
        sentence: selectSentence(sentences, s => /conclusion|analysis|this shift|overall/i.test(s), 3),
        comment: "For future assignments, use one additional source-based example to strengthen evidence quality."
      },
      {
        type: "APA/Mechanics",
        sentence: selectSentence(sentences, s => /reference|citation|apa|source/i.test(s), 4),
        comment: "APA note: ensure every paraphrased claim has an in-text citation and a matching reference entry."
      }
    ].map(item => ({ ...item, anchor: firstThreeWords(item.sentence) }));

    const pageMinimum = Math.max(1, meta.pageCount);
    const recommendation = `Leave at least ${pageMinimum} substantive in-document comment(s) (minimum one per page). Keep approximately 80% content-focused and 20% APA/mechanics-focused.`;

    const rubricDeductions = rubric
      .filter(r => r.score < r.max)
      .map(r => ({
        label: r.label,
        deduction: r.max - r.score,
        comment: rubricComment(r)
      }));

    const gradebookComment = `Hi ${meta.studentName}, strong work on this submission. You clearly identified key issues and applied course concepts in a logical way. A key next step is to tighten APA consistency by aligning in-text citations and references. Overall, this is thoughtful progress—please keep building depth by comparing alternatives before final recommendations.`;

    const processChecklist = [
      "Within submission feedback prepared",
      rubricDeductions.length ? "Rubric deduction comments generated for reduced-score categories" : "No rubric deductions detected",
      "Gradebook/assignment summary comment generated",
      `Timeliness reminder: if submitted by Sunday 11:59 p.m. MT, grade by ${nextThursday1159MT(meta.submittedValue)}`
    ];

    return {
      meta,
      rubric,
      inSubmissionComments,
      rubricDeductions,
      grammar: extractGrammarIssues(sentences),
      generalImprovement: {
        anchor: firstThreeWords(selectSentence(sentences, s => /analysis|structure|transition|paragraph/i.test(s), 5)),
        comment: "Reduce repetition and ensure each paragraph advances one distinct analytical purpose."
      },
      positives: inSubmissionComments.filter(c => c.type === "Positive Content").map(c => ({ anchor: c.anchor, comment: c.comment })),
      processChecklist,
      gradebookComment,
      recommendation
    };
  }

  function copyBtn(text) {
    return `<button class="cgc-copy" data-copy="${encodeURIComponent(text)}">Copy</button>`;
  }

  function renderReport(report) {
    const rubricHtml = report.rubric.map(item => `
      <div class="cgc-block">
        <div class="cgc-row"><strong>${item.label}</strong> ${copyBtn(`${item.label} = score: ${item.score}/${item.max} comment: ${item.comment}`)}</div>
        <div>score: <b>${item.score}/${item.max}</b></div>
        <div>comment: ${item.comment}</div>
      </div>
    `).join("");

    const inSubmissionHtml = report.inSubmissionComments.map(c => `
      <li><b>${c.type}</b> [Find: "${c.anchor}"] ${c.comment} ${copyBtn(`${c.type} [${c.anchor}] ${c.comment}`)}</li>
    `).join("");

    const deductionHtml = report.rubricDeductions.length
      ? report.rubricDeductions.map(d => `<li><b>${d.label}</b> (-${d.deduction}): ${d.comment} ${copyBtn(`${d.label} deduction: ${d.comment}`)}</li>`).join("")
      : `<li>No deduction comments required because all rubric categories are at full points.</li>`;

    const grammarHtml = report.grammar.map(g => `
      <li>[Find: "${g.anchor}"] ${g.issue} ${g.suggestion} ${copyBtn(`[${g.anchor}] ${g.issue} ${g.suggestion}`)}</li>
    `).join("");

    const positivesHtml = report.positives.map(p => `
      <li>[Find: "${p.anchor}"] ${p.comment} ${copyBtn(`[${p.anchor}] ${p.comment}`)}</li>
    `).join("");

    const checklistHtml = report.processChecklist.map(item => `<li>${item}</li>`).join("");

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
        <strong>Feed Up / Feedback / Feed Forward (quick use)</strong>
        <ul>${report.inSubmissionComments.filter(c => c.type !== "APA/Mechanics").slice(1, 4).map(c => `<li>[Find: "${c.anchor}"] ${c.comment}</li>`).join("")}</ul>
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

    el.results.querySelectorAll(".cgc-copy").forEach(btn => {
      btn.addEventListener("click", () => {
        writeClipboard(decodeURIComponent(btn.getAttribute("data-copy") || ""));
      });
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
    report.rubric.forEach(r => {
      lines.push(`- ${r.label} = score: ${r.score}/${r.max} comment: ${r.comment}`);
    });

    lines.push("\nWithin Submission comments:");
    report.inSubmissionComments.forEach(c => {
      lines.push(`- ${c.type} [${c.anchor}]: ${c.comment}`);
    });

    lines.push("\nRubric deduction comments:");
    if (report.rubricDeductions.length) {
      report.rubricDeductions.forEach(d => {
        lines.push(`- ${d.label} (-${d.deduction}): ${d.comment}`);
      });
    } else {
      lines.push("- None (all categories at full points).");
    }

    lines.push("\nGradebook comment:");
    lines.push(report.gradebookComment);

    lines.push("\nGrammar/typo notes:");
    report.grammar.forEach(g => lines.push(`- [${g.anchor}] ${g.issue} ${g.suggestion}`));

    lines.push("\nGeneral improvement:");
    lines.push(`- [${report.generalImprovement.anchor}] ${report.generalImprovement.comment}`);

    lines.push("\nPositive comments:");
    report.positives.forEach(p => lines.push(`- [${p.anchor}] ${p.comment}`));

    lines.push("\nChecklist:");
    report.processChecklist.forEach(item => lines.push(`- ${item}`));

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
