'use client'

import React from 'react'

export const UploadForm = () => {
  const [file, setFile] = React.useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const { url } = await res.json()
    // pass url to do something with it
  }

  return (
    <form className="upload" onSubmit={handleSubmit}>
      <label htmlFor="file">Upload File</label>
      <input
        type="file"
        name="file"
        id="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button type="submit">Submit</button>
    </form>
  )
}
