export interface Message {
    id: string;
    text: string;
    sender: 'me' | 'other';
    timestamp: string;
    status?: 'sent' | 'delivered' | 'read';
}

export interface Chat {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    messages: Message[];
}

export const mockChats: Chat[] = [
    {
        id: '1',
        name: 'João Silva',
        avatar: 'https://ui-avatars.com/api/?name=Joao+Silva&background=random',
        lastMessage: 'Olá, gostaria de marcar uma consulta.',
        lastMessageTime: '10:30',
        unreadCount: 2,
        messages: [
            { id: 'm1', text: 'Bom dia!', sender: 'other', timestamp: '10:28', status: 'read' },
            { id: 'm2', text: 'Olá, gostaria de marcar uma consulta.', sender: 'other', timestamp: '10:30', status: 'read' },
        ]
    },
    {
        id: '2',
        name: 'Maria Oliveira',
        avatar: 'https://ui-avatars.com/api/?name=Maria+Oliveira&background=random',
        lastMessage: 'Obrigada pelo atendimento!',
        lastMessageTime: 'Ontem',
        unreadCount: 0,
        messages: [
            { id: 'm3', text: 'Seu exame ficou pronto.', sender: 'me', timestamp: '14:00', status: 'read' },
            { id: 'm4', text: 'Obrigada pelo atendimento!', sender: 'other', timestamp: '14:05', status: 'read' },
        ]
    },
    {
        id: '3',
        name: 'Dr. Pedro',
        avatar: 'https://ui-avatars.com/api/?name=Dr+Pedro&background=random',
        lastMessage: 'Reunião às 15h?',
        lastMessageTime: 'Ontem',
        unreadCount: 0,
        messages: [
            { id: 'm5', text: 'Reunião às 15h?', sender: 'other', timestamp: '09:00', status: 'read' },
        ]
    },
    {
        id: '4',
        name: 'Clínica Geral',
        avatar: 'https://ui-avatars.com/api/?name=Clinica+Geral&background=random',
        lastMessage: 'Novo protocolo de atendimento.',
        lastMessageTime: 'Terça',
        unreadCount: 5,
        messages: [
            { id: 'm6', text: 'Novo protocolo de atendimento.', sender: 'other', timestamp: '11:00', status: 'read' },
        ]
    }
];
