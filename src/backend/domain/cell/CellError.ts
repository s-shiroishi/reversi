export class CellError extends Error{
    constructor(private readonly params: {message: string, code: string}){
        super(params.message)
    }

    static invalidCellValue(message: string){
        throw new CellError({message, code: "INVALID_CELL_VALUE"})
    }
}