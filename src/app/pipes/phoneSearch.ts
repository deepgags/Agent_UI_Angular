import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'phone'
})

export class PhoneSearch implements PipeTransform {

    transform(value: any): any {
        if (!value) {return value;}
        if(!value.toString().includes('+1')){
            return "+1 " + value;
        }

        return value;
    }
}