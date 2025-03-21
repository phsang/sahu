import { Component, Input, Output, EventEmitter, ElementRef, forwardRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatePickerPanelComponent } from './date-picker-panel/sh-date-picker-panel.component';
import moment from 'moment';

@Component({
  selector: 'sh-date-picker',
  templateUrl: './sh-date-picker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShDatePickerComponent),
      multi: true
    }
  ]
})
export class ShDatePickerComponent implements ControlValueAccessor {
  @Input() shId?: string;
  @Input() shName?: string;
  @Input() shPlaceHolder?: string;
  @Input() shMin?: Date;
  @Input() shMax?: Date;
  @Input() shIcon: string = 'calendar';
  @Input() shFormat: string = 'DD-MM-YYYY';
  @Input() shSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() shRange: boolean = false;
  @Input() shDataVali?: string;
  @Input() ngModel?: Date | [Date, Date];
  @Output() ngModelChange = new EventEmitter<Date | [Date, Date]>();

  private overlayRef?: OverlayRef;
  displayValue: string = '';
  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(private overlay: Overlay, private elementRef: ElementRef) { }

  writeValue(value: Date | [Date, Date]): void {
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
      // if (JSON.stringify(this.ngModel) !== JSON.stringify(value)) {
      this.ngModel = value;
      // this.onChange(value);
      this.ngModelChange.emit(value);
      this.updateDisplayValue();
      this.triggerInputChange();
      // }

      this.overlayRef?.dispose();
      this.overlayRef = undefined;
    });

    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef?.dispose();
      this.overlayRef = undefined;
    });
  }

  updateDisplayValue() {
    if (!this.shRange && this.ngModel instanceof Date) {
      this.displayValue = moment(this.ngModel).format(this.shFormat);
    } else if (this.shRange && this.ngModel instanceof Array && this.ngModel.length === 2) {
      this.displayValue = `${moment(this.ngModel[0]).format(this.shFormat)} - ${moment(this.ngModel[1]).format(this.shFormat)}`;
    } else {
      this.displayValue = '';
    }
  }

  triggerInputChange() {
    const inputElement = this.elementRef.nativeElement.querySelector('sh-input input');
    if (inputElement) {
      inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  onInputDateChange(value: any) {
    this.ngModel = value;
    this.ngModelChange.emit(this.ngModel);
    this.updateDisplayValue();
  }
}
