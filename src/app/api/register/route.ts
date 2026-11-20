import directory from "../../../../data/uzbekistan-schools.json";
import answerKey from "../../../../data/answer-key.json";

type Submission = {
  regionId: number;
  districtId: number;
  schoolId: number;
  className: string;
  firstName: string;
  lastName: string;
  answers: number[];
};

export async function POST(request: Request) {
  let data: Submission;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const region = directory.regions.find((item) => item.id === data.regionId);
  const district = directory.districts.find(
    (item) => item.id === data.districtId && item.regionId === region?.id,
  );
  const school = directory.schools.find(
    (item) => item.id === data.schoolId && item.districtId === district?.id,
  );
  const firstName = typeof data.firstName === "string" ? data.firstName.trim() : "";
  const lastName = typeof data.lastName === "string" ? data.lastName.trim() : "";
  const className = typeof data.className === "string" ? data.className.trim() : "";
  if (
    !school ||
    !Array.isArray(data.answers) ||
    data.answers.length !== 20 ||
    data.answers.some((answer) => !Number.isInteger(answer) || answer < 0 || answer > 3) ||
    !firstName || firstName.length > 80 ||
    !lastName || lastName.length > 80 ||
    !className || className.length > 20
  ) {
    return Response.json({ error: "Check the registration details and try again." }, { status: 400 });
  }

  const score = data.answers.filter((answer, index) => answer === answerKey[index]).length;
  if (score < 16) {
    return Response.json({ error: "Registration requires at least 16 correct answers out of 20." }, { status: 403 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key || !/^https:\/\//.test(url)) {
    return Response.json({ error: "Registration is not configured yet. Please try again later." }, { status: 503 });
  }

  try {
    const result = await fetch(`${url.replace(/\/$/, "")}/rest/v1/registrations`, {
      method: "POST",
      headers: {
        apikey: key,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        region_id: data.regionId,
        district_id: data.districtId,
        school_id: data.schoolId,
        class_name: className,
        first_name: firstName,
        last_name: lastName,
        score,
      }),
      cache: "no-store",
    });
    if (!result.ok) throw new Error(`Supabase returned ${result.status}`);
    return Response.json({ ok: true, score });
  } catch (error) {
    console.error("Registration failed:", error);
    return Response.json({ error: "Registration could not be saved. Please try again." }, { status: 502 });
  }
}
