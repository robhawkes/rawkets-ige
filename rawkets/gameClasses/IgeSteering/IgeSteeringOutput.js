// Steering output definition
var IgeSteeringOutput = function() {
	this.velocity = new IgeVector(0, 0);
	this.rotation = 0;
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeSteeringOutput; }