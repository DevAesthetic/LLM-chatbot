import express from 'express';
const router = express.Router();

router.get('/openai', (req, res) => {
  res.json({
    models: [
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k',
      'gpt-4',
      'gpt-4-32k',
      'gpt-4-turbo',
      'gpt-4o',
      'gpt-4-vision-preview'
    ]
  });
});

router.get('/gemini', (req, res) => {
  res.json({
    models: [
      'gemini-pro',
      'gemini-pro-vision',
      'gemini-1.0-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-ultra'
    ]
  });
});

export default router;
