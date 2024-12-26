import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import StatsCards from './StatsCards';

interface StatRecord {
  day: string;
  note_count: number;
  user_count: number;
  file_count: number;
  storage_size: number;
  chat_count: number;
  message_count: number;
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/sign-in');
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return redirect('/protected');
  }

  // Fetch stats
  const { data: stats, error } = await supabase
    .rpc('get_admin_statistics');

  if (error) {
    console.error('Error fetching stats:', error);
    throw new Error('Error loading dashboard');
  }

  const latestStats = stats[stats.length - 1] || {
    note_count: 0,
    user_count: 0,
    file_count: 0,
    storage_size: 0
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      <StatsCards stats={{
        note_count: Number(latestStats.note_count) || 0,
        user_count: Number(latestStats.user_count) || 0,
        file_count: Number(latestStats.file_count) || 0,
        storage_size: Number(latestStats.storage_size) || 0,
        chat_count: Number(latestStats.chat_count) || 0,
        message_count: Number(latestStats.message_count) || 0
      }} />
    </div>
  );
}