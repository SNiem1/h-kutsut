import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable JSON request body parsing
  app.use(express.json());

  // API endpoints FIRST
  app.post("/api/rsvp", async (req, res) => {
    try {
      const { name, lactoseFree, glutenFree, noAllergies, otherAllergies, message, timestamp } = req.body;

      if (!name) {
        return res.status(400).json({ success: false, error: "Nimi on pakollinen kenttä" });
      }

      // Hardcode the Web3Forms secret submission key on the backend
      const web3FormsKey = "c5fdcf9b-0742-42c8-b00e-a0f777247eea";

      const payload = {
        access_key: web3FormsKey,
        subject: `Uusi hääilmoittautuminen: ${name}`,
        from_name: 'Hääkutsu RSVP',
        Nimi: name,
        Laktoositon: lactoseFree ? 'Kyllä' : 'Ei',
        Gluteeniton: glutenFree ? 'Kyllä' : 'Ei',
        'Ei allergioita': noAllergies ? 'Kyllä' : 'Ei',
        'Muut allergiat/ruokavaliot': otherAllergies || '-',
        Terveiset: message || '-',
        Aikaleima: timestamp || new Date().toLocaleString('fi-FI'),
      };

      // Native fetch is supported in Node.js 18+
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Web3Forms API returned error:", errorData);
        throw new Error(`Web3Forms feedback failed with status: ${response.status}`);
      }

      const result = await response.json();
      return res.json({ success: true, data: result });
    } catch (error: any) {
      console.error("RSVP backend submit error:", error);
      return res.status(500).json({ success: false, error: error.message || "Tapahtui sisäinen palvelinvirhe" });
    }
  });

  // Vite middleware for development (handles routing, serving assets, hot reload)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
