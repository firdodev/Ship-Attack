import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"

import { LightManagerComponent } from "./Components/LightManagerComponent"
export class Asteroid extends BRIX.Component{


    public asteroidMesh: BRIX.MeshComponent;
    private asteroidSize = 30;
    public static asteroidsCreatedObj = [];
    public static asteroidsCreatedMesh = [];
    public ASTEROIDS = 0;
    public asteroid: BRIX.GameObject;
    static ASTEROIDS: any;

    constructor(gameobject: BRIX.GameObject, name: string) {
        super(gameobject,name);
    }

    async  createAsteroidMesh(world,position: BABYLON.Vector3,index){
        this.asteroid = new BRIX.GameObject("dumpy", world);
        this.asteroid.name = "asteroid"+index;
        this.asteroidMesh = await this.asteroid.registerComponent(BRIX.MeshComponent);
        this.asteroidMesh.name = "asteroid"+index;
        await this.asteroidMesh.loadAsync("assets/Asteroid/","Asteroid2.glb");
        this.asteroidMesh.get().scaling = new BABYLON.Vector3(this.asteroidSize,this.asteroidSize,this.asteroidSize);
        this.asteroidMesh.get().position = position;
        this.asteroidMesh.get().material.subMaterials[0].bumpTexture = new BABYLON.Texture("assets/Asteroid/Normal.jpg",world.getScene());
        this.asteroidMesh.get().material.subMaterials[0].emissiveTexture = new BABYLON.Texture("assets/Asteroid/Emission.jpg", world.getScene(), false, false);
        let lightManager = await this.asteroid.registerComponent(LightManagerComponent);
        lightManager.color2 = new BABYLON.Color3(500,500,500);
        this.ASTEROIDS+=1;
        this.createAnimationAst(this.asteroidMesh);
        // console.log("Asteroid Components: ", this.asteroid.components);
        // console.log("Position of Asteroid: " + this.getAsteroidPositon());
    }

    private createAnimationAst(mesh: BRIX.MeshComponent){
        const positionFrames = [];
        const fps = 60;

        const positionAnimation = new BABYLON.Animation("posAnim","position.y",fps,BABYLON.Animation.ANIMATIONTYPE_FLOAT,BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        positionFrames.push({frame:0, value:0});
        positionFrames.push({frame:60,value: 50}); 
        positionFrames.push({frame:180,value: 0});

        positionAnimation.setKeys(positionFrames);
        
        mesh.get().animations.push(positionAnimation);

        (this.object as BRIX.GameObject).getWorld().getScene().beginAnimation(mesh.get(), 0, 180, true);
    }

    public getAsteroidPositon(): BABYLON.Vector3{
        return this.asteroidMesh.get().position;
    }
    public getAsteroidMesh(): BRIX.MeshComponent{
        return this.asteroidMesh;
    }
    
    public getAsteroidObj(): BRIX.GameObject{
        return this.asteroid;
    }


    //Destroy asteroid object
    public disposeA(index){
        Asteroid.asteroidsCreatedObj[index].dispose();
    }

    public randomInt(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


    updateBeforeRender(): void {
    }

    updateAfterRender(): void {
    }

    
}
