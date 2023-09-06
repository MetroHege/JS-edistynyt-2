'use strict';

import {restaurantRow, restaurantModal, errorModal} from './components.js';
import {fetchData} from './functions.js';
import {apiUrl, positionOptions} from './variables.js';

const modal = document.querySelector('dialog');
modal.addEventListener('click', () => {
  modal.close();
});

const calculateDistance = (
  {latitude: x1, longitude: y1},
  {
    location: {
      coordinates: [x2, y2],
    },
  }
) => {
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return distance;
};

const createTable = (restaurants) => {
  document.querySelector('table').innerHTML = '';
  restaurants.forEach((restaurant) => {
    const tr = restaurantRow(restaurant);
    document.querySelector('table').appendChild(tr);
    tr.addEventListener('click', async () => {
      try {
        // remove all highlights
        const allHighs = document.querySelectorAll('.highlight');
        allHighs.forEach((high) => {
          high.classList.remove('highlight');
        });

        // add highlight
        tr.classList.add('highlight');
        // add restaurant data to modal
        modal.innerHTML = '';
        // fetch menu
        const menu = await fetchData(
          `${apiUrl}/restaurants/daily/${restaurant._id}/fi`
        );
        console.log(menu);

        const menuHtml = restaurantModal(restaurant, menu);

        modal.insertAdjacentHTML('beforeend', `<table>${menuHtml}</table>`);
        modal.showModal();
      } catch (error) {
        modal.innerHTML = errorModal(error.message);
        modal.showModal();
      }
    });
  });
};

const error = (err) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

const success = async (pos) => {
  try {
    const {coords: crd} = pos;
    const restaurants = await fetchData(`${apiUrl}/restaurants`);
    console.log(restaurants);

    restaurants.sort((a, b) => {
      const distanceA = calculateDistance(crd, a);
      const distanceB = calculateDistance(crd, b);
      return distanceA - distanceB;
    });
    createTable(restaurants);
    //buttons for filtering
    const sodexoBtn = document.querySelector('#sodexo');
    const compassBtn = document.querySelector('#compass');
    const resetBtn = document.querySelector('#reset');

    sodexoBtn.addEventListener('click', () => {
      const sodexoRestaurants = restaurants.filter(
        (restaurant) => restaurant.company === 'Sodexo'
      );
      createTable(sodexoRestaurants);
    });

    compassBtn.addEventListener('click', () => {
      const compassRestaurants = restaurants.filter(
        (restaurant) => restaurant.company === 'Compass Group'
      );
      createTable(compassRestaurants);
    });

    resetBtn.addEventListener('click', () => {
      createTable(restaurants);
    });
  } catch (error) {
    modal.innerHTML = errorModal(error.message);
    modal.showModal();
  }
};

navigator.geolocation.getCurrentPosition(success, error, positionOptions);
