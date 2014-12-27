/**
* Goal.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {

		scorer: {
			model: 'player',
			required: true
		},

		goalTime: {
			type: 'datetime',
			defaultsTo: new Date()
		},

		type: {
			type: 'string',
			enum: [
				'regular',
				'og'
			],
			required: true
		},

		game: {
			model: 'game'
		}

	}

};

