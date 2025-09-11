import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "phoneNumber",
	standalone: true,
})
export class PhoneNumberPipe implements PipeTransform {
	transform(value: string): string {
		if (!value) {
			return "";
		}

		const areaCode = value.slice(0, 3);
		const firstPart = value.slice(3, 6);
		const secondPart = value.slice(6, 10);

		return `(${areaCode}) ${firstPart}-${secondPart}`;
	}
}
