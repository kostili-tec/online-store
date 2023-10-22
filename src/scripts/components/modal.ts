export function showModal(createWindow: (close: () => void) => HTMLElement): void {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  const close = () => {
    if (modalOverlay.getAnimations().length) return;
    const anim = modalOverlay.animate(
      [{ opacity: '1' }, { opacity: '0' }],
      200, //duration in msec
    );
    anim.onfinish = () => modalOverlay.remove();
  };

  const modalWin = createWindow(close);
  modalOverlay.append(modalWin);

  modalOverlay.onclick = (e: Event) => {
    if (modalWin.classList.contains('modal-nonclosable') || e.target !== modalOverlay) return;
    close();
  };

  modalOverlay.animate(
    [{ opacity: '0' }, { opacity: '1' }],
    200, //duration in msec
  );

  document.body.append(modalOverlay);
}
