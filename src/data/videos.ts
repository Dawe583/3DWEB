// Central video registry.
//
// Intro clips play large (the ScrollZoomSection transition into a section) so
// they're all plain mp4 at native ~1080p — no adaptive-bitrate ramp-up, so
// they're sharp from the first frame. Card clips play small, so the lower/
// adaptive-res Mux streams are reserved for there, where no resolution looks
// blurry.
export const VIDEOS = {
  introProcess: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4",
  introTestimonials: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_024928_1efd0b0d-6c02-45a8-8847-1030900c4f63.mp4",
  introShowcase: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_102933_4e8f73b5-775a-4179-b2fb-472f59063dcd.mp4",

  cardA: "https://stream.mux.com/BuGGTsiXq1T00WUb8qfURrHkTCbhrkfFLSv4uAOZzdhw.m3u8",
  cardB: "https://stream.mux.com/sDz01Os9GN02ltJvgikeaUvZWsLRiR5FX5GuadCRkQc7E.m3u8",
  cardC: "https://stream.mux.com/jPyJ2YM6Nlly7U6EyfxM01tz4D4uPE3gyJ4PYuvY62Wg.m3u8",
} as const;
