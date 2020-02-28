const firebase = require('firebase');

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

module.exports = {
  app,
};
