# Setup
- Make sure Node.js 14+ and NPM is installed in local machine.
- Navigate to root of the project.
- Run `npm install`.
- For `api-app.js`, run `node api-app`.
- For `mongo-app.js`, run `node mongo-app`.

# Note
This is a basic barebone app. There are 2 apps in this repo:
1. `api-app.js` is basic api configuration in Node.js and express.
2. `mongo-app.js` is basic app to read and upsert data to MongoDb using MongoDb driver.

This is a demonstration app and not meant for production. Many code or functions are written with simplification.
Some of improvement consideration for these app are:
- Configure and setup eslint, prettier for consistent code formatting across the project.
- Organize the class and services in to different folder and module to be reuseable. The more common services (such as logging) which will be used by many other services can be put in same module. In this example, i created `logging-service.js` as an example of common service.
- The `api-app.js` doesn't have authentication. In production, all api's endpoints should be secured with proper authentication/authorization with identity provider.
- The `api-app.js` does simple input validation to ensure parameter is number. In production app, we should implemented more robust validation and encoding logic for every input from users.
- The `api-app.js` does not use async because it is simply returning string value based on input. In production app, we would use async/await for longer running process. Sample of async/await calls could be seen in `mongo-app.js`.
- I use simple error handling (try/catch) and logging (console.log). In production, we must build more robust error handling and logging, including logging users behavior for analytic.
- There is no unit test setup for either apps. In production, we could use `jest` or `karma` to test our Node.js apps.




