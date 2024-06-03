fetch('/usuarios')
  .then(response => response.json()) // Convertir la respuesta del servidor a JSON
  .then(data => {
    // Manejar la respuesta y mostrar la lista de usuarios en la página
    const listaUsuarios = document.getElementById('lista-usuarios'); 
    data.forEach(usuario => {
      const itemUsuario = document.createElement('li'); 
      itemUsuario.textContent = usuario.nombre; 
      listaUsuarios.appendChild(itemUsuario); 

      // Agregar event listener para manejar el clic en el elemento (mostara info usuario)
      itemUsuario.addEventListener('click', () => {
        // Llamar a la función que maneja la información del usuario al que se hizo clic
        abrirCliente(usuario);
      });
    });
  })
  .catch(error => {
    console.error('Hubo un error al obtener la lista de usuarios:', error); 
  });





  function buscarProducto(busqueda) {
    // Devolver una promesa para permitir el uso de await
    return new Promise((resolve, reject) => {
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
                let div_lista = document.getElementById("container_lista");
                const itemFavorito = document.createElement('p');
                itemFavorito.className = 'info_cliente';
                itemFavorito.innerText = productos[0].nombre;
                itemFavorito.style.color = "#C2B946";
                
                div_lista.appendChild(itemFavorito);
                resolve(); // Resolvemos la promesa aquí
            })
            .catch(error => {
                // Error
                console.error('Error al buscar producto', error);
                reject(error); // Rechazamos la promesa en caso de error
            });
    });
}





function abrirCliente(usuario) {
    let div_lista = document.getElementById("container_lista"); // Se coge el div de la lista
    
    div_lista.innerHTML =  '';
    
    // Se agrega el nombre del usuario
    const nombre_html = document.createElement('h2');
    nombre_html.className = "info_cliente";
    nombre_html.innerText = "Usuario: " + usuario.nombre;
    div_lista.appendChild(nombre_html);

    // Se agrega la contraseña
    const pass_html = document.createElement('h2');
    pass_html.className = "info_cliente";
    pass_html.innerText = "Contraseña: " + usuario.password;
    div_lista.appendChild(pass_html);

    // Se agrega el email
    const correo_html = document.createElement('h2');
    correo_html.className = "info_cliente";
    correo_html.innerText = "Correo: " + usuario.email;
    div_lista.appendChild(correo_html);

    // ESPACIO
    div_lista.appendChild(document.createElement("br"))

    // Productos favoritos
    const txtProdcutosFavoritos = document.createElement("p")
    txtProdcutosFavoritos.innerText = "Productos favoritos:"
    txtProdcutosFavoritos.className = 'info_cliente';
    div_lista.appendChild(txtProdcutosFavoritos);

    // Función para buscar un producto favorito y agregarlo al div_lista
    async function agregarProductoFavorito(favorito) {
      await buscarProducto(favorito);
    }

    // Iterar sobre los productos favoritos y agregarlos uno por uno
    Promise.all(usuario.favoritos.map(agregarProductoFavorito)).then(() => {
      // Una vez que todos los productos favoritos se han agregado, agregar el texto del historial


      // ESPACIO
      div_lista.appendChild(document.createElement("br"))

      // Historial compras
      const txtHistorial = document.createElement("p")
      txtHistorial.innerText = "Historial de compras:" // <- Corregido aquí
      txtHistorial.className = 'info_cliente';
      div_lista.appendChild(txtHistorial);

      usuario.historial.forEach(compra => {
        const itemCompra = document.createElement("div");
        itemCompra.className = "btn_compra"
        itemCompra.innerText = "COMPRA";
        itemCompra.onclick = function (){
          window.location.href = "historial.html?compra=" + compra;
        }
        div_lista.appendChild(itemCompra)
      })

      
    });


}

function volverAtras(){
  window.location.href = "../panel-control/dep_control.html";
}
