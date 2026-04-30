export async function POST(request: Request) {
  const { email } = await request.json();

  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      email,
      listIds: [3],
      updateEnabled: true,
    }),
  });

  const text = await response.text();
  console.log("Brevo status:", response.status);
  console.log("Brevo response:", text);

  if (response.ok || response.status === 204) {
    return Response.json({ success: true });
  } else {
    return Response.json({ success: false }, { status: 500 });
  }
}