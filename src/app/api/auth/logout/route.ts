import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout exitoso" });
  
  // 🔹 Limpiar la cookie
  response.cookies.set({
    name: "token",
    value: "",
    expires: new Date(0), // Expira inmediatamente
    path: "/",
  });

  return response;
}
