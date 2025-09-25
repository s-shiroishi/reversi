export class GameRepositoryError extends Error{
    constructor(private readonly params: {message: string, code: string}){
        super(params.message)
    }

    static createGameFailed(message: string){
        throw new GameRepositoryError({message, code: "CREATE_GAME_FAILED"})
    }

    static findByIdFailed(message: string){
        throw new GameRepositoryError({message, code: "FIND_BY_ID_FAILED"})
    }

    static updateFailed(message: string){
        throw new GameRepositoryError({message, code: "UPDATE_FAILED"})
    }
}