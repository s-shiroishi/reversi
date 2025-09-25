import { Board } from "../board/Board";
import { GameStatus, StoneColor } from "../types";
import { GameError } from "./GameError";

export class Game{
    constructor(private readonly params: { id: string, board: Board, currentTurn: StoneColor, status: GameStatus}){
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if(!uuidRegex.test(params.id)){
            throw GameError.invalidId("ゲームIDが有効なUUID形式ではありません。")
        }
    }

    static create(){
        const id = crypto.randomUUID()
        const startColor: StoneColor = Math.random() < 0.5 ? "black" : "white"
        const board = Board.create()
        return new Game({id, board, currentTurn: startColor, status: "playing"})
    }

    static reconstruct(params: { id: string, cells: { row: number, col: number, color: string}[], currentTurn: StoneColor, status: GameStatus}){
        const board = Board.reconstruct({cells: params.cells})
        return new Game({id: params.id, board, currentTurn: params.currentTurn, status: params.status})
    }

    get id(){
        return this.params.id
    }

    get board(){
        return this.params.board
    }

    get currentTurn(){
        return this.params.currentTurn
    }

    get status(){
        return this.params.status
    }

    endGame(){
        this.params.status = "finished"
    }

    switchTurn(){
        this.params.currentTurn = this.params.currentTurn === "black" ? "white" : "black"
    }

    getWinner(){
        const blackCount = this.board.countStones({ color: "black" });
        const whiteCount = this.board.countStones({ color: "white" });

        if (blackCount > whiteCount) {
            return {winner: "black", blackCount, whiteCount};
        } else if (whiteCount > blackCount) {
            return {winner: "white", blackCount, whiteCount};
        } else {
            return {winner: "draw", blackCount, whiteCount};
        }
    }

    isGameOver(): boolean {
        const blackMoves = this.board.getValidMoves({ color: "black" });
        const whiteMoves = this.board.getValidMoves({ color: "white" });
        return blackMoves.length === 0 && whiteMoves.length === 0;
    }

    hasValidMoves(color: "black" | "white"){
        const validMoves = this.board.getValidMoves({ color });
        const isValid = validMoves.length > 0
        return {valid: isValid, validMoves: validMoves}
    }
}