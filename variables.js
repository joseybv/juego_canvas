var KEY_ENTER = 13;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var BARRA = 32;

var colorBala = "red";

function Context(ctx, canvas) {
  this.canvas = canvas;
  this.ctx = ctx;
  this.finJuego = false;
  this.teclaPulsada = null;
  this.tecla = [];
  this.puntos = 0;
  this.numEnemigos = 0;
  this.jugador = {};
  this.enemigos_array = new Array();
  this.balas_enemigos_array = new Array();
  this.balas_array = new Array();
  this.de = {};
  this.gameOver = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.balas_array = [];
    this.enemigos_array = [];
    this.balas_enemigos_array = [];
    clearTimeout(this.de);
    this.finJuego = true;
    mensaje(this, "GAME OVER");
    this.fin.play();
  };
}

function Bala(parent, x, y, w) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.ctx = parent;
  this.dibuja = function () {
    this.ctx.save();
    this.ctx.fillStyle = colorBala;
    this.ctx.fillRect(this.x, this.y, this.w, this.w);
    this.y = this.y - 4;
    this.ctx.restore();
  };
  this.dispara = function () {
    this.ctx.save();
    this.ctx.fillStyle = colorBala;
    this.ctx.fillRect(this.x, this.y, this.w, this.w);
    this.y = this.y + 6;
    this.ctx.restore();
  };
}

function Jugador(parent, body, initialPosition) {
  this.x = initialPosition;
  this.body = body;
  this.y = 450;
  this.w = 30;
  this.h = 15;
  this.ctx = parent;
  this.dibuja = function (x) {
    this.x = x;
    this.ctx.drawImage(this.body, this.x, this.y, this.w, this.h);
  };
}

function Enemigo(parent, body, x, y) {
  this.x = x;
  this.y = y;
  this.w = 35;
  this.veces = 0;
  this.dx = 5;
  this.ciclos = 0;
  this.num = 14;
  this.figura = true;
  this.vive = true;
  this.ctx = parent;
  this.body = body;
  this.vive = true;
  this.figura = true;
  this.numEnemigos = 0;
  this.aunVive = function () {
    if (this.vive) {
      if (this.figura) {
        this.ctx.drawImage(this.body, 0, 0, 40, 30, this.x, this.y, 35, 30);
      } else {
        this.ctx.drawImage(this.body, 50, 0, 35, 30, this.x, this.y, 35, 30);
      }
    } else {
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(this.x, this.y, 35, 30);
    }
  };
  this.dibuja = function () {
    if (this.ciclos > 30) {
      if (this.veces > this.num) {
        this.dx *= -1;
        this.veces = 0;
        this.num = 28;
        this.y += 20;
        this.dx = this.dx > 0 ? this.dx++ : this.dx--;
      } else {
        this.x += this.dx;
      }
      this.veces++;
      this.ciclos = 0;
      this.figura = !this.figura;
    } else {
      this.ciclos++;
    }
    this.aunVive();
  };
}
