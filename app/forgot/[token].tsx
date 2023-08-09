"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSession, signOut, signIn } from "next-auth/react";

type Inputs = {
  email: string;
  password: string;
};

function Forgot() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);

    const newPassword = {
      tokenId: router.query.token,
      password: data.password,
    };

    const response = await fetch("/api/forgot", {
      method: "PUT",
      body: JSON.stringify(newPassword),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    try {
      const responseInfo = await response.json();
      console.log(responseInfo);
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="bg-black h-screen w-sreen">
      <div className="container m-auto p-10 flex items-center justify-center h-full">
        <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
          <h1 className="text-center text-xl">Reset password</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col">
              <label>Password</label>
              <input
                className="bg-black border border-white rounded"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && <p>{errors.password.message}</p>}
            </div>
            <div className="flex flex-col">
              <label>Confirm Password</label>
              <input
                className="bg-black border border-white rounded"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && <p>{errors.password.message}</p>}
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

export default Forgot;
