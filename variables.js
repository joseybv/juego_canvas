var KEY_ENTER = 13;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var BARRA = 32;
var imagen;
var imagenEnemigo;
var jugador;

var teclaPulsada = null;
var tecla = [];
var colorBala = "red";
var balas_array = new Array();
var enemigos_array = new Array();

function Context(ctx, canvas) {
  this.canvas = canvas;
  this.ctx = ctx;
  this.teclaPulsada = null;
  this.tecla = [];
  this.keyUp = function (e) {};
  this.keyDown = function (e) {};
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
}

function Jugador(parent, body, initialPosition) {
  this.x = initialPosition;
  this.body = body;
  this.y = 450;
  this.ctx = parent;
  this.dibuja = function (x) {
    this.x = x;
    this.ctx.drawImage(this.body, this.x, this.y, 30, 15);
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
    } else {
      this.ciclos++;
    }
    this.ctx.drawImage(this.body, 0, 0, 40, 30, this.x, this.y, 35, 30);
  };
}
