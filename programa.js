var canvas;
var ctx;
var x = 0;
var y = 0;
var context;

function anima() {
  requestAnimationFrame(anima);
  verifica(context);
  pinta(context);
}

function verifica(context) {
  if (x > context.canvas.width - 10) x = context.canvas.width - 10;
  if (x < 0) x = 0;
  if (tecla[KEY_RIGHT]) x += 10;
  if (tecla[KEY_LEFT]) x -= 10;
  if (tecla[BARRA]) {
    balas_array.push(new Bala(ctx, jugador.x + 12, jugador.y - 3, 5));
    tecla[BARRA] = false;
  }
}

function pinta(context) {
  context.ctx.clearRect(0, 0, context.canvas.width, context.canvas.height);
  if (jugador) jugador.dibuja(x);

  for (var idx = 0; idx < balas_array.length; idx++) {
    var bala = balas_array[idx];
    if (bala != null) {
      bala.dibuja();
      if (bala.y < 0) {
        balas_array.splice(idx, 1);
        delete bala;
      }
    }

    for (var idx = 0; idx < enemigos_array.length; idx++) {
      enemigos_array[idx].dibuja();
    }
  }
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
    console.log("width: " + canvas.width + ", height: " + canvas.height);
    if (ctx) {
      context = new Context(ctx, canvas);
      x = context.canvas.width / 2;

      imagen = new Image();
      imagen.src = "imagenes/torre.fw.png";
      imagen.onload = function () {
        jugador = new Jugador(context.ctx, imagen, 0);
        jugador.dibuja(x);
      };

      imagenEnemigo = new Image();
      imagenEnemigo.src = "imagenes/invader.fw.png";
      imagenEnemigo.onload = function () {
        for (var col = 0; col < 5; col++) {
          for (var row = 0; row < 10; row++) {
            enemigos_array.push(
              new Enemigo(
                context.ctx,
                imagenEnemigo,
                100 + 40 * row,
                30 + 45 * col
              )
            );
          }
        }
      };

      anima();
    } else {
      alert("Error al crear el contexto");
    }
  }
};
