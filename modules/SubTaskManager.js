class SubTask {
  constructor({ title, check = false }) {
    this.title = title
    this.check = check
  }
  createList({ update, deleteTask, edit, interchange, index, length }) {
    const li = document.createElement("li");
    li.className = "li-checkbox";
    const spanContainer = document.createElement("span")
    spanContainer.className = "control-btns-container"
    // delete button
    if (deleteTask) {
      const deleteBtn = btnDanger({ fn: deleteTask, classList: ["delete-btn", "btn-list"] });
      spanContainer.appendChild(deleteBtn);

    }
    if (interchange) {
      const classButton = "move-btn";
      const span = document.createElement("span");
      span.className = "container-move-btn";
      const moveUpBtn = document.createElement("button");
      moveUpBtn.innerHTML = "&uarr;"; // ↑
      moveUpBtn.className = classButton;
      const moveDownBtn = document.createElement("button");
      moveUpBtn.textContent = "⬆️";
      moveDownBtn.textContent = "⬇️";
      moveDownBtn.className = classButton;
      if (index > 0) moveUpBtn.addEventListener("click", () => interchange(index - 1));
      if (index < length - 1) moveDownBtn.addEventListener("click", () => interchange(index + 1));
      span.appendChild(moveDownBtn);
      span.appendChild(moveUpBtn);
      spanContainer.appendChild(span);
    }
    if (spanContainer.hasChildNodes()) li.appendChild(spanContainer)

    // Agregar el texto de la tarea
    const spanSubTask = document.createElement("span")
    spanSubTask.className = "span-sub-task"

    if (!deleteTask) {
      // Crear el checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "sub-task-checkbox";
      checkbox.checked = this.check;
      // Llama a la función cuando cambie el checkbox
      checkbox.addEventListener('change', update);
      spanSubTask.appendChild(checkbox);

    }
    const subTaskTitle = document.createElement("span")
    subTaskTitle.textContent = sanitizeInput(this.title)
    subTaskTitle.className = "span-sub-title"
    spanSubTask.appendChild(subTaskTitle);
    if (edit) {
      spanSubTask.addEventListener("dblclick", edit)
      
      // Soporte para móviles con eventos táctiles
      const isDobleTab = doubleTab()
      spanSubTask.addEventListener("touchstart", (event) => {
        if (isDobleTab()) edit()
      })
    }

    li.appendChild(spanSubTask)


    return li;
  }
}
class SubTaskManager {
  constructor(subTaskInput, docList = document.createElement("ol")) {
    this.subTaskInput = subTaskInput;
    this.docList = docList
    this.list = []
  }
  addList(subTask = new SubTask({}), index) {
    const rud = {
      update: () => this.updateCheck(subTask),
      deleteTask: () => this.delete(index),
      edit: () => this.edit(index),
      interchange: (otherIndex) => this.interchange(index, otherIndex),
      index,
      length: this.list.length
    }
    const li = subTask.createList(rud);
    this.docList.appendChild(li);
    this.docList.style.display = "block";
    this.subTaskInput.value = ''; // Limpia el campo de entrada
  }
  edit(index) {
    const value = this.subTaskInput.value.trim();
    if(value) return errorAlert("elimina la sub tarea para poder editar la nueva")
    const subTask = this.list[index]
    this.delete(index)
    this.subTaskInput.value = subTask.title
  }
  delete(index) {
    this.list.splice(index, 1);
    exitAlert("Elimino una tarea")
    this.refill(this.list); // Vuelve a llenar la lista después de eliminar
  }
  interchange(firstIndex, secondIndex) {
    const first = this.list[firstIndex];
    this.list[firstIndex] = this.list[secondIndex];
    this.list[secondIndex] = first;
    this.refill(this.list); // Actualiza la lista visualmente y con índices correctos
  }
  add() {
    if(this.list.length>=25) return errorAlert("Alcanzo el maximo de sub tareas permitidas, si quiere agregar mas elimine alguna")
    const value = this.subTaskInput.value.trim();
    if (!value) return errorAlert("Para agregar una sub tarea, primero agregue una");

    const newSubTask = new SubTask({ title: value });
    this.list.push(newSubTask);
    exitAlert("Agrego una sub tarea")
    // Agregar la sub-tarea a la lista visual
    this.addList(newSubTask, this.list.length - 1);
    
  }
  cleanList() {
    this.clean()
    this.list = [];
  }
  clean() {
    this.docList.innerHTML = "";
    this.docList.style.display = "none";
    this.subTaskInput.value = '';
  }
  refill(subTasks = [new SubTask({})]) {
    this.cleanList()
    const length = subTasks.length
    subTasks.map((e, index) => {
      this.list.push(e);
      const rud = {
        update: () => this.updateCheck(e),
        deleteTask: () => this.delete(index),
        edit: () => this.edit(index),
        interchange: (otherIndex) => this.interchange(index, otherIndex),
        index,
        length
      }

      const li = e.createList(rud);
      this.docList.appendChild(li);
    })
    this.docList.style.display = "block";
  }
  updateCheck(subTask) {
    subTask.check = !subTask.check;
  }
  getSubTask() {
    return this.list;
  }
}
