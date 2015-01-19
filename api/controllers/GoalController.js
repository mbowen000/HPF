/* global module, Goal, Game */

/**
 * GoalController
 *
 * @description :: Server-side logic for managing goals
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	/**
	 * Overrides the Blueprint API generated create action for our Goal model. We need
	 * to adjust the scorer of the game (possibly) and end the game this goal is associated
	 * with if this was the fifth goal.
	 * @param {Object} req - The request object for this controller.
	 * @param {Object} res - The response object for this controller.
	 */
	create: function(req, res) {
		// get all of the request parameters
		var params = req.params.all();

		console.log("Goal scored by: " + params.scorer);
		console.log("Goal type: " + params.type);

		// this goal should be added to the most recent game, so let's find that
		Game.findLatestGame(function(game) {
			console.log("Found latest gameId: " + game.id);

			// add this game to our parameters so when we create the goal it is properly
			// associated with this game
			params.game = game;

			// get the number of goals that have been scored already by the team that is
			// scoring the current goal - we need the goals already scored so we can adjust
			// who scored this goal
			Game.findGoalsForGameByTeam(game, function(goals) {
				// create our new goal
				Goal.createGoal(params, game, goals, function() {
					return res.ok();
				});
			});
		});
	},

	/**
	 * Deletes all goals. WARNING: This is only a development endpoint.
	 * @param {Object} req - The request object for this controller.
	 * @param {Object} res - The response object for this controller.
	 */
	/*deleteAllGoals: function(req, res) {
		console.log("Deleting all goals...");

		// delete all our goals
		Goal.destroy().exec(function(err, goals) {
			console.log("Deleted " + goals.length + " goals.");

			return res.ok();
		});
	}*/

};
