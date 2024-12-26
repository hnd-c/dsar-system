import { createClient } from "@/utils/supabase/server";
import ChatInterface from "./components/ChatInterface";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect("/sign-in");
  }

  const { data: chats } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_deleted', false)
    .order('updated_at', { ascending: false })
    .limit(1);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ChatInterface 
        initialChat={chats?.[0]} 
        userId={user.id}
      />
    </div>
  );
}