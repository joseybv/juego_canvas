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

function Bala(x, y, w) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.dibuja = function () {};
}

function Jugador(x) {
  this.x = x;
  this.y = 450;
  this.dibuja = function (imagen, x) {
    this.x = x;
    ctx.drawImage(imagen, this.x, this.y, 30, 15);
  };
}

function Enemigo(x, y) {
  (this.x = x), (this.y.y = y);
  this.w = 35;
  this.veces = 0;
  this.dx = 5;
  this.ciclos = 0;
  this.num = 14;
  this.figura = true;
  this.vive = true;
  this.dibuja = function () {};
}
