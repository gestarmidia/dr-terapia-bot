import TelegramBot from 'node-telegram-bot-api';
import OpenAI from 'openai';

// ✅ Tokens diretamente no código
const TELEGRAM_BOT_TOKEN = '8192234601:AAHWsCoTczGhvQARr_ww1bx2_8twYyhuqec';
const OPENAI_API_KEY = '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';

if (!TELEGRAM_BOT_TOKEN || !OPENAI_API_KEY) {
  console.error('Tokens não configurados!');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

let paused = false;

bot.on('message', async (msg) => {
  if (!msg.text) return;
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  if (text === '/pausar') {
    paused = true;
    return bot.sendMessage(chatId, '🤖 Dr. TerapIA pausado.');
  }

  if (text === '/retomar') {
    paused = false;
    return bot.sendMessage(chatId, '🤖 Dr. TerapIA retomado.');
  }

  if (paused) return;

  const triggerPhrases = [
    'não aguento mais',
    'isso me machuca',
    'você nunca',
    'estou triste',
    'estou chateado',
    'não gosto',
    'não quero mais',
  ];

  const shouldRespond = triggerPhrases.some((phrase) => text.includes(phrase));
  if (!shouldRespond) return;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Você é Dr. TerapIA, um terapeuta digital que media conversas de casal com empatia e inteligência emocional.',
        },
        { role: 'user', content: msg.text },
      ],
    });

    const botResponse = response.choices[0].message.content;
    bot.sendMessage(chatId, botResponse);
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, 'Erro ao processar. Tente novamente.');
  }
});
