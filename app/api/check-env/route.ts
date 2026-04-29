export async function GET() {
  return new Response(JSON.stringify({
    groqKeySet: !!process.env.GROQ_API_KEY,
  }), {
    headers: { "Content-Type": "application/json" },
  })
}
