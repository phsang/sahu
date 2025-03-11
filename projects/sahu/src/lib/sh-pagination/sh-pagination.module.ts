import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShPaginationComponent } from './sh-pagination.component';
import { RouterModule } from '@angular/router';
import { ShIconModule } from '../sh-icon/sh-icon.module';
import { FormsModule } from '@angular/forms';
import { ShSelectModule } from '../sh-select';
import { ShButtonModule } from '../sh-button';

@NgModule({
  declarations: [ShPaginationComponent],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    ShIconModule,
    ShButtonModule,
    ShSelectModule,
  ],
  exports: [ShPaginationComponent],
})
export class ShPaginationModule { }
