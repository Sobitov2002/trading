const TelegramBot = require('node-telegram-bot-api');

// Bot tokeningizni shu yerga kiriting
const token = '8123455786:AAF8uyFAT7CMerpgCRKDxOHmUNadmdyLeDU';

// Botni yaratamiz
const bot = new TelegramBot(token, { polling: true });

// "/start" komandasi uchun
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '1-Strategiya', callback_data: 'strategy1' }],
                [{ text: '2-Strategiya', callback_data: 'strategy2' }],
            ]
        }
    };

    bot.sendMessage(chatId, `Salom! Quyidagi strategiyalardan birini tanlang:`, options);
});

// Holatni saqlash uchun
const userState = {};

// Tugma tanlanganda
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;

    if (query.data === 'strategy1') {
        userState[chatId] = { step: 'awaiting_a', strategy: 'strategy1' };
        bot.sendMessage(chatId, '1-strategiya uchun "a" qiymatini kiriting:');
    } else if (query.data === 'strategy2') {
        userState[chatId] = { step: 'awaiting_a', strategy: 'strategy2' };
        bot.sendMessage(chatId, '2-strategiya uchun "a" qiymatini kiriting:');
    } else {
        bot.sendMessage(chatId, 'Noto\'g\'ri tanlov.');
    }
});

// Xabar kelganda
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (userState[chatId] && userState[chatId].step === 'awaiting_a') {
        const a = parseFloat(msg.text);
        if (isNaN(a)) {
            bot.sendMessage(chatId, 'Iltimos, to\'g\'ri raqam kiriting.');
            return;
        }

        userState[chatId].a = a;
        userState[chatId].step = 'awaiting_b';
        bot.sendMessage(chatId, '"b" qiymatini kiriting:');
    } else if (userState[chatId] && userState[chatId].step === 'awaiting_b') {
        const b = parseFloat(msg.text);
        if (isNaN(b)) {
            bot.sendMessage(chatId, 'Iltimos, to\'g\'ri raqam kiriting.');
            return;
        }

        const a = userState[chatId].a;
        if (userState[chatId].strategy === 'strategy1') {
            const resultA = Math.pow(Math.sqrt(a) - 0.25, 2);
            const resultB = Math.pow(Math.sqrt(b) + 0.25, 2);
            bot.sendMessage(chatId, `Natija: \na: ${resultA}\nb: ${resultB}`);
        } else if (userState[chatId].strategy === 'strategy2') {
            // Qo'shimcha logika kerak bo'lsa, bu yerda amalga oshirish mumkin
            bot.sendMessage(chatId, '2-strategiya natijalari hali aniqlanmagan.');
        }

        // Holatni tozalash
        delete userState[chatId];
    }
});
