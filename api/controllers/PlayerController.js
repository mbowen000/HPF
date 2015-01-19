/* global Player, Game */

/**
 * PlayerController
 *
 * @description :: Server-side logic for managing players
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	findPlayerStatsById: function(req, res) {
		var playerId = req.param("playerId");

		Player.findPlayerById(playerId, function(player) {
			Player.findPlayerStats(player, function(playerStats) {
				res.json(playerStats);
			});
		});
	}

};
