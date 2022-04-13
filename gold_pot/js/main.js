function refreshPage() {
    window.location.reload();
}

function drawIt() {
	var WIDTH;
    var HEIGHT;
    var x = 150;
    var y = 150;
    var dx = 2;
    var dy = 2;
    var r = 10;
    var ctx;
    var paddlex;
    var paddleh;
    var paddlew;
    var rightDown = false;
    var leftDown = false;
    var bricks;
    var NROWS;
    var NCOLS;
    var BRICKWIDTH;
    var BRICKHEIGHT;
    var PADDING;
    var tocke;
    var score;
    var canvasMinX;
    var canvasMaxX;
    var colors = ["yellow", "green"];
    var start = true;
    var temp;
    var gover = true;
    var gameWin = false;

    function ball() {
        ctx = $('#canvas')[0].getContext("2d");
        WIDTH = $("#canvas").width();
        HEIGHT = $("#canvas").height();
        score = setInterval(draw, 10);
        tocke = 0;
        $("#tocke").html(tocke);
    }

    function circle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    function rect(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    }

    function clear() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    function draw() {
        clear();
        circle(x, y, 10);
        if (rightDown) {
            if ((paddlex + paddlew) < WIDTH) {
                paddlex += 7;
            } else {
                paddlex = WIDTH - paddlew;
            }
        } else if (leftDown) {
            if (paddlex > 0) {
                paddlex -= 5;
            } else {
                paddlex = 0;
            }
        }
        rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
        for (i = 0; i < NROWS; i++) {
            if (i == 0) ctx.fillStyle = "yellow";
            for (j = 0; j < NCOLS; j++) {
                if (bricks[i][j] == 1) {
                    rect((j * (BRICKWIDTH + PADDING)) + PADDING,
                        (i * (BRICKHEIGHT + PADDING)) + PADDING,
                        BRICKWIDTH, BRICKHEIGHT);
                }
            }
        }
        rowheight = BRICKHEIGHT + PADDING + r / 2;
        colwidth = BRICKWIDTH + PADDING + r / 2;
        row = Math.floor(y / rowheight);
        col = Math.floor(x / colwidth);
        if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
            dy = -dy;
            bricks[row][col] = 0;
            tocke += 1;
            $("#tocke").html(tocke);
        }
        if (x + dx > WIDTH - r || x + dx < r)
            dx = -dx;

        if (y + dy < r)
            dy = -dy;
        else if (y + dy > HEIGHT - r) {
            if (x > paddlex && x < paddlex + paddlew) {
                dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
                dy = -dy;
            } else {
                start = false;
                gover = false;
            }
        }
        x += dx;
        y += dy;
        if (tocke == 16) {
            gamewon();
            if (spc == 1) {
                snd3.play();
                spc++;
            }
        }
        if (start == false) {
            gameover();
            $(document).off("keydown");
            $(document).off("keyup");
            $(document).off("keypress");
            $(document).off("mousemove");
            $(document).off("click");
            dx = 0;
            dy = 0;
        }
    }

    function gameover() {
        clear();
        ctx.fillStyle = "green";
        ctx.font = "60px sans-serif";
        ctx.fillText("You lose!", WIDTH / 2 - 120, HEIGHT / 2);
        start = true;
    }

    function gamewon() {
        clear();
        ctx.fillStyle = "green";
        ctx.font = "72px sans-serif";
        ctx.fillText("You Won!", WIDTH / 2 - 155, HEIGHT / 2);
        ctx.font = "36px sans-serif";
        ctx.fillText("Score: " + tocke, WIDTH / 2 - 80, HEIGHT / 2 + 100);
        start = true;
        dx = 0;
        dy = 0;
        paddlex = -100;
        paddlew = 0;
        paddleh = 0;
    }

    function init_paddle() {
        paddlex = WIDTH / 2;
        paddleh = 10;
        paddlew = 75; //dolzina in visina glavne palce
    }

    function onKeyDown(evt) {
        if (evt.keyCode == 39)
            rightDown = true;
        else if (evt.keyCode == 37) leftDown = true;
    }

    function onKeyUp(evt) {
        if (evt.keyCode == 39)
            rightDown = false;
        else if (evt.keyCode == 37) leftDown = false;
    }
    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);

    function initbricks() { //dolzina in visina stranskih palc
        NROWS = 4; 
        NCOLS = 4;
        BRICKWIDTH = (WIDTH / NCOLS) - 1;
        BRICKHEIGHT = 15;
        PADDING = 3.2;
        bricks = new Array(NROWS);
        for (i = 0; i < NROWS; i++) {
            bricks[i] = new Array(NCOLS);
            for (j = 0; j < NCOLS; j++) {
                bricks[i][j] = 1;
            }
        }
    }

    function mouse() {
        canvasMinX = $("canvas").offset().left;
        canvasMaxX = canvasMinX + WIDTH;
    }

    function onMouseMove(evt) {
        if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
            paddlex = evt.pageX - canvasMinX;
        }
    }
    $(document).mousemove(onMouseMove);

    ball();
    init_paddle();
    initbricks();
    mouse();

}