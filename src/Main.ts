import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"

import { LaserComponent } from "./Bullet/LaserComponent"
import { LightManagerComponent } from "./Components/LightManagerComponent"

export class Main{

    private enableToShoot: Boolean = false;
    private world;
    private view ;
    private started;
    private onReady: Function;

    private test = 0;

    private movingSpeed = 10;

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
        await this.createDumpMesh();
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

        const lightComponent: BRIX.LightComponent = await this.world.registerComponent(BRIX.HemisphericLightComponent);
        lightComponent.intensity = 0.5;
        let cubeSkyBox: BRIX.CubeSkyBoxComponent = await this.world.registerComponent(BRIX.CubeSkyBoxComponent);
		cubeSkyBox.texturePath = "assets/textures/skybox/skybox";
    }

    private async createShip(){
        const player: BRIX.GameObject = new BRIX.GameObject("player", this.world);
        const meshComponent: BRIX.MeshComponent = await player.registerComponent(BRIX.MeshComponent);
        await meshComponent.loadAsync("assets/Ship/","ship.glb");         
        meshComponent.get().position = new BABYLON.Vector3(0,0,-200);
        meshComponent.get().scaling = new BABYLON.Vector3(1.5,1.5,1.5);        

        // const laserComponent = await player.registerComponent(LaserComponent);

        console.log("Player Components: " , player.components);

        // await laserComponent.createLaser();
        // await laserComponent.createLaser();
        // await laserComponent.createLaser();
        // await laserComponent.createLaser();
        // await laserComponent.createLaser();


        window.addEventListener("keydown", (ev) => {
            if(ev.keyCode == 65){
                meshComponent.move(new BABYLON.Vector3(-this.movingSpeed,0,0));
                console.log(meshComponent.position);
            }
            if(ev.keyCode == 68){
                meshComponent.move(new BABYLON.Vector3(this.movingSpeed,0,0));
                console.log(meshComponent.position);
            }
            if(ev.keyCode == 32){
                var laserComp = new LaserComponent();
                laserComp.createLaser(this.world);
                this.enableToShoot = false;
                this.test+=30;
                this.createDumpMesh();
            }
        });

        this.world.getScene().updateBeforeRender(()=>{
            console.log("Update Message");
        })
    }

    async createDumpMesh(){
        const dump:BRIX.GameObject = new BRIX.GameObject("dumpy", this.world);
        const meshComponent: BRIX.MeshComponent = await dump.registerComponent(BRIX.MeshComponent);
        await meshComponent.loadAsync("assets/Asteroid/","Asteroid2.glb");
        meshComponent.get().scaling = new BABYLON.Vector3(30,30,30);
        meshComponent.get().position = new BABYLON.Vector3(this.test,0,50);
        meshComponent.get().material.subMaterials[0].bumpTexture = new BABYLON.Texture("assets/Asteroid/Normal.jpg",this.world.getScene());
        meshComponent.get().material.subMaterials[0].emissiveTexture = new BABYLON.Texture("assets/Asteroid/Emission.jpg", this.world.getScene(), false, false);
        let lightManager = await dump.registerComponent(LightManagerComponent);
        lightManager.nrOfSeconds = 0.2;
        lightManager.flickerRate = 3;

        // var gl = new BABYLON.GlowLayer("glow", this.world.getScene());

        console.log("Asteroid Components: ", meshComponent.get().material.subMaterials[0].bumpTexture);
    }
}
