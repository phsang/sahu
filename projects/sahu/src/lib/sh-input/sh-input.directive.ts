import { Directive, Input, Renderer2, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[sh-input]'
})
export class ShInputDirective {
  @Input() shPrefix?: string;
  @Input() shSuffix?: string;
  @Input() shType: string = 'text';
  @Input() shName: string = '';
  @Input() shId: string = '';
  @Input() shValue: string = '';
  @Input() shClass: string = '';
  @Input() shAutocomplete: 'on' | 'off' = 'on';
  @Input() shPlaceholder: string = '';
  @Input() shSize: 'large' | 'small' | 'default' = 'default';
  @Input() disabled: boolean = false;
  @Input() shValid: string = '';

  isFocused: boolean = false;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.applyAttributes();
  }

  @HostListener('focus') onFocus() {
    this.isFocused = true;
  }

  @HostListener('blur') onBlur() {
    this.isFocused = false;
  }

  private applyAttributes(): void {
    this.renderer.setAttribute(this.el.nativeElement, 'type', this.shType);
    if (this.shName) this.renderer.setAttribute(this.el.nativeElement, 'name', this.shName);
    if (this.shId) this.renderer.setAttribute(this.el.nativeElement, 'id', this.shId);
    if (this.shClass) this.renderer.addClass(this.el.nativeElement, this.shClass);
    if (this.shPlaceholder) this.renderer.setAttribute(this.el.nativeElement, 'placeholder', this.shPlaceholder);
    this.renderer.setAttribute(this.el.nativeElement, 'autocomplete', this.shAutocomplete);
    if (this.disabled) this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
  }
}
