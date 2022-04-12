import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"

import { LightManagerComponent } from "./Components/LightManagerComponent"
import { BoomComponent } from "./Components/BoomComponent"
export class Asteroid{

    public static asteroidMesh: BRIX.MeshComponent;
    private asteroidSize = 30;
    public static asteroidsCreated = [];
    public static ASTEROIDS = 0;

    async  createAsteroidMesh(world,position: BABYLON.Vector3){
        const asteroid:BRIX.GameObject = new BRIX.GameObject("dumpy", world);
        Asteroid.asteroidMesh = await asteroid.registerComponent(BRIX.MeshComponent);
        await Asteroid.asteroidMesh.loadAsync("assets/Asteroid/","Asteroid2.glb");
        Asteroid.asteroidMesh.get().scaling = new BABYLON.Vector3(this.asteroidSize,this.asteroidSize,this.asteroidSize);
        Asteroid.asteroidMesh.get().position = position;
        Asteroid.asteroidMesh.get().material.subMaterials[0].bumpTexture = new BABYLON.Texture("assets/Asteroid/Normal.jpg",world.getScene());
        Asteroid.asteroidMesh.get().material.subMaterials[0].emissiveTexture = new BABYLON.Texture("assets/Asteroid/Emission.jpg", world.getScene(), false, false);
        let lightManager = await asteroid.registerComponent(LightManagerComponent);
        lightManager.color2 = new BABYLON.Color3(500,500,500);

        // await asteroid.registerComponent(BoomComponent);
        
        this.addAsteroidToArrary(Asteroid.asteroidMesh);
        Asteroid.ASTEROIDS+=1;
        console.log("Asteroid Components: ", asteroid.components);
        // console.log("Position of Asteroid: " + this.getAsteroidPositon());
    }

    public getAsteroidPositon(): BABYLON.Vector3{
        return Asteroid.asteroidMesh.get().position;
    }

    public addAsteroidToArrary(asteroid: BRIX.MeshComponent){
        Asteroid.asteroidsCreated.push(asteroid);
    }

    public getAsteroidMesh(): BRIX.MeshComponent{
        return Asteroid.asteroidMesh;
    }

    
}