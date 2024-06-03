function abrirTiendaOnline(){
    //Funcion para abrir la ventana principal de la tienda
    window.location.href = '../tienda.html';
  }

  function abrirProducto(productoID){
    window.location.href = '../producto/info_producto.html?producto=' + productoID; // Se envia el ID prodcuto en la url
  
  }



  Quagga.init({
    inputStream : {
      name : "Live",
      type : "LiveStream",
      target: document.querySelector('#camera')    // Or '#yourElement' (optional)
    },
    decoder : {
      readers : ["code_128_reader"]
    }
  }, function(err) {
      if (err) {
          console.log(err);
          return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
  });

  Quagga.onDetected(function (data){
    console.log(data.codeResult.code);
    abrirProducto(data.codeResult.code);
  })



