import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'sh-avatar',
  templateUrl: './sh-avatar.component.html',
  styleUrls: ['./sh-avatar.component.scss']
})
export class ShAvatarComponent implements AfterViewInit, OnChanges {
  @ViewChild('shAvatar') shAvatar!: ElementRef;
  @Input() shSrc?: string;
  @Input() shClass?: string;
  @Input() shIcon: true | false = true;
  @Input() shText: string = 'A';
  @Input() shBackgroundColor: '#d9d9d9' | string = '#d9d9d9';
  @Input() shColor: '#fff' | string = '#fff';
  @Input() shAnimated: boolean = true;
  @Input() shShape: 'circle' | 'square' = 'circle';
  @Input() shSize?: 'large' | 'small' | number;
  @Input() shOnload?: () => void;

  avatarClass = '';

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.updateAvatarClass();
    this.cdr.detectChanges(); // Giải quyết vấn đề ExpressionChangedAfterItHasBeenCheckedError
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shSrc'] || changes['shText']) {
      this.resetAvatarClass();
      this.updateAvatarClass();
    }
  }

  private updateAvatarClass(): void {
    this.avatarClass = `${this.shClass ? this.shClass : ''} sh-avatar-${this.shShape}`;

    if (this.shSize === 'large') {
      this.avatarClass += ' sh-avatar-large';
    } else if (this.shSize === 'small') {
      this.avatarClass += ' sh-avatar-small';
    }

    if (this.shAnimated && this.shSrc) {
      this.avatarClass += ' avatar-animated';
    }

    this.avatarClass += ' sh-avatar';
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
