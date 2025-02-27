import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'sh-button',
  templateUrl: './sh-button.component.html',
  styleUrls: ['./sh-button.component.scss']
})
export class ShButtonComponent implements OnChanges {
  @Input() shType: 'button' | 'submit' | 'reset' = 'button';
  @Input() shLabel: string = '';
  @Input() shClass: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'blank' = 'default';
  @Input() shSize: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() disabled = false;

  @Input() shIcon?: string;
  iconLeft: string = '';
  iconRight: string = '';

  @Output() shClick = new EventEmitter<Event>();

  ngOnChanges(): void {
    this.updateButton();
  }

  private iconArr(iconRule: string): string[] {
    return iconRule.includes(',') ? iconRule.split(',') : [iconRule];
  }

  private updateButton(): void {
    const sanitizedIcon = this.shIcon?.trim().replace(/\s+/g, '') || '';

    if (!sanitizedIcon) return;

    const [leftIcon, rightIcon] = this.iconArr(sanitizedIcon);

    if (leftIcon !== '*') this.iconLeft = leftIcon;
    if (rightIcon && rightIcon !== '*') this.iconRight = rightIcon;
  }

  handleClick(event: Event): void {
    if (!this.disabled) {
      this.shClick.emit(event);
    }
  }
}
