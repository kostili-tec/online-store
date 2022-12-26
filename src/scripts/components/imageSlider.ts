import { createElement } from './utils';

export class Slider {
  images: string[];
  reverseImages: string[] | null = null;
  fullImage: HTMLImageElement | null = null;
  vetricalImages: Array<HTMLImageElement> = [];
  verticalImgContainers: Array<HTMLElement> = [];
  constructor(imagesArr: string[]) {
    this.images = imagesArr;
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
    this.eventForVertical();
    return sliderContainer;
  }

  eventForVertical() {
    this.vetricalImages.forEach((el) => {
      el.addEventListener('mouseover', (e) => {
        const { target } = e;
        if (target instanceof HTMLImageElement && target.classList.contains('slider-vertical__img')) {
          this.removeActive(this.verticalImgContainers);
          const parent = target.parentElement;
          if (parent) {
            parent.classList.add('slider-vertical__img-active');
          }
          if (this.fullImage) this.fullImage.src = target.src;
        }
      });
    });
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
