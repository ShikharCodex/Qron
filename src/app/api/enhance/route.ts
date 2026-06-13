import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "A valid prompt is required" },
        { status: 400 },
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `You are an expert prompt engineer.
Your job is to transform short, vague, or incomplete prompts into highly detailed, structured, and professional prompts.
Rules:
- Preserve the user's original intent.
- Improve clarity.
- Add relevant context.
- Add constraints.
- Add output requirements.
- Make the prompt significantly better.
- Return only the enhanced prompt.
- Do not explain your reasoning.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const enhancedPrompt = completion.choices[0]?.message?.content?.trim();

    if (!enhancedPrompt) {
      throw new Error("No response generated from OpenAI");
    }

    return NextResponse.json({ enhancedPrompt }, { status: 200 });
  } catch (error: any) {
    console.error("Enhancement Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to enhance prompt. Please try again." },
      { status: 500 },
    );
  }
}
