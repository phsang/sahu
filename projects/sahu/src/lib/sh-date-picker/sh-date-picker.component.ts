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
  @ViewChild('selectSelection') selectSelection!: ElementRef;

  @Input() shData: any[] = [];
  _sData: { [key: string]: any[] } = {};

  @Input() shId?: string = '';
  @Input() shName?: string = '';
  @Input() shDisabled?: boolean = false;
  @Input() shMultiple: boolean = false;
  @Input() shLine: number = 1;
  @Input() shPlaceHolder: string = 'Select';
  @Input() shDataVali?: string = '';
  @Input() shAllowClear?: boolean = true;

  @Input() shDisplay?: 'center' | 'bottom' | 'top' | 'left' | 'right' | 'bubble' = 'bubble';
  @Input() shHeaderText?: string;

  @Input() shFilter: boolean = false;
  @Input() shFilterPlaceHolder: string = 'Search';

  @Output() shChange = new EventEmitter<any>();

  inputValue: any = null;
  dropdownPosition: string = 'drop_down';
  selectedOptions: any[] = [];
  datePickerOpen = false;
  filterKey: string = '';

  // ControlValueAccessor methods
  private onChange: any = () => { };
  private onTouched: any = () => { };

  ngOnInit(): void {
    this.initializeOptions();
    this.selectedOptions = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shData'] && !changes['shData'].firstChange) {
      this.initializeOptions();
      this.updateSelectedOptions();
    }
  }

  updateSelectedOptions(): void {
    if (this.inputValue) {
      this.selectedOptions = this.shMultiple
        ? this.shData.filter(option => this.inputValue.includes(option.value))
        : [this.shData.find(option => option.value === this.inputValue)];
    }
  }

  initializeOptions(): void {
    this._sData = this.shData.reduce((acc, data) => {
      if (data.group) {
        acc[data.group] = acc[data.group] || [];
        acc[data.group].push(data);
      }
      return acc;
    }, {});
  }

  toggleDropdown(): void {
    if (this.shDisabled) {
      return;
    }

    this.datePickerOpen = !this.datePickerOpen;

    // thêm class để hiển thị popup phía trên, nếu popup vượt qua khỏi màn hình
    if (this.datePickerOpen) {

      // Mở lại filter khi vừa mở dropdown
      this.filterKey = '';
      if (!Object.keys(this._sData).length) {
        this.shData.forEach((item: any) => {
          let _label = this.removeAccent(item.label).toLowerCase();
          let _filterKey = this.removeAccent(this.filterKey).toLowerCase();

          item.visible = (_filterKey == '' || _label.match(_filterKey)) ? true : false;
        });
      }

      // xử lý khi shDisplay là bubble
      if (this.shDisplay == 'bubble') {
        let dropdownTop = this.selectSelection.nativeElement.getBoundingClientRect().top + this.selectSelection.nativeElement.getBoundingClientRect().height;
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
  }

  removeTag(option: any, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedOptions = this.selectedOptions.filter(o => o !== option);
    this.modelChangeEmit();
  }

  reset(event: Event): void {
    event.stopPropagation();
    this.selectedOptions = [];
    this.modelChangeEmit();
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

  removeAccent(str: string) {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  };

  filterData() {
    // xử lý filter khi không có group
    if (!Object.keys(this._sData).length) {
      this.shData.forEach((item: any) => {
        let _label = this.removeAccent(item.label).toLowerCase();
        let _filterKey = this.removeAccent(this.filterKey).toLowerCase();

        item.visible = (_filterKey == '' || _label.match(_filterKey)) ? true : false;
      });
    }
  }
}
