import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'sh-button',
  templateUrl: './sh-button.component.html',
  styleUrls: ['./sh-button.component.scss']
})
export class ShButtonComponent implements OnChanges {
  @Input() shType?: 'button' | 'submit' | 'reset' = 'button';
  @Input() shVariant?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'outline-primary' | 'outline-info' | 'outline-success' | 'outline-warning' | 'outline-danger' | 'blank' = 'primary';
  @Input() shClass?: string = '';
  @Input() shLabel?: string = '';
  @Input() shSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() shDisabled = false;
  @Input() shLoading = false;
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
    const sanitizedIcon = this.shIcon?.trim().replace(/\s+/g, '') || null;
    if (!sanitizedIcon) return;

    const [leftIcon, rightIcon] = this.iconArr(sanitizedIcon);
    if (leftIcon !== '*') this.iconLeft = leftIcon;
    if (rightIcon && rightIcon !== '*') this.iconRight = rightIcon;
  }

  handleClick(event: Event): void {
    if (!this.shDisabled && !this.shLoading) {
      this.shClick.emit(event);
    }
  }
}
