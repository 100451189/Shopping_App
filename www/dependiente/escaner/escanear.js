
function volverAtras(){
    window.location.href = "../panel-control/dep_control.html";
  }



  let scanner = new Html5QrcodeScanner('reader', {
    qrbox: {
        width: 250,
        height: 250,
    },
    fps:20
    
});


scanner.render(success, error);

function success(result){
    sessionStorage.setItem('usuario_scan', result)
    scanner.clear();
    window.location.href = "validar/validar.html";
}

function error(err){
    console.error(err);
}