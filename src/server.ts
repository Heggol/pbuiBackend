import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PBState, SongStates } from './types';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

// initial state
let currentState: PBState = {
    songStates: {},
    currentFlowStep: 0,
    playerInfo: [
        { name: 'Player 1', image: '/images/Placeholder1.png' },
        { name: 'Player 2', image: '/images/Placeholder2.png' }
    ]
};

app.get('/api/state', (req, res) => {
    res.json(currentState);
});

app.post('/api/update', (req, res) => {
    const newState = req.body as PBState;
    updateState(newState);
    res.json({ success: true });
});

app.post('/api/reset', (req, res) => {
    currentState = {
        songStates: {},
        currentFlowStep: 0,
        playerInfo: currentState.playerInfo
    };
    io.emit('state-reset');
    res.json({ success: true });
});

app.post('/api/players', (req, res) => {
    const { players } = req.body;
    if (Array.isArray(players) && players.length <= 2) {
        currentState.playerInfo = players;
        io.emit('players-updated', players);
        res.json({ success: true });
    } else {
        res.status(400).json({ error: 'Invalid player data' });
    }
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    // Send current state to new client
    socket.emit('initial-state', currentState);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

function updateState(newState: Partial<PBState>) {
    if (newState.songStates) {
        currentState.songStates = newState.songStates;
    }
    if (newState.currentFlowStep !== undefined) {
        currentState.currentFlowStep = newState.currentFlowStep;
    }
    if (newState.playerInfo) {
        currentState.playerInfo = newState.playerInfo;
    }
    // Broadcast updates to all clients with a small delay
    setTimeout(() => {
        io.emit('state-updated', currentState);
    }, 150);
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});