import { headers as getHeaders } from 'next/headers.js'
import { UploadForm } from './components/UploadForm'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await configPromise
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div className="home">
      <div className="content">
        {!user && <h1>Welcome to [].</h1>}
        {user && <h1>Welcome back, {user.email}</h1>}
        <UploadForm />
      </div>
    </div>
  )
}
