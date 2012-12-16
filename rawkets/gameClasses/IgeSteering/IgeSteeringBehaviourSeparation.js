var IgeSteeringBehaviourSeparation = IgeSteeringBehaviour.extend({
	classId: 'IgeSteeringBehaviourSeparation',

	init: function(entity, targetKinematics, weight) {
		this._super(entity, targetKinematics, weight);
	},

	getSteering: function() {
		// Update entity kinematic data
		this._updateEntityKinematic();

		// Threshold to take action – target distance from entity
		var threshold = 15;

		// Constant coefficiant of decay for the inverse square law force
		var decayCoefficient = 0.01; // Update this with actual value

		var steering = new IgeSteeringOutput();

		for (var i = 0; i < this._targetKinematics.length; i++) {
			var targetKinematic = this._targetKinematics[i];

			// Check if target is close
			//var direction = targetKinematic.position.subtract(this._entityKinematic.position);
			var direction = this._entityKinematic.position.subtract(targetKinematic.position);
			var distance = direction.magnitude();

			// For now, skip targets that are exactly in the same position
			if (distance === 0) {
				continue;
			}

			if (distance < threshold) {
				// Strength of repulsion
				var strength = Math.min(decayCoefficient / (distance * distance), this._entityKinematic.maxAcceleration);
				//var strength = this._entityKinematic.maxAcceleration;

				// Add the acceleration
				direction.thisNormalize();
				steering.velocity.thisAdd(direction.scale(strength));
			}
		}

		return steering;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeSteeringBehaviourSeparation; }