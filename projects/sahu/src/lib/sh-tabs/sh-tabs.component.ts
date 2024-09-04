import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { ShTabComponent } from './sh-tab.component';

@Component({
  selector: 'sh-tabs',
  templateUrl: './sh-tabs.component.html',
  styleUrls: ['./sh-tabs.component.scss'],
})
export class ShTabsComponent implements AfterContentInit {
  @ContentChildren(ShTabComponent) tabs!: QueryList<ShTabComponent>;

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter(tab => tab.isActive);
    if (activeTabs.length === 0) {
      this.selectTab(0);
    }
  }

  selectTab(index: number) {
    this.tabs.toArray().forEach((tab, i) => {
      tab.isActive = i === index;
    });
  }
}
