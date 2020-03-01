"use strict";

// method to parse the json response object
var parseJSON = function parseJSON(xhr, content, form) {
  if (content.hasChildNodes()) {
    content.removeChild(content.firstChild);
  } // make sure there is a response


  if (xhr.response) {
    var obj = JSON.parse(xhr.response);
    console.dir(obj); // reset mealform to show by default

    var mealForm = document.querySelector("#mealForm");
    mealForm.style.display = 'block';
    var filteredMealForm = document.querySelector("#filteredMealForm");
    filteredMealForm.style.display = 'none'; //if message in response, add to screen

    if (obj.message) {
      console.dir(obj.message);

      if (xhr.status === 400) {
        var p = document.createElement('p');
        p.textContent = "".concat(obj.message);
        p.className = "content-warning";
        content.appendChild(p);
      }
    } // if cleared button is clicked, clear everything on the page


    if (obj.cleared) {
      // get meal p tags and clear them
      var mealItems = document.querySelectorAll(".mealText");

      for (var i = 0; i < mealItems.length; i++) {
        mealItems[i].textContent = "";
      } // get input stuff and clear them 


      var dayFields = document.querySelectorAll('#dayField');
      var mealTypeFields = document.querySelectorAll('#mealTypeField');

      for (var _i = 0; _i < dayFields.length; _i++) {
        dayFields[_i].selectedIndex = 0;
      }

      for (var _i2 = 0; _i2 < mealTypeFields.length; _i2++) {
        mealTypeFields[_i2].selectedIndex = 0;
      }

      var titleField = document.querySelector('#titleField');
      titleField.value = "";
    } // if all meals returned, print all meals to the page


    if (obj.meals) {
      for (var day in obj.meals) {
        for (var meal in obj.meals[day]) {
          var mealObj = obj.meals[day][meal];
          var specificDayCard = form.querySelector("#".concat(mealObj.day.toLowerCase()));
          var pTag = specificDayCard.querySelector("#".concat(mealObj.mealType.toLowerCase()));
          pTag.textContent = " ".concat(mealObj.title);
        }
      }
    } // if one meal returned, print meal data to page


    if (obj.meal) {
      var _day = obj.meal.day;
      var mealType = obj.meal.mealType;

      var _specificDayCard = form.querySelector("#".concat(_day.toLowerCase()));

      var _pTag = _specificDayCard.querySelector("#".concat(mealType.toLowerCase()));

      if (xhr.status === 201) {
        _pTag.textContent += " ".concat(obj.meal.title);
      } else if (xhr.status === 200) {
        _pTag.textContent = " ".concat(obj.meal.title);
      }
    } // if filtered by specific day and/or meal type


    if (obj.filteredBy) {
      var _mealForm = document.querySelector("#mealForm");

      _mealForm.style.display = 'none';

      var _filteredMealForm = document.querySelector("#filteredMealForm");

      _filteredMealForm.style.display = 'block';
      var div = document.getElementById('filteredMealDiv');
      var children = div.querySelectorAll('p');
      div.innerHTML = ''; // set the title for the meal (show day or meal type that was queried by)

      var title = document.createElement('h3');
      title.textContent = 'Meals';
      div.appendChild(title);

      if (obj.filteredBy === 'meal') {
        title.textContent += " - ".concat(obj.mealType);
      } else if (obj.filteredBy === 'day') {
        title.textContent += " - ".concat(obj.day);
      } // loop over the list of filtered meals and add them to the page


      for (var _meal in obj.filteredMeals) {
        var titleTag = document.createElement('p');
        var mealTag = document.createElement('p');
        var br = document.createElement('br');
        var br2 = document.createElement('br');
        _meal = _meal.split(' ').join('');
        titleTag.className = 'mealTitle';
        mealTag.className = 'mealText'; // set the titles and meal tags based on how it was queried 

        if (obj.filteredBy === 'meal') {
          titleTag.textContent = "".concat(obj.filteredMeals[_meal].day, ": ");
          mealTag.textContent = obj.filteredMeals[_meal].mealTitle;
        } else if (obj.filteredBy === 'day') {
          titleTag.textContent = "".concat(obj.filteredMeals[_meal].mealType, ": ");
          mealTag.textContent = obj.filteredMeals[_meal].mealTitle;
        } else if (obj.filteredBy === 'both') {
          titleTag.textContent = "".concat(obj.filteredMeals[_meal].day, ", ").concat(obj.filteredMeals[_meal].mealType, ": ");
          mealTag.textContent = obj.filteredMeals[_meal].mealTitle;
        } // append everything to the card


        div.appendChild(titleTag);

        if (obj.filteredBy === 'both') {
          div.appendChild(br2);
        }

        div.appendChild(mealTag);
        div.appendChild(br);
      }
    }
  }
}; // list of status titles to print to the screen


var statusTitles = {
  200: "<b>Success</b>",
  201: "<b>Create</b>",
  204: "<b>Updated (no content)</b>",
  400: "<b>Bad Request</b>",
  404: "<b>Resource Not Found</b>",
  "default": "<b>Success</b>"
}; // handles the response and printing it to the page

var handleResponse = function handleResponse(xhr, method) {
  var content = document.querySelector('#content');
  var form = document.querySelector('#mealForm');

  if (statusTitles[xhr.status]) {
    console.dir(statusTitles[xhr.status]);
  } else {
    console.dir(statusTitles["default"]);
  }

  parseJSON(xhr, content, form);
}; // send ajax


var sendAjax = function sendAjax(e, form) {
  //cancel browser's default action
  e.preventDefault(); // get the method from the form

  var method = form.getAttribute('method');
  var url = form.getAttribute('action'); // variables for request

  var data = '';
  var params = '';
  var dayField = form.querySelector('#dayField');
  var mealTypeField = form.querySelector('#mealTypeField');

  if (method === 'post') {
    // get data to send
    var titleField = form.querySelector('#titleField');
    data = "title=".concat(titleField.value, "&mealType=").concat(mealTypeField.options[mealTypeField.selectedIndex].value, "&day=").concat(dayField.options[dayField.selectedIndex].value);
  } else if (method === 'get') {
    if (url === '/searchMeals') {
      params = "?mealType=".concat(mealTypeField.options[mealTypeField.selectedIndex].value, "&day=").concat(dayField.options[dayField.selectedIndex].value);
    }
  } // send request


  var xhr = new XMLHttpRequest();
  xhr.open(method, url + params);
  xhr.setRequestHeader("Accept", 'application/json');

  xhr.onload = function () {
    return handleResponse(xhr, method);
  };

  xhr.send(data);
  return false;
}; // function to get the initial data


var initialGet = function initialGet(method, url) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Accept", 'application/json');

  xhr.onload = function () {
    return handleResponse(xhr, method);
  };

  xhr.send();
}; // initialization


var init = function init() {
  // get all forms
  var addMealForm = document.querySelector("#addMealForm");
  var mealForm = document.querySelector("#mealForm");
  var searchMealsForm = document.querySelector("#searchMealsForm");
  var clearMealsForm = document.querySelector("#clearMealsForm"); // ajax setup

  var addMeal = function addMeal(e) {
    return sendAjax(e, addMealForm);
  };

  var getMeals = function getMeals(e) {
    return sendAjax(e, mealForm);
  };

  var searchMeals = function searchMeals(e) {
    return sendAjax(e, searchMealsForm);
  };

  var clearMeals = function clearMeals(e) {
    return sendAjax(e, clearMealsForm);
  }; // add the listeners for different events


  addMealForm.addEventListener('submit', addMeal);
  mealForm.addEventListener('submit', getMeals);
  searchMealsForm.addEventListener('submit', searchMeals);
  clearMealsForm.addEventListener('submit', clearMeals); // get data on init

  initialGet('GET', '/getMeals');
}; // load window


window.onload = init;
