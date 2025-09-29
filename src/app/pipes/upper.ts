import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'upper'
})

export class UpperCase implements PipeTransform {

    transform(value: any): any {
        if (!value) {return value;}

        return value.toUpperCase();
    }
}