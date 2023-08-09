"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  password: string;
  password2: string;
};

function Recovery() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const userId = searchParams.get("identifier");
  const token = searchParams.get("token");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);

    if (data.password !== data.password2) {
      alert("Passwords must match!");
    } else {
      const response = await fetch(`/api/forgot/${userId}/?token=${token}`, {
        method: "PATCH",
        body: JSON.stringify(data.password),
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
                {...register("password2", {
                  required: "Password confirmation is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password2 && <p>{errors.password2.message}</p>}
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

export default Recovery;
