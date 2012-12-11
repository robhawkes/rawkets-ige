var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */
		'./gameClasses/ClientNetworkEvents.js',
		'./gameClasses/Player.js',
		'./gameClasses/PlayerTurret.js',
		'./gameClasses/PlayerBullet.js',
		'./gameClasses/ExplosionParticle.js',
		//'./gameClasses/ObbComponent.js',
		'./gameClasses/SatComponent.js',
		/* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }