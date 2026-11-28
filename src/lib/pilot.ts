/**
 * Open-pilot settings. During the open pilot BoardBrain has no logins, so features that need a real
 * teacher behind them ("Ask My Teacher") are replaced by a feedback link.
 *   NEXT_PUBLIC_OPEN_PILOT = "false"   -> turns the open-pilot mode off (when Nasra logins arrive)
 *   NEXT_PUBLIC_FEEDBACK_URL           -> e.g. a Google Form; without it, feedback goes by email
 */
export const OPEN_PILOT = process.env.NEXT_PUBLIC_OPEN_PILOT !== "false";

const CONTACT = "admin.nasra@nasraschool.edu.pk";

export function feedbackHref(subject = "BoardBrain feedback", body = ""): string {
  const url = process.env.NEXT_PUBLIC_FEEDBACK_URL;
  if (url) return url;
  return `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
