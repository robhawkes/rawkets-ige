var Player = IgeEntity.extend({
	classId: 'Player',

	target: null,

	moveStates: {
		idle: 2,
		thrust: 3
	},

	moveState: null,

	turretAnchors: [
		{x: 0, y: -76},
		{x: 0, y: -12},
		{x: 0, y: 64}
	],

	team: 0,

	lastFighterTime: null,

	init: function () {
		this._super();

		var self = this;

		this.moveState = this.moveStates.idle;

		// Create turrets
		for (var i = 0; i < this.turretAnchors.length; i++) {
			var turretAnchor = this.turretAnchors[i];
			
			// Create turret object
			var turret = new PlayerTurret()
				.width(10)
				.height(16)
				.translateTo(turretAnchor.x, turretAnchor.y, 0)
				.mount(this);
		}

		if (ige.isServer) {
			this.addComponent(IgeVelocityComponent);
			this.lastFireTime = 0;
		}

		if (!ige.isServer) {
			self.layer(ige.client.entityLayers.ship);

			// self.addComponent(IgeObbComponent, {
			// 	width: 90,
			// 	height: 222,
			// 	x: this._worldMatrix.matrix[2],
			// 	y: this._worldMatrix.matrix[5],
			// 	angle: this._rotate.z - Math.radians(-45)
			// });

			// self.addComponent(IgeSatComponent, {
			// 	width: 90,
			// 	height: 222,
			// 	x: this._worldMatrix.matrix[2],
			// 	y: this._worldMatrix.matrix[5],
			// 	angle: this._rotate.z - Math.radians(-45)
			// });

			// Apply depth and increase
			self.depth(ige.client.layerDepthCount.ships++);

			self.addComponent(IgeAnimationComponent);

			// Apply initial texture
			self.applyTexture();
		}

		// Define the data sections that will be included in the stream
		this.streamSections(['transform', 'moveState']);
	},

	/**
	 * Override the default IgeEntity class streamSectionData() method
	 * so that we can check for the custom1 section and handle how we deal
	 * with it.
	 * @param {String} sectionId A string identifying the section to
	 * handle data get / set for.
	 * @param {*=} data If present, this is the data that has been sent
	 * from the server to the client for this entity.
	 * @return {*}
	 */
	streamSectionData: function (sectionId, data) {
		// Check if the section is one that we are handling
		if (sectionId === 'moveState') {
			// Check if the server sent us data, if not we are supposed
			// to return the data instead of set it
			if (data) {
				// We have been given new data!
				this.moveState = data;
			} else {
				// Return current data
				return this.moveState;
			}
		} else {
			// The section was not one that we handle here, so pass this
			// to the super-class streamSectionData() method - it handles
			// the "transform" section by itself
			return this._super(sectionId, data);
		}
	},

	/**
	 * Called every frame by the engine when this entity is mounted to the
	 * scenegraph.
	 * @param ctx The canvas context to render to.
	 */
	tick: function (ctx) {
		/* CEXCLUDE */
		if (ige.isServer) {
			// Assume idle state
			this.moveState = this.moveStates.idle;

			// If player is further than 10 pixels away from the movement target
			if (this.target) {
				if (Math.abs(this._translate.x - this.target.x) > 10 || Math.abs(this._translate.y - this.target.y) > 10) {
					var correctAngle = false;

					// 1. Find relative distance and angle to target
					var diffX = this._translate.x - this.target.x;
					var diffY = this._translate.y - this.target.y;
					var relativeDiffX = diffX * Math.cos(this._rotate.z - Math.radians(270)) + diffY * Math.sin(this._rotate.z - Math.radians(270));
					var relativeDiffY = diffY * Math.cos(this._rotate.z - Math.radians(270)) - diffX * Math.sin(this._rotate.z - Math.radians(270));

					var angle = Math.atan2(diffY, diffX) + Math.radians(270) - this._parent._rotate.z;
					var relativeAngle = Math.atan2(relativeDiffY, relativeDiffX);

					// 2. Rotate slightly in direction of new target
					var rotation = 0;
					if (relativeAngle > 0.005 && relativeAngle < Math.PI) {
						rotation = 0.0005 * ige._tickDelta;
					} else if (relativeAngle < -0.005 && relativeAngle > -Math.PI) {
						rotation = -0.0005 * ige._tickDelta;
					}
					this.rotateBy(0, 0, rotation);

					if (relativeAngle > -0.005 && relativeAngle < 0.005) {
						this.rotateBy(0, 0, relativeAngle);
						correctAngle = true;
					}

					if (correctAngle) {
						this.velocity.byAngleAndPower(this._rotate.z + Math.radians(-90), 0.05);
						this.moveState = this.moveStates.thrust;
					}
				} else {
					this.velocity.x(0);
					this.velocity.y(0);
					this.moveState = this.moveStates.idle;
				}
			}

			// Launch fighters
			if (Date.now() - this.lastFighterTime > 5000) {
				var fighter = new Fighter(this.id())
					.width(6)
					.height(8)
					.translateTo(this._worldMatrix.matrix[2], this._worldMatrix.matrix[5], 0)
					.rotateTo(this._parent._rotate.x + this._rotate.x, this._parent._rotate.y + this._rotate.y, this._parent._rotate.z + Math.random()*Math.radians(360))
					.lifeSpan(10000)
					.streamMode(1)
					.mount(ige.server.scene1);

				this.lastFighterTime = Date.now();
			}
		}
		/* CEXCLUDE */

		if (!ige.isServer) {
			if (this.moveState == 2) {
				this.animation.stop('thrust');
				this.cellById('idle');
			} else if (this.moveState == 3) {
				this.animation.select('thrust');
			}
		}

		// Call the IgeEntity (super-class) tick() method
		this._super(ctx);
	},

	initInput: function() {
		var self = this;
		if (self.group() == "LocalPlayers") {
			// Listen for the mouse up event
			ige.input.on('mouseUp', function (event, x, y, button) { self._mouseUp(event, x, y, button); });
		}
	},

	/**
	* Handles what we do when a mouseUp event is fired from the engine.
	* @param event
	* @private
	*/
	_mouseUp: function (event, x, y, button) {
		var mousePos = this.mousePosWorld();
		
		// Tell the server about the target change
		ige.network.send('playerTarget', {x: mousePos.x.toFixed(3), y: mousePos.y.toFixed(3)});
	},

	applyTexture: function() {
		var texture = ige.client.gameTextures.enemyShip;

		if (this.group() == "LocalPlayers") {
			texture = ige.client.gameTextures.localShip;
		}

		this.texture(texture)
			.cellById('idle')
			.anchor(0, -70)
			.width(222)
			.height(364);

		this.animation.define('thrust', [1, 2], 20, -1);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Player; }