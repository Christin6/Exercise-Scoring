'use client'

import { useState, FormEvent } from 'react'
import { useAnalysisStore } from '../store/analysisStore'
import { useRouter } from 'next/navigation'

export const UploadForm = () => {
  const router = useRouter()

  const { fileUrl, isAnalyzing, analysis, setFileUrl, setAnalysis, setIsAnalyzing } =
    useAnalysisStore()

  const [file, setFile] = useState<File | null>(null)
  const [inputKey, setInputKey] = useState(0)
  const [statusText, setStatusText] = useState('No file selected')
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    const currentFile = file // capture before clearing
    setFile(null)
    setInputKey((k) => k + 1) // clear immediately

    const formData = new FormData()
    formData.append('file', currentFile)

    setStatusText('Uploading...')
    setIsUploading(true)

    try {
      const res = await fetch('/api/upload-file-to-db', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      setFileUrl(url)
      setStatusText('File uploaded successfully!')
    } catch {
      setStatusText('Upload failed. Try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleAnalyze = async () => {
    setStatusText('Analyzing file...')
    setIsAnalyzing(true)
    try {
      const res = await fetch('/api/analyze-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl }),
      })
      const data = await res.json()
      setAnalysis(data)
      router.push('/analysis')
    } catch (err) {
      setStatusText('File analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <>
      <p>{statusText}</p>
      <form className="upload" onSubmit={handleSubmit}>
        <label htmlFor="file">Upload File</label>
        <input
          key={inputKey}
          type="file"
          name="file"
          id="file"
          accept=".pdf"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null)
            setStatusText('File selected')
          }}
        />
        <button type="submit" disabled={!file || isUploading}>
          Upload File
        </button>
      </form>
      <button onClick={handleAnalyze} disabled={!fileUrl || isAnalyzing}>
        Analyze with AI
      </button>
    </>
  )
}
