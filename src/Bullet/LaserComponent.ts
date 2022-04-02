import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"
import { Main } from "../Main"
import { Asteroid } from "../Asteroid"

export class LaserComponent extends BRIX.Component {

    private main: Main = new Main(document.getElementById("view") as HTMLCanvasElement);
    private asteroid: Asteroid = new Asteroid();

    private shipPosition:BABYLON.Vector3 = new BABYLON.Vector3(0,0,-150);

    private bullet: BRIX.GameObject;
    private meshComponent: BRIX.MeshComponent;

    private isCreated: Boolean = false;

    private time = 0;
    private timeCheck = 120;
    

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
    
    async checkAsteroidTouching(){
    //    for(let i = 0; i < Asteroid.asteroidsCreated; i++){
    //         if(this.meshComponent.get().intersectsMesh(this.getAsteroid(2),true)){
    //             console.log("Touching Asteroid");
    //             this.getAsteroid(2).dispose();
    //             this.bullet.dispose();
    //         }else{
    //             console.log("Not touching asteroid");
    //         }
    //     }
    }

    private getAsteroid(index){
        
        return Asteroid.asteroidsCreated[index];
        
    }
    async createLaser(){
        if(!this.isCreated){
            this.bullet = new BRIX.GameObject("bullet", (this.object as BRIX.GameObject).getWorld());
            this.meshComponent = await this.bullet.registerComponent(BRIX.MeshComponent);
            await this.meshComponent.loadAsync("assets/Ship/","missle.glb");
            this.meshComponent.get().scaling = new BABYLON.Vector3(10,10,10);
            this.meshComponent.get().position = new BABYLON.Vector3(this.shipPosition.x,0,this.shipPosition.z);
            this.isCreated = true;
        }
    }
    
    updateBeforeRender = () => {
        if(this.isCreated){
            // console.log(this.getAsteroid());
            this.meshComponent.move(new BABYLON.Vector3(0,0,2));
            this.shipPosition.z = this.meshComponent.get().position.z;
            this.checkAsteroidTouching();
            console.log("Asteroid Pos: ",this.getAsteroid(2));
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