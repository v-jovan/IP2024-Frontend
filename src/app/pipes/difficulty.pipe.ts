import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'difficulty',
  standalone: true
})
export class DifficultyPipe implements PipeTransform {
  transform(value: string): string {
    switch (value.toLowerCase()) {
      case 'beginner':
        return 'Početnik';
      case 'intermediate':
        return 'Srednji';
      case 'advanced':
        return 'Napredni';
      default:
        return 'Nepoznato';
    }
  }
}
