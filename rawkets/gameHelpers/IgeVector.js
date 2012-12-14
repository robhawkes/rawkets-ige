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
		var vector = this.clone();
		return vector.scale(1 / vector.magnitude());
	},

	thisNormalize: function() {
		this.thisScale(1 / this.magnitude());
		return this;
	},

	scale: function(val) {
		var vector = this.clone();
		vector.x *= val;
		vector.y *= val;
		return vector;
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
		var vector = this.clone();
		vector.x += vec.x;
		vector.y += vec.y;
		return vector;
	},

	thisAdd: function(vec) {
		this.x += vec.x;
		this.y += vec.y;
		return this;
	},

	subtract: function(vec) {
		var vector = this.clone();
		vector.x -= vec.x;
		vector.y -= vec.y;
		return vector;
	},

	thisSubtract: function(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		return this;
	},

	divide: function(val) {
		var vector = this.clone();
		vector.x /= val;
		vector.y /= val;
		return vector;
	},

	thisDivide: function(val) {
		this.x /= val;
		this.y /= val;
		return this;
	},

	dot: function(vec) {
		return this.x * vec.x + this.y * vec.y;
	},

	angleTo: function(vec) {
		var dot = this.dot(vec);
		var cos = dot / (this.magnitude() * vec.magnitude());
		
		if (cos <= -1) {
			return Math.PI;
		} else if (cos >= 1) {
			return 0;
		}
		
		return Math.acos(cos);
	},

	clone: function () {
		return new IgeVector(this.x, this.y);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeVector; }