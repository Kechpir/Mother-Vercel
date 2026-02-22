import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * GET /api/cabinet/purchases
 * Возвращает историю покупок текущего пользователя (по JWT).
 * - sessions: оплаченные «Энергетические сессии» + ссылка на Telegram при наличии
 * - protocols: оплаченные «Персональный энергетический протокол»
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser(token);

    if (userError || !user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.email.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabaseServiceKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const [sessionsRes, protocolsRes] = await Promise.all([
      supabase
        .from("participants")
        .select("id, created_at, telegram_invite_link")
        .ilike("email", email)
        .eq("payment_status", "paid")
        .order("created_at", { ascending: false }),
      supabase
        .from("protocol_orders")
        .select("id, created_at")
        .ilike("email", email)
        .eq("payment_status", "paid")
        .order("created_at", { ascending: false }),
    ]);

    if (sessionsRes.error) {
      console.error("cabinet/purchases participants error:", sessionsRes.error);
      return NextResponse.json({ error: "Failed to load purchases" }, { status: 500 });
    }
    if (protocolsRes.error) {
      console.error("cabinet/purchases protocol_orders error:", protocolsRes.error);
      return NextResponse.json({ error: "Failed to load purchases" }, { status: 500 });
    }

    const sessions = (sessionsRes.data || []).map((row) => ({
      id: row.id,
      created_at: row.created_at,
      telegram_invite_link: row.telegram_invite_link ?? null,
    }));

    const protocols = (protocolsRes.data || []).map((row) => ({
      id: row.id,
      created_at: row.created_at,
    }));

    return NextResponse.json({ sessions, protocols });
  } catch (e) {
    console.error("cabinet/purchases error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
