import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chapter',
  standalone: false
})
export class ChapterPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value.length > 1 ? value : '0' + value;
  }

}
