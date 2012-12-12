var Fighter = IgeEntity.extend({
	classId: 'Fighter',

	team: 0,

	init: function (ownerId) {		
		this._super();

		var self = this;

		self.ownerId = ownerId;

		if (ige.isServer) {
			self.addComponent(IgeVelocityComponent);
		}

		if (!ige.isServer) {
			self.layer(ige.client.entityLayers.fighter);
			
			// Apply depth and increase
			self.depth(ige.client.layerDepthCount.fighters++);

			//self.addComponent(IgeAnimationComponent);

			// Apply initial texture
			self.applyTexture();
		}

		// Define the data sections that will be included in the stream
		self.streamSections(['transform']);
	},

	streamCreateData: function () {
		return this.ownerId;
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
	// streamSectionData: function (sectionId, data) {
	// 	// Check if the section is one that we are handling
	// 	if (sectionId === 'ownerId') {
	// 		// Check if the server sent us data, if not we are supposed
	// 		// to return the data instead of set it
	// 		if (data) {
	// 			// We have been given new data!
	// 			this.ownerId = data;
	// 		} else {
	// 			// Return current data
	// 			return this.ownerId;
	// 		}
	// 	} else {
	// 		// The section was not one that we handle here, so pass this
	// 		// to the super-class streamSectionData() method - it handles
	// 		// the "transform" section by itself
	// 		return this._super(sectionId, data);
	// 	}
	// },

	/**
	 * Called every frame by the engine when this entity is mounted to the
	 * scenegraph.
	 * @param ctx The canvas context to render to.
	 */
	tick: function (ctx) {
		/* CEXCLUDE */
		if (ige.isServer) {
			this.velocity.byAngleAndPower(this._rotate.z + Math.radians(-90), 0.1);

			// // Assume idle state
			// this.moveState = this.moveStates.idle;

			// // If player is further than 10 pixels away from the movement target
			// if (this.target) {
			// 	if (Math.abs(this._translate.x - this.target.x) > 10 || Math.abs(this._translate.y - this.target.y) > 10) {
			// 		var correctAngle = false;

			// 		// 1. Find relative distance and angle to target
			// 		var diffX = this._translate.x - this.target.x;
			// 		var diffY = this._translate.y - this.target.y;
			// 		var relativeDiffX = diffX * Math.cos(this._rotate.z - Math.radians(270)) + diffY * Math.sin(this._rotate.z - Math.radians(270));
			// 		var relativeDiffY = diffY * Math.cos(this._rotate.z - Math.radians(270)) - diffX * Math.sin(this._rotate.z - Math.radians(270));

			// 		var angle = Math.atan2(diffY, diffX) + Math.radians(270) - this._parent._rotate.z;
			// 		var relativeAngle = Math.atan2(relativeDiffY, relativeDiffX);

			// 		// 2. Rotate slightly in direction of new target
			// 		var rotation = 0;
			// 		if (relativeAngle > 0.005 && relativeAngle < Math.PI) {
			// 			rotation = 0.0005 * ige._tickDelta;
			// 		} else if (relativeAngle < -0.005 && relativeAngle > -Math.PI) {
			// 			rotation = -0.0005 * ige._tickDelta;
			// 		}
			// 		this.rotateBy(0, 0, rotation);

			// 		if (relativeAngle > -0.005 && relativeAngle < 0.005) {
			// 			this.rotateBy(0, 0, relativeAngle);
			// 			correctAngle = true;
			// 		}

			// 		if (correctAngle) {
			// 			this.velocity.byAngleAndPower(this._rotate.z + Math.radians(-90), 0.05);
			// 			this.moveState = this.moveStates.thrust;
			// 		}
			// 	} else {
			// 		this.velocity.x(0);
			// 		this.velocity.y(0);
			// 		this.moveState = this.moveStates.idle;
			// 	}
			// }
		}
		/* CEXCLUDE */

		if (!ige.isServer) {
			// if (this.moveState == 2) {
			// 	this.animation.stop('thrust');
			// 	this.cellById('idle');
			// } else if (this.moveState == 3) {
			// 	this.animation.select('thrust');
			// }
		}

		// Call the IgeEntity (super-class) tick() method
		this._super(ctx);
	},

	applyTexture: function() {
		var texture = ige.client.gameTextures.enemyFighter;

		var owner = ige.$(this.ownerId);
		if (owner.group() == "LocalPlayers") {
			texture = ige.client.gameTextures.localFighter;
		}

		this.texture(texture)
			.width(6)
			.height(8);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Fighter; }