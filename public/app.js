// Extracted from <script> in chatbot.html
// DOM Elements
const promptInput = document.getElementById('prompt-input');
const sendBtn = document.getElementById('send-btn');
const modeSelect = document.getElementById('mode');
const chatHistory = document.getElementById('chat-history');
const settingsBtn = document.getElementById('settings-btn');
const closeSettings = document.getElementById('close-settings');
const saveSettings = document.getElementById('save-settings');
const settingsModal = document.getElementById('settings-modal');
const loadingSpinner = document.getElementById('loading-spinner');
const apiProviderSelect = document.getElementById('api-provider');
const geminiSettings = document.getElementById('gemini-settings');
const openaiSettings = document.getElementById('openai-settings');
const customSettings = document.getElementById('custom-settings');
const clearChatBtn = document.getElementById('clear-chat');

// Chat history array
let chatMessages = [];

// Load settings from localStorage
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('aiAssistantSettings')) || {
        apiProvider: 'gemini',
        geminiApiKey: '',
        geminiModel: 'gemini-pro',
        openaiApiKey: '',
        openaiModel: 'gpt-3.5-turbo',
        customApiKey: '',
        customEndpoint: '',
        customModel: ''
    };
    apiProviderSelect.value = settings.apiProvider;
    document.getElementById('gemini-api-key').value = settings.geminiApiKey;
    document.getElementById('gemini-model').value = settings.geminiModel;
    document.getElementById('openai-api-key').value = settings.openaiApiKey;
    document.getElementById('openai-model').value = settings.openaiModel;
    document.getElementById('custom-api-key').value = settings.customApiKey;
    document.getElementById('custom-endpoint').value = settings.customEndpoint;
    document.getElementById('custom-model').value = settings.customModel;
    toggleSettingsVisibility(settings.apiProvider);
}

// Save settings to localStorage
function saveSettingsToStorage() {
    const settings = {
        apiProvider: apiProviderSelect.value,
        geminiApiKey: document.getElementById('gemini-api-key').value,
        geminiModel: document.getElementById('gemini-model').value,
        openaiApiKey: document.getElementById('openai-api-key').value,
        openaiModel: document.getElementById('openai-model').value,
        customApiKey: document.getElementById('custom-api-key').value,
        customEndpoint: document.getElementById('custom-endpoint').value,
        customModel: document.getElementById('custom-model').value
    };
    localStorage.setItem('aiAssistantSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
    toggleModal();
}

// Toggle settings visibility based on selected provider
function toggleSettingsVisibility(provider) {
    geminiSettings.classList.add('hidden');
    openaiSettings.classList.add('hidden');
    customSettings.classList.add('hidden');
    if (provider === 'gemini') {
        geminiSettings.classList.remove('hidden');
    } else if (provider === 'openai') {
        openaiSettings.classList.remove('hidden');
    } else if (provider === 'custom') {
        customSettings.classList.remove('hidden');
    }
}

// Toggle modal visibility
function toggleModal() {
    settingsModal.classList.toggle('modal-hidden');
}

// Add message to chat history
function addMessage(role, content) {
    const message = { role, content };
    chatMessages.push(message);
    renderChatHistory();
    // Save to session (cookie-based)
    fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatMessages })
    });
}

// Show error message at the top of the chat UI
function showError(message) {
    let errorDiv = document.getElementById('chat-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'chat-error';
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2 text-center animate-fade-in shadow';
        chatHistory.parentNode.insertBefore(errorDiv, chatHistory);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => { errorDiv.style.display = 'none'; }, 5000);
}

// Typing effect for AI response with animation and markdown support
async function typeAIResponse(element, html, delay = 12) {
    element.innerHTML = '';
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    let nodes = Array.from(tempDiv.childNodes);
    for (let node of nodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            for (let char of node.textContent) {
                element.innerHTML += char;
                await new Promise(r => setTimeout(r, delay));
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            let outer = node.outerHTML;
            element.innerHTML += outer;
        }
    }
}

// Format AI response for display
function formatAIResponse(raw) {
    // Advanced markdown/code/ul/ol formatting
    let html = raw
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\* (.*?)\n/g, '<li>$1</li>')
        .replace(/```([a-z]*)\n([\s\S]*?)```/g, function(match, lang, code) {
            return `<pre class='bg-gray-900 text-green-200 rounded p-2 overflow-x-auto mb-2'><code>${code.replace(/</g, '&lt;')}</code></pre>`;
        })
        .replace(/\n/g, '<br>');
    // Wrap lists
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc pl-6">$1</ul>');
    return html;
}

// Render chat history
function renderChatHistory() {
    if (chatMessages.length === 0) {
        chatHistory.innerHTML = '<div class="text-center text-gray-500 py-8 animate-fade-in">Start a conversation with the AI assistant</div>';
        return;
    }
    chatHistory.innerHTML = '';
    chatMessages.forEach((msg, idx) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`;
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = `max-w-[80%] p-3 ${msg.role === 'user' ? 'user-message' : 'ai-message'} shadow-md transition-all duration-300`;
        if (msg.role === 'assistant') {
            // Typing effect only for the last AI message
            if (idx === chatMessages.length - 1) {
                bubbleDiv.innerHTML = '';
                setTimeout(() => typeAIResponse(bubbleDiv, formatAIResponse(msg.content)), 100);
            } else {
                bubbleDiv.innerHTML = formatAIResponse(msg.content);
            }
        } else {
            bubbleDiv.textContent = msg.content;
        }
        messageDiv.appendChild(bubbleDiv);
        chatHistory.appendChild(messageDiv);
    });
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Save response to file
function saveResponseToFile(content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-response-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Send request to AI API (calls backend)
async function sendRequest(prompt, mode) {
    const settings = JSON.parse(localStorage.getItem('aiAssistantSettings')) || {};
    let apiProvider = settings.apiProvider;
    let model, response, aiResponse;
    let apiKey;
    let history = chatMessages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));
    if (apiProvider === 'gemini') {
        model = settings.geminiModel;
        apiKey = settings.geminiApiKey;
        response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, model, mode, apiKey, history })
        });
    } else if (apiProvider === 'openai') {
        model = settings.openaiModel;
        apiKey = settings.openaiApiKey;
        response = await fetch('/api/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, model, mode, apiKey, history })
        });
    } else {
        apiProvider = 'custom';
        model = settings.customModel;
        const endpoint = settings.customEndpoint;
        apiKey = settings.customApiKey;
        if (!endpoint || !apiKey) throw new Error('Custom API endpoint or key not set.');
        const messages = [
            { role: 'system', content: `You are a helpful AI assistant. The user has selected ${mode} mode.` },
            { role: 'user', content: prompt }
        ];
        response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ model, messages })
        });
    }
    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'API request failed');
    }
    const data = await response.json();
    if (apiProvider === 'gemini' || apiProvider === 'openai') {
        aiResponse = data.result;
    } else {
        aiResponse = data.choices ? data.choices[0].message.content : 'No response';
    }
    addMessage('assistant', aiResponse);
    return aiResponse;
}

// Event Listeners
sendBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return;
    const mode = modeSelect.value;
    try {
        promptInput.value = '';
        addMessage('user', prompt); // Show user message immediately
        const response = await sendRequest(prompt, mode);
        const saveBtn = document.createElement('button');
        saveBtn.className = 'mt-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-2 rounded';
        saveBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg> Save Response';
        const lastMessageDiv = chatHistory.lastElementChild;
        if (lastMessageDiv) {
            lastMessageDiv.querySelector('div').appendChild(saveBtn);
        }
    } catch (error) {
        showError(error.message);
        addMessage('assistant', `Error: ${error.message}`);
        console.error('Failed to get response:', error);
    }
});

promptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

promptInput.addEventListener('paste', (e) => {
    // Allow paste
});

settingsBtn.addEventListener('click', toggleModal);
closeSettings.addEventListener('click', toggleModal);
saveSettings.addEventListener('click', saveSettingsToStorage);
apiProviderSelect.addEventListener('change', (e) => {
    toggleSettingsVisibility(e.target.value);
});
if (clearChatBtn) {
    clearChatBtn.addEventListener('click', () => {
        chatMessages = [];
        renderChatHistory();
        fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatMessages: [] })
        });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    // Load chat history from session
    fetch('/api/history')
        .then(res => res.json())
        .then(data => {
            chatMessages = data.chatMessages || [];
            renderChatHistory();
        });
    loadSettings();
});
