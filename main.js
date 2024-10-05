const list = document.getElementById("sub-tasks")

const subTaskInput = document.getElementById("subTask");
const subTaskManager = new SubTaskManager(subTaskInput, list);

// Añade un listener para el evento 'keydown' en el input de sub-tarea
subTaskInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') { // Verifica si la tecla presionada es Enter
    subTaskManager.add(); // Llama a la función de agregar
    event.preventDefault(); // Previene el comportamiento por defecto
  }
});



const params = {
  tagTasks: document.getElementById("divTasks"),
  subTaskManager: subTaskManager,
  tagTitle: document.getElementById("titleTask"),
  tagStart: document.getElementById("startTask"),
  tagEnd: document.getElementById("endTask"),
};

const taskManager = new TaskManager(params);

// Inicialización del modal
const myModal = new Modal(taskManager);
myModal.init();