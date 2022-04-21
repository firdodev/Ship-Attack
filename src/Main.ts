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


    //UI

    private advancedTexture;


    private text1;
    private text2;

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
        await this.setupAudio();
        let guiCon: BRIX.GUIContainerComponent = await this.world.registerComponent(BRIX.GUIContainerComponent);
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI",true, this.world.getScene())
        
        // await this.createRandomShapes(new BABYLON.Color3(0,30,80));
        // await this.createRandomShapes(new BABYLON.Color3(30,0,80));
        // await this.createRandomShapes(new BABYLON.Color3(50,0,0));
        // await this.createRandomShapes(new BABYLON.Color3(30,80,0));
        // await this.createRandomShapes(new BABYLON.Color3(0,30,0));
        // await this.createRandomShapes(new BABYLON.Color3(30,0,80));
        // await this.createRandomShapes(new BABYLON.Color3(50,0,0));
        // await this.createRandomShapes(new BABYLON.Color3(80,30,0));

        await this.createGrid(2,5); // Create a grid where asteroid can be stored
        
        this.createAsteroidNumberUI(this.advancedTexture);

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
        cameraController.getCamera().detachControl(this.view); //Removes the controls of the camera

        let pipeline: BRIX.DefaultPipelineComponent = await this.world.registerComponent(BRIX.DefaultPipelineComponent);
        pipeline.hasBloom = true;
        pipeline.bloomWeight = 0.5;

        const lightComponent: BRIX.LightComponent = await this.world.registerComponent(BRIX.HemisphericLightComponent);
        lightComponent.intensity = 0.3;
        let cubeSkyBox: BRIX.CubeSkyBoxComponent = await this.world.registerComponent(BRIX.CubeSkyBoxComponent);
		cubeSkyBox.texturePath = "assets/textures/skybox/skybox";

        let glowLayer:BRIX.GlowLayerComponent = await this.world.registerComponent(BRIX.GlowLayerComponent);
        glowLayer.intensity = 1;
        glowLayer.get().blurKernelSize = 92;
      
        this.world.getScene().clearColor = BABYLON.Color3.Black();

        // this.world.getScene().debugLayer.show();
        // console.log(this.getWorld().getScene())
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
        // console.log("Player Components: " , player.components);

        window.addEventListener("keydown", async (ev) => {
            //Movement for the ship
            if(ev.keyCode == 65){
                meshComponent.move(new BABYLON.Vector3(-this.movingSpeed,0,0));
            }
            if(ev.keyCode == 68){
                meshComponent.move(new BABYLON.Vector3(this.movingSpeed,0,0));
            }
            //Shooting from ship
            if(ev.keyCode == 32){
                if(Main.arrayOfNames.length > 0){
                    await laserComponent.createLaser();
                    (this.world.getComponentByName("shootingAudio") as BRIX.SoundComponent).play();
                    this.enableToShoot = false;
                    setTimeout(() => {
                        this.text1.text = Main.arrayOfNames.length.toString();
                        // (this.world.getComponentByName("explosionAudio") as BRIX.SoundComponent).play();
                    }, 1000);
                }else{
                    console.log("There are no more asteroids.");
                    this.createEndScreenGui(this.advancedTexture);
                }
            }
        })
    }

    public static index = 0;
    public static arrayOfNames = [];

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

                const asteroid: Asteroid = await grid.registerComponent(Asteroid);
                await asteroid.createAsteroidMesh(this.world,new BABYLON.Vector3(x * 75,0,z * 75),Main.index);
                Main.arrayOfNames.push(asteroid.getAsteroidObj().name);
                Main.index++;
                // console.log(this.arrayOfNames); //Outputs the names of every asteroid
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

    createAsteroidNumberUI(advancedTexture){
        //Text that displays every asteroid created on the top left corner
        this.text1 = new GUI.TextBlock();
        this.text1.text = Main.arrayOfNames.length.toString();
        this.text1.color = "white";
        this.text1.fontSize = 30;
        this.text1.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.text1.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.text1.top = "10px";
        this.text1.left = "10px";
        advancedTexture.addControl(this.text1);
    }
    
    createEndScreenGui(advancedTexture){
        //Text that displays when the game is over
        //Create a black background
        let blackBackground = new GUI.Rectangle();
        blackBackground.thickness = 0;
        blackBackground.background = "black";
        blackBackground.width = "100%";
        blackBackground.height = "100%";
        blackBackground.alpha = 0.5;
        blackBackground.isVisible = true;
        advancedTexture.addControl(blackBackground);

        //Retry button that refresh dhe page on click
        var button1 = GUI.Button.CreateSimpleButton("but1", "Click Me");
        button1.width = "150px"
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        button1.onPointerUpObservable.add(function() {
            alert("you did it!");
        });
        button1.top = "7%";
        advancedTexture.addControl(button1);

        //Create a text that says "Game Over" in the center
        let gameOverText = new GUI.TextBlock();
        gameOverText.text = "Game Over";
        gameOverText.color = "white";
        gameOverText.fontSize = 50;
        gameOverText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        gameOverText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        // gameOverText.top = "50%";
        // gameOverText.left = "50%";
        advancedTexture.addControl(gameOverText);
    }

    private async setupAudio(){
        let audio: BRIX.SoundComponent = await this.world.registerComponent(BRIX.SoundComponent);
        await audio.loadAsync("assets/audio/","shooting.mp3");
        audio.name = "shootingAudio";

        audio = await this.world.registerComponent(BRIX.SoundComponent);
        await audio.loadAsync("assets/audio/","explosion.wav");
        audio.name = "explosionAudio";                                           
    }

    private randomIntFromInterval(min, max) { 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}
