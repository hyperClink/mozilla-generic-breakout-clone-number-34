//define everything
var canvas = document.getElementById('canvas'),
ctx = canvas.getContext("2d");

//controls
var right = false,
left = false;

//define what is ball
var x = canvas.width/2,
y = canvas.height/2,
dx = -2,
dx_mod = 1,
dy = -2,
ballRadius = 10;

//all that is the paddle
var paddleHeight = 10,
paddleWidth = 75,
paddleX = (canvas.width-paddleWidth) / 2;

//brick moment
var brickRowCount = 2,
brickColumnCount = 3,
brickPadding = 10,
brickOffsetTop = 30,
brickOffsetLeft = 30,
brickHeight = 20,
brickWidth = (canvas.width-brickPadding*brickColumnCount-brickOffsetLeft)/brickColumnCount;

var brickCount = brickRowCount * brickColumnCount;
var bricks = [];
for (var i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  for (var c = 0; c < brickRowCount; c++) {
    bricks[i][c] = {x: 0, y: 0, status: 1};
  };
};

//game elements
var score = 0,
scoreLevel = 0,
lives = 3;

//controls 2
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    right = true;
  };

  if (e.key == "Left" || e.key == "ArrowLeft") {
    left = true;
  };
};

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    right = false;
  };

  if (e.key == "Left" || e.key == "ArrowLeft") {
    left = false;
  };
};

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  };
};

//mechanics 0.5
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#00AAD0";
  ctx.fillText(`Score: ${score}`, 8, 20);
};

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#00AAD0";
  ctx.fillText(`Lives: ${lives}`, canvas.width-65, 20);
};

//mechanics
function rebound() {
  if(y + dy - ballRadius < 0) {
    dy = -dy;
  };

  if (y + dy + ballRadius > canvas.height-paddleHeight && x+ballRadius > paddleX && x < paddleX + paddleWidth+ballRadius) {
    dy = -Math.abs(dy);
    dx = (paddleX + paddleWidth/2 - x) / -10 / dx_mod;
  } else

    if (y + dy + ballRadius > canvas.height) {
      lives--;
      if(!lives) {
        alert("oof");
        document.location.reload();
      }
      else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 2;
        dy = -Math.abs(dy);
        paddleX = (canvas.width-paddleWidth)/2;
      };
    };

  if(x + dx - ballRadius < 0 || x + dx + ballRadius > canvas.width) {
      dx = -dx;
  };
};

function paddleControl() {
  if(right) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    };
  };
  if(left) {
    paddleX -= 7;
    if (paddleX < 0){
        paddleX = 0;
    };
  };
};

function collisionDetection() {
  for (var i = 0; i < brickColumnCount; i++) {
    for (var c = 0; c < brickRowCount; c++) {
      var b = bricks[i][c];
      if (b.status == 1){
        if (x+ballRadius > b.x && x < b.x+brickWidth+ballRadius && y+ballRadius > b.y && y < b.y+brickHeight+ballRadius) {
          dy = -dy;
          b.status = 0;
          score++;
          scoreLevel++;
          if(scoreLevel == brickCount) {
            alert(
`lever complete
your'e points: ${score}.`);
            nextLevel();
          };
        };
      };
    };
  };

};

function nextLevel() {
  brickCount = 0;
  scoreLevel = 0;
  x = canvas.width/2;
  y = canvas.height-30;
  dx = 2;
  dy = Math.abs(dy)+(1.5/Math.abs(dy));
  paddleX = (canvas.width-paddleWidth)/2
  lives+=2;
  brickRowCount+= Math.round(Math.random()*2);
  brickColumnCount+= Math.round(Math.random()*3);
  brickPadding = Math.max(brickPadding-1, 1);
  brickOffsetLeft = Math.max(brickOffsetLeft-1, 0);
  brickWidth = (canvas.width-brickPadding*brickColumnCount-brickOffsetLeft)/brickColumnCount;
  brickHeight =  Math.min( Math.max((canvas.height/2-brickPadding-brickOffsetTop)/brickRowCount, 5), 20);
  for (var i = 0; i < brickColumnCount; i++) {
    bricks[i] = [];
    for (var c = 0; c < brickRowCount; c++) {
      bricks[i][c] = {x: 0, y: 0, status: Math.round(Math.random()+0.1)};
      if (bricks[i][c].status) {
        brickCount++;
      };
    };
  };
};

//drawing
function drawBricks() {
  for (var i = 0; i < brickColumnCount; i++) {
    for (var c = 0; c < brickRowCount; c++) {
      if(bricks[i][c].status == 1) {
        var brickX = (i*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[i][c].x = brickX;
        bricks[i][c].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#00A9BB";
        ctx.fill();
        ctx.closePath();
      };
    };
  };
};

function drawTrail() {
  var trailColor = (Math.min(Math.floor(Math.abs(dx)*50), 255)).toString(16).padStart(2,"0");
  ctx.fillStyle = "#"+trailColor+"BBAA";

  ctx.beginPath();
  if ((dx > 0 && dy > 0) || (dx < 0 && dy < 0)) {
    var sign = -1;
  }
  else {
    var sign = 1;
  };
  ctx.moveTo(Math.cos(sign*45)*10+x, Math.sin(sign*45)*10+y);
  ctx.quadraticCurveTo(x-(20*dx), y-(20*dy), Math.cos(sign*180)*10+x, Math.sin(sign*180)*10+y);
  ctx.fill();
  ctx.closePath();
};

function drawBall() {
  drawTrail();
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
};

function drawPaddle() {
  paddleControl();
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  rebound();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  x += dx;
  y += dy;
  requestAnimationFrame(draw);
};

draw();
