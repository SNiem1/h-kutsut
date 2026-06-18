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

      try {
        rsvps.push(newRsvp);
        writeRSVPs(rsvps);
      } catch (saveError: any) {
        console.error("Local save error:", saveError);
      }

      console.log(`RSVP successfully saved to backend file for: ${name}`);

      return res.json({ success: true, data: newRsvp });
    } catch (error: any) {
      console.error("RSVP backend save error:", error);
      return res.status(500).json({ success: false, error: "Tapahtui sisäinen palvelinvirhe" });
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
