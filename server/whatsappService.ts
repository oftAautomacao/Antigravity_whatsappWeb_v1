import makeWASocket, { DisconnectReason, useMultiFileAuthState, ConnectionState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { Server } from 'socket.io';

export const connectToWhatsApp = async (io: Server) => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        defaultQueryTimeoutMs: undefined, // Keep connection alive
        keepAliveIntervalMs: 10000,
        syncFullHistory: false, // Disable full history sync to avoid timeouts
        generateHighQualityLinkPreview: true,
    });

    sock.ev.on('connection.update', async (update: Partial<ConnectionState>) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('QR Code received');
            io.emit('qr_code', qr);
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp(io);
            }
        } else if (connection === 'open') {
            console.log('Opened connection');
            io.emit('connection_status', 'open');

            // Buscar chats existentes
            try {
                console.log('Fetching existing chats...');
                const chats = await sock.groupFetchAllParticipating();
                const chatList = Object.values(chats);

                if (chatList.length > 0) {
                    console.log(`Found ${chatList.length} chats`);
                    io.emit('chats_update', chatList);
                }
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('chats.upsert', (newChats) => {
        console.log('Chats received:', newChats.length);
        io.emit('chats_update', newChats);
    });

    sock.ev.on('contacts.upsert', (newContacts) => {
        console.log('Contacts received:', newContacts.length);
        io.emit('contacts_update', newContacts);
    });

    sock.ev.on('messages.upsert', async (m) => {
        console.log('=== MESSAGE UPSERT ===');
        console.log('Type:', m.type);
        console.log('Messages count:', m.messages.length);

        for (const msg of m.messages) {
            // Ignorar mensagens de status/broadcast
            if (msg.key.remoteJid === 'status@broadcast') continue;

            console.log('Message from:', msg.key.remoteJid);
            console.log('From me:', msg.key.fromMe);

            // Emitir todas as mensagens (incluindo as suas)
            io.emit('new_message', msg);
        }
    });

    io.on('connection', (socket) => {
        socket.on('send_message', async (data: { to: string; text: string }) => {
            try {
                // Formatar JID corretamente
                let id = data.to;
                if (!id.includes('@s.whatsapp.net')) {
                    // Remover caracteres não numéricos
                    id = id.replace(/\D/g, '');
                    id = `${id}@s.whatsapp.net`;
                }

                console.log(`Attempting to send message to ${id}: ${data.text}`);

                // Verificar se o socket está aberto
                // @ts-ignore
                if (sock.ws.readyState !== sock.ws.OPEN) {
                    console.error('WhatsApp socket is not open');
                    return;
                }

                const sentMsg = await sock.sendMessage(id, { text: data.text });
                console.log(`Message sent successfully to ${id}`);

                // Emitir de volta para o frontend confirmar (opcional, mas bom para debug)
                // io.emit('message_sent', { to: id, text: data.text, id: sentMsg?.key.id });

            } catch (error) {
                console.error('Error sending message:', error);
            }
        });
    });
};
