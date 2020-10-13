# API Project for Rich Media II

Name: Dakota Sorenson\
Project 1: Meal-Pedia

### Purpose:
Meal-Pedia is a weekly meal planning app for users who want to organize and
schedule their meals on a weekly basis.

### Features:
- Add meals for specific days and meal times (breakfast, lunch, etc.) (click the ‘Add Meal’ button after entering data in the required fields)
- Update meals (select the desired day and meal type, enter a new title, and click the ‘Add Meal’ button to update a meal)
- Clear the weekly meal planner (click the ‘Clear’ button in the upper left corner)
- Filter meals based on day, meal type, or both (select a value for the day and meal type and then click the ‘Filter’ button)
- Stores data to a Firebase database - All meal data is stored in a Firebase database. On start, it will load the data currently in the database. Any changes to the meal planner will be stored in the database.

### API:
- The API handles adding meals, getting a list of all meals, filtering (querying)
meals for specific days and/or meal types, and deleting all the meals.
- Direct link calls examples:
  - /addMeal?title=food&mealType=dinner&day=saturday
  - /getMeals
  - /searchMeals?mealType=breakfast&day=sunday
  - /clearMeals

### Resources:
- Dropdown CSS - https://codepen.io/miniven/pen/ZJydge
- Meal cards - https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_column_cards
- Firebase documentation / examples - https://firebase.google.com/docs/database/web/read-and-write
- https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sidenav_push
- https://developers.google.com/recaptcha/docs/display
- https://codeforgeek.com/google-recaptcha-node-js-tutorial/
- https://codepen.io/imohkay/pen/gpard
- Icons/images from Google

