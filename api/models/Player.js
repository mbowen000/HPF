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

	findGamesWon: function(player, cb) {
		// get games player has played in
		Game.findGamesByPlayer(player, function(games) {

			var gamesWon = 0;

			// loop over games played in
			async.each(games, function(game, callback) {
				// figure out which team won
				Game.findWinningTeamForGame(game, function(winningTeamStr) {
					if(winningTeamStr === "yellow" && (game.yO.id === player.id || game.yD.id === player.id)) {
						gamesWon += 1;
					} else if(winningTeamStr === "black" && (game.bO.id === player.id || game.bD.id === player.id)) {
						gamesWon += 1;
					}

					callback();
				});
			}, function() {
				cb(gamesWon);
			});
		});
	},

	// winning percentage is games won / games played
	findWinningPercentage: function() {
		// get the number of games the player has played in


		// get the number of games the player has won

	}

};

