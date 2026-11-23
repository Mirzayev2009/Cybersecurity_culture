import courseContent from "../../../../data/course-content.json";
import { isFeedbackId, normalizeFeedback } from "@/lib/student-feedback.mjs";

export async function POST(request: Request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (data.contentVersion !== courseContent.version) {
    return Response.json({ code: "CONTENT_VERSION_MISMATCH" }, { status: 409 });
  }
  const feedback = normalizeFeedback(data.choice, data.message);
  if (!feedback || !isFeedbackId(data.id) || !["uz", "en"].includes(data.language)) {
    return Response.json({ code: "INVALID_FEEDBACK" }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key || !/^https:\/\//.test(url)) {
    return Response.json({ code: "FEEDBACK_UNAVAILABLE" }, { status: 503 });
  }
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/student_feedback?on_conflict=id`, {
      method: "POST",
      headers: {
        apikey: key,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify({
        id: data.id,
        content_version: courseContent.version,
        choice: feedback.choice,
        message: feedback.message,
        language: data.language,
      }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Feedback storage returned ${response.status}`);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ code: "FEEDBACK_SAVE_FAILED" }, { status: 502 });
  }
}
