import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, Output, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { getIconList } from '../utils/icon-list';
import { slideDown, slideUp } from '../utils/mf.animation';

@Component({
  selector: 'sh-input',
  templateUrl: './sh-input.component.html',
  styleUrls: ['./sh-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShInputComponent),
      multi: true
    }
  ]
})
export class ShInputComponent implements ControlValueAccessor {
  @Input() shType: 'text' | 'radio' | 'checkbox' | 'email' | 'file' | 'hidden' | 'password' | 'range' = 'text';
  @Input() shIcon?: any;
  @Input() shIconTheme?: any;
  @Input() shName?: string;
  @Input() shId?: string;
  @Input() shValue?: string;
  @Input() shReadonly: boolean = false;
  @Input() shDisabled: boolean = false;
  @Input() shLabel?: string;
  @Input() shPlaceholder?: string;
  @Input() shChecked: boolean = false;
  @Input() shAutocomplete?: string;

  @Input() shDataVali?: string;
  shClass: string = 'sh-input';
  iconLeft: SafeHtml = '';
  iconRight: SafeHtml = '';

  // input file
  @Input() shReview?: boolean = false;
  @Output() shChange = new EventEmitter<File>();

  value: string = '';
  onChange = (_: any) => { };
  onTouched = () => { };

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  writeValue(value: string): void {
    this.value = value;

    this.updateInputClass();
  }

  private updateInputClass(): void {
    let classType = `sh-input-${this.shType}`;
    if (!this.shClass.includes(classType)) {
      this.shClass += ' ' + classType;
    }

    if (this.shIcon) {
      let classIcon = 'sh-input-icon';
      if (!this.shClass.includes(classIcon)) {
        this.shClass += ' ' + classIcon;
      }
      if (!this.shIconTheme) {
        this.shIconTheme = 'light';
      }

      if (this.shIcon?.includes(',')) {
        this.shIcon = this.shIcon.trim().split(',');
        this.shIcon = this.shIcon.map((ico: any) => {
          const trimmedIcon = ico.trim();
          return trimmedIcon === '*' ? null : trimmedIcon;
        });

        if (this.shIconTheme?.includes(',')) {
          this.shIconTheme = this.shIconTheme.trim().split(',');
          this.shIconTheme = this.shIconTheme.map((ico: any) => {
            const trimmedIcon = ico.trim();
            return trimmedIcon === '*' ? null : trimmedIcon;
          });
        } else {
          this.shIconTheme = [this.shIconTheme, this.shIconTheme];
        }
      } else {
        this.shIcon = [this.shIcon, null];
        this.shIconTheme = [this.shIconTheme, this.shIconTheme];
      }

      if (this.shIcon[0]) {
        let _icon = getIconList(this.shIcon[0], this.shIconTheme[0]);
        let attributes = `fill="currentColor" height="1em" width="1em"`;

        if (_icon) {
          _icon = _icon.replace('<svg', `<svg ${attributes}`);
          this.iconLeft = this.sanitizer.bypassSecurityTrustHtml(_icon.trim());
        }
      }
      if (this.shIcon[1]) {
        let _icon = getIconList(this.shIcon[1], this.shIconTheme[1]);
        let attributes = `fill="currentColor" height="1em" width="1em"`;

        if (_icon) {
          _icon = _icon.replace('<svg', `<svg ${attributes}`);
          this.iconRight = this.sanitizer.bypassSecurityTrustHtml(_icon.trim());
        }
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  parseDataVali(dataVali: string): any {
    // Loại bỏ ký tự bao quanh nếu có (dấu ngoặc vuông [])
    const trimmedData = dataVali.trim().replace(/^\[|\]$/g, '');

    // Tạo một regex để nhận diện từng phần tử
    const regex = /(\w+\([^\)]+\)|\w+)/g;
    const matches = trimmedData.match(regex);

    if (!matches) return []; // Trả về mảng rỗng nếu không có match

    return matches.map(item => {
      if (item.includes('file')) {
        const match = /file\(([^,]*?),\s*(.*?)\)/.exec(item);
        if (match) {
          return {
            key: 'file',
            type: match[1],
            size: match[2]
          };
        }
      }

      return { key: item }; // Trả về phần tử thông thường
    });
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valid = this.shDataVali ? this.parseDataVali(this.shDataVali) : null;
    let rule = null;

    if (valid?.length > 0) {
      rule = valid[0].key === 'file' ? valid[0] : (valid[1]?.key === 'file' ? valid[1] : null);
    }

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (rule) {
        const { type: allowedTypes, maxSize } = { type: rule.type, maxSize: rule.size };

        let isValid = true;
        const errors: string[] = [];

        // Kiểm tra loại file
        if (allowedTypes) {
          const allowedTypesArray = allowedTypes.split(':').map((type: string) => type.trim().toLowerCase());
          const fileType = file.type.split('/').pop()?.toLowerCase() || '';
          if (!allowedTypesArray.includes(fileType)) {
            isValid = false;
            errors.push(`Invalid file type. Allowed types are: ${allowedTypesArray.join(', ')}`);
          }
        }

        // Kiểm tra kích thước file
        if (maxSize) {
          const maxSizeInBytes = parseInt(maxSize) * 1024; // Giả định maxSize là KB
          if (file.size > maxSizeInBytes) {
            isValid = false;
            errors.push(`File size exceeds the limit of ${maxSize} KB.`);
          }
        }

        if (isValid) {
          this.shChange.emit(file);
        } else {
          console.warn('File validation failed:', errors);
          input.value = '';
          input.files = null;
        }

        input.dispatchEvent(new Event('change'));
      }
    }
  }

  handleFocus(): void {
    if (!this.shClass.includes('input-focus')) {
      this.shClass += ' input-focus';
    }
  }

  handleBlur(): void {
    if (this.shClass.includes('input-focus')) {
      this.shClass = this.shClass.replace('input-focus', '').trim();
    }
    this.onTouched();
  }

}
