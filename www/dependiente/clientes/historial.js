let compra = new URLSearchParams(window.location.search).get('compra'); // Se coge la id del producto de la url

compra = compra.split(','); // Lo transformamos a una lista de ids de producto





let listaProductos = document.getElementById('container-lista');
listaProductos.innerHTML = ""; // Vaciar el div con la lista de los productos

// Agregar la fecha y hora de la compra
let fechaTXT = document.createElement("p");
fechaTXT.className = 'info-producto';
fechaTXT.innerText = "FECHA Y HORA DE LA COMPRA: " + compra[compra.length -1];
listaProductos.appendChild(fechaTXT)





// Se van generando los productos
compra.forEach(function(productoID, indice, lista) {
    if (indice < lista.length -1) { // Exlcuimos la fecha
        buscarProducto(productoID)
    }
});


// Funcion que busca el producto por su ID y llama a la funcion para generarlo en la pagina
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
            generarProductos(productos[0])
            
        })
        .catch(error => {
            // Error
            console.error('Error al buscar producto', error);
            
        });
    }

// Funcion que genera un producto en la pagina
function generarProductos(producto){  
    const listaProductos = document.getElementById('container-lista');
    
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

    let info_producto_cantidad = document.createElement("p");
    info_producto_cantidad.className = "info_producto";
    info_producto_cantidad.innerText = "Cantidad: " + producto.cantidad.toString();

    bloque_info_producto.appendChild(info_producto_nombre);
    bloque_info_producto.appendChild(info_producto_categoria);
    bloque_info_producto.appendChild(info_producto_cantidad);

    itemProducto.appendChild(imagen);
    itemProducto.appendChild(bloque_info_producto);

    listaProductos.appendChild(itemProducto);
    
    }
  

