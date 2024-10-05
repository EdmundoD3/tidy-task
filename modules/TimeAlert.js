function showTimeAlert(msg = '¡Datos guardados exitosamente!', time = 3000, color = '#4CAF50') {
  // Crear el elemento de alerta
  const alertBox = document.createElement('div');
  alertBox.textContent = msg;
  alertBox.style.position = 'fixed';
  alertBox.style.top = '10px';
  alertBox.style.right = '10px';
  alertBox.style.padding = '15px';
  alertBox.style.backgroundColor = color; // Verde para éxito
  alertBox.style.color = 'white';
  alertBox.style.borderRadius = '5px';
  alertBox.style.fontSize = '16px';
  alertBox.style.zIndex = '1000';
  alertBox.style.opacity = '1'; // Comienza completamente visible
  alertBox.style.transition = 'opacity 1s'; // Transición suave de 1 segundo
  document.body.appendChild(alertBox);

  // Cambiar la opacidad para desvanecer el mensaje
  setTimeout(() => {
    alertBox.style.opacity = '0'; // Cambia a transparente
    // Remover el elemento una vez que la transición haya terminado
    setTimeout(() => {
      alertBox.remove();
    }, 1000); // Después de que la opacidad haya llegado a 0
  }, time); // Espera antes de empezar a desvanecer
}

function exitAlert(msg = '¡Datos guardados exitosamente!', time = 3000) {
  showTimeAlert(msg, time, '#5bc0de'); // Azul para éxito
}

function errorAlert(msg = 'Hubo un error al almacenar los datos', time = 3000) {
  showTimeAlert(msg, time, '#f44336'); // Rojo para error
}
