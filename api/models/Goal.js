/* global module, Goal, Game */

/**
* Goal.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {

		scorer: {
			model: 'player',
			required: true
		},

		type: {
			type: 'string',
			'enum': [
				'regular',
				'og'
			],
			required: true
		},

		game: {
			model: 'game'
		}

	},

	/**
	 * Creates a new goal.
	 * @param {Object} params - The parameters for creating the new goal. This object
	 * must contain a 'scorer' field, which is the ID of the player who scored the goal
	 * and a 'type' field, which is either "regular" or "og".
	 * @param {Object} game - The object representing the game that this goal should be
	 * added to.
	 * @param {number} numGoalsAlreadyScored - The number of goals that have already been scored by
	 * the team that scored the goal we're adding.
	 * @param {String} team - The team that scored the goal. Must be either "yellow" or
	 * "black".
	 * @param {Function} cb - The callback to invoke after creating the goal.
	 */
	createGoal: function(params, game, goals, cb) {
		// determine the team string depending on who scored the goal
		var team = (params.scorer === "yO" || params.scorer === "yD") ? "yellow" : "black";

		/*
		// if we have an even number of goals already scored, then this goal
		// is an odd number so we'll need to adjust the scorer of the goal
		// since "yO", "yD", "bO" and "bD" are starting positions
		if(numGoalsAlreadyScored % 2 === 0) {
			if(team === "yellow") {
				params.scorer = params.scorer === "yO" ? "yO" : "yD";
			} else {
				params.scorer = params.scorer === "bO" ? "bO" : "bD";
			}
		}
		*/

		console.log("Found scorer in game: " + game[params.scorer].id);

		// get the ID of the player who scored the goal based off the 
		// (corrected) value for "yO", "yD", "bO" or "bD"
		params.scorer = game[params.scorer];
		
		// create our goal
		Goal.create(params).exec(function(err, createdGoal) {
			// if we had 4 goals already scored, then this was the fifth
			// goal so we'll need to end our game
			if(goals.yellow.length === 4 || goals.black.length === 4) {
				Game.endGame(game, function() {
					cb(createdGoal);
				});
			} else { // this was not the fifth goal
				cb(createdGoal);
			}
		});
	}

};

