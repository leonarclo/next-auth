"use client";
import React from "react";
import { useSession } from "next-auth/react";

function Dashboard() {
  const { data: session, status } = useSession();
  console.log(session);

  return (
    <div>
      <h1>Hi! {session?.user?.name}</h1>
    </div>
  );
}

export default Dashboard;
