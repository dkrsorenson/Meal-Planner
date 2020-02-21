const users = {};
const meals = {};

// function to send a json object
const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

// function to respond without json body
const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // send response without json object, just headers
  response.writeHead(status, headers);
  response.end();
};

// function to get the users
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  if (request.method === 'HEAD') {
    return respondJSONMeta(request, response, 200);
  }

  return respondJSON(request, response, 200, responseJSON);
};

// function to get meta info about users
const getUsersMeta = (request, response) => {
  // return 200 without message, just the meta data
  respondJSONMeta(request, response, 200);
};

// function to add a user
const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  if (!body.name || !body.password) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 201 created
  let responseCode = 201;

  // if that user's name already exists in our object, switch to a 204 updated status
  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {};
  }

  // add or update fields for this user name
  users[body.name].name = body.name;
  users[body.name].password = body.password;

  // if response is created, then set our created message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // send 204 if user already exists
  return respondJSONMeta(request, response, responseCode);
};

// function to add a new meal
const addMeal = (request, response, body) => {
  const responseJSON = {
    meal: '',
    message: 'Title, meal type, and day parameters required.',
  };

  if (body != null) {
    if (!body.title || !body.mealType || !body.day) {
      responseJSON.id = 'missingParams';
      return respondJSON(request, response, 400, responseJSON);
    }
  } else {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (!meals[body.day]) {
    meals[body.day] = {};
  }

  if (!meals[body.day][body.mealType]) {
    meals[body.day][body.mealType] = {};
  } else {
    responseCode = 200;
  }

  meals[body.day][body.mealType].title = body.title;
  meals[body.day][body.mealType].day = body.day;
  meals[body.day][body.mealType].mealType = body.mealType;

  // if response is created, then set our created message
  if (responseCode === 201) {
    responseJSON.meal = meals[body.day][body.mealType];
    responseJSON.message = 'Created meal successfully.';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  responseJSON.message = 'Updated meal successfully.';
  responseJSON.meal = meals[body.day][body.mealType];
  return respondJSON(request, response, responseCode, responseJSON);
};

// function to get the list of meals
const getMeals = (request, response) => {
  const responseJSON = {
    meals,
  };

  if (request.method === 'HEAD') {
    return respondJSONMeta(request, response, 200);
  }

  return respondJSON(request, response, 200, responseJSON);
};

// function to get the list of meals without message
const getMealsMeta = (request, response) => {
  // return 200 without message, just the meta data
  respondJSONMeta(request, response, 200);
};

// function to remove a meal from the list
const removeMeal = (request, response, body) => {
  meals[body.id] = {};

  return respondJSONMeta(request, response, 204);
};

// function to show not found error
const notFound = (request, response) => {
  const responseMessage = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseMessage);
};

// function for 404 not found without message
const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  notFound,
  notFoundMeta,
  getUsers,
  getUsersMeta,
  addMeal,
  getMeals,
  getMealsMeta,
  removeMeal,
  addUser,
};
