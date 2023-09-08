// テーマの切り替え
const body = document.body

const btnTheme = document.querySelector('.fa-moon')
const btnHamburger = document.querySelector('.fa-bars')

// const addThemeClass = (bodyClass, btnClass) => {
//   body.classList.add(bodyClass)
//   btnTheme.classList.add(btnClass)
// }

const addThemeClass = (bodyClass, btnClass) => {
	if (bodyClass && btnClass) {
	  body.classList.add(bodyClass);
	  btnTheme.classList.add(btnClass);
	}
  };  

const getBodyTheme = localStorage.getItem('portfolio-theme')
const getBtnTheme = localStorage.getItem('portfolio-btn-theme')

addThemeClass(getBodyTheme, getBtnTheme)

const isDark = () => body.classList.contains('dark')

const setTheme = (bodyClass, btnClass) => {

	body.classList.remove(localStorage.getItem('portfolio-theme'))
	btnTheme.classList.remove(localStorage.getItem('portfolio-btn-theme'))

  addThemeClass(bodyClass, btnClass)

	localStorage.setItem('portfolio-theme', bodyClass)
	localStorage.setItem('portfolio-btn-theme', btnClass)
}

const toggleTheme = () =>
	isDark() ? setTheme('light', 'fa-moon') : setTheme('dark', 'fa-sun')

btnTheme.addEventListener('click', toggleTheme)

// ナビゲーションの表示
const displayList = () => {
	const navUl = document.querySelector('.nav__list')

	if (btnHamburger.classList.contains('fa-bars')) {
		btnHamburger.classList.remove('fa-bars')
		btnHamburger.classList.add('fa-times')
		navUl.classList.add('display-nav-list')
	} else {
		btnHamburger.classList.remove('fa-times')
		btnHamburger.classList.add('fa-bars')
		navUl.classList.remove('display-nav-list')
	}
}

btnHamburger.addEventListener('click', displayList)


// スクロールトップとダウンのボタンの表示
const btnScrollTop = document.querySelector('.scroll-top');
const btnScrollDown = document.querySelector('.scroll-down');

window.addEventListener('scroll', () => {
    if (window.scrollY > 1200) {
        btnScrollTop.style.display = 'block';
        btnScrollDown.style.display = 'none';
    } else {
        btnScrollTop.style.display = 'none';
        btnScrollDown.style.display = 'block';
    }
});

// アルバム用に調整
let currentImageIndex = 0;
const images = [
    'path/to/your/image1.jpg',
    'path/to/your/image2.jpg',
    // 他の画像のパスも追加
];

const imgElement = document.getElementById('currentImage');

function enlargeImage(element) {
    if (element.style.height !== '600px') {
        element.style.height = '600px';
        element.style.width = 'auto';
        element.style.objectFit = 'contain';
    } else {
        resetImageSize(element);
    }
}

function resetImageSize(element) {
    if (Array.from(element.parentElement.children).indexOf(element) % 5 === 4) {
        element.style.height = '400px';
        element.style.width = '400px';
    } else {
        element.style.height = '300px';
        element.style.width = '300px';
    }
    element.style.objectFit = 'cover';
}


document.getElementById('next').addEventListener('click', function() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    imgElement.src = images[currentImageIndex];
    resetImageSize();
});

document.getElementById('prev').addEventListener('click', function() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    imgElement.src = images[currentImageIndex];
    resetImageSize();
});
