import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173", // URL do Frontend Vite
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('WhatsApp Clone Backend is running!');
});

io.on('connection', (socket) => {
    console.log('Frontend connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Frontend disconnected:', socket.id);
    });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Export for use in other files
export { io };

// Start WhatsApp connection
import { connectToWhatsApp } from './whatsappService';
connectToWhatsApp(io);
