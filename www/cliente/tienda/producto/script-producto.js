const idProducto = new URLSearchParams(window.location.search).get('producto'); // Se coge la id del producto de la url


//Saca la infomacion del producto
fetch(`/buscar/${idProducto}`)
      .then(response => {
          //Se verifica si se produce un error al tratar de encontrar el producto
          if (!response.ok) {
              throw new Error('Se ha producido un error al buscar el producto');
          }
          //En caso de no producirse error alguno, se convierte la respuesta al JSON
          return response.json();
      })
      .then(productos => {
          //Al haberse encontrado el producto, se llama a la funcion de generarlo
          generarProductos(productos)
      })
      .catch(error => {
          //Se lanza un mensaje de error por consola para notificar posibles errores en la busqueda del producto
          console.error('Se ha producido un error al buscar producto', error);  
      });

//Funcion correspondiente a la generacion de los productos en la pagina html
function generarProductos(productos){
    const container_producto = document.getElementById('container_producto');
    //Se vacia el div que contiene todo lo relevante al producto en caso de estar relleno
    container_producto.innerHTML = ""; 

    let producto = productos[0];
    
    //Creacion de los elementos HTML necesarios para representar la informacion del producto
    let div_foto_producto = document.createElement("div");
    let div_caracteristicas_producto = document.createElement("div");
    let div_descripcion_producto = document.createElement("div");
    let div_boton_agregar = document.createElement("div");
    let div_popup = document.createElement("div");
    let contenido_popup = document.createElement("p");

    div_foto_producto.className = "foto_producto";
    div_caracteristicas_producto.className = "caracteristicas_producto";
    div_descripcion_producto.className = "descripcion_producto";
    div_boton_agregar.className = "boton_agregar";
    div_popup.setAttribute("id", "popup");
    contenido_popup.setAttribute("id", "contenido-popup");
    div_popup.appendChild(contenido_popup);
    container_producto.appendChild(div_popup);

    //Configuracion de la seccion de la categoria, nombre e imagen del producto
    //Creacion de elementos correspondientes para cada uno
    let txt_categoria = document.createElement("p");
    let txt_nombre = document.createElement("p");
    let img = document.createElement("img");
    //Incorporacion de textos que corresponden a dichos elementos o de clases para gestionar el css
    txt_categoria.innerText = producto.categoria;
    txt_categoria.className = "tipo_producto";

    txt_nombre.innerText = producto.nombre;
    txt_nombre.className = "nombre_producto";

    img.className = "imagen-producto"
    img.src = producto.imagen;
    img.alt = producto.nombre;
    //Se incluye lo generado a los elementos para que sea visible en el html
    div_foto_producto.appendChild(txt_categoria);
    div_foto_producto.appendChild(txt_nombre);
    div_foto_producto.appendChild(img);
    //Se incluyen todos los elementos al contenedor global de esta seccion del html
    container_producto.appendChild(div_foto_producto);

    //Generacion de una linea para dividir la seccion anterior de la siguiente
    let line = document.createElement("hr");
    line.className = "linea"
    //Configuracion de los elementos requeridos para la seccion de informacion mas detallada del producto
    let cantidad = document.createElement("p");
    cantidad.innerText = "Cantidad: " + producto.cantidad.toString() + " Uds.";

    let precio = document.createElement("p");
    precio.innerText = "Precio: " + producto.precio.toString() + "€";

    let localizacion = document.createElement("p");
    localizacion.innerText = producto.localizacion;

    div_caracteristicas_producto.appendChild(line);
    div_caracteristicas_producto.appendChild(cantidad);
    div_caracteristicas_producto.appendChild(precio);
    div_caracteristicas_producto.appendChild(localizacion);

    container_producto.appendChild(div_caracteristicas_producto);
    //SE VUELVE A REPETIR EL PROCESO ANTERIOR PARA LA SIGUIENTE SECCION
    let line2 = document.createElement("hr");
    line.className = "linea"

    let txt_descr = document.createElement("h3");
    let descripcion = document.createElement("p");
    descripcion.innerText = producto.descripcion;

    div_descripcion_producto.appendChild(line2);
    div_descripcion_producto.appendChild(txt_descr);
    div_descripcion_producto.appendChild(descripcion);

    container_producto.appendChild(div_descripcion_producto);

    let line3 = document.createElement("hr");
    line.className = "linea"
    //Incorporacion de boton para agregar el producto a la compra
    let btn_agregar = document.createElement("button");
    btn_agregar.innerText = "Agregar al carrito";
    btn_agregar.addEventListener('click', function () {
        agregarCarrito(producto.id);
    });

    div_boton_agregar.appendChild(line3);
    div_boton_agregar.appendChild(btn_agregar);

    container_producto.appendChild(div_boton_agregar);
}

//Funcion encargada de hacer visible un popup de notificacion por pantalla
function mostrar_popup(mensaje) {
    document.getElementById('contenido-popup').innerHTML = mensaje;
    const ancho_mensaje = document.getElementById('contenido-popup').offsetWidth;
    document.getElementById('popup').width = ancho_mensaje + 'px';
    // Muestra el popup
    document.getElementById('popup').style.display = 'block';
    // Oculta el popup despues de 2 segundos
    setTimeout(() => document.getElementById('popup').style.display = 'none', 1250);
  }

function agregarCarrito(productoID) {
    //Funcion que agrega un producto al carrito
    //Objeto que guarda los datos del nuevo usuario
    let nombre = sessionStorage.getItem('usuario');
    const peticion = {
        nombre: nombre,
        productoID: productoID,
    };
    //Realiza la solicitud POST al servidor
    fetch('/carrito/agregar', {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(peticion)
    })
    .then(response => {
        //Una respuesta es exitosa si el codigo de estado esta en el rango 200-299
        if (!response.ok) {
        //Recupera el mensaje de error del servidor
            return response.text().then(mensaje_error => {
                //Muestra el mensaje de error
                mostrar_popup(mensaje_error);
                //Lanza un error para pasar al bloque .catch
                throw new Error('Error al agregar producto');
            });
        }
        //Respuesta exitosa
        return response.text();
    })
    .then(mensaje_servidor => { 
        //Se muestra el mensaje de que se ha añadido el producto a la cesta al presionar el boton
        mostrar_popup("Producto añadido al carrito");
        //Se da un delay de 2 segundos para ver la noti y redirigir de nuevo a tienda.html
        setTimeout(() => {
            window.location.href = "../tienda.html";
        }, 2000);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
}

//Funcion para el boton de volver y redirigir a la ventana de la tienda
function volverTienda(){
    window.location.href = "../tienda.html";
}

//Funcion para ir a la ventana del carro con todos los productos añadidos
function irACarro(){
    window.location.href= "../carrito/carrito.html";
}



// USO DE GIROSCOPIO
function giroscopio(idProducto){
    let sensor = new Gyroscope({frequency: 7})

    sensor.addEventListener("reading", (e) => {
    
    if (sensor.y > 6){
        return agregarCarrito(idProducto);
    }
    if (sensor.y < -6){
        return volverTienda();
    }
    
    });
    sensor.start();

}
giroscopio(idProducto);