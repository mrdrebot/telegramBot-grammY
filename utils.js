// // Підключаємо файл JSON із питаннями
const questions = require('./questions.json');
// Імпортуємо генератор випадкових чисел
const { Random } = require('random-js');

// // Отримання номеру рандомного питання із файлу 
// const getRandomQuestion = (topic) => {
// 	const questionTopic = topic.toLowerCase();
// 	const randomQuestionIndex = Math.floor(
// 		Math.random() * questions[questionTopic].length,
// 	);
// 	return questions[questionTopic][randomQuestionIndex];
// };


const getRandomQuestion = (topic) => {
	const questionTopic = topic.toLowerCase();
	const random = new Random();
	const randomQuestionIndex = random.integer(0, questions[questionTopic].length - 1);
	return questions[questionTopic][randomQuestionIndex];
};

// Функція пошуку відповіді
const getCorrectAnswer = (topic, id) => {
	const question = questions[topic].find((question) => question.id === id);
	if (!question?.hasOptions) {
		return question.answer;
	}
	return question.options.find((option) => option.isCorrect).text;
};

module.exports = {
	getRandomQuestion,
	getCorrectAnswer
};