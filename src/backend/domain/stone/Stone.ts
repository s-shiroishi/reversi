import { StoneError } from "./StoneError"

export class Stone{
    private VALID_NAMES = ["black", "white"]
    constructor(private _color: string){
        if(!this.VALID_NAMES.includes(_color)){
            throw StoneError.invalidColor("石の色はblackまたはwhiteしか使用できません。")
        }
    }

    get color(){
        return this._color;
    }

    static reconstruct(color: string){
        return new Stone(color)
    }
}