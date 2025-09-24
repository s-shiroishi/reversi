export class GameError extends Error{
    constructor(private readonly params: {message: string, code: string}){
        super(params.message)
    }

    static invalidId(message: string){
        throw new GameError({message, code: "INVALID_ID"})
    }

    static isGameOverFailed(message: string){
        throw new GameError({message, code: "IS_GAME_OVER_FAILED"})
    }

    static getWinnerFailed(message: string){
        throw new GameError({message, code: "GET_WINNER_FAILED"})
    }
}