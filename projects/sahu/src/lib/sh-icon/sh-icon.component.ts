import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { getIconList } from '../../utils/icon-list';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'sh-icon',
  templateUrl: './sh-icon.component.html',
  styleUrls: ['./sh-icon.component.scss']
})
export class ShIconComponent implements OnInit, AfterViewInit {
  @Input() shIcon: string = '';
  @Input() shColor?: string;
  @Input() shRotate?: number;
  @Input() shSpin?: boolean = false;
  iconValue: SafeHtml = '';
  iconClass: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    if (this.shSpin) {
      this.iconClass = 'sh-icon-spin';
    }

    if (this.shIcon) {
      // 'light' | 'regular' | 'solid' | 'duotone' = 'light';
      let strIcon = this.shIcon.replace(/\s+/g, '').split(':');
      let theme = strIcon[1] || 'light';
      let icon = getIconList(strIcon[0], theme);
      let attributes = `fill="currentColor" height="1em" width="1em"`;

      if (icon) {
        icon = icon.replace('<svg', `<svg ${attributes}`);
        this.iconValue = this.sanitizer.bypassSecurityTrustHtml(icon.trim());
      }
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

}
