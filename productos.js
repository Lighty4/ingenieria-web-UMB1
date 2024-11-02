var nombre = "";
var precio = "";

var usuario="";
var contraseña="";

fetch('http://localhost:3000/productos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nombre, precio })
  })
    .then(response => {
      if (response.ok) {
        console.log('Datos enviados exitosamente');
      } else {
        console.error('Error al enviar los datos');
      }
    })
    .catch(error => console.error('Error en la solicitud:', error));