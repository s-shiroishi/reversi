import { ValidMove } from "../domain/board/Board";
import { GameStatus, StoneColor } from "../domain/types";

export interface GameDto{
    gameId: string;
    currentTurn: StoneColor;
    status: GameStatus;
    score: { black: number; white: number };
    validMoves: {
        valid: boolean;
        validMoves: ValidMove[];
    }
}