import { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import * as Styled from "./styled-components";

export default function Kaostih() {
  const [stihovi, setStihovi] = useState([]);
  const [noviStih, setNoviStih] = useState("");
  const [email, setEmail] = useState("");
  const [poruka, setPoruka] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/zadnji-stih")
      .then((res) => res.json())
      .then((data) => {
        setStihovi([data.zadnjiStih]);
      });
  }, []);

  const dodajStih = () => {
    if (!noviStih.trim()) return;
    fetch("http://localhost:5000/dodaj-stih", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stih: noviStih }),
    }).then(() => {
      setStihovi([...stihovi, noviStih]);
      setNoviStih("");
    });
  };

  const preuzmiPDF = () => {
    window.location.href = "http://localhost:5000/preuzmi-pdf";
  };

  const posaljiEmail = () => {
    if (!email.trim()) {
      setPoruka("Unesi ispravan email!");
      return;
    }

    const pjesma = stihovi.join("\n");

    const templateParams = {
      to_email: email,
      subject: "Tvoja pjesma",
      message: pjesma,
    };

    emailjs
      .send(
        "service_a5gs14k",
        "template_89e2kqb",
        templateParams,
        "eVx7dCtGOclVMeF1S"
      )
      .then(
        (response) => {
          setPoruka("Email poslan!");
        },
        (error) => {
          setPoruka("Greška pri slanju emaila");
          console.error(error);
        }
      );
  };
  const pokreniPrintanje = () => {
    fetch("http://localhost:5000/svi-stihovi")
      .then((res) => res.json())
      .then((data) => {
        const pjesma = data.sviStihovi.join("\n");

        const printWindow = window.open("", "", "width=600,height=800");

        if (!printWindow) {
          console.error("Popup blokiran!");
          return;
        }

        const title = printWindow.document.createElement("h1");
        title.textContent = "KAOStih";
        title.style.textAlign = "center";
        title.style.fontFamily = "Arial, sans-serif";

        const pre = printWindow.document.createElement("pre");
        pre.textContent = pjesma;
        pre.style.fontFamily = "Roboto, sans-serif";
        pre.style.fontSize = "16px";
        pre.style.whiteSpace = "pre-wrap";

        printWindow.document.body.style.textAlign = "center";
        printWindow.document.body.style.fontFamily = "Roboto, sans-serif";
        printWindow.document.body.style.margin = "20px";

        printWindow.document.body.appendChild(title);
        printWindow.document.body.appendChild(pre);

        printWindow.document.close();
        printWindow.print();
      })
      .catch((error) => {
        console.error("Greška pri dohvaćanju stihova:", error);
      });
  };

  return (
    <Styled.Container>
      <div id="print-area" style={{ display: "none" }}>
        <h1>KAOStih</h1>
        <ul style={{ listStyleType: "none", padding: 0, fontSize: "1.2rem" }}>
          {stihovi.map((stih, index) => (
            <li key={index}>{stih}</li>
          ))}
        </ul>
      </div>

      <Styled.Title>
        <span>KAO</span>
        <span>
          <i>Stih</i>
        </span>
      </Styled.Title>
      <Styled.Description>
        Sudionik prije vas je napisao jedan stih. Nejasno je kako je pjesma
        započela i nejasno je kako će se nastaviti.
        <br />
        <br /> Napišite sljedeći stih kako bi se pjesma nastavila.
      </Styled.Description>
      <Styled.ContentWrapper>
        <div style={{ display: "flex", gap: "20px", flex: 1 }}>
          <Styled.Card yellow>
            <h2
              style={{
                fontSize: "1.4rem",
                fontWeight: "600",
                textAlign: "center",
                marginBottom: "40px",
              }}
            >
              ZADNJI STIH
            </h2>
            <ul
              style={{ listStyleType: "none", padding: 0, fontSize: "1.2rem" }}
            >
              {stihovi.length > 0 ? (
                <li>{stihovi[stihovi.length - 1]}</li>
              ) : (
                <li>Nema stihova</li>
              )}
            </ul>
          </Styled.Card>
          <Styled.Card>
            <Styled.Textarea
              placeholder="Novi unos..."
              value={noviStih}
              onChange={(e) => setNoviStih(e.target.value)}
            />
            <Styled.Button primary onClick={dodajStih}>
              Pošalji
            </Styled.Button>
          </Styled.Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{ display: "flex", gap: "20px", justifyContent: "center" }}
          >
            <Styled.PDFButton
              bgColor="#EBD18B"
              hoverColor="#d1b477"
              activeColor="#b8a165"
              onClick={preuzmiPDF}
            >
              Preuzmi PDF
            </Styled.PDFButton>

            <Styled.PDFButton
              bgColor="#CC9703"
              hoverColor="#b88c2d"
              activeColor="#9e7b2e"
              onClick={pokreniPrintanje}
            >
              Isprintaj
            </Styled.PDFButton>
          </div>
          <Styled.EmailContainer>
            <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
              Pošalji mi pjesmu na email!
            </p>
            <Styled.Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "280px",
                padding: "10px",
                fontSize: "0.9rem",
                backgroundColor: "white",
                color: "black",
              }}
            />
            <Styled.PDFButton
              onClick={posaljiEmail}
              bgColor="#EBD18B"
              hoverColor="#d1b477"
              activeColor="#b8a165"
              style={{
                marginTop: "15px",
              }}
            >
              Pošalji
            </Styled.PDFButton>
            {poruka && (
              <p style={{ marginTop: "10px", fontWeight: "bold" }}>{poruka}</p>
            )}
          </Styled.EmailContainer>
        </div>
      </Styled.ContentWrapper>
    </Styled.Container>
  );
}
