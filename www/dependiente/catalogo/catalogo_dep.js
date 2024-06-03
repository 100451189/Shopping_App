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
  const listaProductos = document.getElementById('container-lista');
  listaProductos.innerHTML = ""; // Vaciar el div con la lista de los productos

  productos.forEach(producto => {
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
  
  });  
}

function abrirProducto(productoID){
    window.location.href = "pagina_producto.html?producto=" + productoID; // Se envia el ID de producto como parametro en la url
}

function volverAtras(){
  window.location.href = "../panel-control/dep_control.html";
}