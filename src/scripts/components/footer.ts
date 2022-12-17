export function createFooter(): HTMLElement {
  const footer = document.createElement('footer');
  footer.classList.add('footer');

  const authorsContainer = document.createElement('div');
  authorsContainer.classList.add('footer__authors-container');
  const ferka123 = document.createElement('a');
  ferka123.textContent = '@ferka123';
  ferka123.href = 'https://github.com/ferka123';
  const kostiliTec = document.createElement('a');
  kostiliTec.textContent = '@kostili-tec';
  kostiliTec.href = 'https://github.com/kostili-tec';

  authorsContainer.append(ferka123, kostiliTec);

  const year = document.createElement('h4');
  year.textContent = '2022';
  year.classList.add('footer-year');

  const logoLink = document.createElement('a');
  logoLink.href = 'https://rs.school/js/';
  logoLink.classList.add('footer-course');
  const logoImg = document.createElement('img');
  logoImg.src = 'https://rs.school/images/rs_school_js.svg';
  logoLink.append(logoImg);

  footer.append(authorsContainer, year, logoLink);
  return footer;
}
