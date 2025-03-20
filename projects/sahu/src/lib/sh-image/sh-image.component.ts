import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'sh-image',
  templateUrl: './sh-image.component.html',
  styleUrls: ['./sh-image.component.scss']
})
export class ShImageComponent implements AfterViewInit, OnChanges {
  @ViewChild('shImage') shImage!: ElementRef;
  @Input() shSrc?: string;
  @Input() shAlt?: string;
  @Input() shBackgroundColor: '#c0c0c0' | string = 'transparent';
  @Input() shColor: '#fff' | string = '#c0c0c0';
  @Input() shAnimated: boolean = true;
  @Input() shHeight?: number;
  @Input() shWidth?: number;
  @Input() shObjectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down' = 'cover';
  @Input() shBradius: number = 2;
  @Input() shOnload?: () => void;

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shSrc'] || changes['shAlt']) {
      this.resetImageClass();
    }
  }

  private resetImageClass(): void {
    if (this.shImage) {
      this.renderer.removeClass(this.shImage.nativeElement, 'image-loaded');
    }
  }

  handleLoad(): void {
    if (this.shOnload) {
      this.shOnload();
    }
    this.renderer.addClass(this.shImage.nativeElement, 'image-loaded');
  }

  isNumeric(value: any): value is number {
    return !isNaN(value) && typeof value === 'number';
  }
}
