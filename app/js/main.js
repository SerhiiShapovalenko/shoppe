// menu

const menuBtn = document.querySelector('.menu__btn');
const menuList = document.querySelector('.menu__list');

menuBtn.addEventListener('click', () => {
  document.body.classList.toggle('_lock');
  menuList.classList.toggle('menu__list--active');
  menuBtn.classList.toggle('menu__btn--close');
});

// swiper

const swiper = new Swiper('.swiper', {
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});
