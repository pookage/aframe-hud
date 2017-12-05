AFRAME.registerComponent("tracker", {
	schema: {
		track: {
			type: "selector"
		},
		marker_image: {
			default: "./assets/marker.png"
		}
	},

	//LIFECYCLE
	//----------------------------------
	play: function(){

		//scope binding
		this.createMarkers       = this.createMarkers.bind(this);
		this.updateMarkers       = this.updateMarkers.bind(this);
		this.checkInsideViewport = this.checkInsideViewport.bind(this);
		this.debugTick           = AFRAME.utils.throttle(this.updateMarkers, 1000, this);

		//setup
		const { track, marker_image } = this.data;	
		const trackedEntities = track.length ? track : [track];

		this.markers    = this.createMarkers(trackedEntities, marker_image);
	
	},//init
	tick: function(){
		//this.debugTick();
		this.updateMarkers();
	},

	//UTILS
	//--------------------------------------
	createMarkers: function(trackedEntities, image){

		//create array to store markers, and canvas to draw makers on
		const markers = new Array(trackedEntities.length);
		const canvas  = this.el.HUDCanvas;

		console.log(canvas)

		//create a tracking marker for every entity to track
		let entity, marker;
		for(entity in trackedEntities){
			marker = new Marker({
				entity: trackedEntities[entity],
				camera: this.el.camera,
				viewport: canvas,
				img: image
			});
			markers[entity] = marker;
		}

		return markers;
	},//createMarkers
	updateMarkers: function(){
		let trackedPosition, insideViewport;
		for(let marker of this.markers){
			trackedPosition = marker.getEntityPosition2D();
			insideViewport  = this.checkInsideViewport(trackedPosition);
			if(insideViewport) marker.hide();
			else marker.updatePosition(trackedPosition);
			marker.draw();
		}
	},//updateMarkers
	checkInsideViewport: function({ x, y }){

		//returns true if the entity is within all bounds
		const boundsLeft   = x > 0;
		const boundsBottom = y > 0;
		const boundsRight  = x < window.innerWidth;
		const boundsTop    = y < window.innerHeight;
	
		
		return boundsLeft && boundsRight && boundsBottom && boundsTop;
	}//checkInsideViewport
});//tracker