import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShPaginationComponent } from './sh-pagination.component';
import { RouterModule } from '@angular/router';
import { ShIconModule } from '../sh-icon/sh-icon.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ShPaginationComponent],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    ShIconModule,
  ],
  exports: [ShPaginationComponent],
})
export class ShPaginationModule { }
