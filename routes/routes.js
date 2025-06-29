import express from 'express';
import { handleOpenAI, handleGemini } from '../api/llm.js';
import modelsRouter from './models.js';

const router = express.Router();

// Chat history session/cookie endpoints
router.get('/history', (req, res) => {
    res.json({ chatMessages: req.session.chatMessages || [] });
});
router.post('/history', (req, res) => {
    req.session.chatMessages = req.body.chatMessages || [];
    res.json({ status: 'ok' });
});

// LLM endpoints
router.post('/openai', handleOpenAI);
router.post('/gemini', handleGemini);

export default router;
