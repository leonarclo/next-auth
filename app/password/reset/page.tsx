"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  newPassword: string;
  newPassword2: string;
};

function ResetPasswod() {
  const router = useRouter();
  const [token, setToken] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data, token);

    if (data.newPassword !== data.newPassword2) {
      alert("Passwords must match!");
    } else {
      const response = await fetch("/api/resetPassword", {
        method: "POST",
        body: JSON.stringify({ data, token }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      try {
        if (response.ok) {
          console.log(response);
          router.push("/login");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <section className="bg-black h-screen w-sreen">
      <div className="container m-auto p-10 flex items-center justify-center h-full">
        <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
          <h1 className="text-center text-xl">Reset Password</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col">
              <label>New Password</label>
              <input
                className="bg-black border border-white rounded"
                type="password"
                {...register("newPassword", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.newPassword && <p>{errors.newPassword.message}</p>}
            </div>
            <div className="flex flex-col">
              <label>Confirm New Password</label>
              <input
                className="bg-black border border-white rounded"
                type="password"
                {...register("newPassword2", {
                  required: "Password confirmation is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.newPassword2 && <p>{errors.newPassword2.message}</p>}
            </div>
            <button type="submit" className="p-2 border border-white rounded">
              Submit
            </button>
          </form>
          <div className="flex flex-col gap-4">
            <Link href={"/login"}>Go to Login</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResetPasswod;
