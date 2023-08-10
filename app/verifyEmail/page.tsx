"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function VerifyEmail() {
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");

    const verifyEmailUser = async () => {
      try {
        const response = await fetch("/api/verifyEmail", {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          alert(response);
          router.push("/login");
        }
      } catch (error: any) {
        console.log("EROWW", error);
      }
    };
    verifyEmailUser();
  }, [router, token]);

  return (
    <section className="bg-black h-screen w-sreen">
      <div className="container m-auto p-10 flex items-center justify-center h-full">
        <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
          <h1 className="text-center text-xl">Email Verified!</h1>
          <div className="flex flex-col gap-4">
            <Link href={"/login"}>Go to Login</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VerifyEmail;
