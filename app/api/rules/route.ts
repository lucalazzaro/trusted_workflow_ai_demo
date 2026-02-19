import { NextResponse } from "next/server";
import { applyRules } from "@/lib/engine/rules";
import { RequestInput, InputCheckResult } from "@/lib/engine/inputCheck";

export async function POST(req: Request) {
  const body = (await req.json()) as { input: RequestInput; check: InputCheckResult };
  const result = applyRules(body.input, body.check);
  return NextResponse.json(result);
}
