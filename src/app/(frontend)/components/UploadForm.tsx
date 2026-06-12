'use client'

import React from 'react'

export const UploadForm = () => {
  const [file, setFile] = React.useState<File | null>(null)
  const [inputKey, setInputKey] = React.useState(0)
  const [statusText, setStatusText] = React.useState('No file selected')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    const currentFile = file // capture before clearing
    setFile(null)
    setInputKey((k) => k + 1) // clear immediately

    const formData = new FormData()
    formData.append('file', currentFile)

    setStatusText('Uploading...')
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const { url } = await res.json()
    setStatusText('File uploaded successfully!')

    // use url here
  }

  return (
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
      <button type="submit">Submit</button>
      <p>{statusText}</p>
    </form>
  )
}
