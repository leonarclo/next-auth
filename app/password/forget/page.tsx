"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  email: string;
};

function Forget() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log({ data });

    const response = await fetch("/api/auth/forgetPassword", {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    try {
      if (response.ok) {
        console.log(response);
        router.push("/login");
      }
    } catch (error: any) {
      console.log("EROWW", error);
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
              <label>Email</label>
              <input
                className="bg-black border border-white rounded"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p>{errors.email.message}</p>}
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

export default Forget;
