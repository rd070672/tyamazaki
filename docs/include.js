// js/include.js
document.addEventListener("DOMContentLoaded", () => {
  // ヘッダー読み込み
  fetch("header.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("header").innerHTML = html;
    });

  // フッター読み込み
  fetch("footer.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("footer").innerHTML = html;
    });
});