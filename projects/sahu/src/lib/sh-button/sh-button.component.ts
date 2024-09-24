import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sh-button',
  templateUrl: './sh-button.component.html',
  styleUrls: ['./sh-button.component.scss']
})
export class ShButtonComponent {
  @Input() shRouterLink?: string = '';
  @Input() shType?: 'button' | 'submit' | 'reset' = 'button';
  @Input() shTitle?: string = '';
  @Input() shClass: string = '';
  @Input() disabled = false;

  @Output() shClick = new EventEmitter<Event>();

  handleClick(event: Event): void {
    if (!this.disabled) {
      this.shClick.emit(event);
    }
  }
}
