import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShButtonModule } from '../sh-button';
import { ShSelectComponent } from './sh-select.component';

@NgModule({
  declarations: [ShSelectComponent],
  imports: [
    FormsModule,
    CommonModule,
    ShButtonModule,
  ],
  exports: [ShSelectComponent],
})
export class ShSelectModule { }
