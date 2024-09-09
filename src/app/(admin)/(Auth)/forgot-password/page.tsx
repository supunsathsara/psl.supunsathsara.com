import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/SubmitButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message: string; error: string; code: string };
}) {
  const supabase = createClient();
  if (searchParams.code) {
    const { data: newSession, error: newSessionError } =
      await supabase.auth.exchangeCodeForSession(searchParams.code);

    if (newSessionError) {
      console.error("Could not authenticate user", newSessionError.message);
      return redirect(
        `/login?error=${encodeURIComponent(newSessionError.message)}`
      );
    }

    if (newSession.session) {
      await supabase.auth.setSession({
        access_token: newSession.session.access_token,
        refresh_token: newSession.session.refresh_token,
      });
    }
    return redirect("/dashboard");
  }

  const signIn = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const supabase = createClient();

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/forgot-password`,
    });

    if (error) {
      console.error("Could not authenticate user", error.message);
      return redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    if (data) {
      console.log("User authenticated", data);
      return redirect(`/login?message=check your email for the reset link`);
    }
  };

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to get a password reset link
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
          <SubmitButton pendingText="Sending..." className="w-full">
            Send
          </SubmitButton>
        </div>
      </form>
      <div className="mt-4 text-center text-sm">
        Remember password?{" "}
        <Link href="/login" className="underline">
          Login
        </Link>
      </div>
    </div>
  );
}
