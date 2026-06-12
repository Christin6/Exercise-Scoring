import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // service role for server-side uploads
)

export async function uploadToCloud(
  buffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<string> {
  const path = `${Date.now()}-${filename}` // unique filename

  const { error } = await supabase.storage.from('uploads').upload(path, buffer, {
    contentType: mimeType,
    upsert: false,
  })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from('uploads').getPublicUrl(path)

  return data.publicUrl
}
