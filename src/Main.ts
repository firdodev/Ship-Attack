import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders"
import "babylonjs-loaders"
import "@babylonjs/loaders/glTF"
import * as GUI from "@babylonjs/gui"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"

import { LaserComponent } from "./Components/LaserComponent"
import { Asteroid } from "./Asteroid"
import { ParticleComponent } from "./Components/ParticleComponent"
import { RocketComponent } from "./Components/RocketComponent"

export class Main{

    // private laserComp: LaserComponent;

    // private asteroid: Asteroid = new Asteroid();

    private enableToShoot: Boolean = false;
    private world;
    private view ;
    private started;
    private onReady: Function;

    private test = 0;

    private movingSpeed = 10;
    public asteroidArray = [];
    public asteroidArrayMesh = [];

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
        // await this.createRandomShapes(new BABYLON.Color3(0,30,80));
        // await this.createRandomShapes(new BABYLON.Color3(30,0,80));
        // await this.createRandomShapes(new BABYLON.Color3(50,0,0));
        // await this.createRandomShapes(new BABYLON.Color3(30,80,0));
        // await this.createRandomShapes(new BABYLON.Color3(0,30,0));
        // await this.createRandomShapes(new BABYLON.Color3(30,0,80));
        // await this.createRandomShapes(new BABYLON.Color3(50,0,0));
        // await this.createRandomShapes(new BABYLON.Color3(80,30,0));



        // await this.asteroid.createAsteroidMesh(this.world, new BABYLON.Vector3(1 * 75,0,1 * 75), 1);
        // await this.asteroid.createAsteroidMesh(this.world, new BABYLON.Vector3(2 * 75,0,2 * 75), 2);
        // await this.asteroid.createAsteroidMesh(this.world, new BABYLON.Vector3(3 * 75,0,3 * 75), 3);
        // await this.asteroid.createAsteroidMesh(this.world, new BABYLON.Vector3(4 * 75,0,4 * 75), 4);



        //Saving everything in an array

        await this.createGrid(2,2); // Create a grid where asteroid can be stored
        this.onReady = onReady;
    
        this.world.start();
        this.started = true;

        // this.getWorld().getScene().debugLayer.show({
        //     embedMode: true,
        // });
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
        // pipeline.bloomWeight = 0.5;

        const lightComponent: BRIX.LightComponent = await this.world.registerComponent(BRIX.HemisphericLightComponent);
        lightComponent.intensity = 0.3;
        let cubeSkyBox: BRIX.CubeSkyBoxComponent = await this.world.registerComponent(BRIX.CubeSkyBoxComponent);
		cubeSkyBox.texturePath = "assets/textures/skybox/skybox";

        let glowLayer:BRIX.GlowLayerComponent = await this.world.registerComponent(BRIX.GlowLayerComponent);
        glowLayer.intensity = 1;
        glowLayer.get().blurKernelSize = 92;
      
        this.world.getScene().clearColor = BABYLON.Color3.Black();


        // this.createGui();

    }

    private async createShip(){
        const player: BRIX.GameObject = new BRIX.GameObject("player", this.world);
        const meshComponent: BRIX.MeshComponent = await player.registerComponent(BRIX.MeshComponent);
        await meshComponent.loadAsync("assets/Ship/","ship.glb");         
        meshComponent.get().position = new BABYLON.Vector3(0,0,-200);
        meshComponent.get().scaling = new BABYLON.Vector3(1.5,1.5,1.5);     

        meshComponent.get().material.subMaterials[0].emissiveColor = new BABYLON.Color3(5,5,5);

        // let rocket1: RocketComponent = await player.registerComponent(RocketComponent);
        // await rocket1.createRocketFireParticle(player,this.world,meshComponent.position);

        const laserComponent = await player.registerComponent(LaserComponent);
        console.log("Player Components: " , player.components);

        window.addEventListener("keydown", async (ev) => {
            //Movement for the ship
            if(ev.keyCode == 65){
                meshComponent.move(new BABYLON.Vector3(-this.movingSpeed,0,0));
            }
            if(ev.keyCode == 68){
                meshComponent.move(new BABYLON.Vector3(this.movingSpeed,0,0));
            }
            //Shooting for the ship
            if(ev.keyCode == 32){
                // if(this.asteroid.ASTEROIDS > 0){
                    await laserComponent.createLaser();
                    console.log("Shooting");
                    this.enableToShoot = false;
                    this.test+=30;
                    // this.asteroid.ASTEROIDS--;
                // }else{
                //     console.log("There are no more asteroids.");
                //     window.location.reload();
                // }
            }
        })
    }

    private index = 0;


    async createGrid(rows: number, cols: number){
        for (let x = 0; x < cols; x++) {
            for(let z = 0; z < rows; z++){
                const grid: BRIX.GameObject = new BRIX.GameObject("grid", this.world);
                const setShapesComponent :BRIX.SetShapesComponent = await grid.registerComponent(BRIX.SetShapesComponent);
                setShapesComponent.meshType = BRIX.MeshType.BOX;
                const meshComponent: BRIX.MeshComponent = ( grid.getComponentByType(BRIX.MeshComponent) as BRIX.MeshComponent);
                meshComponent.get().scaling = new BABYLON.Vector3(75,75,75);
                meshComponent.get().visibility = 0;
                meshComponent.get().position = new BABYLON.Vector3(x * 75,0,z * 75);

                const asteroid: Asteroid = await grid.registerComponent(Asteroid);
                await asteroid.createAsteroidMesh(this.world,new BABYLON.Vector3(x * 75,0,z * 75),this.index);
                this.index++;

                this.asteroidArray.push(asteroid.asteroid);
                this.asteroidArrayMesh.push(asteroid.asteroidMesh);

                console.log("ASteroid Obj Array ====> ",this.asteroidArray);
                console.log("Asteroid Mesh Array ====> " , this.asteroidArrayMesh);

                // await this.asteroid.createAsteroidMesh(this.world, new BABYLON.Vector3(x * 75,0,z * 75), x);
                // this.asteroid.asteroidMesh.get().clone("Asteroid"+"z");
        
            }
        }
        
    }

    //Random Shapes on the background
    private async createRandomShapes(color: BABYLON.Color3){
        const randomShapes: BRIX.GameObject = new BRIX.GameObject("randomShapes", this.world);
        const setShapesComponent :BRIX.SetShapesComponent = await randomShapes.registerComponent(BRIX.SetShapesComponent);
        setShapesComponent.meshType = BRIX.MeshType.BOX;
        const meshComponent: BRIX.MeshComponent = ( randomShapes.getComponentByType(BRIX.MeshComponent) as BRIX.MeshComponent);
        meshComponent.get().visibility = 1;
        meshComponent.get().position = new BABYLON.Vector3(this.randomIntFromInterval(-300,300),-100,this.randomIntFromInterval(-300,300));
        meshComponent.get().scaling = new BABYLON.Vector3(35,35,35);
        // meshComponent.get().material.emissiveColor = new BABYLON.Color3(this.randomIntFromInterval(0.0,1.0),this.randomIntFromInterval(0.0,1.0),this.randomIntFromInterval(0.0,1.0));
        let standardMaterial = new BABYLON.StandardMaterial("standardMaterial", this.world.getScene());
        meshComponent.get().material = standardMaterial;
        standardMaterial.emissiveColor = color;
        standardMaterial.alpha = 0.5;
        standardMaterial.backFaceCulling = false;

    }

    createGui(){
        let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let xmlLoader = new GUI.XmlLoader();
        xmlLoader.loadLayout("assets/UI/UI.xml", advancedTexture, (layout) => {});
        // let xmlLoader = 
        
        // let asteroidAvailable = new GUI.TextBlock();
        // asteroidAvailable.text = ;
        // asteroidAvailable.color = "white";
        // asteroidAvailable.fontSize = 24;
        // advancedTexture.addControl(asteroidAvailable);
    }

    private randomIntFromInterval(min, max) { 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}
