import {Scalar, ActionManager, ExecuteCodeAction, Scene } from "@babylonjs/core";
import Player from "./characterController";

export default class PlayerInput{

  public inputMap:any;

  public verticalAxis
  public vertical
  public horizontal
  public horizontalAxis
  public dashing:boolean
  public jumpKeyDown:boolean

  public player:Player
  private _scene:Scene

  constructor(scene:Scene){
    this._scene = scene

    this._scene.actionManager = new ActionManager(this._scene)
    this.inputMap = {}
    this._scene.actionManager.registerAction( new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (event) => {
      if(event.sourceEvent.type == "keydown"){
        this.inputMap[event.sourceEvent.key] = true
      }
    }))
    this._scene.actionManager.registerAction( new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (event) => {
      this.inputMap[event.sourceEvent.key] = event.sourceEvent.type == "keydown"
      if(event.sourceEvent.type != "keydown"){
        this.inputMap[event.sourceEvent.key] = false
      }
    }))
    scene.onBeforeRenderObservable.add(()=>{
      this._updateFromKeyboard()
    })
  }
      // Keyboard controls & Mobile controls
    //handles what is done when keys are pressed or if on mobile, when buttons are pressed
    private _updateFromKeyboard(): void {
      if (this.inputMap["w"]) {
        this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
        this.verticalAxis = -1;
        this.player.sprite.playAnimation(18,23,true,100)
      } 
      else if (this.inputMap["s"]) {
        this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);
        this.verticalAxis = 1;
        this.player.sprite.playAnimation(24,29,true,100)
      } 
      else{
        this.vertical = 0;
        this.verticalAxis = 0;
      }

      if (this.inputMap["a"]) {
        this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
        this.horizontalAxis = 1;
        this.player.sprite.playAnimation(6,11,true,100)
      } 
      else if (this.inputMap["d"]) {
        this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
        this.horizontalAxis = -1;
        this.player.sprite.playAnimation(12,17,true,100)
      }
      else {
          this.horizontal = 0;
          this.horizontalAxis = 0;
      }
    }
}