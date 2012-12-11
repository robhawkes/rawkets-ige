var PlayerTurret = IgeEntity.extend({
	classId: 'PlayerTurret',

	fireStates: {
		idle: 2,
		fire: 3
	},

	fireState: null,

	lastFireTime: null,

	init: function (id) {
		this._super();

		this.id(id);

		var self = this;

		this.drawBounds(false);

		this.fireState = this.fireStates.idle;
		this.lastFireTime = 0;

		if (ige.isServer) {
			
		}

		if (!ige.isServer) {
			self.addComponent(IgeAnimationComponent);
			self.texture(ige.client.gameTextures.turret)
			.anchor(0, 3)
			.width(10)
			.height(16);
		}

		// Define the data sections that will be included in the stream
		this.streamSections(['transform', 'fireState']);
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
		if (sectionId === 'fireState') {
			// Check if the server sent us data, if not we are supposed
			// to return the data instead of set it
			if (data) {
				// We have been given new data!
				this.fireState = data;
			} else {
				// Return current data
				return this.fireState;
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

		}
		/* CEXCLUDE */

		if (!ige.isServer) {
			// Find nearest enemy ship
			var targetGroup = (this._parent.group() == 'LocalPlayers') ? 'EnemyPlayers' : 'LocalPlayers';
			var targetEntity = this.findTargetEntityByType(targetGroup, this._parent);

			if (targetEntity) {
				// Rotate towards it if within range
				var diffX = this._worldMatrix.matrix[2] - targetEntity._worldMatrix.matrix[2];
				var diffY = this._worldMatrix.matrix[5] - targetEntity._worldMatrix.matrix[5];
				var angle = Math.atan2(diffY, diffX) + Math.radians(270) - this._parent._rotate.z;
				// var angle = this.angleTo(targetEntity);

				// // Fuzz the angle (probably won't be necessary when using slow rotation)
				//angle += 0.05 - Math.random()*0.1;
				
				// this.currentAnim.angle = angle;
				//this.rotateBy(0, 0, 0.0005 * ige._tickDelta);
				this.rotateTo(this._rotate.x, this._rotate.y, angle);

				// If within range, and when ready, fire weapon
				if (Date.now() - this.lastFireTime > 300 + Math.random()*700) {
					var bullet = new PlayerBullet()
						.width(48)
						.height(48)
						.translateTo(this._worldMatrix.matrix[2], this._worldMatrix.matrix[5], 0)
						.rotateTo(this._parent._rotate.x + this._rotate.x, this._parent._rotate.y + this._rotate.y, this._parent._rotate.z + this._rotate.z)
						.lifeSpan(1000)
						.mount(ige.client.scene1);

					bullet.owner = this._parent;

					this.lastFireTime = Date.now();
				}
			}
		}

		// Call the IgeEntity (super-class) tick() method
		this._super(ctx);
	},

	findTargetEntityByType: function(entityType, owner) {
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
			if (owner.id() === entity.id()) {
				continue;
			}

			// Skip if owned by the current entity
			if (owner._parent.id() === entity.id()) {
				continue;
			}

			// // Skip if owned by the same entity
			// if (entity._parent && owner._parent.id() === entity._parent.id()) {
			// 	continue;
			// }

			// Skip if on the same team
			if (owner.team === entity.team) {
				continue;
			}

			//var distance = owner.distanceTo(entity);
			var distance = Math.distance(owner._worldMatrix.matrix[2], owner._worldMatrix.matrix[5], entity._worldMatrix.matrix[2], entity._worldMatrix.matrix[5]);

			if (distance < nearestDistance) {
				nearestDistance = distance;
				nearestEntity = entity;
			}
		}

		return nearestEntity;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerTurret; }