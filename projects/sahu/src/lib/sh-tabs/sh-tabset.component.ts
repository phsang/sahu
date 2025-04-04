import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import { ShTabComponent } from './sh-tab.component';

@Component({
  selector: 'sh-tabset',
  template: `
  <div class="tab-wrapper" [ngClass]="['tab-' + shPosition, 'tab-' + shType]">
    <div class="tab-header-container">
      <div *ngFor="let tab of tabs; let i = index" 
           class="tab-header"
           [class.active]="i === activeTabIndex"
           [class.disabled]="tab.shDisabled"
           (click)="selectTab(i)"
           #tabHeader>
           <span>
              <sh-icon [shIcon]="tab.iconLeft" *ngIf="tab.iconLeft"></sh-icon>
              {{ tab.shTitle }}
              <sh-icon [shIcon]="tab.iconRight" *ngIf="tab.iconRight"></sh-icon>
            </span>
      </div>
      <div class="tab-indicator" *ngIf="shType === 'line'"
        [style.left.px]="indicatorOptions.left"
        [style.width.px]="indicatorOptions.width"
        [style.top.px]="indicatorOptions.top"
        [style.height.px]="indicatorOptions.height">
      </div>
    </div>
    <div class="tab-content">
      <ng-container *ngTemplateOutlet="tabs.get(activeTabIndex)?.contentTemplate || null"></ng-container>
    </div>
  </div>
  `,
})
export class ShTabsetComponent implements AfterContentInit, OnChanges, OnInit, AfterViewInit {
  @ContentChildren(ShTabComponent) tabs!: QueryList<ShTabComponent>;
  @ViewChildren('tabHeader') tabHeaders!: QueryList<ElementRef>;

  @Input() shPosition: 'top' | 'right' | 'bottom' | 'left' = 'top';
  @Input() shType: 'line' | 'card' = 'line';
  @Input() shActiveTab: number = 0;
  @Output() shChangeTab = new EventEmitter<number>();

  activeTabIndex: number = 0;
  indicatorOptions: any = {
    left: null,
    width: null,
    top: null,
    height: null
  };

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('shActiveTab' in changes) {
      this.updateActiveTab(changes['shActiveTab'].currentValue);
    }
  }

  ngAfterContentInit(): void {
    this.updateActiveTab(this.shActiveTab);
  }

  ngAfterViewInit(): void {
    this.tabs.forEach((tab, index) => {
      const sanitizedIcon = tab.shIcon?.trim().replace(/\s+/g, '') || null;

      if (!sanitizedIcon) return;

      const [leftIcon, rightIcon] = this.iconArr(sanitizedIcon);
      if (leftIcon !== '*') tab.iconLeft = leftIcon;
      if (rightIcon && rightIcon !== '*') tab.iconRight = rightIcon;
    });
    setTimeout(() => {
      this.updateIndicator();
    });
    this.cdr.detectChanges();
  }

  private iconArr(iconRule: string): string[] {
    return iconRule.includes(',') ? iconRule.split(',') : [iconRule];
  }

  private updateIndicator(): void {
    if (!this.tabHeaders || this.shType !== 'line') return;

    const headers = this.tabHeaders.toArray();
    const activeHeader = headers[this.activeTabIndex]?.nativeElement;

    if (activeHeader) {
      if (this.shPosition === 'top' || this.shPosition === 'bottom') {
        this.indicatorOptions.width = activeHeader.offsetWidth;
        this.indicatorOptions.left = activeHeader.offsetLeft;
      }

      if (this.shPosition === 'left' || this.shPosition === 'right') {
        this.indicatorOptions.height = activeHeader.offsetHeight;
        this.indicatorOptions.top = activeHeader.offsetTop;
      }
    }
  }

  selectTab(index: number): void {
    if (this.isTabDisabled(index)) return;

    this.activeTabIndex = index;
    this.shChangeTab.emit(index);

    this.updateIndicator();
  }

  private updateActiveTab(newIndex: number): void {
    const validIndex = this.validateTabIndex(newIndex);

    if (validIndex !== this.activeTabIndex) {
      this.activeTabIndex = validIndex;
    }

    this.updateIndicator();
  }

  private validateTabIndex(index: number): number {
    if (!this.tabs) return 0;

    const tabs = this.tabs.toArray();

    if (!tabs.length || index < 0 || index >= tabs.length) return 0;
    if (tabs[index].shDisabled) {
      return tabs.findIndex(tab => !tab.shDisabled) || 0;
    }
    return index;
  }

  private isTabDisabled(index: number): boolean {
    const tab = this.tabs.toArray()[index];
    return !tab || tab.shDisabled;
  }
}