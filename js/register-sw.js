// Chequeo si el browser puede usar Service Worker
/*if (navigator.serviceWorker.register("../service-worker.js")) {
    console.log("Service Worker está activo");
}else{
  console.log("Service Worker no está activo");
}
// Event Listener para Offline/ Online Status
window.addEventListener('offline', event => {
  document.querySelector('body').classList.add('offline');

});

window.addEventListener('online', event => {
  document.querySelector('body').classList.remove('offline');
});

// A veces este evento falla, ojo!
// Sirve para saber si el navegador esta offline, cuando entramos offline. 
// Es decir, no se disparo los eventos de arriba aun, y necesito conocer el estado.
// 
consulta(datos);

if (!navigator.onLine) {
  document.querySelector('body').classList.add('offline');
}
*/

// Chequeo si el browser puede usar Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../service-worker.js')
      .then(reg => {
        console.log("Service worker esta listo!");
      });
}
else {
  console.log("Service worker no soportado.");
}

// Event Listener para Offline/ Online Status
window.addEventListener('offline', event => {
  document.querySelector('body').classList.add('offline');
  main.innerHTML = "No se puede obtener la información! La aplicacion esta offline!"
});

window.addEventListener('online', event => {
  document.querySelector('body').classList.remove('offline');
  datos();
});

if (!navigator.onLine) {
  document.querySelector('body').classList.add('offline');
  main.innerHTML = "No se puede obtener la información! La aplicacion esta offline!"
}