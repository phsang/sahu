import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  ],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'scale(0.7)'
      })),
      transition(':enter, :leave', [
        animate(100)
      ])
    ])
  ]
})

export class ShSelectComponent implements OnInit, ControlValueAccessor {
  @ViewChild('inputHidden') inputHidden!: ElementRef;
  @ViewChild('selectSelection') selectSelection!: ElementRef;

  @Input() shData: any[] = [];
  _sData: { [key: string]: any[] } = {};

  @Input() shId?: string = '';
  @Input() shName?: string = '';
  @Input() shMultiple: boolean = false;
  @Input() shPlaceHolder: string = 'Select';
  @Input() shDataVali?: string = '';

  @Input() shSearchPlaceHolder: string = 'Filter';
  @Input() shShowSearch: boolean = false;

  @Output() shChange = new EventEmitter<any>();

  inputValue: any = null;
  dropdownPosition: string = 'bottom';

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

    // thêm class để hiển thị popup phía trên, nếu popup vượt qua khỏi màn hình
    if (this.dropdownOpen) {
      let dropdownTop = this.selectSelection.nativeElement.getBoundingClientRect().top + this.selectSelection.nativeElement.getBoundingClientRect().height;
      let windowHeight = window.innerHeight;

      if (dropdownTop + 220 > windowHeight) {
        this.dropdownPosition = 'top';
      } else {
        this.dropdownPosition = 'bottom';
      }
    }
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
    this.inputValue = _model;
    this.onChange(_model);
    this.shChange.emit(_model); // Emit the model change to the parent
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
    this.inputHidden.nativeElement.dispatchEvent(new Event('change'));
  }

  removeTag(option: any, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedOptions = this.selectedOptions.filter(o => o !== option);
    this.modelChangeEmit();
    this.inputHidden.nativeElement.dispatchEvent(new Event('change'));
  }

  reset(event: Event): void {
    event.stopPropagation();
    this.selectedOptions = [];
    this.modelChangeEmit();
    this.onChange(null);
    this.inputHidden.nativeElement.dispatchEvent(new Event('change'));
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (value) {
      let _model: any[] = [];
      this.selectedOptions = this.shMultiple ? this.shData.filter(option => value.includes(option.value)) : [this.shData.find(option => option.value === value)];

      if (this.shMultiple) {
        this.selectedOptions.forEach(option => {
          _model.push(option.value);
        });
      } else {
        _model = this.selectedOptions[0]?.value;
      }
      this.inputValue = _model;
    } else {
      this.selectedOptions = [];
      this.inputValue = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Add logic to manage the disabled state if needed
  }
}
