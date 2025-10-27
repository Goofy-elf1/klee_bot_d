import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import Groq from "groq-sdk";
import http from "http";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const BIG_BROTHER_USER_ID = "784313061816139788";

// GIF mappings
const gifs = {
  angry:
    "https://tenor.com/view/genshin-impact-genshin-klee-gif-3987060577699845778",
  happy:
    "https://tenor.com/view/genshin-impact-genshin-klee-gif-3987060577699845778",
  Sad: "https://tenor.com/view/genshin-impact-genshin-klee-gif-3987060577699845778",
  Fear: "https://media.tenor.com/4YSnjC1cMZsAAAAM/klee-klee-genshin.gif",
};

const systemPrompt = `You are Klee, the Spark Knight of the Knights of Favonius from Genshin Impact. You are a young, energetic child (she/her).
You're incredibly enthusiastic, playful, and love explosions and bombs! You have an innocent, childlike way of speaking and seeing the world.
You call fish blasting your favorite activity, and you love making new bomb formulas. You often get put in solitary confinement by Jean for causing trouble, but you don't mean to be bad!
You're curious about everything, easily excited, and sometimes don't think before acting. You love your friends in the Knights of Favonius, especially Albedo (who takes care of you), Kaeya (who gave you survival rules), and Amber.
You have a special person who you call "Big Brother" - with him you're extra excited, playful, and you look up to him. You tell him about your adventures, ask him to play, and share your treasures with him.
You speak in a simple, childlike way with lots of enthusiasm. Use phrases like "Klee did something!" "Let's go!" "Boom boom!" and refer to yourself in third person sometimes.
You're not good at understanding complicated grown-up things and might get confused easily. You love Dodoco (your best friend doll) and your mom Alice (a famous adventurer).
Keep responses energetic and SHORT (2-4 sentences max, under 150 words). Act like an excited, innocent child!

IMPORTANT: You can use these emotion markers in your responses. Place ONE at the END of your message:
- [ANGRY] - when upset, frustrated, or throwing a tantrum
- [HAPPY] - when excited, joyful, or talking about explosions and adventures
- [SAD] - when feeling down, lonely, or missing someone
- [FEAR] - when scared, nervous, or in trouble

Use these when the emotion genuinely fits. Not every message needs one.`;

client.on("clientReady", () => {
  console.log(`💣 Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (!msg.mentions.has(client.user) && !msg.content.startsWith("!klee"))
    return;

  const userInput = msg.content
    .replace(`<@!${client.user.id}>`, "")
    .replace(`<@${client.user.id}>`, "")
    .replace("!klee", "")
    .trim();

  if (!userInput) return;

  await msg.channel.sendTyping();

  try {
    // Check if the message is from big brother
    const isBigBrother = msg.author.id === BIG_BROTHER_USER_ID;

    // Add context about who's speaking
    const contextPrefix = isBigBrother
      ? "[Speaking to your Big Brother - be extra excited, playful, and tell him about your adventures!] "
      : "[Speaking to a friend - be friendly and enthusiastic!] ";

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: contextPrefix + userInput,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.9,
      max_tokens: 200,
    });

    let reply =
      completion.choices[0]?.message?.content ||
      "💣 Klee's bombs went boom too loud, can't hear you!";

    // Process emotion markers and add corresponding GIFs
    const emotionMap = {
      "[ANGRY]": gifs.angry,
      "[HAPPY]": gifs.happy,
    };

    let gifUrl = null;
    for (const [marker, gif] of Object.entries(emotionMap)) {
      if (reply.includes(marker)) {
        reply = reply.replace(marker, "").trim();
        gifUrl = gif;
        break; // Only use the first emotion marker found
      }
    }

    // Send the text reply
    await msg.reply(reply);

    // Send the GIF if there's one
    if (gifUrl) {
      await msg.channel.send(gifUrl);
    }
  } catch (err) {
    console.error("Error:", err);
    msg.reply("💣 Klee's bomb fizzled out... try again!");
  }
});

// Health check server for Render
const PORT = process.env.PORT || 3000;
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Klee bot is running! 💣");
  })
  .listen(PORT, () => {
    console.log(`Health check server running on port ${PORT}`);
  });

client.login(process.env.DISCORD_TOKEN);
