import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sh-select',
  templateUrl: './sh-select.component.html',
  styleUrls: ['./sh-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShSelectComponent),
      multi: true
    }
  ]
})
export class ShSelectComponent implements OnInit, ControlValueAccessor {
  @Input() shData: any[] = [];
  _sData: { [key: string]: any[] } = {};

  @Input() shMultiple: boolean = false;
  @Input() shPlaceHolder: string = 'Select';

  @Input() shSearchPlaceHolder: string = '';
  @Input() shShowSearch: boolean = false;

  selectedOptions: any[] = [];
  dropdownOpen = false;

  // ControlValueAccessor methods
  private onChange: any = () => { };
  private onTouched: any = () => { };

  ngOnInit(): void {
    this.initializeOptions();
    this.selectedOptions = [];
  }

  initializeOptions(): void {
    this.shData.forEach(data => {
      if (data.group) {
        if (this._sData[data.group]) {
          this._sData[data.group].push(data);
        } else {
          this._sData[data.group] = [data];
        }
      }
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  modelChangeEmit() {
    let _model: any[] = [];
    if (this.shMultiple) {
      this.selectedOptions.forEach(option => {
        _model.push(option.value);
      });
    } else {
      _model = this.selectedOptions[0]?.value;
    }
    this.onChange(_model);
  }

  selectOption(option: any, event: any): void {
    if (this.shMultiple) {
      if (event.target.checked) {
        this.selectedOptions.push(option);
      } else {
        this.selectedOptions = this.selectedOptions.filter(o => o !== option);
      }
    } else {
      this.selectedOptions = [option];
      this.toggleDropdown();
    }
    this.modelChangeEmit();
  }

  removeTag(option: any, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedOptions = this.selectedOptions.filter(o => o !== option);
    this.modelChangeEmit();
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (value) {
      this.selectedOptions = this.shMultiple ? this.shData.filter(option => value.includes(option.value)) : [this.shData.find(option => option.value === value)];
    } else {
      this.selectedOptions = [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Nếu cần thêm logic để quản lý disabled state
  }
}
