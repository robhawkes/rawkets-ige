var IgeSteeringBehaviourVelocityMatch = IgeSteeringBehaviour.extend({
	classId: 'IgeSteeringBehaviourVelocityMatch',

	init: function(entity, targetKinematics, weight) {
		this._super(entity, targetKinematics, weight);
	},

	getSteering: function() {
		// Update entity kinematic data
		this._updateEntityKinematic();

		// Grab first target, until this is updated to support multiple targets
		var targetKinematic = this._targetKinematics[0];

		// Time over which to achieve target speed
		var timeToTarget = 0.1;

		var steering = new IgeSteeringOutput();

		// Acceleration tries to get to target velocity
		steering.velocity = targetKinematic.velocity.subtract(this._entityKinematic.velocity);
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

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeSteeringBehaviourVelocityMatch; }