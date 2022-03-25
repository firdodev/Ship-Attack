import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"

import { LaserComponent } from "./Bullet/LaserComponent"

export class Main{

    private enableToShoot: Boolean = false;
    private world;
    private view ;
    private started;
    private onReady: Function;

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
        cameraController.getCamera().upperRadiusLimit = 700;
        cameraController.getCamera().lowerRadiusLimit = 500;

        const lightComponent: BRIX.LightComponent = await this.world.registerComponent(BRIX.HemisphericLightComponent);
        lightComponent.intensity = 1;
        let cubeSkyBox: BRIX.CubeSkyBoxComponent = await this.world.registerComponent(BRIX.CubeSkyBoxComponent);
		cubeSkyBox.texturePath = "assets/textures/skybox/skybox";

        console.log(this.world.getEngine());
    }

    private async createShip(){
        const player: BRIX.GameObject = new BRIX.GameObject("player", this.world);
        const meshComponent: BRIX.MeshComponent = await player.registerComponent(BRIX.MeshComponent);
        await meshComponent.loadAsync("assets/Ship/","ship.glb");         
        meshComponent.get().position = new BABYLON.Vector3(0,0,-200);
        meshComponent.get().scaling = new BABYLON.Vector3(1.5,1.5,1.5);        

        const laserComponent = await player.registerComponent(LaserComponent);

        console.log("Player Components: " , player.components);

        window.addEventListener("keydown", (ev) => {
            if(ev.keyCode == 65){
                meshComponent.move(new BABYLON.Vector3(-this.movingSpeed,0,0));
            }

            if(ev.keyCode == 68){
                meshComponent.move(new BABYLON.Vector3(this.movingSpeed,0,0));
            }
            setTimeout(() => {
                this.enableToShoot = true;
            }, 2000);
            // if(this.enableToShoot){
                if(ev.keyCode == 32){
                    laserComponent.fire();
                    this.enableToShoot = false;
                }
            // }
        });
    }

    async createDumpMesh(){
        const dump:BRIX.GameObject = new BRIX.GameObject("dumpy", this.world);
        const setShapeComponent: BRIX.SetShapesComponent = await dump.registerComponent(BRIX.SetShapesComponent);
        setShapeComponent.meshType = BRIX.MeshType.CYLINDER;
        const meshComponent: BRIX.MeshComponent = (dump.getComponentByType(BRIX.MeshComponent) as BRIX.MeshComponent );
        meshComponent.get().scaling = new BABYLON.Vector3(10,10,10);
        meshComponent.get().position = new BABYLON.Vector3(0,0,10);
    }
}
