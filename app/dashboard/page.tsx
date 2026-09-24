import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import LogoutButton from "./logout-button";
import ThemeToggle from "./theme-toggle";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  // baca preferensi dari cookie, default 'light'
  const theme = cookieStore.get("theme")?.value ?? "light";

  return (
    <div data-theme={theme} style={{ minHeight: "100vh", padding: 16 }}>
      <div>
        <h1>Dashboard</h1>
        <ThemeToggle currentTheme={theme} />
        <LogoutButton />
      </div>

      <p>Login sebagai: {user?.email}</p>
      <p>Tema saat ini: {theme}</p>

      {error && <p>Gagal ambil data: {error.message}</p>}

      <table border={1}>
        <thead>
          <tr>
            <th>Tipe</th>
            <th>Jumlah</th>
            <th>Deskripsi</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((t) => (
            <tr key={t.id}>
              <td>{t.type}</td>
              <td>{t.amount}</td>
              <td>{t.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}