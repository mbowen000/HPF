/**
* Game.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {

		y1: {
			model: 'player',
			required: true
		},

		y2: {
			model: 'player',
			required: true
		},

		b1: {
			model: 'player',
			required: true
		},

		b2: {
			model: 'player',
			required: true
		},

		gameStart: {
			type: 'datetime',
			defaultsTo: new Date()
		},

		gameEnd: {
			type: 'datetime'
		},

		status: {
			type: 'string',
			enum: [
				'active',
				'finished',
				'canceled'
			],
			defaultsTo: 'active'
		},

		goals: {
			collection: 'goal',
			via: 'game'
		}

	}

};

