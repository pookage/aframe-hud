class Marker {

	/*
		TODO :

			1. 	Use getWorldPosition() to get relative camera position to tracked entities
				and lock markers to bottom if enties are behind the camera
			2. 	Give each marker its own canvas to prevent clearing bugs + measure perf hit.
			3. 	Lose the anon. functions in the setupMarkerImage ( + better fail handling)
	*/


	//SETUP
	//-----------------------------------------
	constructor({ entity, HUDCanvas, camera, img }){

		this.entity    = entity;
		this.HUDCanvas = HUDCanvas;
		this.context   = HUDCanvas.getContext("2d");
		this.camera    = camera;
		this.position  = { x: 0, y: 0 };
		this.marker    = this.setupMarkerImage(img).then((result) => this.marker = result);
	}//constructor
	setupMarkerImage(src){
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = () => {
				resolve({
					image,
					height: image.naturalHeight,
					width: image.naturalWidth
				});
			}//image load
			image.onfail = () => reject("could not load image");
			image.src = src;
		})
	}//setupMarkerImage


	//UTILS
	//-------------------------------------------
	getTHREECamera(cameraEntity){
		//grab the first camera in the object (filters out groups)
		for(let child of cameraEntity.object3D.children){
			if(child.type.indexOf("Camera") > -1){
				 return child;
			}
		}
	}//getTHREECamera
	getEntityPosition2D(){

		const vector    = new THREE.Vector3();
		const xCenter   = this.HUDCanvas.width / 2;
		const yCenter   = this.HUDCanvas.height / 2;
		const entityObj = this.entity.object3D;
		const camera    = this.getTHREECamera(this.camera);

		//if the scene's camera has loaded yet...
		if(camera){

			//get entity position from camera projection...
			entityObj.updateMatrixWorld();
			vector.setFromMatrixPosition(entityObj.matrixWorld);
			vector.project(camera);

			//transform vector to be relative to screen dimensions
			const x = (vector.x * xCenter) + xCenter;
			const y = (vector.y * yCenter) + yCenter;

			return {
				x, y
			};
		} else throw "Cannot get projection without camera";
	}//getEntityPosition
	updatePosition({ x, y}){

		//make sure the position can't extend beyond the bounds of the screen
		const leftClamp   = x < 0 ? 0 : x;
		const bottomClamp = y < 0 ? 0 : y;
		const rightClamp  = x > window.innerWidth ? window.innerWidth : x;
		const topClamp    = y > window.innerHeight ? window.innerHeight : window.innerHeight - y; //invert y

		//apply position clamps if needed
		this.position = {
			x: x < 0 ? leftClamp : rightClamp,
			y: y < 0 ? bottomClamp : topClamp
		};
	}//updatePosition


	//DRAWING
	//-------------------------------------------
	draw(){
		if(this.marker.image){ //will be a pending or failed promise if not successful

			//canvas pen-down position
			const startX      = this.position.x - (this.marker.width/2);
			const startY      = this.position.y - (this.marker.height/2);
			//canvas draw distance
			const endX        = this.marker.width;
			const endY        = this.marker.height;
			// pixel space around previous position to clear
			const clearBuffer = 20;
			
			//clear the area around the previous position
			this.context.clearRect(
				startX-clearBuffer, 
				startY-clearBuffer, 
				endX + (2*clearBuffer), 
				endY + (2*clearBuffer)
			);

			//draw the new position of the marker if it's not been hidden
			if(!this.hidden){
				this.context.drawImage(
					this.marker.image, 
					startX, startY, 
					endX, endY
				);
			}
		}
	}//draw
	show(){

		this.hidden = false;
	}//show
	hide(){

		this.hidden = true;
	}//hide
}//Marker