import { GoogleGenAI } from '@google/genai'
import { NextRequest } from 'next/server'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const PROMPT = `
You are an educational assessment expert. Analyze the attached exercise paper and classify
each question by cognitive demand using Bloom's Taxonomy levels:
- RECALL: Memorization, definitions, factual retrieval
- COMPREHENSION: Restate or explain in own words
- APPLICATION: Apply a known formula or method to a new problem
- ANALYSIS: Break down, compare, find patterns
- EVALUATION: Justify, argue, critique
- CREATION: Design, hypothesize, produce something new

For each question:
1. Quote the question (truncate if very long)
2. Assign a cognitive level
3. One sentence justification

Then provide a summary with total questions, breakdown by level (count + percentage),
overall demand (LOW / MIXED / HIGH), and one paragraph observation.

Respond ONLY in this JSON format, no markdown, no preamble:
{
  "questions": [
    { "number": 1, "question": "...", "level": "RECALL", "justification": "..." }
  ],
  "summary": {
    "total": 0,
    "breakdown": { "RECALL": 0, "COMPREHENSION": 0, "APPLICATION": 0, "ANALYSIS": 0, "EVALUATION": 0, "CREATION": 0 },
    "overall_demand": "MIXED",
    "observation": "..."
  }
}
`

const analyze = async (base64PDF: string) => {
  const interaction = await ai.interactions.create({
    model: 'gemini-3.5-flash',
    input: [
      { type: 'text', text: PROMPT },
      {
        type: 'document',
        data: base64PDF,
        mime_type: 'application/pdf',
      },
    ],
  })
  const text = interaction.output_text ?? ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

export const POST = async (req: NextRequest) => {
  try {
    const { fileUrl } = await req.json()
    const file = await fetch(fileUrl)
    if (!file.ok) {
      return Response.json({ error: 'Unable to fetch file' }, { status: 400 })
    }
    const buffer = await file.arrayBuffer()
    const base64PDF = Buffer.from(buffer).toString('base64')
    return Response.json(await analyze(base64PDF))
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
