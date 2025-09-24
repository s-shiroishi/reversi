export class BoardError extends Error{
    constructor(private readonly params: {message: string, code: string}){
        super(params.message)
    }

    static placeStoneFailed(message: string){
        throw new BoardError({message, code: "PLACE_STONE_FAILED"})
    }

    static flipStonesFailed(message: string){
        throw new BoardError({message, code: "FLIP_STONES_FAILED"})
    }

    static countStonesFailed(message: string){
        throw new BoardError({message, code: "COUNT_STONES_FAILED"})
    }

    static getValidMovesFailed(message: string){
        throw new BoardError({message, code: "GET_VALID_MOVES_FAILED"})
    }
}