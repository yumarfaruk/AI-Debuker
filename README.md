# DebunkAI - Viral Misinformation Debunker

DebunkAI helps everyone—students, families, working people, and the general public—fact-check viral social media posts, forwarded WhatsApp messages, and online rumors.

It is powered by **Gemma 4** through Google AI Studio, with a local fallback using **Ollama**.

---

## 1. What This App Does

When you paste a viral post, DebunkAI quickly tells you:
1. **The Verdict**:
   - **Misinformation**: Untrue information shared by accident or honest mistake.
   - **Disinformation**: Lies and hoaxes made on purpose to trick, scam, or manipulate people.
   - **Malinformation**: Real information twisted out of context or leaked maliciously to cause harm.
   - **Verified True**: Accurate and backed by facts.
2. **What the post claims** vs **The verified reality**.
3. **Red flags**: Catches manipulation tricks like fake urgency ("Share before it gets deleted!"), anonymous doctors, or scam links.
4. **How to reply politely**: A friendly 2-sentence response you can copy and paste into family or group chats without starting an argument.

---

## 2. Quick Setup

Make sure you have Node.js installed (version 18 or newer).

1. Clone or download this project folder.
2. Open your terminal in the project folder and install dependencies:
   ```bash
   npm install
   ```
3. Copy the example settings file:
   ```bash
   cp .env.example .env
   ```

---

## 3. How to Run with Google AI Studio (API)

This is the default mode. It runs Gemma 4 in the cloud using Google AI Studio.

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/).
2. Open your `.env` file and set:
   ```env
   PROVIDER=api
   GEMINI_API_KEY=your_actual_api_key_here
   GEMINI_MODEL=gemma-4-26b-a4b-it
   ```
   *(Note: In Google AI Studio Build, `GEMINI_API_KEY` is provided automatically).*
3. Start the app:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:3000`.

---

## 4. How to Run with Ollama (Local on Your Computer)

If you want to run completely offline without an API key, you can use Ollama.

1. Install [Ollama](https://ollama.com/).
2. Download the Gemma 4 local model:
   ```bash
   ollama run gemma4:e2b
   ```
3. Open your `.env` file and switch the provider:
   ```env
   PROVIDER=local
   OLLAMA_ENDPOINT=http://localhost:11434
   OLLAMA_MODEL=gemma4:e2b
   ```
4. Start the app:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:3000`.

---

## 5. Running the Smoke Test

We included an automated smoke test script that sends a realistic viral health hoax to the active provider and verifies everything works end-to-end.

To run it:
```bash
npm run test:smoke
```

If everything works, you will see the detailed findings and a final:
```
RESULT: PASS
```

You can also run the smoke test directly in the web app by clicking the **"Smoke Test"** button in the top navigation bar!

---

## 6. Project Files

- `src/App.tsx`: Clean, single-page web app for the general public.
- `server/debunkService.ts`: Core verification logic for Gemma 4 and Ollama.
- `scripts/smoke-test.ts`: Automated test script printing `PASS` or `FAIL`.
- `server.ts`: Production Express server.
- `vite.config.ts`: Development server configuration with built-in API proxy.
- `.env.example`: Template for environment variables.
- `.gitignore`: Keeps your private keys and `.env` safe.
