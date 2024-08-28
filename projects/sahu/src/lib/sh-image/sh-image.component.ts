import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'sh-image',
  templateUrl: './sh-image.component.html',
  styleUrls: ['./sh-image.component.scss']
})
export class ShImageComponent implements AfterViewInit, OnChanges {
  @ViewChild('shImage') shImage!: ElementRef;
  @Input() shSrc?: string;
  @Input() shClass?: string;
  @Input() shBackgroundColor: '#c0c0c0' | string = 'transparent';
  @Input() shColor: '#fff' | string = '#c0c0c0';
  @Input() shAnimated: boolean = true;
  @Input() shHeight: number = 56;
  @Input() shWidth: number = 56;
  @Input() shOnload?: () => void;

  imageClass = '';

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.updateImageClass();
    this.cdr.detectChanges(); // Giải quyết vấn đề ExpressionChangedAfterItHasBeenCheckedError
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shSrc'] || changes['shText']) {
      this.resetImageClass();
      this.updateImageClass();
    }
  }

  private updateImageClass(): void {
    this.imageClass = `${this.shClass ? this.shClass : ''} sh-image`;

    if (this.shAnimated && this.shSrc) {
      this.imageClass += ' image-animated';
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
