import '../styles/main.scss';
import { createHeader } from './components/header';

const start = () => {
  document.body.append(createHeader());
};

start();
