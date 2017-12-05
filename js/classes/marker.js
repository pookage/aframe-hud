class Marker {

	constructor({ entity, viewport, camera, img }){

		this.entity    = entity;
		this.viewport  = viewport;
		this.context   = viewport.getContext("2d");
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
		for(let child of cameraEntity.object3D.children){
			if(child.type.indexOf("Camera") > -1){
				 return child;
			}
		}
	}//getTHREECamera
	getEntityPosition2D(){
		const vector    = new THREE.Vector3();
		const xCenter   = this.viewport.width / 2;
		const yCenter   = this.viewport.height / 2;
		const entityObj = this.entity.object3D;
		const camera    = this.getTHREECamera(this.camera);

		//PROBLEM - THIS LOOKS FOR THE ENTITIE'S CENTER, NOT FOR IT'S EDGES

		if(camera){
			entityObj.updateMatrixWorld();
			vector.setFromMatrixPosition(entityObj.matrixWorld);
			vector.project(camera);

			vector.x = (vector.x * xCenter) + xCenter;
			vector.y = (vector.y * yCenter) + yCenter;

			return {
				x: vector.x,
				y: vector.y
			};
		} else throw "Cannot get projection without camera";
	}//getEntityPosition
	updatePosition({ x, y}){

		this.hidden = false;

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


	//VISUAL UPDATING
	//-------------------------------------------
	draw(){
		if(this.marker.image && !this.hidden){
			const startX = this.position.x - (this.marker.width/2);
			const startY = this.position.y - (this.marker.height/2);
			this.context.clearRect(0, 0, this.viewport.width, this.viewport.height);
			this.context.drawImage(this.marker.image, startX, startY, this.marker.height, this.marker.width);
		} else {
			this.context.clearRect(0, 0, this.viewport.width, this.viewport.height);
		}
	}//draw
	hide(){
		this.hidden = true;
	}//hide
}//Marker