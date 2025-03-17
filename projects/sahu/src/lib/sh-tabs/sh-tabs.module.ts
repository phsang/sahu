import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShTabComponent } from './sh-tab.component';
import { ShTabsetComponent } from './sh-tabset.component';

@NgModule({
  declarations: [ShTabsetComponent, ShTabComponent],
  imports: [CommonModule],
  exports: [ShTabsetComponent, ShTabComponent],
})
export class ShTabsModule {
}
