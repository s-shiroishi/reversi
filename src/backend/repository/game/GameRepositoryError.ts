export class GameRepositoryError extends Error{
    constructor(private readonly params: {message: string, code: string}){
        super(params.message)
    }

    static createGameFailed(message: string){
        throw new GameRepositoryError({message, code: "CREATE_GAME_FAILED"})
    }
}