import { Component, Input, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'sh-input',
  templateUrl: './sh-input.component.html',
  styleUrls: ['./sh-input.component.scss']
})
export class ShInputComponent {
  @Input() shPrefix?: string;
  @Input() shSuffix?: string;
  @Input() shType: string = 'text';
  @Input() shName: string = '';
  @Input() shId: string = '';
  @Input() shClass: string = '';
  @Input() shAutocomplete: 'on' | 'off' = 'on';
  @Input() shPlaceholder: string = '';
  @Input() shSize: 'large' | 'small' | 'default' = 'default';
  @Input() disabled: boolean = false;
  @Input() shValid: string = '';

  isFocused: boolean = false;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  toggleFocus(focused: boolean): void {
    this.isFocused = focused;
  }
}
