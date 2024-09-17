import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Pipe({
  name: 'url',
  standalone: true
})
export class UrlPipe implements PipeTransform {
  transform(value: string | undefined): string | undefined {
    if (value) {
      return `${environment.apiUrl}${value}`;
    }

    return value;
  }
}
