export async function GET() {
  return Response.json({
    groqKeySet: !!process.env.GROQ_API_KEY,
  })
}
