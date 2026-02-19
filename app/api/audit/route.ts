import { NextResponse } from "next/server";
import { appendEvent, clearEvents, listEvents } from "@/lib/audit/store";
import { AuditEvent } from "@/lib/audit/types";

export async function GET() {
  return NextResponse.json({ events: listEvents() });
}

export async function POST(req: Request) {
  const event = (await req.json()) as AuditEvent;
  appendEvent(event);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  clearEvents();
  return NextResponse.json({ ok: true });
}
