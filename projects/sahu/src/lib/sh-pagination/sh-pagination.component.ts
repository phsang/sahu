import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sh-pagination',
  templateUrl: './sh-pagination.component.html',
  styles: [`
    .pagination-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    button:disabled {
      opacity: 0.5;
    }
  `]
})
export class ShPaginationComponent {
  @Input() shTotal = 0;
  @Input() shPage = 1;
  @Input() shPageSize = 10;
  @Input() shShowSizeChanger = false;
  @Input() pageSizeOptions = [10, 20, 30, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  pages: number[] = [];

  constructor() {
    if (this.totalPages <= 5) {
      this.pages.push(...Array.from({ length: this.totalPages }, (_, i) => i + 1));
    } else {
      if (this.shPage - 2 > 0 && this.shPage + 2 <= this.totalPages) {
        this.pages.push(this.shPage - 2, this.shPage - 1, this.shPage, this.shPage + 1, this.shPage + 2);
      }
    }

    console.log(this.pages);
  }

  get totalPages() {
    return Math.ceil(this.shTotal / this.shPageSize);
  }

  prevPage() {
    if (this.shPage > 1) {
      this.shPage--;
      this.pageChange.emit(this.shPage);
    }
  }

  nextPage() {
    if (this.shPage < this.totalPages) {
      this.shPage++;
      this.pageChange.emit(this.shPage);
    }
  }

  onSizeChange() {
    this.shPage = 1;
    this.pageSizeChange.emit(this.shPageSize);
    this.pageChange.emit(this.shPage);
  }

  pageIndexChange(page: number) {
    this.shPage = page;
    this.pageChange.emit(this.shPage);
  }
}
