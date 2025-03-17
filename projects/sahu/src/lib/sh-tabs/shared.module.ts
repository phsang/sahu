import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShTabComponent } from './sh-tab.component';
import { ShTabsetComponent } from './sh-tabset.component';

@NgModule({
  declarations: [ShTabComponent, ShTabsetComponent],
  imports: [CommonModule],
  exports: [ShTabComponent, ShTabsetComponent] // Xuất các component từ đây
})
export class SharedModule { }
