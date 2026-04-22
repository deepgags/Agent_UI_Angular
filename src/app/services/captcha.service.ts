import { Injectable } from "@angular/core";

export interface CaptchaProblem {
	question: string;
	answer: number;
}

export interface CaptchaConfig {
	operators: string[];
	minNumber: number;
	maxNumber: number;
}

@Injectable({
	providedIn: "root",
})
export class CaptchaService {
	private defaultConfig: CaptchaConfig = {
		operators: ["+", "-", "×"],
		minNumber: 1,
		maxNumber: 10,
	};

	private currentProblem: CaptchaProblem | null = null;

	constructor() {}

	generateProblem(config: CaptchaConfig = this.defaultConfig): CaptchaProblem {
		const operator = config.operators[Math.floor(Math.random() * config.operators.length)];
		const num1 = Math.floor(Math.random() * (config.maxNumber - config.minNumber + 1)) + config.minNumber;
		const num2 = Math.floor(Math.random() * (config.maxNumber - config.minNumber + 1)) + config.minNumber;

		let answer: number;
		let question: string;

		switch (operator) {
			case "+":
				answer = num1 + num2;
				question = `${num1} + ${num2} = `;
				break;
			case "-":
				// Ensure positive result
				const larger = Math.max(num1, num2);
				const smaller = Math.min(num1, num2);
				answer = larger - smaller;
				question = `${larger} - ${smaller} = `;
				break;
			case "×":
				answer = num1 * num2;
				question = `${num1} × ${num2} = `;
				break;
			default:
				answer = num1 + num2;
				question = `${num1} + ${num2} = `;
		}

		this.currentProblem = { question, answer };
		return this.currentProblem;
	}

	validateAnswer(userAnswer: string, problem: CaptchaProblem | null = this.currentProblem): boolean {
		if (!problem) {
			return false;
		}

		const cleanAnswer = userAnswer.trim().toLowerCase();
		const expectedAnswer = problem.answer.toString();

		return cleanAnswer === expectedAnswer;
	}

	getCurrentProblem(): CaptchaProblem | null {
		return this.currentProblem;
	}

	reset(): void {
		this.currentProblem = null;
	}
}
