import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, full_name, city, age, phone, email } = body;

    if (!full_name?.trim() || !phone?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "ФИО, телефон и email обязательны" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Конфигурация недоступна" }, { status: 500 });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase.from("registered_members").insert([
      {
        full_name: full_name.trim(),
        city: (city ?? "").trim() || null,
        age: (age ?? "").trim() || null,
        phone: phone.trim(),
        email: email.trim(),
      },
    ]);

    if (error) {
      console.error("Register member error:", error);
      return NextResponse.json({ error: "Не удалось сохранить данные" }, { status: 500 });
    }

    // Чтобы зарегистрированные пользователи попадали в «Все пользователи» админки,
    // создаём запись в profiles (админка читает из profiles). Нужен service role из‑за RLS.
    if (user_id && serviceRoleKey) {
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
      await supabaseAdmin.from("profiles").upsert(
        {
          id: user_id,
          full_name: full_name.trim() || null,
          phone: phone.trim() || null,
          city: (city ?? "").trim() || null,
          age: (age ?? "").trim() || null,
        },
        { onConflict: "id" }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Register API error:", e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
