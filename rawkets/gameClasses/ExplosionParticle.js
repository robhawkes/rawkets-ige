var ExplosionParticle = IgeEntity.extend({
	classId: 'ExplosionParticle',

	init: function (emitter) {
		this._emitter = emitter;
		this._super();

		var self = this;

		this.addComponent(IgeVelocityComponent);

		var cellNum = Math.ceil(Math.random()*3);

		// Setup the particle default values
		this.addComponent(IgeVelocityComponent)
			.addComponent(IgeAnimationComponent)
			.texture(ige.client.gameTextures.explosionParticle)
			.cell(cellNum)
			.width(32)
			.height(32)
			.drawBounds(false)
			.drawBoundsData(false);

		//this.animation.define('idle', [1, 2, 3], 10, 0);
		//this.animation.select('idle');
	},

	/**
	 * Called every frame by the engine when this entity is mounted to the
	 * scenegraph.
	 * @param ctx The canvas context to render to.
	 */
	tick: function (ctx) {
		//ctx.globalCompositeOperation = 'lighter';
		// Call the IgeEntity (super-class) tick() method
		this._super(ctx);
		//ctx.globalCompositeOperation = 'source-over';
	},

	destroy: function () {
		// Remove ourselves from the emitter
		if (this._emitter !== undefined) {
			this._emitter._particles.pull(this);
		}
		this._super();
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ExplosionParticle; }