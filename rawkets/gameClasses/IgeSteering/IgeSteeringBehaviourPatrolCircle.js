var IgeSteeringBehaviourPatrolCircle = IgeSteeringBehaviour.extend({
	classId: 'IgeSteeringBehaviourPatrolCircle',

	init: function(entity, targetKinematics, weight) {
		this._super(entity, targetKinematics, weight);

		// Radius of patrol target circle
		this._patrolRadius = 200 - (40 - Math.random() * 80);

		// Maximum rate at which the patrol orientation can change (in radians)
		this._patrolRate = Math.degrees(0.0001) - Math.degrees(0.00001 - Math.random() * 0.00002);
		//this._patrolRate = Math.degrees(0.00008);

		// Current orientation of the patrol target
		this._patrolOrientation = Math.random()*(Math.PI*2);
	},

	getSteering: function() {
		// Update entity kinematic data
		this._updateEntityKinematic();

		// Grab first target, until this is updated to support multiple targets
		var targetKinematic = this._targetKinematics[0];

		// Update patrol orientation
		this._patrolOrientation -= this._patrolRate;

		// Keep orientation within 0 to 360 degree range
		// if (this._patrolOrientation > Math.PI * 2) {
		// 	var diff = this._patrolOrientation - Math.PI * 2;
		// 	this._patrolOrientation = diff;
		// }

		// Find orientation vectors
		var entityOrientationAsVector = new IgeVector(Math.cos(this._entityKinematic.orientation + Math.radians(270)), Math.sin(this._entityKinematic.orientation + Math.radians(270)));
		var patrolOrientationAsVector = new IgeVector(Math.cos(this._patrolOrientation), Math.sin(this._patrolOrientation));

		// Calculate the centre of the patrol circle
		var patrolTarget = new IgeSteeringKinematic();
		patrolTarget.position = targetKinematic.position.add(patrolOrientationAsVector.scale(this._patrolRadius));

		var arrive = new IgeSteeringBehaviourArrive(this._entity, [patrolTarget], 1);
		var steering = arrive.getSteering();

		// var face = new IgeSteeringBehaviourFace(this._entity, [patrolTarget], 1);
		// var steering = face.getSteering();

		// // Acceleration in direction of orientation
		// steering.velocity = entityOrientationAsVector.scale(this._entityKinematic.maxAcceleration);

		return steering;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeSteeringBehaviourPatrolCircle; }