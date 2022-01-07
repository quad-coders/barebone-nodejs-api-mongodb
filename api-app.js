// Problem statement
/*
1/ Using Node.js and Express, write a simple REST API that takes a number as input and returns a string as the following:
- If the number is a multiple of 2, return "GU"
- If the number is a multiple of 3, return "RO"
- If the number is a multiple of 5, return "BI"
- If the number is a combination, return the combination (ex: for 6, print "GURO")
- If the number is not a multiple of 2, 3 or 5, return “INVALID”
*/

import express from 'express';
import { Logging } from './logging-service.js';

class ApiApp {
  constructor() {
    // Setup logging service
    this.logger = new Logging();

    // Init express and configure port
    this.app = express();
    this.port = 3000;

    this.configureRoute();

    // Start api
    this.app.listen(this.port, () => {
      this.logger.log(`App running on port ${this.port}.`);
    });
  }

  configureRoute() {
    // Root, no parameter
    // GET localhost:3000
    this.app.get('/', (req, res) => {
      this.logger.log('Route: /. Called');

      res.send('Welcome!');
    });

    // GET localhost:3000/2
    this.app.get('/:command', (req, res) => {
      this.logger.log('Route: /:command. Called');

      // Default response
      let response = 'INVALID';

      try {
        // Get parameter
        let command = req.params.command;

        // Validation, use regex to check number of 1 to infinity
        // Regex is simple and straight forward but not the most time efficient because it's comparing each character, on average it's O(n)
        let validate = /^[1-9]\d*$/.test(command);

        // If input failed, return status 400 and invalid response
        if (validate === false) {
          res.status(400).send(response);
          return;
        }

        // There are many different algorithm to check for multiplication. The core idea is to find combination of denominators to equal to the target, which is the input
        // For simplicity, i use simple modulo division because we know we have exactly 3 denominators. The algorithm should start with most denominators combined
        // There are other more robust/elegant ways instead of multiple if statements, for example, creating map of the denominators with expected result, for example:
        // {
        //   "2,3,5": "GUROBI",
        //   "2,3": "GURO"
        // }
        // Then in the function to check if the target can be divisible by denominators, we get the map of the object based on which denomitor combination met the criteria

        // Alternatively, if the number of denominators are not known, there is an algorithm to find multiplication with dynamic programming, where we compare the target with each denominator and check if it's divisible then keep track of the result in an array where the denominator is the index. Once we have the result for all the denominators, we can check which denominator combinations met the criteria and we display the result accordingly

        if (this.isMultiply(command, [2, 3, 5]) === true) {
          response = 'GUROBI';
        }
        else if (this.isMultiply(command, [2, 3]) === true) {
          response = 'GURO';
        }
        else if (this.isMultiply(command, [2, 5]) === true) {
          response = 'GUBI';
        }
        else if (this.isMultiply(command, [3, 5]) === true) {
          response = 'ROBI';
        }
        else if (this.isMultiply(command, [2]) === true) {
          response = 'GU';
        }
        else if (this.isMultiply(command, [3]) === true) {
          response = 'RO';
        }
        else if (this.isMultiply(command, [5]) === true) {
          response = 'BI';
        }

        // Input is correct, return status 200 and response based on the input calculation
        res.status(200).send(response);
      }
      catch (ex) {
        this.logger.log('Route: /:command. Error', ex);

        // Per problem statement, return status 500 and invalid response. In production app, this should send user friendly error message
        res.status(500).send(response);
      }
    });
  }

  // Utility function to check if target is divisible by denominators
  isMultiply(target, denoms) {
    let response = true;

    // If the target is not divisible by any of the denominators, return false
    for (let denom of denoms) {
      if (target % denom !== 0) {
        response = false;
        break;
      }
    }

    return response;
  }
}

// Create new instance will start the api
new ApiApp();
