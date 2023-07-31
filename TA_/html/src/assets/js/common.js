//
//-----------------------------------------------------------------
// 공통 스크립트
//-----------------------------------------------------------------
//

window.addEventListener('load', () => {
  gb.CommonFunction.init();
});

gb.CommonFunction = (function () {
  const setGnb = () => {
    //const themeColor = gb.meta.getAttribute('content');

    if (gb.buttonOpenAllmenu) {
      gb.buttonOpenAllmenu.addEventListener('click', function () {
        gb.layout.style.height = '100vh';
        gb.layout.style.overflowY = 'hidden';
        gb.allMenu.style.display = 'block';
        //gb.meta.setAttribute('content', '#e5f4f9');
      });
    }

    if (gb.buttonCloseAllmenu) {
      gb.buttonCloseAllmenu.addEventListener('click', function () {
        gb.layout.style.height = 'auto';
        gb.layout.style.overflowY = 'auto';
        gb.allMenu.scrollTop = 0;
        gb.allMenu.style.display = 'none';
        // gb.meta.setAttribute('content', themeColor);
      });
    }
  };
  const modalOn = () => {
    const hash = location.hash;
    const currentModal = document.querySelector(`.modal#modal_${hash.substring(1)}`);
    currentModal ? currentModal.classList.add('zoomIn') : '';

    //console.log(currentModal);

    // 공통 모달 열기
    gb.btnActiveModal.forEach(function (el) {
      el.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const trg = this;
        const modalName = trg.getAttribute('data-modal-name');
        const modal_ = document.querySelectorAll('.modal:not(.dialog)');
        const currentModal = document.querySelector(`.modal#modal_${modalName}`);

        modal_.forEach(function (el) {
          el.classList.remove('zoomIn');
        });
        currentModal.classList.add('zoomIn');

        gb.body.style.height = '100vh';
        gb.body.style.overflowY = 'hidden';
      });
    });

    gb.btnCloseModal.forEach(function (el) {
      el.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const trg = this;
        const modalName = trg.getAttribute('data-modal-name');
        const currentModal = document.querySelector(`.modal#modal_${modalName}`);

        currentModal.classList.remove('zoomIn');

        gb.body.style.height = 'auto';
        gb.body.style.overflowY = 'visible';
      });
    });
  };
  const fileUpload = (el, type) => {
    // input file
    const pathpoint = el.value.lastIndexOf('.');
    const filepoint = el.value.substring(pathpoint + 1, el.length);
    const filetype = filepoint.toLowerCase(); // 업로드 파일 확장자
    const fileReader = new FileReader();
    const fileName = el.files[0].name; // 첨부 파일 명
    const filesize = el.files[0].size; // 첨부 파일 용량

    fileReader.readAsDataURL(el.files[0]);

    if (type == 'image') {
      // 이미지 업로드
      if (filetype == 'jpg' || filetype == 'gif' || filetype == 'png' || filetype == 'jpeg' || filetype == 'bmp') {
        //정상적인 이미지 확장자 파일일 경우
        fileReader.onload = function (e) {
          el.closest('.file-attach-image').children[0].children[0].setAttribute('src', e.target.result);
        };
      } else {
        alert('이미지 파일만 등록 가능 합니다.');
        parentObj = el.parentNode;
        node = parentObj.replaceChild(el.cloneNode(true), el);
        return false;
      }
    } else {
      el.closest('.file-attach').children[0].children[0].value = fileName;
    }
  };
  const copyToClipboard = (val) => {
    // 클립 보드에 복사
    const t = document.createElement('textarea');

    document.body.appendChild(t);

    t.value = val;
    t.select();

    document.execCommand('copy');
    document.body.removeChild(t);
  };
  const copyUrl = () => {
    // url 복사
    copyToClipboard(location.href);
    alert('링크가 복사되었습니다.\n ' + location.href);
  };
  const checkAll = () => {
    // 전체 선택
    const chkAll = document.querySelectorAll('.chkList input[type=checkbox][name^=allChk]');
    const chk_ = document.querySelectorAll('.chkList input[type=checkbox]:not([name^=allChk])');

    chkAll.forEach(function (el) {
      el.addEventListener('change', function () {
        const _name = el.getAttribute('name').split('_')[1];
        const _item = document.querySelectorAll(`input[type=checkbox][name^=${_name}]`);

        if (el.checked) {
          _item.forEach(function (elem) {
            elem.checked = false;
          });
        }
      });
    });

    chk_.forEach(function (el) {
      el.addEventListener('change', function () {
        const _name = el.getAttribute('name').split('_')[0];
        const _item = document.querySelectorAll(`input[type=checkbox][name^=allChk_${_name}]`);

        if (el.checked) {
          _item.forEach(function (elem) {
            elem.checked = false;
          });
        }
      });
    });
  };
  const dropDown = () => {
    gb.buttonActiveDropDown.forEach(function (elem) {
      // dropDown 활성화
      if (elem.parentElement.classList.contains('current')) {
        elem.parentElement.classList.add('on');
        elem.nextElementSibling.style.display = 'block';
      }

      elem.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const dropDown_ = this.nextElementSibling;
        const parent_ = this.parentElement;

        if (parent_.classList.contains('on')) {
          this.parentElement.classList.remove('on');
          gsap.to(dropDown_, {
            height: 0,
            duration: 0.2,
            overwrite: true,
            onComplete: function () {
              dropDown_.style.display = 'none';
            },
          });
        } else {
          parent_.classList.add('on');
          dropDown_.style.display = 'block';
          gsap.to(dropDown_, {
            height: 'auto',
            duration: 0.2,
            overwrite: true,
          });
        }
      });
    });
  };
  const listSwiper = () => {
    gb._listSwiper = gb._listSwiper || [];
    gb.listSwiper = document.querySelectorAll('.list-swiper');

    gb.listSwiper.forEach(function (el, idx) {
      if (typeof gb._listSwiper[idx] !== 'undefined') {
        gb._vdSwiper[idx].destroy();
        gb._vdSwiper[idx] = undefined;
      }

      gb._listSwiper[idx] = new Swiper(el, {
        modules: [Autoplay, Navigation, Pagination],
        // autoplay: {
        //   delay: 4000,
        // },
        loop: true,
        centeredSlides: false,
        slidesPerView: 'auto',
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    });
  };
  const init = () => {
    modalOn();
    //setGnb();
    //checkAll();
    dropDown();
    //listSwiper();
  };

  return {
    init,
    //fileUpload,
    //copyUrl,
  };
})();
