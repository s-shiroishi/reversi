import { Stone } from "../stone/Stone";
import { StoneColor } from "../types";
import { Board } from "./Board";
import { BoardError } from "./BoardError";

export class BoardService {
    placeStone(params: {board: Board, position: { row: number, col: number }, color: StoneColor}) {
        try {
            if (params.position.row < 0 || params.position.row > 7 || params.position.col < 0 || params.position.col > 7) {
                throw BoardError.placeStoneFailed("無効な座標です。");
            }
            if (params.board.cells[params.position.row][params.position.col] !== null) {
                throw BoardError.placeStoneFailed("すでに石が置かれています。");
            }
            params.board.setStone(params.position.row, params.position.col, Stone.reconstruct({ color: params.color }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "石を置くのに失敗しました";
            throw BoardError.placeStoneFailed(errorMessage);
        }
    }

    flipStones(params: { board: Board, positions: { row: number, col: number }[], color: StoneColor }) {
        try {
            for (const pos of params.positions) {
                if (pos.row < 0 || pos.row > 7 || pos.col < 0 || pos.col > 7) {
                    throw BoardError.flipStonesFailed("無効な座標です。");
                }
                if (params.board.cells[pos.row][pos.col] === null) {
                    throw BoardError.flipStonesFailed("石が置かれていません。");
                }
                if (params.board.cells[pos.row][pos.col]?.color === params.color) {
                    throw BoardError.flipStonesFailed("自分の石はひっくり返せません。");
                }
                params.board.setStone(pos.row, pos.col, Stone.reconstruct({ color: params.color }));
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "石をひっくり返すのに失敗しました";
            throw BoardError.flipStonesFailed(errorMessage);
        }
    }
}