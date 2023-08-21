const body = document.body

const btnTheme = document.querySelector('.fa-moon')
const btnHamburger = document.querySelector('.fa-bars')

const addThemeClass = (bodyClass, btnClass) => {
  body.classList.add(bodyClass)
  btnTheme.classList.add(btnClass)
}

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

const scrollUp = () => {
	const btnScrollTop = document.querySelector('.scroll-top')

	if (
		body.scrollTop > 500 ||
		document.documentElement.scrollTop > 500
	) {
		btnScrollTop.style.display = 'block'
	} else {
		btnScrollTop.style.display = 'none'
	}
}

document.addEventListener('scroll', scrollUp)

let lastScrollTop = 0;
const header2 = document.querySelector('.header2');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        // スクロールしている時にヘッダーを隠す
        header2.style.top = '-70px';  // ヘッダーの高さに合わせて調整
    } else {
        // スクロールアップしている時にヘッダーを表示
        header2.style.top = '0';
    }
    lastScrollTop = scrollTop;
});

// 箇条書きのための。で改行する
// $(document).ready(function() {
$(".bulletdot").each(function() {
	var items = $(this).text().split('。');
	$(this).empty();
	items.forEach(function(item) {
	if (item) {
		$('<p>').text(item).appendTo(".bullet");
	}
	});
});
// });

// 箇条書きのための\nで改行する
// $(document).ready(function() {
$(".bullet").each(function() {
	var items = $(this).text().split('<br>'); // 改行で分割
	$(this).empty();
	items.forEach(function(item) {
	if (item.trim()) { // 空の項目を無視
		$('<p>').text(item).appendTo(".bullet");
	}
	});
});
// });

// 番号リストのための\nで改行する
// $(document).ready(function() {
$(".numList").each(function() {
	var items = $(this).text().split('<br>'); // 改行で分割
	$(this).empty();
	$(this).css('counter-reset', 'lineNum'); // CSSカウンタの初期化
	items.forEach(function(item) {
	if (item.trim()) { // 空の項目を無視
		$('<p>').text(item).appendTo(".numList");
	}
	});
});
// });

// スムーズスクロールの実装 (オプション)
// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
	e.preventDefault();

	document.querySelector(this.getAttribute('href')).scrollIntoView({
		behavior: 'smooth'
	});
});
// });

// ページ内リンクのスムーズスクロール（サイドバー）
const yearBoxes = document.querySelectorAll('.year-box');

yearBoxes.forEach(yearBox => {
	yearBox.addEventListener('click', function() {
	const year = this.getAttribute('data-year');
	const relatedArticles = document.querySelector(`[data-year-articles="${year}"]`);
	
	if (relatedArticles.style.display === 'none') {
		relatedArticles.style.display = 'block';
	} else {
		relatedArticles.style.display = 'none';
	}
	});
});

