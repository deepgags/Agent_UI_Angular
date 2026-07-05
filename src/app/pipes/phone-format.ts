import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "phone",
})
export class PhoneNumberFormatPipe implements PipeTransform {
	transform(value: any): any {
		if (!value) {
			return value;
		}
		// Strip all non-digit characters
		let digits = value.toString().replace(/\D/g, "");
		// Remove leading country code "1" for North American numbers (11 digits)
		if (digits.length === 11 && digits.startsWith("1")) {
			digits = digits.substring(1);
		}
		// Format 10-digit number as (XXX) XXX-XXXX
		if (digits.length === 10) {
			return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
		}
		// Return cleaned digits for any other length
		return digits || value;
	}
}
