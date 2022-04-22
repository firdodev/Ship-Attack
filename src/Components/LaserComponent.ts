import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"
import { Main } from "../Main"

import { Asteroid } from "../Asteroid"
import { ParticleComponent } from "./ParticleComponent"

export class LaserComponent extends BRIX.Component {

    private main: Main = new Main(document.getElementById("view") as HTMLCanvasElement);
    // private asteroid: Asteroid = new Asteroid();

    private shipPosition: BABYLON.Vector3 = ((this.object as BRIX.GameObject).getWorld().getObjectByName("player").getComponentByType(BRIX.MeshComponent) as BRIX.MeshComponent).get().position;

    private bullet: BRIX.GameObject;
    private meshComponent: BRIX.MeshComponent;
    
    private isCreated: Boolean = false;
    
    private time = 0;
    private timeCheck = 120;
    
    private boomcomp: ParticleComponent = new ParticleComponent();


    //Asteroid
    private ast_destroyed = false;

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
        // console.log(Main.arrayOfNames); //Shows every name in array
        if(Main.index > 0){
            for(let i = 0; i < Main.arrayOfNames.length; i++){
                if(this.meshComponent.get().intersectsMesh(this.getAsteroidMesh(Main.arrayOfNames[i]))){
                    // console.log(this.getAsteroid(Main.arrayOfNames[i]));
                    this.boomcomp.explode((this.object as BRIX.GameObject).getWorld().getScene(), this.getAsteroidMesh(Main.arrayOfNames[i]).position);
                    this.getAsteroid(Main.arrayOfNames[i]).dispose();
                    this.bullet.dispose();
                    this.isCreated = false;
                    this.meshComponent.get().position.z += 50;
                    Main.arrayOfNames.splice(i,1);
                    this.ast_destroyed = true;
                }else{
                    // console.log("No Collision or Asteroid is out of range");
                }
            }
        }else{
            // console.log("No asteroids");
        }
     }
     //Gets every asteroid mesh based on the name of the object that gets as a parameter
    private getAsteroidMesh(index){
        return ((this.object as BRIX.GameObject).getWorld().getObjectByName(index).getComponentByType(BRIX.MeshComponent) as BRIX.MeshComponent).get();
    }

     //Gets every asteroid mesh based on the name of object from world
    private getAsteroid(index){
        return (this.object as BRIX.GameObject).getWorld().getObjectByName(index);
    }

    async createLaser(){
        if(!this.isCreated){
            this.bullet = new BRIX.GameObject("bullet", (this.object as BRIX.GameObject).getWorld());
            this.meshComponent = await this.bullet.registerComponent(BRIX.MeshComponent);
            await this.meshComponent.loadAsync("assets/Ship/","missle.glb");
            this.meshComponent.get().scaling = new BABYLON.Vector3(10,10,10);
            this.meshComponent.get().position = new BABYLON.Vector3(this.shipPosition.x,0,this.shipPosition.z);
            this.meshComponent.get().material.subMaterials[0].emissiveColor = new BABYLON.Color3(50, 0, 0);
            this.meshComponent.get().position.z = this.shipPosition.z;
            this.isCreated = true;

        }
    }
    
    updateBeforeRender = () => {
        if(this.isCreated){
            this.meshComponent.move(new BABYLON.Vector3(0,0,8));
            this.checkAsteroidTouching();
            if(this.time >= this.timeCheck){              
                this.bullet.dispose();
                this.meshComponent.get().position.z = this.shipPosition.z;
                this.isCreated = false;
                this.meshComponent.get().position.z += 50;
                this.time = 0;
            }
            this.time += 1;

        }
    }

    updateAfterRender = () => {
    }
}