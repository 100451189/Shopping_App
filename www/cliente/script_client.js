function abrirMenuLogin(){
  //Funcion para abrir la ventana de inicio de sesion
  window.location.href = 'cliente/acceso/login_movil.html';
}

function abrirMenuRegistro(){
  //Funcion para abrir la ventana de registro
  window.location.href = 'cliente/acceso/registro_movil.html';
}

function cerrarMenuLogin(){
  //Funcion para cerrar la ventana de inicio de sesion
  window.location.href = '/cliente.html';
}

function atrasMenuRegistro(){
  //Funcion para volver atras desde la ventana de registro
  window.location.href = '/cliente.html';
}

function cerrarMenuRegistro(){
  //Funcion para cerrar la ventana de registro y conducir a la ventana de inicio de sesion una vez el usuario se ha creado una cuenta
  window.location.href = 'login_movil.html';
}

function abrirTiendaOnline(){
  //Funcion para abrir la ventana principal de la tienda
  window.location.href = '../tienda/tienda.html';
}

function registrarUsuario() {
  //Funcion que registra a un usuario (envia los datos al servidor)
  //Recupera los valores de los input
  const email_input = document.getElementById('email_reg').value;
  const usuario_input = document.getElementById('usuario_reg').value;
  const password_input = document.getElementById('contraseña_reg').value;
  const repetir_password_input = document.getElementById('repetir-contraseña_reg').value;

  //Mensaje de depuracion para comprobar valores introducidos
  console.log('Valores de registro de usuario:')
  console.log('Email:', email_input);
  console.log('Usuario:', usuario_input);
  console.log('Contraseña:', password_input);
  console.log('Repetir Contraseña:', repetir_password_input);

  //Comprueba que todos los input tienen algun valor
  if (!email_input || !usuario_input || !password_input || !repetir_password_input) {
    mostrar_popup('Rellene todos los campos');
  } 
  //Las contraseñas deben ser iguales
  else if (password_input !== repetir_password_input) {
    mostrar_popup('Las contraseñas no coinciden');
  } 
  else {
    //Objeto que guarda los datos del nuevo usuario
    const nuevo_usuario = {
      nombre: usuario_input,
      password: password_input,
      email: email_input,
      historial: [],
      favoritos: []
    };
    //Realiza la solicitud POST al servidor
    fetch('/usuarios/registro', {method: 'POST', 
                                 headers: {'Content-Type': 'application/json'},
                                 body: JSON.stringify(nuevo_usuario)})
    .then(response => {
    //Una respuesta es exitosa si el codigo de estado esta en el rango 200-299
    if (!response.ok) {
      //Recupera el mensaje de error del servidor
      return response.text().then(mensaje_error => {
        //Muestra el mensaje de error
        mostrar_popup(mensaje_error);
        //Lanza un error para pasar al bloque .catch
        throw new Error('Error al registrar el usuario');
      });
    }
    return response.text();
  })
  .then(mensaje_servidor => {
    //Solo pasa al menu de inicio de sesion si todo ha salido bien
    localStorage.setItem('registro_exitoso', 'true');
    cerrarMenuRegistro();
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
  }
}

function iniciarSesion() {
  //Funcion encargada del inicio de sesion
  //Recupera los valores de los input
  const usuario_input = document.getElementById('usuario_log').value;
  const password_input = document.getElementById('contraseña_log').value;
  //Mensaje de depuracion para comprobar valores introducidos
  console.log('Valores de incio de sesion:')
  console.log('Usuario:', usuario_input);
  console.log('Contraseña:', password_input);
  //Comprueba si todos los input tienen algun valor
  if (!usuario_input || !password_input) {
    mostrar_popup('Rellene todos los campos');
  }
  else {
     //Objeto que guarda los datos del usuario
     const usuario = {
      nombre: usuario_input,
      password: password_input,
    };
    //Realiza la solicitud POST al servidor
    fetch('/usuarios/login', {method: 'POST', 
                              headers: {'Content-Type': 'application/json'},
                              body: JSON.stringify(usuario)})
    .then(response => {
    //Una respuesta es exitosa si el codigo de estado esta en el rango 200-299
    if (!response.ok) {
      //Recupera el mensaje de error del servidor
      return response.text().then(mensaje_error => {
        mostrar_popup(mensaje_error);
        //Lanza un error para pasar al bloque .catch
        throw new Error('Error al iniciar sesion');
      });
    }
    //Respuesta exitosa
    sessionStorage.setItem('usuario', usuario.nombre);
    abrirTiendaOnline();
    return response.text();
    
  })
  .then(mensaje_servidor => {
    localStorage.setItem('inicio_exitoso', 'true');
    //Solo pasa se cierra la pagina de inicio de sesion si todo ha salido bien
    //cerrarMenuLogin();
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
  }
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
  const registro_exitoso = localStorage.getItem('registro_exitoso');
  if (registro_exitoso === 'true') {
      // Muestra el popup en tienda.html
      mostrar_popup('Usuario registrado exitosamente');
      // Limpia el valor en localStorage para que el popup no se muestre nuevamente
      localStorage.removeItem('registro_exitoso');
  }
});