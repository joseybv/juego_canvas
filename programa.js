var x = 100;
var y = 100;
var context;

function anima(context) {
  if (!context.finJuego) {
    requestAnimationFrame(anima.bind(null, context));
    verifica(context);
    pinta(context);
    colisiones(context);
  }
}

function score(context) {
  context.ctx.save();
  context.ctx.fillStyle = "white";
  context.ctx.clearRect(0, 0, context.canvas.width, 40);
  context.font = "bold 20px Courier";
  context.ctx.fillText("SCORE: " + context.puntos, 10, 20);
}

function mensaje(context, cadena) {
  var lon = (context.canvas.width - 53 * cadena.length) / 2;
  context.ctx.fillStyle = "green";
  context.ctx.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.ctx.font = "bold 50px Rosewwod Std";
  context.ctx.fillText(cadena, lon, 220);
}

function colisiones(context) {
  for (var eIdx = 0; eIdx < context.enemigos_array.length; eIdx++) {
    for (var bIdx = 0; bIdx < context.balas_array.length; bIdx++) {
      enemigo = context.enemigos_array[eIdx];
      bala = context.balas_array[bIdx];
      if (enemigo && bala) {
        if (
          bala.x > enemigo.x &&
          bala.x < enemigo.x + enemigo.w &&
          bala.y > enemigo.y &&
          bala.y < enemigo.y + enemigo.w
        ) {
          enemigo.vive = false;
          context.enemigos_array.splice(eIdx, 1);
          delete enemigo;
          context.balas_array.splice(bIdx, 1);
          delete bala;
          context.puntos += 10;
          context.boing.play();
        }
      }
    }
  }

  for (var bIdx = 0; bIdx < context.balas_enemigos_array.length; bIdx++) {
    var bala = context.balas_enemigos_array[bIdx];
    if (bala) {
      if (
        bala.x > context.jugador.x &&
        bala.x < context.jugador.x + context.jugador.w &&
        bala.y > context.jugador.y &&
        bala.y < context.jugador.y + context.jugador.w
      ) {
        context.gameOver();
      }
    }
  }
}

function verifica(context) {
  if (context.tecla[KEY_RIGHT]) x += 10;
  if (context.tecla[KEY_LEFT]) x -= 10;

  if (context) {
    if (x > context.canvas.width - 10) x = context.canvas.width - 10;
  }
  if (x < 0) x = 0;

  if (context.tecla[BARRA]) {
    context.balas_array.push(
      new Bala(context.ctx, context.jugador.x + 12, context.jugador.y - 3, 5)
    );
    context.tecla[BARRA] = false;
    disparaEnemigo(context);
    context.disparo.play();
  }
}

function pinta(context) {
  context.numEnemigos = 0;
  context.ctx.clearRect(0, 0, context.canvas.width, context.canvas.height);
  score(context);
  context.jugador.dibuja(x);
  movimientoEnemigo(context);
  acabaJuegoSinEnemigos(context);
  disparosJugador(context);
  disparosEnemigo(context);
}

function movimientoEnemigo(context) {
  for (var idx = 0; idx < context.enemigos_array.length; idx++) {
    var enemigo = context.enemigos_array[idx];
    enemigo.dibuja();
    context.numEnemigos++; // TODO no tiene fin
    if (enemigo.y == context.jugador.y) {
      console.log("el jugador fue invadido");
      context.gameOver();
    }
  }
}

function acabaJuegoSinEnemigos(context) {
  if (context.numEnemigos == 0) {
    console.log("no quedan mas enemigos.");
    context.gameOver();
  }
}

function disparosJugador(context) {
  for (var idx = 0; idx < context.balas_array.length; idx++) {
    var bala = context.balas_array[idx];
    if (bala) {
      bala.dibuja();
      if (bala.y < 0) {
        context.balas_array.splice(idx, 1);
        delete bala;
      }
    }
  }
}

function disparosEnemigo(context) {
  for (var bIdx = 0; bIdx < context.balas_enemigos_array.length; bIdx++) {
    var bala = context.balas_enemigos_array[bIdx];
    if (bala) {
      bala.dispara();
      if (bala.y > context.canvas.height) {
        context.balas_enemigos_array.splice(bIdx, 1);
        delete bala;
      }
    }
  }
}

function disparaEnemigo(context) {
  //console.log("los invasores atacan");
  var ultimos = new Array();
  for (var idx = context.enemigos_array.length - 1; idx > 0; idx--) {
    if (context.enemigos_array[idx]) ultimos.push(idx);
    if (ultimos.length == 10) break;
  }
  var d = ultimos[Math.floor(Math.random() * 10)];
  var enemigo = context.enemigos_array[d];
  context.balas_enemigos_array.push(
    new Bala(context.ctx, enemigo.x, enemigo.y, enemigo.w / 2)
  );
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
  var canvas = document.getElementById("myCanvas");
  if (canvas && canvas.getContext("2d")) {
    var ctx = canvas.getContext("2d");
    console.log("width: " + canvas.width + ", height: " + canvas.height);
    if (ctx) {
      context = new Context(ctx, canvas);
      context.boing = document.getElementById("boing");
      context.disparo = document.getElementById("disparo");
      context.intro = document.getElementById("intro");
      context.fin = document.getElementById("fin");
      x = context.canvas.width / 2;

      var imagen = new Image();
      imagen.src = "imagenes/torre.fw.png";
      imagen.onload = function () {
        context.jugador = new Jugador(context.ctx, imagen, 0);
        context.jugador.dibuja(x);
        setTimeout(anima, 3500, context);
      };

      var imagenEnemigo = new Image();
      imagenEnemigo.src = "imagenes/invader.fw.png";
      imagenEnemigo.onload = function () {
        for (var col = 0; col < 5; col++) {
          for (var row = 0; row < 10; row++) {
            context.enemigos_array.push(
              new Enemigo(
                context.ctx,
                imagenEnemigo,
                100 + 40 * row,
                30 + 45 * col
              )
            );
          }
        }
        context.de = setInterval(disparaEnemigo, 3500, context);
      };

      document.addEventListener("keydown", function (e) {
        context.teclaPulsada = e.keyCode;
        context.tecla[e.keyCode] = true;
      });

      document.addEventListener("keyup", function (e) {
        context.tecla[e.keyCode] = false;
      });
      context.intro.play();
      mensaje(context, "INVASORES");
    } else {
      alert("Error al crear el contexto");
    }
  }
};
