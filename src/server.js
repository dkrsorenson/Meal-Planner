const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// url struct to hold url and method combos
const urlStruct = {
  GET: {
    index: htmlHandler.getIndex,
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': jsonHandler.getUsers,
    '/addUser': jsonHandler.addUser,
    '/addMeal': jsonHandler.addMeal,
    '/getMeals': jsonHandler.getMeals,
    '/removeMeal': jsonHandler.removeMeal,
    '/notReal': jsonHandler.notFound,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsersMeta,
    '/getMeals': jsonHandler.getMealsMeta,
    '/notReal': jsonHandler.notFoundMeta,
    notFound: jsonHandler.getUsersMeta,
  },
};

// function to handle a post request
const handlePost = (request, response, parsedUrl) => {
  const res = response;
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    res.statusCode = 400;
    res.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  if (parsedUrl.pathname === '/addUser') {
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addUser(request, res, bodyParams);
    });
  } else if (parsedUrl.pathname === '/addMeal') {
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addMeal(request, res, bodyParams);
    });
  } else if (parsedUrl.pathname === '/removeMeal') {
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.removeMeal(request, res, bodyParams);
    });
  }
};

// function to handle a get request
const handleGet = (request, response, parsedUrl) => {
  // route to correct method based on url
  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

// handles a request from the client
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
