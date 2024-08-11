import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'bottom-toolbar',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './bottom-toolbar.component.html',
  styleUrl: './bottom-toolbar.component.scss'
})
export class BottomToolbarComponent {
  @Input() saveLabel: string = 'Sačuvaj';
  @Input() discardLabel: string = 'Otkaži';
  @Input() disableSave: boolean = false;
  @Input() disableDiscard: boolean = false;

  @Output() onSave = new EventEmitter<void>();
  @Output() onDiscard = new EventEmitter<void>();
}
