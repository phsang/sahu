import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sh-date-picker',
  templateUrl: './sh-date-picker.component.html',
  styleUrls: ['./sh-date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShDatePickerComponent),
      multi: true
    }
  ],
  animations: [
    trigger('shAnimation', [
      transition('bubble => void', [
        animate('220ms ease-out', style({ transform: 'scaleY(0)' }))
      ]),
      transition('void => bubble', [
        style({ transform: 'scaleY(0)' }),
        animate('220ms ease-in', style({ transform: 'scaleY(1)' }))
      ]),
      transition('center => void', [
        animate('220ms ease-out', style({ transform: 'translate(-50%, -50%) scale(0.8)', opacity: '0' }))
      ]),
      transition('void => center', [
        style({ transform: 'translate(-50%, -50%) scale(0.8)', opacity: '0' }),
        animate('220ms ease-in', style({ transform: 'translate(-50%, -50%) scale(1)', opacity: '1' }))
      ])
    ])
  ]
})

export class ShDatePickerComponent implements OnInit, ControlValueAccessor, OnChanges {
  @ViewChild('dateSelection') dateSelection!: ElementRef;

  @Input() shId?: string = '';
  @Input() shName?: string = '';
  @Input() shDisabled?: boolean = false;
  @Input() shRange: boolean = false;
  @Input() shPlaceHolder: string = 'Select';
  @Input() shDataVali?: string = '';
  @Input() shAllowClear?: boolean = true;
  @Input() shMin?: string;
  @Input() shMax?: string;

  @Input() shDisplay?: 'center' | 'bottom' | 'top' | 'left' | 'right' | 'bubble' = 'bubble';

  @Output() shChange = new EventEmitter<any>();

  inputValue: any = null;
  dropdownPosition: string = 'drop_down';
  datePickerOpen = false;

  // ControlValueAccessor methods
  private onChange: any = () => { };
  private onTouched: any = () => { };

  ngOnInit(): void {
    this.initializeOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  updateSelectedOptions(): void {
  }

  initializeOptions(): void {
  }

  toggleDropdown(): void {
    if (this.shDisabled) {
      return;
    }

    this.datePickerOpen = !this.datePickerOpen;

    // thêm class để hiển thị popup phía trên, nếu popup vượt qua khỏi màn hình
    if (this.datePickerOpen) {
      // xử lý khi shDisplay là bubble
      if (this.shDisplay == 'bubble') {
        let dropdownTop = this.dateSelection.nativeElement.getBoundingClientRect().top + this.dateSelection.nativeElement.getBoundingClientRect().height;
        let windowHeight = window.innerHeight;

        if (dropdownTop + 220 > windowHeight) {
          this.dropdownPosition = 'drop_top';
        } else {
          this.dropdownPosition = 'drop_down';
        }
      }
    }
  }

  closeDropdown(): void {
    this.datePickerOpen = false;
  }

  modelChangeEmit() {
    let _model: any[] = [];
    this.inputValue = _model;
    this.onChange(_model);
    this.shChange.emit(_model); // Emit the model change to the parent
  }

  selectOption(option: any, event: any): void {
    this.modelChangeEmit();
  }

  removeTag(option: any, event: MouseEvent): void {
    event.stopPropagation();
  }

  reset(event: Event): void {
    event.stopPropagation();
    this.modelChangeEmit();
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (value) {
    } else {
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
