import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieMutation = {
  name: string;
  value: string;
  options?: Awaited<ReturnType<typeof cookies>> extends { set: (...args: infer Args) => unknown }
    ? Args[2]
    : never;
};

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieMutation[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot always mutate cookies during render.
          }
        }
      }
    }
  );
}
