import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { getIconList } from '../utils/icon-list';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'sh-input',
  templateUrl: './sh-input.component.html',
  styleUrls: ['./sh-input.component.scss']
})
export class ShInputComponent implements AfterViewInit, OnChanges {
  @ViewChild('shInput') shInput!: ElementRef;
  @Input() shType: 'text' | 'radio' | 'checkbox' | 'email' | 'file' | 'hidden' | 'password' | 'range' = 'text';
  @Input() shIcon?: any;
  // @Input() shIconTheme: 'light' | 'regular' | 'solid' | 'duotone' = 'light';
  @Input() shIconTheme?: any;
  @Input() shName?: string;
  @Input() shId?: string;
  @Input() shClass?: string;
  @Input() shValue?: string;
  @Input() shReadonly: boolean = false;
  @Input() shDisabled: boolean = false;
  @Input() shPlaceholder?: string;
  @Input() shChecked: boolean = false;
  @Input() shDataVali?: string;
  inputClass: string = '';
  iconLeft: SafeHtml = '';
  iconRight: SafeHtml = '';

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  ngAfterViewInit(): void {
    this.updateInputClass();
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shSrc'] || changes['shText']) {
      this.resetInputClass();
      this.updateInputClass();
    }
  }

  private updateInputClass(): void {
    this.renderer.addClass(this.shInput.nativeElement, `sh-input`);
    this.renderer.addClass(this.shInput.nativeElement, `sh-input-${this.shType}`);

    if (this.shIcon) {
      this.renderer.addClass(this.shInput.nativeElement, `sh-input-icon`);
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

      console.log(this.shIcon, this.shIconTheme);

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

  resetInputClass(): void {
    if (this.shInput) {
      this.renderer.removeClass(this.shInput.nativeElement, 'input-focus');
    }
  }

  handleFocus(event: FocusEvent): void {
    if (this.shInput) {
      this.renderer.addClass(this.shInput.nativeElement, 'input-focus');
    }
  }
}
