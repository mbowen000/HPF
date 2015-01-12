/* global Player, Game */

/**
 * PlayerController
 *
 * @description :: Server-side logic for managing players
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	findGamesForPlayer: function(req, res) {
		var playerId = req.param("playerId");

		console.log("Finding games for playerId: " + playerId);

		Player.findOne({
			id: playerId
		}).exec(function(err, player) {
			console.log("Found player with name: " + player.firstName + " " + player.lastName);

			Game.findGamesByPlayer(player, function(games) {
				console.log("Number of games for player: " + games.length);

				return res.json(games);
			});
		});
	},

	findGamesWonForPlayer: function(req, res) {
		var playerId = req.param("playerId");

		console.log("Finding games won for playerId: " + playerId);

		Player.findOne({
			id: playerId
		}).exec(function(err, player) {
			console.log("Found player with name: " + player.firstName + " " + player.lastName);

			Player.findGamesWon(player, function(gamesWon) {
				console.log("Number of games won for player: " + gamesWon.length);

				return res.json(gamesWon);
			});
		});
	}

};
