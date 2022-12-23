import { createElement, createImage } from './utils';

import newcomer from '../../assets/promos/newcomer.png';
import student from '../../assets/promos/student.png';
import ny from '../../assets/promos/ny.png';
import { onPageReload } from '../events';

export function PromoBanner(): HTMLElement {
  const container = createElement('div', { className: 'promo-container' });
  const slider = createElement('div', { className: 'promo-slider' });
  const track = createElement('div', { className: 'promo-slider__track' });
  slider.append(track);
  [newcomer, student, ny].forEach((src) => {
    track.append(createImage({ src, className: 'promo-slider__slide' }));
  });
  const interval = setInterval(() => slide(track, -1), 10000);
  onPageReload.subscribe(() => clearInterval(interval), true);

  container.append(
    createElement('button', {
      className: 'promo-control control-left',
      onclick: () => slide(track, 1),
    }),
    slider,
    createElement('button', {
      className: 'promo-control control-right',
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
