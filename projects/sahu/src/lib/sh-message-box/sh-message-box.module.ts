import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShMessageBoxComponent } from './sh-message-box.component';
import { ShMessageBoxService } from '../../services/sh-message-box.service'; // Thêm dòng này

@NgModule({
  declarations: [ShMessageBoxComponent],
  imports: [CommonModule],
  exports: [ShMessageBoxComponent],
  providers: [ShMessageBoxService] // Thêm dòng này
})
export class ShMessageBoxModule {}
