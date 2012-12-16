var IgeSteeringBehaviourWander = IgeSteeringBehaviour.extend({
	classId: 'IgeSteeringBehaviourWander',

	init: function(entity, targetKinematics, weight) {
		this._super(entity, targetKinematics, weight);
	},

	getSteering: function() {
		// Update entity kinematic data
		this._updateEntityKinematic();

		// Forward offset of wander target circle
		var wanderOffset = 40;
		// Radius of wander target circle
		var wanderRadius = 20;
		// Maximum rate at which the wander orientation can change (in radians)
		var wanderRate = Math.degrees(5);
		// Current orientation of the wander target
		var wanderOrientation = 0;

		// Update wander orientation
		wanderOrientation += this._randomBinomial() * wanderRate;

		// Calculate the combined target orientation
		var targetOrientation = wanderOrientation + this._entityKinematic.orientation;
		//var targetOrientation = Math.radians(270);

		// Find orientation vectors
		var entityOrientationAsVector = new IgeVector(Math.cos(this._entityKinematic.orientation + Math.radians(270)), Math.sin(this._entityKinematic.orientation + Math.radians(270)));
		var targetOrientationAsVector = new IgeVector(Math.cos(targetOrientation), Math.sin(targetOrientation));

		// Calculate the centre of the wander circle
		var faceTarget = new IgeSteeringKinematic();
		faceTarget.position = this._entityKinematic.position.add(entityOrientationAsVector.scale(wanderOffset));

		// Calculate the target location
		faceTarget.position.thisAdd(targetOrientationAsVector.scale(wanderRadius));

		var face = new IgeSteeringBehaviourFace(this._entity, [faceTarget], 1);
		var steering = face.getSteering();

		// Acceleration in direction of orientation
		steering.velocity = entityOrientationAsVector.scale(this._entityKinematic.maxAcceleration);

		return steering;
	},

	_randomBinomial: function() {
		return Math.random() - Math.random();
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeSteeringBehaviourWander; }