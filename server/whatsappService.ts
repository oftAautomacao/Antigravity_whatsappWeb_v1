import makeWASocket, { DisconnectReason, useMultiFileAuthState, ConnectionState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { Server } from 'socket.io';

export const connectToWhatsApp = async (io: Server) => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
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

        if (m.type === 'notify') {
            for (const msg of m.messages) {
                console.log('Message from:', msg.key.remoteJid);
                console.log('From me:', msg.key.fromMe);
                console.log('Message:', msg.message);

                if (!msg.key.fromMe) {
                    console.log('Emitting new_message to frontend');
                    io.emit('new_message', msg);
                }
            }
        }
    });

    io.on('connection', (socket) => {
        socket.on('send_message', async (data: { to: string; text: string }) => {
            try {
                const id = data.to.includes('@s.whatsapp.net') ? data.to : `${data.to}@s.whatsapp.net`;
                await sock.sendMessage(id, { text: data.text });
                console.log(`Message sent to ${id}: ${data.text}`);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });
    });
};
