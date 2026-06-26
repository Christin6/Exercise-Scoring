import { uploadToCloud } from '@/lib/cloud'
import { NextRequest } from 'next/server'

export const POST = async (req: NextRequest) => {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return Response.json({ error: 'No file provided' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const cloudUrl = await uploadToCloud(buffer, file.name, file.type)

  return Response.json({ url: cloudUrl })
}
