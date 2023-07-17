const gb = (function () {
  return {
    wW: window.innerWidth,
    wH: window.innerHeight,
    html: document.querySelector('html'),
    meta: document.querySelector('meta[name=theme-color]'),
    body: document.querySelector('body'),
    layout: document.getElementById('layout'),
    main: document.querySelector('.main'),
    header: document.getElementById('gnb'),
    //buttonOpenAllmenu: document.querySelector('.button-open-allMenu'),
    //buttonCloseAllmenu: document.querySelector('.button-close-allMenu'),
    //allMenu: document.querySelector('.allMenu'),
    buttonActiveDropDown: document.querySelectorAll('.button-active-dropDown'),
    btnActiveModal: document.querySelectorAll('.button-active-modal'),
    btnCloseModal: document.querySelectorAll('.button-close-modal'),
    dropDown: document.querySelectorAll('.dropDown'),
    isMob: window.innerWidth <= 821 ? true : false,
    isFocus: false,
  };
})();

export default gb;
