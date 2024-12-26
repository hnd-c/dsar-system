import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Home() {
  return (
    <div className="flex flex-col gap-4 min-h-screen p-8">
      <h2 className="font-medium text-xl mb-2">Welcome to the SuperAPP</h2>
      <p className="text-gray-600">Sign in to access the following features:</p>
      <a 
        href="/protected/keep-requests" 
        className="text-blue-500 hover:underline inline-block mt-2">
        Notes Taking
      </a>
      <a 
        href="/protected/files-storage" 
        className="text-blue-500 hover:underline inline-block mt-2">
        Files Storage
      </a>
      <a 
        href="/protected/chat" 
        className="text-blue-500 hover:underline inline-block mt-2">
        Chat Assistant
      </a>
    </div>
  );
}
