import { Pipe, PipeTransform } from '@angular/core';

import { strings_es as s } from '../../../assets/strings/strings-es';

@Pipe({
  name: 'testament',
  standalone: false
})
export class TestamentPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value === '0' ? s.start2 : value === '1' ? s.start3 : '';
  }

}
