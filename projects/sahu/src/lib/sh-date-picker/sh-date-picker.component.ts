import { Component, Input, Output, EventEmitter, ElementRef, forwardRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatePickerPanelComponent } from './date-picker-panel/sh-date-picker-panel.component';

@Component({
  selector: 'sh-date-picker',
  template: `<div class="date-picker-display" (click)="openDatePicker()">{{ displayValue || 'Select date' }}</div>`,
  styles: [`.date-picker-display { width: 100%; padding: 8px; border: 1px solid #ccc; cursor: pointer; text-align: center; }`],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShDatePickerComponent),
      multi: true
    }
  ]
})
export class ShDatePickerComponent implements ControlValueAccessor {
  @Input() shMin?: string;
  @Input() shMax?: string;
  @Input() shRange: boolean = false;
  @Output() ngModelChange = new EventEmitter<string | { start_date: string; end_date: string }>();

  private overlayRef?: OverlayRef;
  displayValue: string = '';
  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };
  private _value?: string | { start_date: string; end_date: string };

  constructor(private overlay: Overlay, private elementRef: ElementRef) { }

  get value(): any {
    return this._value;
  }

  set value(val: any) {
    this._value = val;
    this.updateDisplayValue();
    this.onChange(val);
    this.ngModelChange.emit(val);
  }

  openDatePicker() {
    if (this.overlayRef) return;

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }]);

    this.overlayRef = this.overlay.create({ positionStrategy, hasBackdrop: true });
    const portal = new ComponentPortal(DatePickerPanelComponent);
    const componentRef = this.overlayRef.attach(portal);

    componentRef.instance.shMin = this.shMin;
    componentRef.instance.shMax = this.shMax;
    componentRef.instance.shRange = this.shRange;
    componentRef.instance.valueChange.subscribe(value => {
      this.value = value;
      this.overlayRef?.dispose();
      this.overlayRef = undefined;
    });

    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef?.dispose();
      this.overlayRef = undefined;
    });
  }

  updateDisplayValue() {
    if (this.shRange && typeof this.value === 'object') {
      this.displayValue = `${this.value.start_date} - ${this.value.end_date}`;
    } else if (typeof this.value === 'string') {
      this.displayValue = this.value;
    } else {
      this.displayValue = '';
    }
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
