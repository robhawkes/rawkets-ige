var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */
		'./gameClasses/ClientNetworkEvents.js',
		'./gameClasses/Player.js',
		'./gameClasses/PlayerTurret.js',
		'./gameClasses/PlayerBullet.js',
		'./gameClasses/Fighter.js',
		'./gameClasses/ExplosionParticle.js',
		/* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }