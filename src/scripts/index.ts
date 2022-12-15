import '../styles/main.scss';
import { createHeader } from './components/header';
import { createFooter } from './components/footer';

const start = () => {
  document.body.append(createHeader(), createFooter());
};

start();
