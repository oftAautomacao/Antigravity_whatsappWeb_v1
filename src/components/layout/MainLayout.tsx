import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import ChatArea from '../chat/ChatArea';
import QRCodeDisplay from './QRCodeDisplay';
import { type Chat, mockChats } from '../../data/mockData';
import { io } from 'socket.io-client';

const MainLayout: React.FC = () => {
  const [activeChat, setActiveChat] = useState<Chat | undefined>(undefined);
  const [chats, setChats] = useState<Chat[]>([]);
  const [qrCode, setQrCode] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Connected to backend');
    });

    socket.on('qr_code', (qr: string) => {
      setQrCode(qr);
      setIsConnected(false);
    });

    socket.on('connection_status', (status: string) => {
      if (status === 'open') {
        setIsConnected(true);
        setQrCode('');
      }
    });

    socket.on('chats_update', (newChats: any[]) => {
      console.log('Chats updated:', newChats);

      const mappedChats: Chat[] = newChats.map(c => ({
        id: c.id,
        name: c.name || c.id.replace('@s.whatsapp.net', ''),
        avatar: 'https://ui-avatars.com/api/?background=random&name=' + (c.name || 'User'),
        lastMessage: '',
        lastMessageTime: '',
        unreadCount: c.unreadCount || 0,
        messages: []
      }));

      setChats(prev => {
        const existingIds = new Set(prev.map(c => c.id));
        const uniqueNew = mappedChats.filter(c => !existingIds.has(c.id));
        return [...prev, ...uniqueNew];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-whatsapp-background">
      <div className="w-full max-w-[1600px] mx-auto h-full flex shadow-lg">
        {/* Instance Switcher (Temporarily Disabled for Single Instance Focus) */}
        {/* <InstanceSwitcher /> */}

        {/* Conditional Rendering based on Connection */}
        {!isConnected && qrCode ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <QRCodeDisplay qrCode={qrCode} />
          </div>
        ) : (
          <>
            {/* Sidebar Area */}
            <div className="w-[400px] flex-none bg-whatsapp-sidebar-bg border-r border-gray-200">
              <Sidebar
                chats={chats.length > 0 ? chats : mockChats}
                onSelectChat={setActiveChat}
                activeChatId={activeChat?.id}
              />
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-whatsapp-chat-bg relative">
              <ChatArea activeChat={activeChat} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
