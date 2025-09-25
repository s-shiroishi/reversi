import { Game } from "@/backend/domain/game/Game";
import { getDBClient } from "@/backend/utils/db";
import { Pool, QueryResult } from "pg";
import { GameRepositoryError } from "./GameRepositoryError";

export interface IGameRepository{
    create(game: Game): Promise<Game>
    update(game: Game): Promise<Game>
    findById(id: string): Promise<Game>
}

export class GameRepository implements IGameRepository{
    private client: Pool;
    constructor() {
        this.client = getDBClient();
    }

    async create(game: Game): Promise<Game>{
        try{
            const stone = await this.client.query(`SELECT * FROM stones Where color = $1`, [game.currentTurn]);
            if(stone.rowCount === 0){
                throw new Error(`石: ${game.currentTurn}が存在しません。`);
            }
            const stoneId = stone.rows[0].id;
            const _createdGame = await this.client.query(`INSERT INTO games (id, status, turn, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *`, [game.id, game.status, stoneId]);

            const createdGame = _createdGame.rows[0];
            if(!createdGame) {
                throw new Error("Game作成に失敗しました。");
            }
            const stoneInsertPromises: Promise<QueryResult<any>>[] = [];
            for (let rowIndex = 0; rowIndex < game.board.cells.length; rowIndex++) {
                for (let colIndex = 0; colIndex < game.board.cells[rowIndex].length; colIndex++) {
                    const cell = game.board.cells[rowIndex][colIndex];
                    if(cell){
                        const stone = await this.client.query(`SELECT * FROM stones Where color = $1`, [cell.color]);
                        if(stone.rowCount === 0){
                            throw new Error(`石: ${cell.color}が存在しません。`);
                        }
                        const stoneId = stone.rows[0].id;
                        stoneInsertPromises.push(
                            this.client.query(
                                `INSERT INTO move (game_id, row, col, stone_id, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
                                [game.id, rowIndex, colIndex, stoneId]
                            )
                        );
                    }
                }
            }

            await Promise.all(stoneInsertPromises);
            return game;
        }catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Game作成エラー";
            throw GameRepositoryError.createGameFailed(errorMessage);
        }
    }

    async update(game: Game): Promise<Game>{
        try{
            const stone = await this.client.query(`SELECT * FROM stones Where color = $1`, [game.currentTurn]);
            if(stone.rowCount === 0){
                throw new Error(`石: ${game.currentTurn}が存在しません。`);
            }
            const stoneId = stone.rows[0].id;
            const updatedGameResult = await this.client.query(`UPDATE games SET status = $1, turn = $2 WHERE id = $3 RETURNING *`, [game.status, stoneId, game.id]);
            if(updatedGameResult.rowCount === 0){
                throw new Error(`ID: ${game.id}のゲームが存在しません。`);
            }
            await this.client.query(`DELETE FROM move WHERE game_id = $1`, [game.id]);
            const stoneInsertPromises: Promise<QueryResult<any>>[] = [];
            for (let rowIndex = 0; rowIndex < game.board.cells.length; rowIndex++) {
                for (let colIndex = 0; colIndex < game.board.cells[rowIndex].length; colIndex++) {
                    const cell = game.board.cells[rowIndex][colIndex];
                    if(cell){
                        const stone = await this.client.query(`SELECT * FROM stones Where color = $1`, [cell.color]);
                        if(stone.rowCount === 0){
                            throw new Error(`石: ${cell.color}が存在しません。`);
                        }
                        const stoneId = stone.rows[0].id;
                        stoneInsertPromises.push(
                            this.client.query(
                                `INSERT INTO move (game_id, row, col, stone_id, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
                                [game.id, rowIndex, colIndex, stoneId]
                            )
                        );
                    }
                }
            }

            await Promise.all(stoneInsertPromises);
            return game;
        }catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Game更新エラー";
            throw GameRepositoryError.updateFailed(errorMessage);
        }
    }

    async findById(id: string): Promise<Game>{
        try{
            const gameResult = await this.client.query(`SELECT g.id, g.status, s.color as turn FROM games g JOIN stones s ON g.turn = s.id WHERE g.id = $1`, [id]);
            if(gameResult.rowCount === 0){
                throw Error(`ID: ${id}のゲームが存在しません。`);
            }
            const gameRow = gameResult.rows[0];
            const movesResult = await this.client.query(`SELECT m.row, m.col, s.color FROM move m JOIN stones s ON m.stone_id = s.id WHERE m.game_id = $1`, [id]);
            const moves = movesResult.rows.map(row => ({
                row: row.row,
                col: row.col,
                color: row.color
            }));
            const game = Game.reconstruct({
                id: gameRow.id,
                status: gameRow.status,
                currentTurn: gameRow.turn,
                cells: moves
            });
            return game;
        }catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Game取得エラー";
            throw GameRepositoryError.findByIdFailed(errorMessage);
        }
    }
}