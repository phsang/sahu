import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'sh-avatar',
  templateUrl: './sh-avatar.component.html',
  styleUrls: ['./sh-avatar.component.scss']
})
export class ShAvatarComponent implements AfterViewInit, OnChanges {
  @ViewChild('shAvatar') shAvatar!: ElementRef;
  @Input() shSrc?: string;
  @Input() shIcon: true | false = true;
  @Input() shText: string = 'A';
  @Input() shBackgroundColor: string = '#d1d1d1';
  @Input() shColor: string = '#fff';
  @Input() shAnimated: boolean = true;
  @Input() shShape: 'circle' | 'square' = 'circle';
  @Input() shSize: 'default' | 'large' | 'small' | number = 'default';
  @Input() shOnload?: () => void;

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shSrc'] || changes['shText']) {
      this.resetAvatarClass();
    }
  }

  private resetAvatarClass(): void {
    if (this.shAvatar) {
      this.renderer.removeClass(this.shAvatar.nativeElement, 'avatar-loaded');
    }
  }

  handleLoad(): void {
    if (this.shOnload) {
      this.shOnload();
    }
    this.renderer.addClass(this.shAvatar.nativeElement, 'avatar-loaded');
  }

  isNumeric(value: any): value is number {
    return !isNaN(value) && typeof value === 'number';
  }
}
