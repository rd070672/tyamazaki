// テーマの切り替え
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

// const scrollUp = () => {
// 	const btnScrollTop = document.querySelector('.scroll-top')

// 	if (
// 		body.scrollTop > 500 ||
// 		document.documentElement.scrollTop > 500
// 	) {
// 		btnScrollTop.style.display = 'block'
// 	} else {
// 		btnScrollTop.style.display = 'none'
// 	}
// }

// スクロールトップとダウンのボタンの表示
const btnScrollTop = document.querySelector('.scroll-top');
const btnScrollDown = document.querySelector('.scroll-down');

window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        btnScrollTop.style.display = 'block';
        btnScrollDown.style.display = 'none';
    } else {
        btnScrollTop.style.display = 'none';
        btnScrollDown.style.display = 'block';
    }
});

// document.addEventListener('scroll', scrollUp)

// let lastScrollTop = 0;

// const header2 = document.querySelector('.header2');

// window.addEventListener('scroll', function() {
//     let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//     if (scrollTop > lastScrollTop) {
//         // スクロールしている時にヘッダーを隠す
//         header2.style.top = '-70px';  // ヘッダーの高さに合わせて調整
//     } else {
//         // スクロールアップしている時にヘッダーを表示
//         header2.style.top = '0';
//     }
//     lastScrollTop = scrollTop;
// });

// document.addEventListener('DOMContentLoaded', function() {
//     // スムーズスクロールの実装 (オプション)
//     const anchors = document.querySelectorAll('a[href^="#"]');
//     anchors.forEach(anchor => {
//         anchor.addEventListener('click', function (e) {
//             e.preventDefault();
//             document.querySelector(this.getAttribute('href')).scrollIntoView({
//                 behavior: 'smooth'
//             });
//         });
//     });

//     // ページ内リンクのスムーズスクロール（サイドバー）
//     const yearBoxes = document.querySelectorAll('.year-box');
//     yearBoxes.forEach(yearBox => {
//         yearBox.addEventListener('click', function() {
//             const year = this.getAttribute('data-year');
//             const relatedArticles = document.querySelector(`[data-year-articles="${year}"]`);

//             if (relatedArticles.style.display === 'none' || !relatedArticles.style.display) {
//                 relatedArticles.style.display = 'block';
//             } else {
//                 relatedArticles.style.display = 'none';
//             }
//         });
//     });
// });

// ページ内リンクのサイドバーの挿入
// window.addEventListener("DOMContentLoaded", function() {
//     // loadComponent("header", "header.html");
//     loadComponent("sidebar", "sidebar.html");
//     // loadComponent("footer", "footer.html");
// });

// function loadComponent(elementId, url) {
//     fetch(url).then(function(response) {
//         return response.text();
//     }).then(function(data) {
//         document.getElementById(elementId).innerHTML = data;
//     });
// }

// // ページ内リンクのサイドバーの挿入
// $(function() {
//     // load関数を使って、sidebar.htmlファイルの内容を取得する
//     $("#sidebar").load("sidebar.html");
//   });

// $(document).ready(function() {
//     $("#header").load("../header.html", function() {
//         // ヘッダーがロードされた後に実行されるコールバック
//         bindButtonActions();
//     });
//     $("#sidebar").load("../sidebar.html", function() {
//         // サイドバーがロードされた後に実行されるコールバック
//     });
// });

// function bindButtonActions() {
//     $("#btn-theme").click(function() {
//         // ここでテーマの切り替え処理
//         console.log("Theme button clicked.");
//     });
    
//     $("#btn-navigation").click(function() {
//         // ここでナビゲーションの切り替え処理
//         console.log("Navigation button clicked.");
//     });
// }
