var Fighter = IgeEntity.extend({
	classId: 'Fighter',

	team: 0,

	init: function (ownerId) {
		this._super();

		var self = this;

		self.ownerId = ownerId;

		self.group(self.classId());

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
			// 1. Find nearest target entity
			var targetEntity = this.findTargetEntityByType('Fighter', this._parent);

			//console.log(targetEntity);

			//this.velocity.byAngleAndPower(this._rotate.z + Math.radians(-90), 0.1);

			// If player is further than 10 pixels away from the movement target
			if (targetEntity) {
				var target = targetEntity._translate;
				//if (Math.abs(this._translate.x - target.x) > 10 || Math.abs(this._translate.y - target.y) > 10) {
					// 1. Find relative distance and angle to target
					var diffX = this._translate.x - target.x;
					var diffY = this._translate.y - target.y;
					var relativeDiffX = diffX * Math.cos(this._rotate.z - Math.radians(270)) + diffY * Math.sin(this._rotate.z - Math.radians(270));
					var relativeDiffY = diffY * Math.cos(this._rotate.z - Math.radians(270)) - diffX * Math.sin(this._rotate.z - Math.radians(270));

					var angle = Math.atan2(diffY, diffX) + Math.radians(270) - this._parent._rotate.z;
					var relativeAngle = Math.atan2(relativeDiffY, relativeDiffX);

					// 2. Rotate slightly in direction of new target
					var rotation = 0;
					if (relativeAngle > 0.005 && relativeAngle < Math.PI) {
						rotation = 0.005 * ige._tickDelta;
					} else if (relativeAngle < -0.005 && relativeAngle > -Math.PI) {
						rotation = -0.005 * ige._tickDelta;
					}
					this.rotateBy(0, 0, rotation);

					if (relativeAngle > -0.005 && relativeAngle < 0.005) {
						this.rotateBy(0, 0, relativeAngle);
					}

					this.velocity.byAngleAndPower(this._rotate.z + Math.radians(-90), 0.1);
				// } else {
				// 	// Do something if there is no target
				// 	// Just fly aimlessly?
				// 	this.velocity.x(0);
				// 	this.velocity.y(0);
				// }
			}
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
	},

	findTargetEntityByType: function(entityType) {
		//var entities = ig.game.getEntitiesByType(entityType);
		var entities = ige.$$(entityType);
		var entityCount = entities.length;

		var nearestDistance = Infinity;
		var nearestEntity = null;

		// Loop through entities
		for (var i=0; i < entityCount; i++) {
			// Why is the entity inside another array?
			var entity = entities[i];

			// Skip if this entity
			if (this.id() === entity.id()) {
				continue;
			}

			// Skip if owned by the current entity
			if (this.ownerId === entity.id()) {
				continue;
			}

			// Skip if owned by the same entity
			if (entity.ownerId && this.ownerId === entity.ownerId) {
				continue;
			}

			// Skip if on the same team
			// if (this.team === entity.team) {
			// 	continue;
			// }

			//var distance = owner.distanceTo(entity);
			var distance = Math.distance(this._worldMatrix.matrix[2], this._worldMatrix.matrix[5], entity._worldMatrix.matrix[2], entity._worldMatrix.matrix[5]);

			if (distance < nearestDistance) {
				nearestDistance = distance;
				nearestEntity = entity;
			}
		}

		return nearestEntity;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Fighter; }