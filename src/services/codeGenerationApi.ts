const GENERATION_URL = "https://backendapi.dynamooai.org/api/manim/generate";

export const codeGenerationApi = {
  async generateCode(prompt: string) {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(GENERATION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.body) {
      throw new Error("No response body received");
    }

    return this.processStreamingResponse(response.body);
  },

  async processStreamingResponse(body: ReadableStream<Uint8Array>) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";
    let extractedJobId = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        fullResponse += text;

        // Extract job ID from the response
        const jobIdMatch = text.match(/Job ID: ([0-9a-f-]+)/);
        if (jobIdMatch && jobIdMatch[1]) {
          extractedJobId = jobIdMatch[1];
        }
      }

      return {
        jobId: extractedJobId,
        fullResponse,
      };
    } finally {
      reader.releaseLock();
    }
  },
};
