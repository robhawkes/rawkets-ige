var IgeSteeringBehaviourArrive = IgeSteeringBehaviour.extend({
	classId: 'IgeSteeringBehaviourArrive',

	init: function(entity, targetKinematics, weight) {
		this._super(entity, targetKinematics, weight);
	},

	getSteering: function() {
		// Update entity kinematic data
		this._updateEntityKinematic();

		// Grab first target, until this is updated to support multiple targets
		var targetKinematic = this._targetKinematics[0];

		// Radius at which the entity has arrived
		var targetRadius = 20;

		// Radius to begin slowing down
		var slowRadius = 60;

		// Time over which to achieve target speed
		var timeToTarget = 0.1;

		var steering = new IgeSteeringOutput();

		// Get direction to target
		var direction = targetKinematic.position.subtract(this._entityKinematic.position);
		var distance = direction.magnitude();

		// Reached target, apply no steering
		if (distance < targetRadius) {
			return steering;
		}

		var targetSpeed = 0;

		// Outside slow radius, apply full speed
		if (distance > slowRadius) {
			targetSpeed = this._entityKinematic.maxVelocity;
		// Otherwise calculate scaled speed
		} else {
			targetSpeed = this._entityKinematic.maxVelocity * (distance / slowRadius);
		}

		var targetVelocity = direction;
		targetVelocity.thisNormalize();
		targetVelocity.thisScale(targetSpeed);

		// Acceleration tries to get to target velocity
		steering.velocity = targetVelocity.subtract(this._entityKinematic.velocity);
		steering.velocity.thisDivide(timeToTarget);

		// Check if acceleration is too fast
		if (steering.velocity.magnitude() > this._entityKinematic.maxAcceleration) {
			steering.velocity.thisNormalize();
			steering.velocity.thisScale(this._entityKinematic.maxAcceleration);
		}

		steering.rotation = 0;

		return steering;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeSteeringBehaviourArrive; }