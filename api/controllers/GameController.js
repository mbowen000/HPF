/* global module, Game */

/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	/**
	 * Deletes all games. WARNING: This is only a development endpoint.
	 * @param {Object} req - The request object for this controller.
	 * @param {Object} res - The response object for this controller.
	 */
	/*deleteAllGames: function(req, res) {
		console.log("Deleting all games...");

		// delete all our games
		Game.destroy().exec(function(err, games) {
			console.log("Deleted " + games.length + " games.");

			return res.ok();
		});
	}*/

	findLatestGameSummary: function(req, res) {
		Game.findLatestGame(function(game) {
			Game.findGameSummary(game, function(gameSummary) {
				res.json(gameSummary);
			});
		});
	},

	findGameSummaryById: function(req, res) {
		var gameId = req.param("gameId");

		Game.findGameById(gameId, function(game) {
			Game.findGameSummary(game, function(gameSummary) {
				res.json(gameSummary);
			});
		});
	}

};
