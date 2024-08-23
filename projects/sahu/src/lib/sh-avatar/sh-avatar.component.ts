import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sh-avatar',
  templateUrl: './sh-avatar.component.html',
  styleUrls: ['./sh-avatar.component.scss']
})
export class ShAvatarComponent implements OnInit {
  @Input() shSrc?: string;
  @Input() shClass?: string;
  @Input() shIcon?: string;
  @Input() shText?: string;
  @Input() shShape: 'circle' | 'square' = 'circle';
  @Input() shSize?: 'large' | 'small' | number;
  @Input() mfOnload?: () => void;

  avatarClass = '';

  ngOnInit(): void {
    this.avatarClass = `${this.shClass ? this.shClass : ''} sh-avatar-${this.shShape}`;

    if (this.shSize === 'large') {
      this.avatarClass += ' sh-avatar-large';
    } else if (this.shSize === 'small') {
      this.avatarClass += ' sh-avatar-small';
    }
  }

  handleLoad(): void {
    if (this.mfOnload) {
      this.mfOnload();
    }
  }

  isNumeric(value: any): value is number {
    return !isNaN(value) && typeof value === 'number';
  }
}
