import React from 'react';
import { Search, MoreVertical, MessageSquare, Donut } from 'lucide-react';
import { type Chat } from '../../data/mockData';

interface SidebarProps {
    chats: Chat[];
    onSelectChat: (chat: Chat) => void;
    activeChatId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ chats, onSelectChat, activeChatId }) => {
    const [showMenu, setShowMenu] = React.useState(false);

    const handleDisconnect = async () => {
        if (confirm('Deseja realmente desconectar do WhatsApp? Você precisará escanear o QR Code novamente.')) {
            try {
                const response = await fetch('http://localhost:3000/logout', { method: 'POST' });
                if (response.ok) {
                    alert('Desconectado! Recarregue a página para escanear novamente.');
                    window.location.reload();
                }
            } catch (error) {
                console.error('Erro ao desconectar:', error);
                alert('Erro ao desconectar. Tente novamente.');
            }
        }
        setShowMenu(false);
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="h-16 bg-whatsapp-header-bg flex items-center justify-between px-4 border-b border-gray-200 flex-none">
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=User+Admin&background=00a884&color=fff" alt="Profile" />
                </div>
                <div className="flex gap-6 text-gray-600 relative">
                    <button title="Status"><Donut size={20} /></button>
                    <button title="Nova Conversa"><MessageSquare size={20} /></button>
                    <button title="Menu" onClick={() => setShowMenu(!showMenu)}>
                        <MoreVertical size={20} />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 top-8 bg-white shadow-lg rounded-lg py-2 w-48 z-50 border border-gray-200">
                            <button
                                onClick={handleDisconnect}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                            >
                                Desconectar WhatsApp
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Search */}
            <div className="p-2 border-b border-gray-100 bg-white flex-none">
                <div className="bg-whatsapp-input-bg rounded-lg h-9 flex items-center px-4 gap-4">
                    <Search size={18} className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Pesquisar ou começar uma nova conversa"
                        className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-500"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => onSelectChat(chat)}
                        className={`flex items-center px-3 py-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100 ${activeChatId === chat.id ? 'bg-gray-100' : ''}`}
                    >
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-none">
                            <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-gray-900 font-normal truncate">{chat.name}</h3>
                                <span className="text-xs text-gray-500 flex-none">{chat.lastMessageTime}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                                {chat.unreadCount > 0 && (
                                    <span className="bg-whatsapp-teal text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                        {chat.unreadCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
