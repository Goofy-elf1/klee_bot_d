# 💣 Klee Bot — Discord AI Chatbot

A Discord chatbot powered by Groq (LLaMA 3.3 70B) that roleplays as **Klee**, the Spark Knight from *Genshin Impact*. She's enthusiastic, childlike, loves explosions — and she'll actually help you with stuff!

---

## ✨ Features

- **AI-powered responses** via Groq's LLaMA 3.3 70B model
- **In-character personality** — Klee speaks in a childlike, playful style while still answering questions helpfully
- **Emotion-based GIFs** — Klee reacts with a GIF based on her mood (`[HAPPY]`, `[SAD]`, `[ANGRY]`, `[FEAR]`)
- **Big Brother mode** — a special user ID gets extra-excited, personalised responses
- **Health check server** — built-in HTTP server for deployment on platforms like Render

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/klee-bot.git
cd klee-bot
npm install
```

### 2. Set up environment variables

Create a `.env` file in the root:

```env
DISCORD_TOKEN=your_discord_bot_token
GROQ_API_KEY=your_groq_api_key
PORT=3000
```

### 3. Run the bot

```bash
node index.js
```

---

## 🤖 Usage

Trigger Klee in any server channel by either:

- **Mentioning the bot** — `@Klee what is gravity?`
- **Using the prefix** — `!klee write me a poem`

Klee will reply in character and may include a reaction GIF depending on her mood.

---

## 📁 Project Structure

```
klee-bot/
├── index.js        # Main bot logic
├── .env            # Environment variables (not committed)
└── package.json
```

---

## ⚙️ Configuration

| Variable | Description |
|---|---|
| `DISCORD_TOKEN` | Your Discord bot token from the [Developer Portal](https://discord.com/developers/applications) |
| `GROQ_API_KEY` | Your API key from [Groq Console](https://console.groq.com) |
| `PORT` | Port for the health check HTTP server (default: `3000`) |

### Special User (Big Brother)

To set a user who gets a special "Big Brother" experience, update the constant in `index.js`:

```js
const BIG_BROTHER_USER_ID = "your_discord_user_id_here";
```

---

## 😄 Emotion System

Klee's AI responses may include an emotion marker at the end, which maps to a GIF:

| Marker | Mood | Trigger |
|---|---|---|
| `[HAPPY]` | Joyful / Excited | Fun topics, explosions, adventures |
| `[SAD]` | Down / Lonely | Missing someone, feeling left out |
| `[ANGRY]` | Frustrated / Upset | Being annoyed or throwing a tantrum |
| `[FEAR]` | Scared / Nervous | Trouble, scary situations |

The marker is stripped from the text before sending, and the GIF is posted as a follow-up message.

To swap out GIFs, update the `gifs` object in `index.js`:

```js
const gifs = {
  angry: "https://your-gif-url",
  happy: "https://your-gif-url",
  sad: "https://your-gif-url",
  fear: "https://your-gif-url",
};
```

---

## 🛠️ Dependencies

| Package | Purpose |
|---|---|
| `discord.js` | Discord API client |
| `groq-sdk` | Groq LLM API client |
| `dotenv` | Environment variable loading |

---

## ☁️ Deploying to Render

1. Push your code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set the build command to `npm install` and start command to `node index.js`
4. Add your environment variables in the Render dashboard
5. The built-in HTTP server on `PORT` will serve as the health check endpoint

---

## 📄 License

MIT — free to use, fork, and make go boom. 💣
