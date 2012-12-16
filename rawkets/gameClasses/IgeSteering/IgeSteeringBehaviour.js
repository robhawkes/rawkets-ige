var IgeSteeringBehaviour = IgeClass.extend({
	classId: 'IgeSteeringBehaviour',

	init: function(entity, targetKinematics, weight) {
		// Entities
		this._entity = entity; // IgeEntity with prerequisite variables (velocity, etc)
		//this._target = target; // IgeEntity with prerequisite variables (velocity, etc)

		// Kinematic data
		this._entityKinematic = new IgeSteeringKinematic(this._entity.maxAcceleration, this._entity.maxVelocity, this._entity.maxAngularAcceleration, this._entity.maxRotation);
		this._updateEntityKinematic();

		//this._targetKinematic = this._updateKinematic(this._entity);
		this._targetKinematics = targetKinematics;

		// Weighting
		this.weight = weight;
	},

	// Update kinematic data for the IgeEntity
	_updateEntityKinematic: function(updateMaximums) {
		this._entityKinematic.position.x = this._entity._worldMatrix.matrix[2];
		this._entityKinematic.position.y = this._entity._worldMatrix.matrix[5];
		//this._entityKinematic.orientation = this._entity.worldRotationZ();
		this._entityKinematic.orientation = this._entity._rotate.z;

		// Velocities
		this._entityKinematic.velocity.x = this._entity.velocity._velocity.x;
		this._entityKinematic.velocity.y = this._entity.velocity._velocity.y;
		this._entityKinematic.rotation = this._entity.rotation;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = IgeSteeringBehaviour; }