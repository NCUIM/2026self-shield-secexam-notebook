/**
 * 資安實戰試題問答與錯題記事本 (Sec-Compendium Quiz & Mistake Notebook)
 */

(function () {
  'use strict';

  // --- Lightweight Offline Markdown Parser ---
  function parseMarkdown(md) {
    if (!md) return '';
    let html = md;
    
    // Escape basic HTML
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Code blocks with syntax highlighting simulation
    html = html.replace(/```([a-zA-Z0-9_\-]+)?\n([\s\S]*?)```/g, function (match, lang, code) {
      return `<pre class="code-block language-${lang || 'text'}"><code>${code.trim()}</code></pre>`;
    });
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Bold & italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Headers
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    
    // Blockquotes
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    // Unordered lists
    html = html.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gis, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');
    
    // Tables (Markdown table to HTML table)
    html = html.replace(/((?:\|[^\n]+\|\r?\n)+)/g, function(tableText) {
      const rows = tableText.trim().split(/\r?\n/).filter(r => r.trim());
      if (rows.length < 2) return tableText;
      let tableHtml = '<div class="table-container"><table class="domain-breakdown-table">';
      rows.forEach((row, idx) => {
        if (row.includes('---')) return; // separator
        const cells = row.split('|').slice(1, -1).map(c => c.trim());
        tableHtml += '<tr>';
        cells.forEach(cell => {
          const tag = idx === 0 ? 'th' : 'td';
          tableHtml += `<${tag}>${cell}</${tag}>`;
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</table></div>';
      return tableHtml;
    });
    
    // Line breaks & paragraphs
    html = html.replace(/\n\n+/g, '</p><p>');
    html = '<p>' + html + '</p>';
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[234]>)/g, '$1').replace(/(<\/h[234]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre[\s\S]*?<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p>(<div class="table-container"[\s\S]*?<\/div>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>[\s\S]*?<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>[\s\S]*?<\/blockquote>)<\/p>/g, '$1');
    
    return html;
  }

  // --- App State Management ---
  const STORAGE_KEY = 'sec_exam_notebook_v1';

  const App = {
    data: window.EXAM_DATA || { exam_a: [], exam_b: [], evidences: [] },
    currentExam: 'exam_a',     // 'exam_a' | 'exam_b'
    currentMode: 'practice',   // 'practice' | 'exam' | 'notebook'
    currentIndex: 0,           // 0-based index in filtered list
    filteredQuestions: [],
    
    // Persistent User Data
    userAnswers: { exam_a: {}, exam_b: {} },
    userResults: { exam_a: {}, exam_b: {} },    // true (correct) | false (wrong)
    mistakes: { exam_a: {}, exam_b: {} },       // qid -> { mastery: 'learning'|'understood'|'mastered', date: timestamp }
    userNotes: { exam_a: {}, exam_b: {} },      // qid -> string
    starred: { exam_a: {}, exam_b: {} },        // qid -> boolean
    
    // Filter State
    filterStatus: 'all',       // 'all' | 'mistake' | 'starred' | 'noted' | 'unanswered'
    filterDomain: 'all',
    searchQuery: '',
    
    // Exam Mode Timer
    examTimer: null,
    examSecondsLeft: 90 * 60,
    examSubmitted: false,

    init() {
      this.loadStorage();
      this.initTheme();
      this.bindEvents();
      this.setExam(this.currentExam, false);
      this.render();
    },

    loadStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.userAnswers = parsed.userAnswers || { exam_a: {}, exam_b: {} };
          this.userResults = parsed.userResults || { exam_a: {}, exam_b: {} };
          this.mistakes = parsed.mistakes || { exam_a: {}, exam_b: {} };
          this.userNotes = parsed.userNotes || { exam_a: {}, exam_b: {} };
          this.starred = parsed.starred || { exam_a: {}, exam_b: {} };
          if (parsed.currentExam) this.currentExam = parsed.currentExam;
          if (parsed.currentMode) this.currentMode = parsed.currentMode;
        }
      } catch (e) {
        console.error('Failed to load local storage:', e);
      }
    },

    saveStorage() {
      try {
        const payload = {
          userAnswers: this.userAnswers,
          userResults: this.userResults,
          mistakes: this.mistakes,
          userNotes: this.userNotes,
          starred: this.starred,
          currentExam: this.currentExam,
          currentMode: this.currentMode
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        console.error('Failed to save to local storage:', e);
      }
    },

    initTheme() {
      const savedTheme = localStorage.getItem('sec_exam_theme') || 'dark';
      document.documentElement.setAttribute('data-theme', savedTheme);
      const themeBtn = document.getElementById('theme-toggle-btn');
      if (themeBtn) {
        themeBtn.innerHTML = savedTheme === 'dark' ? '☀️ 淺色' : '🌙 深色';
      }
    },

    toggleTheme() {
      const cur = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('sec_exam_theme', next);
      const themeBtn = document.getElementById('theme-toggle-btn');
      if (themeBtn) {
        themeBtn.innerHTML = next === 'dark' ? '☀️ 淺色' : '🌙 深色';
      }
    },

    getQuestionsForCurrentExam() {
      return this.currentExam === 'exam_a' ? this.data.exam_a : this.data.exam_b;
    },

    applyFilters() {
      const allQ = this.getQuestionsForCurrentExam();
      const qAnswers = this.userAnswers[this.currentExam] || {};
      const qResults = this.userResults[this.currentExam] || {};
      const qMistakes = this.mistakes[this.currentExam] || {};
      const qStarred = this.starred[this.currentExam] || {};
      const qNotes = this.userNotes[this.currentExam] || {};

      this.filteredQuestions = allQ.filter(q => {
        // Mode filter: if in Notebook mode, default to mistakes or starred
        if (this.currentMode === 'notebook') {
          const isMistake = qMistakes[q.id];
          const isStar = qStarred[q.id];
          const hasNote = !!qNotes[q.id];
          if (!isMistake && !isStar && !hasNote) return false;
        }

        // Status filter
        if (this.filterStatus === 'mistake') {
          if (!qMistakes[q.id]) return false;
        } else if (this.filterStatus === 'starred') {
          if (!qStarred[q.id]) return false;
        } else if (this.filterStatus === 'noted') {
          if (!qNotes[q.id] || !qNotes[q.id].trim()) return false;
        } else if (this.filterStatus === 'unanswered') {
          if (qAnswers[q.id] !== undefined && qAnswers[q.id] !== '') return false;
        }

        // Domain filter
        if (this.filterDomain !== 'all') {
          if (q.domain !== this.filterDomain) return false;
        }

        // Search query
        if (this.searchQuery) {
          const qText = (q.question + ' ' + (q.basis || '') + ' ' + (q.distractor || '') + ' ' + (qNotes[q.id] || '')).toLowerCase();
          if (!qText.includes(this.searchQuery.toLowerCase())) return false;
        }

        return true;
      });

      if (this.currentIndex >= this.filteredQuestions.length) {
        this.currentIndex = Math.max(0, this.filteredQuestions.length - 1);
      }
    },

    setExam(examKey, resetIndex = true) {
      this.currentExam = examKey;
      if (resetIndex) this.currentIndex = 0;
      this.filterDomain = 'all';
      this.updateDomainDropdown();
      this.applyFilters();
      this.saveStorage();
      this.render();
    },

    setMode(modeKey) {
      this.currentMode = modeKey;
      this.currentIndex = 0;
      if (modeKey === 'exam') {
        this.startExamTimer();
      } else {
        this.stopExamTimer();
      }
      this.applyFilters();
      this.saveStorage();
      this.render();
    },

    startExamTimer() {
      if (this.examTimer) clearInterval(this.examTimer);
      const totalMinutes = this.currentExam === 'exam_a' ? 90 : 180;
      this.examSecondsLeft = totalMinutes * 60;
      this.examSubmitted = false;
      this.updateTimerDisplay();

      this.examTimer = setInterval(() => {
        if (this.examSecondsLeft > 0) {
          this.examSecondsLeft--;
          this.updateTimerDisplay();
        } else {
          clearInterval(this.examTimer);
          alert('測驗時間到！系統將自動為您提交試卷。');
          this.submitExam();
        }
      }, 1000);
    },

    stopExamTimer() {
      if (this.examTimer) {
        clearInterval(this.examTimer);
        this.examTimer = null;
      }
    },

    updateTimerDisplay() {
      const el = document.getElementById('timer-val');
      if (!el) return;
      const m = Math.floor(this.examSecondsLeft / 60);
      const s = this.examSecondsLeft % 60;
      el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    },

    submitExam() {
      this.stopExamTimer();
      this.examSubmitted = true;
      
      // Calculate scores
      const questions = this.getQuestionsForCurrentExam();
      let correctCount = 0;
      let totalCount = questions.length;
      const domainStats = {};

      questions.forEach(q => {
        const userAns = this.userAnswers[this.currentExam][q.id];
        let isCorrect = false;

        if (q.type === 'single_choice') {
          isCorrect = userAns === q.answer;
        } else {
          // Lab questions: check auto or flagged
          isCorrect = this.userResults[this.currentExam][q.id] === true;
        }

        this.userResults[this.currentExam][q.id] = isCorrect;
        if (isCorrect) {
          correctCount++;
        } else {
          // Record to mistakes
          this.recordMistake(q.id);
        }

        // Domain breakdown
        if (!domainStats[q.domain]) {
          domainStats[q.domain] = { total: 0, correct: 0 };
        }
        domainStats[q.domain].total++;
        if (isCorrect) domainStats[q.domain].correct++;
      });

      this.saveStorage();
      this.showScoreModal(correctCount, totalCount, domainStats);
      this.render();
    },

    recordMistake(qid) {
      if (!this.mistakes[this.currentExam][qid]) {
        this.mistakes[this.currentExam][qid] = {
          mastery: 'learning', // 'learning' (待加強) | 'understood' (已理解) | 'mastered' (已掌握)
          date: Date.now(),
          wrongCount: 1
        };
      } else {
        this.mistakes[this.currentExam][qid].wrongCount = (this.mistakes[this.currentExam][qid].wrongCount || 1) + 1;
      }
    },

    removeMistake(qid) {
      delete this.mistakes[this.currentExam][qid];
      this.saveStorage();
      this.applyFilters();
      this.render();
    },

    toggleStar(qid) {
      this.starred[this.currentExam][qid] = !this.starred[this.currentExam][qid];
      this.saveStorage();
      this.render();
    },

    updateMastery(qid, mastery) {
      if (!this.mistakes[this.currentExam][qid]) {
        this.recordMistake(qid);
      }
      this.mistakes[this.currentExam][qid].mastery = mastery;
      this.saveStorage();
      this.render();
    },

    saveNote(qid, text) {
      this.userNotes[this.currentExam][qid] = text;
      this.saveStorage();
      const statusEl = document.getElementById(`save-status-${qid}`);
      if (statusEl) {
        statusEl.textContent = '✓ 已自動儲存';
        statusEl.classList.add('saved');
        setTimeout(() => {
          if (statusEl) statusEl.textContent = '雲端本機同步';
        }, 2000);
      }
      this.updateSidebarGrid();
    },

    handleOptionSelect(qid, optKey) {
      if (this.currentMode === 'exam' && this.examSubmitted) return;

      this.userAnswers[this.currentExam][qid] = optKey;
      const q = this.getQuestionsForCurrentExam().find(item => item.id === qid);
      if (!q) return;

      if (this.currentMode === 'practice' || this.currentMode === 'notebook') {
        const isCorrect = optKey === q.answer;
        this.userResults[this.currentExam][qid] = isCorrect;
        if (!isCorrect) {
          this.recordMistake(qid);
        } else {
          // If in practice and answered correctly, improve mastery if in mistake
          if (this.mistakes[this.currentExam][qid]) {
            if (this.mistakes[this.currentExam][qid].mastery === 'learning') {
              this.mistakes[this.currentExam][qid].mastery = 'understood';
            }
          }
        }
      }

      this.saveStorage();
      this.renderCurrentQuestion();
      this.updateSidebarGrid();
      this.updateQuickStats();
    },

    handleLabAnswerSubmit(qid, answerInput) {
      this.userAnswers[this.currentExam][qid] = answerInput;
      const q = this.getQuestionsForCurrentExam().find(item => item.id === qid);
      if (!q) return;

      // Simple normalize comparison
      const cleanUser = (answerInput || '').trim().toLowerCase().replace(/[`'"\s]/g, '');
      const cleanAns = (q.clean_answer || q.answer || '').trim().toLowerCase().replace(/[`'"\s]/g, '');

      let isMatch = cleanUser.length > 0 && cleanAns.length > 0 && (cleanUser === cleanAns || cleanAns.includes(cleanUser));
      this.userResults[this.currentExam][qid] = isMatch;
      if (!isMatch) {
        this.recordMistake(qid);
      }

      this.saveStorage();
      this.renderCurrentQuestion();
      this.updateSidebarGrid();
      this.updateQuickStats();
    },

    markLabSelfGrade(qid, isCorrect) {
      this.userResults[this.currentExam][qid] = isCorrect;
      if (!isCorrect) {
        this.recordMistake(qid);
      } else {
        if (this.mistakes[this.currentExam][qid]) {
          this.mistakes[this.currentExam][qid].mastery = 'mastered';
        }
      }
      this.saveStorage();
      this.renderCurrentQuestion();
      this.updateSidebarGrid();
      this.updateQuickStats();
    },

    retakeMistakes() {
      const qMistakes = this.mistakes[this.currentExam] || {};
      const mistakeIds = Object.keys(qMistakes).map(Number);
      if (mistakeIds.length === 0) {
        alert('太棒了！目前沒有任何錯題記錄！');
        return;
      }
      if (confirm(`確定要針對目前 ${mistakeIds.length} 道錯題開啟專項重測嗎？（這將清空這些錯題的作答狀態，保留您的檢討筆記）`)) {
        mistakeIds.forEach(id => {
          delete this.userAnswers[this.currentExam][id];
          delete this.userResults[this.currentExam][id];
        });
        this.saveStorage();
        this.filterStatus = 'mistake';
        this.setMode('practice');
        this.render();
      }
    },

    updateDomainDropdown() {
      const select = document.getElementById('domain-filter');
      if (!select) return;
      const domains = this.currentExam === 'exam_a' ? this.data.meta.domains_a : this.data.meta.domains_b;
      
      let html = '<option value="all">📚 全部分類 / 領域</option>';
      domains.forEach(d => {
        html += `<option value="${d}">${d}</option>`;
      });
      select.innerHTML = html;
      select.value = this.filterDomain;
    },

    updateQuickStats() {
      const allQ = this.getQuestionsForCurrentExam();
      const total = allQ.length;
      const answers = this.userAnswers[this.currentExam] || {};
      const results = this.userResults[this.currentExam] || {};
      const mistakes = this.mistakes[this.currentExam] || {};
      const notes = this.userNotes[this.currentExam] || {};

      let answeredCount = 0;
      let correctCount = 0;
      allQ.forEach(q => {
        if (answers[q.id] !== undefined && answers[q.id] !== '') {
          answeredCount++;
          if (results[q.id] === true) correctCount++;
        }
      });

      const mistakeCount = Object.keys(mistakes).length;
      const noteCount = Object.values(notes).filter(n => n && n.trim()).length;
      const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

      const answeredEl = document.getElementById('stat-answered');
      const accuracyEl = document.getElementById('stat-accuracy');
      const mistakesEl = document.getElementById('stat-mistakes');
      const notebookBadge = document.getElementById('notebook-badge');
      const progressFill = document.getElementById('progress-fill');
      const progressPct = document.getElementById('progress-pct');

      if (answeredEl) answeredEl.textContent = `${answeredCount}/${total}`;
      if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;
      if (mistakesEl) mistakesEl.textContent = `${mistakeCount}`;
      if (notebookBadge) {
        notebookBadge.textContent = mistakeCount;
        notebookBadge.style.display = mistakeCount > 0 ? 'inline-block' : 'none';
      }
      if (progressFill) {
        const pct = Math.round((answeredCount / total) * 100);
        progressFill.style.width = `${pct}%`;
        if (progressPct) progressPct.textContent = `${pct}%`;
      }
    },

    updateSidebarGrid() {
      const grid = document.getElementById('question-grid');
      if (!grid) return;

      const curQ = this.filteredQuestions[this.currentIndex];
      const answers = this.userAnswers[this.currentExam] || {};
      const results = this.userResults[this.currentExam] || {};
      const mistakes = this.mistakes[this.currentExam] || {};
      const starred = this.starred[this.currentExam] || {};
      const notes = this.userNotes[this.currentExam] || {};

      let html = '';
      this.filteredQuestions.forEach((q, idx) => {
        const qid = q.id;
        const isCurrent = curQ && curQ.id === qid;
        const hasAnswer = answers[qid] !== undefined && answers[qid] !== '';
        const isCorrect = results[qid] === true;
        const isWrong = results[qid] === false || !!mistakes[qid];
        const isStar = !!starred[qid];
        const hasNote = !!(notes[qid] && notes[qid].trim());

        let cls = ['grid-item'];
        if (isCurrent) cls.push('current');
        if (this.currentMode === 'exam' && !this.examSubmitted) {
          if (hasAnswer) cls.push('answered');
        } else {
          if (hasAnswer) {
            if (isCorrect) cls.push('correct');
            else if (isWrong) cls.push('wrong');
          } else if (isWrong) {
            cls.push('wrong');
          }
        }
        if (isStar) cls.push('starred');
        if (hasNote) cls.push('has-note');

        html += `<div class="${cls.join(' ')}" data-index="${idx}" title="第 ${qid} 題：${q.domain}">
          ${qid}
        </div>`;
      });

      if (this.filteredQuestions.length === 0) {
        html = '<div style="grid-column: 1/-1; padding: 20px; text-align: center; color: var(--text-muted);">無符合條件的題目</div>';
      }

      grid.innerHTML = html;
    },

    renderCurrentQuestion() {
      const container = document.getElementById('question-display-area');
      if (!container) return;

      if (this.filteredQuestions.length === 0) {
        container.innerHTML = `
          <div class="question-card" style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 48px; margin-bottom: 12px;">🔍</div>
            <h3>查無題目</h3>
            <p style="color: var(--text-muted); margin-top: 8px;">當前篩選條件下沒有符合的試題，請嘗試重設篩選條件或切換領域。</p>
            <button class="btn btn-primary" style="margin-top: 16px;" onclick="App.resetFilters()">重設篩選條件</button>
          </div>
        `;
        return;
      }

      const q = this.filteredQuestions[this.currentIndex];
      const qid = q.id;
      const isExamA = q.exam === 'exam_a';
      const userAns = this.userAnswers[this.currentExam][qid];
      const result = this.userResults[this.currentExam][qid];
      const mistakeInfo = this.mistakes[this.currentExam][qid];
      const isStarred = !!this.starred[this.currentExam][qid];
      const noteText = this.userNotes[this.currentExam][qid] || '';

      // Determine whether explanation should be shown
      const showExplanation = (this.currentMode === 'practice' && userAns !== undefined) ||
                               (this.currentMode === 'notebook') ||
                               (this.currentMode === 'exam' && this.examSubmitted);

      // Mastery dropdown HTML
      const curMastery = mistakeInfo ? mistakeInfo.mastery : 'learning';

      // Related evidence chip
      let evidenceBtn = '';
      if (q.related_evidence && q.related_evidence.length > 0) {
        const evTitle = q.related_evidence[0];
        evidenceBtn = `<button class="evidence-ref-btn" onclick="App.openEvidence('${evTitle.replace(/'/g, "\\'")}')">
          📑 關聯證據：${evTitle}
        </button>`;
      }

      // Question body HTML
      let bodyHtml = parseMarkdown(q.question);

      // Answer options / Lab input HTML
      let interactionHtml = '';
      if (isExamA) {
        interactionHtml += '<div class="options-list">';
        ['A', 'B', 'C', 'D'].forEach(optKey => {
          const optText = q.options[optKey] || '';
          const isSelected = userAns === optKey;
          let optCls = ['option-item'];
          
          if (isSelected) optCls.push('selected');
          
          if (showExplanation) {
            if (optKey === q.answer) {
              optCls.push('is-correct');
            } else if (isSelected && optKey !== q.answer) {
              optCls.push('is-wrong');
            }
          }

          interactionHtml += `
            <div class="${optCls.join(' ')}" onclick="App.handleOptionSelect(${qid}, '${optKey}')">
              <div class="option-letter">${optKey}</div>
              <div class="option-text">${parseMarkdown(optText)}</div>
            </div>
          `;
        });
        interactionHtml += '</div>';
      } else {
        // Lab Question
        interactionHtml += `
          <div class="lab-input-area">
            <div class="lab-input-row">
              <input type="text" id="lab-input-${qid}" class="lab-input" 
                placeholder="請輸入答案數值、路徑、指令或 Flag..." 
                value="${userAns || ''}" 
                onkeydown="if(event.key==='Enter') App.handleLabAnswerSubmit(${qid}, this.value)"
              />
              <button class="btn btn-primary" onclick="App.handleLabAnswerSubmit(${qid}, document.getElementById('lab-input-${qid}').value)">
                比對答案
              </button>
            </div>
            <div class="self-grade-group">
              <span class="self-grade-label">作答自評：</span>
              <button class="btn btn-success" onclick="App.markLabSelfGrade(${qid}, true)">
                ✓ 答對了
              </button>
              <button class="btn btn-danger" onclick="App.markLabSelfGrade(${qid}, false)">
                ✗ 答錯了 (入錯題本)
              </button>
              ${result === true ? '<span class="tag" style="background:var(--success-subtle); color:var(--success-text);">狀態：正確</span>' : ''}
              ${result === false ? '<span class="tag tag-mistake">狀態：已入錯題本</span>' : ''}
            </div>
          </div>
        `;
      }

      // Explanation Section HTML
      let explHtml = '';
      if (isExamA) {
        explHtml = `
          <div class="explanation-box ${showExplanation ? 'show' : ''}" id="explanation-${qid}">
            <div class="ans-badge-row">
              <span class="ans-badge">標準答案：(${q.answer})</span>
              ${userAns ? `<span class="user-ans-badge ${userAns === q.answer ? 'correct' : 'wrong'}">你的答案：(${userAns}) ${userAns === q.answer ? '✓ 正確' : '✗ 錯誤'}</span>` : '<span class="user-ans-badge">尚未作答</span>'}
            </div>
            ${q.basis ? `
              <div class="expl-section">
                <div class="expl-title">💡 正解依據與關鍵原理</div>
                <div class="expl-content">${parseMarkdown(q.basis)}</div>
              </div>
            ` : ''}
            ${q.distractor ? `
              <div class="expl-section">
                <div class="expl-title">⚠️ 誘答干擾項辨析（易錯陷阱）</div>
                <div class="expl-content">${parseMarkdown(q.distractor)}</div>
              </div>
            ` : ''}
          </div>
        `;
      } else {
        explHtml = `
          <div class="explanation-box ${showExplanation ? 'show' : ''}" id="explanation-${qid}">
            <div class="ans-badge-row">
              <span class="ans-badge">官方標準答案：${q.answer}</span>
            </div>
            ${q.basis ? `
              <div class="expl-section">
                <div class="expl-title">🔍 官方深度解析與解密流程</div>
                <div class="expl-content">${parseMarkdown(q.basis)}</div>
              </div>
            ` : ''}
          </div>
        `;
      }

      // Notebook Reflection Section
      const notebookHtml = `
        <div class="notebook-section">
          <div class="notebook-header">
            <div class="notebook-title">
              <span>📓 專屬錯題檢討筆記</span>
              <span class="save-status" id="save-status-${qid}">雲端本機同步</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 12px; color: var(--text-muted);">掌握狀態：</span>
              <select class="mastery-select" onchange="App.updateMastery(${qid}, this.value)">
                <option value="learning" ${curMastery === 'learning' ? 'selected' : ''}>🔴 待加強</option>
                <option value="understood" ${curMastery === 'understood' ? 'selected' : ''}>🟡 已理解</option>
                <option value="mastered" ${curMastery === 'mastered' ? 'selected' : ''}>🟢 已掌握</option>
              </select>
              ${mistakeInfo ? `
                <button class="btn" style="padding: 3px 8px; font-size: 11px;" onclick="App.removeMistake(${qid})">
                  移出錯題本
                </button>
              ` : `
                <button class="btn" style="padding: 3px 8px; font-size: 11px;" onclick="App.recordMistake(${qid}); App.render();">
                  ＋加入錯題本
                </button>
              `}
            </div>
          </div>
          <div class="note-tags">
            <button class="quick-tag" onclick="App.insertNoteTag(${qid}, '#考點盲區')">#考點盲區</button>
            <button class="quick-tag" onclick="App.insertNoteTag(${qid}, '#粗心看錯')">#粗心看錯</button>
            <button class="quick-tag" onclick="App.insertNoteTag(${qid}, '#概念混淆')">#概念混淆</button>
            <button class="quick-tag" onclick="App.insertNoteTag(${qid}, '#高頻必背')">#高頻必背</button>
            <button class="quick-tag" onclick="App.insertNoteTag(${qid}, '#關鍵指令')">#關鍵指令</button>
          </div>
          <textarea 
            class="note-textarea" 
            id="note-textarea-${qid}" 
            placeholder="記錄您的出題陷阱、觀念盲點、個人訂正心得或關鍵筆記...（輸入即自動保存）"
            oninput="App.saveNote(${qid}, this.value)"
          >${noteText}</textarea>
        </div>
      `;

      // Main Card Assembly
      container.innerHTML = `
        <div class="question-card">
          <div class="q-header">
            <div class="q-tags">
              <span class="tag tag-domain">${q.domain}</span>
              <span class="tag tag-category">${q.category}</span>
              <span class="tag">題號：#${qid}</span>
              ${mistakeInfo ? `<span class="tag tag-mistake">錯題本 (${mistakeInfo.mastery === 'mastered' ? '已掌握' : mistakeInfo.mastery === 'understood' ? '已理解' : '待加強'})</span>` : ''}
              ${evidenceBtn}
            </div>
            <div class="q-actions">
              <button class="star-btn ${isStarred ? 'active' : ''}" onclick="App.toggleStar(${qid})" title="標記重點 / 收藏">
                ${isStarred ? '★ 已收藏' : '☆ 收藏'}
              </button>
            </div>
          </div>

          <div class="q-body">
            ${bodyHtml}
          </div>

          ${interactionHtml}

          ${explHtml}

          ${notebookHtml}

          <div class="card-nav">
            <div class="nav-buttons">
              <button class="btn" onclick="App.prevQuestion()" ${this.currentIndex === 0 ? 'disabled' : ''}>
                ← 上一題 (P)
              </button>
              <button class="btn" onclick="App.nextQuestion()" ${this.currentIndex === this.filteredQuestions.length - 1 ? 'disabled' : ''}>
                下一題 (N) →
              </button>
              <button class="btn" onclick="App.randomQuestion()">
                🎲 隨機抽題
              </button>
            </div>

            <div style="font-size: 13px; color: var(--text-muted);">
              第 <strong>${this.currentIndex + 1}</strong> / ${this.filteredQuestions.length} 題
            </div>
          </div>
        </div>
      `;
    },

    insertNoteTag(qid, tag) {
      const textarea = document.getElementById(`note-textarea-${qid}`);
      if (!textarea) return;
      const cur = textarea.value;
      textarea.value = cur ? `${cur} ${tag} ` : `${tag} `;
      this.saveNote(qid, textarea.value);
      textarea.focus();
    },

    prevQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.renderCurrentQuestion();
        this.updateSidebarGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    nextQuestion() {
      if (this.currentIndex < this.filteredQuestions.length - 1) {
        this.currentIndex++;
        this.renderCurrentQuestion();
        this.updateSidebarGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    randomQuestion() {
      if (this.filteredQuestions.length <= 1) return;
      let nextIdx = Math.floor(Math.random() * this.filteredQuestions.length);
      if (nextIdx === this.currentIndex) nextIdx = (nextIdx + 1) % this.filteredQuestions.length;
      this.currentIndex = nextIdx;
      this.renderCurrentQuestion();
      this.updateSidebarGrid();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    jumpToIndex(idx) {
      if (idx >= 0 && idx < this.filteredQuestions.length) {
        this.currentIndex = idx;
        this.renderCurrentQuestion();
        this.updateSidebarGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    resetFilters() {
      this.filterStatus = 'all';
      this.filterDomain = 'all';
      this.searchQuery = '';
      const sInput = document.getElementById('search-input');
      if (sInput) sInput.value = '';
      const dSelect = document.getElementById('domain-filter');
      if (dSelect) dSelect.value = 'all';
      document.querySelectorAll('.filter-pill').forEach(p => {
        p.classList.toggle('active', p.dataset.filter === 'all');
      });
      this.applyFilters();
      this.render();
    },

    // --- Evidence Viewer Drawer ---
    openEvidence(evKey) {
      const drawer = document.getElementById('evidence-drawer');
      const backdrop = document.getElementById('drawer-backdrop');
      const select = document.getElementById('evidence-select');
      const body = document.getElementById('evidence-body');
      if (!drawer || !backdrop || !select || !body) return;

      // Populate evidence select options
      let html = '';
      this.data.evidences.forEach((ev, idx) => {
        html += `<option value="${idx}">${ev.title}</option>`;
      });
      select.innerHTML = html;

      // Select target
      let targetIdx = 0;
      if (evKey) {
        const found = this.data.evidences.findIndex(ev => ev.title.includes(evKey) || evKey.includes(ev.raw_title));
        if (found !== -1) targetIdx = found;
      }
      select.value = targetIdx;
      this.renderEvidenceContent(targetIdx);

      drawer.classList.add('show');
      backdrop.classList.add('show');
    },

    closeEvidence() {
      const drawer = document.getElementById('evidence-drawer');
      const backdrop = document.getElementById('drawer-backdrop');
      if (drawer) drawer.classList.remove('show');
      if (backdrop) backdrop.classList.remove('show');
    },

    renderEvidenceContent(idx) {
      const body = document.getElementById('evidence-body');
      if (!body) return;
      const ev = this.data.evidences[idx];
      if (!ev) {
        body.innerHTML = '<p>無證據資料</p>';
        return;
      }
      body.innerHTML = `
        <h3 style="margin-bottom: 12px; color: var(--primary);">${ev.title}</h3>
        <div>${parseMarkdown(ev.content)}</div>
      `;
    },

    // --- Score Modal ---
    showScoreModal(correct, total, domainStats) {
      const modal = document.getElementById('score-modal');
      const backdrop = document.getElementById('score-backdrop');
      const body = document.getElementById('score-modal-body');
      if (!modal || !backdrop || !body) return;

      const scorePct = total > 0 ? Math.round((correct / total) * 100) : 0;
      let domainRows = '';
      for (const [dom, stat] of Object.entries(domainStats)) {
        const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
        domainRows += `
          <tr>
            <td>${dom}</td>
            <td style="font-weight:700;">${stat.correct} / ${stat.total}</td>
            <td>
              <div style="display:flex; align-items:center; gap:8px;">
                <div class="progress-track" style="flex:1; height:6px;">
                  <div class="progress-fill" style="width:${pct}%; background:${pct>=70 ? 'var(--success)' : 'var(--danger)'};"></div>
                </div>
                <span>${pct}%</span>
              </div>
            </td>
          </tr>
        `;
      }

      body.innerHTML = `
        <div class="score-summary-card">
          <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 6px;">全卷總得分 (Score)</div>
          <div class="score-num">${correct} <span style="font-size: 22px; color: var(--text-muted);">/ ${total}</span></div>
          <div style="margin-top: 8px; font-weight: 600; color: ${scorePct >= 70 ? 'var(--success)' : 'var(--danger)'};">
            正確率：${scorePct}% (${scorePct >= 70 ? '🎉 恭喜及格！' : '⚠️ 仍需加強複習！'})
          </div>
        </div>

        <h4 style="margin: 16px 0 8px;">📊 各領域掌握度分析</h4>
        <table class="domain-breakdown-table">
          <thead>
            <tr>
              <th>領域名稱</th>
              <th>答對題數</th>
              <th>正確率</th>
            </tr>
          </thead>
          <tbody>
            ${domainRows}
          </tbody>
        </table>
        
        <div style="margin-top: 20px; padding: 12px; background: var(--bg-surface-alt); border-radius: var(--radius-sm); font-size: 13px; color: var(--text-muted);">
          📌 提示：所有答錯的題目已自動收錄至<strong>「錯題記事本」</strong>中！您可以切換至錯題模式進行針對性訂正與重測。
        </div>
      `;

      modal.classList.add('show');
      backdrop.classList.add('show');
    },

    closeScoreModal() {
      const modal = document.getElementById('score-modal');
      const backdrop = document.getElementById('score-backdrop');
      if (modal) modal.classList.remove('show');
      if (backdrop) backdrop.classList.remove('show');
    },

    // --- Export & Backup Functions ---
    exportBackup() {
      const payload = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        userAnswers: this.userAnswers,
        userResults: this.userResults,
        mistakes: this.mistakes,
        userNotes: this.userNotes,
        starred: this.starred
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sec_exam_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },

    importBackup(fileInput) {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed.userAnswers) this.userAnswers = parsed.userAnswers;
          if (parsed.userResults) this.userResults = parsed.userResults;
          if (parsed.mistakes) this.mistakes = parsed.mistakes;
          if (parsed.userNotes) this.userNotes = parsed.userNotes;
          if (parsed.starred) this.starred = parsed.starred;
          this.saveStorage();
          this.applyFilters();
          this.render();
          alert('學習記錄還原成功！');
        } catch (err) {
          alert('匯入失敗：備份檔案格式不正確！');
        }
      };
      reader.readAsText(file);
    },

    exportMarkdownNotebook() {
      const examName = this.currentExam === 'exam_a' ? '全真模擬測驗 A 卷' : '全真模擬測驗 B 卷';
      const allQ = this.getQuestionsForCurrentExam();
      const qMistakes = this.mistakes[this.currentExam] || {};
      const qNotes = this.userNotes[this.currentExam] || {};
      const qAnswers = this.userAnswers[this.currentExam] || {};

      let md = `# 資安實戰錯題筆記本（${examName}）\n\n`;
      md += `> 匯出時間：${new Date().toLocaleString()}  \n`;
      md += `> 錯題總數：${Object.keys(qMistakes).length} 題\n\n---\n\n`;

      let count = 0;
      allQ.forEach(q => {
        const isMistake = !!qMistakes[q.id];
        const note = qNotes[q.id];
        if (isMistake || (note && note.trim())) {
          count++;
          md += `## 第 ${q.id} 題【${q.domain} / ${q.category}】\n\n`;
          md += `**題目描述**：\n\n${q.question}\n\n`;
          
          if (q.options) {
            md += `**選項**：\n`;
            ['A', 'B', 'C', 'D'].forEach(opt => {
              if (q.options[opt]) {
                md += `- (${opt}) ${q.options[opt]}\n`;
              }
            });
            md += `\n`;
          }

          md += `**標準答案**：\`${q.answer}\`  \n`;
          if (qAnswers[q.id]) {
            md += `**當時作答**：\`${qAnswers[q.id]}\`  \n`;
          }
          if (qMistakes[q.id]) {
            const masteryMap = { learning: '待加強 🔴', understood: '已理解 🟡', mastered: '已掌握 🟢' };
            md += `**掌握狀態**：${masteryMap[qMistakes[q.id].mastery] || '待加強'}  \n`;
          }

          if (q.basis) {
            md += `\n### 正解解析：\n\n${q.basis}\n\n`;
          }
          if (q.distractor) {
            md += `### 干擾項辨析：\n\n${q.distractor}\n\n`;
          }

          if (note && note.trim()) {
            md += `### 📓 我的個人檢討與筆記：\n\n> ${note.replace(/\n/g, '\n> ')}\n\n`;
          }

          md += `---\n\n`;
        }
      });

      if (count === 0) {
        alert('目前沒有錯題或筆記可匯出！');
        return;
      }

      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `錯題筆記本_${this.currentExam}_${new Date().toISOString().slice(0, 10)}.md`;
      a.click();
      URL.revokeObjectURL(url);
    },

    resetAllProgress() {
      if (confirm('確定要清空當前試卷的所有作答記錄與筆記嗎？此操作不可逆！')) {
        this.userAnswers[this.currentExam] = {};
        this.userResults[this.currentExam] = {};
        this.mistakes[this.currentExam] = {};
        this.userNotes[this.currentExam] = {};
        this.starred[this.currentExam] = {};
        this.saveStorage();
        this.applyFilters();
        this.render();
        alert('作答記錄已重設！');
      }
    },

    bindEvents() {
      // Keyboard shortcuts
      window.addEventListener('keydown', (e) => {
        // Ignore if typing in input or textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
          this.prevQuestion();
        } else if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
          this.nextQuestion();
        } else if (e.key === 's' || e.key === 'S') {
          const curQ = this.filteredQuestions[this.currentIndex];
          if (curQ) this.toggleStar(curQ.id);
        } else if (['1', '2', '3', '4', 'a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
          const curQ = this.filteredQuestions[this.currentIndex];
          if (curQ && curQ.type === 'single_choice') {
            const map = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
            const key = map[e.key] || e.key.toUpperCase();
            this.handleOptionSelect(curQ.id, key);
          }
        }
      });

      // Search input
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.trim();
          this.applyFilters();
          this.render();
        });
      }

      // Domain filter dropdown
      const domainFilter = document.getElementById('domain-filter');
      if (domainFilter) {
        domainFilter.addEventListener('change', (e) => {
          this.filterDomain = e.target.value;
          this.applyFilters();
          this.render();
        });
      }

      // Sidebar grid click delegate
      const grid = document.getElementById('question-grid');
      if (grid) {
        grid.addEventListener('click', (e) => {
          const item = e.target.closest('.grid-item');
          if (item) {
            const idx = parseInt(item.dataset.index, 10);
            this.jumpToIndex(idx);
          }
        });
      }
    },

    render() {
      // Update UI active tabs
      document.querySelectorAll('.exam-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.exam === this.currentExam);
      });

      document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === this.currentMode);
      });

      const examBar = document.getElementById('exam-bar');
      if (examBar) {
        examBar.style.display = this.currentMode === 'exam' ? 'flex' : 'none';
      }

      this.updateQuickStats();
      this.updateSidebarGrid();
      this.renderCurrentQuestion();
    }
  };

  window.App = App;

  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
})();
