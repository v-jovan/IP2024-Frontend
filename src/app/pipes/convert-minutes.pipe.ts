import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertMinutes',
  standalone: true
})
export class ConvertMinutesPipe implements PipeTransform {
  transform(value: number): string {
    if (value < 0) {
      return '0m'; // Handle negative numbers
    }
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`; // Show both hours and minutes if minutes are more than one hour
    }
    return `${minutes}min`; // Only show minutes if less than one hour
  }
}
