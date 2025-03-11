import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
export class ShPaginationComponent implements OnInit {
  @Input() shTotal = 0;
  @Input() shPageIndex = 1;
  @Input() shPageSize = 10;
  @Input() shShowSizeChanger = false;
  @Input() pageSizeOptions = [10, 20, 30, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  pages: number[] = [];

  ngOnInit(): void {
    if (this.totalPages <= 5) {
      this.pages.push(...Array.from({ length: this.totalPages }, (_, i) => i + 1));
    } else {
      if (this.shPageIndex - 2 > 0 && this.shPageIndex + 2 <= this.totalPages) {
        this.pages.push(this.shPageIndex - 2, this.shPageIndex - 1, this.shPageIndex, this.shPageIndex + 1, this.shPageIndex + 2);
      }
    }

    console.log(this.pages);
  }

  get totalPages() {
    return Math.ceil(this.shTotal / this.shPageSize);
  }

  prevPage() {
    if (this.shPageIndex > 1) {
      this.shPageIndex--;
      this.pageChange.emit(this.shPageIndex);
    }
  }

  nextPage() {
    if (this.shPageIndex < this.totalPages) {
      this.shPageIndex++;
      this.pageChange.emit(this.shPageIndex);
    }
  }

  onSizeChange() {
    this.shPageIndex = 1;
    this.pageSizeChange.emit(this.shPageSize);
    this.pageChange.emit(this.shPageIndex);
  }

  pageIndexChange(page: number) {
    this.shPageIndex = page;
    this.pageChange.emit(this.shPageIndex);
  }
}
