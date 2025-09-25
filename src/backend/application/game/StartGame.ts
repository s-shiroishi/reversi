import { Game } from "@/backend/domain/game/Game";
import { IGameRepository } from "@/backend/repository/game/GameRepository";
import { GameDto } from "../types";

export class StartGame{
    constructor(private readonly repository: IGameRepository){}

    async execute(): Promise<GameDto>{
        const game = Game.create()
        const createdGame = await this.repository.create(game);
        return {
            gameId: createdGame.id,
            status: createdGame.status,
            score: {black: createdGame.board.countStones({color: 'black'}), white: createdGame.board.countStones({color: 'white'})},
            currentTurn: createdGame.currentTurn,
            validMoves: createdGame.hasValidMoves(createdGame.currentTurn)
        }
    }
}