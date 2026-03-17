import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'trimTag', })
export class TrimTagPipe implements PipeTransform {
  transform(value: string): string {
    return value.length > 9 ? value.substring(0, 8) + '*' : value;
  }
}
