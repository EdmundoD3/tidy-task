class Database {
  constructor(nameStorage) {
    this.nameStorage = nameStorage
    this.storageLastId = "lastId"
  }
  get lastId() {
    const id = localStorage.getItem(this.storageLastId)
    return Number(id)
  }
  set lastId(id = 0) {
    if (id < 0) throw new Error("no se pudo almacenar los datos")
    const strId = String(id)
    localStorage.setItem(this.storageLastId, strId)
  }
  get storage() {
    return localStorage.getItem(this.nameStorage)
  }
  get items() {
    return JSON.parse(this.storage)
  }
  set items(items) {
    localStorage.setItem(this.nameStorage,
      JSON.stringify(items))
  }
}
/**
 * Clase para manejar una tarea con subtareas.
 * 
 * @constructor
 * @param {Object} options - Opciones para crear la tarea.
 * @param {number} options.id - El ID único de la tarea.
 * @param {string} options.title - El título de la tarea.
 * @param {SubTask[]} [options.list=[new SubTask({title:null})]] - Lista de subtareas (opcional, por defecto una subtarea vacía).
 * @param {string} [options.start] - Hora de inicio de la tarea (opcional).
 * @param {string} [options.end] - Hora de fin de la tarea (opcional).
 * @throws {Error} Si no se proporciona un título.
 */
class Task {
  constructor({ id, title, subTasks = [], start, end }) {
    if (!title) throw new Error("Falta title");

    this.id = id;
    this.title = title;
    this.subTasks = subTasks;
    this.start = start;
    this.end = end;
  }

  createElement(div, fnUpdate) {
    // Agregamos el título
    const h3 = document.createElement("h3");
    h3.className = "box-task-title";
    h3.textContent = this.title;
    div.appendChild(h3);

    // Agregamos la hora de inicio
    if (this.start) {
      const startTime = document.createElement("time");
      startTime.className = "box-task-start-time";
      startTime.textContent = `Inicio: ${this.start}`;
      div.appendChild(startTime);
    }
    // fin
    if (this.end) {
      const endTime = document.createElement("time");
      endTime.className = "box-task-end-time";
      endTime.textContent = `Fin: ${this.end}`;
      div.appendChild(endTime);
    }


    // Agregamos las subTareas
    const ol = document.createElement("ol");
    ol.className = "ol-sub-task";
    this.subTasks.forEach((e, index) => {
      const update = () => fnUpdate(index)
      const li = e.createList({ update });
      ol.appendChild(li);
    });
    div.appendChild(ol);

    // Aquí puedes agregar más elementos como el botón de eliminar
  }
}


class TaskManager {
  lastId = 1;
  tagTasks = null;
  subTaskManager = new SubTaskManager();
  tagTitle = null;
  tagStart = null;
  tagEnd = null;
  draggedTaskId = null;
  editId = null;
  tasks = [new Task({
    id: 1, title: "Agregar task", subTasks: [
      new SubTask({ title: "Puedes arrastrar las tareas para intercambiarlas" }),
      new SubTask({ title: "Puedes editar las tareas con doble click en la tarea" }),
      new SubTask({ title: "Puedes eliminar una tarea con el boton rojo en la esquina de cada tarea" })

    ]
  })] //en caso de que al inicializar no existan task agrego uno de muestra
  nameLabelStorage = "tasks";

  constructor({ tagTasks, tagTitle, subTaskManager, tagStart, tagEnd }) {

    this.tagTasks = tagTasks;
    this.subTaskManager = subTaskManager;
    this.tagTitle = tagTitle;
    this.tagStart = tagStart;
    this.tagEnd = tagEnd;
    this.database = new Database(this.nameLabelStorage)
    if (this.database.storage) { //si hay task almacenados los recupero
      this.tasks = this.database.items.map(e => new Task({ ...e, subTasks: e.subTasks?.map(li => new SubTask(li)) }))
      this.lastId = this.database.lastId
      this.refresh();
    } else {
      this.refresh()
    }
  }

  add() {
    try {
      if(this.tasks.length >= 50) return errorAlert("Alcanzo el maximo de tareas permitidas, favor de eliminar algunas",5000)
      this.lastId++;
      this.database.lastId = this.lastId //actualizamos el id
      const taskData = this.getTaskForm()
      const newTask = new Task({ id: this.lastId, ...taskData })
      this.tasks.push(newTask);
      this.saveTask()

      this.tagTitle.focus();
      exitAlert('¡Datos guardados exitosamente!', 2000)
      this.refresh();
    } catch (error) {
      alert(error)
    }
  }
  getTaskForm() {
    const title = this.tagTitle.value;
    const subTasks = this.subTaskManager.getSubTask();
    const start = this.tagStart.value;
    const end = this.tagEnd.value;
    if (!title) {
      throw new Error("Faltan campos obligatorios");
    }
    const taskData = { title, subTasks, start, end };
    return taskData
  }
  saveTask() {
    this.database.items = this.tasks;
  }
  interchangeTask(draggedId, droppedId) {
    const draggedIndex = this.tasks.findIndex(task => task.id === draggedId);
    const droppedIndex = this.tasks.findIndex(task => task.id === droppedId);
    const [first, second] = [this.tasks[draggedIndex], this.tasks[droppedIndex]]
    this.tasks[draggedIndex] = second
    this.tasks[droppedIndex] = first
    this.saveTask()
    this.refresh()
  }
  edit() {
    const id = this.editId
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      // Si el índice es válido, reemplazamos el objeto en esa posición
      const taskData = this.getTaskForm()
      const editedTask = new Task({ id, ...taskData })
      this.tasks[index] = editedTask;
    }
    this.saveTask()
    exitAlert('¡Datos editados exitosamente!', 2000)
    this.cleanTask()
    Modal.close()
    this.refresh()
  }
  checkBox(taskId, subTaskIndex) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      const subTask = task.subTasks[subTaskIndex];
      subTask.check = !subTask.check; // Cambia el estado del checkbox
      this.database.items = this.tasks; // Actualiza la base de datos
    }
    this.saveTask()
  }
  remove(id) {
    this.tasks = this.tasks.filter(e => e.id !== id);
    this.database.items = this.tasks;
    this.refresh();
  }
  cleanTask() {
    this.subTaskManager.value = "";
    this.tagTitle.value = "";
    this.tagStart.value = "";
    this.tagEnd.value = "";
    this.subTaskManager.cleanList();
    this.editId = null
  }
  refilModal(id) {
    this.editId = id
    const task = this.tasks.find(e => this.editId == e.id)
    const { title, subTasks, start, end } = task
    this.tagTitle.value = title;
    this.tagStart.value = start || "";
    this.tagEnd.value = end || "";
    this.subTaskManager.refill(subTasks);
  }
  refresh() {
    this.cleanTask()
    const fragment = document.createDocumentFragment();
    this.tasks.forEach((e) => {
      const div = this.createTask(e)
      fragment.appendChild(div);
    });
    this.tagTasks.innerHTML = "";
    this.tagTasks.appendChild(fragment);
  }
  createTask(e = new Task({})) {
    const div = document.createElement("div");
    div.draggable = true
    // edit
    const edit = () => {
      this.refilModal(e.id)
      Modal.openModalEdit()
    }
    //modal
    div.addEventListener('dblclick', edit)


    // dragging 
    div.addEventListener('dragstart', (event) => {
      this.draggedTaskId = e.id
      div.classList.add('dragging');
    })

    // Remover clase al terminar el arrastre
    div.addEventListener('dragend', () => {
      div.classList.remove('dragging');
    });
    div.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    div.addEventListener('dragenter', (event) => {
      div.classList.add('over');
    });

    div.addEventListener('dragleave', (event) => {
      const related = event.relatedTarget;

      // Solo quitar la clase si el relatedTarget no es un descendiente del div
      if (!div.contains(related)) {
        div.classList.remove('over');
      }
    });
    div.addEventListener('drop', (event) => {
      event.preventDefault();
      div.classList.remove('over');
      // Si hay una tarea arrastrada, proceder al intercambio
      if (this.draggedTaskId !== null && this.draggedTaskId !== e.id) {
        // Intercambia las tareas en la lista
        this.interchangeTask(this.draggedTaskId, e.id);
        this.draggedTaskId = null;
      }
    });

    // Soporte para móviles con eventos táctiles
    let lastTap = 0;

    div.addEventListener('touchstart', function (event) {

    });
    let initialX, initialY, offsetX, offsetY, draggedTask, isDragging = false;
    const isDobleTab = doubleTab()
    div.addEventListener('touchstart', (event) => {

      if (isDobleTab()) {
        edit()
      } else {
        this.draggedTaskId = e.id
        draggedTask = event.target.id;
        div.classList.add('dragging');

        // Guardar las posiciones iniciales del toque
        initialX = event.touches[0].clientX;
        initialY = event.touches[0].clientY;
        isDragging = true;
      }

    });
    let overId = null
    div.addEventListener('touchmove', (event) => {
      if (!isDragging) return;

      // Prevenir el scroll en la pantalla mientras se arrastra
      event.preventDefault();

      // Actualizar la posición del elemento
      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;
      offsetX = currentX - initialX;
      offsetY = currentY - initialY;

      // Ocultar temporalmente el elemento que se está arrastrando
      div.style.visibility = 'hidden';

      // Obtener el elemento en la posición del toque
      const dropzone = document.elementFromPoint(currentX, currentY);

      // Volver a mostrar el elemento
      div.style.visibility = 'visible';

      // Si el dropzone es válido, proceder
      const { id = null, element = null } = hasParentWithIdtaskBox(dropzone) || {};

      if (overId !== id) {
        // Limpiar clases anteriores
        document.querySelectorAll('.taskBox').forEach((zone) => {
          zone.classList.remove('over');
        });
      }

      if (element) {
        overId = id;
        element.classList.add('over');
      }
    });
    div.addEventListener('touchend', (event) => {
      div.classList.remove('dragging');
      isDragging = false;
      div.style.transform = `translate(0px, 0px)`;
      // Intercambiar tareas si la zona de drop es válida
      if (this.draggedTaskId !== null && overId !==null && this.draggedTaskId !== overId) {
        console.log("entra",overId,this.draggedTaskId);
        this.interchangeTask(this.draggedTaskId, overId);
        this.draggedTaskId = null;
      }

    });

    //******************** */


    div.className = "taskBox";
    const id = e.id
    div.id = `taskBox-id-${id}`
    const checkBox = (index) => this.checkBox(id, index)
    e.createElement(div, checkBox);

    // delete button
    const deletefn = () => {
      const confirmed = confirm("¿Estás seguro de que deseas eliminar esta tarea?");
      if (confirmed) {
        this.remove(e.id);
        exitAlert("La tarea se ha eliminado")
      }
    }
    const divRemove = btnDanger({ fn: deletefn })
    div.appendChild(divRemove);
    return div
  }
}
