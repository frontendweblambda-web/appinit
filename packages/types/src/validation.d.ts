export type ValidatedAnswers<
	T extends import("./answers.js").Answers = import("./answers.js").Answers,
> = T & {
	_validated: true;
};
