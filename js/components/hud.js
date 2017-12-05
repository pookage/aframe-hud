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
		this.updateCanvasDimensions();
	},//tick

	setupCanvas: function(){
		const canvas      = document.createElement("canvas");
		canvas.style.position = "absolute";
		canvas.style.top      = "0px";
		canvas.style.left     = "0px";
		AFRAME.scenes[0].parentEl.appendChild(canvas);
		return canvas;
	},//setupCanvas
	updateCanvasDimensions: function(){
		
		if(this.el.HUDCanvas.width != this.sceneCanvas.width) {
			this.el.HUDCanvas.setAttribute("width", this.sceneCanvas.width)
		}

		if(this.el.HUDCanvas.height != this.sceneCanvas.height){
			this.el.HUDCanvas.setAttribute("height", this.sceneCanvas.height)
		}
	}//updateCanvasDimensions

});