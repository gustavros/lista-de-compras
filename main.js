// ! SELECT ITEMS

const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitButton = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearButton = document.querySelector(".clear-btn");

// ! edit option

let editElement;
let editFlag = false;
let editID = "";

// ! EVENT LISTENERS

// ! submit form
form.addEventListener("submit", addItem);

// ! clear list
clearButton.addEventListener("click", clearList);

// ! load items

window.addEventListener("load", setupItems);

// ! delete item from list

const deleteBtn = document.querySelector(".delete-btn");

// ! FUNCTIONS

function addItem(e) {
  e.preventDefault();

  const value = grocery.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    createListItem(id, value);

    displayAlert(`${value} adicionado na lista!`, "success");
    container.classList.add("show-container");

    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;

    displayAlert(`${value} foi editado com sucesso!`, "success");

    editLocalStorage(editID, value);
    setBackToDefault();
  }
}

function clearList() {
  const items = document.querySelectorAll(".grocery-item");

  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }

  container.classList.remove("show-container");

  displayAlert("Lista limpa com sucesso!", "success");
  setBackToDefault();
  localStorage.removeItem("list");
}

// ! edit item

function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement; // ! pegando o article

  // ! set edit item

  editElement = e.currentTarget.parentElement.previousElementSibling;

  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  grocery.focus();

  submitButton.textContent = "Editar";
}

// ! delete item

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;

  const id = element.dataset.id;

  list.removeChild(element);

  displayAlert(
    `${element.querySelector(".title").textContent} excluído da lista`,
    "success"
  );

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }

  setBackToDefault();
  removeFromLocalStorage(id);
}

// ! display a alert message

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// ! set back to default

function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";

  submitButton.textContent = "Adicionar";
}

// ! LOCAL STORAGE

function addToLocalStorage(id, value) {
  const grocery = { id, value };

  let items = getLocalStorage();

  console.log(items);

  items.push(grocery);

  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter((item) => item.id !== id); // ! se o id for diferente do id que está sendo removido

  console.log(`${id} removed from local storage`);

  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items.forEach((item) => {
    if (item.id === id) {
      item.value = value;
    }
  });

  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

// ! SETUP ITEMS

function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });

    container.classList.add("show-container");
  }
}

function createListItem(id, value) {
  const element = document.createElement("article");

  element.classList.add("grocery-item");
  const attr = document.createAttribute("data-id");

  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `
    <p class="title">${value}</p>
      <div class="btn-container">
          <button type="button" class="edit-btn" title="Editar">
              <i class="fas fa-edit"></i>
          </button>
          <button type="button" class="delete-btn" title="Excluir">
              <i class="fas fa-trash"></i>
          </button>
      </div>
    `;
  const deleteBtn = element
    .querySelector(".delete-btn")
    .addEventListener("click", deleteItem);

  const editBtn = element
    .querySelector(".edit-btn")
    .addEventListener("click", editItem);

  list.appendChild(element);
}
