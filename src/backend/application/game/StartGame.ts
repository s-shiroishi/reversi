import { Game } from "@/backend/domain/game/Game";
import { IGameRepository } from "@/backend/repository/game/GameRepository";

export class StartGame{
    constructor(private readonly repositroy: IGameRepository){}

    async execute(){
        const game = Game.create()
        return await this.repositroy.create(game);
    }
}