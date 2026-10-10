import './style.css'

const app = document.querySelector('#app')

let first = 0
let second = 0
let score = 0
let streak = 0
let questionId = 0
let nextQuestionTimer = null
let isTransitioning = false

app.innerHTML = `
  <main class="card">
    <div class="star" aria-hidden="true">⭐</div>
    <h1>小小加法家</h1>
    <p class="subtitle">动动脑筋，成为加法小能手！</p>
    <div class="score-row" aria-live="polite">
      <div class="pill">答对：<span id="score">0</span> 题</div>
      <div class="pill blue">连续：<span id="streak">0</span> 题</div>
    </div>
    <section class="question" id="question" aria-label="加法题目"></section>
    <form id="answer-form">
      <label class="sr-only" for="answer">你的答案</label>
      <input id="answer" type="number" inputmode="numeric" autocomplete="off" placeholder="写答案" required />
      <button type="submit">提交</button>
    </form>
    <p id="message" class="message" aria-live="polite">准备好了吗？</p>
    <button id="new-game" class="new-game" type="button">换一道题</button>
    <p class="hint">小提示：认真算一算，不要着急哦！</p>
  </main>
`

const questionEl = document.querySelector('#question')
const answerEl = document.querySelector('#answer')
const form = document.querySelector('#answer-form')
const messageEl = document.querySelector('#message')
const scoreEl = document.querySelector('#score')
const streakEl = document.querySelector('#streak')
const newGameBtn = document.querySelector('#new-game')
const submitBtn = form.querySelector('button[type="submit"]')

function newQuestion() {
  if (nextQuestionTimer !== null) {
    window.clearTimeout(nextQuestionTimer)
    nextQuestionTimer = null
  }

  first = Math.floor(Math.random() * 10) + 1
  second = Math.floor(Math.random() * 10) + 1
  questionId += 1
  isTransitioning = false
  questionEl.textContent = `${first} + ${second} = ?`
  answerEl.value = ''
  answerEl.disabled = false
  submitBtn.disabled = false
  answerEl.focus()
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  if (isTransitioning) return

  const rawAnswer = answerEl.value.trim()
  if (!rawAnswer) {
    messageEl.textContent = '先写下答案再提交哦！'
    messageEl.className = 'message try'
    answerEl.focus()
    return
  }

  const submittedQuestionId = questionId
  const answer = Number(rawAnswer)
  if (Number.isFinite(answer) && answer === first + second) {
    score += 1
    streak += 1
    scoreEl.textContent = score
    streakEl.textContent = streak
    messageEl.textContent = streak > 1 ? `太棒了！连续答对 ${streak} 题！🎉` : '答对啦！你真聪明！🎉'
    messageEl.className = 'message good'
    isTransitioning = true
    answerEl.disabled = true
    submitBtn.disabled = true
    nextQuestionTimer = window.setTimeout(() => {
      // Ignore a stale timer if the player has already changed the question.
      if (questionId === submittedQuestionId) newQuestion()
    }, 650)
  } else {
    streak = 0
    streakEl.textContent = streak
    messageEl.textContent = '再想一想，你一定可以的！💪'
    messageEl.className = 'message try'
    answerEl.select()
  }
})

newGameBtn.addEventListener('click', () => {
  messageEl.textContent = '准备好了吗？'
  messageEl.className = 'message'
  newQuestion()
})

newQuestion()
