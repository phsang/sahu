import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ExcelService } from '../../services/excel.service';
import { slideDown, slideUp } from '../../utils/mf.animation';
import { formatNumber } from '../../utils/mf.app';

interface validInterface {
  control: HTMLInputElement | HTMLTextAreaElement,
  status: boolean,
  message: string
}

@Component({
  selector: 'sh-form',
  templateUrl: './sh-form.component.html',
  styleUrls: ['./sh-form.component.scss']
})
export class ShFormComponent implements AfterViewInit, OnDestroy {
  @ViewChild('shForm', { static: true }) shForm!: ElementRef;
  @Input() shId: string = '';
  @Output() shSubmit = new EventEmitter<Event>();
  private observer!: MutationObserver;

  constructor(
    private cdr: ChangeDetectorRef,
    private excelService: ExcelService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    if (isPlatformBrowser(this.platformId)) {
      this.init(this.shForm.nativeElement);

      // Khởi tạo MutationObserver
      this.observer = new MutationObserver(() => {
        this.init(this.shForm.nativeElement);
      });

      // Theo dõi thêm/xóa phần tử con và thay đổi attribute
      this.observer.observe(this.shForm.nativeElement, {
        childList: true,    // Theo dõi thêm/xóa phần tử con
        subtree: true,      // Theo dõi các phần tử con cấp sâu hơn
        attributes: true,   // Theo dõi sự thay đổi attribute
        attributeFilter: ['data-vali'], // (Tùy chọn) Chỉ theo dõi các attribute cụ thể
      });
    }
  }

  async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (await this.detectAll(this.shForm.nativeElement)) {
      this.shSubmit.emit(event);
    }
  }

  ngOnDestroy(): void {
    // Hủy MutationObserver khi component bị destroy
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  validItem: validInterface = {
    control: {} as HTMLInputElement | HTMLTextAreaElement,
    status: true,
    message: '',
  }

  // ~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~
  generateError(): void {
    // Tạm dừng MutationObserver
    this.observer?.disconnect();

    let msg = this.validItem.message || 'Vui lòng điền vào trường này';

    const parent = this.validItem.control.closest('.field-validation');
    const msgError = parent?.querySelector('.msg_error') as HTMLElement;
    msg = '<svg fill="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M270.2 160h35.5c3.4 0 6.1 2.8 6 6.2l-7.5 196c-.1 3.2-2.8 5.8-6 5.8h-20.5c-3.2 0-5.9-2.5-6-5.8l-7.5-196c-.1-3.4 2.6-6.2 6-6.2zM288 388c-15.5 0-28 12.5-28 28s12.5 28 28 28 28-12.5 28-28-12.5-28-28-28zm281.5 52L329.6 24c-18.4-32-64.7-32-83.2 0L6.5 440c-18.4 31.9 4.6 72 41.6 72H528c36.8 0 60-40 41.5-72zM528 480H48c-12.3 0-20-13.3-13.9-24l240-416c6.1-10.6 21.6-10.7 27.7 0l240 416c6.2 10.6-1.5 24-13.8 24z"/></svg>' + msg;

    if (this.validItem.status) {
      parent?.classList.remove('field_error');
      if (msgError) {
        slideUp(msgError, 200, () => {
          msgError.remove();
        });
      }
    } else {
      parent?.classList.add('field_error');
      if (msgError) {
        msgError.innerHTML = msg;
      } else {
        const errorSpan = document.createElement('span');
        errorSpan.className = 'msg_error';
        errorSpan.innerHTML = msg;
        parent?.appendChild(errorSpan);
        slideDown(errorSpan, 200);
      }
    }

    // Khởi động lại MutationObserver
    this.observer?.observe(this.shForm.nativeElement, {
      childList: true,
      subtree: true,
    });
  }

  private setValidationStatus(status: boolean, message: string = ''): boolean {
    this.validItem.status = status;
    this.validItem.message = status ? '' : message;
    return status;
  }

  lengthValidation(rule: any): boolean {
    const input = this.validItem.control;
    const val = (input.value || '').trim();
    const { min: dataMin, max: dataMax } = rule;

    if (dataMin && val.length < dataMin) {
      return this.setValidationStatus(false, `Giá trị có độ dài không được nhỏ hơn ${formatNumber(dataMin)}`);
    }

    if (dataMax && val.length > dataMax) {
      return this.setValidationStatus(false, `Giá trị có độ dài không được lớn hơn ${formatNumber(dataMax)}`);
    }

    return this.setValidationStatus(true);
  }

  nullValidation(): boolean {
    const input = this.validItem.control;
    const type = input.getAttribute('type');

    if (type === 'file') {
      return this.setValidationStatus(!!input.value, 'Vui lòng chọn file');
    }

    if (type === 'radio') {
      const parent = input.closest('.field-validation');

      if (parent) {
        const radioNodes = parent.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        const msg = parent.getAttribute('data-msg') || 'Vui lòng chọn trường này';

        return this.setValidationStatus(Array.from(radioNodes).some(radio => radio.checked), msg);
      }
    }

    if (input.tagName.toUpperCase() === 'INPUT' || input.tagName.toUpperCase() === 'TEXTAREA') {
      const val = input.value?.trim() || '';

      if (val) {
        input.value = val; // Loại bỏ khoảng trắng đầu & cuối
        return this.setValidationStatus(true);
      }
    }

    return this.setValidationStatus(false, 'Vui lòng điền vào trường này');
  }

  async excelValid(rule: any, file: File): Promise<any> {
    // đọc file excel và kiểm tra tính hợp lệ
    let jsonData = await this.excelService.readFileExcelToJson(file);
    let additional = jsonData[0].join(':');

    if (additional !== rule.additional) {
      return {
        msg: 'File vừa tải lên không đúng định dạng',
        status: false
      }
    }

    if (jsonData.length <= 1) {
      return {
        msg: 'Vui lòng không Upload file rỗng',
        status: false
      }
    }

    if (jsonData.length > (rule.entries + 1)) {
      return {
        msg: `Kích thước danh sách không vượt quá ${formatNumber(rule.entries)}`,
        status: false
      }
    }

    return {
      status: true
    };
  }

  async fileValidation(rule: any): Promise<boolean> {
    let { type: allowedTypes, maxSize } = { type: rule.typex, maxSize: rule.size };
    let isValid: any = true;
    const errors: string[] = [];
    let file: any = (this.validItem.control as HTMLInputElement).files;

    if (!file || file.length === 0) {
      this.validItem.status = true;
      return true;
    }
    file = file[0];

    // Kiểm tra loại file
    if (allowedTypes) {
      const allowedTypesArray = allowedTypes.split(':').map((type: string) => type.trim().toLowerCase());
      const fileType = file.name.split('.').pop()?.toLowerCase() || '';

      if (!allowedTypesArray.includes(fileType)) {
        isValid = false;
        errors.push(`Chỉ chấp nhận file có định dạng: ${allowedTypesArray.join(', ')}.`);
      }

      // kiểm tra nếu chỉ có duy nhất 1 file excel
      if (fileType === 'xlsx' && allowedTypesArray.includes('xlsx')) {
        let xlsxStatus = await this.excelValid(rule, file);
        isValid = xlsxStatus.status;
        errors.push(xlsxStatus.msg);
      }
    }

    // Kiểm tra kích thước file
    if (maxSize) {
      maxSize = parseInt(maxSize);
      const maxSizeInBytes = maxSize * 1024; // Giả định maxSize là KB
      if (file.size > maxSizeInBytes) {
        isValid = false;
        let size = maxSize >= 1024 ? (Math.round((maxSize / 1024) * 100) / 100 + 'MB') : maxSize + 'KB';
        errors.push(`Kích thước của tệp không thể vượt quá ${size}.`);
      }
    }

    if (isValid) {
      this.validItem.status = true;
      return true;
    } else {
      this.validItem.status = false;
      this.validItem.message = errors.join('<br>');
      this.validItem.control.value = '';
      (this.validItem.control as HTMLInputElement).files = null;
      return false;
    }
  }

  urlValidation(): boolean {
    let input = this.validItem.control;
    let val: string | null = input.value || null;

    if (val?.trim()) {
      input.value = val.trimStart();

      const isValidUrl = (urlString: string) => {
        try {
          new URL(urlString);
          return true;
        } catch (_) {
          return false;
        }
      }

      if (isValidUrl(val)) {
        this.validItem.status = true;
        return true;
      } else {
        this.validItem.status = false;
        this.validItem.message = 'Đường dẫn không phải là một URL hợp lệ';
        return false;
      }
    }

    this.validItem.status = true;
    return true;
  }

  otpValidation(): boolean {
    let input = this.validItem.control;
    let val: string | null = input.value.trim() || null;

    if (val) {
      val = val.trimStart().replace(/\D/g, '');

      if (val.length !== 4) {
        this.validItem.status = false;
        this.validItem.message = 'Mã OTP bao gồm 4 chữ số';
        return false;
      }

      this.validItem.status = true;
      this.validItem.message = '';
      return true;
    } else {
      this.validItem.status = false;
      this.validItem.message = 'Vui lòng nhập mã OTP';
      return false;
    }
  }

  intValidation(rule: any): boolean {
    let input = this.validItem.control;
    let val: string | null = input.value.trim() || null;

    if (val) {
      val = val.trimStart().replace(/\D/g, '');
      input.value = formatNumber(val);
      let dataMin = rule.min;
      let dataMax = rule.max;

      if (dataMin) {
        if (parseInt(dataMin) > parseInt(val)) {
          this.validItem.status = false;
          this.validItem.message = `Giá trị không được nhỏ hơn ${formatNumber(dataMin)}`;
          return false;
        }
      }
      if (dataMax) {
        if (parseInt(dataMax) < parseInt(val)) {
          this.validItem.status = false;
          this.validItem.message = `Giá trị không được lớn hơn ${formatNumber(dataMax)}`;
          return false;
        }
      }

      this.validItem.status = true;
      return true;
    }

    this.validItem.status = true;
    return true;
  }

  // kiểu number sử dụng như kiểu int, nhưng không format lại giá trị
  numberValidation(rule: any): boolean {
    let input = this.validItem.control;
    let val: string | null = input.value.trim() || null;

    if (val) {
      val = val.trimStart().replace(/\D/g, '');
      input.value = val;
      let dataMin = rule.min;
      let dataMax = rule.max;

      if (dataMin) {
        if (parseInt(dataMin) > parseInt(val)) {
          this.validItem.status = false;
          this.validItem.message = `Giá trị không được nhỏ hơn ${formatNumber(dataMin)}`;
          return false;
        }
      }
      if (dataMax) {
        if (parseInt(dataMax) < parseInt(val)) {
          this.validItem.status = false;
          this.validItem.message = `Giá trị không được lớn hơn ${formatNumber(dataMax)}`;
          return false;
        }
      }

      this.validItem.status = true;
      return true;
    }

    this.validItem.status = true;
    return true;
  }

  phoneValidation(): boolean {
    let input = this.validItem.control;
    const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    let val: string | null = input.value.trim() || null;

    if (val) {
      val = val.replace(/\./g, '');

      if (val != '') {
        if (val.length !== 10) {
          this.validItem.status = false;
          this.validItem.message = 'Số điện thoại phải 10 số';
          return false;
        }

        let vnf = vnf_regex.test(val);

        if (!vnf) {
          this.validItem.status = false;
          this.validItem.message = 'Số điện thoại không đúng định dạng';
          return false;
        } else {
          this.validItem.status = true;
          return true;
        }
      }
    }

    this.validItem.status = true;
    return true;
  }

  emailValidation(): boolean {
    let input = this.validItem.control;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    // Lấy giá trị và trim để giảm thao tác lặp lại
    const value = input.value?.trim() || null;
    if (value) {
      // Kiểm tra email hợp lệ
      const isEmailValid = emailRegex.test(value);
      if (!isEmailValid) {
        this.validItem.status = false;
        this.validItem.message = 'Email không hợp lệ';
        return false;
      }
    }

    // Mặc định không có lỗi
    this.validItem.status = true;
    return true;
  }

  identityValidation(): boolean {
    let input = this.validItem.control;
    let val: string | null = input.value.trim() || null;

    if (val) {
      val = val.trimStart().replace(/\D/g, '');
      input.value = val;

      if (val != '' && val.length != 12) {
        return this.setValidationStatus(false, 'Số CCCD phải là 12 số');
      }

      return this.setValidationStatus(true);
    }

    return this.setValidationStatus(true);
  }

  parseDataVali(dataVali: string): any {
    // Loại bỏ ký tự bao quanh nếu có (dấu ngoặc vuông [])
    const trimmedData = dataVali.trim().replace(/^\[|\]$/g, '');

    // Tạo một regex để nhận diện từng phần tử
    const regex = /(\w+\([^\)]+\)|\w+)/g;
    const matches = trimmedData.match(regex);

    if (!matches) return []; // Trả về mảng rỗng nếu không có match

    return matches.map(item => {
      if (item.includes('file')) {
        const fileRegex = /file\(([^,]+),\s*([^,]+)(?:,\s*([^,]+)(?:,\s*(.+))?)?\)/;
        const match = fileRegex.exec(item);

        if (match) {
          return {
            type: 'file',
            typex: match[1],
            size: match[2],
            additional: match[3] ? match[3] : null,
            entries: match[4] ? parseInt(match[4]) : null
          };
        }
      }
      if (item.includes('length')) {
        const match = /length\(([^,]*?),\s*(.*?)\)/.exec(item);
        if (match) {
          return {
            type: 'length',
            min: match[1] === '*' ? null : +match[1],
            max: match[2] === '*' ? null : +match[2]
          };
        }
      }
      if (item.includes('int')) {
        const match = /int\(([^,]*?),\s*(.*?)\)/.exec(item);
        if (match) {
          return {
            type: 'int',
            min: match[1] === '*' ? null : +match[1],
            max: match[2] === '*' ? null : +match[2]
          };
        }
      }
      return { type: item }; // Trả về phần tử thông thường
    });
  }

  async detectAll(form: HTMLFormElement): Promise<boolean> {
    const inputs = form.querySelectorAll('input, textarea');
    let validAll = true;

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];

      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
        this.validItem.control = input;
        let dataVali = input.getAttribute('data-vali')?.trim()?.replace(/\s+/g, '') || null;
        let isValid = true;
        if (dataVali) {
          let valiArr = this.parseDataVali(dataVali);

          for (let i = 0; i < valiArr.length; i++) {
            switch (valiArr[i].type) {
              case 'null': {
                isValid = this.nullValidation();
                break;
              }
              case 'email': {
                isValid = this.emailValidation();
                break;
              }
              case 'phone': {
                isValid = this.phoneValidation();
                break;
              }
              case 'identity': {
                isValid = this.identityValidation();
                break;
              }
              case 'url': {
                isValid = this.urlValidation();
                break;
              }
              case 'otp': {
                isValid = this.otpValidation();
                break;
              }
              case 'int': {
                isValid = this.intValidation(valiArr[i]);
                break;
              }
              case 'number': {
                isValid = this.numberValidation(valiArr[i]);
                break;
              }
              case 'length': {
                isValid = this.lengthValidation(valiArr[i]);
                break;
              }
              case 'file': {
                isValid = await this.fileValidation(valiArr[i]);
                break;
              }
            }

            if (!isValid) {
              console.warn('valid', input.getAttribute('name') || input.getAttribute('id'));

              validAll = false;
              break;
            }
          }

          this.generateError();
        }
      }
    }

    if (!validAll) {
      form.querySelector('*[type="submit"]')?.classList.add('btn-disabled');
    } else {
      form.querySelector('*[type="submit"]')?.classList.remove('btn-disabled');
    }

    return validAll;
  }

  private destroy$ = new Subject<void>();

  init(form: HTMLFormElement): void {
    // Hủy tất cả các sự kiện trước đó
    this.destroy$.next();

    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
        merge(
          fromEvent(input, 'input'),
          fromEvent(input, 'change')
        ).pipe(
          takeUntil(this.destroy$), // Dừng subscription khi destroy$ phát ra giá trị
          debounceTime(100)
        ).subscribe(async () => {
          this.validItem.control = input;

          // Xử lý logic của bạn ở đây
          let dataVali = input.getAttribute('data-vali')?.trim()?.replace(/\s+/g, '') || null;
          let isValid = true;
          if (dataVali) {
            let valiArr = this.parseDataVali(dataVali);

            for (let i = 0; i < valiArr.length; i++) {
              switch (valiArr[i].type) {
                case 'null': {
                  isValid = this.nullValidation();
                  break;
                }
                case 'email': {
                  isValid = this.emailValidation();
                  break;
                }
                case 'phone': {
                  isValid = this.phoneValidation();
                  break;
                }
                case 'identity': {
                  isValid = this.identityValidation();
                  break;
                }
                case 'url': {
                  isValid = this.urlValidation();
                  break;
                }
                case 'otp': {
                  isValid = this.otpValidation();
                  break;
                }
                case 'int': {
                  isValid = this.intValidation(valiArr[i]);
                  break;
                }
                case 'number': {
                  isValid = this.numberValidation(valiArr[i]);
                  break;
                }
                case 'length': {
                  isValid = this.lengthValidation(valiArr[i]);
                  break;
                }
                case 'file': {
                  isValid = await this.fileValidation(valiArr[i]);
                  break;
                }
              }

              if (!isValid) {
                break;
              }
            }

            this.generateError();
            if (!isValid) {
              form.querySelector('*[type="submit"]')?.classList.add('btn-disabled');
            } else {
              form.querySelector('*[type="submit"]')?.classList.remove('btn-disabled');
            }
          }
        });
      }
    });
  }

  // Gọi hàm này khi component bị hủy hoặc trước khi init lại
  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
