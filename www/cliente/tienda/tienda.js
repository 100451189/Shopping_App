function cargar(categoria){ // Funcion que carga toda la listas de productos
  fetch('/catalogo')
  .then(response => response.json()) // Convertir la respuesta del servidor a JSON
  .then(data => {
    // Manejar la respuesta y mostrar la lista de productos en la página
    let productos = [];
    data.forEach(producto => {
      productos.push(producto)
    }
  );

  if (categoria != 0){
    for (let i = 0; i < productos.length; i++){
      if (productos[i].categoria != categoria){
        productos.splice(i,1); // Se saca de la lista si no es la categoria buscada
        i--;
      }
    }
  }

  generarProductos(productos);

  })
  .catch(error => {
    console.error('Hubo un error al obtener la lista de prodcutos:', error); 
  });
}

cargar(0); // Por defecto se carga la lista de productos sin filtro


function generarProductos(productos){  // Funcion que genera la lista de productos
      const listaProductos = document.getElementById('container-catalogo');
      listaProductos.innerHTML = ""; // Vaciar el div con la lista de los productos

      productos.forEach(producto => {
        let itemProducto = document.createElement('div');
      itemProducto.className = 'producto';

      let itemNombreProducto = document.createElement('div'); 
      itemNombreProducto.className = 'nombre-producto';
      itemNombreProducto.innerText = producto.nombre;

      let itemInfoProducto = document.createElement('div'); 
      itemInfoProducto.className = 'producto-info';

      let itemImagenProducto = document.createElement('img'); 
      itemImagenProducto.className = 'imagen-producto';
      itemImagenProducto.src = producto.imagen;
      itemImagenProducto.alt = 'libro-' + producto.nombre;


      let itemResumenProducto = document.createElement('div'); 
      itemResumenProducto.className = 'resumen-producto';
      itemResumenProducto.innerText = producto.resumen;

      let itemPrecioProducto = document.createElement('div'); 
      itemPrecioProducto.className = 'precio-producto';
      itemPrecioProducto.innerText = producto.precio.toString() + "€";

      let itemBotonProducto = document.createElement('button');
      itemBotonProducto.className = 'botones';
      itemBotonProducto.innerText = 'ver';
      itemBotonProducto.onclick = function(){
        abrirProducto(producto.id);
      }

      itemInfoProducto.appendChild(itemImagenProducto);
      

      itemInfoProducto.appendChild(itemResumenProducto);
      itemInfoProducto.appendChild(itemPrecioProducto);
      itemInfoProducto.appendChild(itemBotonProducto);

      itemProducto.appendChild(itemNombreProducto);
      itemProducto.appendChild(itemInfoProducto);

      listaProductos.appendChild(itemProducto);
      });  
}

function obtenerProductosDesdeHTML() { // A partir de los productos cargados, devuelve la lista de objetos producto
  const listaProductos = [];
  const contenedorCatalogo = document.getElementById('container-catalogo');
  const productosHTML = contenedorCatalogo.getElementsByClassName('producto');

  for (let i = 0; i < productosHTML.length; i++) {
      const productoHTML = productosHTML[i];
      const nombre = productoHTML.querySelector('.nombre-producto').innerText;
      const imagen = productoHTML.querySelector('.imagen-producto').src;
      const resumen = productoHTML.querySelector('.resumen-producto').innerText;
      const precioString = productoHTML.querySelector('.precio-producto').innerText;
      // Eliminar el símbolo de euro y convertir a número
      const precio = parseFloat(precioString.replace('€', ''));

      const producto = {
          id: nombre,
          nombre: nombre,
          imagen: imagen,
          resumen: resumen,
          precio: precio
      };

      listaProductos.push(producto);
  }

  return listaProductos;
}



// Funcion para filtrar los productos
function filtar(filtro){
  // Primero se obtienen los productos que estan cargados en la lista actualmente
  let productos = obtenerProductosDesdeHTML();
  

  //A continuacion, se evaluan los posibles filtros
  //Orden por filtro alfabetico
  if (filtro == 1){ 
    productos.sort((a, b) => {
      const nombreA = a.nombre.toUpperCase(); //Convertir nombres a mayúsculas para ignorar mayúsculas/minúsculas
      const nombreB = b.nombre.toUpperCase();
  
      if (nombreA < nombreB) {
          return -1; //Si el nombre de 'a' es menor que el nombre de 'b', devuelve un número negativo
      }
      if (nombreA > nombreB) {
          return 1; //Si el nombre de 'a' es mayor que el nombre de 'b', devuelve un número positivo
      }
      return 0; //Si los nombres son iguales, devuelve 0
  });
  }
  //Orden por filtro de precio ascendente
  if (filtro == 2){ 
    productos.sort((a, b) => a.precio - b.precio);
  }
  //Orden por filtro de precio descendente
  if (filtro == 3){ 
    productos.sort((a, b) => b.precio - a.precio);
  }
  //Se vuelven a mostrar la listas con los filtros aplicados
  generarProductos(productos);
}

// Se obtienen los botones filtros y categorias
let btnFilters = document.getElementById('btn_filtros');
let btn_categoria = document.getElementById("btn_categoria");

// Se obtienen los modales
let modal = document.getElementById("modal_filtros");

btnFilters.onclick = function() { // Click modal filtros
modal.style.display = "block";
}

let modal_filtros_categoria = document.getElementById("modal_filtros_categoria");

btn_categoria.onclick = function() { // Click modal categorias
modal.style.display = "none";
modal_filtros_categoria.style.display = 'block';

}

// Control botones filtros
let btn_Nombre = document.getElementById("btn_Nombre");

btn_Nombre.onclick = function() {
modal.style.display = 'none';
filtar(1);
}

let btn_Precio_asc = document.getElementById("btn_Precio_asc");

btn_Precio_asc.onclick = function() {
modal.style.display = 'none';
filtar(2);
}
let btn_Precio_desc = document.getElementById("btn_Precio_desc");

btn_Precio_desc.onclick = function() {
modal.style.display = 'none';
filtar(3);
}

// Control botones categorias
let btn_Ropa = document.getElementById("btn_Ropa");

btn_Ropa.onclick = function() {
modal_filtros_categoria.style.display = 'none';
cargar("Ropa");
}

let btn_Tecnologia = document.getElementById("btn_Tecnologia");

btn_Tecnologia.onclick = function() {
modal_filtros_categoria.style.display = 'none';
cargar("Tecnología");
}
let btn_Libros = document.getElementById("btn_Libros");

btn_Libros.onclick = function() {
modal_filtros_categoria.style.display = 'none';
cargar("Libros");
}

let btn_Alimentacion = document.getElementById("btn_Alimentacion");

btn_Alimentacion.onclick = function() {
modal_filtros_categoria.style.display = 'none';
cargar("Alimentación");
}

//Funcion definida para cerrar el modal de filtros
function cerrarModal(){
modal.style.display = "none";
modal_filtros_categoria.style.display = "none";
}

//Se evaluan los clicks del usuario fuera del modal de filtros, lo que conduce a su cierre
window.addEventListener("click", function(event){
if (event.target === modal && event.target !== btnFilters || 
  event.target === modal_filtros_categoria && event.target !== btnFilters){
  cerrarModal();
}
});

// BUSQUEDA POR ID o NOMBRE

function buscarProducto(busqueda) {

// Hacer la petición GET al servidor
fetch(`/buscar/${busqueda}`)
    .then(response => {
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Error al buscar el producto');
        }
        // Convertir la respuesta a JSON
        return response.json();
    })
    .then(productos => {
        // Producto encontrado
        generarProductos(productos)
        
    })
    .catch(error => {
        // Error
        console.error('Error al buscar producto', error);
        
    });
}

// Se obtiene el boton buscar y la barra de busqueda

let btn_buscar = document.getElementById("btn_buscar");

const barra = document.getElementById("searchInput");

//Se evalua el caso de que se presione el boton de busqueda para encontrar lo introducido por el usuario
btn_buscar.onclick = function(){
let input = barra.value;
if (input == ''){ // Barra vacia, se carga todo como si se hubiera abierto la pagina de nuevo
  cargar(0);
}
else{
  buscarProducto(input)
}
}

function abrirEscaner(){
window.location.href = "escaner/escaner.html";
}

function cerrarFiltros(){
document.querySelector(".modal").style.display = "none";
}


// Boton carrito
let carrito = document.getElementById("shopping-cart");
carrito.onclick = function (){
window.location.href = "carrito/carrito.html";
}

function abrirProducto(productoID){
window.location.href = 'producto/info_producto.html?producto=' + productoID; // Se envia el ID prodcuto en la url

}

function mostrar_popup(mensaje) {
  document.getElementById('contenido-popup').innerHTML = mensaje;
  const ancho_mensaje = document.getElementById('contenido-popup').offsetWidth;
  document.getElementById('popup').width = ancho_mensaje + 'px';
  // Muestra el popup
  document.getElementById('popup').style.display = 'block';
  // Oculta el popup despues de 2 segundos
  setTimeout(() => document.getElementById('popup').style.display = 'none', 1250);
}

document.addEventListener('DOMContentLoaded', function() {
const inicio_exitoso = localStorage.getItem('inicio_exitoso');
if (inicio_exitoso === 'true') {
    // Muestra el popup en tienda.html
    mostrar_popup('Inicio de sesion exitoso');
    // Limpia el valor en localStorage para que el popup no se muestre nuevamente
    localStorage.removeItem('inicio_exitoso');
}
});


//GESTION DE RECONOCIMIENTO DE VOZ - SPEECH API

const btn_activar = document.getElementById("microfono_activar");
const btn_desactivar = document.getElementById("microfono_desactivar");
const reconocimiento = new webkitSpeechRecognition();

reconocimiento.continuous = true; //Permite que se reconozca constantemente el audio recibido a traves del sistema
reconocimiento.lang = "es-ES"; //Se indica el idioma que se va a emplear, español en este caso
reconocimiento.interimResult = false; //Se evita que devuelva frases que no estan acabadas

btn_activar.addEventListener("click", () => {
//Cuando se detecta una pulsacion sobre el boton de activacion, comienza a reconocer
reconocimiento.start();
});

btn_desactivar.addEventListener("click", () => {
//Cuando se detecta una pulsacion sobre el boton de desactivacion, deja de reconocer audio
reconocimiento.abort();
});

//Operacion necesaria para ir extrayendo el texto reconocido y asi emplearlo para incluirlo luego en el cuadro del buscador
reconocimiento.onresult = (event) => {
//Se accede a la ultima posicion del array results, ahi tenemos un array donde en la posicion 0 tenemos el transcript que incluye el texto recibido
const texto = event.results[event.results.length - 1][0].transcript;
//Se guarda en una variable el valor del texto recibido
let texto_anterior = barra.value;
//Se realiza una comprobacion de si se ha dicho la palabra "buscar" para realizar la busqueda a traves de voz
if (texto.toLowerCase().includes("buscar")){
  //En caso de detectarse la palabra "buscar", se simula la pulsacion del boton Buscar
  btn_buscar.click();
}
else if (texto.toLowerCase().includes("volver")){
  //En caso de detectarse la palabra "volver", se borra el contenido de la caja y se vuelve al inicio
  barra.value = "";
  btn_buscar.click();
}
else if (texto.toLowerCase().includes("detener")){
  //En caso de detectarse la palabra "detener", se frena la deteccion de voz sin necesidad de pulsar su respectivo boton
  reconocimiento.abort();
}
//En caso de no haber dicho buscar, se incluye el texto en la barra
else{
  //Se incluye un trim para evitar posibles espaciados que se han visto que pueden aparecer
  const texto_sin_espacios = texto.trim();
  barra.value = texto_sin_espacios;
}
}