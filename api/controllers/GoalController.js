/**
 * GoalController
 *
 * @description :: Server-side logic for managing goals
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	create: function(req, res) {
		var params = req.params.all();

		console.log("Goal scored by: " + params.scorer);
		console.log("Goal type: " + params.type);

		Game.findLatestGame(function(game) {
			console.log("Found latest gameId: " + game.id);

			params.game = game;

			console.log("Found scorer in game: " + game[params.scorer]);

			params.scorer = game[params.scorer];
			
			Goal.create(params).exec(function(err, created) {

				return res.ok();
			});
		});

	}

};
