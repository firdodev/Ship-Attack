import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"

export class LaserComponent extends BRIX.Component {


    private shipPosition:BABYLON.Vector3 = new BABYLON.Vector3(0,0,-150);

    private bullet: BRIX.GameObject;
    private meshComponent: BRIX.MeshComponent;
    private currentMeshComponent: BRIX.MeshComponent;

    private isCreated: Boolean = false;

    

    constructor(gameObject: BRIX.GameObject, name: String) {
        super(gameObject, name);
        window.addEventListener("keydown", (ev) => {
            if(ev.keyCode == 65){
                this.shipPosition.x -= 10;
            }

            if(ev.keyCode == 68){
                this.shipPosition.x += 10;
            }
        }); 
    }

    fire(){
        // this.shipPosition = new BABYLON.Vector3(this.shipPosition.x,this.shipPosition.y,-150);
        // const forward = BABYLON.Vector3.Forward();
        // const ray = new BABYLON.Ray(this.shipPosition,forward,500);
        // let rayHelper = new BABYLON.RayHelper(ray);		
		// rayHelper.show((this.object as BRIX.GameObject).getWorld().getScene() as unknown as BABYLON.Scene, new BABYLON.Color3(1,0,0));
        // const hit = ((this.object as BRIX.GameObject).getWorld().getScene() as unknown as BABYLON.Scene).pickWithRay(ray);
        // if(hit.pickedMesh){
        //     console.log(hit.pickedMesh.name);
        //     hit.pickedMesh.dispose();
        // }
        // console.log(ray);
    }

    async createLaser(){
        if(!this.isCreated){
            this.bullet = new BRIX.GameObject("bullet", (this.object as BRIX.GameObject).getWorld());
            this.meshComponent = await this.bullet.registerComponent(BRIX.MeshComponent);
            await this.meshComponent.loadAsync("assets/Ship/","missle.glb");
            this.currentMeshComponent = this.meshComponent;
            this.meshComponent.get().scaling = new BABYLON.Vector3(10,10,10);
            console.log(this.meshComponent.get().position);
            this.isCreated = true;
        }
    }

    private test;
    
    updateBeforeRender = () => {
        if(this.isCreated){
            this.meshComponent.move(new BABYLON.Vector3(0,0,1));
            setTimeout(() => {
                this.bullet.dispose();
                // this.meshComponent.get().dispose();
                this.isCreated = false;
            }, 3000);
        }
    }
    
    updateAfterRender = () => {
    }
}