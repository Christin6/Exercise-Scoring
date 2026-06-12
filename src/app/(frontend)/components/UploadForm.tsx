'use client'

import React from 'react'

export const UploadForm = () => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const file = inputRef.current?.files?.[0]

    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const { url } = await res.json()

    // clear the file after upload
    if (inputRef.current) inputRef.current.value = ''

    // pass url to do something with it
  }

  return (
    <form className="upload" onSubmit={handleSubmit}>
      <label htmlFor="file">Upload File</label>
      <input ref={inputRef} type="file" name="file" id="file" accept=".pdf" />
      <button type="submit">Submit</button>
    </form>
  )
}
