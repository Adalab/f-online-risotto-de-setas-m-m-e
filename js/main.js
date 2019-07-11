'use strict';

// elements to use
const title = document.querySelector('.header__title');
const list = document.querySelector('.ingredients__list');
// btn__select-all
// btn__select-none
// ingredients__list__item
// ingredient__info
// ingredient__name
// ingredient__brand
// ingredient__weight
// ingredient__cost
// chosen__number
// subtotal__text
// subtotal__cost
// delivery__costs__text
// delivery__costs__cost
// total__text
// total__cost
// btn__purchase

const ENDPOINT = 'https://raw.githubusercontent.com/Adalab/recipes-data/master/rissoto-setas.json';

// show title
const printTitle = data => {
  title.innerHTML = data.name;
};

// print list of items
const printIngredients = data => {
  Object.values(data.ingredients).map(item => {
      const newItem = document.createElement('li');
      newItem.classList.add('ingredients__list__item');
      newItem.classList.add('list-group-item');

      const newCheckbox = document.createElement('input');
      newCheckbox.classList.add('ingredient__select');
      newCheckbox.type = "checkbox";

      const newNumberInput = document.createElement('input');
      newNumberInput.classList.add('ingredient__quantity');
      newNumberInput.type = "text";
      newNumberInput.value = 1;

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
      console.log(data);
      printTitle(data.recipe);
      printIngredients(data.recipe);
      return data;
    })
    .catch(error => console.error(error));
}


// define what to print for each list item

// take input from each item amount and update cost

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