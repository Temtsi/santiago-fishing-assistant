const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 8787);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (d) => {
      raw += d;
      if (raw.length > 1_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

async function askOpenAI({ model, userText, knowledge, weatherNote, history }) {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing on server");
  }

  const safeHistory = Array.isArray(history)
    ? history.slice(-8).map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: String(m.text || "") }))
    : [];

  const messages = [
    {
      role: "system",
      content:
        "Ты ассистент Сантьяго для рыбаков. Отвечай конкретно и по делу. Проверяй сезон, погоду, безопасность. Если сезон не подходит — говори прямо и предлагай альтернативу.",
    },
    ...safeHistory,
    {
      role: "user",
      content: `Вопрос: ${userText}\n\nБаза знаний:\n${knowledge}\n\nПогода:\n${weatherNote}`,
    },
  ];

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: model || OPENAI_MODEL,
      temperature: 0.3,
      messages,
    }),
  });

  const data = await r.json();
  if (!r.ok) {
    throw new Error(data?.error?.message || `OpenAI ${r.status}`);
  }

  const answer = data?.choices?.[0]?.message?.content?.trim();
  if (!answer) throw new Error("Empty model response");
  return answer;
}

function safePath(urlPath) {
  const cleaned = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = path.normalize(cleaned).replace(/^([.][.][/\\])+/, "");
  let filePath = path.join(ROOT, normalized === "/" ? "index.html" : normalized);
  if (!filePath.startsWith(ROOT)) return null;
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  return filePath;
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    send(res, 204, "");
    return;
  }

  if (req.method === "POST" && req.url.startsWith("/api/ai")) {
    try {
      const body = await parseBody(req);
      const answer = await askOpenAI(body);
      send(res, 200, JSON.stringify({ answer }));
    } catch (err) {
      send(res, 500, JSON.stringify({ error: err.message || "AI backend error" }));
    }
    return;
  }

  if (req.method !== "GET") {
    send(res, 405, JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const filePath = safePath(req.url || "/");
  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    send(res, 404, "Not found", "text/plain; charset=utf-8");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  const data = fs.readFileSync(filePath);
  send(res, 200, data, type);
});

server.listen(PORT, () => {
  console.log(`Santiago server is running on http://localhost:${PORT}`);
});
