import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"


export class Shooting{

    private world;

    public async createBullet(world){

        this.world = world;
        
        const bullet: BRIX.GameObject = new BRIX.GameObject("bullet", this.world);
        const setTypeMesh: BRIX.SetShapesComponent = await bullet.registerComponent(BRIX.SetShapesComponent);
        const meshComponent: BRIX.MeshComponent = ( bullet.getComponentByType(BRIX.MeshComponent) as BRIX.MeshComponent);
        setTypeMesh.meshType = BRIX.MeshType.SPHERE;
        meshComponent.get().scaling = new BABYLON.Vector3(10,10,10);
        const meshMaterial = new BABYLON.StandardMaterial("bulletMat", this.world.getScene());
        meshMaterial.diffuseColor = new BABYLON.Color3(1,0,0);
        meshComponent.get().material = meshMaterial;
        console.log(meshComponent.get().material);

    }


}