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

    socket.on('new_message', (msg: any) => {
      console.log('New message received:', msg);

      const remoteJid = msg.key.remoteJid;
      const senderName = msg.pushName || msg.verifiedBizName || remoteJid.split('@')[0];
      const messageText = msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        'Mídia';

      const newMessage = {
        id: msg.key.id || Date.now().toString(),
        text: messageText,
        sender: msg.key.fromMe ? 'me' : 'other',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setChats(prevChats => {
        const existingChatIndex = prevChats.findIndex(c => c.id === remoteJid);

        if (existingChatIndex >= 0) {
          const updatedChats = [...prevChats];
          updatedChats[existingChatIndex] = {
            ...updatedChats[existingChatIndex],
            lastMessage: messageText,
            lastMessageTime: newMessage.timestamp,
            unreadCount: updatedChats[existingChatIndex].unreadCount + 1,
            messages: [...updatedChats[existingChatIndex].messages, newMessage]
          };
          return updatedChats;
        } else {
          const newChat: Chat = {
            id: remoteJid,
            name: senderName,
            avatar: `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(senderName)}`,
            lastMessage: messageText,
            lastMessageTime: newMessage.timestamp,
            unreadCount: 1,
            messages: [newMessage]
          };
          return [newChat, ...prevChats];
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMessageSent = (chatId: string, message: any) => {
    setChats(prevChats => {
      const chatIndex = prevChats.findIndex(c => c.id === chatId);
      if (chatIndex >= 0) {
        const updatedChats = [...prevChats];
        updatedChats[chatIndex] = {
          ...updatedChats[chatIndex],
          messages: [...updatedChats[chatIndex].messages, message],
          lastMessage: message.text,
          lastMessageTime: message.timestamp
        };
        return updatedChats;
      }
      return prevChats;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-whatsapp-background">
      <div className="w-full max-w-[1600px] mx-auto h-full flex shadow-lg">
        {!isConnected && qrCode ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <QRCodeDisplay qrCode={qrCode} />
          </div>
        ) : (
          <>
            <div className="w-[400px] flex-none bg-whatsapp-sidebar-bg border-r border-gray-200">
              <Sidebar
                chats={chats.length > 0 ? chats : mockChats}
                onSelectChat={setActiveChat}
                activeChatId={activeChat?.id}
              />
            </div>

            <div className="flex-1 bg-whatsapp-chat-bg relative">
              <ChatArea activeChat={activeChat} onMessageSent={handleMessageSent} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
