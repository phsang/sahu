import { Component, Input, OnInit } from '@angular/core';
import { getIconList } from '../utils/icon-list';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'sh-tab',
  template: `<div *ngIf="isActive"><ng-content></ng-content></div>`,
})
export class ShTabComponent implements OnInit {
  @Input() shTitle!: string;
  @Input() shIcon?: string;
  @Input() shIconType: 'light' | 'regular' | 'solid' | 'duotone' = 'light';
  isActive = false;
  icon: SafeHtml = '';

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    if (this.shIcon) {
      let _icon = getIconList(this.shIcon, this.shIconType);
      if (_icon) {
        this.icon = this.sanitizer.bypassSecurityTrustHtml(_icon);
      }
    }
  }
}
