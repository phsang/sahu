import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShSelectComponent } from './sh-select.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ShSelectComponent],
  imports: [CommonModule, FormsModule],
  exports: [ShSelectComponent],
})
export class ShSelectModule { }
