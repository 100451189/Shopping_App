function iniciarSesion() {
    //Funcion encargada del inicio de sesion
    //Recupera los valores de los input
    const usuario_input = document.getElementById('usuario').value;
    const password_input = document.getElementById('contrasena').value;
    //Mensaje de depuracion para comprobar valores introducidos
    console.log('Valores de incio de sesion:')
    console.log('Usuario:', usuario_input);
    console.log('Contraseña:', password_input);
    //Comprueba si todos los input tienen algun valor
    if (!usuario_input || !password_input) {
      alert('Rellene todos los campos');
    } 
    else {
       //Objeto que guarda los datos del usuario
       const usuario = {
        nombre: usuario_input,
        password: password_input,
      };
      //Realiza la solicitud POST al servidor
      fetch('/dependientes/login', {method: 'POST', 
                             headers: {'Content-Type': 'application/json'},
                             body: JSON.stringify(usuario)})
      .then(response => {
      //Una respuesta es exitosa si el codigo de estado esta en el rango 200-299
      if (!response.ok) {
        //Recupera el mensaje de error del servidor
        return response.text().then(mensaje_error => {
          //Muestra el mensaje de error
          alert(mensaje_error);
          //Lanza un error para pasar al bloque .catch
          throw new Error('Error al iniciar sesion');
        });
      }
      //Respuesta exitosa
      abrirPanel();
      return response.text();
      
    })
    .then(mensaje_servidor => {
      alert(mensaje_servidor);
      
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
    }
  }

  function abrirPanel(){
    window.location.href = 'dependiente/panel-control/dep_control.html';
  }


  let btn_iniciar_sesion = document.getElementById("iniciar_sesion");
  btn_iniciar_sesion.onclick = function(){
    iniciarSesion();
  }

  function volverAtras(){
    window.location.href = "../panel-control/dep_control.html";
  }