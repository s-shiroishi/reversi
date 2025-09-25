import { BoardService } from "@/backend/domain/board/BoardService";
import { IGameRepository } from "@/backend/repository/game/GameRepository";

export class ContinueGame{
    constructor(private readonly repository: IGameRepository, private readonly service: BoardService){}

    async execute(params: {gameId: string, move: {row: number, col: number}, flippedPositions: {row: number, col: number}[]}) {
        const game = await this.repository.findById(params.gameId);

        this.service.placeStone({board: game.board, position: params.move, color: game.currentTurn});
        this.service.flipStones({board: game.board, positions: params.flippedPositions, color: game.currentTurn});

        if (game.isGameOver()) {
            game.endGame();
        } else {
            game.switchTurn();
        }

        const updatedGame = await this.repository.update(game);
        return {
            gameId: updatedGame.id,
            status: updatedGame.status,
            score: {black: updatedGame.board.countStones({color: 'black'}), white: updatedGame.board.countStones({color: 'white'})},
            currentTurn: updatedGame.currentTurn,
            validMoves: updatedGame.hasValidMoves(updatedGame.currentTurn)
        }
    }
}