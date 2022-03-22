import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"

export class Main{

    private world;
    private view ;
    private started;
    private onReady: Function;

    constructor(view) {
        this.view = view;
        this.started = true;
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
        await this.createPlayer(); 
        this.onReady = onReady;
    
        this.world.start();
        this.started = true;
    }

    private async setWorld(onReady: Function){
        this.world = new BRIX.World(this.view, BRIX.EngineType.STANDARD, onReady);
        await this.world.init(true, true);
        // this.world.getScene().clearColor = new BABYLON.Color3(0, 0, 0);
        const cameraController: BRIX.CameraController = await this.world.registerComponent(BRIX.ArcRotateCameraController);
        const lightComponent: BRIX.LightComponent = await this.world.registerComponent(BRIX.HemisphericLightComponent);
        lightComponent.intensity = 1;
    
    }

    private async createPlayer(){
        const player: BRIX.GameObject = new BRIX.GameObject("player", this.world);
        const setShapesComponent :BRIX.SetShapesComponent = await player.registerComponent(BRIX.SetShapesComponent);
        setShapesComponent.meshType = BRIX.MeshType.BOX;

        const meshComponent: BRIX.MeshComponent =  ( player.getComponentByType(BRIX.MeshComponent) as BRIX.MeshComponent);
        
        const meshMat: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("playerMat", this.world.getScene());
        meshMat.ambientColor = new BABYLON.Color3(1,0.298,0.298);

        // this.setMaterial(meshMat,meshComponent);
        
        meshComponent.move(new BABYLON.Vector3(0,1,0));

        console.log("Player Components: " , player.components);        
        
        // meshComponent.get().material = meshMat;
        
        this.world.getScene().debugLayer.show();
        // console.log(meshComponent.get().material.subMaterials[1]);
    }

    async setMaterial(meshMat,meshComponent:BRIX.MeshComponent){
        return  meshComponent.get().material =  await meshMat;
    }
}
