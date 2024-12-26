import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin';

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Profile</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      
      <div>
        <h2 className="font-bold text-2xl mb-4">Features</h2>
        <div className="flex flex-col gap-2">
          <Link href="/protected/keep-requests" className="text-blue-500 hover:underline">
            Notes
          </Link>
          <Link href="/protected/files-storage" className="text-blue-500 hover:underline">
            Files
          </Link>
          <Link href="/protected/chat" className="text-blue-500 hover:underline">
            Chat Assistant
          </Link>
          {isAdmin && (
            <Link href="/protected/admin/dashboard" className="text-blue-500 hover:underline">
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
      
      {/* <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        <FetchDataSteps />
      </div> */}
    </div>
  );
}
