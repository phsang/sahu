import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShInputComponent } from './sh-input.component';

@NgModule({
  declarations: [ShInputComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [ShInputComponent]
})
export class ShInputModule { }
