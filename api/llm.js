import fetch from 'node-fetch';

export async function handleOpenAI(req, res) {
    const { prompt, model, mode, apiKey, history } = req.body;
    if (!apiKey) return res.status(400).json({ error: 'OpenAI API key required.' });
    // Use full chat history for context
    const messages = [
        { role: 'system', content: `You are a helpful AI assistant. The user has selected ${mode} mode.` },
        ...(Array.isArray(history) ? history : []),
        { role: 'user', content: prompt }
    ];
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ model, messages })
        });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json({ result: data.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function handleGemini(req, res) {
    const { prompt, model, mode, apiKey, history } = req.body;
    if (!apiKey) return res.status(400).json({ error: 'Gemini API key required.' });
    // Gemini expects a single prompt, but we can concatenate history for context
    let fullPrompt = '';
    if (Array.isArray(history) && history.length > 0) {
        fullPrompt = history.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n') + `\nUser: ${prompt}`;
    } else {
        fullPrompt = mode === 'chat' ? prompt : `${mode}: ${prompt}`;
    }
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const requestBody = {
        contents: [
            { parts: [{ text: fullPrompt }] }
        ]
    };
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        res.json({ result: data.candidates[0].content.parts[0].text });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
