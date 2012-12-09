var Client = IgeClass.extend({
	classId: 'Client',

	localPlayer: null,

	entityLayers: {
		ship: 0,
		bullet: 1
	},

	layerDepthCount: {
		ships: 0
	},

	init: function () {
		//ige.timeScale(0.1);
		ige.showStats(1);

		ige.globalSmoothing(true);

		var self = this;
		
		// Load the textures we want to use
		self.gameTextures = {
			background: new IgeTexture('./assets/background.png'),
			localShip: new IgeSpriteSheet('./assets/player.png', [
				[0, 364, 222, 364, 'thrust1'],
				[0, 0, 222, 364, 'thrust2'],
				[222, 364, 222, 364, 'idle']
			]),
			enemyShip: new IgeSpriteSheet('./assets/enemy.png', [
				[0, 364, 222, 364, 'thrust1'],
				[0, 0, 222, 364, 'thrust2'],
				[222, 364, 222, 364, 'idle']
			]),
			turret: new IgeTexture('./assets/turret.png'),
			bullet: new IgeTexture('./assets/plasma.png'),
			explosionParticle: new IgeCellSheet('./assets/explosion-trans.png', 3, 1)
		};

		// Enable networking
		ige.addComponent(IgeNetIoComponent);

		// Implement our game methods
		self.implement(ClientNetworkEvents);

		// Create the HTML canvas
		ige.createFrontBuffer(true);

		ige.on('texturesLoaded', function () {
			// Apply texture filters
			//self.gameTextures.explosionParticle.applyFilter(IgeFilters.glowMask, {glowMask: self.gameTextures.explosionParticleMask, blurPasses: false, glowPasses: 3});
			//.applyFilter(IgeFilters.glowMask, {glowMask: gameTexture[12], blurPasses:50, glowPasses: 2});
			// self.gameTextures.explosionParticle.applyFilter(function(canvas, ctx, originalImage) {
			// 	// Clear the canvas
			// 	ctx.clearRect(0, 0, canvas.width, canvas.height);

			// 	ctx.globalCompositeOperation = 'lighter';
			 
			// 	// Draw the original image
			// 	ctx.drawImage(originalImage, 0, 0);

			// 	ctx.globalCompositeOperation = 'source-over';
			// });

			// Ask the engine to start
			ige.start(function (success) {
				// Check if the engine started successfully
				if (success) {
					// Start the networking (you can do this elsewhere if it
					// makes sense to connect to the server later on rather
					// than before the scene etc are created... maybe you want
					// a splash screen or a menu first? Then connect after you've
					// got a username or something?
					ige.network.start('http://localhost:2000', function () {
						// Setup the network command listeners
						ige.network.define('playerEntity', self._onPlayerEntity); // Defined in ./gameClasses/ClientNetworkEvents.js

						// Setup the network stream handler
						ige.network.addComponent(IgeStreamComponent)
							.stream.renderLatency(80) // Render the simulation 160 milliseconds in the past
							// Create a listener that will fire whenever an entity
							// is created because of the incoming stream data
							.stream.on('entityCreated', function (entity) {
								self.log('Stream entity created with ID: ' + entity.id());

								// Apply relevent groups
								var group = "";
								
								switch (entity.classId()) {
									case "Player":
										group = "EnemyPlayers";
										break;
								}

								if (group !== "") {
									entity.group(group);
								}

								// Apply texture now group is set
								entity.applyTexture();
							});

						self.mainScene = new IgeScene2d()
							.id('mainScene');

						self.backgroundScene = new IgeScene2d()
							.id('backgroundScene')
							.layer(-9999)
							.backgroundPattern(self.gameTextures.background, 'repeat', true)
							.ignoreCamera(true) // We want the scene to remain static
							.mount(self.mainScene);

						// Create the scene
						self.scene1 = new IgeScene2d()
							.id('scene1')
							.mount(self.mainScene);

						self.uiScene = new IgeScene2d()
							.id('uiScene')
							.ignoreCamera(true)
							.mount(self.mainScene);

						// Create the main viewport and set the scene
						// it will "look" at as the new scene1 we just
						// created above
						self.vp1 = new IgeViewport()
							.id('vp1')
							.autoSize(true)
							.scene(self.mainScene)
							//.drawBounds(true)
							.drawMouse(true)
							.mount(ige);

						// Define our player controls
						// ige.input.mapAction('left', ige.input.key.left);
						// ige.input.mapAction('right', ige.input.key.right);
						// ige.input.mapAction('thrust', ige.input.key.up);

						// Ask the server to create an entity for us
						ige.network.send('playerEntity');

						// We don't create any entities here because in this example the entities
						// are created server-side and then streamed to the clients. If an entity
						// is streamed to a client and the client doesn't have the entity in
						// memory, the entity is automatically created. Woohoo!

						// Enable console logging of network messages but only show 10 of them and
						// then stop logging them. This is a demo of how to help you debug network
						// data messages.
						ige.network.debugMax(10);
						ige.network.debug(true);

						// Create an IgeUiTimeStream entity that will allow us to "visualise" the
						// timestream data being interpolated by the player entity
						self.tsVis = new IgeUiTimeStream()
							.height(140)
							.width(400)
							.top(0)
							.center(0)
							.mount(self.uiScene);

						self.custom1 = {
							name: 'Delta',
							value: 0
						};

						self.custom2 = {
							name: 'Data Delta',
							value: 0
						};

						self.custom3 = {
							name: 'Offset Delta',
							value: 0
						};

						self.custom4 = {
							name: 'Interpolate Time',
							value: 0
						};

						ige.watchStart(self.custom1);
						ige.watchStart(self.custom2);
						ige.watchStart(self.custom3);
						ige.watchStart(self.custom4);
					});
				}
			});
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }