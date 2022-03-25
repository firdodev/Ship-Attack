import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"

export class LaserComponent extends BRIX.Component {

    constructor(gameObject: BRIX.GameObject, name: String) {
        super(gameObject, name);
    }

    
    fire(){
        // const origin = (this.obj)
        // console.log((this.object as BRIX.GameObject).getWorld().getScene().cameras[0]);
        const origin = BABYLON.Vector3.Zero();
        const forward = BABYLON.Vector3.Forward();
        const ray = new BABYLON.Ray(origin,forward,200);
        let rayHelper = new BABYLON.RayHelper(ray);		
		rayHelper.show((this.object as BRIX.GameObject).getWorld().getScene() as unknown as BABYLON.Scene, new BABYLON.Color3(1,0,0));
        // console.log((this.object as BRIX.GameObject).getWorld().getScene());
        const hit = ((this.object as BRIX.GameObject).getWorld().getScene() as unknown as BABYLON.Scene).pickWithRay(ray);
        if(hit.pickedMesh){
            console.log(hit.pickedMesh.name);
            hit.pickedMesh.dispose();
        }
        console.log(ray);
        
    }


    
    updateBeforeRender = () => {
    }

    updateAfterRender = () => {
    }
}