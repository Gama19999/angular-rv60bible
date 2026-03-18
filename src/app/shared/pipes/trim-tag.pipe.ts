import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'trimTag', })
export class TrimTagPipe implements PipeTransform {
  transform(value: string, length: number = 9): string {
    return value.length > length ? value.substring(0, length - 1) + '*' : value;
  }
}
