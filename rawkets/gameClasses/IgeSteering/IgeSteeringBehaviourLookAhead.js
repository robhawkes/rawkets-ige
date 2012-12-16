var IgeSteeringBehaviourLookAhead = IgeSteeringBehaviour.extend({
	classId: 'IgeSteeringBehaviourLookAhead',

	init: function(entity, targetKinematics, weight) {
		this._super(entity, targetKinematics, weight);
	},

	getSteering: function() {
		// Update entity kinematic data
		this._updateEntityKinematic();

		// Check for zero direction, if so make no change
		if (this._entityKinematic.velocity.magnitude() === 0) {
			return new IgeSteeringOutput();
		}

		// Otherwise, set target based on velocity
		var alignTarget = new IgeSteeringKinematic();
		alignTarget.orientation = Math.atan2(this._entityKinematic.velocity.y, this._entityKinematic.velocity.x) + Math.radians(90);

		var align = new IgeSteeringBehaviourAlign(this._entity, [alignTarget], 1);
		return align.getSteering();
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeSteeringBehaviourLookAhead; }