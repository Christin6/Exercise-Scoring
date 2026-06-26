'use client'

import { useState, FormEvent } from 'react'

export const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null)
  const [inputKey, setInputKey] = useState(0)
  const [statusText, setStatusText] = useState('No file selected')
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [aiResponse, setAiResponse] = useState('')

  const exampleUrl =
    'https://jjchnrscwthvzuzswgfr.supabase.co/storage/v1/object/public/uploads/example.pdf'

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
      setUploadedUrl(exampleUrl)
      setStatusText('File uploaded successfully!')
    } catch {
      setStatusText('Upload failed. Try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleAnalyze = async () => {
    try {
      setStatusText('Analyzing file...')

      const res = await fetch('/api/analyze-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: uploadedUrl }),
      })

      const data = await res.json()
      setAiResponse(data)
    } catch (err) {
      setStatusText('File analysis failed')
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
          Save File
        </button>
      </form>

      <button onClick={handleAnalyze} disabled={!uploadedUrl || isAnalyzing}>
        Analyze with AI
      </button>

      <div>{aiResponse}</div>
    </>
  )
}
