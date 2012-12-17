// TODO
// - Add ability to store and retrieve behaviours by a unique name/id (id returned when behaviour is added)
// - Add ability to change and update behaviour targets
var IgeSteeringComponent = IgeClass.extend({
	classId: 'IgeSteeringComponent',
	componentId: 'steering',

	init: function (entity, options) {
		this._entity = entity;
		this._behaviours = [];
	},

	// Add steering behaviour
	add: function(behaviour) {
		this._behaviours.push(behaviour);
		return behaviour;

		// Return unique behaviour id
	},

	// Get steering output
	getSteering: function() {
		// Steering output
		var steering = new IgeSteeringOutput();

		// Add together steering output dependant on weight
		for (var i = 0; i < this._behaviours.length; i++) {
			var behaviour = this._behaviours[i];
			var behaviourSteering = behaviour.getSteering();

			steering.velocity.thisAdd(behaviourSteering.velocity.scale(behaviour.weight));
			steering.rotation += behaviourSteering.rotation * behaviour.weight;
		}

		// Check if linear acceleration is too fast
		if (steering.velocity.magnitude() > this._entity.maxAcceleration) {
			steering.velocity.thisNormalize();
			steering.velocity.thisScale(this._entity.maxAcceleration);
		}

		// Check if angular acceleration is too fast
		var angularAcceleration = Math.abs(steering.rotation);
		if (angularAcceleration > this._entity.maxAngularAcceleration) {
			steering.rotation /= angularAcceleration;
			steering.rotation *= this._entity.maxAngularAcceleration;
		}

		return steering;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeSteeringComponent; }