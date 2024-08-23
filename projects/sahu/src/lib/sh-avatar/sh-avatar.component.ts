import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sh-avatar',
  templateUrl: './sh-avatar.component.html',
  styleUrls: ['./sh-avatar.component.scss']
})
export class ShAvatarComponent {
  @Input() shType: 'button' | 'submit' | 'reset' = 'button';
  @Input() shClass: string = '';
  @Input() disabled = false;

  @Output() shClick = new EventEmitter<Event>();

  handleClick(event: Event): void {
    if (!this.disabled) {
      this.shClick.emit(event);
    }
  }
}
