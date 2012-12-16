var config = {
	include: [
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
		{name: 'Player', path: './gameClasses/Player'},
		{name: 'PlayerTurret', path: './gameClasses/PlayerTurret'},
		{name: 'PlayerBullet', path: './gameClasses/PlayerBullet'},
		{name: 'Fighter', path: './gameClasses/Fighter'},
		// Steering
		{name: 'IgeVector', path: './gameHelpers/IgeVector'},
		{name: 'IgeSteeringComponent', path: './gameClasses/IgeSteering/IgeSteeringComponent'},
		{name: 'IgeSteeringKinematic', path: './gameClasses/IgeSteering/IgeSteeringKinematic'},
		{name: 'IgeSteeringOutput', path: './gameClasses/IgeSteering/IgeSteeringOutput'},
		{name: 'IgeSteeringBehaviour', path: './gameClasses/IgeSteering/IgeSteeringBehaviour'},
		{name: 'IgeSteeringBehaviourSeek', path: './gameClasses/IgeSteering/IgeSteeringBehaviourSeek'},
		{name: 'IgeSteeringBehaviourFlee', path: './gameClasses/IgeSteering/IgeSteeringBehaviourFlee'},
		{name: 'IgeSteeringBehaviourArrive', path: './gameClasses/IgeSteering/IgeSteeringBehaviourArrive'},
		{name: 'IgeSteeringBehaviourAlign', path: './gameClasses/IgeSteering/IgeSteeringBehaviourAlign'},
		{name: 'IgeSteeringBehaviourVelocityMatch', path: './gameClasses/IgeSteering/IgeSteeringBehaviourVelocityMatch'},
		{name: 'IgeSteeringBehaviourPursue', path: './gameClasses/IgeSteering/IgeSteeringBehaviourPursue'},
		{name: 'IgeSteeringBehaviourEvade', path: './gameClasses/IgeSteering/IgeSteeringBehaviourEvade'},
		{name: 'IgeSteeringBehaviourFace', path: './gameClasses/IgeSteering/IgeSteeringBehaviourFace'},
		{name: 'IgeSteeringBehaviourLookAhead', path: './gameClasses/IgeSteering/IgeSteeringBehaviourLookAhead'},
		{name: 'IgeSteeringBehaviourWander', path: './gameClasses/IgeSteering/IgeSteeringBehaviourWander'},
		{name: 'IgeSteeringBehaviourSeparation', path: './gameClasses/IgeSteering/IgeSteeringBehaviourSeparation'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }