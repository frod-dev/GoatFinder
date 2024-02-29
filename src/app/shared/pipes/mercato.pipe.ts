import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mercato'
})
export class MercatoPipe implements PipeTransform {

  transform(value: number | string): string {
    if (!value) {
      return '';
    }

    const numero = parseFloat(value.toString());
    if (isNaN(numero)) {
      return value.toString();
    }

    return `${numero.toFixed(1)}M€`;
  }
}