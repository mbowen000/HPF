/* global Game */

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

	findLatestGame: function(cb) {
		Game.find().sort({ $natural: 1 }).exec(function(err, games) {
			cb(games[0]);
		});
	},

	findYellowGoalsForGame: function(game, cb) {
		Game.findLatestGame(function(game) {
			
		});
	},

	findBlackGoalsForGame: function(game, cb) {
		Game.findLatestGame(function(game) {

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
	},

	findWinningTeamForGame: function(game, cb) {
		// find yellow goals


		// find black goals

	}

};

