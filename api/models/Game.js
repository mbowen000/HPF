/* global module, Game */

var moment = require('moment-timezone');
moment.tz.setDefault("America/Chicago");

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
		Game.findOne()
			.populate("yO")
			.populate("yD")
			.populate("bO")
			.populate("bD")
			.populate("goals")
			.sort({ $natural: -1 }).exec(function(err, game) {

			// return the game to our callback - this is the most recent
			// game since we've sorted them by when they were added in reverse
			cb(game);
		});
	},

	findGameById: function(gameId, cb) {
		console.log("Finding game with ID: " + gameId);

		Game.findOne({ id: gameId })
			.populate("yO")
			.populate("yD")
			.populate("bO")
			.populate("bD")
			.populate("goals")
			.exec(function(err, game) {

			cb(game);
		});
	},

	/**
	 * Finds all the goals in a game for a team (either "yellow" or "black").
	 * @param {Object} game - The game to find the goals for a team.
	 * @param {Function} cb - The callback to invoke with the goal objects for the specified
	 * game and team.
	 */
	findGoalsForGameByTeam: function(game, cb) {
		console.log("Finding team goals for game: " + game.id);

		// we need to find our game for the passed in game ID - we also need to populate the
		// players and the goals
		Game.findOne({ id: game.id })
			.populate("yO")
			.populate("yD")
			.populate("bO")
			.populate("bD")
			.populate("goals")
			.exec(function(err, gameResult) {
			
			var yellowGoals = [];
			var blackGoals = [];

			_.each(gameResult.goals, function(goal) {
				// true if the goal was scored by a yellow player, false otherwise
				var goalScoredByYellowTeam = goal.scorer === gameResult.yO.id || goal.scorer === gameResult.yD.id;

				// true if the goal was scored by a black player, false otherwise
				var goalScoredByBlackTeam = goal.scorer === gameResult.bO.id || goal.scorer === gameResult.bD.id;

				if(goal.type === "regular") {
					if(goalScoredByYellowTeam) {
						yellowGoals.push(goal);
					} else {
						blackGoals.push(goal);
					}
				} else { // this is an OG
					if(goalScoredByYellowTeam) {
						blackGoals.push(goal);
					} else {
						yellowGoals.push(goal);
					}
				}
			});

			console.log("Found " + yellowGoals.length + " yellow goals.");
			console.log("Found " + blackGoals.length + " black goals.");

			// invoke our callback with the goals we found for the team specified
			cb({
				"yellow": yellowGoals,
				"black": blackGoals
			});
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

	findGameSummary: function(game, cb) {
		var gameDuration = moment.duration(moment(game.gameEnd).diff(moment(game.createdAt)));
		var gameLengthString = gameDuration.minutes() + " minutes";
		if(gameDuration.seconds()) {
			gameLengthString += " and " + gameDuration.seconds() + " seconds";
		}

		var gameSummary = {
			startedAt: moment(game.createdAt).format('M/D/YYYY h:mm:ss')
		};

		if(game.gameEnd) {
			gameSummary.endedAt = moment(game.gameEnd).format('M/D/YYYY h:mm:ss')
		}

		gameSummary.duration = gameLengthString;
		gameSummary.teams = [
			{
				team: "yellow",
				players: []
			},
			{
				team: "black",
				players: []
			}
		];
			
		var yOGoals = Player.separateGoalsByPlayer(game.yO, game.goals);
		var yDGoals = Player.separateGoalsByPlayer(game.yD, game.goals);

		gameSummary.teams[0].players.push({
			name: game.yO.firstName + " " + game.yO.lastName,
			goals: yOGoals.regular.length,
			ogs: yOGoals.ogs.length
		});

		gameSummary.teams[0].players.push({
			name: game.yD.firstName + " " + game.yD.lastName,
			goals: yDGoals.regular.length,
			ogs: yDGoals.ogs.length
		});

		var bOGoals = Player.separateGoalsByPlayer(game.bO, game.goals);
		var bDGoals = Player.separateGoalsByPlayer(game.bD, game.goals);

		gameSummary.teams[1].players.push({
			name: game.bO.firstName + " " + game.bO.lastName,
			goals: bOGoals.regular.length,
			ogs: bOGoals.ogs.length
		});

		gameSummary.teams[1].players.push({
			name: game.bD.firstName + " " + game.bD.lastName,
			goals: bDGoals.regular.length,
			ogs: bDGoals.ogs.length
		});

		gameSummary.score = {
			"yellow": yOGoals.regular.length + yDGoals.regular.length + bOGoals.ogs.length + bDGoals.ogs.length,
			"black": yOGoals.ogs.length + yDGoals.ogs.length + bOGoals.regular.length + bDGoals.regular.length,
		};

		cb(gameSummary);
	},

	findGamesByPlayer: function(player, cb) {
		console.log("Finding games by player: " + player.id);

		Game.find()
			.populate("yO")
			.populate("yD")
			.populate("bO")
			.populate("bD")
			.populate("goals")
			.exec(function(err, games) {

			var playerGames = _.filter(games, function(game) {
				return game.yO.id === player.id || game.yD.id === player.id || game.bO.id === player.id || game.bD.id === player.id;
			});

			cb(playerGames);
		});
	},

	findWinningTeamForGame: function(game, cb) {
		Game.findGoalsForGameByTeam(game, function(goals) {
			if(goals.yellow.length === 5) {
				cb("yellow");
			} else {
				cb("black");
			}
		});
	}

};

