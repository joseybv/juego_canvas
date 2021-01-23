var canvas;
var ctx;
var x = 0;
var y = 0;

function anima() {
  requestAnimationFrame(anima);
  verifica();
  pinta();
}

function verifica() {
  if (x > canvas.width) x = 0;
  if (x < 0) x = 0;
  if (tecla[KEY_RIGHT]) x += 10;
  if (tecla[KEY_LEFT]) x -= 10;
}

function pinta() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  jugador.dibuja(imagen, x);
}

window.requestAnimationFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 17);
    }
  );
})();

window.onload = function () {
  canvas = document.getElementById("myCanvas");
  if (canvas && canvas.getContext("2d")) {
    ctx = canvas.getContext("2d");
    console.log('width: ' + canvas.width +', height: ' + canvas.height);
    if (ctx) {
      x = canvas.width / 2;
      imagen = new Image();
      imagen.src = "imagenes/torre.fw.png";
      imagen.onload = function() {
          jugador = new Jugador(0);
          jugador.dibuja(imagen, x);
          anima();
      }
    } else {
      alert("Error al crear el contexto");
    }
  }
};
