/* global Game, async */

/**
* Player.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {

		firstName: {
			type: 'string'
		},

		lastName: {
			type: 'string'
		},

		email: {
			type: 'email',
			unique: true
		},

		birthday: {
			type: 'date'
		},

		nickname: {
			type: 'string'
		}

	},

	findPlayerById: function(playerId, cb) {
		Player.findOne({ id: playerId }).exec(function(err, player) {
			console.log("Found player with name: " + player.firstName + " " + player.lastName);

			cb(player);
		});
	},

	findPlayerStats: function(player, cb) {
		/**
		 * Games played 
		 * Games won
		 * Games lost
		 * Winning percentage
		 * Goals scored
		 * Goals scored per game (gpg)
		 * Own goals
		 * Own goals per game
		 * Goals allowed
		 * Goals allowed per game
		*/
		var playerStats = {
			name: player.firstName + " " + player.lastName
		};

		Game.findGamesByPlayer(player, function(games) {
			playerStats.gamesPlayed = games.length;

			async.parallel({
				gamesWon: function(callback) {
					Player.findGamesWonForPlayer(player, games, function(gamesWon) {
						callback(null, gamesWon);
					});
				}
			},
			function(err, results) {
				playerStats.gamesWon = results.gamesWon.length;
				playerStats.gamesLost = playerStats.gamesPlayed - playerStats.gamesWon;
				playerStats.winningPercentage = Math.ceil(playerStats.gamesWon / playerStats.gamesPlayed * 100) + "%";
				
				var playerGoals = Player.findGoalsScored(player, games);

				playerStats.goalsScored = playerGoals.regularGoals.length;
				playerStats.goalsScoredPerGame = (playerStats.goalsScored / playerStats.gamesPlayed).toFixed(2);
				playerStats.ownGoals = playerGoals.ogGoals.length;
				playerStats.ownGoalsPerGame = (playerStats.ownGoals / playerStats.gamesPlayed).toFixed(2);

				cb(playerStats);
			});
		});
	},

	findGamesWonForPlayer: function(player, games, cb) {
		var gamesWon = [];

		// loop over games played in
		async.each(games, function(game, callback) {
			// figure out which team won
			Game.findWinningTeamForGame(game, function(winningTeamStr) {
				if(winningTeamStr === "yellow" && (game.yO.id === player.id || game.yD.id === player.id)) {
					gamesWon.push(game);
				} else if(winningTeamStr === "black" && (game.bO.id === player.id || game.bD.id === player.id)) {
					gamesWon.push(game);
				}

				callback();
			});
		}, function() {
			cb(gamesWon);
		});
	},

	separateGoalsByPlayer: function(player, goals) {
		var regularGoals = [];
		var ogGoals = [];

		_.each(goals, function(goal) {
			if(goal.scorer === player.id) {
				console.log("Goal ID: " + goal.id);
				console.log("Goal scorer: " + goal.scorer);
				console.log("Goal type: " + goal.type);

				if(goal.type === 'regular') {
					regularGoals.push(goal);
				} else {
					ogGoals.push(goal);
				}
			}
		});

		return {
			regular: regularGoals, 
			ogs: ogGoals
		};
	},

	findGoalsScored: function(player, games) {
		var goalsScored = {
			regularGoals: [],
			ogGoals: []
		};

		_.each(games, function(game) {
			console.log("Num goals: " + game.goals.length);

			var playerGoals = Player.separateGoalsByPlayer(player, game.goals);

			console.log(playerGoals.regular.length);
			console.log(playerGoals.ogs.length);

			goalsScored.regularGoals = goalsScored.regularGoals.concat(playerGoals.regular);
			goalsScored.ogGoals = goalsScored.ogGoals.concat(playerGoals.ogs);
		});

		return goalsScored;
	}

};

