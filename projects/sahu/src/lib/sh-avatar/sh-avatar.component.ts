import { Component, Input, ElementRef, Renderer2, AfterViewInit, input, ViewChild } from '@angular/core';

@Component({
  selector: 'sh-avatar',
  templateUrl: './sh-avatar.component.html',
  styleUrls: ['./sh-avatar.component.scss']
})
export class ShAvatarComponent implements AfterViewInit {
  @ViewChild('shAvatar') shAvatar!: ElementRef;
  @Input() shSrc?: string;
  @Input() shClass?: string;
  @Input() shIcon?: string;
  @Input() shText?: string;
  @Input() shAnimated: true | false = true;
  @Input() shShape: 'circle' | 'square' = 'circle';
  @Input() shSize?: 'large' | 'small' | number;
  @Input() shOnload?: () => void;

  avatarClass = '';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.shAvatar.nativeElement.classList.remove('avatar-loaded');
    this.avatarClass = `${this.shClass ? this.shClass : ''} sh-avatar-${this.shShape}`;

    if (this.shSize === 'large') {
      this.avatarClass += ' sh-avatar-large';
    } else if (this.shSize === 'small') {
      this.avatarClass += ' sh-avatar-small';
    }

    if (this.shAnimated) {
      this.avatarClass += ' avatar-animated';
    }
  }

  handleLoad(): void {
    if (this.shOnload) {
      this.shOnload();
    }
    this.shAvatar.nativeElement.classList.add('avatar-loaded');
  }

  isNumeric(value: any): value is number {
    return !isNaN(value) && typeof value === 'number';
  }
}
