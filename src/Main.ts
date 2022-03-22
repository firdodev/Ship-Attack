import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"

import { Shooting } from "./Bullet/shooting"

export class Main{



    private world;
    private view ;
    private started;
    private onReady: Function;


    // References
    private shooting:Shooting = new Shooting();

    private movingSpeed = 10;

    constructor(view) {
        this.view = view;
        this.started = true;

        // this.world.getEngine().stencil = true;
        //Per te rregulluar errorin e materialeve duhet te besh enable stencil nga engine
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
        await this.shooting.createBullet(this.world);
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
        cameraController.getCamera().upperRadiusLimit = 700;
        cameraController.getCamera().lowerRadiusLimit = 500;

        const lightComponent: BRIX.LightComponent = await this.world.registerComponent(BRIX.HemisphericLightComponent);
        lightComponent.intensity = 1;
        let cubeSkyBox: BRIX.CubeSkyBoxComponent = await this.world.registerComponent(BRIX.CubeSkyBoxComponent);
		cubeSkyBox.texturePath = "assets/textures/skybox/skybox";
    }

    private async createShip(){
        const player: BRIX.GameObject = new BRIX.GameObject("player", this.world);
        const meshComponent: BRIX.MeshComponent = await player.registerComponent(BRIX.MeshComponent);
        await meshComponent.loadAsync("assets/Ship/","ship.glb");         
        meshComponent.get().position = new BABYLON.Vector3(0,0,-200);
        meshComponent.get().scaling = new BABYLON.Vector3(1.5,1.5,1.5);        

        console.log("Player Components: " , player.components);

        window.addEventListener("keydown", (ev) => {
            if(ev.keyCode == 65){
                meshComponent.move(new BABYLON.Vector3(-this.movingSpeed,0,0));
            }

            if(ev.keyCode == 68){
                meshComponent.move(new BABYLON.Vector3(this.movingSpeed,0,0));
            }
        });
    }
}
