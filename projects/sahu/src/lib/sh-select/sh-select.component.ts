import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'sh-select',
  template: `<div class="sh-select" [class.open]="dropdownOpen">
              <div class="sh-select-overlay" (click)="closeDropdown()"></div>
              <div class="sh-select-selection" (click)="toggleDropdown()">
                <span *ngIf="!shMultiple && selectedValue">{{ selectedValue }}</span>
                <span *ngIf="shMultiple" class="tags">
                  <span *ngFor="let tag of selectedTags" class="tag">{{ tag }}<i class="remove-tag" (click)="removeTag(tag)">×</i></span>
                </span>
                <input *ngIf="shShowSearch" [(ngModel)]="searchQuery" (input)="onSearchChange()" [placeholder]="shPlaceHolder" />
                <span *ngIf="!shShowSearch">{{ shPlaceHolder }}</span>
                <i class="dropdown-icon"></i>
              </div>

              <div class="sh-select-dropdown" *ngIf="dropdownOpen">
                <ng-container *ngIf="_sData != {}">
                  <div class="option-group" *ngFor="let item of _sData | keyvalue">
                    <span>{{item.key}}</span>
                    <div class="option-group">
                      <div *ngFor="let option of item.value" class="sh-select-option" (click)="selectOption(option)">
                        <label for="sh-option-checked">
                          <input type="{{shMultiple ? 'checkbox' : 'radio'}}" value="{{ option.value }}">
                          <span class="text">{{ option.label }}</span>
                          <span class="remark"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </ng-container>
                <ng-container *ngIf="_sData == {}">
                  <div *ngFor="let item of shData" class="sh-select-option" (click)="selectOption(item)">
                    <label for="sh-option-checked">
                      <input type="{{shMultiple ? 'checkbox' : 'radio'}}" value="{{ item.value }}">
                      <span class="text">{{ item.label }}</span>
                      <span class="remark"></span>
                    </label>
                  </div>
                </ng-container>
              </div>
            </div>`,
  styleUrls: ['./sh-select.component.scss']
})
export class ShSelectComponent implements OnInit {
  @Input() shData: any[] = [];
  _sData: { [key: string]: any } = {};

  @Input() shPlaceHolder: string = 'Select';
  @Input() shMultiple: boolean = false;
  @Input() shShowSearch: boolean = false;
  @Input() shOptions: any[] = []; // To handle groups or simple options
  @Input() shApiCall!: (query: string) => Promise<any[]>;

  @Output() ngModelChange = new EventEmitter<any>();

  dropdownOpen = false;
  selectedValue: string | null = null;
  selectedTags: string[] = [];
  searchQuery: string = '';
  filteredOptions: any[] = [];
  loading: boolean = false;

  ngOnInit(): void {
    this.filteredOptions = this.shOptions;

    this.shData.map(data => {
      if (data.group) {
        if (this._sData[data.group]) {
          this._sData[data.group].push(data);
        } else {
          this._sData[data.group] = [data];
        }
      }
    });

    console.log(this.shData);
    console.log(this._sData);
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  onSearchChange(): void {
    if (this.shApiCall) {
      this.loading = true;
      this.shApiCall(this.searchQuery).then(options => {
        this.filteredOptions = options;
        this.loading = false;
      });
    } else {
      this.filterOptions();
    }
  }

  filterOptions(): void {
    this.filteredOptions = this.shOptions.filter(option => {
      const label = option.label.toLowerCase();
      return label.includes(this.searchQuery.toLowerCase());
    });
  }

  selectOption(option: any): void {
    if (this.shMultiple) {
      if (!this.selectedTags.includes(option.label)) {
        this.selectedTags.push(option.label);
        this.ngModelChange.emit(this.selectedTags);
      }
    } else {
      this.selectedValue = option.label;
      this.ngModelChange.emit(option.value);
      this.toggleDropdown();
    }
  }

  removeTag(tag: string): void {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
    this.ngModelChange.emit(this.selectedTags);
  }
}
