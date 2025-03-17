import {
  Component, Input, Output, EventEmitter,
  ContentChildren, QueryList, AfterContentInit, OnChanges, SimpleChanges
} from '@angular/core';
import { ShTabComponent } from './sh-tab.component';

@Component({
  selector: 'sh-tabset',
  template: `
  <div class="tab-wrapper {{'tab-' + shTabPosition}}">
    <div class="tab-header-container">
      <div *ngFor="let tab of tabs; let i = index" 
           class="tab-header"
           [class.active]="i === activeTabIndex"
           [class.disabled]="tab.shDisabled"
           (click)="selectTab(i)">
           <span>{{ tab.shTitle }}</span>
      </div>
    </div>
    <div class="tab-content">
      <ng-container *ngTemplateOutlet="tabs.get(activeTabIndex)?.contentTemplate || null"></ng-container>
    </div>
  </div>
  `,
})
export class ShTabsetComponent implements AfterContentInit, OnChanges {
  @ContentChildren(ShTabComponent) tabs!: QueryList<ShTabComponent>;

  @Input() shTabPosition: 'top' | 'right' | 'bottom' | 'left' = 'top';
  @Input() shActiveTab: number = 0;
  @Output() shChangeTab = new EventEmitter<number>();

  activeTabIndex: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if ('shActiveTab' in changes) {
      this.updateActiveTab(changes['shActiveTab'].currentValue);
    }
  }

  ngAfterContentInit(): void {
    this.updateActiveTab(this.shActiveTab);
  }

  selectTab(index: number): void {
    if (this.isTabDisabled(index)) return;

    this.activeTabIndex = index;
    this.shChangeTab.emit(index);
  }

  private updateActiveTab(newIndex: number): void {
    const validIndex = this.validateTabIndex(newIndex);

    if (validIndex !== this.activeTabIndex) {
      this.activeTabIndex = validIndex;
    }
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