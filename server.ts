import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const RSVPS_FILE = path.join(process.cwd(), "rsvps.json");

// Helper to read RSVPs from local file
function readRSVPs(): any[] {
  try {
    if (fs.existsSync(RSVPS_FILE)) {
      const data = fs.readFileSync(RSVPS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading RSVPs file from disk:", e);
  }
  return [];
}

// Helper to write RSVPs to local file
function writeRSVPs(rsvps: any[]) {
  try {
    fs.writeFileSync(RSVPS_FILE, JSON.stringify(rsvps, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing RSVPs file to disk:", e);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable JSON request body parsing
  app.use(express.json());

  // API endpoints FIRST

  // Retrieve all saved RSVPs from the backend file (enables synchronization/backup)
  app.get("/api/rsvps", (req, res) => {
    try {
      const rsvps = readRSVPs();
      return res.json({ success: true, data: rsvps });
    } catch (error: any) {
      console.error("Error retrieving RSVPs:", error);
      return res.status(500).json({ success: false, error: "Virhe tietojen hakemisessa" });
    }
  });

  // Save/Append a new RSVP response to the backend file
  app.post("/api/rsvp", (req, res) => {
    try {
      const { name, lactoseFree, glutenFree, noAllergies, otherAllergies, message, timestamp } = req.body;

      if (!name) {
        return res.status(400).json({ success: false, error: "Nimi on pakollinen kenttä" });
      }

      const rsvps = readRSVPs();

      // Create new response object
      const rsvpId = Date.now().toString() + "-" + Math.random().toString(36).substr(2, 4);
      const newRsvp = {
        id: rsvpId,
        name: name.trim(),
        lactoseFree: !!lactoseFree,
        glutenFree: !!glutenFree,
        noAllergies: !!noAllergies,
        otherAllergies: (otherAllergies || "").trim(),
        message: (message || "").trim(),
        timestamp: timestamp || new Date().toLocaleString("fi-FI"),
      };

      rsvps.push(newRsvp);
      writeRSVPs(rsvps);

      console.log(`RSVP successfully saved to backend file for: ${name}`);

      // Forward to Web3Forms in the background, completely non-blocking to the guest user
      const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY || "c5fdcf9b-0742-42c8-b00e-a0f777247eea";
      
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          subject: `Uusi hääilmoittautuminen: ${newRsvp.name}`,
          from_name: "Hääkutsu RSVP",
          Nimi: newRsvp.name,
          Laktoositon: newRsvp.lactoseFree ? "Kyllä" : "Ei",
          Gluteeniton: newRsvp.glutenFree ? "Kyllä" : "Ei",
          "Ei allergioita": newRsvp.noAllergies ? "Kyllä" : "Ei",
          "Muut allergiat/ruokavaliot": newRsvp.otherAllergies || "-",
          Terveiset: newRsvp.message || "-",
          Aikaleima: newRsvp.timestamp,
        })
      })
      .then(async (web3Res) => {
        const data = await web3Res.json().catch(() => ({}));
        if (!web3Res.ok || !data.success) {
          console.warn("Web3Forms email delivery failed:", web3Res.status, data);
        } else {
          console.log(`Web3Forms email delivery succeeded for: ${newRsvp.name}`);
        }
      })
      .catch((err) => {
        console.warn("Web3Forms client-free background transfer failed:", err.message);
      });

      return res.json({ success: true, data: newRsvp });
    } catch (error: any) {
      console.error("RSVP backend save error:", error);
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
