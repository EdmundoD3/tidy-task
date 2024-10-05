function btnDanger({fn, classList = ["delete-btn"]}) {
  const divRemove = document.createElement("div");
  const buttonRemove = document.createElement("input");
  buttonRemove.value = "X";
  buttonRemove.className = "btn-danger"
  
  buttonRemove.type = "button";
  divRemove.appendChild(buttonRemove);
  classList.forEach(cls => divRemove.classList.add(cls));
  buttonRemove.addEventListener("click", fn);
  return divRemove
}