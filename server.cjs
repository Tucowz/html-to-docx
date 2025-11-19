// server.cjs
const express = require('express');
const multer = require('multer');
const HTMLtoDOCX = require('html-to-docx');

const app = express();
const upload = multer();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => {
  res.json({ status: 'HTML => DOCX service running' });
});

// POST /convert
// Body: form-urlencoded ou multipart com campo "html"
app.post('/convert', upload.none(), async (req, res) => {
  try {
    const html = req.body.html;

    if (!html) {
      return res.status(400).json({ error: 'Campo "html" não enviado.' });
    }

    const docxBuffer = await HTMLtoDOCX(html, null, {
      orientation: 'portrait',
      title: 'Generated Document',
      creator: 'html2docx-service',
      // opções extras se quiser
      table: {
        row: { cantSplit: true },
      },
      footer: false,
      header: false,
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="document.docx"'
    );

    return res.send(Buffer.from(docxBuffer));
  } catch (err) {
    console.error('Erro ao converter HTML => DOCX:', err);
    return res.status(500).json({
      error: 'Erro ao converter HTML => DOCX',
      details: err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('HTML => DOCX service running on port', PORT);
});
