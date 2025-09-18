import { Stone } from "../stone/Stone";
import { StoneColor } from "../stone/types";
import { CellError } from "./CellError";

export class Cell{
    constructor(private readonly params: { row: number, col: number, stone?: Stone}) {
        if( params.row < 0 || params.row > 7){
            throw CellError.invalidCellValue("rowは0~7までの値が設定可能です。")
        }
        if( params.col < 0 || params.col > 7){
            throw CellError.invalidCellValue("colは0~7までの値が設定可能です。")
        }
    }

    get row(){
        return this.params.row
    }

    get col(){
        return this.params.col
    }

    get stone(){
        return this.params.stone
    }

    static reconstruct(params: {row: number, col: number, color?: StoneColor}){
        const stone = params.color ? Stone.reconstruct({ color: params.color }) : undefined
        return new Cell({row: params.row, col: params.col, stone})
    }
}