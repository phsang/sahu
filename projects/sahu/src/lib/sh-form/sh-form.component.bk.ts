import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { slideDown, slideUp } from '../../utils/mf.animation';
import { formatNumber } from '../../utils/mf.app';
import { fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'sh-form',
  templateUrl: './sh-form.component.html',
  styleUrls: ['./sh-form.component.scss']
})
export class ShFormComponent implements AfterViewInit, OnDestroy {
  @ViewChild('shForm', { static: true }) shForm!: ElementRef;
  @Input() shClass?: string;
  @Output() shSubmit = new EventEmitter<Event>();
  private observer!: MutationObserver;

  constructor(
    private cdr: ChangeDetectorRef,
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

      // Theo dõi thêm/xóa phần tử con
      this.observer.observe(this.shForm.nativeElement, {
        childList: true,  // Theo dõi thêm/xóa phần tử con
        subtree: true,    // Theo dõi các phần tử con cấp sâu hơn
      });
    }
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    if (this.detectAll(this.shForm.nativeElement)) {
      this.shSubmit.emit(event);
    }
  }

  ngOnDestroy(): void {
    // Hủy MutationObserver khi component bị destroy
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // ~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~
  generateError(element: HTMLElement, status: boolean = true, msg: string = 'Vui lòng điền vào trường này!'): void {
    // Tạm dừng MutationObserver
    this.observer?.disconnect();

    const parent = element.closest('.field-validation');
    const msgError = parent?.querySelector('.msg_error') as HTMLElement;
    msg = '<i class="fal fa-exclamation-triangle"></i>' + msg;

    if (status) {
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

  lengthValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, _dataLength: string, _val: string): boolean {
    let [_dataMin, _dataMax] = _dataLength.split(',');
    _dataMin = _dataMin.trim();
    _dataMax = _dataMax.trim();

    if (_dataMin != '*' && _dataMax != '*') {
      if (
        parseInt(_dataMin) > _val.length ||
        parseInt(_dataMax) < _val.length
      ) {
        this.generateError(input, false, `Giá trị có độ dài không được nhỏ hơn ${formatNumber(_dataMin)} và lớn hơn ${formatNumber(_dataMax)}`);
        return false;
      }
    }
    if (_dataMin != '*') {
      if (parseInt(_dataMin) > _val.length) {
        this.generateError(input, false, `Giá trị có độ dài không được nhỏ hơn ${formatNumber(_dataMin)}`);
        return false;
      }
    }
    if (_dataMax != '*') {
      if (parseInt(_dataMax) < _val.length) {
        this.generateError(input, false, `Giá trị có độ dài không được lớn hơn ${formatNumber(_dataMax)}`);
        return false;
      }
    }

    this.generateError(input, true);
    return true;
  }

  validValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    let _val: string | null = input.value || null;
    let _dataLength = input.getAttribute('data-length')?.trim() || null;

    if (_val) {
      if (_dataLength) {
        return this.lengthValidation(input, _dataLength, _val);
      }
    }

    this.generateError(input, true);
    return true;
  }

  nullValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    let _type = input.getAttribute('type');

    if (_type === 'file') {
      if (!input.value || input.value === '') {
        this.generateError(input, false, 'Vui lòng chọn file');
        return false;
      }
      this.generateError(input, true);
      return true;
    }

    if (
      (input.tagName.toUpperCase() === 'INPUT' && _type === 'text') ||
      input.tagName.toUpperCase() === 'TEXTAREA'
    ) {
      let _val: string | null = input.value || null;
      let _dataLength = input.getAttribute('data-length')?.trim() || null;
      if (_val) {
        _val = _val.trimStart();
        input.value = _val;

        if (_dataLength) {
          return this.lengthValidation(input, _dataLength, _val);
        }

        this.generateError(input, true);
        return true;
      }
    }

    this.generateError(input, false);
    return false;
  }

  otpValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    let _val: string | null = input.value.trim() || null;

    if (!_val) {
      this.generateError(input, false, 'Không bỏ trống giá trị OTP');
      return false;
    } else {
      _val = _val.replace(/\D/g, '');
      input.value = _val;

      if (_val.length !== 4) {
        this.generateError(input, false, 'Mã OTP bao gồm 4 chữ số');
        return false;
      }
    }

    this.generateError(input, true);
    return true;
  }

  urlValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    let _val: string | null = input.value || null;
    let _dataLength = input.getAttribute('data-length')?.trim() || null;

    if (_val?.trim()) {
      input.value = _val.trimStart();

      const isValidUrl = (urlString: string) => {
        try {
          new URL(urlString);
          return true;
        } catch (_) {
          return false;
        }
      }

      if (isValidUrl(_val)) {
        if (_dataLength) {
          return this.lengthValidation(input, _dataLength, _val);
        }

        this.generateError(input, true);
        return true;
      } else {
        if (_dataLength) {
          const _dataMax = _dataLength.split(',')[1].trim();
          _val = _val.slice(0, parseInt(_dataMax));
          input.value = _val;
        }

        this.generateError(input, false, 'Đường dẫn không phải là một URL hợp lệ!');
        return false;
      }
    }
    this.generateError(input, true);
    return true;
  }

  nullUrlValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    let _val: string | null = input.value?.trim() || null;
    let _dataLength = input.getAttribute('data-length')?.trim() || null;

    if (_val) {
      input.value = _val;

      const isValidUrl = (urlString: string) => {
        try {
          new URL(urlString);
          return true;
        } catch (_) {
          return false;
        }
      }

      if (isValidUrl(_val)) {
        if (_dataLength) {
          return this.lengthValidation(input, _dataLength, _val);
        }

        this.generateError(input, true);
        return true;
      } else {
        if (_dataLength) {
          const _dataMax = _dataLength.split(',')[1].trim();
          _val = _val.slice(0, parseInt(_dataMax));
          input.value = _val;
        }

        this.generateError(input, false, 'Đường dẫn không phải là một URL hợp lệ!');
        return false;
      }
    } else {
      input.value = '';
    }

    this.generateError(input, false);
    return false;
  }

  nullIntValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    let _val: string | null = input.value || null;

    if (_val) {
      _val = _val.trimStart().replace(/\D/g, '');
      input.value = formatNumber(_val);
      let _dataMin = input.getAttribute('data-min')?.trim() || null;
      let _dataMax = input.getAttribute('data-max')?.trim() || null;

      if (_dataMin) {
        if (parseInt(_dataMin) > parseInt(_val)) {
          this.generateError(input, false, `Giá trị không được nhỏ hơn ${formatNumber(_dataMin)}`);
          return false;
        }
      }
      if (_dataMax) {
        if (parseInt(_dataMax) < parseInt(_val)) {
          this.generateError(input, false, `Giá trị không được lớn hơn ${formatNumber(_dataMax)}`);
          return false;
        }
      }

      this.generateError(input, true);
      return true;
    }
    this.generateError(input, false);
    return false;
  }

  nullPhoneValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    let _val: string | null = input.value.trim() || null;

    if (_val) {
      _val = _val.replace(/\D|\.|\s+/g, '');
      if (_val.length > 10) {
        _val = _val.substring(0, 10);
      }

      // format số điện thoại
      if (_val.length > 4 && _val.length < 8) {
        _val = _val.substring(0, 4) + '.' + _val.substring(4);
      } else if (_val.length >= 8) {
        _val = _val.substring(0, 4) + '.' + _val.substring(4, 7) + '.' + _val.substring(7);
      }
      input.value = _val;

      _val = _val.replace(/\./g, '');
      if (_val.length !== 10) {
        this.generateError(input, false, 'Số điện thoại phải 10 số');
        return false;
      }

      let vnf = vnf_regex.test(_val);
      this.generateError(input, vnf, vnf ? '' : 'Số điện thoại không đúng định dạng!');

      return vnf;
    }

    this.generateError(input, false, 'Không bỏ trống số điện thoại');
    return false;
  }

  nullEmailValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    // Lấy giá trị và trim để giảm thao tác lặp lại
    const value = input.value?.trim() || null;
    if (!value) {
      this.generateError(input, false, 'Vui lòng điền vào trường này');
      return false;
    }

    // Kiểm tra email hợp lệ
    const isEmailValid = emailRegex.test(value);
    if (!isEmailValid) {
      this.generateError(input, false, 'Email không hợp lệ');
      return false;
    }

    // Kiểm tra độ dài (nếu có thuộc tính data-length)
    const dataLength = input.getAttribute('data-length')?.trim();
    if (dataLength) {
      return this.lengthValidation(input, dataLength, value);
    }

    // Mặc định không có lỗi
    this.generateError(input, true);
    return true;
  }

  validateWith3Rules(input: HTMLElement, rules: Array<string>): boolean {
    switch (true) {
    }
    return true;
  }

  validateWith2Rules(input: HTMLElement, rules: Array<string>): boolean {
    const validations: { [key: string]: (input: HTMLInputElement) => boolean } = {
      'null:email': this.nullEmailValidation.bind(this),
      'null:phone': this.nullPhoneValidation.bind(this),
      'null:url': this.nullUrlValidation.bind(this),
      'null:int': this.nullIntValidation.bind(this),
    };

    // Kết hợp các key từ rules để tìm hàm phù hợp
    const ruleKey = Object.keys(validations).find(key =>
      key.split(':').every(r => rules.includes(r))
    );

    if (ruleKey) {
      return validations[ruleKey](input as HTMLInputElement);
    }

    return true;
  }

  validateWith1Rules(input: HTMLElement, rules: Array<string>): boolean {
    switch (true) {
      case (rules.includes('valid')): {
        return this.validValidation(input as HTMLInputElement);
        break;
      }
      case (rules.includes('null')): {
        return this.nullValidation(input as HTMLInputElement);
        break;
      }
      case (rules.includes('otp')): {
        return this.otpValidation(input as HTMLInputElement);
        break;
      }
      case (rules.includes('url')): {
        return this.urlValidation(input as HTMLInputElement);
        break;
      }
    }
    return true;
  }

  detectAll(form: HTMLFormElement): boolean {
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement) {
        let dataVali = input.getAttribute('data-vali')?.trim()?.replace(/\s+/g, '') || null;
        if (dataVali) {
          let dataValiArr = dataVali.split(',');

          // gọi các hàm validate
          switch (dataValiArr.length) {
            case 3: {
              isValid = this.validateWith3Rules(input, dataValiArr) && isValid;
              break;
            }
            case 2: {
              isValid = this.validateWith2Rules(input, dataValiArr) && isValid;
              break;
            }
            case 1: {
              isValid = this.validateWith1Rules(input, dataValiArr) && isValid;
              break;
            }
          }
        }
      }
    });

    if (!isValid) {
      form.querySelector('*[type="submit"]')?.classList.add('btn-disabled');
    } else {
      form.querySelector('*[type="submit"]')?.classList.remove('btn-disabled');
    }

    return isValid;
  }

  init(form: HTMLFormElement): void {
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {

        merge(
          fromEvent(input, 'input'),
          fromEvent(input, 'change')
        ).pipe(
          debounceTime(0)
        ).subscribe(() => {
          // Xử lý logic của bạn ở đây
          let dataVali = input.getAttribute('data-vali')?.trim()?.replace(/\s+/g, '') || null;
          let isValid = true;
          if (dataVali) {
            let dataValiArr = dataVali.split(',');

            // gọi các hàm validate
            switch (dataValiArr.length) {
              case 3: {
                isValid = this.validateWith3Rules(input, dataValiArr);
                break;
              }
              case 2: {
                isValid = this.validateWith2Rules(input, dataValiArr);
                break;
              }
              case 1: {
                isValid = this.validateWith1Rules(input, dataValiArr);
                break;
              }
            }
          }

          if (!isValid) {
            form.querySelector('*[type="submit"]')?.classList.add('btn-disabled');
          } else {
            form.querySelector('*[type="submit"]')?.classList.remove('btn-disabled');
          }
        });
      }
    });
  }
}
