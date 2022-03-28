import { Scene,TransformNode,Mesh, ShadowGenerator, ArcRotateCamera,Sprite, Vector3, UniversalCamera, Quaternion, SpriteManager } from "@babylonjs/core";
import PlayerInput from "./inputController";

export default class Player extends TransformNode{
  public camera;
  public scene:Scene
  private _input;

  private _camRoot

  //player
  public sprite:Sprite
  public spriteManager:SpriteManager
  private static readonly ORIGINAL_TILT: Vector3 = new Vector3(0, 0, 0);
  private static readonly PLAYER_SPEED = 0.04 
  private HEIGHT = 20
  private SPEED = 0.5 

  //player movement vars
  public _moveDirection:Vector3
  public _h: any;
  public _v: any;
  public _inputAmt:any

  private vAxis = 0
  private hAxis = 0

  public _deltaTime

  constructor(scene:Scene, sprite:Sprite, input:PlayerInput){
    super("player",scene)
    this.scene = scene
    this._setupPlayerCamera()

    this.sprite = sprite
    this.sprite.position = new Vector3(0,0.2,0)
    this.sprite.playAnimation(24,29,true,100)

    this._input = input //from inputController.ts

  }

  private _updateFromControls():void{
    this._deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;

    this._moveDirection = Vector3.Zero()
    this._h = this._input.horizontal
    this._v = this._input.vertical

    let fwd = this._camRoot.forward;
    let right = this._camRoot.right;
    let correctedVertical = fwd.scaleInPlace(this._v);
    let correctedHorizontal = right.scaleInPlace(this._h);

    //movement based off of camera's view
    let move = correctedHorizontal.addInPlace(correctedVertical);

    this._moveDirection = new Vector3((move).normalize().x, 0, (move).normalize().z);

    //clamp the input value so that diagonal movement isn't twice as fast
    let inputMag = Math.abs(this._h) + Math.abs(this._v);
    if (inputMag < 0) {
        this._inputAmt = 0;
    } else if (inputMag > 1) {
        this._inputAmt = 1;
    } else {
        this._inputAmt = inputMag;
    }

    //final movement that takes into consideration the inputs
    this._moveDirection = this._moveDirection.scaleInPlace(this._inputAmt * Player.PLAYER_SPEED);
  }

  private _setupPlayerCamera():UniversalCamera{
    this._camRoot = new TransformNode("root")
    this._camRoot.position = new Vector3(0,0,0)
    this._camRoot.rotation = new Vector3(0,0,0)

    this.camera = new UniversalCamera("cam", new Vector3(0,this.HEIGHT,0),this.scene)
    this.camera.lockedTarget = this._camRoot.position
    this.camera.fov = 0.47

    this.scene.activeCamera = this.camera
    return this.camera
  }

  private _updateCamera(): void {
    this._camRoot.position = Vector3.Lerp(this._camRoot.position, new Vector3(this.sprite.position.x, 0, this.sprite.position.z), 0.4);
  }

  private movePlayer(){
    this.sprite.position.x += this.SPEED * this._moveDirection._x 
    this.sprite.position.z += this.SPEED * this._moveDirection._z 
  }
  private animatePlayer(){
  }
    //--GAME UPDATES--
  private _beforeRenderUpdate(): void {
      this._updateFromControls();
      this.movePlayer()
      this.animatePlayer()
      // this._updateGroundDetection();
  }

  public activatePlayerCamera(): UniversalCamera {
      this.scene.registerBeforeRender(() => {
          this._beforeRenderUpdate();
          this._updateCamera();

      })
      return this.camera;
  }
}