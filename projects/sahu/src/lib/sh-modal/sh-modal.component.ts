import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sh-modal',
  templateUrl: './sh-modal.component.html',
  styleUrls: ['./sh-modal.component.scss']
})
export class ShModalComponent {
  @Input() shRouterLink?: string = '';
  @Input() shType?: 'modal' | 'submit' | 'reset' = 'modal';
  @Input() shClass: string = '';
  @Input() disabled = false;

  @Output() shClick = new EventEmitter<Event>();

  handleClick(event: Event): void {
    if (!this.disabled) {
      this.shClick.emit(event);
    }
  }
}
