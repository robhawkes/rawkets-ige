var Fighter = IgeEntity.extend({
	classId: 'Fighter',

	team: 0,

	// Should these go somewhere else?
	maxAcceleration: 0.0005,
	maxVelocity: 0.1,
	maxAngularAcceleration: Math.radians(0.01),
	maxRotation: Math.radians(1),
	rotation: 0,
	friction: 0.96,

	init: function (ownerId) {
		this._super();

		var self = this;

		self.ownerId = ownerId;

		self.category(self.classId());

		if (ige.isServer) {
			self.addComponent(IgeVelocityComponent);
			//self.velocity.x(0.1);
			//self.velocity.y(0.1);
			//self.velocity.x(Math.random()*0.1 - 0.05);
			//self.velocity.y(Math.random()*0.1 - 0.05);

			self.addComponent(IgeSteerComponent);
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
			// Test steer component
			// Seek
			//var steering = this.steer.seek({position: new IgeVector(100, -100)});
			// Flee
			//var steering = this.steer.flee({position: new IgeVector(100, -100)});
			// Arrive
			var steering = this.steer.arrive({position: new IgeVector(100, -100)});
			// Align
			//var steering = this.steer.align({orientation: Math.radians(95)});
			// Align2
			//var steering = this.steer.align2({orientation: Math.radians(90)});
			//var steering = this.steer.align2({orientation: Math.radians(225)});
			//var steering = this.steer.align2({orientation: Math.radians(315)});
			// Velocity match
			//var steering = this.steer.velocityMatch({velocity: new IgeVector(0.1, 0)});
			// Pursue
			//var steering = this.steer.pursue({velocity: new IgeVector(0.1, 0.1), position: new IgeVector(200, -200)});
			//console.log(steering.velocity.x);
			//var steering = this.steer.pursue({velocity: new IgeVector(0, 0), position: new IgeVector(200, -200)});
			// Evade
			//var steering = this.steer.evade({velocity: new IgeVector(0, 0), position: new IgeVector(200, -200)});
			// Face
			//var steering = this.steer.face({position: new IgeVector(200, -200)});
			// Look where you're going
			//var steering = this.steer.lookWhereYoureGoing();
			
			this.velocity._velocity.x += steering.velocity.x * ige._tickDelta;
			this.velocity._velocity.y += steering.velocity.y * ige._tickDelta;

			this.rotation += steering.rotation * ige._tickDelta;
			this._rotate.z += this.rotation;

			// Find all friendly fighters
			// var friendlyFighters = this.findFriendlyFighters();

			// var friendlyFighterCount = friendlyFighters.length;
			// if (friendlyFighterCount > 0) {
			// 	// Rule 1: Boids try to fly towards the centre of mass of neighbouring boids
			// 	var rule1Vector = new IgePoint(0, 0, 0);
			// 	for (var r1 = 0; r1 < friendlyFighterCount; r1++) {
			// 		if (friendlyFighters[r1].id() !== this.id()) {
			// 			rule1Vector.thisAddPoint(friendlyFighters[r1]._translate);
			// 		}
			// 	}
			// 	rule1Vector.thisDivide(friendlyFighterCount, friendlyFighterCount, friendlyFighterCount);
				
			// 	rule1Vector.x = (rule1Vector.x - this._translate.x) / 20000;
			// 	rule1Vector.y = (rule1Vector.y - this._translate.y) / 20000;

			// 	// Rule 2: Boids try to keep a small distance away from other objects (including other boids)
			// 	var rule2Vector = new IgePoint(0, 0, 0);
			// 	for (var r2 = 0; r2 < friendlyFighterCount; r2++) {
			// 		if (friendlyFighters[r2].id() != this.id()) {
			// 			if (Math.distance(this._translate.x, this._translate.y, friendlyFighters[r2]._translate.x, friendlyFighters[r2]._translate.y) < 15) {
			// 				var subtractBoidVectors = friendlyFighters[r2]._translate.minusPoint(this._translate);
			// 				rule2Vector.thisMinusPoint(subtractBoidVectors);
			// 				rule2Vector.thisMultiply(0.0002, 0.0002, 0.0002);
			// 			}
			// 		}
			// 	}

			// 	// Rule 3: Boids try to match velocity with near boids
			// 	var rule3Vector = new IgePoint(0, 0, 0);
			// 	//if (!scatter) {
			// 		for (var r3 = 0; r3 < friendlyFighterCount; r3++) {
			// 			if (friendlyFighters[r3].id() != this.id()) {
			// 				rule3Vector.thisAddPoint(friendlyFighters[r3].velocity._velocity);
			// 			}
			// 		}
			// 		rule3Vector.thisDivide(friendlyFighterCount, friendlyFighterCount, friendlyFighterCount);
				
			// 		rule3Vector.x = (rule3Vector.x - this.velocity._velocity.x) / 50;
			// 		rule3Vector.y = (rule3Vector.y - this.velocity._velocity.y) / 50;
			// 	//}

			// 	// Add velocities
			// 	var rulesVelocity = new IgePoint(0, 0, 0);
			// 	rulesVelocity.thisAddPoint(rule1Vector);
			// 	rulesVelocity.thisAddPoint(rule2Vector);
			// 	rulesVelocity.thisAddPoint(rule3Vector);
			// 	//rulesVelocity.add(rule4Vector);
				
			// 	this.velocity._velocity.thisAddPoint(rulesVelocity);
			// }

			this.limitVelocity();

			// Apply friction
			this.velocity._velocity.x *= this.friction;
			this.velocity._velocity.y *= this.friction;
			
			if (Math.abs(this.velocity._velocity.x) < 0.0001) {
				this.velocity._velocity.x = 0;
			}

			if (Math.abs(this.velocity._velocity.y) < 0.0001) {
				this.velocity._velocity.y = 0;
			}
			
			this.rotation *= this.friction;

			if (Math.abs(this.rotation) < 0.0001) {
				this.rotation = 0;
			}

			// // 1. Find nearest target entity
			// var targetEntity = this.findTargetEntityByType('Fighter', this._parent);

			// //console.log(targetEntity);

			// //this.velocity.byAngleAndPower(this._rotate.z + Math.radians(-90), 0.1);

			// // If player is further than 10 pixels away from the movement target
			// if (targetEntity) {
			// 	var target = targetEntity._translate;
			// 	//if (Math.abs(this._translate.x - target.x) > 10 || Math.abs(this._translate.y - target.y) > 10) {
			// 		// 1. Find relative distance and angle to target
			// 		var diffX = this._translate.x - target.x;
			// 		var diffY = this._translate.y - target.y;
			// 		var relativeDiffX = diffX * Math.cos(this._rotate.z - Math.radians(270)) + diffY * Math.sin(this._rotate.z - Math.radians(270));
			// 		var relativeDiffY = diffY * Math.cos(this._rotate.z - Math.radians(270)) - diffX * Math.sin(this._rotate.z - Math.radians(270));

			// 		var angle = Math.atan2(diffY, diffX) + Math.radians(270) - this._parent._rotate.z;
			// 		var relativeAngle = Math.atan2(relativeDiffY, relativeDiffX);

			// 		// 2. Rotate slightly in direction of new target
			// 		var rotation = 0;
			// 		if (relativeAngle > 0.005 && relativeAngle < Math.PI) {
			// 			rotation = 0.005 * ige._tickDelta;
			// 		} else if (relativeAngle < -0.005 && relativeAngle > -Math.PI) {
			// 			rotation = -0.005 * ige._tickDelta;
			// 		}
			// 		this.rotateBy(0, 0, rotation);

			// 		if (relativeAngle > -0.005 && relativeAngle < 0.005) {
			// 			this.rotateBy(0, 0, relativeAngle);
			// 		}

			// 		this.velocity.byAngleAndPower(this._rotate.z + Math.radians(-90), 0.1);
			// 	// } else {
			// 	// 	// Do something if there is no target
			// 	// 	// Just fly aimlessly?
			// 	// 	this.velocity.x(0);
			// 	// 	this.velocity.y(0);
			// 	// }
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
		if (owner.category() == "LocalPlayers") {
			texture = ige.client.gameTextures.localFighter;
		}

		this.texture(texture)
			.width(6)
			.height(8);
	},

	findFriendlyFighters: function() {
		var entities = ige.$$("Fighter");
		var entityCount = entities.length;

		var returnedEntities = [];

		// Loop through entities
		for (var i=0; i < entityCount; i++) {
			// Why is the entity inside another array?
			var entity = entities[i];

			// Skip if this entity
			if (this.id() === entity.id()) {
				continue;
			}

			// // Skip if owned by the current entity
			// if (this.ownerId === entity.id()) {
			// 	continue;
			// }

			// Skip if not owned by the same entity
			if (entity.ownerId && this.ownerId !== entity.ownerId) {
				continue;
			}

			// Skip if on the same team
			// if (this.team === entity.team) {
			// 	continue;
			// }

			//var distance = owner.distanceTo(entity);
			// var distance = Math.distance(this._worldMatrix.matrix[2], this._worldMatrix.matrix[5], entity._worldMatrix.matrix[2], entity._worldMatrix.matrix[5]);

			// if (distance < nearestDistance) {
			// 	nearestDistance = distance;
			// 	nearestEntity = entity;
			// }

			returnedEntities.push(entity);
		}

		return returnedEntities;
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
	},

	limitVelocity: function() {
		// Magnitude (hypotenuse) of velocity
		var velocity = Math.sqrt(this.velocity._velocity.x * this.velocity._velocity.x + this.velocity._velocity.y * this.velocity._velocity.y);

		if (velocity > this.maxVelocity) {
			this.velocity._velocity.x = (this.velocity._velocity.x/velocity) * this.maxVelocity;
			this.velocity._velocity.y = (this.velocity._velocity.y/velocity) * this.maxVelocity;
		}

		if (this.rotation > this.maxRotation) {
			this.rotation = this.maxRotation;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Fighter; }