// method to parse the json response object
const parseJSON = (xhr, content) => {
    if(xhr.response) {
      const obj = JSON.parse(xhr.response);
      console.dir(obj);
    
      //if message in response, add to screen
      if(obj.message) {
        console.dir(obj.message);
        const p = document.createElement('p');
        p.textContent = `Message: ${obj.message}`;
        content.appendChild(p);
      } 
    
      //if users in response, add to screen
      if(obj.users) {
        console.dir(obj.users);
        const userList = document.createElement('p');
        const users = JSON.stringify(obj.users);
        userList.textContent = users;
        content.appendChild(userList);
      }
    }
  };

  // list of status titles to print to the screen
  const statusTitles = {
    200: `<b>Success</b>`,
    201: `<b>Create</b>`,
    204: `<b>Updated (no content)</b>`,
    400: `<b>Bad Request</b>`,
    404: `<b>Resource Not Found</b>`,
    default: `<b>Success</b>`
  }

  // handles the response and printing it to the page
  const handleResponse = (xhr, method) => {
    const content = document.querySelector('#content');

    if (statusTitles[xhr.status]){
      content.innerHTML = statusTitles[xhr.status];
    } else {
      content.innerHTML = statusTitles.default;
    }
    
    parseJSON(xhr, content);
  };
  
  // send ajax
  const sendAjax = (e, form) => {
    //cancel browser's default action
    e.preventDefault();

    // get the method from the form
    const method = form.getAttribute('method');

    // variables for request
    let url = '/';
    let methodSelect = method;
    let data = '';

    if(method === 'post'){  
      url = form.getAttribute('action');

      // get data to send
      const titleField = form.querySelector('#titleField');
      const dayField = form.querySelector('#dayField');
      const mealTypeField = form.querySelector('#mealTypeField');
      data = `title=${titleField.value}&mealType=${mealTypeField.options[mealTypeField.selectedIndex].value}&day=${dayField.options[dayField.selectedIndex].value}`;

      // const dateField = form.querySelector('#dateField');
      // data = `title=${titleField.value}&date=${dateField.value}`;
    } 
    else if(method === 'get') {
      // get selected url and method
      url = document.querySelector('#urlField').value;
      methodSelect = document.querySelector('#methodSelect').value.toUpperCase();
    }

    // send request
    const xhr = new XMLHttpRequest();
    xhr.open(methodSelect, url);
    xhr.setRequestHeader("Accept", 'application/json');
    xhr.onload = () => handleResponse(xhr, methodSelect);
    xhr.send(data);

    return false;
  };

  // initialization
  const init = () => {
    const addMealForm = document.querySelector("#addMealForm");
    const mealForm = document.querySelector("#mealForm");

    let addMeal = (e) => sendAjax(e, addMealForm);
    let getMeals = (e) => sendAjax(e, mealForm);

    addMealForm.addEventListener('submit', addMeal);
    mealForm.addEventListener('submit', getMeals);
  };

  window.onload = init;