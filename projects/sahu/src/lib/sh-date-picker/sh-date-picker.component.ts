import { Component, Input, Output, EventEmitter, ElementRef, forwardRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatePickerPanelComponent } from './date-picker-panel/sh-date-picker-panel.component';

@Component({
  selector: 'sh-date-picker',
  templateUrl: './sh-date-picker.component.html',
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
  @Input() ngModel?: string | { start_date: string; end_date: string };
  @Output() ngModelChange = new EventEmitter<string | { start_date: string; end_date: string }>();

  private overlayRef?: OverlayRef;
  displayValue: string = '';
  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(private overlay: Overlay, private elementRef: ElementRef) { }

  writeValue(value: string | { start_date: string; end_date: string }): void {
    this.ngModel = value;
    this.updateDisplayValue();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void { }

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
    componentRef.instance.value = this.ngModel;
    componentRef.instance.valueChange.subscribe(value => {
      this.ngModel = value;
      this.ngModelChange.emit(value);
      this.onChange(value);
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
    if (
      this.shRange &&
      typeof this.ngModel === 'object' &&
      this.ngModel?.start_date &&
      this.ngModel?.end_date
    ) {
      this.displayValue = `${this.ngModel.start_date} - ${this.ngModel.end_date}`;
    } else if (typeof this.ngModel === 'string' && this.ngModel !== '') {
      this.displayValue = this.ngModel;
    } else {
      this.displayValue = '';
    }
  }
}
