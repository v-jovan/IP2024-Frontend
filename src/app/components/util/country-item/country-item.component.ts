import { Component, Input } from '@angular/core';

interface Country {
  name: string;
  code: string;
}

@Component({
  selector: 'country-item',
  standalone: true,
  imports: [],
  template: `
    <div>
      <img
        src="/assets/flag_placeholder.png"
        [class]="'flag flag-' + country.code.toLowerCase()"
      />
      <span>{{ country.name }}</span>
    </div>
  `
})
export class CountryItemComponent {
  @Input() country!: Country;
}
