import '../styles/main.scss';
// import { createHeader } from './components/header';
// import { createFooter } from './components/footer';
// import { root } from './router';
import './events';
import { Checkout } from './components/Checkout';
const start = () => {
  document.body.append(
    Checkout(() => {
      console.log('first');
    }),
  );
  //document.body.append(createHeader(), root, createFooter());
};

start();
