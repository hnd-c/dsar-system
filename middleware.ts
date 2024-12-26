import { type NextRequest } from "next/server";
import { createClient } from '@/utils/supabase/server'
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)
  
  // Get authenticated user
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (user && !error) {
    // Check if profile exists
    const { data: profile } = await supabase
      .from('profiles')
      .select()
      .eq('id', user.id)
      .single()
    
    // Create profile if it doesn't exist
    if (!profile) {
      await supabase.from('profiles').insert({
        id: user.id,
        role: 'user',
        created_at: new Date().toISOString()
      })
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
