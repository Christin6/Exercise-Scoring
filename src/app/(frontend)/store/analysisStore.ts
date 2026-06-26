import { create } from 'zustand'

type Analysis = {
  questions: { number: number; question: string; level: string; justification: string }[]
  summary: {
    total: number
    breakdown: Record<string, number>
    overall_demand: string
    observation: string
  }
}

type AnalysisStore = {
  fileUrl: string | null
  analysis: Analysis | null
  isAnalyzing: boolean
  setFileUrl: (url: string) => void
  setAnalysis: (analysis: Analysis) => void
  setIsAnalyzing: (val: boolean) => void
}

export const useAnalysisStore = create<AnalysisStore>()((set) => ({
  fileUrl: null,
  analysis: null,
  isAnalyzing: false,
  setFileUrl: (url) => set({ fileUrl: url }),
  setAnalysis: (analysis) => set({ analysis }),
  setIsAnalyzing: (val) => set({ isAnalyzing: val }),
}))
