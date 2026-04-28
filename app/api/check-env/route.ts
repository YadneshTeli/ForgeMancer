export async function GET() {
  return Response.json({
    geminiKeySet: !!process.env.GEMINI_API_KEY,
  })
}
