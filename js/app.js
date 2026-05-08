const app = document.getElementById("app");
const headerRound = document.getElementById("headerRound");
const headerSituation = document.getElementById("headerSituation");
const homeBtn = document.getElementById("homeBtn");
const resetBtn = document.getElementById("resetBtn");

let timerId = null;

const state = {
  screen: "start",
  groupCount: 5,
  groupNames: [],
  groups: [],
  savedResults: loadSavedResults(),
  viewingSavedResult: null,
  currentResultSaved: false,
  roundIndex: 0,
  selections: {},
  timerSeconds: 60,
  timerLeft: 60,
  timerRunning: false,
  captureMode: false
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function signed(value) {
  return value > 0 ? `+${value}` : `${value}`;
}

function moneyLabel(value) {
  return `${value}만원`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[char]);
}

function setScreen(screen) {
  stopTimer();
  state.screen = screen;
  render();
  window.scrollTo(0, 0);
}

function updateHeader() {
  const round = ROUNDS[state.roundIndex];
  if (["start", "intro", "setup", "roles", "saved"].includes(state.screen)) {
    headerRound.textContent = "시작 전";
    headerSituation.textContent = state.screen === "roles" ? "역할 확인" : state.screen === "saved" ? "저장 결과" : "수업 준비";
    return;
  }
  if (state.screen === "final") {
    headerRound.textContent = "5라운드 완료";
    headerSituation.textContent = "최종 정리";
    return;
  }
  headerRound.textContent = `${state.roundIndex + 1} / ${ROUNDS.length}`;
  headerSituation.textContent = round.title;
}

function render() {
  document.body.classList.toggle("capture-mode", state.captureMode);
  document.documentElement.classList.toggle("capture-mode", state.captureMode);
  updateHeader();
  if (state.screen === "start") renderStart();
  if (state.screen === "intro") renderIntro();
  if (state.screen === "setup") renderSetup();
  if (state.screen === "roles") renderRoles();
  if (state.screen === "round") renderRound();
  if (state.screen === "result") renderResult();
  if (state.screen === "final") renderFinal();
  if (state.screen === "saved") renderSavedResults();
}

function renderStart() {
  app.innerHTML = `
    <section class="screen hero">
      <div class="hero-copy">
        <p class="eyebrow">우리나라 경제와 세계화 - 물가 변동과 실업</p>
        <h2>한 달 예산을 지키며 인플레이션을 버텨라</h2>
        <p>모둠별로 경제 주체가 되어 5번의 물가 상승 상황을 해결합니다. 선택할 때마다 예산, 안정도, 위험도가 달라지고, 마지막에는 역할별 차이를 비교합니다.</p>
        <div class="actions">
          <button type="button" class="primary-button" id="startGameBtn">수업 시작</button>
          <button type="button" class="secondary-button" id="goSetupBtn">모둠 바로 설정</button>
          ${state.savedResults.length ? `<button type="button" class="ghost-button" id="savedResultsBtn">저장 결과 보기</button>` : ""}
        </div>
      </div>
      <aside class="hero-panel" aria-label="가격 상승 예시">
        <div class="price-stack">
          <div class="price-item"><span>식비</span><strong>+18%</strong></div>
          <div class="price-item"><span>교통·에너지</span><strong>+12%</strong></div>
          <div class="price-item"><span>임대료</span><strong>+15%</strong></div>
          <div class="price-item"><span>체감 물가</span><strong>상승</strong></div>
        </div>
      </aside>
    </section>
  `;
  document.getElementById("startGameBtn").addEventListener("click", () => setScreen("intro"));
  document.getElementById("goSetupBtn").addEventListener("click", () => setScreen("setup"));
  const savedBtn = document.getElementById("savedResultsBtn");
  if (savedBtn) savedBtn.addEventListener("click", () => setScreen("saved"));
}

function renderIntro() {
  app.innerHTML = `
    <section class="screen">
      <h2>오늘 활동 흐름</h2>
      <p class="lead">각 모둠은 하나의 경제 주체입니다. 물가가 오를 때 어떤 선택을 할지 정하고, 선택 결과가 우리 생활에 어떤 영향을 주는지 한 문장으로 설명합니다.</p>
      <div class="flow-grid">
        <article class="flow-card"><span>1</span><strong>역할 확인</strong><p>우리 모둠이 누구인지, 무엇이 유리하고 불리한지 봅니다.</p></article>
        <article class="flow-card"><span>2</span><strong>선택과 입력</strong><p>라운드마다 1분 안팎으로 토의하고 교사가 선택을 입력합니다.</p></article>
        <article class="flow-card"><span>3</span><strong>결과 발표</strong><p>점수보다 “왜 이런 결과가 나왔는지”를 짧게 말합니다.</p></article>
      </div>
      <div class="info-grid">
        <article class="info-panel"><h3>물가</h3><p>여러 상품과 서비스의 평균적인 가격 수준입니다. 장바구니 물건값이 함께 오르는 상황을 떠올리면 쉽습니다.</p></article>
        <article class="info-panel"><h3>인플레이션</h3><p>같은 돈으로 살 수 있는 양이 줄어드는 현상입니다. 예산은 그대로인데 생활비가 더 많이 듭니다.</p></article>
        <article class="info-panel"><h3>분배 효과</h3><p>물가 상승의 영향은 사람마다 다릅니다. 소득, 자산, 빚이 어떻게 되어 있는지가 중요합니다.</p></article>
      </div>
      <div class="actions">
        <button type="button" class="primary-button" id="introNextBtn">모둠 설정으로</button>
      </div>
    </section>
  `;
  document.getElementById("introNextBtn").addEventListener("click", () => setScreen("setup"));
}

function renderSetup() {
  if (!state.groupNames.length) {
    state.groupNames = Array.from({ length: state.groupCount }, () => "");
  }
  app.innerHTML = `
    <section class="screen">
      <h2>모둠 설정</h2>
      <div class="setup-layout">
        <aside class="setup-panel">
          <article class="pacing-note">
            <h3>20분 수업 흐름</h3>
            <p>도입 2분, 역할 확인 2분, 라운드 5회 14분, 최종 발표 2분을 기준으로 진행합니다. 발표가 길어지면 25분 안쪽에서 마무리됩니다.</p>
          </article>
          <div class="control-row">
            <label>모둠 수</label>
            <div class="stepper">
              <button type="button" id="minusGroup" aria-label="모둠 수 줄이기">-</button>
              <strong class="count-display">${state.groupCount}모둠</strong>
              <button type="button" id="plusGroup" aria-label="모둠 수 늘리기">+</button>
            </div>
          </div>
          <div class="control-row">
            <label>토의 시간</label>
            <div class="segmented" role="group" aria-label="토의 시간 선택">
              ${[45, 60, 90].map((seconds) => `<button type="button" class="${state.timerSeconds === seconds ? "active" : ""}" data-timer="${seconds}">${seconds === 90 ? "1분 30초" : `${seconds}초`}</button>`).join("")}
            </div>
          </div>
          <p class="empty-note">20분 수업은 4~5모둠, 토의 60초가 가장 안정적입니다.</p>
          <button type="button" class="primary-button" id="createGroupsBtn">역할 자동 배정</button>
        </aside>
        <div class="setup-panel">
          <h3>모둠 이름</h3>
          <div class="name-grid">
            ${Array.from({ length: state.groupCount }, (_, index) => `
              <div class="control-row">
                <label for="groupName${index}">${index + 1}모둠</label>
                <input id="groupName${index}" value="${escapeHtml(state.groupNames[index] || "")}" placeholder="${index + 1}모둠">
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
  document.getElementById("minusGroup").addEventListener("click", () => changeGroupCount(-1));
  document.getElementById("plusGroup").addEventListener("click", () => changeGroupCount(1));
  document.querySelectorAll("[data-timer]").forEach((button) => {
    button.addEventListener("click", () => {
      state.timerSeconds = Number(button.dataset.timer);
      state.timerLeft = state.timerSeconds;
      renderSetup();
    });
  });
  document.querySelectorAll("input[id^='groupName']").forEach((input, index) => {
    input.addEventListener("input", (event) => {
      state.groupNames[index] = event.target.value;
    });
  });
  document.getElementById("createGroupsBtn").addEventListener("click", createGroups);
}

function changeGroupCount(delta) {
  state.groupCount = clamp(state.groupCount + delta, 2, 8);
  state.groupNames = Array.from({ length: state.groupCount }, (_, index) => state.groupNames[index] || "");
  renderSetup();
}

function createGroups() {
  state.groups = Array.from({ length: state.groupCount }, (_, index) => {
    const role = ROLE_CARDS[index % ROLE_CARDS.length];
    const name = (state.groupNames[index] || "").trim() || `${index + 1}모둠`;
    return {
      id: `team-${index + 1}`,
      name,
      role,
      score: 0,
      money: role.initialMoney,
      stability: role.initialStability,
      risk: role.initialRisk,
      history: [],
      snapshots: [{
        label: "시작",
        score: 0,
        money: role.initialMoney,
        stability: role.initialStability,
        risk: role.initialRisk
      }]
    };
  });
  state.roundIndex = 0;
  state.selections = {};
  state.timerLeft = state.timerSeconds;
  state.currentResultSaved = false;
  setScreen("roles");
}

function renderRoles() {
  app.innerHTML = `
    <section class="screen">
      <h2>역할 배정</h2>
      <p class="lead">각 모둠은 서로 다른 경제 주체입니다. 예산은 남은 돈, 안정도는 생활을 유지하는 힘, 위험도는 앞으로 흔들릴 가능성을 뜻합니다.</p>
      <div class="role-grid">${state.groups.map(roleCard).join("")}</div>
      <div class="actions">
        <button type="button" class="primary-button" id="beginRoundBtn">1라운드 시작</button>
        <button type="button" class="secondary-button" id="backSetupBtn">모둠 다시 설정</button>
      </div>
    </section>
  `;
  document.getElementById("beginRoundBtn").addEventListener("click", () => setScreen("round"));
  document.getElementById("backSetupBtn").addEventListener("click", () => setScreen("setup"));
}

function roleCard(group) {
  return `
    <article class="role-card">
      <span class="tag">${escapeHtml(group.name)}</span>
      <h3>${group.role.name}</h3>
      <p>${group.role.description}</p>
      <p><strong>특징:</strong> ${group.role.trait}</p>
      <p><strong>유리함:</strong> ${group.role.advantage}</p>
      <p><strong>불리함:</strong> ${group.role.disadvantage}</p>
      ${metricsMarkup(group)}
    </article>
  `;
}

function metricsMarkup(group) {
  return `
    <div class="metrics">
      <div class="metric"><span>점수</span><strong>${group.score}</strong></div>
      <div class="metric"><span>예산</span><strong>${moneyLabel(group.money)}</strong></div>
      <div class="metric"><span>안정도</span><strong>${group.stability}</strong></div>
      <div class="metric"><span>위험도</span><strong>${group.risk}</strong></div>
    </div>
  `;
}

function renderRound() {
  const round = ROUNDS[state.roundIndex];
  const selectedCount = Object.keys(state.selections).length;
  app.innerHTML = `
    <section class="screen">
      ${situationMarkup(round)}
      <div class="teacher-strip">
        <div class="timer-card">
          <span>토의 타이머</span>
          <strong id="timerDisplay" class="${state.timerLeft <= 10 ? "timer-urgent" : ""}">${formatTime(state.timerLeft)}</strong>
          <div class="timer-actions">
            <button type="button" class="secondary-button compact" id="timerToggleBtn">${state.timerRunning ? "일시정지" : "시작"}</button>
            <button type="button" class="ghost-button compact" id="timerResetBtn">리셋</button>
          </div>
        </div>
        <div class="progress-card">
          <span>선택 완료</span>
          <strong>${selectedCount} / ${state.groups.length} 모둠</strong>
          <div class="progress-track"><div style="width:${(selectedCount / state.groups.length) * 100}%"></div></div>
          <p>${missingGroupsText()}</p>
        </div>
        <div class="question-card">
          <span>토론 질문</span>
          <strong>${round.question}</strong>
        </div>
      </div>
      <div class="pace-strip">
        <span>진행 순서</span>
        <strong>상황 읽기 → 모둠 선택 → 결과 확인 → 한 문장 발표</strong>
        <p>각 모둠은 선택 이유를 한 문장으로 준비합니다. 발표는 라운드마다 1모둠만 짧게 진행합니다.</p>
      </div>
      ${teacherGuideMarkup(round)}
      <div class="team-grid team-grid-compact">${state.groups.map((group) => teamChoiceCard(group, round)).join("")}</div>
      <div class="footer-bar">
        <strong>${allSelected() ? "모든 모둠 선택 완료" : "아직 선택하지 않은 모둠이 있습니다."}</strong>
        <button type="button" class="primary-button" id="showResultBtn" ${allSelected() ? "" : "disabled"}>결과 보기</button>
      </div>
    </section>
  `;
  document.querySelectorAll(".choice-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.selections[button.dataset.groupId] = button.dataset.choiceId;
      renderRound();
    });
  });
  document.getElementById("showResultBtn").addEventListener("click", applyRoundResults);
  document.getElementById("timerToggleBtn").addEventListener("click", toggleTimer);
  document.getElementById("timerResetBtn").addEventListener("click", resetTimer);
}

function teacherGuideMarkup(round) {
  return `
    <details class="teacher-guide">
      <summary>교사용 힌트와 학습지 연결</summary>
      <div class="guide-grid">
        <article>
          <span>진행자 노트</span>
          <p>${round.teacherNote}</p>
        </article>
        <article>
          <span>학습지 연결</span>
          <p>${round.worksheetPoint}</p>
        </article>
      </div>
    </details>
  `;
}

function situationMarkup(round) {
  return `
    <article class="situation-card">
      <div class="round-badge">${state.roundIndex + 1}라운드<br>${round.title}</div>
      <div class="situation-copy">
        <strong class="inflation-rate">${round.rate}</strong>
        <p>${round.situation}</p>
      </div>
    </article>
  `;
}

function teamChoiceCard(group, round) {
  const selectedId = state.selections[group.id];
  return `
    <article class="team-card ${selectedId ? "selected" : "needs-choice"}">
      <div class="team-head">
        <h3>${escapeHtml(group.name)}</h3>
        <span class="role-name">${group.role.name}</span>
      </div>
      <div class="choice-state">${selectedId ? "선택 완료" : "선택 대기"}</div>
      ${metricsMarkup(group)}
      <div class="choices">
        ${round.choices.map((choice) => `
          <button type="button" class="choice-button ${selectedId === choice.id ? "active" : ""}" data-group-id="${group.id}" data-choice-id="${choice.id}">
            ${choice.label}
            <small>${choice.hint}</small>
          </button>
        `).join("")}
      </div>
    </article>
  `;
}

function allSelected() {
  return state.groups.every((group) => state.selections[group.id]);
}

function missingGroupsText() {
  const missing = state.groups.filter((group) => !state.selections[group.id]).map((group) => group.name);
  if (!missing.length) return "모든 모둠의 선택이 입력되었습니다.";
  return `대기: ${missing.join(", ")}`;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function toggleTimer() {
  state.timerRunning = !state.timerRunning;
  if (state.timerRunning) {
    timerId = window.setInterval(() => {
      state.timerLeft = Math.max(0, state.timerLeft - 1);
      const display = document.getElementById("timerDisplay");
      if (display) {
        display.textContent = formatTime(state.timerLeft);
        display.classList.toggle("timer-urgent", state.timerLeft <= 10);
      }
      if (state.timerLeft === 0) {
        stopTimer();
        renderRound();
      }
    }, 1000);
  } else {
    stopTimer(false);
  }
  renderRound();
}

function resetTimer() {
  stopTimer(false);
  state.timerLeft = state.timerSeconds;
  renderRound();
}

function stopTimer(resetRunning = true) {
  if (timerId) window.clearInterval(timerId);
  timerId = null;
  if (resetRunning) state.timerRunning = false;
}

function mergeEffects(...effects) {
  return effects.reduce((sum, effect) => {
    if (!effect) return sum;
    return {
      scoreChange: sum.scoreChange + (effect.scoreChange || 0),
      moneyChange: sum.moneyChange + (effect.moneyChange || 0),
      stabilityChange: sum.stabilityChange + (effect.stabilityChange || 0),
      riskChange: sum.riskChange + (effect.riskChange || 0)
    };
  }, { scoreChange: 0, moneyChange: 0, stabilityChange: 0, riskChange: 0 });
}

function applyRoundResults() {
  const round = ROUNDS[state.roundIndex];
  state.groups.forEach((group) => {
    const choice = round.choices.find((item) => item.id === state.selections[group.id]);
    const roleEffect = round.roleAdjustments[group.role.name]?.[choice.id];
    const pressureEffect = roundPressureEffect(group, choice.id);
    const effect = mergeEffects(choice.effect, roleEffect, pressureEffect);
    group.score += effect.scoreChange;
    group.money = Math.max(0, group.money + effect.moneyChange);
    group.stability = clamp(group.stability + effect.stabilityChange, 0, 100);
    group.risk = clamp(group.risk + effect.riskChange, 0, 100);
    group.history.push({ round: state.roundIndex + 1, roundTitle: round.title, choiceLabel: choice.label, effect });
    group.snapshots.push({
      label: `${state.roundIndex + 1}R`,
      score: group.score,
      money: group.money,
      stability: group.stability,
      risk: group.risk
    });
  });
  setScreen("result");
}

function roundPressureEffect(group, choiceId) {
  const pressure = [
    { scoreChange: 0, moneyChange: -4, stabilityChange: -1, riskChange: 2 },
    { scoreChange: 0, moneyChange: -5, stabilityChange: -2, riskChange: 3 },
    { scoreChange: 0, moneyChange: group.role.name === "대출자" ? -8 : 0, stabilityChange: 0, riskChange: group.role.name === "대출자" ? 5 : 0 },
    { scoreChange: 0, moneyChange: group.role.name === "건물 소유자" ? 5 : -5, stabilityChange: group.role.name === "건물 소유자" ? 2 : -2, riskChange: group.role.name === "건물 소유자" ? -1 : 3 },
    { scoreChange: 0, moneyChange: -3, stabilityChange: -2, riskChange: 3 }
  ][state.roundIndex];
  if (choiceId === "budgetPlan" || choiceId === "reserve") {
    return mergeEffects(pressure, { stabilityChange: 2, riskChange: -2 });
  }
  return pressure;
}

function renderResult() {
  const round = ROUNDS[state.roundIndex];
  app.innerHTML = `
    <section class="screen">
      <h2>${state.roundIndex + 1}라운드 결과</h2>
      <div class="result-grid">${state.groups.map(resultCard).join("")}</div>
      <article class="explain-box">
        <h3>경제 개념 해설</h3>
        <p><strong>${round.quickDebrief}</strong></p>
        <details class="more-explain">
          <summary>자세한 해설 보기</summary>
          <p>${round.explanation}</p>
        </details>
      </article>
      <article class="question-card wide">
        <span>발표 질문</span>
        <strong>우리 모둠의 선택은 예산, 안정도, 위험도 중 무엇을 가장 크게 바꾸었나요?</strong>
      </article>
      ${teacherGuideMarkup(round)}
      <div class="actions">
        <button type="button" class="primary-button" id="nextRoundBtn">${state.roundIndex === ROUNDS.length - 1 ? "최종 결과 보기" : "다음 라운드"}</button>
      </div>
    </section>
  `;
  document.getElementById("nextRoundBtn").addEventListener("click", () => {
    if (state.roundIndex === ROUNDS.length - 1) {
      setScreen("final");
      return;
    }
    state.roundIndex += 1;
    state.selections = {};
    state.timerLeft = state.timerSeconds;
    setScreen("round");
  });
}

function resultCard(group) {
  const last = group.history[group.history.length - 1];
  return `
    <article class="result-card">
      <div class="team-head">
        <h3>${escapeHtml(group.name)}</h3>
        <span class="role-name">${group.role.name}</span>
      </div>
      <p class="empty-note">선택: <strong>${last.choiceLabel}</strong></p>
      <div class="delta-list">
        ${deltaMarkup("점수", last.effect.scoreChange)}
        ${deltaMarkup("예산", last.effect.moneyChange, "만원")}
        ${deltaMarkup("안정도", last.effect.stabilityChange)}
        ${deltaMarkup("위험도", last.effect.riskChange, "", true)}
      </div>
      ${metricsMarkup(group)}
    </article>
  `;
}

function deltaMarkup(label, value, unit = "", inverse = false) {
  const positive = inverse ? value < 0 : value > 0;
  const className = value === 0 ? "" : positive ? "up" : "down";
  const trendClass = value === 0 ? "trend-flat" : value > 0 ? "trend-up" : "trend-down";
  return `<div class="delta ${className} ${trendClass}">${label} ${signed(value)}${unit}</div>`;
}

function renderFinal() {
  const groups = state.viewingSavedResult?.groups || state.groups;
  const savedAt = state.viewingSavedResult?.savedAt;
  const byScore = [...groups].sort((a, b) => b.score - a.score);
  const stable = [...groups].sort((a, b) => b.stability - a.stability)[0];
  const richest = [...groups].sort((a, b) => b.money - a.money)[0];
  const safest = [...groups].sort((a, b) => a.risk - b.risk)[0];
  app.innerHTML = `
    <section class="screen final-screen">
      <div class="final-head">
        <div>
          <h2>최종 결과</h2>
          ${savedAt ? `<p class="empty-note">저장된 결과: ${formatSavedDate(savedAt)}</p>` : ""}
        </div>
        <div class="capture-tools">
          <button type="button" class="secondary-button capture-toggle" id="captureToggleBtn">${state.captureMode ? "일반 보기" : "캡처용 보기"}</button>
          <span>인쇄: Ctrl+P / Cmd+P</span>
        </div>
      </div>
      <div class="winner-grid">
        <div class="winner-card"><span>가장 안정적으로 대응한 모둠</span><strong>${escapeHtml(stable.name)}</strong></div>
        <div class="winner-card"><span>예산을 가장 많이 남긴 모둠</span><strong>${escapeHtml(richest.name)}</strong></div>
        <div class="winner-card"><span>위험도가 가장 낮은 모둠</span><strong>${escapeHtml(safest.name)}</strong></div>
      </div>
      <div class="chart-grid">${byScore.map((group) => chartCard(group)).join("")}</div>
      <section class="trend-section">
        <h3>라운드별 변화 추이</h3>
        <div class="trend-grid">${byScore.map((group) => trendCard(group)).join("")}</div>
      </section>
      <table class="rank-table">
        <thead><tr><th>순위</th><th>모둠</th><th>역할</th><th>점수</th><th>예산</th><th>안정도</th><th>위험도</th></tr></thead>
        <tbody>
          ${byScore.map((group, index) => `
            <tr><td>${index + 1}</td><td>${escapeHtml(group.name)}</td><td>${group.role.name}</td><td>${group.score}</td><td>${moneyLabel(group.money)}</td><td>${group.stability}</td><td>${group.risk}</td></tr>
          `).join("")}
        </tbody>
      </table>
      <article class="summary-panel"><h3>역할별 결과 차이</h3><p>${roleSummary(groups)}</p></article>
      <article class="summary-panel"><h3>마무리 발표</h3><p>1위 모둠은 가장 효과적이었던 선택을, 위험도가 낮은 모둠은 위험을 줄인 방법을 한 문장씩 발표합니다.</p></article>
      <article class="explain-box"><h3>수업 정리</h3><p>인플레이션은 모든 사람에게 같은 영향을 주지 않습니다. 고정 소득자, 예금자, 대출자, 실물 자산 소유자처럼 각자의 경제적 상황에 따라 유리함과 불리함이 달라집니다.</p></article>
      <div class="actions final-actions">
        ${state.viewingSavedResult ? `<button type="button" class="ghost-button" id="backSavedBtn">저장 목록으로</button>` : state.currentResultSaved ? `<button type="button" class="ghost-button" disabled>저장 완료</button>` : `<button type="button" class="ghost-button" id="saveResultBtn">결과 저장</button>`}
        <button type="button" class="primary-button" id="restartBtn">다시 진행하기</button>
        <button type="button" class="secondary-button" id="setupAgainBtn">모둠 바꿔 새 게임</button>
      </div>
    </section>
  `;
  document.getElementById("captureToggleBtn").addEventListener("click", () => {
    state.captureMode = !state.captureMode;
    document.body.classList.toggle("capture-mode", state.captureMode);
    document.documentElement.classList.toggle("capture-mode", state.captureMode);
    renderFinal();
    window.scrollTo(0, 0);
  });
  const saveResultBtn = document.getElementById("saveResultBtn");
  if (saveResultBtn) saveResultBtn.addEventListener("click", saveCurrentResult);
  const backSavedBtn = document.getElementById("backSavedBtn");
  if (backSavedBtn) backSavedBtn.addEventListener("click", () => {
    state.viewingSavedResult = null;
    setScreen("saved");
  });
  document.getElementById("restartBtn").addEventListener("click", resetAll);
  document.getElementById("setupAgainBtn").addEventListener("click", () => {
    state.groups = [];
    state.roundIndex = 0;
    state.selections = {};
    state.captureMode = false;
    state.viewingSavedResult = null;
    state.currentResultSaved = false;
    setScreen("setup");
  });
}

function chartCard(group) {
  return `
    <article class="chart-card">
      <h3>${escapeHtml(group.name)}</h3>
      <p>${group.role.name}</p>
      ${bar("점수", clamp(group.score + 30, 0, 100), group.score)}
      ${bar("예산", clamp(group.money, 0, 150) / 1.5, moneyLabel(group.money))}
      ${bar("안정도", group.stability, group.stability)}
      ${bar("위험도", group.risk, group.risk, true)}
    </article>
  `;
}

function bar(label, percent, value, danger = false) {
  return `<div class="bar-row"><span>${label}</span><div class="bar"><div class="${danger ? "danger-fill" : ""}" style="width:${clamp(percent, 0, 100)}%"></div></div><strong>${value}</strong></div>`;
}

function trendCard(group) {
  return `
    <article class="trend-card">
      <div class="team-head">
        <h3>${escapeHtml(group.name)}</h3>
        <span class="role-name">${group.role.name}</span>
      </div>
      ${trendMetric(group, "예산", "money", 150, "만원")}
      ${trendMetric(group, "안정도", "stability", 100)}
      ${trendMetric(group, "위험도", "risk", 100, "", true)}
    </article>
  `;
}

function trendMetric(group, label, key, max, unit = "", danger = false) {
  const snapshots = group.snapshots || [];
  return `
    <div class="trend-metric">
      <strong>${label}</strong>
      <div class="sparkline" aria-label="${label} 변화 추이">
        ${snapshots.map((snap) => {
          const height = clamp((snap[key] / max) * 100, 4, 100);
          return `<span class="${danger ? "danger-fill" : ""}" style="height:${height}%" title="${snap.label}: ${snap[key]}${unit}"></span>`;
        }).join("")}
      </div>
      <div class="trend-labels">${snapshots.map((snap) => `<span>${snap.label}</span>`).join("")}</div>
    </div>
  `;
}

function roleSummary(groups = state.groups) {
  const roles = groups.map((group) => group.role.name).join(", ");
  return `${roles} 역할은 같은 물가 상승을 서로 다르게 경험했습니다. 고정 소득이나 현금 중심 자산은 구매력 하락에 약했고, 대출자는 금리 상승 때 부담이 커졌습니다. 반대로 실물 자산을 가진 경우에는 임대료나 자산 가치 상승이 도움이 될 수 있었지만, 관리비와 위험도 함께 커졌습니다.`;
}

function resetAll() {
  stopTimer();
  state.screen = "start";
  state.groupCount = 5;
  state.groupNames = [];
  state.groups = [];
  state.roundIndex = 0;
  state.selections = {};
  state.timerSeconds = 60;
  state.timerLeft = 60;
  state.captureMode = false;
  state.viewingSavedResult = null;
  state.currentResultSaved = false;
  render();
}

function loadSavedResults() {
  try {
    return JSON.parse(localStorage.getItem("inflationGameResults") || "[]");
  } catch {
    return [];
  }
}

function persistSavedResults() {
  localStorage.setItem("inflationGameResults", JSON.stringify(state.savedResults));
}

function saveCurrentResult() {
  const result = {
    id: `result-${Date.now()}`,
    savedAt: new Date().toISOString(),
    groups: JSON.parse(JSON.stringify(state.groups))
  };
  state.savedResults = [result, ...state.savedResults].slice(0, 5);
  state.currentResultSaved = true;
  persistSavedResults();
  renderFinal();
}

function renderSavedResults() {
  app.innerHTML = `
    <section class="screen">
      <h2>저장된 수업 결과</h2>
      <p class="lead">최근 5개의 최종 결과를 이 브라우저에 임시 저장합니다. 같은 컴퓨터에서 수업 기록을 다시 확인할 수 있습니다.</p>
      ${state.savedResults.length ? `
        <div class="saved-list">
          ${state.savedResults.map((result) => savedResultCard(result)).join("")}
        </div>
      ` : `<article class="summary-panel"><p>아직 저장된 결과가 없습니다. 최종 결과 화면에서 “결과 저장”을 눌러 기록할 수 있습니다.</p></article>`}
      <div class="actions">
        <button type="button" class="primary-button" id="newGameFromSavedBtn">새 게임 시작</button>
        ${state.savedResults.length ? `<button type="button" class="danger-button" id="clearSavedBtn">저장 결과 지우기</button>` : ""}
      </div>
    </section>
  `;
  document.querySelectorAll("[data-view-result]").forEach((button) => {
    button.addEventListener("click", () => {
      state.viewingSavedResult = state.savedResults.find((result) => result.id === button.dataset.viewResult);
      state.captureMode = false;
      setScreen("final");
    });
  });
  document.getElementById("newGameFromSavedBtn").addEventListener("click", resetAll);
  const clearBtn = document.getElementById("clearSavedBtn");
  if (clearBtn) clearBtn.addEventListener("click", () => {
    if (confirm("저장된 수업 결과를 모두 지울까요?")) {
      state.savedResults = [];
      persistSavedResults();
      renderSavedResults();
    }
  });
}

function savedResultCard(result) {
  const top = [...result.groups].sort((a, b) => b.score - a.score)[0];
  return `
    <article class="saved-card">
      <div>
        <h3>${formatSavedDate(result.savedAt)}</h3>
        <p>1위: ${escapeHtml(top.name)} (${top.role.name}) · 점수 ${top.score}</p>
      </div>
      <button type="button" class="secondary-button" data-view-result="${result.id}">다시 보기</button>
    </article>
  `;
}

function formatSavedDate(value) {
  return new Date(value).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

homeBtn.addEventListener("click", () => setScreen("start"));
resetBtn.addEventListener("click", () => {
  if (confirm("모든 진행 상황을 초기화할까요?")) resetAll();
});

render();
