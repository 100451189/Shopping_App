// Se coge el nombre del usuario escaneado.
let usuario = sessionStorage.getItem('usuario_scan')

// Se hace una peticion para saber si el usuario ha pagado

fetch(`/carrito/validar/${usuario}`)
.then(response => {
    if (!response.ok) {
    throw new Error('Error al obtener la lista del carrito');
    }
    return response.json();
})
.then(pagado => {
    if (pagado == true){ // El pago ha sido correcto
        
        peticionCompra(usuario);
    }
    }
    
    
)
.catch(error => {
    console.error('Error:', error);
});


// Funcion que hace una peticion para recibir la lista de ID de productos que el usuario ha comprado
function peticionCompra(usuario){
    
    fetch(`/carrito/${usuario}`)
    .then(response => {
        if (!response.ok) {
        throw new Error('Error al obtener la lista del carrito');
        }
        return response.json();
    })
    .then(listaCarrito => {
        obtenerProductos(listaCarrito);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}




// A partir de una lista de IDs se piden los productos completos y se van generando en la pagina
function obtenerProductos(listaID){
    
    // Peticion de busqueda por ID
    listaID.forEach(productoID => {
        fetch(`/buscar/${productoID}`)
        .then(response => {
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error('Error al buscar el producto');
            }
            // Convertir la respuesta a JSON
            return response.json();
        })
        .then(producto => {
            // Producto encontrado
            generarProducto(producto[0])
            
        })
        .catch(error => {
            // Error
            console.error('Error al buscar producto', error);
            
        });
    })
    

}




// Funcion que genera todos los elementos HTML para visualizar un procuto
function generarProducto(producto){ 
    const listaProductos = document.getElementById('container-lista-validar');
    //listaProductos.innerHTML = ""; // Vaciar el div con la lista de los productos
    
    let itemProducto = document.createElement('div');
    itemProducto.className = 'producto';

    let imagen = document.createElement("img")
    imagen.src= producto.imagen;
    imagen.className = "img_producto"
    imagen.alt = 'img_producto';

    let bloque_info_producto = document.createElement("div");
    bloque_info_producto.className= "bloque_info_producto";

    let info_producto_nombre = document.createElement("p");
    info_producto_nombre.className = "info_producto";
    info_producto_nombre.innerText = producto.nombre;

    let info_producto_categoria = document.createElement("p");
    info_producto_categoria.className = "info_producto";
    info_producto_categoria.innerText = producto.categoria;

    let info_producto_precio = document.createElement("p");
    info_producto_precio.className = "info_producto";
    info_producto_precio.innerText = "Precio: " + producto.precio.toString() + "€"

    bloque_info_producto.appendChild(info_producto_nombre);
    bloque_info_producto.appendChild(info_producto_categoria);
    bloque_info_producto.appendChild(info_producto_precio);

    itemProducto.appendChild(imagen);
    itemProducto.appendChild(bloque_info_producto);

    listaProductos.appendChild(itemProducto);
    
   
  }






  function volverAtras(){
    window.location.href = "../../panel-control/dep_control.html";
  }



  // Obtener boton de validar
  let btn_validar = document.getElementById('btn_validar')
  btn_validar.onclick = function () {
    let usuario = sessionStorage.getItem('usuario_scan');
    peticion = {
        nombre: usuario
    }

    fetch('/carrito/vaciar', {method: 'POST', 
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
        throw new Error('Error al validar la compra');
      });
    }
    return response.text();
  })
  .then(mensaje_servidor => {
    //Solo pasa al menu de inicio de sesion si todo ha salido bien
    sessionStorage.removeItem('usuario_scan');
    window.location.href = "../../panel-control/dep_control.html";
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
    
  }