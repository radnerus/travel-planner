import { performance } from 'perf_hooks';

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import inquirer from 'inquirer';

import CITIES from '../data/cities.json';
import { TravelPlanner } from './travelPlanner.js';


const startTime = performance.now();

// Clears terminal
clear();


// Welcome text
console.log(
    chalk.red(
        figlet.textSync('World Travel Planner', { horizontalLayout: 'full' })
    )
);

const questions = [{
        name: 'inCity',
        type: 'input',
        message: 'Enter your starting city:',
        validate: function(value) {
            if (CITIES[value.toUpperCase()]) {
                return true;
            } else {
                return 'Please enter a valid city code.';
            }
        }
    },
    {
        name: 'inIsMin',
        type: 'confirm',
        message: 'Do you want to show the min routes? Y - Min Route; N - Max:'
    }
];

// interactive prompter
inquirer.prompt(questions).then(({ inCity, inIsMin }) => {

    const travelPlanner = new TravelPlanner(inCity.toUpperCase(), inIsMin);
    travelPlanner.plan();

    const endTime = performance.now();
    console.log(chalk.dim(`\nTook ${(endTime - startTime) / 1000} seconds to complete the planning.`));
});