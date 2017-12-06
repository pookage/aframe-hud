AFRAME.registerComponent("tracker", {
	schema: {
		track: {
			parse: function(value){
				return document.querySelectorAll(value)
			}
		},
		marker_image: {
			default: "./assets/marker.png"
		}
	},

	//LIFECYCLE
	//----------------------------------
	init: function(){

		//scope binding
		this.createMarkers       = this.createMarkers.bind(this);
		this.updateMarkers       = this.updateMarkers.bind(this);
		this.checkInsideViewport = this.checkInsideViewport.bind(this);

		//used to slow down tick to make it easier to debug
		this.debugTick           = AFRAME.utils.throttle(this.updateMarkers, 1000, this);

		//setup
		const { track, marker_image } = this.data;	
		this.markers = this.createMarkers(track, marker_image);
	},//init
	tick: function(){
		//this.debugTick();
		this.updateMarkers();
	},//tick

	//UTILS
	//--------------------------------------
	createMarkers: function(trackedEntities, image){

		//create array to store markers, and canvas to draw makers on
		const markers = new Array(trackedEntities.length);
		const canvas  = this.el.HUDCanvas;

		//create a tracking marker for every entity to track
		let entity, marker;
		for(entity = 0; entity < trackedEntities.length; entity++){
			marker = new Marker({
				entity: trackedEntities[entity], //entity to track
				camera: this.el.camera,          //camera to check visibility within
				HUDCanvas: canvas,               //canvas to draw HUD elemnts on
				img: image                       //path to image to use as marker
			});
			markers[entity] = marker;
		}

		return markers;
	},//createMarkers
	updateMarkers: function(){
		let marker, trackedPosition, insideViewport;
		for(marker of this.markers){

			//gets x,y of tracked object on screen...
			trackedPosition = marker.getEntityPosition2D();
			//...and checks to see if it's visible
			insideViewport  = this.checkInsideViewport(trackedPosition);
			
			//hide marker if tracked object is visible...
			if(insideViewport) marker.hide();
			//...otherwise figure out where marker goes...
			else {
				marker.updatePosition(trackedPosition);
				marker.show();
			}
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