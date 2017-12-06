/* 
	TODO :
		1. 	create + expose functionality to toggle HUD components via keyboard shortcuts
		2. 	zoom hud components
		3. 	move canvas dims sync out of tick and into some event handlers; maybe do a throttled
			tick every second or so for backup only.
*/

AFRAME.registerPrimitive("a-hud", {
	defaultComponents: {
		hud: {},
		tracker: {
			track: ".tracked"
		}
	}
})
AFRAME.registerComponent("hud", {
	schema: {},

	//LIFECYCLE
	//---------------------------------------------
	init: function(){

		//scope binding
		this.setupCanvas            = this.setupCanvas.bind(this);
		this.updateCanvasDimensions = this.updateCanvasDimensions.bind(this);

		//make important elements accessible via entity
		this.el.camera    = this.el.parentEl;
		this.el.HUDCanvas = this.setupCanvas();
		this.sceneCanvas  = AFRAME.scenes[0].canvas;
	},//init
	tick: function(){
		//update the hud canvas if the aframe canvas has changed size
		this.updateCanvasDimensions();
	},//tick

	//UTILS
	//----------------------------------------------
	setupCanvas: function(){
		//overlay a canvas for hud elements over a-frame scene
		const canvas          = document.createElement("canvas");
		canvas.style.position = "absolute";
		canvas.style.top      = "0px";
		canvas.style.left     = "0px";
		AFRAME.scenes[0].parentEl.appendChild(canvas);
		return canvas;
	},//setupCanvas
	updateCanvasDimensions: function(){
		//update height / width to match a-frame canvas
		if(this.el.HUDCanvas.width != this.sceneCanvas.width) {
			this.el.HUDCanvas.setAttribute("width", this.sceneCanvas.width)
		}
		if(this.el.HUDCanvas.height != this.sceneCanvas.height){
			this.el.HUDCanvas.setAttribute("height", this.sceneCanvas.height)
		}
	}//updateCanvasDimensions

});