'use strict';
import chalk from 'chalk';
import figlet from 'figlet';
import { performance } from 'perf_hooks';

import CITIES from '../data/cities.json';
import { getDistanceFromLatLonInKm } from './utils/distanceCalculator.js';

/**
 * Travel planner which can plan travels around the world
 * @class
 */
export class TravelPlanner {
    /**
     * Constructor for travel planner
     * @param {string} inCity 
     * @param {boolean} inIsMin 
     */
    constructor(inCity, inIsMin) {
        this.inputCity = CITIES[inCity];
        const inputContinent = this.inputCity.contId;
        this.continentsCovered = [inputContinent];

        this.cityCodes = Object.keys(CITIES);

        this.citiesTravelled = [this.inputCity];
        this.totalDistance = 0;

        this.isMin = inIsMin;
    }

    /**
     * Method to initiate plan
     */
    plan() {
        this.travelPlanner(this.inputCity);
        this.showTravelPlan();
    }

    /**
     * Method to initiate travelling sequence
     * @param {Object} inCity 
     */
    travelPlanner(inCity) {
        const { nextCity, finalDistance: distance } = this.getNextCity(inCity, this.continentsCovered);
        this.totalDistance += distance;
        this.continentsCovered.push(nextCity.contId);
        this.citiesTravelled.push(nextCity);
        if (this.continentsCovered.length < 6) {
            this.travelPlanner(nextCity);
        } else if (this.continentsCovered.length === 6) {
            this.totalDistance += getDistanceFromLatLonInKm(nextCity.location.lat, nextCity.location.lon, inCity.location.lat, inCity.location.lon);
            this.citiesTravelled.push(this.inputCity);
        }
    }

    /**
     * Method to display the generated travel plan.
     */
    showTravelPlan() {
        let resultString = this.citiesTravelled.reduce((_formattedString, _city) => {
            return _formattedString + `${_city.id} (${_city.name}, ${_city.contId}) ➡️ `;
        }, '');

        console.log(
            chalk.green(
                figlet.textSync('Your Travel Plan')
            )
        );

        console.log(chalk.bold(resultString.slice(0, resultString.length - 3)));
        console.log(chalk.italic.bold.bgRed.blackBright.white(`\n\tTotal Distance of ${this.isMin ? 'minimum' : 'maximum'} distanced cities in different continnets : ${this.totalDistance.toFixed(2)} KM\t\n`));
    }

    /**
     * Method to get the next city according to the plan.
     * @param {Object} inCity 
     * @param {Array<string>} ignoreContinent 
     * @returns {Object}
     */
    getNextCity(inCity, ignoreContinent) {
        let finalDistance = this.isMin ? Number.MAX_VALUE : Number.MIN_VALUE;
        let nextCity = '';

        this.cityCodes.forEach(_city => {
            const city = CITIES[_city];
            if (!ignoreContinent.includes(city.contId)) {
                const distance = getDistanceFromLatLonInKm(inCity.location.lat, inCity.location.lon, city.location.lat, city.location.lon);
                if (this.isMin ? distance < finalDistance : distance > finalDistance) {
                    finalDistance = distance;
                    nextCity = city;
                }
            }
        });
        return { nextCity, finalDistance };
    }
}