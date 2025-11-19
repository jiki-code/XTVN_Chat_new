"use client";
import { UsersManager } from "./UserManager";

export default function Page() {
  return (
    <>
      <main className="min-h-screen w-full p-6 md:p-10">
        <h1 className="text-2xl font-semibold mb-6">User management</h1>
        <UsersManager />
      </main>
    </>
  );
}
