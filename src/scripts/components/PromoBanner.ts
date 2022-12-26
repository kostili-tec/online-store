import { Timer, createElement, createImage } from './utils';
import { toaster } from './toast';

import newcomer from '../../assets/promos/newcomer.webp';
import student from '../../assets/promos/student.webp';
import ny from '../../assets/promos/ny.webp';
import { onPageReload } from '../events';

interface IPromoBanner {
  code: string;
  src: string;
}

const promoBanners: IPromoBanner[] = [
  { code: 'NEWCOMER', src: newcomer },
  { code: 'RS-STUDENT', src: student },
  { code: 'HAPPY-NY', src: ny },
];

export function PromoBanner(): HTMLElement {
  const container = createElement('div', { className: 'promo-container' });
  const slider = createElement('div', { className: 'promo-slider' });
  const track = createElement('div', { className: 'promo-slider__track' });
  slider.append(track);
  promoBanners.forEach((promoBanner) => {
    track.append(
      createImage({
        src: promoBanner.src,
        className: 'promo-slider__slide',
        onclick: (e) => {
          navigator.clipboard
            .writeText(promoBanner.code)
            .then(() => toaster.show('Code copied to clipboard!', 0, { left: e.pageX, top: e.pageY }));
        },
      }),
    );
  });
  const timer = new Timer(() => slide(track, -1), 12000);
  onPageReload.subscribe(() => timer.stop(), true);
  container.onmouseenter = () => timer.stop();
  container.onmouseleave = () => timer.restart();

  container.append(
    createElement('span', {
      textContent: '<',
      className: 'promo-control',
      onclick: () => slide(track, 1),
    }),
    slider,
    createElement('span', {
      textContent: '>',
      className: 'promo-control',
      onclick: () => slide(track, -1),
    }),
  );
  return container;
}

async function slide(slider: HTMLElement, direction: number) {
  if (slider.getAnimations().length !== 0) return;

  const slideAnimation = slider.animate(
    [{ transform: 'translateX(0)' }, { transform: `translateX(${100 * direction}%)` }],
    { duration: 2000, easing: 'ease-in-out' },
  );

  await new Promise((resolve) => (slideAnimation.onfinish = resolve));

  if (direction === 1) slider.lastElementChild && slider.prepend(slider.lastElementChild);
  else slider.firstElementChild && slider.append(slider.firstElementChild);
}
