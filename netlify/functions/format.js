exports.handler = async (event) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const { input, docType, lang } = JSON.parse(event.body || "{}");

    if (!input || !input.trim()) {
      clearTimeout(timeout);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing input" }),
      };
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "You are FormatFlow, a professional document formatter. Return only the finished formatted document text.",
        messages: [
          {
            role: "user",
            content: `Document type: ${docType || "General"}\nLanguage: ${lang || "English"}\n\n${input}`,
          },
        ],
      }),
    });

    const rawText = await response.text();
    let data;

    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      clearTimeout(timeout);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Invalid response from formatter service" }),
      };
    }

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: data.error?.message || data.error || "Formatter request failed",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    clearTimeout(timeout);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.name === "AbortError" ? "Formatter request timed out" : error.message,
      }),
    };
  }
};
