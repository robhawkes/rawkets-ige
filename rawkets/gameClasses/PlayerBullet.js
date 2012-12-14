var PlayerBullet = IgeEntity.extend({
	classId: 'PlayerBullet',

	owner: null,

	init: function () {
		this._super();

		var self = this;

		this.addComponent(IgeVelocityComponent);

		if (ige.isServer) {
			
		}

		if (!ige.isServer) {
			// self.addComponent(IgeObbComponent, {
			// 	width: 4,
			// 	height: 4,
			// 	x: this._worldMatrix.matrix[2],
			// 	y: this._worldMatrix.matrix[5]
			// });

			self.layer(ige.client.entityLayers.bullet);

			self.texture(ige.client.gameTextures.bullet)
				.anchor(0, 0)
				.width(48)
				.height(48);
		}

		// Define the data sections that will be included in the stream
		//this.streamSections(['transform']);
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
	// 	if (sectionId === 'fireState') {
	// 		// Check if the server sent us data, if not we are supposed
	// 		// to return the data instead of set it
	// 		if (data) {
	// 			// We have been given new data!
	// 			this.fireState = data;
	// 		} else {
	// 			// Return current data
	// 			return this.fireState;
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

		}
		/* CEXCLUDE */

		if (!ige.isServer) {
			this.velocity.byAngleAndPower(this._rotate.z + Math.radians(-90), 1);

			// Check if within AABB of enemy for first-pass collision
			var targetCategory = (this.owner.category() == 'LocalPlayers') ? 'EnemyPlayers' : 'LocalPlayers';
			var entities = ige.$$(targetCategory);
			var entityCount = entities.length;

			// Loop through entities
			for (var i=0; i < entityCount; i++) {
				// Why is the entity inside another array?
				var entity = entities[i];

				// Skip if this entity
				// if (this.owner.id() === entity.id()) {
				// 	continue;
				// }

				// // Skip if owned by the current entity
				// if (this.owner._parent.id() === entity.id()) {
				// 	continue;
				// }

				// // Skip if owned by the same entity
				// if (entity._parent && owner._parent.id() === entity._parent.id()) {
				// 	continue;
				// }

				// Skip if on the same team
				// if (this.owner.team === entity.team) {
				// 	continue;
				// }

				// Ideally want to use AABB boxes for first-pass collision checks but
				// it seems they aren't in global worldspace, causing funkiness
				// Talk to Rob about getting around this
				// Update: Using relative translate seems to work fine
				var aabb = entity.aabb();
				//if (aabb.xyInside(this._worldMatrix.matrix[2], this._worldMatrix.matrix[5])) {
				if (aabb.xyInside(this._translate.x, this._translate.y)) {
					// Perform fine-level check to see if bullet is overlapping considering OBB
					// if (!this.obb.checkCollisionBoolean(this.obb._poly, entity.obb._poly)) {
					// 	continue;
					// } else {
					// 	this.destroy();
					// 	break;
					// }

					// console.log("Hit");

					// Spawn explosion particles
					// Example emitter
					var particleRotation = Math.ceil(Math.random()*360);
					
					var emitter = new IgeParticleEmitter()
						//.id('emitter1')
						.particle(ExplosionParticle)
						.lifeBase(500)
						.quantityTimespan(1)
						.quantityBase(4)
						.quantityMax(4)
						.rotateBase(particleRotation)
						.velocityVector(new IgePoint(0, 0, 0), new IgePoint(-0.02, -0.02, 0), new IgePoint(0.02, 0.02, 0))
						.deathRotateBase(particleRotation)
						.deathRotateVariance(-45, 45)
						.deathOpacityBase(0.0)
						.layer(10000)
						.depth(1)
						.width(32)
						.height(32)
						.translateTo(this._translate.x, this._translate.y, 0)
						.particleMountTarget(this._parent)
						.mount(this._parent)
						.start();

					setTimeout(function() {
						emitter.destroy();
					}, 1000);

					this.destroy();
					break;
				}
			}
		}

		// Call the IgeEntity (super-class) tick() method
		this._super(ctx);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerBullet; }