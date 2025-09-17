export class StoneError extends Error{
    constructor(private readonly params: {message: string, code: string}){
        super(params.message)
    }

    static invalidColor(message: string){
        throw new StoneError({message, code: "INVALID_COLOR"})
    }
}