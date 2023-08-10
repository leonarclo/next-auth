"use client";
import React from "react";

function Dashboard() {
  return (
    <section className="bg-black h-screen w-screen">
      <div className="container m-auto p-10 flex items-center justify-center h-full">
        <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
          <h1>Hi! {}</h1>
          <h2>This is a private route for logged-in users only!</h2>
          <button
            onClick={() => {}}
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
