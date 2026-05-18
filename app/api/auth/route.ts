import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 })
  }
  
  return new Response(JSON.stringify({ authenticated: true, email: user.email }), { status: 200 })
}