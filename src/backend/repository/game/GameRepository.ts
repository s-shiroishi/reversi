import { Game } from "@/backend/domain/game/Game";
import { getDBClient } from "@/backend/utils/db";
import { Pool, QueryResult } from "pg";
import { GameRepositoryError } from "./GameRepositoryError";

export interface IGameRepository{
    create(game: Game): Promise<Game>
}

export class GameRepository{
    private client: Pool;
    constructor() {
        this.client = getDBClient();
    }

    async create(game: Game){
        try{
            const _createdGame = await this.client.query(`INSERT INTO games (id, status, turn, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *`, [game.id, game.status, game.currentTurn]);

            const createdGame = _createdGame.rows[0];
            if(!createdGame) {
                throw new Error("Game作成に失敗しました。");
            }

            const stoneInsertPromises: Promise<QueryResult<any>>[] = [];
            game.board.cells.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    if(cell){
                        stoneInsertPromises.push(
                            this.client.query(
                                `INSERT INTO stones (game_id, row, col, color, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
                                [game.id, rowIndex, colIndex, cell.color]
                            )
                        );
                    }
                });
            });

            await Promise.all(stoneInsertPromises);
            return game;
        }catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Game作成エラー";
            throw GameRepositoryError.createGameFailed(errorMessage);
        }
    }
}