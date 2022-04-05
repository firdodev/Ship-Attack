import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"

export class LightManagerComponent extends BRIX.Component{
    private color2: BABYLON.Color3;
  
    constructor(object: BRIX.GameObject, name: string) {
      super(object, name);

      this.color2 = new BABYLON.Color3(1,1,1);
    }
  
    
    private changeColor(color: BABYLON.Color3){
      (this.object.getComponentByType(BRIX.MeshComponent) as BRIX.MeshComponent).get().material.subMaterials[0].emissiveColor = color;      
    }
  
    updateBeforeRender = () => {
        this.changeColor(this.color2);
    }
  
    updateAfterRender = () => {
    }
   
}