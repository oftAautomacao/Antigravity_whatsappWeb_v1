import React from 'react';
import { Search, MoreVertical, Paperclip, Smile, Mic } from 'lucide-react';
import { type Chat } from '../../data/mockData';
import { io } from 'socket.io-client';

interface ChatAreaProps {
    activeChat?: Chat;
}

// Initialize socket outside component to avoid multiple connections
const socket = io('http://localhost:3000');

const ChatArea: React.FC<ChatAreaProps> = ({ activeChat }) => {
    if (!activeChat) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-whatsapp-header-bg border-b-8 border-whatsapp-teal">
                <div className="text-center">
                    <h1 className="text-3xl font-light text-gray-600 mb-4">WhatsApp Web</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Envie e receba mensagens sem precisar manter seu celular conectado à internet.
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                        Use o WhatsApp em até 4 aparelhos e 1 celular ao mesmo tempo.
                    </p>
                </div>
            </div>
        );
    }

    const handleSendMessage = (text: string) => {
        if (!activeChat) return;

        // Extract phone number from chat ID (assuming chat ID is the phone number for now)
        // In a real app, the Chat object would have a specific 'jid' or 'phoneNumber' field
        const to = activeChat.id;

        socket.emit('send_message', { to, text });
        console.log(`Sent message to ${to}: ${text}`);
    };

    return (
        <div className="h-full flex flex-col bg-whatsapp-chat-bg">
            {/* Header */}
            <div className="h-16 bg-whatsapp-header-bg flex items-center justify-between px-4 border-b border-gray-200 flex-none">
                <div className="flex items-center cursor-pointer">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="text-gray-900 font-normal">{activeChat.name}</h3>
                        <span className="text-xs text-gray-500">visto por último hoje às 10:30</span>
                    </div>
                </div>
                <div className="flex gap-6 text-gray-600">
                    <Search size={20} />
                    <MoreVertical size={20} />
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 bg-chat-pattern space-y-2">
                {activeChat.messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[60%] rounded-lg px-3 py-1.5 shadow-sm text-sm relative ${msg.sender === 'me' ? 'bg-whatsapp-message-out' : 'bg-whatsapp-message-in'
                                }`}
                        >
                            <span className="text-gray-900">{msg.text}</span>
                            <span className="text-[10px] text-gray-500 ml-2 float-right mt-2">
                                {msg.timestamp}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="h-16 bg-whatsapp-header-bg px-4 flex items-center gap-4 flex-none">
                <button className="text-gray-500"><Smile size={24} /></button>
                <button className="text-gray-500"><Paperclip size={24} /></button>
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Mensagem"
                        className="w-full h-10 rounded-lg px-4 bg-white border-none outline-none text-sm placeholder-gray-500"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const target = e.target as HTMLInputElement;
                                if (target.value.trim()) {
                                    handleSendMessage(target.value);
                                    target.value = '';
                                }
                            }
                        }}
                    />
                </div>
                <button className="text-gray-500"><Mic size={24} /></button>
            </div>
        </div>
    );
};

export default ChatArea;
