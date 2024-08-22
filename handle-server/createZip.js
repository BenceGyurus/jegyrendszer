const PDFDocument = require('pdfkit');
const { PDFDocument: PDFLibDocument } = require('pdf-lib');
const fs = require('fs');
const archiver = require("archiver");

const readConfig = async () => {
  try {
    let config = JSON.parse(
      fs.readFileSync(`${process.env.CONFIGDIR}/config.json`),
    );
    return config;
  } catch (err) {
    console.log("failed to read config file, check env variables");
  }
};

function createZip(files) {
  /*return new Promise(async (resolve, reject) => {
    try {
      config = await readConfig();
      const outputBuffer = [];

      const archive = archiver("zip", {
        zlib: { level: 9 },
      });

      archive.on("warning", (err) => {
        if (err.code === "ENOENT") {
          console.warn("Archive warning:", err);
        } else {
          reject(err);
        }
      });

      archive.on("error", (err) => {
        reject(err);
      });

      archive.on("data", (data) => {
        outputBuffer.push(data);
      });

      archive.on("end", () => {
        console.log("ZIP folder created successfully.");
        const completeBuffer = Buffer.concat(outputBuffer);
        resolve(completeBuffer);
      });

      files.forEach((file) => {
        archive.file(file, { name: file.split("/").pop() }); // Use the actual file name
      });

      archive.finalize();
    } catch (error) {
      reject(error);
    }
  });*/
  return new Promise(async (resolve, reject)=>{
      const mergedPdf = await PDFLibDocument.create();
  
      for (const pdfPath of files) {
          const existingPdfBytes = fs.readFileSync(pdfPath);
          const existingPdf = await PDFLibDocument.load(existingPdfBytes);
          const copiedPages = await mergedPdf.copyPages(existingPdf, existingPdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
  
      const mergedPdfBytes = await mergedPdf.save();
      resolve(mergedPdfBytes)
  });
}

module.exports = createZip;
