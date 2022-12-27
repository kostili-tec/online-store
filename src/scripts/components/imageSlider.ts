import { createElement, createSvg } from './utils';

export class Slider {
  images: string[];
  reverseImages: string[] | null = null;
  fullImage: HTMLImageElement | null = null;
  vetricalImages: Array<HTMLImageElement> = [];
  verticalImgContainers: Array<HTMLElement> = [];
  horizontalImgContainers: Array<Node> = [];
  changeImageEvent: CallableFunction;
  count: number;
  constructor(imagesArr: string[]) {
    this.images = imagesArr;
    this.changeImageEvent = this.eventVertical.bind(this);
    this.count = 0;
  }

  createSlider(): HTMLElement {
    this.reverseImages = [...this.reverseImgs()];
    const sliderContainer = createElement('div', { className: 'slider-container' });
    const verticalContainer = createElement('div', { className: 'slider-vertical' });

    this.fullImage = new Image();
    this.fullImage.classList.add('slider__main-image');
    this.fullImage.src = this.reverseImages[0];

    this.createVerticalImages(this.reverseImages);
    this.verticalImgContainers = this.vetricalImages.map((el) => {
      const imgContainer = document.createElement('div');
      imgContainer.classList.add('slider-vertical__img-container');
      imgContainer.append(el);
      return imgContainer;
    });
    verticalContainer.append(...this.verticalImgContainers);
    this.verticalImgContainers[0].classList.add('slider-vertical__img-active');
    this.count = this.verticalImgContainers.length - 1;
    console.log(this.count);

    sliderContainer.append(verticalContainer, this.fullImage);
    const eventFunc = this.eventVertical.bind(this);
    const fullSlider = this.createFullSlider.bind(this);
    verticalContainer.addEventListener('mouseover', eventFunc);
    this.fullImage.addEventListener('click', () => document.body.append(fullSlider()));
    return sliderContainer;
  }

  createFullSlider() {
    const fullSliderContainer = createElement('div', { className: 'full-slider__container' });
    const closeButton = createElement('button', { className: 'full-slider__close-button' });
    const closeSvg = createSvg('cross-svg', 'cross');
    closeButton.appendChild(closeSvg);
    closeButton.addEventListener('click', () => fullSliderContainer.remove());
    const mediaVievConainer = createElement('div', { className: 'full-slider__meida-container' });
    const leftButton = createElement('button', { className: 'full-slider__left-button' });
    const leftSvg = createSvg('button-chevron__svg', 'chevron-left');
    leftButton.append(leftSvg);
    const rightButton = createElement('button', { className: 'full-slider__right-button' });
    const rightSvg = createSvg('button-chevron__svg', 'chevron-left');
    rightButton.append(rightSvg);
    const fullSliderImage = new Image();
    if (this.fullImage) {
      fullSliderImage.src = this.fullImage.src;
    }
    fullSliderImage.classList.add('full-slider__main-image');

    const horizontalContainer = createElement('div', { className: 'full-slider__horizontal' });
    this.horizontalImgContainers = this.verticalImgContainers.map((el) => el.cloneNode(true));
    horizontalContainer.append(...this.horizontalImgContainers);

    const activeEl = this.getActiveEl(
      this.horizontalImgContainers as Array<HTMLElement>,
      'slider-vertical__img-active',
    );
    if (activeEl) {
      activeEl.classList.remove('slider-vertical__img-active');
      activeEl.classList.add('full-slider__horizontal-active');
    }

    const eventFuncHorizontal = this.eventHorizontal.bind(this, fullSliderImage);
    horizontalContainer.addEventListener('mouseover', eventFuncHorizontal);

    mediaVievConainer.append(leftButton, fullSliderImage, rightButton);
    fullSliderContainer.append(closeButton, mediaVievConainer, horizontalContainer);

    return fullSliderContainer;
  }

  async eventVertical(e: MouseEvent) {
    const { target } = e;
    if (target instanceof HTMLImageElement && target.classList.contains('slider-vertical__img')) {
      const currentSrc = target.src;
      this.removeActive(this.verticalImgContainers);
      const parent = target.parentElement;
      if (parent) {
        parent.classList.add('slider-vertical__img-active');
      }
      if (this.fullImage && this.fullImage.src !== currentSrc) {
        await this.changeImg(this.fullImage, currentSrc);
      }
    }
  }

  async eventHorizontal(fullImg: HTMLImageElement, e: MouseEvent) {
    const { target } = e;
    if (target instanceof HTMLImageElement && target.classList.contains('slider-vertical__img')) {
      const currentSrc = target.src;
      this.removeActive(this.horizontalImgContainers as Array<HTMLElement>);
      const parent = target.parentElement;
      if (parent) {
        parent.classList.add('full-slider__horizontal-active');
      }
      if (fullImg && fullImg.src !== currentSrc) {
        await this.changeImg(fullImg, currentSrc);
      }
    }
  }

  async changeImg(img: HTMLImageElement, src: string) {
    if (img.getAnimations().length !== 0) return;

    const imgOpacityOn = img.animate([{ opacity: '1' }, { opacity: '0' }], { duration: 150, easing: 'ease-in' });

    await new Promise((resolve) => (imgOpacityOn.onfinish = resolve));
    img.src = src;
    const imgOpacityOff = img.animate([{ opacity: '0' }, { opacity: '1' }], { duration: 150, easing: 'ease-in' });
    await new Promise((resolve) => (imgOpacityOff.onfinish = resolve));
  }

  removeActive(array: Array<HTMLElement>) {
    array.forEach((el) => {
      if (el.classList.contains('slider-vertical__img-active')) {
        el.classList.remove('slider-vertical__img-active');
      }
      if (el.classList.contains('full-slider__horizontal-active')) {
        el.classList.remove('full-slider__horizontal-active');
      }
    });
  }

  getActiveEl(array: Array<HTMLElement>, className: string): HTMLElement | undefined {
    return array.find((el) => el.classList.contains(`${className}`));
  }

  reverseImgs(): string[] {
    return this.images.reverse();
  }

  createVerticalImages(array: string[]) {
    array.forEach((el) => {
      const img = new Image();
      img.src = el;
      img.classList.add('slider-vertical__img');
      this.vetricalImages.push(img);
    });
  }
}
