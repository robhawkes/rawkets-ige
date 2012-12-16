var IgeSteeringBehaviourEvade = IgeSteeringBehaviour.extend({
	classId: 'IgeSteeringBehaviourEvade',

	init: function(entity, targetKinematics, weight) {
		this._super(entity, targetKinematics, weight);
	},

	getSteering: function() {
		// Update entity kinematic data
		this._updateEntityKinematic();

		// Grab first target, until this is updated to support multiple targets
		var targetKinematic = this._targetKinematics[0];

		var maxPredictionTime = 5;

		// Get direction to target
		var direction = targetKinematic.position.subtract(this._entityKinematic.position);
		var distance = direction.magnitude();

		// Get current speed
		var speed = this._entityKinematic.velocity.magnitude();

		var prediction = 0;

		// Check if speed is too small to give reasonable prediction time
		if (speed <= distance / maxPredictionTime) {
			prediction = maxPredictionTime;
		} else {
			prediction = distance / speed;
		}

		var fleeTarget = new IgeSteeringKinematic();
		fleeTarget.position = targetKinematic.position.clone();
		fleeTarget.position.thisAdd(targetKinematic.velocity.scale(prediction));

		var flee = new IgeSteeringBehaviourFlee(this._entity, [fleeTarget], 1);
		return flee.getSteering();
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeSteeringBehaviourEvade; }