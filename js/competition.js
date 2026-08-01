// ADABAH Competition helpers — awards + certificates

const AWARDS = {
  cyber_champion: {
    title: "Cyber Champion",
    icon: "🥇",
    blurb: "Rank #1 overall",
  },
  elite_defender: {
    title: "Elite Cyber Defender",
    icon: "🥈",
    blurb: "Ranks #2–#5",
  },
  rising_analyst: {
    title: "Rising Security Analyst",
    icon: "🥉",
    blurb: "Ranks #6–#10",
  },
  certified_explorer: {
    title: "Certified Cyber Explorer",
    icon: "🎖",
    blurb: "Completed all 9 missions",
  },
  mission_master: {
    title: "Mission Master",
    icon: "🔥",
    blurb: "Highest score on a mission",
  },
};

function awardTitleForRank(rank, missions) {
  if (rank === 1) return "Cyber Champion";
  if (rank >= 2 && rank <= 5) return "Elite Cyber Defender";
  if (rank >= 6 && rank <= 10) return "Rising Security Analyst";
  if (missions >= 9) return "Certified Cyber Explorer";
  return "ADABAH Cyber Operative";
}

function certificateTemplate(rank, missions) {
  if (rank === 1) return "champion";
  if (rank >= 2 && rank <= 5) return "elite";
  return "completion";
}

function drawCertificate(canvas, opts) {
  const {
    fullName = "Participant",
    username = "analyst",
    achievement = "Certified Cyber Explorer",
    rank = "—",
    score = 0,
    dateStr = new Date().toLocaleDateString(),
    certId = "ACC-CERT-PENDING",
    template = "completion",
  } = opts || {};

  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  const g = ctx.createLinearGradient(0, 0, w, h);
  if (template === "champion") {
    g.addColorStop(0, "#1a0508");
    g.addColorStop(0.45, "#3b0a12");
    g.addColorStop(1, "#050505");
  } else if (template === "elite") {
    g.addColorStop(0, "#0a0a0a");
    g.addColorStop(0.5, "#1a1010");
    g.addColorStop(1, "#000");
  } else {
    g.addColorStop(0, "#0a0a0a");
    g.addColorStop(0.5, "#14060a");
    g.addColorStop(1, "#000");
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(224,17,54,0.8)";
  ctx.lineWidth = 8;
  ctx.strokeRect(36, 36, w - 72, h - 72);
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 2;
  ctx.strokeRect(54, 54, w - 108, h - 108);

  ctx.fillStyle = "#e01136";
  ctx.font = "600 26px Orbitron, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ADABAH CYBER CHALLENGE", w / 2, 120);

  ctx.fillStyle = "#f4f4f5";
  ctx.font = "700 48px Orbitron, sans-serif";
  ctx.fillText("CERTIFICATE OF ACHIEVEMENT", w / 2, 190);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "400 22px IBM Plex Sans, sans-serif";
  ctx.fillText("This certifies that", w / 2, 260);

  ctx.fillStyle = "#fff";
  ctx.font = "700 44px Orbitron, sans-serif";
  ctx.fillText(String(fullName).slice(0, 42), w / 2, 325);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "400 20px IBM Plex Sans, sans-serif";
  ctx.fillText(`@${username}`, w / 2, 365);

  ctx.fillStyle = "#d4d4d8";
  ctx.font = "400 22px IBM Plex Sans, sans-serif";
  ctx.fillText("has earned the title of", w / 2, 425);

  ctx.fillStyle = "#e01136";
  ctx.font = "700 36px Orbitron, sans-serif";
  ctx.fillText(String(achievement).toUpperCase(), w / 2, 480);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "400 18px JetBrains Mono, monospace";
  ctx.fillText(`Final Rank: ${rank}   ·   Cyber XP: ${Number(score).toLocaleString()}   ·   ${dateStr}`, w / 2, 545);
  ctx.fillText(`Certificate ID: ${certId}`, w / 2, 580);

  ctx.fillStyle = "#71717a";
  ctx.font = "400 16px IBM Plex Sans, sans-serif";
  ctx.fillText("Digitally signed by ADABAH Cyber Challenge", w / 2, 680);
  ctx.fillText("Official Signature · cybercc.adabah.com", w / 2, 710);
}

function downloadCertificateJpg(opts) {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 990;
  drawCertificate(canvas, opts);
  const a = document.createElement("a");
  a.download = `${opts.certId || "ACC-CERT"}.jpg`;
  a.href = canvas.toDataURL("image/jpeg", 0.95);
  a.click();
  return canvas;
}

function downloadCertificatePdf(opts) {
  // Lightweight PDF: embed JPEG page via minimal PDF writer
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 990;
  drawCertificate(canvas, opts);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  const jpeg = atob(dataUrl.split(",")[1]);
  const bytes = new Uint8Array(jpeg.length);
  for (let i = 0; i < jpeg.length; i++) bytes[i] = jpeg.charCodeAt(i);

  const pageW = 842;
  const pageH = 595;
  const objects = [];
  const add = (s) => {
    objects.push(s);
    return objects.length;
  };

  const imgObj = add(null); // placeholder index
  const contentObj = add(null);
  const pageObj = add(null);
  const pagesObj = add(null);
  const catalogObj = add(null);

  objects[imgObj - 1] =
    `<< /Type /XObject /Subtype /Image /Width 1400 /Height 990 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${bytes.length} >>\nstream\n`;
  // binary handled below
  objects[contentObj - 1] =
    `<< /Length 68 >>\nstream\nq\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ\nendstream`;
  objects[pageObj - 1] =
    `<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Contents ${contentObj} 0 R /Resources << /XObject << /Im0 ${imgObj} 0 R >> >> >>`;
  objects[pagesObj - 1] = `<< /Type /Pages /Kids [${pageObj} 0 R] /Count 1 >>`;
  objects[catalogObj - 1] = `<< /Type /Catalog /Pages ${pagesObj} 0 R >>`;

  // Build PDF manually with image stream
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  function writeObj(num, body, binary) {
    offsets[num] = pdf.length;
    pdf += `${num} 0 obj\n${body}`;
    if (binary) {
      // append binary as latin1
      const binStr = Array.from(binary, (b) => String.fromCharCode(b)).join("");
      pdf += binStr + "\nendstream\nendobj\n";
    } else if (!String(body).includes("endstream") && !String(body).includes("endobj")) {
      pdf += "\nendobj\n";
    } else if (!String(body).endsWith("endobj\n") && !String(body).includes("endobj")) {
      pdf += "\nendobj\n";
    } else if (!String(body).includes("endobj")) {
      pdf += "endobj\n";
    }
  }

  // Simpler approach: open JPG download is enough; for PDF use print-friendly HTML fallback
  const html = `<!doctype html><html><body style="margin:0;background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh">
    <img src="${dataUrl}" style="max-width:100%;height:auto" />
    <script>setTimeout(()=>window.print(),400)<\\/script>
  </body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    downloadCertificateJpg(opts);
  }
  return canvas;
}

function previewCertificate(canvasEl, participant, rank) {
  if (!canvasEl) return;
  const missions = Array.isArray(participant.completed_missions)
    ? participant.completed_missions.length
    : participant.missions || 0;
  const r = Number(rank || participant.computed_rank || participant.rank || 0);
  drawCertificate(canvasEl, {
    fullName: participant.full_name || participant.fullName || "Participant",
    username: participant.hacker_name || participant.username || participant.handle || "analyst",
    achievement: awardTitleForRank(r, missions),
    rank: r ? `#${r}` : "—",
    score: participant.score || 0,
    dateStr: new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    certId: participant.certificate_id || participant.certificateId || `ACC-CERT-PREVIEW`,
    template: certificateTemplate(r, missions),
  });
}

window.ACCComp = {
  AWARDS,
  awardTitleForRank,
  certificateTemplate,
  drawCertificate,
  downloadCertificateJpg,
  downloadCertificatePdf,
  previewCertificate,
};
