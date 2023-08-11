"use client";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Dashboard() {
  const router = useRouter();
  const { userData } = useContext(UserContext);

  const signOut = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "GET",
      });
      console.log(response);
      router.push("/login");
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <section className="bg-black h-screen w-screen">
      <div className="container m-auto p-10 flex items-center justify-center h-full">
        <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
          {userData ? <h1>Hi {userData.name}</h1> : <h2>Loading...</h2>}
          <h2>This is a private route for logged-in users only!</h2>
          <button
            onClick={signOut}
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
