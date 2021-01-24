document.addEventListener("keydown", function (e) {
  teclaPulsada = e.keyCode;
  tecla[e.keyCode] = true;
});

document.addEventListener("keyup", function (e) {
  tecla[e.keyCode] = false;
});
