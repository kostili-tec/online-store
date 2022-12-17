import '../styles/main.scss';
import { createHeader } from './components/header';
import { createFooter } from './components/footer';
import { root } from './router';

const start = () => {
  document.body.append(createHeader(), root, createFooter());
};

start();