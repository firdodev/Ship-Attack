import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import * as GUI from "@babylonjs/gui"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"


export class MainMenu{
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
        this.createMainMenuUI();
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
        // pipeline.bloomWeight = 0.5;

        const lightComponent: BRIX.LightComponent = await this.world.registerComponent(BRIX.HemisphericLightComponent);
        lightComponent.intensity = 0.3;
      
        // this.world.getScene().clearColor = BABYLON.Color3.Black();
    }

    //Create main menu ui in babylon js GUI
    public createMainMenuUI(){
        console.log("Gui started");
        let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let panel = new GUI.StackPanel();
        panel.width = "100%";
        panel.height = "100%";
        panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        panel.background = "white";
        panel.alpha = .5;
        panel.top = "10%";
        panel.left = "10%";
        
        let button = new GUI.Button();
        panel.addControl(button);
        // panel.addControl(GUI.Button.CreateSimpleButton("Play", "Play"));
        // panel.addControl(GUI.Button.CreateSimpleButton("Options", "Options"));
        // panel.addControl(GUI.Button.CreateSimpleButton("Exit", "Exit"));
        advancedTexture.addControl(panel);
    }

    
}