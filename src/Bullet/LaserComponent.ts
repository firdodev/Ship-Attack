import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"


export class LaserComponent extends BRIX.Component {

    private movementSpeed = 40;
    private currentZPos = 0;


    private timeCheck = 60;
    private timeStep = 0;

    private meshComponent:BRIX.MeshComponent;
    private currentMeshComponent: BRIX.MeshComponent;
    private isCreated: Boolean = false;

    private check =0;

    constructor(gameObject: BRIX.GameObject, name: String) {
        super(gameObject, name);
    }


    
    public async createBullet(){
        const bullet: BRIX.GameObject = new BRIX.GameObject("bullet", (this.object as BRIX.GameObject).getWorld());
        this.meshComponent = await bullet.registerComponent(BRIX.MeshComponent);
        this.currentMeshComponent = this.meshComponent;
        await this.meshComponent.loadAsync("assets/Ship/","missle.glb");
        
        this.meshComponent.get().scaling = new BABYLON.Vector3(10,10,10);
        
        this.meshComponent.setOutline(0.1,new BABYLON.Color3(0,0,1));

        this.isCreated = true;  
    }

    async moveBullet(){
        if(this.isCreated){
            this.meshComponent.get().position = new BABYLON.Vector3(0,0,this.currentZPos);
            this.currentMeshComponent = null;
            setTimeout(() => {
                this.isCreated = false;
                this.currentZPos = 0;
                this.meshComponent.dispose();  
            }, 1000);
        }
    }
    
    updateBeforeRender = () => {
        this.check++;
    
        this.moveBullet();
        this.currentZPos++;
        
        
        // if(this.check % 60 == 1 && this.currentMeshComponent){
        //     this.moveBullet();
        //     this.check = 0;
        // }
            
       
    }

    updateAfterRender = () => {
    }
}