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

        let guiCon: BRIX.GUIContainerComponent = await this.world.registerComponent(BRIX.GUIContainerComponent);
        guiCon.get().parseFromURLAsync("assets/gui/mainmenu.json");

        guiCon.get().getControlByName("Start_btn").onPointerUpObservable.add(() => {
            
            console.log("Start button clicked");
        
        });


        this.onReady = onReady;
    
        this.world.start();
        this.started = true;

    }

    private async setWorld(onReady: Function){
        this.world = new BRIX.World(this.view, BRIX.EngineType.STANDARD, onReady);
        await this.world.init(true, true);
        const cameraController: BRIX.CameraController = await this.world.registerComponent(BRIX.ArcRotateCameraController);
        cameraController.getCamera().position = new BABYLON.Vector3(0,100,0);

        const lightComponent: BRIX.LightComponent = await this.world.registerComponent(BRIX.HemisphericLightComponent);
        lightComponent.intensity = 0.3;
      
    }
}