import { ContinueGame } from "@/backend/application/game/ContinueGame";
import { BoardService } from "@/backend/domain/board/BoardService";
import { GameRepository } from "@/backend/repository/game/GameRepository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
  try {
      const { gameId, move, flippedPositions } = await request.json();

    const repository = new GameRepository();
    const service = new BoardService();
    const usecase = new ContinueGame(repository, service);

    const result = await usecase.execute({ gameId, move, flippedPositions });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      const response: any = {
        message: error.message,
      };

      if ("code" in error) {
        response.code = error.code;
      }
      if ("name" in error) {
        response.name = error.name;
      } else {
        response.status = 500;
      }
      return NextResponse.json(response);
    }
  }
  return NextResponse.json({
    message: "ゲームの開始に失敗しました。",
    status: 500,
  });
}