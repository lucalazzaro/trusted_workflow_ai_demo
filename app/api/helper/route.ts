import { NextResponse } from "next/server";
import { helperSuggest } from "@/lib/engine/helper";
import { RequestInput, InputCheckResult } from "@/lib/engine/inputCheck";
import { RulesResult } from "@/lib/engine/rules";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    input: RequestInput;
    check: InputCheckResult;
    rules: RulesResult;
  };

  const result = helperSuggest(body.input, body.check, body.rules);
  return NextResponse.json(result);
}
