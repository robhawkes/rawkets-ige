var Player = IgeEntity.extend({
	classId: 'Player',

	// Is local player
	local: false,
	target: null,

	init: function (id) {
		this._super();

		this.id(id);

		var self = this;

		this.drawBounds(false);

		if (ige.isServer) {
			this.addComponent(IgeVelocityComponent);
		}

		if (!ige.isServer) {
			self.addComponent(IgeAnimationComponent);
			self.texture(ige.client.gameTextures.ship)
			.cellById('idle')
			.anchor(0, -70)
			.width(222)
			.height(364);

			self.animation.define('thrust', [1, 2], 20, -1);

			// How do I only make this fire on the client when moving?
			// Could set a "moving" flag, or perhaps stream the animation state? – Ask Rob
			self.animation.select('thrust');
		}

		// Define the data sections that will be included in the stream
		this.streamSections(['transform', 'score']);
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
		if (sectionId === 'score') {
			// Check if the server sent us data, if not we are supposed
			// to return the data instead of set it
			if (data) {
				// We have been given new data!
				this._score = data;
			} else {
				// Return current data
				return this._score;
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
					if (relativeAngle > 0.05 && relativeAngle < Math.PI) {
						rotation = 0.001 * ige._tickDelta;
					} else if (relativeAngle < -0.05 && relativeAngle > -Math.PI) {
						rotation = -0.001 * ige._tickDelta;
					}
					this.rotateBy(0, 0, rotation);

					if (relativeAngle > -0.05 && relativeAngle < 0.05) {
						this.rotateBy(0, 0, relativeAngle);
						correctAngle = true;
					}

					if (correctAngle) {
						this.velocity.byAngleAndPower(this._rotate.z + Math.radians(-90), 0.05);
					}
				} else {
					this.velocity.x(0);
					this.velocity.y(0);
				}
			}

			// if (this.controls.left) {
			// 	this.rotateBy(0, 0, Math.radians(-0.2 * ige._tickDelta));
			// }

			// if (this.controls.right) {
			// 	this.rotateBy(0, 0, Math.radians(0.2 * ige._tickDelta));
			// }

			// if (this.controls.thrust) {
			// 	this.velocity.byAngleAndPower(this._rotate.z + Math.radians(-90), 0.1);
			// } else {
			//	this.velocity.x(0);
			//	this.velocity.y(0);
			//}
		}
		/* CEXCLUDE */

		if (!ige.isServer) {
			// if (ige.input.actionState('left')) {
			// 	if (!this.controls.left) {
			// 		// Record the new state
			// 		this.controls.left = true;

			// 		// Tell the server about our control change
			// 		ige.network.send('playerControlLeftDown');
			// 	}
			// } else {
			// 	if (this.controls.left) {
			// 		// Record the new state
			// 		this.controls.left = false;

			// 		// Tell the server about our control change
			// 		ige.network.send('playerControlLeftUp');
			// 	}
			// }

			// if (ige.input.actionState('right')) {
			// 	if (!this.controls.right) {
			// 		// Record the new state
			// 		this.controls.right = true;

			// 		// Tell the server about our control change
			// 		ige.network.send('playerControlRightDown');
			// 	}
			// } else {
			// 	if (this.controls.right) {
			// 		// Record the new state
			// 		this.controls.right = false;

			// 		// Tell the server about our control change
			// 		ige.network.send('playerControlRightUp');
			// 	}
			// }

			// if (ige.input.actionState('thrust')) {
			// 	if (!this.controls.thrust) {
			// 		// Record the new state
			// 		this.controls.thrust = true;

			// 		// Tell the server about our control change
			// 		ige.network.send('playerControlThrustDown');
			// 	}
			// } else {
			// 	if (this.controls.thrust) {
			// 		// Record the new state
			// 		this.controls.thrust = false;

			// 		// Tell the server about our control change
			// 		ige.network.send('playerControlThrustUp');
			// 	}
			// }
		}

		// Call the IgeEntity (super-class) tick() method
		this._super(ctx);
	},

	initInput: function() {
		var self = this;
		if (self.local) {
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
		//console.log(x + ", " + y);
		//console.log(ige._currentViewport._mousePos.x + ", " + ige._currentViewport._mousePos.y);

		// Tell the server about the target change
		ige.network.send('playerTarget', {x: mousePos.x.toFixed(3), y: mousePos.y.toFixed(3)});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Player; }