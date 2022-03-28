import { Scene,Mesh, Vector3, Color3, StandardMaterial, PlaneRotationGizmo, MeshBuilder, SpriteManager, Sprite, GroundBuilder } from "@babylonjs/core";

export default class Environment {
  private _scene: Scene
  
  constructor(scene: Scene){
    this._scene = scene
  }

  public async load(){

    var ground = Mesh.CreateBox("ground",200,this._scene)
    ground.scaling = new Vector3(1,.02,1)
    ground.position = new Vector3(0,-4,0)
    var box1 = Mesh.CreateBox("box",0.5,this._scene)
    box1.position = new Vector3(0,1,2)

    // player.angle = Math.PI / 2
    var mat = new StandardMaterial("Green",this._scene)
    mat.alpha = 1
    mat.diffuseColor = new Color3(0,1,0)
    ground.material = mat
  }
}