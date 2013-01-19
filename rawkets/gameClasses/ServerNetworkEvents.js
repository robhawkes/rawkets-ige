var ServerNetworkEvents = {
	/**
	 * Is called when the network tells us a new client has connected
	 * to the server. This is the point we can return true to reject
	 * the client connection if we wanted to.
	 * @param data The data object that contains any data sent from the client.
	 * @param clientId The client id of the client that sent the message.
	 * @private
	 */
	_onPlayerConnect: function (socket) {
		// Don't reject the client connection
		return false;
	},

	_onPlayerDisconnect: function (clientId) {
		if (ige.server.players[clientId]) {
			// Destroy player's fighters
			var fighterArr = ige.$$$(ige.server.players[clientId].id()),
				arrCount = fighterArr.length;
			
			while (arrCount--) {
				fighterArr[arrCount].destroy();
			}
			
			// Remove the player from the game
			ige.server.players[clientId].destroy();

			// Remove the reference to the player entity
			// so that we don't leak memory
			delete ige.server.players[clientId];
		}
	},

	_onPlayerEntity: function (data, clientId) {
		if (!ige.server.players[clientId]) {
			ige.server.players[clientId] = new Player(clientId)
				.streamMode(1)
				.mount(ige.server.scene1);
			
			console.log('Created player with ID:' + ige.server.players[clientId].id());

			// Tell the client to track their player entity
			ige.network.send('playerEntity', ige.server.players[clientId].id(), clientId);
		}
	},

	_onPlayerTarget: function(data, clientId) {
		var player = ige.server.players[clientId];
		if (player) {
			player.target = {x: data.x, y: data.y};
		}
	}

	// _onPlayerLeftDown: function (data, clientId) {
	// 	ige.server.players[clientId].controls.left = true;
	// },

	// _onPlayerLeftUp: function (data, clientId) {
	// 	ige.server.players[clientId].controls.left = false;
	// },

	// _onPlayerRightDown: function (data, clientId) {
	// 	ige.server.players[clientId].controls.right = true;
	// },

	// _onPlayerRightUp: function (data, clientId) {
	// 	ige.server.players[clientId].controls.right = false;
	// },

	// _onPlayerThrustDown: function (data, clientId) {
	// 	ige.server.players[clientId].controls.thrust = true;
	// },

	// _onPlayerThrustUp: function (data, clientId) {
	// 	ige.server.players[clientId].controls.thrust = false;
	// }
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }