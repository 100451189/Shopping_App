let usuario = sessionStorage.getItem('usuario');

let qrcodeITEM = new QRCode(document.getElementById('qrcode'));

// Se coge el boton para generar el QR

let btn_QR = document.getElementById("btn_QR");
btn_QR.onclick = function (){
    qrcodeITEM.makeCode(usuario);
    btn_QR.style.display = 'none'
}





// Funcion que carga los elemntos HTML cuando se haya validado la compra
function validacionExitosa() {
    // Hacer vibrar el dispositivo
    if ('vibrate' in navigator) {
        navigator.vibrate(700); // Vibrar durante 200 milisegundos
    }

    const audio = new Audio('audio.mp3');
    audio.play();

    let modal = document.getElementById('myModal')
    modal.style.display = 'block'

    // Se cierra sesion
    sessionStorage.clear();

    setTimeout(function() {
        // Se espera segundo y medio y se vuelve a la pagina inicial
        window.location.href = "../../cliente.html"
    }, 1500);
    



}



// Funcion que manda una peticion al servidor para ver si se ha validado la compra
function esperarValidacion(usuario){
    console.log(1)
    
    fetch(`/validacion/${usuario}`)
    .then(response => {
        if (!response.ok) {
        throw new Error('Error al obtener la validacion de la compra');
        }
        return response.json();
    })
    .then(pagado => {
        console.log(pagado)
        if (pagado == false){
            validacionExitosa();
            clearInterval(intervaloID);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    


}

const intervalo = 1000;
let intervaloID = setInterval(() => esperarValidacion(usuario), intervalo);