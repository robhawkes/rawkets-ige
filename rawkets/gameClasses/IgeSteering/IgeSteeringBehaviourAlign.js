var IgeSteeringBehaviourAlign = IgeSteeringBehaviour.extend({
	classId: 'IgeSteeringBehaviourAlign',

	init: function(entity, targetKinematics, weight) {
		this._super(entity, targetKinematics, weight);
	},

	getSteering: function() {
		// Update entity kinematic data
		this._updateEntityKinematic();

		// Grab first target, until this is updated to support multiple targets
		var targetKinematic = this._targetKinematics[0];

		// Radius at which the entity has arrived
		var targetRadius = Math.radians(5);
		// Radius to begin slowing down
		var slowRadius = Math.radians(40);

		//var rotation = this._entity.maxRotation;
		//var rotation = 0;

		// Time over which to achieve target speed
		var timeToTarget = 0.1;

		var agentOrientationAsVector = new IgeVector(Math.cos(this._entityKinematic.orientation), Math.sin(this._entityKinematic.orientation));
		var targetOrientationAsVector = new IgeVector(Math.cos(targetKinematic.orientation), Math.sin(targetKinematic.orientation));

		var angle = agentOrientationAsVector.angleTo(targetOrientationAsVector);
		var angle2 = targetOrientationAsVector.angleTo(agentOrientationAsVector);
		var distance = targetKinematic.orientation - this._entityKinematic.orientation;

		// console.log("Target orientation: " + Math.degrees(target.orientation));
		// console.log("Entity orientation: " + Math.degrees(this._kinematic.orientation));

		var steering = new IgeSteeringOutput();

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
			targetRotation = this._entityKinematic.maxRotation;
		// Otherwise calculate scaled speed
		} else {
			targetRotation = this._entityKinematic.maxRotation * (rotationSize / slowRadius);
		}

		targetRotation *= rotation / rotationSize;

		//console.log("Target rotation: " + Math.degrees(targetRotation));

		// Acceleration tries to get to target rotation
		steering.rotation = targetRotation - this._entityKinematic.rotation;
		steering.rotation /= timeToTarget;

		// Check if acceleration is too fast
		var angularAcceleration = Math.abs(steering.rotation);
		if (angularAcceleration > this._entityKinematic.maxAngularAcceleration) {
			steering.rotation /= angularAcceleration;
			steering.rotation *= this._entityKinematic.maxAngularAcceleration;
		}

		//console.log("Steering rotation: " + Math.degrees(steering.rotation));

		return steering;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeSteeringBehaviourAlign; }