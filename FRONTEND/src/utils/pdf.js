// src/utils/pdf.js
import html2pdf from "html2pdf.js";
import leafletImage from "leaflet-image";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function exportBeneficioPdf({
  filename,
  containerId,
  leafletMap,
  mapInteractiveId,
  mapSnapshotId,
}) {
  const element = document.getElementById(containerId);
  if (!element) throw new Error(`Contenedor #${containerId} no encontrado`);

  const mapImg = document.getElementById(mapSnapshotId);
  const mapInteractive = document.getElementById(mapInteractiveId);
  let swapped = false;

  try {
    // 1. Intentar capturar el mapa
    if (leafletMap && mapImg && mapInteractive) {
      // Forzar recálculo de tamaño
      leafletMap.invalidateSize();
      await sleep(300); // Espera técnica para tiles

      const snapshotUrl = await new Promise((resolve) => {
        leafletImage(leafletMap, function (err, canvas) {
          if (err) {
            console.warn("Leaflet-image error:", err);
            resolve(null);
            return;
          }
          resolve(canvas.toDataURL("image/png"));
        });
      });

      if (snapshotUrl) {
        mapImg.src = snapshotUrl;
        mapInteractive.style.display = "none";
        mapImg.style.display = "block";
        swapped = true;
      }
    }

    // 2. Configurar PDF (A4 vertical)
    const opt = {
      margin: 10,
      filename: filename || "beneficio.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, // Vital para mapas
        logging: false,
        allowTaint: true
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // 3. Generar
    await html2pdf().set(opt).from(element).save();

  } catch (err) {
    console.error("Error en exportación PDF:", err);
    throw err;
  } finally {
    // 4. Restaurar vista interactiva
    if (swapped) {
      mapImg.style.display = "none";
      mapInteractive.style.display = "block";
    }
  }
}