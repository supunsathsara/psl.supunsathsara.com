import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import SubmitButton from "@/components/SubmitButton";

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(9, "Phone number must be at least 9 characters"),
});

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { message: string; error: string };
}) {

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    if (password !== confirmPassword) {
      return redirect("/register?error=Passwords do not match");
    }

    const supabase = createClient();

    console.log("email", email);
    console.log("password", password);
    console.log("name", name);
    console.log("phone", phone);

    //validate
    const validation = SignUpSchema.safeParse({
      email,
      password,
      name,
      phone,
    });

    if (validation.error) {
      const errorMessages = validation.error.errors
        .map((err) => err.message)
        .join(", ");
      console.log("errors", errorMessages);
      return redirect(`/register?error=${encodeURIComponent(errorMessages)}`);
    }

    //! DEBUG: TIMEOUT
    // await new Promise((resolve) => setTimeout(resolve, 5000));

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          role: "event-manager",
          mobile: phone,
          full_name: name,
        },
      },
    });

    if (error) {
      console.error("error", error);
      return redirect(`/register?error=${encodeURIComponent(error.message)}`);
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Register</h1>
        <p className="text-balance text-muted-foreground">
          Get Started
        </p>
      </div>
      <form action={signUp}>
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="John Doe"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              name="phone"
              placeholder="0712345678"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
            </div>
            <Input
              id="password"
              name="confirmPassword"
              type="password"
              required
            />
          </div>
          <SubmitButton pendingText="Signing Up..." className="w-full">
            Register
          </SubmitButton>
        </div>
      </form>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Login
        </Link>
      </div>
    </div>
  );
}
