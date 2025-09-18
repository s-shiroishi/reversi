import { StoneError } from "./StoneError"

export class Stone{
    private VALID_NAMES = ["black", "white"]
    constructor(private readonly params: {color: string}){
        if(!this.VALID_NAMES.includes(params.color)){
            throw StoneError.invalidColor("石の色はblackまたはwhiteしか使用できません。")
        }
    }

    get color(){
        return this.params.color;
    }

    static reconstruct(params: { color: string }){
        return new Stone({color: params.color})
    }
}