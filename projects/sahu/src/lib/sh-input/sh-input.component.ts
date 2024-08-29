import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'sh-input',
  templateUrl: './sh-input.component.html',
  styleUrls: ['./sh-input.component.scss']
})
export class ShInputComponent implements AfterViewInit, OnChanges {
  @ViewChild('shInput') shInput!: ElementRef;
  @Input() shType: 'text' | 'radio' | 'checkbox' | 'email' | 'file' | 'hidden' | 'password' | 'range' = 'text';
  @Input() shName: string = '';
  @Input() shId: string = '';
  @Input() shClass: string = '';
  @Input() shValue: string = '';
  @Input() shReadonly: boolean = false;
  @Input() shDisabled: boolean = false;
  @Input() shPlaceholder: string = '';
  @Input() shChecked: boolean = false;
  @Input() shDataVali: string = '';
  inputClass: string = '';

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) { }

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
    this.inputClass = `sh-input ${this.shClass ? this.shClass : ''}`;

    if (
      this.shType === 'radio' ||
      this.shType === 'checkbox' ||
      this.shType === 'file'
    ) {
      this.renderer.addClass(this.shInput.nativeElement, `sh-input-${this.shType}`);
    }
  }

  private resetInputClass(): void {
    if (this.shInput) {
      this.renderer.removeClass(this.shInput.nativeElement, 'input-loaded');
    }
  }
}
