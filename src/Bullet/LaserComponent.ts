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

    private time = 0;
    private timeCheck = 120;
    

    constructor(gameObject: BRIX.GameObject, name: String) {
        super(gameObject, name);
        this.addRay();
        window.addEventListener("keydown", (ev) => {
            if(ev.keyCode == 65){
                this.shipPosition.x -= 10;
            }

            if(ev.keyCode == 68){
                this.shipPosition.x += 10;
            }
        }); 
    }

    addRay(){
        this.shipPosition = new BABYLON.Vector3(this.shipPosition.x,this.shipPosition.y,this.shipPosition.z + 10);
        const forward = BABYLON.Vector3.Forward();
        const ray = new BABYLON.Ray(this.shipPosition,forward,1);
        let rayHelper = new BABYLON.RayHelper(ray);		
		rayHelper.show((this.object as BRIX.GameObject).getWorld().getScene() as unknown as BABYLON.Scene, new BABYLON.Color3(1,0,0));
        const hit = ((this.object as BRIX.GameObject).getWorld().getScene() as unknown as BABYLON.Scene).pickWithRay(ray);
        if(hit.pickedMesh){
            console.log(hit.pickedMesh.name);
            hit.pickedMesh.dispose();
        }
    }

    async createLaser(){
        if(!this.isCreated){
            this.bullet = new BRIX.GameObject("bullet", (this.object as BRIX.GameObject).getWorld());
            this.meshComponent = await this.bullet.registerComponent(BRIX.MeshComponent);
            await this.meshComponent.loadAsync("assets/Ship/","missle.glb");
            this.currentMeshComponent = this.meshComponent;
            this.meshComponent.get().scaling = new BABYLON.Vector3(10,10,10);
            this.meshComponent.get().position = new BABYLON.Vector3(this.shipPosition.x,0,this.shipPosition.z);
            

            this.isCreated = true;
        }
    }
    
    updateBeforeRender = () => {
        if(this.isCreated){
            this.meshComponent.move(new BABYLON.Vector3(0,0,2));
            this.shipPosition.z = this.meshComponent.get().position.z;
            if(this.time >= this.timeCheck){                
                this.bullet.dispose();
                this.isCreated = false;
                this.shipPosition.z = -150;
                this.time = 0;
            }
            this.time += 1;
            console.log(this.shipPosition);          
        }
    }

    updateAfterRender = () => {
    }
}