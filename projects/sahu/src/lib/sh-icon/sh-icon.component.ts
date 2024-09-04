import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { getIconList } from '../utils/icon-list';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'sh-icon',
  templateUrl: './sh-icon.component.html',
  styleUrls: ['./sh-icon.component.scss']
})
export class ShIconComponent implements OnInit, AfterViewInit {
  @ViewChild('shIcon') shIcon!: ElementRef;
  @Input() shType: string = '';
  @Input() shTheme: 'light' | 'regular' | 'solid' | 'duotone' = 'light';
  @Input() shColor?: string;
  @Input() shFontSize: number = 14;
  @Input() shRotate?: number;
  @Input() shSpin?: boolean = false;
  @Input() shClass: string = '';
  iconList: any;
  iconValue: SafeHtml = '';
  iconClass: string = '';

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.iconList = getIconList();

    if (this.shSpin) {
      this.iconClass = 'sh-icon-spin';
    }
    if (this.shClass) {
      this.iconClass += ' ' + this.shClass;
    }

    if (this.shType) {
      let iconValue = this.iconList[this.shType][this.shTheme];
      let attributes = `fill="currentColor" height="1em" width="1em"`;
      iconValue = iconValue.replace('<svg', `<svg ${attributes}`);
      this.iconValue = this.sanitizer.bypassSecurityTrustHtml(iconValue.trim());
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

}
