import { StartGame } from "@/backend/application/game/StartGame";
import { GameRepository } from "@/backend/repository/game/GameRepository";
import { NextResponse } from "next/server";

export async function GET(){
  try {
    const repository = new GameRepository();
    const usecase = new StartGame(repository);

    const result = await usecase.execute();

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