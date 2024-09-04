import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { iconList } from './icon-list';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'sh-icon',
  templateUrl: './sh-icon.component.html',
  styleUrls: ['./sh-icon.component.scss']
})
export class ShIconComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('shIcon') shIcon!: ElementRef;
  @Input() shType: string = '';
  @Input() shTheme: 'light' | 'regular' | 'solid' | 'duotone' = 'light'
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
    this.iconList = iconList();

    if (this.shSpin) {
      this.iconClass = 'sh-icon-spin';
    }
    if (this.shClass) {
      this.iconClass += ' ' + this.shClass;
    }

    if (this.shType) {
      let rawIconValue = this.iconList[this.shType][this.shTheme];
      let attributes = `fill="currentColor" height="1em" width="1em"`;
      rawIconValue = rawIconValue.replace('<svg', `<svg ${attributes}`);
      this.iconValue = this.sanitizer.bypassSecurityTrustHtml(rawIconValue.trim());
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shSrc'] || changes['shText']) {
      this.resetIconClass();
    }
  }

  private resetIconClass(): void {
    if (this.shIcon) {
      this.renderer.removeClass(this.shIcon.nativeElement, 'icon-loaded');
    }
  }

  isNumeric(value: any): value is number {
    return !isNaN(value) && typeof value === 'number';
  }
}
