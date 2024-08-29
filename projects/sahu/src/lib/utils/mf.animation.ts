export function slideUp(element: HTMLElement, duration = 300, callback?: () => void) {
  if (!element) return;
  element.style.height = element.offsetHeight + 'px';
  element.style.transitionProperty = 'height, margin, padding';
  element.style.transitionDuration = duration + 'ms';

  requestAnimationFrame(() => {
    element.style.overflow = 'hidden';
    element.style.height = '0';
    element.style.paddingTop = '0';
    element.style.paddingBottom = '0';
    element.style.marginTop = '0';
    element.style.marginBottom = '0';
    element.style.borderBottomWidth = '0';
    element.style.borderTopWidth = '0';
  });

  window.setTimeout(() => {
    element.style.display = 'none';
    element.style.removeProperty('height');
    element.style.removeProperty('padding-top');
    element.style.removeProperty('padding-bottom');
    element.style.removeProperty('margin-top');
    element.style.removeProperty('margin-bottom');
    element.style.removeProperty('border-top-width');
    element.style.removeProperty('border-bottom-width');
    element.style.removeProperty('overflow');
    element.style.removeProperty('transition-duration');
    element.style.removeProperty('transition-property');

    if (callback) callback();
  }, duration);
}

export function slideDown(element: HTMLElement, duration = 300, callback?: () => void) {
  if (!element) return;
  element.style.removeProperty('display');
  let display = window.getComputedStyle(element).display;

  if (display === 'none')
    display = 'block';

  element.style.display = display;
  let height = element.offsetHeight;
  element.style.overflow = 'hidden';
  element.style.height = '0';
  element.style.paddingTop = '0';
  element.style.paddingBottom = '0';
  element.style.marginTop = '0';
  element.style.marginBottom = '0';
  element.style.borderTopWidth = '0';
  element.style.borderBottomWidth = '0';
  element.offsetHeight; // force reflow

  element.style.transitionProperty = 'height, margin, padding';
  element.style.transitionDuration = duration + 'ms';
  element.style.height = height + 'px';
  element.style.removeProperty('padding-top');
  element.style.removeProperty('padding-bottom');
  element.style.removeProperty('margin-top');
  element.style.removeProperty('margin-bottom');
  element.style.removeProperty('border-top-width');
  element.style.removeProperty('border-bottom-width');

  window.setTimeout(() => {
    element.style.removeProperty('height');
    element.style.removeProperty('overflow');
    element.style.removeProperty('transition-duration');
    element.style.removeProperty('transition-property');

    if (callback) callback();
  }, duration);
}

export function slideToggle(element: HTMLElement, duration = 300, callback?: () => void) {
  if (!element) return;
  let display = window.getComputedStyle(element).display;

  if (display === 'none') {
    slideDown(element);
  } else {
    slideUp(element);
  }
}
