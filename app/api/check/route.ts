import { NextResponse } from "next/server";
import { runInputCheck, RequestInput } from "@/lib/engine/inputCheck";

export async function POST(req: Request) {
  const input = (await req.json()) as RequestInput;
  const result = runInputCheck(input);
  return NextResponse.json(result);
}
