/* global module, Game */

/**
* Game.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {

		yO: {
			model: 'player',
			required: true
		},

		yD: {
			model: 'player',
			required: true
		},

		bO: {
			model: 'player',
			required: true
		},

		bD: {
			model: 'player',
			required: true
		},

		gameEnd: {
			type: 'datetime'
		},

		goals: {
			collection: 'goal',
			via: 'game'
		}

	},

	/**
	 * Finds the most recent game.
	 * @param {Function} cb - The callback to invoke with the most recent game.
	 */
	findLatestGame: function(cb) {
		// sort all of our games by the reverse order that they were added
		Game.find().sort({ $natural: -1 }).exec(function(err, games) {
			// return the first game to our callback - this is the most recent
			// game since we've sorted them by when they were added in reverse
			cb(games[0]);
		});
	},

	/**
	 * Finds all the goals in a game for a team (either "yellow" or "black").
	 * @param {Object} game - The game to find the goals for a team.
	 * @param {String} team - The team to find the goals for. Must be either "yellow"
	 * or "black".
	 * @param {Function} cb - The callback to invoke with the goal objects for the specified
	 * game and team.
	 */
	findGoalsForGameByTeam: function(game, team, cb) {
		console.log("Finding " + team + " goals for game: " + game.id);

		// we need to find our game for the passed in game ID - we also need to populate the
		// players and the goals
		Game.findOne({ id: game.id })
			.populate("yO")
			.populate("yD")
			.populate("bO")
			.populate("bD")
			.populate("goals")
			.exec(function(err, gameResult) {
			
			// filter out our goals to find the goals for the team that was specified
			var goals = _.filter(gameResult.goals, function(goal) {
				// true if the goal was scored by a yellow player, false otherwise
				var goalScoredByYellowTeam = goal.scorer === gameResult.yO.id || goal.scorer === gameResult.yD.id;

				// true if the goal was scored by a black player, false otherwise
				var goalScoredByBlackTeam = goal.scorer === gameResult.bO.id || goal.scorer === gameResult.bD.id;

				// they want the yellow team goals
				if(team === "yellow") {
					if(goal.type === "regular") {
						// if it's a regular goal we're dealing with, then it's a yellow goal if it was
						// scored by the yellow team
						return goalScoredByYellowTeam;
					} else { // this is an OG
						// if it's an OG we're dealing with, then it's a yellow goal if it was scored
						// by the black team
						return goalScoredByBlackTeam;
					}	
				} else { // they want the black team goals
					if(goal.type === "regular") {
						// if it's a regular goal we're dealing with, then it's a black goal if it was
						// scored by the black team
						return goalScoredByBlackTeam;
					} else { // this is an OG
						// if it's an OG we're dealing with, then it's a black goal if it was scored
						// by the yellow team
						return goalScoredByYellowTeam; 
					}
				}
			});

			console.log("Found " + goals.length + " " + team + " goals.");

			// invoke our callback with the goals we found for the team specified
			cb(goals);
		});
	},

	/**
	 * Ends the game specified by updating the game to set its gameEnd attribute to the current timestamp.
	 * @param {Object} game - The game object to update to indicate that it's ended.
	 * @param {Function} cb - The callback to invoke when the game has been updated to be over.
	 */
	endGame: function(game, cb) {
		console.log("Ending game with ID: " + game.id);

		// update our game represented by the passed in game to have its gameEnd attribute as the
		// current timestamp
		Game.update({ id: game.id}, { gameEnd: new Date() }).exec(function(err, updatedGame) {
			console.log("Ended game.");

			// invoke our callback with the game we've updated to be over
			cb(updatedGame);
		});
	},

	findGamesByPlayer: function(player, cb) {
		console.log("Finding games by player: " + player.id);

		Game.find()
			.populate("yO", { where: { id: player.id } })
			.populate("yD", { where: { id: player.id } })
			.populate("bO", { where: { id: player.id } })
			.populate("bD", { where: { id: player.id } })
			.exec(function(err, games) {

			cb(games);
		});
	}

};

