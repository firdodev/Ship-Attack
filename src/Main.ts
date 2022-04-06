import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"

import { LaserComponent } from "./Components/LaserComponent"
import { Asteroid } from "./Asteroid"

export class Main{

    // private laserComp: LaserComponent;

    private asteroid: Asteroid = new Asteroid();

    private enableToShoot: Boolean = false;
    private world;
    private view ;
    private started;
    private onReady: Function;

    private test = 0;

    private movingSpeed = 10;
    public asteroidArray;

    constructor(view) {
        this.view = view;
        this.started = true;
        // this.world.getEngine().stencil = true;
        // Per te rregulluar errorin e materialeve duhet te besh enable stencil nga engine
    }


    public getWorld(): BRIX.World{
        return this.world;
    }
    public isStarted() {
        return this.started;
    }

    public disposeEngine(){
        (this.world as BRIX.World).disposeEngine();
    }
    
    public setCallbacks = (inputCallback, navigationEndCallback) => {
    }
    
    public async setup(onReady: Function) {
        await this.setWorld(null);
        await this.createShip(); 

        //Saving everything in an array
        for (let i = 0; i < 1; i++) {
            await this.asteroid.createAsteroidMesh(this.world, new BABYLON.Vector3(0,0,0));
        }

        await this.createGrid(1,6); // Create a grid where asteroid can be stored
        this.onReady = onReady;
    
        this.world.start();
        this.started = true;
    }

    private async setWorld(onReady: Function){
        this.world = new BRIX.World(this.view, BRIX.EngineType.STANDARD, onReady);
        await this.world.init(true, true);
        const cameraController: BRIX.CameraController = await this.world.registerComponent(BRIX.ArcRotateCameraController);
        cameraController.getCamera().position = new BABYLON.Vector3(0,100,0);
        cameraController.getCamera().radius = 700;
        cameraController.getCamera().alpha = -1.57;
        cameraController.getCamera().beta = -10;
        // cameraController.getCamera().upperRadiusLimit = 700;
        // cameraController.getCamera().lowerRadiusLimit = 500;
        // cameraController.getCamera().detachControl(this.view); //Removes the controls of the camera

        // let pipeline: BRIX.DefaultPipelineComponent = await this.world.registerComponent(BRIX.DefaultPipelineComponent);
        // pipeline.hasBloom = true;
        // pipeline.bloomWeight = 1;

        const lightComponent: BRIX.LightComponent = await this.world.registerComponent(BRIX.HemisphericLightComponent);
        lightComponent.intensity = 0.5;
        let cubeSkyBox: BRIX.CubeSkyBoxComponent = await this.world.registerComponent(BRIX.CubeSkyBoxComponent);
		cubeSkyBox.texturePath = "assets/textures/skybox/skybox";

        let glowLayer = await this.world.registerComponent(BRIX.GlowLayerComponent);
        glowLayer.intensity = 1;
      

    }

    private async createShip(){
        const player: BRIX.GameObject = new BRIX.GameObject("player", this.world);
        const meshComponent: BRIX.MeshComponent = await player.registerComponent(BRIX.MeshComponent);
        await meshComponent.loadAsync("assets/Ship/","ship.glb");         
        meshComponent.get().position = new BABYLON.Vector3(0,0,-200);
        meshComponent.get().scaling = new BABYLON.Vector3(1.5,1.5,1.5);     

        meshComponent.get().material.subMaterials[0].emissiveColor = new BABYLON.Color3(5,5,5);

        const laserComponent = await player.registerComponent(LaserComponent);
        console.log("Player Components: " , player.components);

        window.addEventListener("keydown", async (ev) => {
            if(ev.keyCode == 65){
                meshComponent.move(new BABYLON.Vector3(-this.movingSpeed,0,0));
            }
            if(ev.keyCode == 68){
                meshComponent.move(new BABYLON.Vector3(this.movingSpeed,0,0));
            }
            if(ev.keyCode == 32){
                await laserComponent.createLaser();
                console.log("Shooting");
                this.enableToShoot = false;
                this.test+=30;
            }
        });

    }

    async createGrid(rows: number, cols: number){
        for (let x = -5; x < cols; x++) {
            for(let z = 0; z < rows; z++){
                const grid: BRIX.GameObject = new BRIX.GameObject("grid", this.world);
                const setShapesComponent :BRIX.SetShapesComponent = await grid.registerComponent(BRIX.SetShapesComponent);
                setShapesComponent.meshType = BRIX.MeshType.BOX;
                const meshComponent: BRIX.MeshComponent = ( grid.getComponentByType(BRIX.MeshComponent) as BRIX.MeshComponent);
                meshComponent.get().scaling = new BABYLON.Vector3(75,75,75);
                meshComponent.get().visibility = 0;
                meshComponent.get().position = new BABYLON.Vector3(x * 75,0,z * 75);

               await this.asteroid.createAsteroidMesh(this.world, new BABYLON.Vector3(x * 75,0,z * 75));
        
            }
        }
        
    }


    private randomIntFromInterval(min, max) { 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}
