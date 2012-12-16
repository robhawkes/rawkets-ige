var IgeSteeringBehaviourFace = IgeSteeringBehaviour.extend({
	classId: 'IgeSteeringBehaviourFace',

	init: function(entity, targetKinematics, weight) {
		this._super(entity, targetKinematics, weight);
	},

	getSteering: function() {
		// Update entity kinematic data
		this._updateEntityKinematic();

		// Grab first target, until this is updated to support multiple targets
		var targetKinematic = this._targetKinematics[0];

		// Get direction to target
		var direction = this._entityKinematic.position.subtract(targetKinematic.position);

		// Check for zero direction, if so make no change
		if (direction.magnitude() === 0) {
			return new IgeSteerOutput();
		}

		var alignTarget = new IgeSteeringKinematic();
		alignTarget.orientation = Math.atan2(direction.y, direction.x) + Math.radians(270);

		var align = new IgeSteeringBehaviourAlign(this._entity, [alignTarget], 1);
		return align.getSteering();
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeSteeringBehaviourFace; }