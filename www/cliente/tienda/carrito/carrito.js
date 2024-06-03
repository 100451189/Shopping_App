// De sessionstorage cogemos el usuario que ha iniciado sesion
let usuario = sessionStorage.getItem('usuario');

function generarProductos(producto){  // Funcion que genera la lista de productos
    const listaProductos = document.getElementById('container-carrito');
    let usuario = sessionStorage.getItem('usuario');

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
    // Los productos se pueden eliminar deslizando la foto
    itemImagenProducto.addEventListener('touchstart', function(evento) {
        eliminar_deslizando(producto.id, usuario, itemImagenProducto, evento);
    });

    let itemResumenProducto = document.createElement('div'); 
    itemResumenProducto.className = 'resumen-producto';
    itemResumenProducto.innerText = producto.resumen;

    let itemPrecioProducto = document.createElement('div'); 
    itemPrecioProducto.className = 'precio-producto';
    itemPrecioProducto.innerText = producto.precio.toString() + "€";

    let itemBotonProducto = document.createElement('button');
    itemBotonProducto.className = 'botones';
    itemBotonProducto.innerText = 'eliminar';
    itemBotonProducto.onclick = function (){
      borrarProducto(producto.id, usuario)
    }

    itemInfoProducto.appendChild(itemImagenProducto);

    itemInfoProducto.appendChild(itemResumenProducto);
    itemInfoProducto.appendChild(itemPrecioProducto);
    itemInfoProducto.appendChild(itemBotonProducto);

    itemProducto.appendChild(itemNombreProducto);
    itemProducto.appendChild(itemInfoProducto);

    listaProductos.appendChild(itemProducto);

    //Se ejecuta al mantener el dedo en un producto más de dos segundos. Como resultado, se marcará la tarea como favorita
    itemProducto.addEventListener("touchstart", function(event) {
        favoritoTimeout = setTimeout(marcarComoFavorito, 2000, producto.id, usuario, itemProducto);
    });

    itemProducto.addEventListener("touchend", function(event) {
        clearTimeout(favoritoTimeout);
    });

    es_favorito(producto.id, usuario)
    .then(response =>{
        // Si el producto es un favorito del usuario, se pone el fondo amarillo
        if (response) {
            itemProducto.style.backgroundColor = 'yellow';
        }
    })
}


function marcarComoFavorito(producto_id, nombre_usuario, item_producto) {
  // Marca o descamarca un producto como favorito, dependiendo de si lo era antes o no

  // Datos necesarios para la solicitud
  const datos = {
    nombre: nombre_usuario,
    id: producto_id
  };

  fetch('/usuarios/agregar_eliminar_favorito', {method: 'POST', 
                                                headers: {'Content-Type': 'application/json'},
                                                body: JSON.stringify(datos)})
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al agregar o eliminar producto a favoritos');
    }
    console.log('Producto', producto_id,  'agregado o eliminado de la lista de favoritos de', nombre_usuario, 'correctamente');
    // Cambia el color de fondo, a amarillo si ahora es favorito o sin color si ya no lo es
    if (item_producto.style.backgroundColor === '') {
      item_producto.style.backgroundColor = 'yellow';
    } else {
      item_producto.style.backgroundColor = '';
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function es_favorito(producto_id, nombre_usuario) {
  // Devuelve si el producto de id 'producto_id' esta en la lista de favorito de 'nombre_usuario'

  // Devuelve la lista de usuarios
  return fetch('/usuarios')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al comprobar si el producto', producto_id, 'esta en la lista de favoritos de', nombre_usuario);
    }
    return response.json();
  })
  .then(lista_usuarios =>{
    // Busca al usuario por su nombre
    const usuario = lista_usuarios.find(usuario => usuario.nombre === nombre_usuario);
    if (!usuario) {
      throw new Error('Usuario', nombre_usuario, 'no encontrado');
    }

    // Verifica si el producto esta en la lista de favoritos del usuario
    const esFavorito = usuario.favoritos.includes(producto_id);
    if (esFavorito) {
      console.log('El producto', producto_id, 'esta en la lista de favoritos de', nombre_usuario);
      return true;
    } else {
      console.log('El producto', producto_id, 'no esta en la lista de favoritos de', nombre_usuario);
      return false;
    }
  })
  .catch(error => {
    console.error('Error:', error);
    return false;
  });
}

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
            
            return productos;  
        })
        .catch(error => {
            // Error
            console.error('Error al buscar producto', error);  
        });
  }
  
function cargarProducto(productoID){
    fetch(`/buscar/${productoID}`)
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
            let producto = productos[0];
            //ajustarTotal(producto);

            // Se cargan todos sus elementos html
            generarProductos(producto)
        })
        .catch(error => {
            // Error
            console.error('Error al buscar producto', error);  
        });
}


function borrarProducto(productoID, usuario){
    let peticion = {
        nombre: usuario,
        productoID: productoID
    }
    //Realiza la solicitud POST al servidor
    fetch('/carrito/eliminar', {method: 'POST', 
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(peticion)})
    .then(response => {
    //Una respuesta es exitosa si el codigo de estado esta en el rango 200-299
    if (!response.ok) {
    //Recupera el mensaje de error del servidor
    return response.text().then(mensaje_error => {
        //Muestra el mensaje de error
        mostrar_popup(mensaje_error);
        //Lanza un error para pasar al bloque .catch
        throw new Error('Error al eliminar producto');
    });
    }
    //Respuesta exitosa
    cargarCarrito(usuario)
    
    return response.text();
    })
    .then(mensaje_servidor => {
        mostrar_popup('Producto eliminado del carrito');
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
}


function cargarCarrito(usuario){
    //Se obtiene el texto del total 
    let Itemtotal = document.getElementById("total");
    Itemtotal.innerText = "TOTAL: 0€"
    //Se obtiene el boton de pagar del html para guardarlo y ocultarlo en caso de ser necesario
    let botonCompra = document.getElementById("btn_pagar");

    fetch(`/carrito/${usuario}`)
    .then(response => {
        if (!response.ok) {
        throw new Error('Error al obtener la lista del carrito');
        }
        return response.json();
    })
    .then(listaCarrito => {
        const listaProductos = document.getElementById('container-carrito');
        listaProductos.innerHTML = '';
        //Comprobacion de si la lista esta vacia
        if (listaCarrito.length === 0){
            //Se oculta el texto del total y el boton de finalizar compra
            Itemtotal.style.display = "none";
            botonCompra.style.display = "none";
            //Se crean elementos para mostrar el texto que indica que no hay nada añadido y un boton de ir a la tienda
            const mensajeVacio = document.createElement('p');
            mensajeVacio.className = "mensaje-vacio";
            mensajeVacio.innerText = "Actualmente no hay productos en la cesta";
            
            const botonIrTienda = document.createElement('button');
            botonIrTienda.className = "boton_irse";
            botonIrTienda.innerText = "Ir A Tienda";
            //Se añade la propiedad de que al pulsar el boton se redirija a la tienda
            botonIrTienda.onclick = function() {
                window.location.href = "../tienda.html";
            }

            listaProductos.appendChild(mensajeVacio);
            listaProductos.appendChild(botonIrTienda);
        }
        //En caso de no estar vacia, ya que contiene productos, se carga cada producto añadido
        else{
            listaCarrito.forEach(producto => {
                cargarProducto(producto);
            });
            actualizarTotal();
            
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

//Funcion para el boton de volver y redirigir a la ventana de la tienda
function volverTienda(){
    window.location.href = "../tienda.html";
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

function eliminar_deslizando(productoID, usuario, img_producto, evento) {
  const coord_x = evento.touches[0].clientX;
  // Funcion que se inicia cuando se levanta el dedo de la pantalla
  const final_toque = (event) => {
    // "Cantidad" recorrida por el dedo
     const recorrido_x = event.changedTouches[0].clientX - coord_x;
    // Si la "cantidad" es mas de 100, se elimina el producto
    if (recorrido_x > 100) {
      borrarProducto(productoID, usuario);
    }
    img_producto.removeEventListener('touchend', final_toque);
  }
  img_producto.addEventListener('touchend', final_toque);
}

cargarCarrito(usuario);













function obtenerProductosDesdeHTML() {
  const listaProductosHTML = document.getElementById('container-carrito').getElementsByClassName('producto');
  const productos = [];

  for (let i = 0; i < listaProductosHTML.length; i++) {
      let nombre = listaProductosHTML[i].getElementsByClassName('nombre-producto')[0].innerText;

      let productoInfo = listaProductosHTML[i].getElementsByClassName('producto-info')[0];

      let imagen = productoInfo.getElementsByClassName('imagen-producto')[0].src;

      let precio = productoInfo.getElementsByClassName('precio-producto')[0].innerText;
      precio = parseFloat(precio.slice(0, -1));

      let resumen = productoInfo.getElementsByClassName('resumen-producto')[0].innerText;

      let producto = {
        id: nombre,
        nombre: nombre,
        imagen: imagen,
        precio: precio,
        resumen: resumen
      }
      productos.push(producto)
  }
  

  return productos;
}
















// FILTROS CON GIROSCOPIO


// Funcion para filtrar los productos
function filtar(filtro){
  // Primero se obtienen los productos que estan cargados en la lista actualmente
  let productos = obtenerProductosDesdeHTML();
  const listaProductosHTML = document.getElementById('container-carrito');
  listaProductosHTML.innerHTML = '';

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
  productos.forEach(producto =>{
    cargarProducto(producto.id);
  })
}



// USO DE GIROSCOPIO
function giroscopio(){
  let sensor = new Gyroscope({frequency: 20})

  sensor.addEventListener("reading", (e) => {
  
  if (sensor.x > 5){
      filtar(2);
  }
  if (sensor.x < -5){
    filtar(3);
  }
  
  });
  sensor.start();

}
giroscopio();





function actualizarTotal(){// Actualizar valor del precio total:
  let ItemTotal = document.getElementById("total");
  let usuario = sessionStorage.getItem('usuario');
fetch(`/carrito/total/${usuario}`)
.then(response => {
    if (!response.ok) {
    throw new Error('Error al obtener la lista del carrito');
    }
    return response.json();
})
.then(total => {
    total = total.toFixed(2) // Se redondea a 2 decimales
    ItemTotal.innerText = "TOTAL: " + total.toString() + "€" 
})
.catch(error => {
    console.error('Error:', error);
});
}

actualizarTotal();
