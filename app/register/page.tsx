"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  name: string;
  email: string;
  password: string;
};

function Register() {
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  function CreatingUser() {
    return (
      <h2 className="text-center text-xl">
        Please wait! Your account is being created...
      </h2>
    );
  }

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    setIsCreatingUser(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ data }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        alert("Register Successfull!");
        router.push("/login");
      } else {
        alert("User already exists");
      }
    } catch (error) {
      console.log(error);
    }
    setIsCreatingUser(false);
  };

  return (
    <section className="bg-black h-screen w-sreen">
      <div className="container m-auto p-10 flex items-center justify-center h-full">
        <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
          <h1 className="text-center text-xl">Register</h1>
          {isCreatingUser ? (
            <CreatingUser />
          ) : (
            <>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col">
                  <label>Name</label>
                  <input
                    className="bg-black border border-white rounded"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <p>{errors.name.message}</p>}
                </div>
                <div className="flex flex-col">
                  <label>Email</label>
                  <input
                    className="bg-black border border-white rounded"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && <p>{errors.email.message}</p>}
                </div>
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
                <button
                  type="submit"
                  className="p-2 border border-white rounded"
                >
                  Submit
                </button>
              </form>
              <Link href={"/login"}>Go to Login</Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Register;
