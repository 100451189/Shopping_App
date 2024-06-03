const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

//Para poder ejecutar el programa al lanzar el servidor, se debe acceder a http://localhost:3000
const PORT = 3000;

app.use('/', express.static(path.join(__dirname, 'www')));

app.use(express.json())

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, 'www/cliente.html'));
  //res.end(JSON.stringify(users));
});


app.get("/dependiente", function(req, res) {
  res.sendFile(path.join(__dirname, 'www/dependiente.html'));
});



app.post("/usuarios/registro",  function(req, res) {
  // Al hacer una peticion post de tipo users, se registrara un usuario con la informacion proporcionada por el cliente

  // Lee el contenido del archivo users.json
  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer users.json:', err);
      res.status(500).send('Hubo un error al procesar la solicitud de registro');
      return;
    }

    // Convierte el contenido del archivo a un objeto
    let usuarios = JSON.parse(data);

    // Comprueba si el usuario ya esta registrado
    const usuario_registrado = usuarios.find(usuario => usuario.nombre === req.body.nombre);
    if (usuario_registrado) {
      console.error('El usuario ya esta registrado')
      res.status(400).send('El usuario ya esta registrado');
      return;
    }

    // Añade el nuevo usuario a la lista de usuarios
    usuarios.push(req.body);

    // Escribe la lista actualizada de usuarios en el archivo users.json
    fs.writeFile('users.json', JSON.stringify(usuarios, null, 4), (err) => {
      if (err) {
        console.error('Error al escribir en users.json:', err);
        res.status(500).send('Hubo un error al procesar la solicitud de registro');
        return;
      }
      //console.log('Usuario registrado exitosamente')
      res.status(201).send('Usuario registrado exitosamente');
    });
  })
  
  // Se lee el json de carrito
  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al crear carrito para usuario:', err);
      res.status(500).send('Hubo un error al crear el carrito del usuario registrado');
      return;
    }
    let carritos = JSON.parse(data);
    let carrito = {
      usuario: req.body.nombre,
      lista: [],
      pagado: false
    }
    // Se agrega la entrada del nuevo usuario
    carritos.push(carrito);

    // SE escribe el json de carritos actualizado
    fs.writeFile('carrito.json', JSON.stringify(carritos, null, 4), (err) => {
      if (err) {
        console.error('Error al escribir en carrito.json:', err);
        res.status(500).send('Hubo un error al procesar la solicitud de registro');
        return;
      }
      
    });
  });
});


app.get("/carrito/:nombreUsuario", function(req, res) {
  const nombreUsuario = req.params.nombreUsuario;
  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer carrito.json:', err);
      res.status(500).send('Hubo un error al procesar la solicitud de información de carrito');
      return;
    }
    let carritos = JSON.parse(data);
    const carrito = carritos.find(carrito => carrito.usuario === nombreUsuario);
    if (!carrito) {
      res.status(404).send('El carrito no fue encontrado para el usuario especificado');
      return;
    }
    res.json(carrito.lista);
  });
});


// Peticion que devuelve si el usuario ha pagado su compra
app.get("/carrito/validar/:nombreUsuario", function(req, res) {
  const nombreUsuario = req.params.nombreUsuario;
  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer carrito.json:', err);
      res.status(500).send('Hubo un error al procesar la solicitud de información de carrito');
      return;
    }
    let carritos = JSON.parse(data);
    const carrito = carritos.find(carrito => carrito.usuario === nombreUsuario);
    if (!carrito) {
      res.status(404).send('El carrito no fue encontrado para el usuario especificado');
      return;
    }
    res.json(carrito.pagado);
  });
});


// Funcion que devuevlo el precio total del carrito de un usuario
app.get("/carrito/total/:nombreUsuario", function(req, res) {
  const nombreUsuario = req.params.nombreUsuario;
  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer carrito.json:', err);
      res.status(500).send('Hubo un error al procesar la solicitud de información de carrito');
      return;
    }
    let carritos = JSON.parse(data);
    const carrito = carritos.find(carrito => carrito.usuario === nombreUsuario);
    if (!carrito) {
      res.status(404).send('El carrito no fue encontrado para el usuario especificado');
      return;
    }

    fs.readFile("productos.json", "utf8", (err, data) =>{
      let total = 0;
      if (err){
        console.error('Error al leer productos.json');
        return;
      }
      let catalogo = JSON.parse(data);
      
      carrito.lista.forEach(productoID => {
        productoBuscado = catalogo.find(producto => producto.id === productoID);
        total += productoBuscado.precio;
        
      });

      res.json(total);


    })



  });
});




app.post("/carrito/agregar",  function(req, res) {
  // Post para agregar un producto al carrito de un usuario

  // Lee el contenido del archivo carrito.json
  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer carrito.json:', err);
      res.status(500).send('Hubo un error al procesar la solicitud del producto');
      return;
    }

    // Convierte el contenido del archivo a un objeto
    let carritos = JSON.parse(data);

    // Comprueba si el usuario ya esta registrado
    const carrito = carritos.find(carrito => carrito.usuario === req.body.nombre);
    

    // Añade el producto al carrito
    carrito.lista.push(req.body.productoID);

    // Escribe la lista actualizada 
    fs.writeFile('carrito.json', JSON.stringify(carritos, null, 4), (err) => {
      if (err) {
        console.error('Error al escribir en carrito.json:', err);
        res.status(500).send('Hubo un error al procesar la solicitud de producto');
        return;
      }
      res.status(201).send('Producto agregado al carrito');
    });
  });
});



// Funcion para formatear correctamente la hora de las compras
function agregarCeroDelante(numero) {
  return numero < 10 ? '0' + numero : numero;
}

function registrarCompra(usuario_nombre, lista){

  // Se lee el fichero de usuarios
  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer users.json:', err);
      return;
    }

    // Convierte el contenido del archivo a un objeto
    let usuarios = JSON.parse(data);

    // Comprueba si el usuario esta registrado
    const usuario_registrado = usuarios.find(usuario => usuario.nombre === usuario_nombre);
    
    // Se agrega al final de la lista la fecha de la compra
    let fechaActual = new Date();

    // Obtener los componentes de la fecha
    let dia = fechaActual.getDate();
    let mes = fechaActual.getMonth() + 1;
    let año = fechaActual.getFullYear();

    // Obtener los componentes de la hora
    let horas = fechaActual.getHours();
    let minutos = fechaActual.getMinutes();

    // Formatear la fecha como "DD/MM/YYYY"
    let fechaFormateada = dia + '/' + mes + '/' + año;

    // Formatear la hora como "HH:MM"
    let horaFormateada = agregarCeroDelante(horas) + ':' + agregarCeroDelante(minutos);

    // Combinar fecha y hora
    let fechaHoraFormateada = fechaFormateada + ' ' + horaFormateada;

    lista.push(fechaHoraFormateada)
    
    // Se agrega la lista  a su historial
    usuario_registrado.historial.push(lista);
    

    // Escribe la lista actualizada de usuarios en el archivo users.json
    fs.writeFile('users.json', JSON.stringify(usuarios, null, 4), (err) => {
      if (err) {
        console.error('Error al escribir en users.json:', err);
        return;
      }
      
    });
  })
}



app.post("/carrito/vaciar",  function(req, res) {
  // Post para vaciar el carrito de un usuario y registrar la compra en su historial

  // Lee el contenido del archivo carrito.json
  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer carrito.json:', err);
      res.status(500).send('Hubo un error al procesar la solicitud del producto');
      return;
    }

    // Convierte el contenido del archivo a un objeto
    let carritos = JSON.parse(data);

    // Comprueba si el usuario ya esta registrado
    const carrito = carritos.find(carrito => carrito.usuario === req.body.nombre);


    registrarCompra(req.body.nombre, carrito.lista);
    

    // Vacia la lista de productos
    carrito.lista = [];
    carrito.pagado = false;

    // Escribe la lista actualizada 
    fs.writeFile('carrito.json', JSON.stringify(carritos, null, 4), (err) => {
      if (err) {
        console.error('Error al escribir en carrito.json:', err);
        res.status(500).send('Hubo un error al procesar la solicitud de producto');
        return;
      }
      res.status(201).send('Producto agregado al carrito');
    });
  });
});


app.post("/carrito/eliminar",  function(req, res) {
  // Post para vaciar el carrito de un usuario

  // Lee el contenido del archivo carrito.json
  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer carrito.json:', err);
      res.status(500).send('Hubo un error al procesar la solicitud del producto');
      return;
    }

    // Convierte el contenido del archivo a un objeto
    let carritos = JSON.parse(data);

    // Comprueba si el usuario ya esta registrado
    const carrito = carritos.find(carrito => carrito.usuario === req.body.nombre);
    
    // Eliminar de la lista el producto
    let indice = carrito.lista.indexOf(req.body.productoID);

    // Si el índice es diferente de -1 (significa que se encontró el producto)
    if (indice !== -1) {
        // Se elimina
        carrito.lista.splice(indice, 1);
    }

    // Escribe la lista actualizada 
    fs.writeFile('carrito.json', JSON.stringify(carritos, null, 4), (err) => {
      if (err) {
        console.error('Error al escribir en carrito.json:', err);
        res.status(500).send('Hubo un error al procesar la solicitud de producto');
        return;
      }
      res.status(201).send('Producto agregado al carrito');
    });
  });
});

app.post("/carrito/pagado",  function(req, res) {
  // Post para validar que el cliente ha pagado

  // Lee el contenido del archivo carrito.json
  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer carrito.json:', err);
      res.status(500).send('Hubo un error al procesar la solicitud del producto');
      return;
    }

    // Convierte el contenido del archivo a un objeto
    let carritos = JSON.parse(data);

    // Comprueba si el usuario ya esta registrado
    const carrito = carritos.find(carrito => carrito.usuario === req.body.nombre);
    

    // Vacia la lista de productos
    carrito.pagado = true;

    // Escribe la lista actualizada 
    fs.writeFile('carrito.json', JSON.stringify(carritos, null, 4), (err) => {
      if (err) {
        console.error('Error al escribir en carrito.json:', err);
        res.status(500).send('Hubo un error al procesar la solicitud de producto');
        return;
      }
      res.status(201).send('Producto agregado al carrito');
    });
  });
});




app.post("/usuarios/login", function(req, res){
  /* Al hacer una peticion post de tipo users/login, se iniciara sesion con la informacion 
    proporcionada por el cliente */

  // Lee el contenido del archivo users.json
  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer users.json:', err);
      res.status(500).send('Hubo un error al procesar la solicitud de inicio de sesion');
      return;
    }

    // Convierte el contenido del archivo a un objeto
    let usuarios = JSON.parse(data);

    // Comprueba si el usuario esta registrado
    const usuario_registrado = usuarios.find(usuario => usuario.nombre === req.body.nombre);
  
    if (!usuario_registrado) {
      res.status(401).send('El usuario no esta registrado')
    }
    // Comprueba si la contraseña coincide
    else if (usuario_registrado.password === req.body.password) {
      res.status(200).send('Inicio de sesion exitoso');
    } else {
      res.status(401).send('Usuario registrado; contraseña incorrecta');
    }
  });
});

app.post("/dependientes/login", function(req, res){
  /* Al hacer una peticion post de tipo dependientes/login, se iniciara sesion con la informacion 
    proporcionada por el dependiente */

  // Lee el contenido del archivo users.json
  fs.readFile('dependientes.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer dependientes.json:', err);
      res.status(500).send('Hubo un error al procesar la solicitud de inicio de sesion');
      return;
    }

    // Convierte el contenido del archivo a un objeto
    let dependientes = JSON.parse(data);

    // Comprueba si el usuario esta registrado
    const dependiente_registrado = dependientes.find(dependiente => dependiente.nombre === req.body.nombre);
  
    if (!dependiente_registrado) {
      res.status(401).send('El dependiente no esta registrado')
    }
    // Comprueba si la contraseña coincide
    else if (dependiente_registrado.password === req.body.password) {
      res.status(200).send('Inicio de sesion exitoso');
    } else {
      res.status(401).send('Dependiente registrado; contraseña incorrecta');
    }
  });
});



app.get("/usuarios", function(req, res) {
  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer users.json:', err);
      res.status(500).send('Hubo un error al procesar la solicitud de información de usuarios');
      return;
    }
    let usuarios = JSON.parse(data);
    res.json(usuarios); // Enviar la lista de usuarios como respuesta
  });
});

app.get("/catalogo", function(req, res) {
  
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer prodcutos.json:', err);
      res.status(500).send('Hubo un error al procesar la solicitud del catalogo');
      return;
    }
    let catalogo = JSON.parse(data);
    res.json(catalogo); // Enviar la lista de productos como respuesta
  });
});




// Funcion para buscar prodcutos en el catalogo por nombre o id
app.get("/buscar/:busqueda", function(req, res) {
  
  const busqueda = req.params.busqueda; // Obtiene el parámetro de busqueda de la URL
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer productos.json:', err);
      res.status(500).send('Hubo un error al procesar la solicitud del catálogo');
      return;
    }
    let catalogo = JSON.parse(data);
    // Buscar el producto en funcion de nombre o id
    let productoBuscado;
    // Buscar el producto en función de nombre o id
      
    
      if (/^\d+$/.test(busqueda)) { // Expresión regular para ver si lo que se busca es un id (solo tiene números)
        // Buscar por id
        productoBuscado = catalogo.find(producto => producto.id === busqueda);
        if (productoBuscado) {
          res.json([productoBuscado]); // Enviar el producto encontrado como respuesta
        } else {
          res.status(404).send('Producto no encontrado');
        }
      } 
      else {
        // Buscar por nombre
          productoBuscado = catalogo.filter(producto => producto.nombre.toLowerCase().includes(busqueda.toLowerCase()));
        if (productoBuscado) {
          res.json(productoBuscado); // Enviar el producto encontrado como respuesta
        } else {
          res.status(404).send('Producto no encontrado');
        
        }
        
      }
  });
});

// Ruta para manejar la solicitud POST para agregar o eliminar un producto de la lista de favoritos de un usuario
app.post('/usuarios/agregar_eliminar_favorito', (req, res) => {

  const { nombre, id } = req.body;

  // Lee el archivo users.json
  fs.readFile('users.json', 'utf8', (error, data) => {
    if (error) {
      console.error('Error al leer users.json:', error);
      res.status(500).send('Error al al marcar/desmarcar como favorito');
      return;
    }

    let usuarios = JSON.parse(data);

    // Busca al usuario por nombre
    const usuario = usuarios.find(u => u.nombre === nombre);
    if (!usuario) {
      res.status(404).send('Error al al marcar/desmarcar como favorito: usuario no encontrado');
      return;
    }

    // Verifica si el producto ya esta en la lista de favoritos del usuario
    const index = usuario.favoritos.indexOf(id);
    if (index === -1) {
      // Agrega el producto a la lista de favoritos del usuario
      usuario.favoritos.push(id);
    } else {
      // Elimina el producto de la lista de favoritos del usuario
      usuario.favoritos.splice(index, 1);
    }

    // Escribe los cambios en users.json
    fs.writeFile('users.json', JSON.stringify(usuarios, null, 4), err => {
      if (err) {
        console.error('Error al escribir en users.json:', err);
        res.status(500).send('Error al al marcar/desmarcar como favorito');
        return;
      }
      // Envia una respuesta exitosa al cliente
      res.status(200).send('El producto', id, 'ha sido actualizado en la lista de favoritos de', nombre);
    });
  });
});


// Funcion que devuelve el valor del campo pagado para que el cliente sepa cuando se valida su compra por parte del dependiente
app.get("/validacion/:nombreUsuario", function(req, res) {
  const nombreUsuario = req.params.nombreUsuario;
  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer carrito.json:', err);
      res.status(500).send('Hubo un error al procesar la solicitud de información de carrito');
      return;
    }
    let carritos = JSON.parse(data);
    const carrito = carritos.find(carrito => carrito.usuario === nombreUsuario);
    if (!carrito) {
      res.status(404).send('El carrito no fue encontrado para el usuario especificado');
      return;
    }
    res.json(carrito.pagado);
  });
});



//Se mantiene a la espera de una conexion tras lanzar el servidor a traves del puerto 3000
app.listen(PORT, function () {
  console.log(`Servidor Express en escucha en el puerto ${PORT}`);
});

// Crea (si no existe) el fichero donde se guardara la informacion de los usuarios
fs.access('users.json', fs.constants.F_OK, (error) => {
  if (error) {
    // Si el archivo no existe, crearlo
    fs.writeFile('users.json', '[]', (error) => {
      if (error) {
        console.log('Error al crear users.json');
      } else {
        console.log('users.json creado correctamente');
      }
        });
    } else {
        console.log('El archivo users.json ya existe');
    }
});
