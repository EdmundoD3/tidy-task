// Obtener elementos del DOM
const modal = document.getElementById("myModal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const saveBtn = document.getElementById("add-task-btn");
const editBtn = document.getElementById("edit-task-btn");

class Modal {
  constructor (taskManager = new TaskManager()) {
    this.taskManager = taskManager
  }
  init() {
    // Abrir el modal
    openModalBtn.addEventListener("click", () => Modal.openModal());

    // Cerrar el modal con el botón "X"
    closeModalBtn.addEventListener("click", () => this.closeModal());

    // Evitar que el modal se cierre al hacer clic fuera de él (Static Backdrop)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        e.stopPropagation(); // Evita que el evento se propague y cierre el modal
      }
    });
  }

  static openModal() {
    modal.style.display = "block";
    saveBtn.classList.remove("ocult")
    editBtn.classList.add("ocult")
  }
  static openModalEdit(){
    modal.style.display = "block";
    saveBtn.classList.add("ocult")
    editBtn.classList.remove("ocult")
  }
  static close(){
    modal.style.display = "none";
    saveBtn.classList.add("ocult");
    editBtn.classList.add("ocult");
  }

  closeModal() {
    Modal.close()
    this.taskManager.cleanTask()
  }
}


