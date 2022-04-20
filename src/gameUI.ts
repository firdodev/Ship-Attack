import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders"
import "babylonjs-loaders"
import "@babylonjs/loaders/glTF"
import * as GUI from "@babylonjs/gui"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"

import { Main } from "./Main"

export class GameUI extends BRIX.Component{

    private asteroidNumb: GUI.TextBlock;

    constructor(object: BRIX.GameObject,name:string){
        super(object,name);
    }


    public createUI(advancedTexture: GUI.AdvancedDynamicTexture){
        this.asteroidNumb = new GUI.TextBlock("AsteroidNum","Asteroid Number: " + Main.arrayOfNames.length);
        this.asteroidNumb.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.asteroidNumb.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.asteroidNumb.color = "white";
        this.asteroidNumb.fontSize = 20;
        this.asteroidNumb.height = "30px";
        this.asteroidNumb.width = "200px";
        this.asteroidNumb.top = "10px";
        this.asteroidNumb.left = "10px";
        advancedTexture.addControl(this.asteroidNumb); 
    }



    updateAfterRender(): void {
    }

    updateBeforeRender(): void {
        this.asteroidNumb = new GUI.TextBlock("AsteroidNum","Asteroid Number: " + Main.arrayOfNames.length);
    }
    
}