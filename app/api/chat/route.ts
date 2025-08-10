import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "Google Generative AI API key is missing",
        message:
          "Please set GOOGLE_GENERATIVE_AI_API_KEY in your .env.local file",
        system:
          "you are physics professors, that can explain any physics topic in a way that is easy to understand. You are also a good teacher, and you can explain complex concepts in a way that is easy to understand. You are also a good problem solver, and you can help with any physics problem and very good at maths.Your name is Denki, which means electricity in japanese",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const result = streamText({
      model: google("gemini-2.0-flash-exp"),
      system:
        "you are a physics teacher and you explain physics concepts in a way that is easy to understand. You are also a good problem solver, and you can help with any physics problem and very good at maths.Your name is Denki, which means electricity in japanese",
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
