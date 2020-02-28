"use strict";

// method to parse the json response object
var parseJSON = function parseJSON(xhr, content, form) {
  if (content.hasChildNodes()) {
    content.removeChild(content.firstChild);
  }

  if (xhr.response) {
    var obj = JSON.parse(xhr.response);
    console.dir(obj); //if message in response, add to screen

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

      for (var i = 0; i < dayFields.length; i++) {
        dayFields[i].selectedIndex = 0;
      }

      for (var i = 0; i < mealTypeFields.length; i++) {
        mealTypeFields[i].selectedIndex = 0;
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
    } //if users in response, add to screen


    if (obj.users) {
      console.dir(obj.users);
      var userList = document.createElement('p');
      var users = JSON.stringify(obj.users);
      userList.textContent = users;
      content.appendChild(userList);
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
};

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
  var addMealForm = document.querySelector("#addMealForm");
  var mealForm = document.querySelector("#mealForm");
  var searchMealsForm = document.querySelector("#searchMealsForm");
  var clearMealsForm = document.querySelector("#clearMealsForm");

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
  };

  addMealForm.addEventListener('submit', addMeal);
  mealForm.addEventListener('submit', getMeals);
  searchMealsForm.addEventListener('submit', searchMeals);
  clearMealsForm.addEventListener('submit', clearMeals);
  initialGet('GET', '/getMeals');
};

window.onload = init;
