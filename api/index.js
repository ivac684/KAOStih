import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";
import Stih from "./models/Stih.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://ivaburic1:frodo@Cluster1.94vabzm.mongodb.net/KaoStih?retryWrites=true&w=majority&appName=Cluster1"
  )
  .then(() => console.log("Spojeno na MongoDB Atlas"))
  .catch((err) => console.error("Greška pri spajanju s bazom:", err));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/dodaj-stih", async (req, res) => {
  const { stih } = req.body;
  if (!stih || !stih.trim()) {
    return res.status(400).json({ message: "Stih ne može biti prazan" });
  }

  try {
    const noviStih = new Stih({ stih });
    await noviStih.save();
    res.json({ message: "Stih spremljen", zadnjiStih: noviStih });
  } catch (err) {
    console.error("Greška pri spremanju stiha:", err);
    res
      .status(500)
      .json({ message: "Greška pri spremanju stih", error: err.message });
  }
});

app.get("/zadnji-stih", async (req, res) => {
  try {
    const zadnji = await Stih.findOne().sort({ createdAt: -1 });
    if (!zadnji) return res.json({ zadnjiStih: "Nema stihova" });
    res.json({ zadnjiStih: zadnji.stih });
  } catch (err) {
    res.status(500).json({ message: "Greška pri dohvaćanju stihova" });
  }
});

app.get("/svi-stihovi", async (req, res) => {
  try {
    const svi = await Stih.find().sort({ createdAt: 1 });
    res.json({ sviStihovi: svi.map((s) => s.stih) });
  } catch (err) {
    res.status(500).json({ message: "Greška pri dohvaćanju svih stihova" });
  }
});

const kreirajPDF = async (filePath, callback) => {
  const stihovi = await Stih.find().sort({ createdAt: 1 });
  const doc = new PDFDocument({ margin: 40 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const robotoFontPath = join(__dirname, "fonts", "Roboto-Medium.ttf");
  doc.registerFont("Roboto-Medium", robotoFontPath);

  doc
    .font("Roboto-Medium")
    .fontSize(18)
    .fillColor("#000000")
    .text("KAOStih", { align: "center" })
    .moveDown(1);

  doc.font("Roboto-Medium").fontSize(12).fillColor("#333333");

  stihovi.forEach(({ stih }) => {
    doc.text(stih, { align: "center", lineGap: 6 });
    doc.moveDown(0.5);
  });

  doc.end();

  stream.on("finish", () => callback(filePath));
};

app.get("/preuzmi-pdf", async (req, res) => {
  const filePath = "KAOStih.pdf";
  await kreirajPDF(filePath, () => {
    res.download(filePath, "KAOStih.pdf", (err) => {
      if (err) {
        console.error("Greška pri preuzimanju PDF-a:", err);
        res.status(500).json({ message: "Greška pri preuzimanju" });
      }
      setTimeout(() => fs.unlinkSync(filePath), 5000);
    });
  });
});

app.post("/posalji-email", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email je obavezan" });
  }

  const filePath = "Pjesma.pdf";
  await kreirajPDF(filePath, (pdfPath) => {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Tvoja pjesma",
      text: "Evo tvoje pjesme u prilogu!",
      attachments: [{ filename: "Pjesma.pdf", path: pdfPath }],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Greška pri slanju emaila:", error);
        return res.status(500).json({ message: "Greška pri slanju emaila" });
      }
      res.json({ message: "Email poslan!" });
      setTimeout(() => fs.unlinkSync(pdfPath), 5000);
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
});

export default app;
