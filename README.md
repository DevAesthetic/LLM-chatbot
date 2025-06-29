# AI Chatbot (Multi-LLM, Extensible)

A modern, extensible AI chatbot supporting OpenAI, Gemini, and custom LLMs. Users can add their own API keys, test APIs, and add new models easily.

## Features
- Supports OpenAI (GPT-3.5, GPT-4, GPT-4 Turbo), Gemini (Pro, Pro Vision), and custom LLMs
- Add your own API keys in the web UI (no keys stored on server)
- Session-based chat history (cookies)
- Typing effect, markdown/code formatting, and beautiful UI (Tailwind CSS)
- Error messages shown clearly in the UI
- Easily add more LLM models (see `/models/openai/openai.json` and `/models/gemini/gemini.json`)
- Test API endpoints for all models

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/DevAesthetic/LLM-chatbot.git
   cd LLM-chatbot
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment:**
   - Copy `.env.example` to `.env` (no API keys needed)
   - You can change the `PORT` if needed
4. **Start the server:**
   ```sh
   npm start
   ```
5. **Open the app:**
   - Go to [http://localhost:3000](http://localhost:3000)
   - Enter your API keys and select a model in the settings modal

## Use Cases
- Chat with OpenAI, Gemini, or your own LLMs
- Test and compare different LLM APIs and models
- Add new models by editing `models/openai/openai.json` or `models/gemini/gemini.json`
- Use as a base for your own AI assistant, support, or research tool

## Adding More LLMs
- To add a new OpenAI or Gemini model, edit the respective JSON file in `/models/openai/` or `/models/gemini/`.
- To add a new provider, extend the backend API and frontend settings modal.

## API Testing
- Use `/model/openai` and `/model/gemini` endpoints to list available models.
- Test chat endpoints via the web UI or with tools like Postman.

## License
MIT

---

## Disclaimer

The `testapi` directory and its tools are provided for testing LLM API keys and endpoints only. Use at your own risk. Do not use production or sensitive API keys for testing. The maintainers are not responsible for any misuse or abuse of these tools.
