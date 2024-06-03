function pagar(){
  let usuario = sessionStorage.getItem('usuario')
    let peticion = {
      nombre: usuario
    }
    fetch('/carrito/pagado', {method: 'POST', 
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
        throw new Error('Error al verificar compra');
    });
    }
    //Respuesta exitosa
    // AGREGAR POPUP
    window.location.href = "QR.html";
    })
    .then(mensaje_servidor => {
        
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
}

// Boton de efectivo 
let btn_efectivo = document.getElementById("boton_efectivo");
btn_efectivo.onclick = function (){
  pagar();
}


function comprobar_campos_paypal() {

  const email = document.getElementById('correo_paypal').value;
  const password = document.getElementById('password_paypal').value;

  if (!email || !password) {
    mostrar_popup('Rellene todos los campos');
    return;
  } else {
    const regex_arroba_punto = /@.*\./;
    if (regex_arroba_punto.test(email) === false) {
      mostrar_popup('Email no valido');
      return;
    }

    // Informacion valida -> pagar
    pagar();
  }
}

function comprobar_campos_tarjeta() {

  const nombre = document.getElementById('nombre_tarjeta').value;
  const fecha_nac = document.getElementById('fecha_nac_tarjeta').value;
  const direccion = document.getElementById('direccion_tarjeta').value;
  const ciudad = document.getElementById('ciudad_tarjeta').value;
  const pais = document.getElementById('pais_tarjeta').value;
  const numero = document.getElementById('numero_tarjeta').value;
  const fecha_cad = document.getElementById('fecha_cad_tarjeta').value;
  const cvv = document.getElementById('cvv_tarjeta').value;

  if (!nombre || !fecha_nac || !direccion || !ciudad || !pais || !numero || !fecha_cad || !cvv) {
    mostrar_popup('Rellene todos los campos');
    return;
  } else {
    const regex_fecha_nac = /^\d{2}-\d{2}-\d{4}$/;
    const regex_fecha_cad = /^\d{2}-\d{2}$/;
    const regex_solo_letras = /^[a-zA-Z]+$/;
    const regex_solo_numeros = /^[0-9]+$/;

    if (regex_solo_letras.test(nombre) === false) {
      mostrar_popup('El nombre tiene formato incorrecto');
      return;
    } else if (regex_fecha_nac.test(fecha_nac) === false) {
      mostrar_popup('La fecha de nacimiento tiene formato incorrecto');
      return;
    } else if (regex_solo_letras.test(ciudad) === false) {
      mostrar_popup('La ciudad tiene formato incorrecto');
      return;
    } else if (regex_solo_letras.test(pais) === false) {
      mostrar_popup('El pais tiene formato incorrecto');
      return;
    } else if (regex_solo_numeros.test(numero) === false) {
      mostrar_popup('El numero de la tarjeta tiene formato incorrecto');
      return;
    } else if (regex_fecha_cad.test(fecha_cad) === false) {
      mostrar_popup('La fecha de caducidad tiene formato incorrecto');
      return;
    } else if (regex_solo_numeros.test(cvv) === false) {
      mostrar_popup('El CVV tiene formato incorrecto');
      return;
    }

    // Tarjeta valida -> pagar
    pagar();
}
}

function mostrar_popup(mensaje) {
  document.getElementById('contenido-popup').innerHTML = mensaje;
  const ancho_mensaje = document.getElementById('contenido-popup').offsetWidth;
  document.getElementById('popup').width = ancho_mensaje + 'px';
  // Muestra el popup
  setTimeout(() => document.getElementById('popup').style.display = 'block', 0);
  // Oculta el popup despues de 2 segundos
  setTimeout(() => document.getElementById('popup').style.display = 'none', 1250);
}









function actualizarTotal(){// Actualizar valor del precio total:
  let ItemTotal = document.getElementById("precio_final");
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




