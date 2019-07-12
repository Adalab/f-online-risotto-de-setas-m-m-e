'use strict';

// elements to use
const title = document.querySelector('.header__title');
const list = document.querySelector('.ingredients__list');
const ingredientCost = document.querySelector('.ingredient__cost');
const chosenNumber = document.querySelector('.chosen__number');
const subtotalContainer = document.querySelector('.subtotal__cost');
const deliveryCost = document.querySelector('.delivery__costs__cost');
const totalContainer = document.querySelector('.total__cost');
const purchaseButton = document.querySelector('.btn__purchase');
const selectAllButton = document.querySelector('.btn__select-all');
const deselectAllButton = document.querySelector('.btn__deselect-all');

let recipeData;
let subtotal = 0;
let total = 0;
let chosenItems = [];
let totalItems = 0;

const ENDPOINT = 'https://raw.githubusercontent.com/Adalab/recipes-data/master/rissoto-setas.json';

const printTitle = data => {
  title.innerHTML = data.name;
};

const updateQuantity = event => {
  const quantity = event.currentTarget.value;
  updateCost(event, quantity);
  return quantity;
};

const findCost = ingredient => {
  const price = ingredient[0].price;
  return price;
}

const findParent = element => {
  const parent = element.parentElement;
  return parent;
};

const findIngredient = parent => {
  const ingredient = parent.querySelector('.ingredient__name');
  const currentIngredient = recipeData.ingredients.filter(item => item.product === ingredient.innerHTML);
  return currentIngredient;
};

const updateCost = (event, quantity) => {
  const parent = findParent(event.currentTarget);
  const ingredient = findIngredient(parent);
  const cost = findCost(ingredient);
  const costText = parent.querySelector('.ingredient__cost');

  if (quantity > 0){
    const totalCost = (cost * quantity).toFixed(2);
    costText.innerHTML = `${totalCost} €`;
  }
};

const updateSubtotal = (cost, checked) => {
  if (checked === true && subtotal > cost) {
    subtotal += cost;
  } else if (subtotal > cost){
    subtotal -= cost;
  }
  subtotalContainer.innerHTML = `${subtotal.toFixed(2)}€`;
  return subtotal.toFixed(2);
};

const showTotal = total => {
  purchaseButton.innerHTML = `Buy ingredients now: ${total}€`
};

const updateTotal = (cost, checked) => {
  if (checked === true) {
    total += cost;
  } else if (total >= cost) {
    total -= cost;
  }
  let fixedTotal = total.toFixed(2);
  if (totalItems !== 0){
    console.log(fixedTotal);
    const newTotal = parseFloat(fixedTotal) + 7;
    totalContainer.innerHTML = `${newTotal.toFixed(2)}€`;
    showTotal(newTotal.toFixed(2));
    return fixedTotal;
  } else {
    const newTotal = parseFloat(fixedTotal);
    totalContainer.innerHTML = `${newTotal.toFixed(2)}€`;
    showTotal(newTotal.toFixed(2));
    return fixedTotal;
  }
};

const updateChosenNumber = (newNumber, checked) => {
  if (checked === true) {
    totalItems += newNumber;
    chosenNumber.innerHTML = `Items: ${totalItems}`;
  } else {
    totalItems -= newNumber;
    chosenNumber.innerHTML = `Items: ${totalItems}`;
  }
};

const updateAll = (element, checked) => {
  const parent = findParent(element);
  const ingredient = findIngredient(parent);
  const numberOfItem = parent.querySelector('.ingredient__quantity');
  const intOfItem = parseInt(numberOfItem.value);
  const costOfItem = parent.querySelector('.ingredient__cost');
  const intCostOfItem = parseFloat(costOfItem.innerHTML);
  const key = chosenItems.findIndex(item => item.product === ingredient[0].product);

  if (checked === true){
    const newIngredient = {...ingredient[0], number: intOfItem};
    chosenItems.push(newIngredient);
    updateChosenNumber(newIngredient.number, checked);
  } else if (key >= 0) {
    const removedItem = chosenItems.splice(key, 1);
    updateChosenNumber(removedItem[0].number, checked);
  }
  updateSubtotal(intCostOfItem, checked);
  updateTotal(intCostOfItem, checked);
  return chosenItems;
};

const handleCheckbox = event => {
  const checked = event.currentTarget.checked;
  updateAll(event.currentTarget, checked);
};

const printIngredients = data => {
  Object.values(data.ingredients).map(item => {
      const newItem = document.createElement('li');
      newItem.classList.add('ingredients__list__item');
      newItem.classList.add('list-group-item');

      const newCheckbox = document.createElement('input');
      newCheckbox.classList.add('ingredient__select');
      newCheckbox.type = "checkbox";
      newCheckbox.addEventListener('click', handleCheckbox);

      const newNumberInput = document.createElement('input');
      newNumberInput.classList.add('ingredient__quantity');
      newNumberInput.type = "text";
      newNumberInput.value = 1;
      newNumberInput.addEventListener('input', updateQuantity);

      const newContainer = document.createElement('div');
      newContainer.classList.add('ingredient__info');

      const newName = document.createElement('h3');
      newName.classList.add('ingredient__name');
      const newNameContent = document.createTextNode(item.product);

      const newBrand = document.createElement('p');
      newBrand.classList.add('ingredient__brand');
      const newBrandContent = document.createTextNode(item.brand || '');

      const newWeight = document.createElement('p');
      newWeight.classList.add('ingredient__weight');
      const newWeightContent = document.createTextNode(item.quantity);

      const newCost = document.createElement('p');
      newCost.classList.add('ingredient__cost');
      const newCostContent = document.createTextNode(`${item.price.toFixed(2)} ${data.currency}`);

      newCost.appendChild(newCostContent);

      newName.appendChild(newNameContent);
      newBrand.appendChild(newBrandContent);
      newWeight.appendChild(newWeightContent);

      newContainer.appendChild(newName);
      newContainer.appendChild(newBrand);
      newContainer.appendChild(newWeight);

      newItem.appendChild(newCheckbox);
      newItem.appendChild(newNumberInput);
      newItem.appendChild(newContainer);
      newItem.appendChild(newCost);

      list.appendChild(newItem);
  })
};

// fetch data
const fetchData = () => {
  fetch(ENDPOINT)
    .then(res => res.json())
    .then(data => {
      recipeData = data.recipe;
      printTitle(data.recipe);
      printIngredients(data.recipe);
      return data;
    })
    .catch(error => console.error(error));
}


const toggleAll = event => {
  const allCheckboxes = document.querySelectorAll('.ingredient__select');
  const target = event.currentTarget;
  if (target.id === 'select') {
    for (const checkbox of allCheckboxes){
      checkbox.checked = true;
    }
  } else {
    for (const checkbox of allCheckboxes){
      checkbox.checked = false;
    }
  }
  for (const checkbox of allCheckboxes){
    updateAll(checkbox, checkbox.checked);
  }
}

const addListeners = () => {
  selectAllButton.addEventListener('click', toggleAll);
  deselectAllButton.addEventListener('click', toggleAll);
};

const init = () => {
  fetchData();
  addListeners();
}

window.onload = init;