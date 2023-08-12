"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

function Loading() {
  return (
    <section className="bg-black h-screen w-screen">
      <div className="container m-auto p-10 flex items-center justify-center h-full">
        <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
          <h1>Loading...</h1>
        </div>
      </div>
    </section>
  );
}

function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    router.push("/login");
  }

  if (status === "loading" || !session) {
    return <Loading />;
  }

  return (
    <section className="bg-black h-screen w-screen">
      <div className="container m-auto p-10 flex items-center justify-center h-full">
        <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
          <h1>Hi! {session.user?.name}!</h1>
          <h2>This is a private route for logged in users only!</h2>
          <button
            onClick={() => signOut()}
            className="p-2 border text-white border-white rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
