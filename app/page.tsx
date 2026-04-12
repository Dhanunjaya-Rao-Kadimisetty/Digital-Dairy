import { AmbientParticles } from "@/components/backgrounds/ambient-particles";
import { LandingExperience } from "@/components/landing/landing-experience";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <>
      <AmbientParticles />
      <LandingExperience entryHref={user ? "/dashboard" : "/login"} />
    </>
  );
}
