const firebase = require('firebase/app');
require('firebase/database');

const firebaseConfig = {
  apiKey: 'AIzaSyD6QdTTDlDOd3j3GkPf5JY0UuUt8ymZwuc',
  authDomain: 'mealplannerapi.firebaseapp.com',
  databaseURL: 'https://mealplannerapi.firebaseio.com',
  projectId: 'mealplannerapi',
  storageBucket: 'mealplannerapi.appspot.com',
  messagingSenderId: '949635943724',
  appId: '1:949635943724:web:1817c4fd0b7b02e44bf089',
  measurementId: 'G-7JLFZW63T9',
};

const app = firebase.initializeApp(firebaseConfig);
const database = app.database();

// meals object
let meals = {};

// function to get the meal data from firebase
const getMealsFirebaseData = () => {
  firebase.database().ref('/meals').once('value').then((snapshot) => {
    const mealData = (snapshot.val()) || {};
    meals = mealData;
  });
};

// get meals
getMealsFirebaseData();

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

// function to add a new meal
const addMeal = (request, response, body) => {
  const responseJSON = {
    meal: '',
    message: 'Title, meal type, and day parameters required.',
  };

  // ensure they used the params
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

  // if there is not an entry for this day, create empty object
  if (!meals[body.day]) {
    meals[body.day] = {};
  }

  // if there is not an entry for this day/meal type, create an empty object
  // otherwise set the response code to 200 for an update
  if (!meals[body.day][body.mealType]) {
    meals[body.day][body.mealType] = {};
  } else {
    responseCode = 200;
  }

  // set the values
  meals[body.day][body.mealType].title = body.title;
  meals[body.day][body.mealType].day = body.day;
  meals[body.day][body.mealType].mealType = body.mealType;

  // update the data in firebase
  firebase.database().ref(`meals/${body.day}/${body.mealType}`).set({
    title: body.title,
    day: body.day,
    mealType: body.mealType,
  });

  // if response is created, then set our created message
  if (responseCode === 201) {
    responseJSON.meal = meals[body.day][body.mealType];
    responseJSON.message = 'Created meal successfully.';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // send back a message with the udpate meal
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

// function to query the meals for specific data
const searchMeals = (request, response, params) => {
  const responseJSON = {
    message: 'Meal type and day parameters required.',
  };

  // ensure there are meal type and day parameters
  if (!params.mealType && !params.day) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // if they clicked the filter button for all meal types and days,
  // just return the whole meals object
  if (params.mealType === 'all' && params.day === 'all') {
    responseJSON.meals = meals;
    responseJSON.message = 'Queried successfully';
    return respondJSON(request, response, 200, responseJSON);
  }

  // if they queried for all days for a specfic meal type
  if (params.day === 'all') {
    responseJSON.filteredBy = 'meal';
    responseJSON.mealType = params.mealType.charAt(0).toUpperCase() + params.mealType.slice(1);
    responseJSON.filteredMeals = {};

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    for (let i = 0; i < days.length; i++) {
      let mealTitle = '';
      const day = days[i];

      if (meals[day]) {
        if (meals[day][params.mealType]) {
          mealTitle = meals[day][params.mealType].title;
        }
      }

      responseJSON.filteredMeals[day] = {
        mealType: params.mealType,
        day: day.charAt(0).toUpperCase() + day.slice(1),
        mealTitle,
      };
    }
  } else if (params.mealType === 'all') { // if they queried for all meal types for a specfic day
    responseJSON.filteredBy = 'day';
    responseJSON.day = params.day.charAt(0).toUpperCase() + params.day.slice(1);
    responseJSON.filteredMeals = {};

    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack 1', 'snack 2', 'snack 3'];

    for (let i = 0; i < mealTypes.length; i++) {
      let mealTitle = '';
      const mealType = mealTypes[i].split(' ').join('');
      if (meals[params.day]) {
        if (meals[params.day][mealType]) {
          mealTitle = meals[params.day][mealType].title;
        }
      }

      responseJSON.filteredMeals[mealType] = {
        mealType: mealType.charAt(0).toUpperCase() + mealType.slice(1),
        day: params.day.charAt(0).toUpperCase() + params.day.slice(1),
        mealTitle,
      };
    }
  } else { // if they queried for a specific day and for a specfic meal type
    responseJSON.filteredBy = 'both';
    responseJSON.filteredMeals = {};

    let mealTitle = '';
    if (meals[params.day]) {
      if (meals[params.day][params.mealType]) {
        mealTitle = meals[params.day][params.mealType].title;
      }
    }

    responseJSON.filteredMeals[params.day] = {
      mealType: params.mealType.charAt(0).toUpperCase() + params.mealType.slice(1),
      day: params.day.charAt(0).toUpperCase() + params.day.slice(1),
      mealTitle,
    };
  }

  // send the response
  responseJSON.message = 'Queried successfully';
  return respondJSON(request, response, 200, responseJSON);
};

// clear the meals from the list
const clearMeals = (request, response) => {
  const responseJSON = {
    message: 'Successfully cleared meal list',
  };

  // clear the meals object and the database meals list
  meals = {};
  database.ref('meals/').remove();

  responseJSON.cleared = true;

  return respondJSON(request, response, 200, responseJSON);
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
  addMeal,
  getMeals,
  getMealsMeta,
  clearMeals,
  searchMeals,
};
