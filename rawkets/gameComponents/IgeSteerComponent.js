var IgeSteerComponent = IgeClass.extend({
	classId: 'IgeSteerComponent',
	componentId: 'steer',

	init: function (entity, options) {
		this._entity = entity;

		var position = new IgeVector(entity._worldMatrix.matrix[2], entity._worldMatrix.matrix[5]);
		var orientation = entity.worldRotationZ();
		var velocity = this._pointToVector(entity.velocity._velocity);
		var rotation = entity.rotation;
		this._kinematic = new IgeKinematic(position, orientation, velocity, rotation);

		// Add the behaviour to the entity
		entity.addBehaviour('steer', this._behaviour);
	},

	/**
	* The behaviour method executed each tick.
	* @param ctx
	* @private
	*/
	_behaviour: function (ctx) {
		this.steer.tick(ctx);
	},

	_pointToVector: function(point) {
		var vector = new IgeVector(point.x, point.y);
		return vector;
	},

	_updateKinematic: function() {
		this._kinematic.position.x = this._entity._worldMatrix.matrix[2];
		this._kinematic.position.y = this._entity._worldMatrix.matrix[5];
		this._kinematic.orientation = this._entity.worldRotationZ();
		this._kinematic.velocity.x = this._entity.velocity._velocity.x;
		this._kinematic.velocity.y = this._entity.velocity._velocity.y;
		this._kinematic.rotation = this._entity.rotation;
	},

	kinematicSeek: function(target) {
		var maxSpeed = 0.1;
		var steering = new IgeSteerOutput();

		// Get direction to target
		steering.velocity = target.position.thisSubtract(this._kinematic.position);

		// Set velocity along this direction at full speed
		steering.velocity.normalize();
		steering.velocity.scale(this._entity.maxSpeed);

		steering.rotation = 0;

		return steering;
	},

	seek: function(target) {
		var steering = new IgeSteerOutput();

		// Get direction to target
		steering.velocity = target.position.thisSubtract(this._kinematic.position);

		// Set velocity along this direction at full speed
		steering.velocity.normalize();
		steering.velocity.scale(this._entity.maxAcceleration);

		steering.rotation = 0;

		return steering;
	},

	flee: function(target) {
		var maxAcceleration = 0.01;
		var steering = new IgeSteerOutput();

		// Get direction to target
		steering.velocity = this._kinematic.position.thisSubtract(target.position);

		// Set velocity along this direction at full speed
		steering.velocity.normalize();
		steering.velocity.scale(this._entity.maxAcceleration);

		steering.rotation = 0;

		return steering;
	},

	arrive: function(target) {
		// Radius at which the entity has arrived
		var targetRadius = 20;

		// Radius to begin slowing down
		var slowRadius = 60;

		// Time over which to achieve target speed
		var timeToTarget = 0.1;

		var steering = new IgeSteerOutput();

		// Get direction to target
		var direction = target.position.thisSubtract(this._kinematic.position);
		var distance = direction.magnitude();

		// Reached target, apply no steering
		if (distance < targetRadius) {
			return steering;
		}

		var targetSpeed = 0;

		// Outside slow radius, apply full speed
		if (distance > slowRadius) {
			targetSpeed = this._entity.maxVelocity;
		// Otherwise calculate scaled speed
		} else {
			targetSpeed = this._entity.maxVelocity * (distance / slowRadius);
		}

		var targetVelocity = direction;
		targetVelocity.normalize();
		targetVelocity.scale(targetSpeed);

		// Acceleration tries to get to target velocity
		steering.velocity = targetVelocity.thisSubtract(this._kinematic.velocity);
		steering.velocity.divide(timeToTarget);

		// Check if acceleration is too fast
		if (steering.velocity.magnitude() > this._entity.maxAcceleration) {
			steering.velocity.normalize();
			steering.velocity.scale(this._entity.maxAcceleration);
		}

		steering.rotation = 0;

		return steering;
	},

	// Something wrong with this, when rotating left it misses the angle by 90 degrees
	// My custom "rotate to target" logic for player ship movement could work here
	// All it needs to do is rotate to the target angle with some fancy acceleration
	// There is a potential solution in the getAngularSteering method of
	// https://github.com/Denzen/Steering-behaviors-in-js-and-canvas/blob/master/js/behaviors.js
	align: function(target) {
		// Radius at which the entity has arrived
		var targetRadius = Math.radians(5);

		// Radius to begin slowing down
		var slowRadius = Math.radians(20);

		// Time over which to achieve target speed
		var timeToTarget = 0.1;

		var steering = new IgeSteerOutput();

		// Get direction to target
		var rotation = target.orientation - this._kinematic.orientation;

		//console.log(rotation);

		// Map the result to the (-pi, pi) interval
		rotation = this._mapToRange(rotation);
		var rotationSize = Math.abs(rotation);

		//console.log(rotation);

		// Reached target, apply no steering
		if (rotationSize < targetRadius) {
			return steering;
		}

		var targetRotation = 0;

		// Outside slow radius, apply full speed
		if (rotationSize > slowRadius) {
			targetRotation = this._entity.maxRotation;
		// Otherwise calculate scaled speed
		} else {
			targetRotation = this._entity.maxRotation * (rotationSize / slowRadius);
		}

		targetRotation *= rotation / rotationSize;

		// Acceleration tries to get to target rotation
		steering.rotation = targetRotation - this._kinematic.rotation;
		steering.rotation /= timeToTarget;

		// Check if acceleration is too fast
		var angularAcceleration = Math.abs(steering.rotation);
		if (angularAcceleration > this._entity.maxAngularAcceleration) {
			steering.rotation /= angularAcceleration;
			steering.rotation *= this._entity.maxAngularAcceleration;
		}

		return steering;
	},

	velocityMatch: function(target) {
		// Time over which to achieve target speed
		var timeToTarget = 0.1;

		var steering = new IgeSteerOutput();

		// Acceleration tries to get to target velocity
		steering.velocity = target.velocity.thisSubtract(this._kinematic.velocity);
		steering.velocity.divide(timeToTarget);

		// Check if acceleration is too fast
		if (steering.velocity.magnitude() > this._entity.maxAcceleration) {
			steering.velocity.normalize();
			steering.velocity.scale(this._entity.maxAcceleration);
		}

		steering.rotation = 0;

		return steering;
	},

	pursue: function(target) {
		var maxPredictionTime = 5;

		// Get direction to target
		var direction = target.position.thisSubtract(this._kinematic.position);
		var distance = direction.magnitude();

		// Get current speed
		var speed = this._kinematic.velocity.magnitude();

		var prediction = 0;

		// Check if speed is too small to give reasonable prediction time
		if (speed <= distance / maxPredictionTime) {
			prediction = maxPredictionTime;
		} else {
			prediction = distance / speed;
		}

		var seekTarget = {position: target.position.clone()};
		seekTarget.position.add(target.velocity.thisScale(prediction));

		return this.seek(seekTarget);
	},

	evade: function(target) {
		var maxPredictionTime = 5;

		// Get direction to target
		var direction = target.position.thisSubtract(this._kinematic.position);
		var distance = direction.magnitude();

		// Get current speed
		var speed = this._kinematic.velocity.magnitude();

		var prediction = 0;

		// Check if speed is too small to give reasonable prediction time
		if (speed <= distance / maxPredictionTime) {
			prediction = maxPredictionTime;
		} else {
			prediction = distance / speed;
		}

		var evadeTarget = {position: target.position.clone()};
		evadeTarget.position.add(target.velocity.thisScale(prediction));

		return this.flee(evadeTarget);
	},

	face: function(target) {

	},

	lookWhereYoureGoing: function() {

	},

	wander: function() {

	},

	followPath: function(path) {

	},

	separation: function(targets) {

	},

	collisionAvoidance: function(targets) {

	},

	obstacleAvoidance: function() {

	},

	_mapToRange: function(rotation) {
		var angle = 0;
		var halfCircle = Math.PI;
		
		var multiple = Math.round(rotation/(Math.PI*2))*(Math.PI*2);
		if (rotation < -halfCircle) {
			// Subtract multiple of Math.PI*2
			angle = rotation + multiple;
		} else if (rotation > halfCircle) {
			// Add multiple of Math.PI*2
			angle = rotation - multiple;
		} else {
			angle = rotation;
		}

		return angle;
	},

	tick: function (ctx) {
		// Update kinematic data
		this._updateKinematic();

		// ctx.save();
		// ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
		// ctx.translate(this._poly.center.x, this._poly.center.y);
		// ctx.rotate(this._poly.angle);
		// ctx.fillRect(-this._poly.halfWidth, -this._poly.halfHeight, this._poly.w, this._poly.h);
		// ctx.restore();
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeSteerComponent; }

// Kinematic definition
var IgeKinematic = function(position, orientation, velocity, rotation) {
	this.position = position;
	this.orientation = orientation;
	this.velocity = velocity; // Linear velocity
	this.rotation = rotation; // Angular velocity
};

// Steering output definition
var IgeSteerOutput = function() {
	this.velocity = new IgeVector(0, 0);
	this.rotation = 0;
};