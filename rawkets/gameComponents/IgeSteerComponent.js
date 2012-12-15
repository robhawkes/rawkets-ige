// Based on methods described within Artificial Intelligence for Games
// http://ai4g.com

var IgeSteerComponent = IgeClass.extend({
	classId: 'IgeSteerComponent',
	componentId: 'steer',

	init: function (entity, options) {
		this._entity = entity;

		var position = new IgeVector(entity._worldMatrix.matrix[2], entity._worldMatrix.matrix[5]);
		//var orientation = entity.worldRotationZ();
		var orientation = entity._rotate.z;
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
		//this._kinematic.orientation = this._entity.worldRotationZ();
		this._kinematic.orientation = this._entity._rotate.z;
		this._kinematic.velocity.x = this._entity.velocity._velocity.x;
		this._kinematic.velocity.y = this._entity.velocity._velocity.y;
		this._kinematic.rotation = this._entity.rotation;
	},

	kinematicSeek: function(target) {
		var maxSpeed = 0.1;
		var steering = new IgeSteerOutput();

		// Get direction to target
		steering.velocity = target.position.subtract(this._kinematic.position);

		// Set velocity along this direction at full speed
		steering.velocity.thisNormalize();
		steering.velocity.thisScale(this._entity.maxSpeed);

		steering.rotation = 0;

		return steering;
	},

	seek: function(target) {
		var steering = new IgeSteerOutput();

		// Get direction to target
		steering.velocity = target.position.subtract(this._kinematic.position);

		// Set velocity along this direction at full speed
		steering.velocity.thisNormalize();
		steering.velocity.thisScale(this._entity.maxAcceleration);

		steering.rotation = 0;

		return steering;
	},

	flee: function(target) {
		var maxAcceleration = 0.01;
		var steering = new IgeSteerOutput();

		// Get direction to target
		steering.velocity = this._kinematic.position.subtract(target.position);

		// Set velocity along this direction at full speed
		steering.velocity.thisNormalize();
		steering.velocity.thisScale(this._entity.maxAcceleration);

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
		var direction = target.position.subtract(this._kinematic.position);
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
		targetVelocity.thisNormalize();
		targetVelocity.thisScale(targetSpeed);

		// Acceleration tries to get to target velocity
		steering.velocity = targetVelocity.subtract(this._kinematic.velocity);
		steering.velocity.thisDivide(timeToTarget);

		// Check if acceleration is too fast
		if (steering.velocity.magnitude() > this._entity.maxAcceleration) {
			steering.velocity.thisNormalize();
			steering.velocity.thisScale(this._entity.maxAcceleration);
		}

		steering.rotation = 0;

		return steering;
	},

	// Something wrong with this, when rotating left it misses the angle by 90 degrees
	// My custom "rotate to target" logic for player ship movement could work here
	// All it needs to do is rotate to the target angle with some fancy acceleration
	// There is a potential solution in the getAngularSteering method of
	// https://github.com/Denzen/Steering-behaviors-in-js-and-canvas/blob/master/js/behaviors.js
	align2: function(target) {
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

	align: function(target) {
		// Radius at which the entity has arrived
		var targetRadius = Math.radians(5);
		// Radius to begin slowing down
		var slowRadius = Math.radians(20);

		//var rotation = this._entity.maxRotation;
		//var rotation = 0;

		// Time over which to achieve target speed
		var timeToTarget = 0.1;

		var agentOrientationAsVector = new IgeVector(Math.cos(this._kinematic.orientation), Math.sin(this._kinematic.orientation));
		var targetOrientationAsVector = new IgeVector(Math.cos(target.orientation), Math.sin(target.orientation));

		var angle = agentOrientationAsVector.angleTo(targetOrientationAsVector);
		var angle2 = targetOrientationAsVector.angleTo(agentOrientationAsVector);
		var distance = target.orientation - this._kinematic.orientation;

		// console.log("Target orientation: " + Math.degrees(target.orientation));
		// console.log("Entity orientation: " + Math.degrees(this._kinematic.orientation));

		var steering = new IgeSteerOutput();

		// Map the result to the (-pi, pi) interval
		var rotation = distance;
		if (distance > Math.PI) {
			rotation = distance - Math.PI * 2;
		}
		
		if (distance < -Math.PI) {
			rotation = distance + Math.PI * 2;
		}

		var rotationSize = Math.abs(rotation);

		// console.log("Angle: " + Math.degrees(angle));
		// console.log("Angle2: " + Math.degrees(angle2));
		// console.log("Distance: " + Math.degrees(distance));
		// console.log("Rotation: " + Math.degrees(rotation));
		// console.log("Rotation size: " + Math.degrees(rotationSize));

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

		//console.log("Target rotation: " + Math.degrees(targetRotation));

		// Acceleration tries to get to target rotation
		steering.rotation = targetRotation - this._kinematic.rotation;
		steering.rotation /= timeToTarget;

		// Check if acceleration is too fast
		var angularAcceleration = Math.abs(steering.rotation);
		if (angularAcceleration > this._entity.maxAngularAcceleration) {
			steering.rotation /= angularAcceleration;
			steering.rotation *= this._entity.maxAngularAcceleration;
		}

		//console.log("Steering rotation: " + Math.degrees(steering.rotation));

		return steering;
	},

	velocityMatch: function(target) {
		// Time over which to achieve target speed
		var timeToTarget = 0.1;

		var steering = new IgeSteerOutput();

		// Acceleration tries to get to target velocity
		steering.velocity = target.velocity.subtract(this._kinematic.velocity);
		steering.velocity.thisDivide(timeToTarget);

		// Check if acceleration is too fast
		if (steering.velocity.magnitude() > this._entity.maxAcceleration) {
			steering.velocity.thisNormalize();
			steering.velocity.thisScale(this._entity.maxAcceleration);
		}

		steering.rotation = 0;

		return steering;
	},

	// Use arrive instead of seek if entity is likely to be faster than (and catch up with) the target
	pursue: function(target) {
		var maxPredictionTime = 5;

		// Get direction to target
		var direction = target.position.subtract(this._kinematic.position);
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
		seekTarget.position.thisAdd(target.velocity.scale(prediction));

		return this.seek(seekTarget);
	},

	evade: function(target) {
		var maxPredictionTime = 5;

		// Get direction to target
		var direction = target.position.subtract(this._kinematic.position);
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

		var fleeTarget = {position: target.position.clone()};
		fleeTarget.position.thisAdd(target.velocity.thisScale(prediction));

		return this.flee(fleeTarget);
	},

	face: function(target) {
		// Get direction to target
		var direction = this._kinematic.position.subtract(target.position);

		// Check for zero direction, if so make no change
		if (direction.magnitude() === 0) {
			return new IgeSteerOutput();
		}

		var alignTarget = {orientation: Math.atan2(direction.y, direction.x) + Math.radians(270)};
		
		return this.align(alignTarget);
	},

	lookWhereYoureGoing: function() {
		// Check for zero direction, if so make no change
		if (this._kinematic.velocity.magnitude() === 0) {
			return new IgeSteerOutput();
		}

		// Otherwise, set target based on velocity
		var alignTarget = {orientation: Math.atan2(-this._kinematic.velocity.y, this._kinematic.velocity.x) + Math.radians(270)};
		
		return this.align(alignTarget);
	},

	// Needs work
	wander: function() {
		// Forward offset of wander target circle
		var wanderOffset = 50;
		// Radius of wander target circle
		var wanderRadius = 20;
		// Maximum rate at which the wander orientation can change (in radians)
		var wanderRate = 0.05;
		// Current orientation of the wander target
		var wanderOrientation = 0;

		// Update wander orientation
		wanderOrientation += this._randomBinomial() * wanderRate;

		// Calculate the combined target orientation
		var targetOrientation = wanderOrientation + this._kinematic.orientation;

		// Calculate the centre of the wander circle
		var target = this._kinematic.position.add(wanderOffset * this._kinematic.orientation.asVector());

		// Calculate the target location
		target.thisAdd(wanderRadius * targetOrientation.asVector());

		var steering = this.face(target);

		// Acceleration in direction of orientation
		steering.velocity = maxAcceleration * this._kinematic.orientation.asVector();

		return steering;
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