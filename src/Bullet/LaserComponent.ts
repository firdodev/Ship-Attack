import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"

export class LaserComponent{


    private shipPosition:BABYLON.Vector3 = new BABYLON.Vector3(0,0,-150);
    private meshComponent: BRIX.MeshComponent;
    private isCreated: Boolean = false;

    

    constructor() {
        // super(gameObject, name);
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

    async createLaser(world){
        const bullet: BRIX.GameObject = new BRIX.GameObject("bullet", world);
        this.meshComponent = await bullet.registerComponent(BRIX.MeshComponent);
        await this.meshComponent.loadAsync("assets/Ship/","missle.glb");
        this.meshComponent.get().scaling = new BABYLON.Vector3(10,10,10);
        // this.meshComponent.get().position = new BABYLON.Vector3(50,50,50);
        console.log(this.meshComponent.get().position);
        this.isCreated = true;
    }


    private test;
    
    updateBeforeRender = () => {
        if(this.isCreated)
            this.meshComponent.get().position = new BABYLON.Vector3(0,0,this.test);   
        
        this.test+=1;
        // this.meshComponent.move(new BABYLON.Vector3(0,0,2));
    
        
    }

    updateAfterRender = () => {
    }
}