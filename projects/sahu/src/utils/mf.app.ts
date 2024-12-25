import { slideDown, slideUp } from './mf.animation';

function isBrowser(): boolean {
  return (typeof window !== 'undefined' && typeof document !== 'undefined');
}

export function formatNumber(number: string): string {
  if (!number || number === '' || isNaN(Number(number))) {
    return number;
  }
  return new Intl.NumberFormat('vi-VN').format(Number(number));
}

export function formatCurrency(_currency: number) {
  if (!_currency) {
    return _currency;
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(_currency);
}

export function formatPhone(_phone: string) {
  if (_phone.length != 10) {
    return _phone;
  }

  _phone = _phone.toString();
  return _phone.slice(0, 4) + '.' + _phone.slice(4, 7) + '.' + _phone.slice(-3);
};

export function modal() {
  let tglModal = document.getElementsByClassName('js-toggle_modal');
  for (let i = 0; i < tglModal.length; i++) {
    const element = tglModal[i];

    element.addEventListener('click', function (e) {
      if (e.target) {
        let target = (e.target as HTMLElement).getAttribute('data-target');
        document.querySelector(`.js-modal[data-modal="${target}"]`)?.classList.toggle('active');
      }
    });

    document.querySelector('body')?.addEventListener('click', function (e) {
      let target = e.target as HTMLElement;
      if (target.classList.contains('js-close_modal')) {
        (target.closest('.js-modal') as HTMLElement).classList.remove('active');
      }
    });
  }
}

export function mfDropdown(): void {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdownElement = target.closest('.js-dropdown') as HTMLElement | null;
      if (dropdownElement) {
        const dropdownWrapper = dropdownElement.closest('.mf_dropdowns')?.querySelector('.dropdown_wrapper') as HTMLElement | null;

        if (dropdownWrapper) {
          if (dropdownElement.tagName.toLowerCase() !== 'input') {
            dropdownElement.classList.toggle('active');
            if (dropdownWrapper.style.display === 'none' || dropdownWrapper.style.display === '') {
              slideDown(dropdownWrapper);
            } else {
              slideUp(dropdownWrapper);
            }
          } else {
            dropdownElement.classList.add('active');
            slideDown(dropdownWrapper);
          }
        }
      }
    });

    document.addEventListener('click', (event: MouseEvent) => {
      const dropdowns = document.querySelectorAll('.js-dropdowns');
      dropdowns.forEach((dropdown) => {
        const closeOver = (dropdown as HTMLElement).getAttribute('data-closeover') !== '0';
        if (closeOver && !dropdown.contains(event.target as Node)) {
          const dropdownButton = dropdown.querySelector('.js-dropdown') as HTMLElement | null;
          const dropdownWrapper = dropdown.querySelector('.dropdown_wrapper') as HTMLElement | null;
          if (dropdownButton) {
            dropdownButton.classList.remove('active');
          }
          if (dropdownWrapper) {
            slideUp(dropdownWrapper);
          }
        }
      });
    });
  });
}

type AlertMessageParams = {
  icon?: string | null;
  showIcon?: boolean;
  type?: 'success' | 'warning' | 'error';
  title?: string;
  message?: string;
  messageType?: 'string' | 'html' | 'free_style' | 'alert';
  modalSize?: 'xs' | 'sm' | 'md' | 'lg';
  modalClass?: string;
  overClass?: string;
  headClass?: string;
  bodyClass?: string;
  footClass?: string;
  head?: boolean;
  foot?: boolean;
  minimize?: boolean;
  canClose?: boolean;
  autoClose?: boolean;
  autoCloseTime?: number;
  cfButton?: {
    text: string;
    class: string;
    link?: string;
    callbackVal?: string;
  }[];
};

export function alertMessage(params: AlertMessageParams) {
  const defaults: AlertMessageParams = {
    icon: null,
    showIcon: true,
    type: 'warning',
    title: 'Lỗi không xác định',
    message: 'Lỗi không xác định, vui lòng thử lại',
    messageType: 'string',
    modalSize: 'sm',
    modalClass: '',
    overClass: '',
    headClass: '',
    bodyClass: '',
    footClass: '',
    head: true,
    foot: true,
    minimize: false,
    canClose: true,
    autoClose: false,
    autoCloseTime: 4200,
    cfButton: []
  };

  const options = { ...defaults, ...params };

  if (options.messageType === 'free_style') {
    options.modalClass += ' free_style_message';
    options.head = false;
  }

  const _iconImg = options.showIcon ? `<img class="msg_icon" src="${options.icon}" />` : '';
  let _msg = options.message!;

  if (options.messageType === 'free_style') {
    const titleClasses = {
      success: 'caribbean_green',
      warning: 'ronchi',
      error: 'persian_red'
    };
    const titleClass = titleClasses[options.type!] || '';
    _msg = `<div><h4 class="font15 font500 text-center mt2 mb16 ${titleClass}">${options.title}</h4>`;
    if (isValidHTMLElement(options.message)) {
      _msg += `<div class="free_style_content_message">${options.message}</div>`;
    } else {
      _msg += `<div class="free_style_content_message text-center"><p>${options.message}</p></div>`;
    }
    _msg += '</div>';
  } else if (!isValidHTMLElement(options.message)) {
    _msg = `<p>${options.message}</p>`;
  }

  const _modal = document.createElement('div');
  _modal.className = `js-modal md-fadeindown md_alert_message modal-${options.modalSize} ${options.modalClass}`;
  _modal.innerHTML = `
      <div class="md_over ${options.canClose ? 'js-close_message' : ''} ${options.overClass || ''}"></div>
      <div class="md_content">
        ${options.head ? `<div class="md_head ${options.headClass}">${options.canClose ? `<button type="button" class="js-close_message btn-close_modal"></button>` : ''}<h3 class="md_title">${options.title}</h3></div>` : ''}
        <div class="md_body ${options.bodyClass}">${_iconImg}${_msg}</div>
        ${options.foot ? `<div class="md_foot ${options.footClass}"><button type="button" class="btn-primary js-close_message">Đã hiểu</button></div>` : ''}
      </div>
  `;

  if (options.cfButton!.length > 0 && options.foot) {
    let _grpButton = '';
    for (const btn of options.cfButton!) {
      if (btn.link && btn.link !== '') {
        _grpButton += `<a href="${btn.link}" class="${btn.class}">${btn.text}</a>`;
      } else {
        _grpButton += `<button type="button" onclick="${btn.callbackVal}" class="js-close_message ${btn.class}">${btn.text}</button>`;
      }
    }
    (_modal.querySelector('.md_foot') as HTMLElement).innerHTML = _grpButton;
  }

  if (options.showIcon) {
    const iconPaths = {
      warning: {
        free_style: 'notifications/noti-question.svg',
        default: 'icons/ico-bell.svg'
      },
      error: {
        free_style: 'notifications/noti-error.svg',
        default: 'icons/ico-error-1.0.svg'
      },
      success: {
        free_style: 'notifications/noti-success.svg',
        default: 'icons/ico-completed-1.0.svg'
      }
    };
    const messageType = options.messageType === 'free_style' ? 'free_style' : 'default';
    if (iconPaths[options.type!]) {
      const _icon = iconPaths[options.type!][messageType];
      (_modal.querySelector('.msg_icon') as HTMLImageElement).src = `assets/images/${_icon}`;
    }
    if (options.icon) {
      (_modal.querySelector('.msg_icon') as HTMLImageElement).src = options.icon;
    }
  }

  if (options.messageType === 'alert') {
    let _iconType = 'fa-info';
    switch (options.type) {
      case 'warning':
        _iconType = 'fa-exclamation-triangle';
        break;
      case 'error':
        _iconType = 'fa-exclamation-circle';
        break;
      case 'success':
        _iconType = 'fa-check-circle';
        break;
    }
    const _alertBox = document.createElement('div');
    _alertBox.className = `alert alert-${options.type}`;
    _alertBox.innerHTML = `
          <div class="d-flex gap-12 align-items-baseline">
              <i class="fal ${_iconType}"></i>
              <p class="m-0">${options.message}</p>
          </div>
          <button type="button" class="btn-close_alert js-close_alert"><i class="ace-icon fa fa-times"></i></button>
      `;
    _alertBox.querySelector('.js-close_alert')!.addEventListener('click', function () {
      slideUp(_alertBox, 300, () => {
        _alertBox.remove();
      });
    });
    document.querySelector('.main_body')!.prepend(_alertBox);
    _alertBox.style.display = 'none';
    slideDown(_alertBox);
    if (options.autoClose) {
      setTimeout(() => {
        slideUp(_alertBox, 300, () => {
          _alertBox.remove();
        });
      }, 600 + options.autoCloseTime!);
    }
  } else {
    document.body.appendChild(_modal);
    setTimeout(() => {
      _modal.classList.add('active');
    }, 20);
    if (options.autoClose) {
      setTimeout(() => {
        _modal.classList.remove('active');
      }, 100 + options.autoCloseTime!);
      setTimeout(() => {
        _modal.remove();
      }, 600 + options.autoCloseTime!);
    }
  }

  document.body.addEventListener('click', function (event: Event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('js-close_message')) {
      const modal = target.closest('.js-modal') as HTMLElement;
      if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
          modal.remove();
        }, 500);
      }
    }
  });
}

// Utility functions
function isValidHTMLElement(input: any): boolean {
  return input instanceof HTMLElement;
}

export function maxEqLenSubstr(inputStr: string, params: any = null) {
  let _default = {
    fontSize: 13.6,
    subString: 2
  };
  let options = { ..._default, ...params };

  if (!inputStr) {
    return 0;
  }


  const divideString = (inputString: string, count: number) => {
    let parts = [];
    let partLength = Math.ceil(inputString.length / count);
    let start = 0;

    for (let i = 0; i < count - 1; i++) {
      let cutIndex = start + partLength;

      // Ensure we do not cut in the middle of a word
      while (cutIndex < inputString.length && inputString[cutIndex] !== ' ') {
        cutIndex++;
      }

      if (cutIndex === inputString.length) {
        cutIndex = start + partLength; // Fallback to mid part if no space found
      }

      let part = inputString.substring(start, cutIndex).trim();
      parts.push(part);
      start = cutIndex;
    }

    // Add the remaining part
    parts.push(inputString.substring(start).trim());

    return parts;
  };

  const parts = divideString(inputStr, options.subString);

  let createSpan = (part: any) => {
    // Create a span element
    const span = document.createElement('span');

    span.innerHTML = part;
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'nowrap';
    span.style.fontSize = options.fontSize + 'px';

    document.body.appendChild(span);

    let _width = span.offsetWidth;
    span.remove();
    return _width;
  };

  let maxWidth = 0;
  parts.forEach(part => {
    const width = createSpan(part);
    if (width > maxWidth) {
      maxWidth = width;
    }
  });

  return maxWidth + 16;
}