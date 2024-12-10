import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  Renderer2,
  ViewChild,
  ChangeDetectorRef,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { getIconList } from '../utils/icon-list';

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
  @Input() shPlaceholder?: string;
  @Input() shChecked: boolean = false;
  @Input() shAutocomplete?: string;
  
  @Input() shDataVali?: string;
  shClass: string = 'sh-input';
  iconLeft: SafeHtml = '';
  iconRight: SafeHtml = '';

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
