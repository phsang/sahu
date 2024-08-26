import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShSelectComponent } from './sh-select.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ShSelectComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [ShSelectComponent],
})
export class ShSelectModule { }
