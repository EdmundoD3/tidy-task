function hasParentWithId(element, id) {
  // Recorrer el árbol DOM hacia arriba hasta el documento
  while (element) {
    // Si el elemento actual tiene el ID, retornar true
    if (element.id === id) {
      return true;
    }
    // Avanzar al padre del elemento
    element = element.parentElement;
  }
  // Si no encontramos el ID en el árbol, retornar false
  return false;
}

function hasParentWithIdtaskBox(element) {
  while (element) {
    // Si el elemento actual tiene un ID que comienza con "taskBox-id-"
    if (element.id.startsWith("taskBox-id-")) {
      const storedId = element.id;
      const parts = storedId.split('-');
      const id = Number(parts[parts.length - 1]);
      return { id, element };
    }
    element = element.parentElement;
  }
  // Si no encontramos el ID en el árbol, retornar null (o cualquier valor que indique que no se encontró)
  return null;
}

const sanitizeInput = (str) => {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
};

const doubleTab = (tabtime = 300) => {
  let lastTap = 0;
  return () => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    lastTap = currentTime;
    return tapLength < tabtime && tapLength > 0
  }
}