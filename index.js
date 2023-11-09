// 
require('dotenv').config();
// Обращаемся к библиотеке grammy и импортируем класс Bot
const { Bot, Keyboard, InlineKeyboard, GrammyError, HttpError } = require('grammy');
// Создаем бота на основе импортированного класса, передавая
// в качестве аргумента строку с уникальным токеном, который
// получили ранее в BotFather
const bot = new Bot(process.env.BOT_API_KEY);
// імпорт функції по випадковим числам для вибору питань
const { getRandomQuestion, getCorrectAnswer } = require('./utils');

// Запускаем бота
bot.start();

// Налаштовуємо відповідь на подію "start" (вивід додаткової клавіатури)
bot.command('start', async (ctx) => {
	const startKeyboard = new Keyboard()
		.text('HTML')                           // create new buttons
		.text('CSS')
		.row()                                  // розділяємо кнопки
		.text('JavaScript')
		.text('React')
		.resized();                             // робимо так, що кнопки не розтягувалися
	await ctx.reply(
		'Привет! Я - Frontend Interview Prep Bot 🤖 \nЯ помогу тебе подготовиться к интервью по фронтенду',
	);
	await ctx.reply('С чего начнем? Выбери тему вопроса в меню 👇', {   // відправка клавіатури користувачу після отримання відповіді запиту "start"
		reply_markup: startKeyboard,
	});
});

// Реакція на повідомлення "HTML"
bot.hears(['HTML', 'CSS', 'JavaScript', 'React'], async (ctx) => {
	const topic = ctx.message.text;
	const question = getRandomQuestion(topic);
	let keyboard;

	if (question.hasOptions) {
		const buttonRows = question.options.map((option) => [
			InlineKeyboard.text(
				option.text,
				JSON.stringify({
					type: `${topic.toLowerCase()}-option`,
					isCorrect: option.isCorrect,
					questionId: question.id,
				}),
			),
		]);
		keyboard = InlineKeyboard.from(buttonRows);
	} else {
		keyboard = new InlineKeyboard().text(
			'Узнать ответ',
			JSON.stringify({
				type: ctx.message.text.toLowerCase(),
				questionId: question.id,
			}),
		);
	}
	await ctx.reply(question.text, {
		reply_markup: keyboard,
	});
});

// реакція на вибір повідомлень, які мають вкладення (данні)
bot.on('callback_query:data', async (ctx) => {
	const callbackData = JSON.parse(ctx.callbackQuery.data);

	if (!callbackData.type.includes('option')) {
		await ctx.reply(
			getCorrectAnswer(callbackData.type, callbackData.questionId), {
				parse_mode: 'HTML',
				disable_web_page_preview: true
			},
		);
		await ctx.answerCallbackQuery();
		return;
	}

	if (callbackData.isCorrect) {
		await ctx.reply('Верно ✅');
		await ctx.answerCallbackQuery();
		return;
	}
    
	const answer = getCorrectAnswer(
		callbackData.type.split('-')[0],
		callbackData.questionId,
	);

	await ctx.reply(`Неверно ❌ Правильный ответ: ${answer}`);
	await ctx.answerCallbackQuery();  // нужна для того, чтобы Telegram перестал ждать ответа на этот запрос. Такое ожидание запускается автоматически каждый раз, когда пользователь нажимает на кнопку в Inline-клавиатуре
});

// Обробка помилок
bot.catch((err) => {
	const ctx = err.ctx;
	console.error(`Error while handling update ${ctx.update.update_id}:`);
	const e = err.error;

	if (e instanceof GrammyError) {
		console.error('Error in request:', e.description);
	} else if (e instanceof HttpError) {
		console.error('Could not contact Telegram:', e);
	} else {
		console.error('Unknown error:', e);
	}
});