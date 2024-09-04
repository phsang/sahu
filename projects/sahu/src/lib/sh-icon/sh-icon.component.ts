import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { iconList } from './icon-list';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'sh-icon',
  templateUrl: './sh-icon.component.html',
  styleUrls: ['./sh-icon.component.scss']
})
export class ShIconComponent implements OnInit, AfterViewInit {
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
      this.renderer.addClass(this.shIcon.nativeElement, 'sh-icon-spin');
    }
    if (this.shClass) {
      this.renderer.addClass(this.shIcon.nativeElement, this.shClass);
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

}
