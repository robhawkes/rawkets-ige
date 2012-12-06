var config = {
	include: [
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
		{name: 'Player', path: './gameClasses/Player'},
		{name: 'PlayerTurret', path: './gameClasses/PlayerTurret'},
		{name: 'PlayerBullet', path: './gameClasses/PlayerBullet'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }