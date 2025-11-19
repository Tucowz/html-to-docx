import express from "express";
import multer from "multer";
import HtmlToDocx from "html-to-docx";

const app = express();
const upload = multer();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// POST /convert
app.post("/convert", upload.none(), async (req, res) => {
  try {
    const html = req.body.html;

    if (!html) {
      return res.status(400).json({ error: "HTML não enviado." });
    }

    const buffer = await HtmlToDocx(html, null, {
      table: { row: { cantSplit: true } },
      footer: false,
      header: false
    });

    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="document.docx"',
    });

    return res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao converter HTML => DOCX", details: err.message });
  }
});

app.get("/", (req, res) => {
  res.json({ status: "HTML => DOCX service running" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
