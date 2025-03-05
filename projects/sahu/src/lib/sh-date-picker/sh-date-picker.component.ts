import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DatePickerPanelComponent } from './date-picker-panel/sh-date-picker-panel.component';

@Component({
  selector: 'sh-date-picker',
  template: `<div class="date-picker-display" (click)="openDatePicker()">{{ displayValue || 'Select date' }}</div>`,
  styles: [`.date-picker-display { width: 100%; padding: 8px; border: 1px solid #ccc; cursor: pointer; text-align: center; }`]
})
export class ShDatePickerComponent {
  @Input() shMin?: string;
  @Input() shMax?: string;
  @Input() shRange: boolean = false;
  @Input() ngModel?: string | { start_date: string; end_date: string };
  @Output() ngModelChange = new EventEmitter<string | { start_date: string; end_date: string }>();

  private overlayRef?: OverlayRef;
  displayValue: string = '';

  constructor(private overlay: Overlay, private elementRef: ElementRef) { }

  openDatePicker() {
    if (this.overlayRef) {
      return;
    }

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }]);

    this.overlayRef = this.overlay.create({ positionStrategy, hasBackdrop: true });
    const portal = new ComponentPortal(DatePickerPanelComponent);
    const componentRef = this.overlayRef.attach(portal);

    componentRef.instance.shMin = this.shMin;
    componentRef.instance.shMax = this.shMax;
    componentRef.instance.shRange = this.shRange;
    componentRef.instance.valueChange.subscribe((value: any) => {
      this.ngModel = value;
      this.ngModelChange.emit(value);
      this.updateDisplayValue();
      this.overlayRef?.dispose();
      this.overlayRef = undefined;
    });

    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef?.dispose();
      this.overlayRef = undefined;
    });
  }

  updateDisplayValue() {
    if (this.shRange && typeof this.ngModel === 'object') {
      this.displayValue = `${this.ngModel.start_date} - ${this.ngModel.end_date}`;
    } else if (typeof this.ngModel === 'string') {
      this.displayValue = this.ngModel;
    } else {
      this.displayValue = '';
    }
  }
}
