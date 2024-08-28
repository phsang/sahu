import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import * as fs from 'fs';

@Component({
  selector: 'sh-icon',
  templateUrl: './sh-icon.component.html',
  styleUrls: ['./sh-icon.component.scss']
})
export class ShIconComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('shIcon') shIcon!: ElementRef;
  @Input() shType?: string = '';
  @Input() shTheme: 'light' | 'regular' | 'solid' | 'duotone' = 'light'
  @Input() shColor?: string;
  @Input() shRotate?: number;
  @Input() shSpin?: boolean = false;
  iconList: any = '../../assets/icons.json';
  iconValue: string = '';

  iconClass = '';

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const jsonData = fs.readFileSync(this.iconList, 'utf-8');
    const dataList = JSON.parse(jsonData);
    if (this.shType) {
      this.iconValue = dataList[this.shType][this.shTheme];
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
