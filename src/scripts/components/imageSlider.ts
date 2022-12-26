import { createElement } from './utils';

export class Slider {
  images: string[];
  reverseImages: string[] | null = null;
  fullImage: HTMLImageElement | null = null;
  vetricalImages: Array<HTMLImageElement> = [];
  public verticalImgContainers: Array<HTMLElement> = [];
  changeImageEvent: CallableFunction;
  constructor(imagesArr: string[]) {
    this.images = imagesArr;
    this.changeImageEvent = this.eventVertical.bind(this);
  }

  createSlider(): HTMLElement {
    this.reverseImages = [...this.reverseImgs()];
    const sliderContainer = createElement('div', { className: 'slider-container' });
    const verticalContainer = createElement('div', { className: 'slider-vertical' });

    this.fullImage = document.createElement('img');
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

    sliderContainer.append(verticalContainer, this.fullImage);
    const eventFunc = this.eventVertical.bind(this);
    verticalContainer.addEventListener('mouseover', eventFunc);
    return sliderContainer;
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
      if (this.fullImage) {
        await this.changeImg(this.fullImage, currentSrc);
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
    });
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
