import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'sh-button',
  templateUrl: './sh-button.component.html',
  styleUrls: ['./sh-button.component.scss']
})
export class ShButtonComponent implements OnChanges {
  @Input() shType: 'button' | 'submit' | 'reset' = 'button';
  @Input() shLabel: string = '';
  @Input() shClass: 'btn-default' | 'btn-primary' | 'btn-blank' = 'btn-default';
  @Input() shSize: 'btn-sm' | 'btn-md' | 'btn-lg' | 'btn-xl' = 'btn-md';
  @Input() disabled = false;

  @Input() shIcon?: string;
  iconLeft: string = '';
  iconRight: string = '';

  @Output() shClick = new EventEmitter<Event>();

  ngOnChanges(): void {
    this.updateButton();
  }

  iconArr(iconRule: string): any {
    if (iconRule.includes(',')) {
      return iconRule.split(',');
    } else {
      return [iconRule];
    }
  }

  private updateButton(): void {
    this.shIcon = this.shIcon?.trim().replace(/\s+/g, '') || '';

    if (this.shIcon != '') {
      let iconArray = this.iconArr(this.shIcon);
      if (iconArray[0] !== '*') {
        this.iconLeft = iconArray[0];
      }
      if (iconArray[1] && iconArray[1] !== '*') {
        this.iconRight = iconArray[1];
      }
    }
  }

  handleClick(event: Event): void {
    if (!this.disabled) {
      this.shClick.emit(event);
    }
  }
}
