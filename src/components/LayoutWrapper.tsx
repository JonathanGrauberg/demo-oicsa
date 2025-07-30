'use client';

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <div className="flex flex-col flex-1">
      {!isLoginPage && <Navbar />}
      <div className="flex">
        {!isLoginPage && <Sidebar />}
        <main className="p-4 w-full">{children}</main>
      </div>
    </div>
  );
}
