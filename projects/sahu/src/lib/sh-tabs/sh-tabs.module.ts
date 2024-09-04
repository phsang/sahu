import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShTabComponent } from './sh-tab.component';
import { ShTabsComponent } from './sh-tabs.component';

@NgModule({
  declarations: [ShTabsComponent, ShTabComponent],
  imports: [CommonModule],
  exports: [ShTabsComponent, ShTabComponent],
})
export class ShTabsModule { }
