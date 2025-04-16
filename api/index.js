const express = require("express");
const cors = require("cors");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 5000;
const path = require("path");

app.use(cors());
app.use(express.json());

let stihovi = [];

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tvojemail@gmail.com",
    pass: "tvoja_lozinka",
  },
});

app.post("/dodaj-stih", (req, res) => {
  const { stih } = req.body;
  if (!stih || !stih.trim()) {
    return res.status(400).json({ message: "Stih ne može biti prazan" });
  }
  stihovi.push(stih);
  res.json({ message: "Stih dodan", zadnjiStih: stihovi[stihovi.length - 1] });
});

app.get("/zadnji-stih", (req, res) => {
  const zadnjiStih =
    stihovi.length > 0 ? stihovi[stihovi.length - 1] : "Nema stihova";
  res.json({ zadnjiStih });
});

const kreirajPDF = (filePath, callback) => {
  const doc = new PDFDocument({ margin: 40 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const robotoFontPath = path.join(__dirname, "fonts", "Roboto-Medium.ttf");
  doc.registerFont("Roboto-Medium", robotoFontPath);

  doc
    .font("Roboto-Medium")
    .fontSize(18)
    .fillColor("#000000")
    .text("KAOStih", {
      align: "center",
    })
    .moveDown(1.5);

  doc.font("Roboto-Medium").fontSize(14).fillColor("#333333");

  stihovi.forEach((stih) => {
    doc.text(stih, {
      align: "center",
      lineGap: 6,
    });
    doc.moveDown(0.5);
  });

  doc.end();

  stream.on("finish", () => callback(filePath));
};

app.get("/preuzmi-pdf", (req, res) => {
  const filePath = "KAOStih.pdf";
  kreirajPDF(filePath, () => {
    res.download(filePath, "KAOStih.pdf", (err) => {
      if (err) {
        console.error("Greška pri preuzimanju PDF-a:", err);
        res.status(500).json({ message: "Greška pri preuzimanju" });
      }
      setTimeout(() => fs.unlinkSync(filePath), 5000);
    });
  });
});

app.get("/svi-stihovi", (req, res) => {
  if (stihovi.length === 0) {
    return res.status(404).json({ message: "Nema stihova" });
  }
  res.json({ sviStihovi: stihovi });
});

app.post("/posalji-email", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email je obavezan" });
  }

  const filePath = "Pjesma.pdf";
  kreirajPDF(filePath, (pdfPath) => {
    const mailOptions = {
      from: "tvojemail@gmail.com",
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
      console.log("Email poslan:", info.response);
      res.json({ message: "Email poslan!" });

      setTimeout(() => fs.unlinkSync(pdfPath), 5000);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
});
