import { Component, Input } from '@angular/core';

@Component({
  selector: 'sh-button',
  templateUrl: './sh-button.component.html',
  styleUrls: ['./sh-button.component.scss']
})
export class ShButtonComponent {
  @Input() shType: 'button' | 'submit' | 'reset' = 'button';
  @Input() shClass: string = '';
  @Input() disabled = false;
}
