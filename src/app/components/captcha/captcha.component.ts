import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputTextModule } from "primeng/inputtext";
import { CaptchaProblem, CaptchaService } from "../../services/captcha.service";

@Component({
	selector: "app-captcha",
	imports: [CommonModule, ReactiveFormsModule, IftaLabelModule, InputTextModule, ButtonModule],
	templateUrl: "./captcha.component.html",
	styleUrl: "./captcha.component.scss",
	standalone: true,
})
export class CaptchaComponent implements OnInit {
	@Output() captchaValidated = new EventEmitter<boolean>();

	captchaAnswer = new FormControl("", [Validators.required]);
	currentProblem: CaptchaProblem | null = null;
	isValidating = false;
	errorMessage = "";

	constructor(private captchaService: CaptchaService) {}

	ngOnInit(): void {
		this.generateNewProblem();
	}

	generateNewProblem(): void {
		this.currentProblem = this.captchaService.generateProblem();
		this.captchaAnswer.setValue("");
		this.captchaAnswer.markAsUntouched();
		this.errorMessage = "";
		this.captchaValidated.emit(false);
	}

	validateCaptcha(): boolean {
		if (!this.captchaAnswer.value) {
			this.errorMessage = "Please enter the answer";
			return false;
		}

		const isValid = this.captchaService.validateAnswer(this.captchaAnswer.value, this.currentProblem);

		if (!isValid) {
			this.errorMessage = "Incorrect answer. Please try again.";
			this.generateNewProblem(); // refresh on false answer
			return false;
		}

		this.errorMessage = "";
		this.captchaValidated.emit(true);
		return true;
	}

	// check and validate in parent
	isCaptchaValid(): boolean {
		if (!this.captchaAnswer.value || !this.captchaAnswer.value.trim()) {
			return false;
		}
		return this.captchaService.validateAnswer(this.captchaAnswer.value, this.currentProblem);
	}

	// get current error message
	getCaptchaError(): string {
		return this.errorMessage;
	}

	// validate and show error if invalid
	checkAndValidateCaptcha(): boolean {
		if (!this.isCaptchaValid()) {
			this.errorMessage = "Please solve the math problem correctly.";
			return false;
		}
		this.errorMessage = "";
		return true;
	}

	onAnswerInput(): void {
		this.errorMessage = "";
	}

	getCaptchaQuestion(): string {
		return this.currentProblem?.question || "Loading...";
	}

	reset(): void {
		this.generateNewProblem();
		this.captchaValidated.emit(false);
	}
}
