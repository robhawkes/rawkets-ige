var IgeVector = IgeClass.extend({
	classId: 'IgeVector',

	init: function (x, y) {
		// Set values to the passed parameters or
		// zero if they are undefined
		this.x = x = x !== undefined ? x : 0;
		this.y = y = y !== undefined ? y : 0;

		return this;
	},

	normalize: function() {
		this.scale(1 / this.magnitude());
	},

	scale: function(val) {
		this.x *= val;
		this.y *= val;
	},

	thisScale: function(val) {
		this.x *= val;
		this.y *= val;

		return this;
	},

	magnitude: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},

	add: function(vec) {
		this.x += vec.x;
		this.y += vec.y;
	},

	subtract: function(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
	},

	thisSubtract: function(vec) {
		this.x -= vec.x;
		this.y -= vec.y;

		return this;
	},

	divide: function(val) {
		this.x /= val;
		this.y /= val;
	},

	clone: function () {
		return new IgeVector(this.x, this.y);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeVector; }