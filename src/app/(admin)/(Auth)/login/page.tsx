import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import SubmitButton from "@/components/SubmitButton";


export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message: string; error: string };
}) {

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/admin");
  }

  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Could not authenticate user", error.message);
      return redirect(`/login?error=${encodeURIComponent(error.message)}`); 
    }

    return redirect("/admin");
  };

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-balance text-muted-foreground">
         Admins only
        </p>
      </div>
      <form action={signIn}>
        {searchParams.message && (
          <div className="bg-green-200/80 mb-4 text-green-800 p-2 rounded">
            {searchParams.message}
          </div>
        )}

        {searchParams.error && (
          <div className="bg-red-100 mb-4 text-red-800 p-2 rounded">
            {searchParams.error.split(", ").map((err, index) => (
              <div key={index}>{err}</div>
            ))}
          </div>
        )}

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input id="password" name="password" type="password" required />
          </div>
          <SubmitButton pendingText="Logging in" className="w-full">
            Login
          </SubmitButton>
        </div>
      </form>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
