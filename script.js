/* ─── XP SYSTEM ─── */
let xp = 0, level = 1, streak = 0;
const XP_PER_LEVEL = 200;

function addXP(amount) {
  xp += amount;
  if (xp >= XP_PER_LEVEL) { xp -= XP_PER_LEVEL; level++; }
  document.getElementById('xp-val').textContent = xp;
  document.getElementById('lvl-val').textContent = level;
  document.getElementById('xp-fill').style.width = (xp / XP_PER_LEVEL * 100) + '%';
  const toast = document.getElementById('xp-toast');
  toast.textContent = '+' + amount + ' XP ✓';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}

function checkItem(el) {
  if (el.classList.contains('done')) return;
  el.classList.add('done');
  el.textContent = '✓';
  const xpAmt = parseInt(el.dataset.xp);
  addXP(xpAmt);
}

/* ─── ACCORDION ─── */
function toggleAcc(head) {
  const item = head.parentElement;
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

/* ─── QUIZ DATA ─── */
const questions = [
  {
    q: "¿En qué año colapsó la Bolsa de Nueva York dando inicio a la Gran Depresión?",
    opts: ["1921","1929","1933","1939"],
    correct: 1, topic: "Crisis 1929",
    explanation: "El 24 de octubre de 1929 (Jueves Negro), la Bolsa de Nueva York colapsó, iniciando la Gran Depresión mundial."
  },
  {
    q: "Según la Liga de las Naciones, ¿qué país fue el más afectado por la crisis de 1929?",
    opts: ["Estados Unidos","Alemania","Chile","Argentina"],
    correct: 2, topic: "Crisis 1929 en Chile",
    explanation: "Chile fue el país más afectado debido a su dependencia del salitre, cuyo precio se derrumbó con la crisis."
  },
  {
    q: "¿Cuál es la diferencia fundamental entre autoritarismo y totalitarismo?",
    opts: [
      "El autoritarismo usa más violencia",
      "El totalitarismo controla todos los aspectos de la vida social, el autoritarismo solo lo político",
      "El totalitarismo es solo de izquierda",
      "No hay diferencia real entre ambos"
    ],
    correct: 1, topic: "Totalitarismos",
    explanation: "El totalitarismo busca controlar TODO (política, economía, educación, cultura, medios). El autoritarismo controla el poder político pero no necesariamente la vida privada."
  },
  {
    q: "¿Quién fue el líder del régimen fascista en Italia?",
    opts: ["Adolf Hitler","Francisco Franco","Benito Mussolini","Joseph Stalin"],
    correct: 2, topic: "Regímenes totalitarios",
    explanation: "Benito Mussolini lideró el fascismo italiano desde 1922. Fue el primer régimen totalitario fascista de la Historia."
  },
  {
    q: "¿Qué evento hizo que EE.UU. entrara a la Segunda Guerra Mundial?",
    opts: [
      "La invasión alemana a Polonia",
      "La Operación Barbaroja",
      "El ataque japonés a Pearl Harbor",
      "La caída de Francia"
    ],
    correct: 2, topic: "Segunda Guerra Mundial",
    explanation: "El 7 de diciembre de 1941, Japón atacó la base naval estadounidense de Pearl Harbor, lo que llevó a EE.UU. a declarar la guerra al Eje."
  },
  {
    q: "¿Cómo se llamó la operación alemana de invasión a la URSS en 1941?",
    opts: ["Operación Overlord","Operación Barbaroja","Operación Dynamo","Operación Market Garden"],
    correct: 1, topic: "Segunda Guerra Mundial",
    explanation: "La Operación Barbaroja fue la invasión alemana a la URSS en 1941. Hitler rompió así el Pacto de No Agresión con Stalin."
  },
  {
    q: "¿Cuántos países firmaron la Carta de las Naciones Unidas en San Francisco en 1945?",
    opts: ["23 países","50 países","70 países","193 países"],
    correct: 1, topic: "ONU y DDHH",
    explanation: "El 26 de junio de 1945, 50 países firmaron la Carta de las Naciones Unidas en San Francisco, EE.UU."
  },
  {
    q: "¿En qué año se aprobó la Declaración Universal de los Derechos Humanos?",
    opts: ["1945","1947","1948","1950"],
    correct: 2, topic: "ONU y DDHH",
    explanation: "La DUDH fue aprobada por la ONU el 10 de diciembre de 1948, como respuesta a los horrores de la Segunda Guerra Mundial."
  }
];

let currentQ = 0, answered = 0, correct = 0;

function renderQuiz() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';
  questions.forEach((q, qi) => {
    const div = document.createElement('div');
    div.className = 'quiz-card';
    div.id = 'qcard-' + qi;
    div.innerHTML = `
      <div class="quiz-meta">
        <span class="quiz-num">${qi + 1} / ${questions.length}</span>
        <span class="quiz-topic">${q.topic}</span>
      </div>
      <div class="quiz-q">${q.q}</div>
      <div class="quiz-opts">
        ${q.opts.map((o, oi) => `
          <button class="quiz-opt" onclick="answerQ(${qi},${oi})">
            <span class="opt-letter">${['A','B','C','D'][oi]}</span>
            ${o}
          </button>
        `).join('')}
      </div>
      <div class="quiz-feedback" id="qfb-${qi}"></div>
    `;
    container.appendChild(div);
  });
}

function answerQ(qi, chosen) {
  const q = questions[qi];
  const card = document.getElementById('qcard-' + qi);
  const opts = card.querySelectorAll('.quiz-opt');
  const fb = document.getElementById('qfb-' + qi);

  opts.forEach((o, i) => {
    o.classList.add('disabled');
    if (i === q.correct) o.classList.add('correct');
    else if (i === chosen && chosen !== q.correct) o.classList.add('wrong');
  });

  const isCorrect = chosen === q.correct;
  answered++;
  if (isCorrect) {
    correct++;
    streak++;
    addXP(15);
    fb.className = 'quiz-feedback ok show';
    fb.innerHTML = '✅ ' + q.explanation;
    document.getElementById('streak-val').textContent = streak;
    if (streak >= 2) {
      const st = document.getElementById('streak-toast');
      document.getElementById('st-count').textContent = streak;
      st.classList.add('show');
      setTimeout(() => st.classList.remove('show'), 2000);
    }
  } else {
    streak = 0;
    document.getElementById('streak-val').textContent = 0;
    fb.className = 'quiz-feedback fail show';
    fb.innerHTML = '❌ ' + q.explanation;
  }

  if (answered === questions.length) {
    setTimeout(showResult, 700);
  }
}

function showResult() {
  document.getElementById('quiz-container').style.display = 'none';
  const res = document.getElementById('quiz-result');
  res.style.display = 'block';
  const pct = Math.round(correct / questions.length * 100);
  document.getElementById('result-score').textContent = correct + '/' + questions.length + ' correctas (' + pct + '%)';
  const msgs = [
    [0, 40, '¡Sigue estudiando! Repasa las secciones de arriba 📚'],
    [40, 70, '¡Buen intento! Ya tienes una base sólida 👍'],
    [70, 90, '¡Muy bien! Casi todo correcto 🌟'],
    [90, 101, '¡Perfecto! Eres un crack de la Historia 🏆']
  ];
  const msg = msgs.find(m => pct >= m[0] && pct < m[1]);
  document.getElementById('result-msg').textContent = msg[2];
  addXP(correct * 5);
}

function restartQuiz() {
  answered = 0; correct = 0; streak = 0;
  document.getElementById('streak-val').textContent = 0;
  document.getElementById('quiz-result').style.display = 'none';
  document.getElementById('quiz-container').style.display = 'block';
  renderQuiz();
}

renderQuiz();

/* ─── INTERSECTION OBSERVER ─── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* ─── NAV ACTIVE ─── */
const sections = ['hero','crisis','totalitarismos','sgm','holocausto','consecuencias-sgm','quiz-section'];
const navPills = document.querySelectorAll('.nav-pill');

window.addEventListener('scroll', () => {
  let cur = 0;
  sections.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 180) cur = i;
  });
  navPills.forEach((p, i) => p.classList.toggle('active', i === cur));
}, { passive: true });