'use strict';

// elements to use
const title = document.querySelector('.header__title');
const list = document.querySelector('.ingredients__list');
const ingredientCost = document.querySelector('.ingredient__cost');
const chosenNumber = document.querySelector('.chosen__number');

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

const findParent = event => {
  const parent = event.currentTarget.parentElement;
  return parent;
};

const findIngredient = parent => {
  const ingredient = parent.querySelector('.ingredient__name');
  const currentIngredient = recipeData.ingredients.filter(item => item.product === ingredient.innerHTML);
  return currentIngredient;
};

const updateCost = (event, quantity) => {
  const parent = findParent(event);
  const ingredient = findIngredient(parent);
  const cost = findCost(ingredient);
  const costText = parent.querySelector('.ingredient__cost');

  if (quantity > 0){
    const totalCost = (cost * quantity).toFixed(2);
    costText.innerHTML = `${totalCost} €`;
  }
};

const updateChosenNumber = () => {
  chosenNumber.innerHTML = `Items: ${chosenItems.length}`;
};

const handleCheckbox = event => {
  const checked = event.currentTarget.checked;
  const parent = findParent(event);
  const ingredient = findIngredient(parent);
  if (checked === true){
    chosenItems.push(ingredient[0]);
  } else {
    const key = chosenItems.findIndex(item => item.product === ingredient[0].product);
    chosenItems.splice(key, 1);
  }
  updateChosenNumber();
  return chosenItems;
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
      const newBrandContent = document.createTextNode(item.brand);

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
      console.log(recipeData);
      printTitle(data.recipe);
      printIngredients(data.recipe);
      return data;
    })
    .catch(error => console.error(error));
}

// update number of items chosen

// add subtotal of items

// add total cost including delivery costs

// show total price on purchase button

// checkbox ticked if item chosen - add to array

// select / deselect all buttons update checkboxes/chosen items


// call functions and add listeners
const init = () => {
  fetchData();
}

window.onload = init;