export function useWeatherAgent() {
  const endpoint =
    "https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream";

  async function* streamWeather({ content }) {
    const payload = {
      messages: [{ role: "user", content }],
      runId: "weatherAgent",
      maxRetries: 2,
      maxSteps: 5,
      temperature: 0.5,
      topP: 1,
      runtimeContext: {},
      threadId: "7", // ✅ fixed roll number
      resourceId: "weatherAgent",
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        "x-mastra-dev-playground": "true",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok || !res.body) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const prefix = line[0];
          const jsonStr = line.slice(2);
          const data = JSON.parse(jsonStr);

          if (prefix === "0") {
            yield data; // ✅ only text tokens
          }
        } catch (err) {
          console.warn("Parse error:", line, err);
        }
      }
    }
  }

  return { streamWeather };
}
