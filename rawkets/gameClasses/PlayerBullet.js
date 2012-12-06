var PlayerBullet = IgeEntity.extend({
	classId: 'PlayerBullet',

	init: function (id) {
		this._super();

		this.id(id);

		var self = this;

		this.addComponent(IgeVelocityComponent);

		if (ige.isServer) {
			
		}

		if (!ige.isServer) {
			self.layer(ige.client.entityLayers.bullet)

			self.texture(ige.client.gameTextures.bullet)
			.anchor(0, 0)
			.width(48)
			.height(48);
		}

		// Define the data sections that will be included in the stream
		//this.streamSections(['transform']);
	},

	/**
	 * Override the default IgeEntity class streamSectionData() method
	 * so that we can check for the custom1 section and handle how we deal
	 * with it.
	 * @param {String} sectionId A string identifying the section to
	 * handle data get / set for.
	 * @param {*=} data If present, this is the data that has been sent
	 * from the server to the client for this entity.
	 * @return {*}
	 */
	// streamSectionData: function (sectionId, data) {
	// 	if (sectionId === 'fireState') {
	// 		// Check if the server sent us data, if not we are supposed
	// 		// to return the data instead of set it
	// 		if (data) {
	// 			// We have been given new data!
	// 			this.fireState = data;
	// 		} else {
	// 			// Return current data
	// 			return this.fireState;
	// 		}
	// 	} else {
	// 		// The section was not one that we handle here, so pass this
	// 		// to the super-class streamSectionData() method - it handles
	// 		// the "transform" section by itself
	// 		return this._super(sectionId, data);
	// 	}
	// },

	/**
	 * Called every frame by the engine when this entity is mounted to the
	 * scenegraph.
	 * @param ctx The canvas context to render to.
	 */
	tick: function (ctx) {
		/* CEXCLUDE */
		if (ige.isServer) {

		}
		/* CEXCLUDE */

		if (!ige.isServer) {
			//this.rotateToPoint(ige._currentViewport.mousePos());
			//this.rotateBy(0, 0, 0.0005 * ige._tickDelta);
			this.velocity.byAngleAndPower(this._rotate.z + Math.radians(-90), 1);
		}

		// Call the IgeEntity (super-class) tick() method
		this._super(ctx);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerBullet; }