const canvas = document.getElementById('ballCanvas');
const ctx = canvas.getContext('2d');

let mouseX = -100, mouseY = -100;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// const balls = [];

// function createBall(x, y, color) {
//     return {
//         x: x,
//         y: y,
//         radius: 30,
//         color: color,
//         velocityX: 4 * (Math.random() < 0.5 ? 1 : -1),
//         velocityY: 4 * (Math.random() < 0.5 ? 1 : -1)
//     };
// }

// // --clr-primary の値を取得
// const clrPrimary = getComputedStyle(document.body).getPropertyValue('--clr-primary').trim();
// const clrfg = getComputedStyle(document.body).getPropertyValue('--clr-fg').trim();

// // 5つの白いボールを追加
// for (let i = 0; i < 5; i++) {
//     balls.push(createBall(canvas.width / 2, canvas.height / 2, clrfg));
// }

// // 1つの緑のボールを追加
// balls.push(createBall(canvas.width / 2, canvas.height / 2, clrPrimary));

const colors = [
    getComputedStyle(document.body).getPropertyValue('--clr-bg').trim(),
    getComputedStyle(document.body).getPropertyValue('--clr-bg-alt').trim(),
    getComputedStyle(document.body).getPropertyValue('--clr-fg').trim(),
    getComputedStyle(document.body).getPropertyValue('--clr-fg-alt').trim(),
    getComputedStyle(document.body).getPropertyValue('--clr-primary').trim()
];

function getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function createBall(x, y) {
    const size = getRandomValue(10, 30); // サイズは10から30の間でランダムに決定
    const color = getRandomColor(); // ランダムにカラーを取得
    const speedFactor = getRandomValue(0.5, 1.5); // 速度の変動範囲を設定（0.5xから1.5xの速度）

    return {
        x: x,
        y: y,
        radius: size,
        color: color,
        velocityX: 4 * speedFactor * (Math.random() < 0.5 ? 1 : -1), // ランダムに左右の方向を選択
        velocityY: 4 * speedFactor * (Math.random() < 0.5 ? 1 : -1)  // ランダムに上下の方向を選択
    };
}

const balls = [];

// 6つのボールを追加
for (let i = 0; i < 6; i++) {
    balls.push(createBall(canvas.width / 2, canvas.height / 2));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let ball of balls) {
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;

        // Bounce off the walls
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.velocityX = -ball.velocityX;
        }

        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
            ball.velocityY = -ball.velocityY;
        }

        // Bounce off the mouse cursor
        const distance = Math.sqrt((ball.x - mouseX) ** 2 + (ball.y - mouseY) ** 2);
        if (distance < ball.radius) {
            const angle = Math.atan2(ball.y - mouseY, ball.x - mouseX);
            ball.velocityX = 4 * Math.cos(angle);
            ball.velocityY = 4 * Math.sin(angle);
        }

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
    }

    requestAnimationFrame(animate);
}

animate();

canvas.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    for (let ball of balls) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    }
});
