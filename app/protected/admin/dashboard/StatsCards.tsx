'use client';

import { Users, FileText, Files, HardDrive, MessageCircle, MessagesSquare } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    note_count: number;
    user_count: number;
    file_count: number;
    storage_size: number;
    chat_count: number;
    message_count: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const formatStorage = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const cards = [
    {
      title: 'Total Users',
      value: stats.user_count || 0,
      icon: <Users className="h-6 w-6 text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      title: 'Total Notes',
      value: stats.note_count || 0,
      icon: <FileText className="h-6 w-6 text-green-600" />,
      color: 'bg-green-100'
    },
    {
      title: 'Total Files',
      value: stats.file_count || 0,
      icon: <Files className="h-6 w-6 text-orange-600" />,
      color: 'bg-orange-100'
    },
    {
      title: 'Storage Used',
      value: formatStorage(stats.storage_size || 0),
      icon: <HardDrive className="h-6 w-6 text-indigo-600" />,
      color: 'bg-indigo-100'
    },
    {
      title: 'Total Chats',
      value: stats.chat_count || 0,
      icon: <MessageCircle className="h-6 w-6 text-purple-600" />,
      color: 'bg-purple-100'
    },
    {
      title: 'Total Messages',
      value: stats.message_count || 0,
      icon: <MessagesSquare className="h-6 w-6 text-pink-600" />,
      color: 'bg-pink-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-600">{card.title}</p>
              <p className="text-2xl font-semibold">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}