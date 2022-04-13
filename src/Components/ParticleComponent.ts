import * as BRIX from "@ludum_studios/brix-core"


export class ParticleComponent {


  public explode(scene,position: BABYLON.Vector3){
    let explosion = new BABYLON.ParticleSystem("explosion", 100, scene);
    explosion.particleTexture = new BABYLON.Texture("assets/textures/boom.png", scene);
    explosion.emitter = position;
    explosion.minEmitBox = new BABYLON.Vector3(0, 0, 0);
    explosion.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
    explosion.color1 = new BABYLON.Color4(1, 0.5, 0.5, 1.0);
    explosion.color2 = new BABYLON.Color4(1, 0.5, 0.5, 1.0);
    explosion.colorDead = new BABYLON.Color4(0, 0, 0, 0.5);
    explosion.minSize = 10;
    explosion.maxSize = 50;
    explosion.minLifeTime = 0.1;
    explosion.maxLifeTime = 0.5;
    explosion.emitRate = 10;
    explosion.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    explosion.gravity = new BABYLON.Vector3(0, 0, 0);
    explosion.direction1 = new BABYLON.Vector3(-1, -1, -1);
    explosion.direction2 = new BABYLON.Vector3(1, 1, 1);
    explosion.minAngularSpeed = 0;
    explosion.maxAngularSpeed = Math.PI;
    explosion.minEmitPower = 0.5;
    explosion.maxEmitPower = 1;
    explosion.updateSpeed = 0.05;
    explosion.start();
    setTimeout(() => {
      explosion.dispose();
    }, 500);
  }

  updateAfterRender(): void { 
  }
  updateBeforeRender(): void {
  }
}