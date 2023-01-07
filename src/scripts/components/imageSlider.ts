import { createElement, createSvg } from './utils';

enum SliderButtons {
  left,
  right,
}

export class Slider {
  images: string[];
  reverseImages: string[] | null = null;
  fullImage: HTMLImageElement | null = null;
  vetricalImages: Array<HTMLImageElement> = [];
  verticalImgContainers: Array<HTMLElement> = [];
  horizontalImgContainers: Array<Node> = [];
  numberActive: number;
  constructor(imagesArr: string[]) {
    this.images = imagesArr;
    this.numberActive = 0;
  }

  createSlider(): HTMLElement {
    this.reverseImages = [...this.reverseImgs()];
    const sliderContainer = createElement('div', { className: 'slider-container' });
    const verticalContainer = createElement('div', { className: 'slider-vertical' });
    const fullImageContainer = createElement('div', { className: 'slider__img-container' });

    this.fullImage = new Image();
    this.fullImage.classList.add('slider__main-image');
    this.fullImage.src = this.reverseImages[0];
    fullImageContainer.append(this.fullImage);

    this.createVerticalImages(this.reverseImages);
    this.verticalImgContainers = this.vetricalImages.map((el) => {
      const imgContainer = document.createElement('div');
      imgContainer.classList.add('slider-vertical__img-container');
      imgContainer.append(el);
      return imgContainer;
    });
    verticalContainer.append(...this.verticalImgContainers);
    this.verticalImgContainers[0].classList.add('slider-vertical__img-active');

    sliderContainer.append(verticalContainer, fullImageContainer);
    const eventFunc = this.eventVertical.bind(this);
    const fullSlider = this.createFullSlider.bind(this);
    verticalContainer.addEventListener('mouseover', eventFunc);
    this.fullImage.addEventListener('click', () => document.body.append(fullSlider()));
    return sliderContainer;
  }

  createFullSlider() {
    const fullSliderContainer = createElement('div', { className: 'full-slider__container' });
    const closeButton = createElement('button', { className: 'full-slider__close-button' });
    const closeSvg = createSvg('cross-svg__slider', 'cross');
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
    const fullImageContainer = createElement('div', { className: 'full-slider__img-container' });
    fullImageContainer.append(fullSliderImage);
    const currentActiveIndex = this.getActiveElIndex(this.verticalImgContainers, 'slider-vertical__img-active');
    if (currentActiveIndex) this.numberActive = currentActiveIndex;
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

    leftButton.addEventListener('click', this.eventForButtons.bind(this, fullSliderImage, SliderButtons.left));
    rightButton.addEventListener('click', this.eventForButtons.bind(this, fullSliderImage, SliderButtons.right));

    mediaVievConainer.append(leftButton, fullImageContainer, rightButton);
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
      const activeElIndex = this.getActiveElIndex(
        this.horizontalImgContainers as Array<HTMLElement>,
        'full-slider__horizontal-active',
      );
      if (activeElIndex) this.numberActive = activeElIndex;
    }
  }

  async eventForButtons(fullImg: HTMLImageElement, leftOrRight: SliderButtons) {
    if (leftOrRight === SliderButtons.left) {
      this.numberActive--;
      this.numberActive < 0 ? (this.numberActive = this.horizontalImgContainers.length - 1) : this.numberActive;
    } else if (leftOrRight === SliderButtons.right) {
      this.numberActive++;
      this.numberActive > this.horizontalImgContainers.length - 1 ? (this.numberActive = 0) : this.numberActive;
    }
    this.removeActive(this.horizontalImgContainers as Array<HTMLElement>);
    (this.horizontalImgContainers as Array<HTMLElement>)[this.numberActive].classList.add(
      'full-slider__horizontal-active',
    );
    await this.changeImg(fullImg, this.vetricalImages[this.numberActive].src);
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

  getActiveElIndex(array: Array<HTMLElement>, className: string) {
    const activeElement = this.getActiveEl(array, className);
    if (activeElement) {
      return array.indexOf(activeElement, 0);
    } else {
      return undefined;
    }
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
