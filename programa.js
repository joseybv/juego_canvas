let x = 100;
const y = 100;
let context;

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
  const lon = (context.canvas.width - 53 * cadena.length) / 2;
  context.ctx.fillStyle = "green";
  context.ctx.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.ctx.font = "bold 50px Rosewwod Std";
  context.ctx.fillText(cadena, lon, 220);
}

function colisiones(context) {
  for (let eIdx = 0; eIdx < context.enemigos_array.length; eIdx++) {
    for (let bIdx = 0; bIdx < context.balas_array.length; bIdx++) {
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

  for (let bIdx = 0; bIdx < context.balas_enemigos_array.length; bIdx++) {
    let bala = context.balas_enemigos_array[bIdx];
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
  for (let idx = 0; idx < context.enemigos_array.length; idx++) {
    let enemigo = context.enemigos_array[idx];
    enemigo.dibuja();
    context.numEnemigos++; // TODO no tiene fin
    if (enemigo.y === context.jugador.y) {
      console.log("el jugador fue invadido");
      context.gameOver();
    }
  }
}

function acabaJuegoSinEnemigos(context) {
  if (context.numEnemigos === 0) {
    console.log("no quedan mas enemigos.");
    context.gameOver();
  }
}

function disparosJugador(context) {
  for (let idx = 0; idx < context.balas_array.length; idx++) {
    let bala = context.balas_array[idx];
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
  let ultimos = [];
  for (let idx = context.enemigos_array.length - 1; idx > 0; idx--) {
    if (context.enemigos_array[idx]) ultimos.push(idx);
    if (ultimos.length === 10) break;
  }
  let d = ultimos[Math.floor(Math.random() * 10)];
  let enemigo = context.enemigos_array[d];
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
  let canvas = document.getElementById("myCanvas");
  if (canvas && canvas.getContext("2d")) {
    let ctx = canvas.getContext("2d");
    console.log("width: " + canvas.width + ", height: " + canvas.height);
    if (ctx) {
      context = new Context(ctx, canvas);
      context.boing = document.getElementById("boing");
      context.disparo = document.getElementById("disparo");
      context.intro = document.getElementById("intro");
      context.fin = document.getElementById("fin");
      x = context.canvas.width / 2;

      let imagen = new Image();
      imagen.src = "imagenes/torre.fw.png";
      imagen.onload = function () {
        context.jugador = new Jugador(context.ctx, imagen, 0);
        context.jugador.dibuja(x);
        setTimeout(anima, 3500, context);
      };

      let imagenEnemigo = new Image();
      imagenEnemigo.src = "imagenes/invader.fw.png";
      imagenEnemigo.onload = function () {
        for (let col = 0; col < 5; col++) {
          for (let row = 0; row < 10; row++) {
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

      let jugadorRobot = new Image();
      jugadorRobot.src = "imagenes/robot_jugador.png";
      jugadorRobot.onload = function () {
        context.jugadorRobot = new AnimarImagen(context, jugadorRobot);
        context.jugadorRobot.step();
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

function AnimarImagen(context, body) {
  this.scale = 2;
  this.width = 16;
  this.height = 18;
  this.scaledWidth = this.scale * this.width;
  this.scaledHeight = this.scale * this.height;
  this.cycleLoop = [0, 1, 0, 2];
  this.currentLoopIndex = 0;
  this.frameCount = 0;
  this.currentDirection = 0;
  this.context = context;
  this.img = body;

  this.step = function () {
    if (!this.context) return;
    this.frameCount++;
    if (this.frameCount < 15) {
      window.requestAnimationFrame(this.step);
      return;
    }
    this.frameCount = 0;
    this.context.ctx.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
    this.context.drawFrame(
      this.cycleLoop[this.currentLoopIndex],
      this.currentDirection,
      15,
      15
    );
    this.currentLoopIndex++;
    if (this.currentLoopIndex >= this.cycleLoop.length) {
      this.currentLoopIndex = 0;
      this.currentDirection++;
    }
    // Reset to the "down" direction once we've run through them all
    if (this.currentDirection >= 4) {
      this.currentDirection = 0;
    }
    window.requestAnimationFrame(this.step);
  };

  this.drawFrame = function (frameX, frameY, canvasX, canvasY) {
    if (!this.context) return;
    this.context.ctx.drawImage(
      this.img,
      frameX * this.width,
      frameY * this.height,
      this.width,
      this.height,
      canvasX,
      canvasY,
      this.scaledWidth,
      this.scaledHeight
    );
  };

  this.init = function () {
    this.drawFrame(0, 0, 0, 0);
    this.drawFrame(1, 0, this.scaledWidth, 0);
    this.drawFrame(0, 0, this.scaledWidth * 2, 0);
    this.drawFrame(2, 0, this.scaledWidth * 3, 0);
  };
}
