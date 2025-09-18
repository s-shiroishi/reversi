import { generateId } from "@/backend/lib/generateId";
import { Cell } from "../cell/Cell";
import { StoneColor } from "../stone/types";

export class Board{
    constructor(private readonly params: { id: string, cells: Cell[][]}){}

    get id(){
        return this.params.id
    }

    get cells(){
        return this.params.cells
    }

    placeStone(params: { row: number, col: number, color: StoneColor}){

    }

    flipStones(params: { row: number, col: number, color: StoneColor}){

    }

    getValidMoves(params: { color: StoneColor}){

    }

    countStones(params: { color: StoneColor}){

    }

    isGameOver(){
        
    }

    static create(): Board {
        const id = generateId()
        const cells: Cell[][] = [];
        for (let row = 0; row < 8; row++) {
            cells[row] = [];
            for (let col = 0; col < 8; col++) {
                cells[row][col] = Cell.reconstruct({ row, col });
            }
        }

        // リバーシの初期配置
        cells[3][3] = Cell.reconstruct({ row: 3, col: 3, color: "white" });
        cells[3][4] = Cell.reconstruct({ row: 3, col: 4, color: "black" });
        cells[4][3] = Cell.reconstruct({ row: 4, col: 3, color: "black" });
        cells[4][4] = Cell.reconstruct({ row: 4, col: 4, color: "white" });

        return new Board({ id, cells });
    }

    static reconstruct(params: { id: string, cells: { row: number, col: number, color: StoneColor}[]}){
        const cells: Cell[][] = [];
        for (let row = 0; row < 8; row++){
            cells[row] = []
            for (let col = 0; col < 8; col++){
                cells[row][col] = Cell.reconstruct({row, col})
            }
        }
        params.cells.forEach((cellData) => {
            cells[cellData.row][cellData.col] = Cell.reconstruct(cellData)
        })
        return new Board({id: params.id, cells})
    }
}