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
        for (let i = 0; i < 3; i++) {
            await this.asteroid.createAsteroidMesh(this.world, new BABYLON.Vector3(this.randomIntFromInterval(-100,100),0,0));
        }
        console.log(this.asteroidArray);

        // await this.createGrid(); // Create a grid where asteroid can be stored
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


        // let pipeline: BRIX.DefaultPipelineComponent = await this.world.registerComponent(BRIX.DefaultPipelineComponent);
        // pipeline.hasBloom = true;
        // pipeline.bloomWeight = 1;

        const lightComponent: BRIX.LightComponent = await this.world.registerComponent(BRIX.HemisphericLightComponent);
        lightComponent.intensity = 0.5;
        let cubeSkyBox: BRIX.CubeSkyBoxComponent = await this.world.registerComponent(BRIX.CubeSkyBoxComponent);
		cubeSkyBox.texturePath = "assets/textures/skybox/skybox";

        let glowLayer = await this.world.registerComponent(BRIX.GlowLayerComponent);
        glowLayer.intensity = 0.5;
      

    }

    private async createShip(){
        const player: BRIX.GameObject = new BRIX.GameObject("player", this.world);
        const meshComponent: BRIX.MeshComponent = await player.registerComponent(BRIX.MeshComponent);
        await meshComponent.loadAsync("assets/Ship/","ship.glb");         
        meshComponent.get().position = new BABYLON.Vector3(0,0,-200);
        meshComponent.get().scaling = new BABYLON.Vector3(1.5,1.5,1.5);        
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

    async createGrid(){
        const grid: BRIX.GameObject = new BRIX.GameObject("grid", this.world);
        const setShapesComponent :BRIX.SetShapesComponent = await grid.registerComponent(BRIX.SetShapesComponent);
        setShapesComponent.meshType = BRIX.MeshType.BOX;
        const meshComponent: BRIX.MeshComponent = ( grid.getComponentByType(BRIX.MeshComponent) as BRIX.MeshComponent);
        // meshComponent.get().scaling = new BABYLON.Vector3(50,50,50);
    }


    private randomIntFromInterval(min, max) { 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}
