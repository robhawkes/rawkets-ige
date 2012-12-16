// Steering kinematic definition
var IgeSteeringKinematic = function(maxAcceleration, maxVelocity, maxAngularAcceleration, maxRotation) {
	this.position = new IgeVector();
	this.orientation = 0;

	// Velocities
	this.velocity = new IgeVector();
	this.rotation = 0;

	// Maximums
	this.maxAcceleration = maxAcceleration = maxAcceleration !== undefined ? maxAcceleration : 0;
	this.maxVelocity = maxVelocity = maxVelocity !== undefined ? maxVelocity : 0;
	this.maxAngularAcceleration = maxAngularAcceleration = maxAngularAcceleration !== undefined ? maxAngularAcceleration : 0;
	this.maxRotation = maxRotation = maxRotation !== undefined ? maxRotation : 0;
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeSteeringKinematic; }