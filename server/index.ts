import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { connectToWhatsApp } from './whatsappService';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('WhatsApp Clone Backend is running!');
});

app.post('/logout', async (req, res) => {
    try {
        const fs = await import('fs');
        const path = await import('path');
        const authPath = path.join(process.cwd(), 'auth_info_baileys');

        if (fs.existsSync(authPath)) {
            fs.rmSync(authPath, { recursive: true, force: true });
            console.log('Auth session cleared');
        }

        res.json({ success: true, message: 'Logged out successfully' });

        // Restart the server after a delay
        setTimeout(() => {
            process.exit(0);
        }, 1000);
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ success: false, error: 'Failed to logout' });
    }
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
connectToWhatsApp(io);
