/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	dashboard: function(req, res) {

		// concept from http://stackoverflow.com/questions/23446484/sails-js-populate-nested-associations
		// we need this approach since nested association population is not supported in this version of sails
		async.auto({

			// First get our game 
			game: function(cb) {
				Game.findOne({ status: 'active' })
					.populate('y1')
					.populate('y2')
					.populate('b1')
					.populate('b2')
					.populate('goals')
					.exec(cb);
			},

			// then all of the goal scorers, using an "in" query by
			// setting "id" criteria to an array of player IDs
			goalScorers: ['game', function(cb, results) {
				Player.find({ id: _.pluck(results.game.goals, 'scorer') }).exec(cb);
			}],

			// map the goal scorers to their goals
			map: ['goalScorers', function(cb, results) {
				// index goal scorers by ID
				var goalScorers = _.indexBy(results.goalScorers, 'id');

				// get a plain object version of game & goals
				var game = results.game;

				// map players onto goals
				game.goals = game.goals.map(function(goal) {
					goal.scorer = goalScorers[goal.scorer];
					return goal;
				});

				return cb(null, game);
			}]

		}, 
			// after all the async magic is finished, return the mapped result
			// (or an error if any occurred during the async block)
			function finish(err, results) {
				if(err) {
					return res.serverError(err);
				}

				res.view({
					game: results.map
				});
			}
		);

	}

};

