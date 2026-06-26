'use client'
import { useAnalysisStore } from '../store/analysisStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const LEVEL_COLORS: Record<string, string> = {
  RECALL: '#ef4444',
  COMPREHENSION: '#f97316',
  APPLICATION: '#eab308',
  ANALYSIS: '#22c55e',
  EVALUATION: '#3b82f6',
  CREATION: '#8b5cf6',
}

export default function AnalysisPage() {
  const { analysis } = useAnalysisStore()
  const router = useRouter()

  // Guard — if user lands here without data, send them back
  useEffect(() => {
    if (!analysis) router.replace('/')
  }, [analysis])

  if (!analysis) return null

  const { questions, summary } = analysis

  return (
    <main className="content">
      {/* Summary Section */}
      <section>
        <h1>Analysis Result</h1>
        <p>{summary.observation}</p>
        <p>
          Overall Demand: <strong>{summary.overall_demand}</strong>
        </p>
        <p>
          Total Questions: <strong>{summary.total}</strong>
        </p>
      </section>

      {/* Breakdown Section */}
      <section>
        <h2>Cognitive Level Breakdown</h2>
        {Object.entries(summary.breakdown).map(([level, count]) => (
          <div key={level}>
            <span style={{ color: LEVEL_COLORS[level] }}>{level}</span>
            <span>{count} questions</span>
            <span>({Math.round((count / summary.total) * 100)}%)</span>
          </div>
        ))}
      </section>

      {/* Questions Section */}
      <section>
        <h2>Question Classification</h2>
        {questions.map((q) => (
          <div key={q.number}>
            <span style={{ color: LEVEL_COLORS[q.level] }}>{q.level}</span>
            <p>
              <strong>Q{q.number}.</strong> {q.question}
            </p>
            <p>{q.justification}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
