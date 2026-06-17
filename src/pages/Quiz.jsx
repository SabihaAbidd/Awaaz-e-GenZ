import { useState } from 'react'

const QUESTIONS = [
  {
    text: 'Under which article of the Constitution of Pakistan is the right to education guaranteed?',
    options: [
      { letter: 'A', text: 'Article 17 - Freedom of Association' },
      { letter: 'B', text: 'Article 25A - Right to Education' },
      { letter: 'C', text: 'Article 19 - Freedom of Speech' },
      { letter: 'D', text: 'Article 9 - Security of Person' },
    ],
    answer: 'B',
    explanation: 'Article 25A provides for free and compulsory education for children aged five to sixteen.',
  },
  {
    text: 'What is the minimum voting age for citizens in Pakistan?',
    options: [
      { letter: 'A', text: '16 years' },
      { letter: 'B', text: '17 years' },
      { letter: 'C', text: '18 years' },
      { letter: 'D', text: '21 years' },
    ],
    answer: 'C',
    explanation: 'A citizen who is at least 18 and enrolled on the electoral roll can vote.',
  },
  {
    text: 'What does RTI usually stand for in civic life?',
    options: [
      { letter: 'A', text: 'Right to Information' },
      { letter: 'B', text: 'Road Tax Invoice' },
      { letter: 'C', text: 'Registered Tenant Identity' },
      { letter: 'D', text: 'Regional Trade Index' },
    ],
    answer: 'A',
    explanation: 'RTI helps citizens request information from public bodies.',
  },
  {
    text: 'Which two houses make up Pakistan\'s Parliament?',
    options: [
      { letter: 'A', text: 'Supreme Court and High Court' },
      { letter: 'B', text: 'National Assembly and Senate' },
      { letter: 'C', text: 'Cabinet and Election Commission' },
      { letter: 'D', text: 'Police and Local Council' },
    ],
    answer: 'B',
    explanation: 'Pakistan has a bicameral Parliament: the National Assembly and the Senate.',
  },
  {
    text: 'What is the safest first step when reporting a local civic issue?',
    options: [
      { letter: 'A', text: 'Post only angry comments online' },
      { letter: 'B', text: 'Collect details, evidence, location, and date' },
      { letter: 'C', text: 'Ignore it until someone else acts' },
      { letter: 'D', text: 'Send a message without any facts' },
    ],
    answer: 'B',
    explanation: 'Clear details and evidence make complaints easier to understand, track, and follow up.',
  },
]

export default function Quiz() {
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const currentQuestion = QUESTIONS[currentIndex]
  const progress = started ? ((finished ? QUESTIONS.length : currentIndex + 1) / QUESTIONS.length) * 100 : 0

  function handleStart() {
    setStarted(true)
    setCurrentIndex(0)
    setSelected(null)
    setHasAnswered(false)
    setScore(0)
    setFinished(false)
  }

  function chooseOption(letter) {
    if (!started || hasAnswered) return

    setSelected(letter)
    setHasAnswered(true)
    if (letter === currentQuestion.answer) {
      setScore((value) => value + 1)
    }
  }

  function handleNext() {
    if (!hasAnswered) return

    if (currentIndex === QUESTIONS.length - 1) {
      setFinished(true)
      return
    }

    setCurrentIndex((value) => value + 1)
    setSelected(null)
    setHasAnswered(false)
  }

  function getOptionStyle(letter) {
    if (!hasAnswered) {
      return selected === letter
        ? { background: 'var(--mint)', fontWeight: 700, boxShadow: 'var(--shadow)' }
        : {}
    }

    if (letter === currentQuestion.answer) {
      return { background: 'var(--mint)', fontWeight: 800, boxShadow: 'var(--shadow)' }
    }

    if (letter === selected) {
      return { background: 'var(--coral)', fontWeight: 800, boxShadow: 'var(--shadow)' }
    }

    return { opacity: 0.65 }
  }

  return (
    <div className="quiz-page page-wrap">
      <div className="page-header">
        <p className="page-eyebrow">Test Yourself</p>
        <h1 className="page-title">
          Civic <span className="page-title-accent">Quiz</span>
        </h1>
        <p className="page-sub">5 questions. How well do you know your rights?</p>
      </div>

      <div className="quiz-progress-bar-wrap">
        <div className="quiz-progress-label">
          <span>Progress</span>
          <span>{started ? `${finished ? QUESTIONS.length : currentIndex + 1} / ${QUESTIONS.length}` : `0 / ${QUESTIONS.length}`}</span>
        </div>
        <div className="quiz-progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="quiz-question-card" id="quiz-question-card">
        {finished ? (
          <>
            <p className="quiz-q-number">Quiz complete</p>
            <p className="quiz-question">You scored {score} out of {QUESTIONS.length}.</p>
            <p className="quiz-feedback">
              {score >= 4
                ? 'Strong civic basics. You are ready to help someone else understand the next step.'
                : 'Nice start. Replaying the quiz will lock in the basics faster than reading a long guide.'}
            </p>
          </>
        ) : (
          <>
            <p className="quiz-q-number">Question {currentIndex + 1} of {QUESTIONS.length}</p>
            <p className="quiz-question">{currentQuestion.text}</p>

            <div className="quiz-options" role="group" aria-label="Answer options">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.letter}
                  id={`quiz-option-${opt.letter.toLowerCase()}`}
                  className="quiz-option"
                  disabled={!started}
                  aria-pressed={selected === opt.letter}
                  onClick={() => chooseOption(opt.letter)}
                  style={getOptionStyle(opt.letter)}
                  type="button"
                >
                  <span className="quiz-option-letter">{opt.letter}</span>
                  {opt.text}
                </button>
              ))}
            </div>

            {hasAnswered && (
              <p className="quiz-feedback">
                {selected === currentQuestion.answer ? 'Correct. ' : 'Not quite. '}
                {currentQuestion.explanation}
              </p>
            )}
          </>
        )}
      </div>

      {!started || finished ? (
        <button
          id="quiz-start-btn"
          className="quiz-start-btn"
          onClick={handleStart}
          type="button"
        >
          {finished ? 'Restart Quiz' : 'Start Quiz'}
        </button>
      ) : (
        <button
          id="quiz-next-btn"
          className="quiz-start-btn"
          disabled={!hasAnswered}
          style={{ opacity: hasAnswered ? 1 : 0.4 }}
          onClick={handleNext}
          type="button"
        >
          {currentIndex === QUESTIONS.length - 1 ? 'See Score' : 'Next Question'}
        </button>
      )}

      {!started && (
        <p className="quiz-helper-text">
          Press Start to unlock questions and get instant feedback.
        </p>
      )}

      <div style={{ paddingBottom: '24px' }} />
    </div>
  )
}
