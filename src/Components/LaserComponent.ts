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

    private shipPosition:BABYLON.Vector3 = new BABYLON.Vector3(0,0,-150);

    private bullet: BRIX.GameObject;
    private meshComponent: BRIX.MeshComponent;
    
    private isCreated: Boolean = false;
    
    private time = 0;
    private timeCheck = 120;
    
    private boomcomp: ParticleComponent = new ParticleComponent();

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
        if(Main.index > 0){
            if(this.meshComponent.get().intersectsMesh(this.getAsteroidMesh(),true)){
                console.log(this.getAsteroid());
                this.boomcomp.explode((this.object as BRIX.GameObject).getWorld().getScene(), this.getAsteroidMesh().position);
                this.getAsteroid().dispose();
                this.bullet.dispose();
                this.isCreated = false;
                this.shipPosition.z = -150;
                Main.index-=1;
            }
        }else{
            console.log("No asteroids");
        }
     }

    // async checkAsteroidTouching(){
    //    for(let i = 0; i < Main.index; i++){
    //        console.log("Index per Asteroid ",i);
    //         if(Main.index > 0){
    //             if(this.meshComponent.get().intersectsMesh(this.getAsteroidMesh(i),true)){
    //                 console.log(this.getAsteroid(i));
    //                 this.boomcomp.explode((this.object as BRIX.GameObject).getWorld().getScene(), this.getAsteroidMesh(i).position);
    //                 this.getAsteroid(i).dispose();
    //                 this.bullet.dispose();
    //                 this.isCreated = false;
    //                 this.shipPosition.z = -150; 
    //             }
    //         }else{
    //             console.log("No asteroids");
    //         }
    //     }
    // }

    private getAsteroidMesh(){
        return ((this.object as BRIX.GameObject).getWorld().getObjectByName("asteroid1").getComponentByType(BRIX.MeshComponent) as BRIX.MeshComponent).get();
    }

    private getAsteroid(){
        return (this.object as BRIX.GameObject).getWorld().getObjectByName("asteroid1");
    }

    async createLaser(){
        if(!this.isCreated){
            this.bullet = new BRIX.GameObject("bullet", (this.object as BRIX.GameObject).getWorld());
            this.meshComponent = await this.bullet.registerComponent(BRIX.MeshComponent);
            await this.meshComponent.loadAsync("assets/Ship/","missle.glb");
            this.meshComponent.get().scaling = new BABYLON.Vector3(10,10,10);
            this.meshComponent.get().position = new BABYLON.Vector3(this.shipPosition.x,0,this.shipPosition.z);
            this.meshComponent.get().material.subMaterials[0].emissiveColor = new BABYLON.Color3(50, 0, 0);

            this.isCreated = true;

        }
    }
    
    updateBeforeRender = () => {
        if(this.isCreated){
            this.meshComponent.move(new BABYLON.Vector3(0,0,4));
            this.shipPosition.z = this.meshComponent.get().position.z;
            this.checkAsteroidTouching();
            if(this.time >= this.timeCheck){              
                this.bullet.dispose();
                this.isCreated = false;
                this.shipPosition.z = -150;
                this.time = 0;
            }
            this.time += 1;
        }
    }

    updateAfterRender = () => {
    }
}