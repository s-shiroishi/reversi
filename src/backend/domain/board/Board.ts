import { Stone } from "../stone/Stone";
import { StoneColor } from "../types";
import { BoardError } from "./BoardError";

export type Position = { row: number; col: number };
export type ValidMove = {
    position: Position;
    flippableStones: Position[];
};

export class Board{
    constructor(private readonly params: {cells:( Stone | null)[][]}){}

    static create(): Board {
        const cells: (Stone | null)[][] = [];
        for (let row = 0; row < 8; row++) {
            cells[row] = [];
            for (let col = 0; col < 8; col++) {
                cells[row][col] = null;
            }
        }

        cells[3][3] = Stone.reconstruct({ color: "white" });
        cells[3][4] = Stone.reconstruct({ color: "black" });
        cells[4][3] = Stone.reconstruct({ color: "black" });
        cells[4][4] = Stone.reconstruct({ color: "white" });

        return new Board({ cells });
    }

    static reconstruct(params: { cells?: { row: number, col: number, color: string}[]}){
        const cells: (Stone | null)[][] = [];
        for (let row = 0; row < 8; row++){
            cells[row] = []
            for (let col = 0; col < 8; col++){
                cells[row][col] = null;
            }
        }
        params.cells?.forEach((cellData) => {
            cells[cellData.row][cellData.col] = Stone.reconstruct({color: cellData.color})
        })
        return new Board({cells})
    }

    get cells(){
        return this.params.cells
    }

    setStone(row: number, col: number, stone: Stone | null) {
        if (row < 0 || row > 7 || col < 0 || col > 7) {
            throw new Error("無効な座標です。");
        }
        this.cells[row][col] = stone;
    }

    getStone(row: number, col: number): Stone | null {
        if (row < 0 || row > 7 || col < 0 || col > 7) {
            throw new Error("無効な座標です。");
        }
        return this.cells[row][col];
    }

    isEmpty(row: number, col: number): boolean {
        if (row < 0 || row > 7 || col < 0 || col > 7) {
            throw new Error("無効な座標です。");
        }
        return this.cells[row][col] === null;
    }

    countStones(params: { color: StoneColor }) {
        try {
            return this.cells.flat().filter(stone => stone?.color === params.color).length;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "石を数えるのに失敗しました";
            throw BoardError.countStonesFailed(errorMessage);
        }
    }

    getValidMoves(params: { color: StoneColor }): ValidMove[] {
        const validMoves: ValidMove[] = [];
        const opponentColor = params.color === "black" ? "white" : "black";

        const directions = [
            [-1, 0], [-1, 1], [0, 1], [1, 1],
            [1, 0], [1, -1], [0, -1], [-1, -1]
        ];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.cells[row][col] !== null) continue;

                const flippableStones: Position[] = [];
                let isValidMove = false;

                for (const [dr, dc] of directions) {
                    const flippableStonesInDirection = this._getFlippableStonesInDirection({
                        row,
                        col,
                        dr,
                        dc,
                        myColor: params.color,
                        opponentColor
                    });
                    if (flippableStonesInDirection.length > 0) {
                        flippableStones.push(...flippableStonesInDirection);
                        isValidMove = true;
                    }
                }

                if (isValidMove) {
                    validMoves.push({
                        position: { row, col },
                        flippableStones
                    });
                }
            }
        }

        return validMoves;
    }

    private _getFlippableStonesInDirection(params:{
        row: number,
        col: number,
        dr: number,
        dc: number,
        myColor: StoneColor,
        opponentColor: StoneColor
    }): Position[] {
        const flippableStones: Position[] = [];
        let r = params.row + params.dr;
        let c = params.col + params.dc;

        if (r < 0 || r >= 8 || c < 0 || c >= 8 || this.cells[r][c]?.color !== params.opponentColor) {
            return [];
        }

        flippableStones.push({ row: r, col: c });

        r += params.dr;
        c += params.dc;

        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const stone = this.cells[r][c];
            if (stone === null) return [];
            if (stone.color === params.myColor) return flippableStones;
            flippableStones.push({ row: r, col: c });

            r += params.dr;
            c += params.dc;
        }

        return [];
    }
}