const canvas = document.getElementById('ballCanvas');
const ctx = canvas.getContext('2d');

let mouseX = -100, mouseY = -100;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const balls = [];

function createBall(x, y, color) {
    return {
        x: x,
        y: y,
        radius: 30,
        color: color,
        velocityX: 4 * (Math.random() < 0.5 ? 1 : -1),
        velocityY: 4 * (Math.random() < 0.5 ? 1 : -1)
    };
}

// 5つの白いボールを追加
for (let i = 0; i < 5; i++) {
    balls.push(createBall(canvas.width / 2, canvas.height / 2, 'white'));
}

// 1つの緑のボールを追加
balls.push(createBall(canvas.width / 2, canvas.height / 2, 'green'));

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
