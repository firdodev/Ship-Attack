import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import * as BABYLON from "@babylonjs/core"
import * as BRIX from "@ludum_studios/brix-core"

export class RocketComponent extends BRIX.Component{


    constructor(gameObject: BRIX.GameObject, name: String) {
        super(gameObject, name);
    }

    //Create rocket fire paricle
    async createRocketFireParticle(spaceShipObject,world,emitPosition){
        const particles = await spaceShipObject.registerComponent(BRIX.ParticlesComponent);
        particles.particlesCapacity = 100;
        particles.particleTexture = new BABYLON.Texture("assets/textures/flare.png", world.getScene());
        particles.minSize = 10;
        particles.maxSize = 50;
        particles.minEmitPower = 0.01;
        particles.maxEmitPower = 0.05;
        particles.direction1 = new BABYLON.Vector3(0, -0.2, -1.5);
        particles.direction2 = new BABYLON.Vector3(0, -0.2, -2.5);
        particles.minEmitBox = emitPosition;
        particles.maxEmitBox = emitPosition;
    }

    getObjectComp(){
        return (this.object as BRIX.GameObject);
    }


    updateAfterRender(): void {
    }

    updateBeforeRender(): void {
    }
}