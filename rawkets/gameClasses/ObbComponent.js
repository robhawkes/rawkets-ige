// Observations
// - The bounding box isn't in the location that it has been set (it's slightly off)
// - The bounding box seems to be slightly larger than what has been set

// Potential causes
// - The angle is incorrect
// - The centre position is incorrect

var IgeObbComponent = IgeClass.extend({
	classId: 'IgeObbComponent',
	componentId: 'obb',

	init: function (entity, options) {
		this._entity = entity;

		//options.angle = Math.radians(Math.random()*360);
		this._poly = new Rectangle(options.width, options.height, options.x, options.y, options.angle);

		// Add the OOB behaviour to the entity
		entity.addBehaviour('oob', this._behaviour);
	},

	/**
	 * The behaviour method executed each tick.
	 * @param ctx
	 * @private
	 */
	_behaviour: function (ctx) {
		this.obb.tick(ctx);
	},

	tick: function (ctx) {
		//this._poly.transform(this._entity._worldMatrix.matrix[2], this._entity._worldMatrix.matrix[5], this._entity._rotate.z - Math.radians(270));
		//this._poly.transform(this._entity._worldMatrix.matrix[2], this._entity._worldMatrix.matrix[5], this._entity._rotate.z - Math.radians(-45));
		//this._poly.transform(this._entity._translate.x, this._entity._translate.y, this._entity._rotate.z);
		//console.log(this._entity._rotate.z);
		//this._poly.transform(this._entity._worldMatrix.matrix[2], this._entity._worldMatrix.matrix[5], this._poly.angle);
		//this._poly.transform(this._entity._worldMatrix.matrix[2], this._entity._worldMatrix.matrix[5], Math.radians(45));
		this._poly.transform(this._entity._worldMatrix.matrix[2], this._entity._worldMatrix.matrix[5], 0);

		ctx.save();
		ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
		ctx.translate(this._poly.center.x, this._poly.center.y);
		ctx.rotate(this._poly.angle);
		ctx.fillRect(-this._poly.halfWidth, -this._poly.halfHeight, this._poly.w, this._poly.h);
		ctx.restore();
	},

	checkCollision: function (r1, r2) {
		//var r1 = this._poly;
		// Get the offset
		var vOffset = {
			x: r1.center.x - r1.center.x,
			y: r1.center.y - r1.center.y
		};

		// Loop through each side of polygon
		for (var i = 0; i < r1.vertices.length; i++) {
			// Step 1 - Find axis
			var pt1 = r1.vertices[i];
			var pt2 = (i >= r1.vertices.length - 1) ? r1.vertices[0] : r1.vertices[i + 1];
			var axis = {
				x: -(pt2.y - pt1.y),
				y: pt2.x - pt1.x
			};
			var axisNormal = this.vectorNormalise(axis);

			// Step 2 - Project polygons

			// Project polygon A
			min0 = this.vectorDotProduct(axisNormal, r1.vertices[0]);
			max0 = min0;

			for (var j = 1; j < r1.vertices.length; j++) {
				var t = this.vectorDotProduct(axisNormal, r1.vertices[j]);
				if (t < min0) min0 = t;
				if (t > max0) max0 = t;
			}

			// Project polygon B
			var min1 = this.vectorDotProduct(axisNormal, r2.vertices[0]);
			var max1 = min1;

			for (var j = 1; j < r2.vertices.length; j++) {
				var t = this.vectorDotProduct(axisNormal, r2.vertices[j]);
				if (t < min1) min1 = t;
				if (t > max1) max1 = t;
			}

			// Shift polygon A's projected points
			var sOffset = this.vectorDotProduct(axisNormal, vOffset);
			min0 += sOffset;
			max0 += sOffset;

			// Step 3 - Check for intersections
			var d0 = min0 - max1;
			var d1 = min1 - max0;

			if (d0 > 0 || d1 > 0) {
				// Gap found
				return false;
			}
		}

		// No gap found
		return true;
	},

	checkCollisionBoolean: function (r1, r2) {
		//var r1 = this._poly;
		//var r2 = obb._poly;

		if (this.checkCollision(r1, r2) === false) {
			return false;
		}

		if (this.checkCollision(r2, r1) === false) {
			return false;
		}

		// Collision detected
		return true;
	},

	vectorNormalise: function (vector) {
		var x = vector.x;
		var y = vector.y;

		var dist = Math.sqrt(x * x + y * y);

		x = x * (1.0 / dist);
		y = y * (1.0 / dist);

		return {
			x: x,
			y: y
		};
	},

	vectorDotProduct: function (pt1, pt2) {
		return (pt1.x * pt2.x + pt1.y * pt2.y);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeObbComponent; }

var Rectangle = function(w, h, centerX, centerY, angle) {
	this.w = w;
	this.h = h;

	this.angle = angle;

	this.halfWidth = this.w / 2;
	this.halfHeight = this.h / 2;

	this.center = {
		x: centerX,
		y: centerY
	};

	this.vertices = [
		{
			x: this.center.x - this.halfWidth,
			y: this.center.y - this.halfHeight},
		{
			x: this.center.x + this.halfWidth,
			y: this.center.y - this.halfHeight},
		{
			x: this.center.x + this.halfWidth,
			y: this.center.y + this.halfHeight},
		{
			x: this.center.x - this.halfWidth,
			y: this.center.y + this.halfHeight
		}
	];

	this.transform = function(x, y, angle) {
		var offset = {
			x: x - this.center.x,
			y: y - this.center.y
		};

		this.center = {
			x: x,
			y: y
		};

		this.vertices = [
			{
				x: this.center.x - this.halfWidth,
				y: this.center.y - this.halfHeight},
			{
				x: this.center.x + this.halfWidth,
				y: this.center.y - this.halfHeight},
			{
				x: this.center.x + this.halfWidth,
				y: this.center.y + this.halfHeight},
			{
				x: this.center.x - this.halfWidth,
				y: this.center.y + this.halfHeight
			}
		];

		this.angle = angle;

		var vertexCount = this.vertices.length;
		for (var i = 0; i < vertexCount; i++) {
			var vertex = this.vertices[i];

			var newX = this.center.x + ((vertex.x - this.center.x) * Math.cos(this.angle)) - ((vertex.y - this.center.y) * Math.sin(this.angle));
			var newY = this.center.y + ((vertex.x - this.center.x) * Math.sin(this.angle)) + ((vertex.y - this.center.y) * Math.cos(this.angle));

			vertex.x = newX;
			vertex.y = newY;
		}
	};
};