"use strict";

// method to parse the json response object
var parseJSON = function parseJSON(xhr, content) {
  if (xhr.response) {
    var obj = JSON.parse(xhr.response);
    console.dir(obj); //if message in response, add to screen

    if (obj.message) {
      console.dir(obj.message);
      var p = document.createElement('p');
      p.textContent = "Message: ".concat(obj.message);
      content.appendChild(p);
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

  if (statusTitles[xhr.status]) {
    content.innerHTML = statusTitles[xhr.status];
  } else {
    content.innerHTML = statusTitles["default"];
  }

  parseJSON(xhr, content);
}; // send ajax


var sendAjax = function sendAjax(e, form) {
  //cancel browser's default action
  e.preventDefault(); // get the method from the form

  var method = form.getAttribute('method'); // variables for request

  var url = '/';
  var methodSelect = method;
  var data = '';

  if (method === 'post') {
    url = form.getAttribute('action'); // get data to send

    var titleField = form.querySelector('#titleField');
    var dayField = form.querySelector('#dayField');
    var mealTypeField = form.querySelector('#mealTypeField');
    data = "title=".concat(titleField.value, "&mealType=").concat(mealTypeField.options[mealTypeField.selectedIndex].value, "&day=").concat(dayField.options[dayField.selectedIndex].value); // const dateField = form.querySelector('#dateField');
    // data = `title=${titleField.value}&date=${dateField.value}`;
  } else if (method === 'get') {
    // get selected url and method
    url = document.querySelector('#urlField').value;
    methodSelect = document.querySelector('#methodSelect').value.toUpperCase();
  } // send request


  var xhr = new XMLHttpRequest();
  xhr.open(methodSelect, url);
  xhr.setRequestHeader("Accept", 'application/json');

  xhr.onload = function () {
    return handleResponse(xhr, methodSelect);
  };

  xhr.send(data);
  return false;
}; // initialization


var init = function init() {
  var addMealForm = document.querySelector("#addMealForm");
  var mealForm = document.querySelector("#mealForm");

  var addMeal = function addMeal(e) {
    return sendAjax(e, addMealForm);
  };

  var getMeals = function getMeals(e) {
    return sendAjax(e, mealForm);
  };

  addMealForm.addEventListener('submit', addMeal);
  mealForm.addEventListener('submit', getMeals);
};

window.onload = init;
