'use client'
import { useAnalysisStore } from '../store/analysisStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AnalysisPage() {
  const { analysis } = useAnalysisStore()
  const router = useRouter()

  // Guard — if user lands here without data, send them back
  useEffect(() => {
    if (!analysis) router.replace('/')
  }, [analysis, router])

  if (!analysis) return null

  const { questions, summary } = analysis

  return (
    <div className="analysis">
      <div className="content">
        <section className="analysis-section analysis-summary">
          <h1>Analysis Result</h1>
          <p className="analysis-observation">{summary.observation}</p>
          <dl className="analysis-stats">
            <div className="analysis-stat">
              <dt>Overall Demand</dt>
              <dd>{summary.overall_demand}</dd>
            </div>
            <div className="analysis-stat">
              <dt>Total Questions</dt>
              <dd>{summary.total}</dd>
            </div>
          </dl>
        </section>

        <section className="analysis-section">
          <h2>Cognitive Level Breakdown</h2>
          <ul className="breakdown-list">
            {Object.entries(summary.breakdown).map(([level, count]) => (
              <li key={level} className="breakdown-item">
                <span className="level-label" data-level={level}>
                  {level}
                </span>
                <span className="breakdown-count">
                  {count} {count === 1 ? 'question' : 'questions'}
                </span>
                <span className="breakdown-percent">
                  {Math.round((count / summary.total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="analysis-section">
          <h2>Question Classification</h2>
          <ul className="question-list">
            {questions.map((q) => (
              <li key={q.number} className="question-card">
                <span className="level-label" data-level={q.level}>
                  {q.level}
                </span>
                <p className="question-text">
                  <strong>Q{q.number}.</strong> {q.question}
                </p>
                <p className="question-justification">{q.justification}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="analysis-actions">
          <button type="button" onClick={() => router.push('/')}>
            Analyze another file
          </button>
        </div>
      </div>
    </div>
  )
}
