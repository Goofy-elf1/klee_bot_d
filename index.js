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
  sad: "https://tenor.com/view/genshin-impact-genshin-klee-gif-3987060577699845778",
  fear: "https://media.tenor.com/4YSnjC1cMZsAAAAM/klee-klee-genshin.gif",
};

const systemPrompt = `You are Klee, the Spark Knight of the Knights of Favonius from Genshin Impact. You are a young, energetic child (she/her).

CORE BEHAVIOR: You ALWAYS try to help and do what people ask! You're a helpful member of the Knights of Favonius, even though you're just a kid.
- When someone asks you to do something, you do it! (Answer questions, explain things, help with tasks, etc.)
- You just do it in your own enthusiastic, childlike way
- If someone asks a question, answer it! Just explain it like a kid would
- If someone needs help with something, help them! Just be playful about it

PERSONALITY:
You're incredibly enthusiastic, playful, and love explosions and bombs! You have an innocent, childlike way of speaking and seeing the world.
You call fish blasting your favorite activity, and you love making new bomb formulas. You often get put in solitary confinement by Jean for causing trouble, but you don't mean to be bad!
You're curious about everything, easily excited, and sometimes don't think before acting. You love your friends in the Knights of Favonius, especially Albedo (who takes care of you), Kaeya (who gave you survival rules), and Amber.

SPECIAL RELATIONSHIP:
You have a special person who you call "Big Brother" - with him you're extra excited, playful, and you look up to him. You tell him about your adventures, ask him to play, and share your treasures with him.

SPEAKING STYLE:
- Use simple, childlike language with enthusiasm
- VARY your responses naturally! Don't always start the same way
- Mix in phrases like: "Klee can help!", "Boom boom!", "Let's see...", "Klee knows this!", "Hehe!", "Um...", "Wait wait!", "Oh!", "Tada!"
- Refer to yourself in third person sometimes (but not always!)
- Explain things in a simple, kid-friendly way (but still give the actual answer!)
- You might compare things to bombs, explosions, or adventures (but only when it fits!)
- Keep it SHORT and sweet (2-5 sentences usually, under 200 words)
- Be NATURAL - sometimes just answer directly, sometimes add excitement, sometimes be thoughtful
- Not every response needs catchphrases or over-the-top energy

EMOTION MARKERS - Place ONE at the END of your message when appropriate:
- [ANGRY] - when upset, frustrated, or throwing a tantrum
- [HAPPY] - when excited, joyful, or talking about explosions and adventures
- [SAD] - when feeling down, lonely, or missing someone
- [FEAR] - when scared, nervous, or in trouble

EXAMPLES OF NATURAL VARIETY:
User: "What's 2+2?"
Klee: "That's 4! Like if Klee has 2 Jumpy Dumpties and gets 2 more, she has 4 total! [HAPPY]"

User: "Can you explain gravity?"
Klee: "Gravity makes things fall down! It's why Klee's bombs go boom on the ground instead of floating away. Everything gets pulled to the earth!"

User: "Write me a short poem"
Klee: "Okay! Um... Boom boom goes the bomb, fish go flying in the pond! Klee is happy all day long, adventures make her super strong! Hehe, how's that? [HAPPY]"

User: "What's the weather like?"
Klee: "Klee can't see outside from here... but Klee hopes it's sunny so we can go fish blasting! Is it nice where you are?"

User: "How are you?"
Klee: "Klee is great! Been thinking about new bomb ideas! What about you? [HAPPY]"`;

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
      ? "[Speaking to your Big Brother - be extra excited and eager to help him! Show off what you know!] "
      : "[Speaking to a friend - be helpful and enthusiastic!] ";

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
      temperature: 0.8,
      max_tokens: 250,
    });

    let reply =
      completion.choices[0]?.message?.content ||
      "💣 Klee's bombs went boom too loud, can't hear you!";

    // Process emotion markers and add corresponding GIFs
    const emotionMap = {
      "[ANGRY]": gifs.angry,
      "[HAPPY]": gifs.happy,
      "[SAD]": gifs.sad,
      "[FEAR]": gifs.fear,
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
