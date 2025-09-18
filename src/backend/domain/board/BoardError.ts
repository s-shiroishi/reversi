export class BoardError extends Error{
    constructor(private readonly params: {message: string, code: string}){
        super(params.message)
    }

    static invalidCellValue(message: string){
        throw new BoardError({message, code: "INVALID_CELL_VALUE"})
    }
}