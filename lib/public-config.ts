export const publicConfig = {
  intro: {
    durationMs: Number(process.env.NEXT_PUBLIC_SPLASH_DURATION_MS || "45000"),
    personOneName: process.env.NEXT_PUBLIC_SPLASH_PERSON_ONE_NAME || "You",
    personTwoName: process.env.NEXT_PUBLIC_SPLASH_PERSON_TWO_NAME || "Your Sister",
    personOneImage: process.env.NEXT_PUBLIC_SPLASH_PERSON_ONE_IMAGE || "",
    personTwoImage: process.env.NEXT_PUBLIC_SPLASH_PERSON_TWO_IMAGE || "",
    quoteLineOne:
      process.env.NEXT_PUBLIC_SPLASH_QUOTE_LINE_ONE ||
      "Some memories are written so they can be held again later.",
    quoteLineTwo:
      process.env.NEXT_PUBLIC_SPLASH_QUOTE_LINE_TWO ||
      "Some are written just to be shared with one safe person."
  }
};
