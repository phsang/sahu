import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sh-button',
  templateUrl: './sh-button.component.html',
  styleUrls: ['./sh-button.component.scss']
})
export class ShButtonComponent {
  @Input() shType: 'button' | 'submit' | 'reset' = 'button';
  @Input() shLabel: string = '';
  @Input() shClass: 'btn-default' | 'btn-primary' = 'btn-default';
  @Input() disabled = false;

  @Output() shClick = new EventEmitter<Event>();

  handleClick(event: Event): void {
    if (!this.disabled) {
      this.shClick.emit(event);
    }
  }
}
