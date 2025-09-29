import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'camelCaseToCapitalize'
})
export class CamelCaseToCapitalize implements PipeTransform {
	transform(value: string): string | null {
		return value
			.replace(/([A-Z])/g, ' $1')
			.replace(/^./, (str) => str.toUpperCase())
			.trim();
	}
}