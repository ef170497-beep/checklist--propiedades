import { useState, useRef } from "react";

const FAMILIARES = ["Eduardo", "Judith", "Ana Paula", "Lalo", "Juan Álvaro", "Sofía"];

const PROPIEDADES = [
  { id: "bayview", nombre: "Bay View Grand", tipo: "departamento", icono: "🏢", ubicacion: "Puerto Vallarta, Jal." },
  { id: "bolongo", nombre: "Bolongo",        tipo: "departamento", icono: "🏢", ubicacion: "Puerto Vallarta, Jal." },
  { id: "amancay", nombre: "Amancay",        tipo: "departamento", icono: "🏢", ubicacion: "Puerto Vallarta, Jal." },
  { id: "tapalpa", nombre: "Tapalpa",        tipo: "campo",        icono: "🏡", ubicacion: "Tapalpa, Jal." },
];

const SECCIONES_CHECKLIST = [
  {
    id: "electricidad", titulo: "Electricidad y Focos", icono: "💡",
    items: [
      "Todos los focos funcionando (sala, comedor, cocina)",
      "Todos los focos funcionando (recámaras y pasillos)",
      "Todos los focos funcionando (baños y exteriores)",
      "Interruptores y contactos sin daños",
      "Aire acondicionado / ventiladores funcionando",
      "Calentador de agua encendido y funcionando",
    ],
  },
  {
    id: "camas_banos", titulo: "Camas y Baños", icono: "🛏️",
    items: [
      "Sábanas, almohadas y cobertores completos y limpios",
      "Colchones en buen estado (sin manchas ni daños)",
      "Toallas de baño completas y limpias (2 por persona)",
      "Papel de baño abastecido",
      "Jabón, shampoo y artículos de aseo presentes",
      "Cortinas de baño y regadera sin daños",
      "Sanitario funcionando correctamente",
      "Lavabos y regaderas sin fugas",
    ],
  },
  {
    id: "cocina", titulo: "Cocina", icono: "🍳",
    items: [
      "Platos, vasos y cubiertos completos y limpios",
      "Ollas, sartenes y utensilios completos",
      "Estufa/parrilla funcionando correctamente",
      "Refrigerador limpio y funcionando",
      "Microondas funcionando",
      "Cafetera y electrodomésticos presentes",
      "Despensa/alacena ordenada y limpia",
      "Extractor de cocina funcionando",
    ],
  },
  {
    id: "areas_verdes", titulo: "Áreas Exteriores", icono: "🌿",
    items: [
      "Jardín / plantas en buen estado y limpias",
      "Terraza o balcón limpio y en orden",
      "Muebles exteriores completos y en buen estado",
      "Alberca limpia y con el nivel de cloro correcto (si aplica)",
      "Parrilla/asador limpio (si aplica)",
    ],
  },
  {
    id: "general", titulo: "Estado General", icono: "🏠",
    items: [
      "Puertas y cerraduras funcionando correctamente",
      "Ventanas sin daños y que cierran bien",
      "Pisos y paredes sin daños visibles",
      "Sala y comedor limpios y ordenados",
      "TV y entretenimiento funcionando",
      "WiFi funcionando",
      "Alarma / seguridad activa y funcionando",
      "No hay plagas visibles (cucarachas, ratones, etc.)",
    ],
  },
  {
    id: "limpieza", titulo: "Limpieza General", icono: "🧹",
    items: [
      "Toda la propiedad limpia a la llegada",
      "Basura vacía y bolsas disponibles",
      "Artículos de limpieza presentes (escoba, trapeador, etc.)",
      "Lavadora/secadora funcionando y limpia",
    ],
  },
];

const WHATSAPP_NUMERO = "523331910319";

const C = {
  fondo: "#F5F2ED",
  blanco: "#FFFFFF",
  azulOscuro: "#1C2B3A",
  azulMedio: "#2C4A6B",
  azulClaro: "#4A90C4",
  verdeSi: "#2D7A4F",
  rojoNo: "#C0392B",
  dorado: "#C5884A",
  gris: "#6B7280",
  grisClaro: "#E5E0D8",
};

// ── Genera imagen con Canvas ──────────────────────────────────────────────────
function generarImagen({ propiedad, tipoVisita, quien, totalSi, totalNo, totalNA, puntaje, itemsConProblemas, observacionesGenerales }) {
  const W = 800;
  const PADDING = 40;
  const COL = W - PADDING * 2;

  // Calcular altura total dinámicamente
  const problemaH = itemsConProblemas.length > 0 ? 40 + itemsConProblemas.length * 70 : 0;
  const obsH = observacionesGenerales ? 80 : 0;
  const H = 380 + problemaH + obsH + 60;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Helpers
  const rRect = (x, y, w, h, r, fill) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  };

  // Fondo general
  ctx.fillStyle = "#F5F2ED";
  ctx.fillRect(0, 0, W, H);

  // Header azul
  rRect(0, 0, W, 140, 0, C.azulOscuro);
  ctx.fillStyle = C.azulClaro;
  ctx.font = "bold 13px Arial";
  ctx.fillText(`${propiedad.icono}  ${propiedad.nombre.toUpperCase()}  ·  ${tipoVisita === "llegada" ? "LLEGADA" : "SALIDA"}`, PADDING, 40);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 28px Arial";
  ctx.fillText("Reporte de Inspección", PADDING, 78);
  ctx.fillStyle = "#8BA8C4";
  ctx.font = "14px Arial";
  const fecha = new Date().toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  ctx.fillText(`👤 ${quien}   ·   📅 ${fecha}`, PADDING, 108);

  // Tarjeta puntaje
  const pColor = puntaje >= 80 ? C.verdeSi : puntaje >= 60 ? C.dorado : C.rojoNo;
  const pBg = puntaje >= 80 ? "#EEF9F3" : puntaje >= 60 ? "#FFFBEB" : "#FEF2F2";
  rRect(PADDING, 156, COL, 110, 14, pBg);
  ctx.strokeStyle = pColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(PADDING + 1, 157, COL - 2, 108);

  ctx.fillStyle = C.gris;
  ctx.font = "13px Arial";
  ctx.fillText("Estado general de la propiedad", PADDING + 20, 188);
  ctx.fillStyle = pColor;
  ctx.font = "bold 54px Arial";
  ctx.fillText(`${puntaje}%`, PADDING + 20, 248);

  const etiqueta = puntaje >= 80 ? "✅  Buen estado" : puntaje >= 60 ? "⚠️  Requiere atención" : "❌  Necesita mantenimiento";
  ctx.fillStyle = pColor;
  ctx.font = "bold 14px Arial";
  ctx.fillText(etiqueta, PADDING + 20, 268); // será dibujado abajo del %

  // Contadores derecha
  const cx = W - PADDING - 180;
  rRect(cx, 172, 180, 40, 10, "#E8F5EE");
  ctx.fillStyle = C.verdeSi;
  ctx.font = "bold 16px Arial";
  ctx.fillText(`✓  ${totalSi} correctos`, cx + 16, 198);
  rRect(cx, 220, 180, 40, 10, "#FEF2F2");
  ctx.fillStyle = C.rojoNo;
  ctx.font = "bold 16px Arial";
  ctx.fillText(`✗  ${totalNo} con problema`, cx + 16, 246);
  if (totalNA > 0) {
    ctx.fillStyle = C.gris;
    ctx.font = "13px Arial";
    ctx.fillText(`—  ${totalNA} sin revisar`, cx + 16, 276);
  }

  // Barra de progreso visual
  const barY = 282;
  rRect(PADDING, barY, COL, 16, 8, "#E5E0D8");
  rRect(PADDING, barY, Math.round(COL * puntaje / 100), 16, 8, pColor);

  let curY = 320;

  // Problemas
  if (itemsConProblemas.length > 0) {
    ctx.fillStyle = C.rojoNo;
    ctx.font = "bold 15px Arial";
    ctx.fillText(`⚠️  Puntos con problema (${itemsConProblemas.length})`, PADDING, curY);
    curY += 16;

    itemsConProblemas.forEach((item) => {
      rRect(PADDING, curY, COL, 56, 10, "#FFF8F8");
      ctx.strokeStyle = "#FECACA";
      ctx.lineWidth = 1;
      ctx.strokeRect(PADDING + 1, curY + 1, COL - 2, 54);
      // Línea izquierda roja
      ctx.fillStyle = C.rojoNo;
      ctx.fillRect(PADDING, curY, 4, 56);
      ctx.fillStyle = C.azulOscuro;
      ctx.font = "bold 13px Arial";
      // Truncar texto largo
      let txt = `❌  ${item.item}`;
      if (ctx.measureText(txt).width > COL - 30) {
        while (ctx.measureText(txt + "…").width > COL - 30) txt = txt.slice(0, -1);
        txt += "…";
      }
      ctx.fillText(txt, PADDING + 16, curY + 22);
      ctx.fillStyle = C.gris;
      ctx.font = "12px Arial";
      ctx.fillText(`📍 ${item.seccion}`, PADDING + 16, curY + 40);
      if (item.obs) {
        ctx.fillStyle = C.rojoNo;
        ctx.font = "italic 12px Arial";
        let obs = `📝 ${item.obs}`;
        if (ctx.measureText(obs).width > COL - 100) {
          while (ctx.measureText(obs + "…").width > COL - 100) obs = obs.slice(0, -1);
          obs += "…";
        }
        ctx.fillText(obs, W - PADDING - ctx.measureText(obs).width - 8, curY + 40);
      }
      curY += 68;
    });
  }

  // Observaciones generales
  if (observacionesGenerales) {
    rRect(PADDING, curY, COL, 64, 10, "#EEF4FB");
    ctx.fillStyle = C.azulMedio;
    ctx.font = "bold 13px Arial";
    ctx.fillText("📋  Observaciones generales", PADDING + 16, curY + 22);
    ctx.fillStyle = C.gris;
    ctx.font = "12px Arial";
    let obs = observacionesGenerales;
    if (ctx.measureText(obs).width > COL - 32) {
      while (ctx.measureText(obs + "…").width > COL - 32) obs = obs.slice(0, -1);
      obs += "…";
    }
    ctx.fillText(obs, PADDING + 16, curY + 46);
    curY += 76;
  }

  // Footer
  ctx.fillStyle = C.azulOscuro;
  ctx.fillRect(0, H - 44, W, 44);
  ctx.fillStyle = "#8BA8C4";
  ctx.font = "12px Arial";
  ctx.fillText("Propiedades Familia  ·  App de Mantenimiento", PADDING, H - 16);
  ctx.fillStyle = C.azulClaro;
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "right";
  ctx.fillText(new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }), W - PADDING, H - 16);
  ctx.textAlign = "left";

  return canvas.toDataURL("image/png");
}

export default function ChecklistPropiedades() {
  const [pantalla, setPantalla] = useState("inicio");
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
  const [tipoVisita, setTipoVisita] = useState("llegada");
  const [quien, setQuien] = useState("");
  const [respuestas, setRespuestas] = useState({});
  const [observacionesItem, setObservacionesItem] = useState({});
  const [observacionesGenerales, setObservacionesGenerales] = useState("");
  const [seccionActiva, setSeccionActiva] = useState(0);
  const [imagenGenerada, setImagenGenerada] = useState(null);
  const [imagenDescargada, setImagenDescargada] = useState(false);

  const totalItems = SECCIONES_CHECKLIST.flatMap((s) => s.items).length;
  const totalRespondidos = Object.keys(respuestas).length;
  const progreso = Math.round((totalRespondidos / totalItems) * 100);

  const setRespuesta = (secId, itemIdx, valor) => {
    const key = `${secId}_${itemIdx}`;
    setRespuestas((p) => ({ ...p, [key]: valor }));
  };
  const setObsItem = (secId, itemIdx, texto) => {
    const key = `${secId}_${itemIdx}`;
    setObservacionesItem((p) => ({ ...p, [key]: texto }));
  };
  const getRespuesta = (secId, itemIdx) => respuestas[`${secId}_${itemIdx}`];
  const getObsItem = (secId, itemIdx) => observacionesItem[`${secId}_${itemIdx}`] || "";

  const itemsConProblemas = SECCIONES_CHECKLIST.flatMap((sec) =>
    sec.items.map((item, idx) => ({
      seccion: sec.titulo,
      item,
      key: `${sec.id}_${idx}`,
      respuesta: respuestas[`${sec.id}_${idx}`],
      obs: observacionesItem[`${sec.id}_${idx}`] || "",
    })).filter((i) => i.respuesta === "no")
  );

  const totalSi = Object.values(respuestas).filter((v) => v === "si").length;
  const totalNo = Object.values(respuestas).filter((v) => v === "no").length;
  const totalNA = totalItems - totalRespondidos;
  const puntaje = totalRespondidos > 0 ? Math.round((totalSi / totalRespondidos) * 100) : 0;

  const entrarAResumen = () => {
    const img = generarImagen({
      propiedad: propiedadSeleccionada,
      tipoVisita, quien, totalSi, totalNo, totalNA, puntaje,
      itemsConProblemas, observacionesGenerales,
    });
    setImagenGenerada(img);
    setImagenDescargada(false);
    setPantalla("resumen");
  };

  const descargarImagen = () => {
    const a = document.createElement("a");
    a.href = imagenGenerada;
    a.download = `checklist-${propiedadSeleccionada.nombre.replace(/\s/g, "_")}-${tipoVisita}-${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
    setImagenDescargada(true);
  };

  const generarMensajeWA = () => {
    const fecha = new Date().toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const hora = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
    const pColor = puntaje >= 80 ? "🟢" : puntaje >= 60 ? "🟡" : "🔴";
    const bloqueProgreso = () => {
      const llenos = Math.round(puntaje / 10);
      return "🟩".repeat(llenos) + "⬜".repeat(10 - llenos);
    };
    let msg = `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🏠 *${propiedadSeleccionada.nombre.toUpperCase()}*\n`;
    msg += `${tipoVisita === "llegada" ? "🚪 Llegada" : "🚶 Salida"} · 👤 ${quien}\n`;
    msg += `📅 ${fecha} · ${hora}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    msg += `${pColor} *ESTADO: ${puntaje}%*\n`;
    msg += `${bloqueProgreso()}\n\n`;
    msg += `✅ ${totalSi} correctos   ❌ ${totalNo} con problema\n`;
    if (totalNA > 0) msg += `➖ ${totalNA} sin revisar\n`;
    msg += `\n`;
    if (itemsConProblemas.length === 0) {
      msg += `✨ *Todo en perfecto orden.*\n`;
    } else {
      msg += `⚠️ *PUNTOS CON PROBLEMA:*\n\n`;
      itemsConProblemas.forEach((i) => {
        msg += `❌ ${i.item}\n`;
        msg += `   _(${i.seccion})_\n`;
        if (i.obs) msg += `   📝 ${i.obs}\n`;
        msg += `\n`;
      });
    }
    if (observacionesGenerales) {
      msg += `━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `📋 *Observaciones:*\n${observacionesGenerales}\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `_*(La imagen con el reporte completo va adjunta)*_`;
    return encodeURIComponent(msg);
  };

  const abrirWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${generarMensajeWA()}`, "_blank");
  };

  const resetear = () => {
    setPantalla("inicio");
    setPropiedadSeleccionada(null);
    setTipoVisita("llegada");
    setQuien("");
    setRespuestas({});
    setObservacionesItem({});
    setObservacionesGenerales("");
    setSeccionActiva(0);
    setImagenGenerada(null);
    setImagenDescargada(false);
  };

  // ── PANTALLA INICIO ────────────────────────────────────────────────────────
  if (pantalla === "inicio") {
    return (
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.fondo, minHeight: "100vh", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ background: C.azulOscuro, padding: "36px 24px 28px" }}>
          <p style={{ color: C.azulClaro, fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 8px" }}>Propiedades Familia</p>
          <h1 style={{ color: "white", fontSize: 26, fontWeight: 800, margin: "0 0 6px", lineHeight: 1.2 }}>Checklist de<br />Mantenimiento</h1>
          <p style={{ color: "#8BA8C4", fontSize: 13, margin: 0 }}>Registra el estado de la propiedad<br />al llegar y al salir.</p>
        </div>

        <div style={{ padding: "24px 20px" }}>
          {/* Quién */}
          <div style={{ background: C.blanco, borderRadius: 16, padding: "18px", marginBottom: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
            <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 13, color: C.azulOscuro }}>👤 ¿Quién llena este checklist?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {FAMILIARES.map((nombre) => (
                <button key={nombre} onClick={() => setQuien(nombre)}
                  style={{ padding: "11px 16px", borderRadius: 10, border: `2px solid ${quien === nombre ? C.azulMedio : C.grisClaro}`, background: quien === nombre ? C.azulMedio : "white", color: quien === nombre ? "white" : C.azulOscuro, fontWeight: quien === nombre ? 700 : 500, fontSize: 14, cursor: "pointer", textAlign: "left", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 10 }}>
                  <span>{quien === nombre ? "✓" : "👤"}</span>{nombre}
                </button>
              ))}
            </div>
          </div>

          {/* Tipo visita */}
          <div style={{ background: C.blanco, borderRadius: 16, padding: "18px", marginBottom: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
            <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 13, color: C.azulOscuro }}>📋 Tipo de revisión</p>
            <div style={{ display: "flex", gap: 10 }}>
              {[{ id: "llegada", label: "🚪 A la llegada" }, { id: "salida", label: "🚶 A la salida" }].map((op) => (
                <button key={op.id} onClick={() => setTipoVisita(op.id)}
                  style={{ flex: 1, padding: "12px", borderRadius: 12, border: `2px solid ${tipoVisita === op.id ? C.azulMedio : C.grisClaro}`, background: tipoVisita === op.id ? C.azulMedio : "white", color: tipoVisita === op.id ? "white" : C.gris, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          {/* Propiedad */}
          <div style={{ background: C.blanco, borderRadius: 16, padding: "18px", marginBottom: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
            <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 13, color: C.azulOscuro }}>🏠 ¿Qué propiedad revisas?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PROPIEDADES.map((prop) => (
                <button key={prop.id} onClick={() => setPropiedadSeleccionada(prop)}
                  style={{ padding: "14px 16px", borderRadius: 12, border: `2px solid ${propiedadSeleccionada?.id === prop.id ? C.azulMedio : C.grisClaro}`, background: propiedadSeleccionada?.id === prop.id ? "#EEF4FB" : "white", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "all 0.2s" }}>
                  <span style={{ fontSize: 24 }}>{prop.icono}</span>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: C.azulOscuro }}>{prop.nombre}</p>
                    <p style={{ margin: 0, fontSize: 11, color: C.gris }}>{prop.ubicacion}</p>
                  </div>
                  {propiedadSeleccionada?.id === prop.id && <span style={{ marginLeft: "auto", color: C.azulMedio, fontSize: 18 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => { if (propiedadSeleccionada && quien.trim()) { setPantalla("form"); setSeccionActiva(0); } }}
            disabled={!propiedadSeleccionada || !quien.trim()}
            style={{ width: "100%", padding: "16px", background: propiedadSeleccionada && quien.trim() ? C.azulOscuro : C.grisClaro, color: propiedadSeleccionada && quien.trim() ? "white" : C.gris, border: "none", borderRadius: 14, fontWeight: 800, fontSize: 16, cursor: propiedadSeleccionada && quien.trim() ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
            Comenzar checklist →
          </button>
        </div>
      </div>
    );
  }

  // ── PANTALLA FORMULARIO ────────────────────────────────────────────────────
  if (pantalla === "form") {
    const seccion = SECCIONES_CHECKLIST[seccionActiva];
    const esUltima = seccionActiva === SECCIONES_CHECKLIST.length - 1;

    return (
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.fondo, minHeight: "100vh", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ background: C.azulOscuro, padding: "16px 20px", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <p style={{ color: C.azulClaro, fontSize: 11, margin: 0, fontWeight: 600 }}>{propiedadSeleccionada.icono} {propiedadSeleccionada.nombre} · {tipoVisita === "llegada" ? "Llegada" : "Salida"}</p>
              <p style={{ color: "white", fontWeight: 700, fontSize: 15, margin: "2px 0 0" }}>{seccion.icono} {seccion.titulo}</p>
            </div>
            <span style={{ color: "#8BA8C4", fontSize: 12, fontWeight: 700 }}>{seccionActiva + 1}/{SECCIONES_CHECKLIST.length}</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, height: 6, overflow: "hidden" }}>
            <div style={{ background: C.azulClaro, width: `${progreso}%`, height: "100%", borderRadius: 6, transition: "width 0.4s" }} />
          </div>
          <p style={{ color: "#8BA8C4", fontSize: 10, margin: "4px 0 0" }}>{progreso}% completado</p>
        </div>

        <div style={{ overflowX: "auto", display: "flex", gap: 6, padding: "10px 16px", background: "#1C2B3A", whiteSpace: "nowrap" }}>
          {SECCIONES_CHECKLIST.map((sec, idx) => {
            const completa = sec.items.every((_, i) => respuestas[`${sec.id}_${i}`]);
            return (
              <button key={sec.id} onClick={() => setSeccionActiva(idx)}
                style={{ padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, flexShrink: 0, background: idx === seccionActiva ? C.azulClaro : completa ? "#1A3C2B" : "rgba(255,255,255,0.1)", color: idx === seccionActiva ? "white" : completa ? "#4BAF74" : "#8BA8C4" }}>
                {completa ? "✓ " : ""}{sec.titulo.split(" ")[0]}
              </button>
            );
          })}
        </div>

        <div style={{ padding: "16px 20px 100px" }}>
          {seccion.items.map((item, idx) => {
            const resp = getRespuesta(seccion.id, idx);
            const obs = getObsItem(seccion.id, idx);
            return (
              <div key={idx} style={{ background: C.blanco, borderRadius: 14, padding: "14px 16px", marginBottom: 10, boxShadow: "0 1px 5px rgba(0,0,0,0.06)", borderLeft: resp === "no" ? `4px solid ${C.rojoNo}` : resp === "si" ? `4px solid ${C.verdeSi}` : `4px solid ${C.grisClaro}` }}>
                <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: C.azulOscuro, lineHeight: 1.4 }}>{item}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setRespuesta(seccion.id, idx, "si")}
                    style={{ flex: 1, padding: "9px", borderRadius: 10, border: `2px solid ${resp === "si" ? C.verdeSi : C.grisClaro}`, background: resp === "si" ? C.verdeSi : "white", color: resp === "si" ? "white" : C.gris, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
                    ✓ Sí
                  </button>
                  <button onClick={() => setRespuesta(seccion.id, idx, "no")}
                    style={{ flex: 1, padding: "9px", borderRadius: 10, border: `2px solid ${resp === "no" ? C.rojoNo : C.grisClaro}`, background: resp === "no" ? C.rojoNo : "white", color: resp === "no" ? "white" : C.gris, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
                    ✗ No
                  </button>
                </div>
                {resp === "no" && (
                  <textarea placeholder="¿Qué está mal? Describe el problema..." value={obs}
                    onChange={(e) => setObsItem(seccion.id, idx, e.target.value)}
                    style={{ width: "100%", marginTop: 10, padding: "10px", borderRadius: 10, border: `1.5px solid #FECACA`, background: "#FEF2F2", fontSize: 12, resize: "none", height: 70, outline: "none", boxSizing: "border-box", color: C.azulOscuro }} />
                )}
              </div>
            );
          })}

          {esUltima && (
            <div style={{ background: C.blanco, borderRadius: 14, padding: "16px", marginBottom: 10, boxShadow: "0 1px 5px rgba(0,0,0,0.06)" }}>
              <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: C.azulOscuro }}>📝 Observaciones generales</p>
              <textarea placeholder="Escribe cualquier comentario adicional sobre la propiedad..." value={observacionesGenerales}
                onChange={(e) => setObservacionesGenerales(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: 10, border: `1.5px solid ${C.grisClaro}`, fontSize: 13, resize: "none", height: 90, outline: "none", boxSizing: "border-box", color: C.azulOscuro }} />
            </div>
          )}
        </div>

        <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "white", borderTop: `1px solid ${C.grisClaro}`, padding: "12px 20px", display: "flex", gap: 10, boxSizing: "border-box" }}>
          {seccionActiva > 0 && (
            <button onClick={() => setSeccionActiva((p) => p - 1)}
              style={{ flex: 1, padding: "13px", borderRadius: 12, border: `2px solid ${C.grisClaro}`, background: "white", color: C.azulOscuro, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              ← Anterior
            </button>
          )}
          {!esUltima ? (
            <button onClick={() => setSeccionActiva((p) => p + 1)}
              style={{ flex: 2, padding: "13px", borderRadius: 12, border: "none", background: C.azulMedio, color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Siguiente →
            </button>
          ) : (
            <button onClick={entrarAResumen}
              style={{ flex: 2, padding: "13px", borderRadius: 12, border: "none", background: C.verdeSi, color: "white", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
              Ver resumen ✓
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── PANTALLA RESUMEN ───────────────────────────────────────────────────────
  if (pantalla === "resumen") {
    const pColor = puntaje >= 80 ? C.verdeSi : puntaje >= 60 ? C.dorado : C.rojoNo;

    return (
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.fondo, minHeight: "100vh", maxWidth: 480, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: C.azulOscuro, padding: "24px 20px 20px" }}>
          <p style={{ color: C.azulClaro, fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 4px" }}>{propiedadSeleccionada.icono} {propiedadSeleccionada.nombre}</p>
          <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>Reporte listo ✓</h2>
          <p style={{ color: "#8BA8C4", fontSize: 12, margin: 0 }}>{tipoVisita === "llegada" ? "🚪 Llegada" : "🚶 Salida"} · {quien}</p>
        </div>

        <div style={{ padding: "20px" }}>

          {/* Tarjeta resumen rápido + thumbnail lado a lado */}
          <div style={{ background: C.blanco, borderRadius: 16, padding: "16px", marginBottom: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", display: "flex", gap: 14, alignItems: "center" }}>
            {/* Puntaje */}
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 2px", fontSize: 12, color: C.gris }}>Estado general</p>
              <p style={{ margin: "0 0 4px", fontSize: 38, fontWeight: 800, color: pColor, lineHeight: 1 }}>{puntaje}%</p>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: pColor, fontWeight: 600 }}>
                {puntaje >= 80 ? "✅ Buen estado" : puntaje >= 60 ? "⚠️ Requiere atención" : "❌ Necesita mantenimiento"}
              </p>
              <p style={{ margin: "2px 0", fontSize: 12, color: C.verdeSi, fontWeight: 600 }}>✓ {totalSi} correctos</p>
              <p style={{ margin: "2px 0", fontSize: 12, color: C.rojoNo, fontWeight: 600 }}>✗ {totalNo} con problema</p>
              {totalNA > 0 && <p style={{ margin: "2px 0", fontSize: 11, color: C.gris }}>— {totalNA} sin revisar</p>}
            </div>

            {/* Thumbnail imagen — tamaño fijo, NO se expande */}
            {imagenGenerada && (
              <div style={{ width: 130, flexShrink: 0 }}>
                <img
                  src={imagenGenerada}
                  alt="Preview reporte"
                  style={{ width: 130, height: 82, objectFit: "cover", objectPosition: "top", borderRadius: 10, display: "block", border: `2px solid ${C.grisClaro}` }}
                />
                <p style={{ margin: "5px 0 0", fontSize: 10, color: C.gris, textAlign: "center" }}>Vista previa del reporte</p>
              </div>
            )}
          </div>

          {/* ── PASO 1: WhatsApp — lo más importante primero ── */}
          <div style={{ background: "#F0FDF4", borderRadius: 16, padding: "18px", marginBottom: 12, border: `2px solid ${C.verdeSi}`, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.verdeSi, color: "white", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>1</div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: C.azulOscuro }}>Enviar mensaje al grupo</p>
            </div>
            <p style={{ margin: "0 0 12px", fontSize: 12, color: C.gris, paddingLeft: 38 }}>
              WhatsApp se abre con el mensaje <strong>ya escrito y listo</strong>. Solo toca <strong>Enviar</strong>.
            </p>
            <button onClick={abrirWhatsApp}
              style={{ width: "100%", padding: "14px", background: "#25D366", border: "none", borderRadius: 12, color: "white", fontWeight: 800, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>💬</span> Abrir WhatsApp — Enviar mensaje
            </button>
          </div>

          {/* ── PASO 2: Descargar imagen ── */}
          <div style={{ background: C.blanco, borderRadius: 16, padding: "18px", marginBottom: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: imagenDescargada ? C.verdeSi : C.azulMedio, color: "white", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {imagenDescargada ? "✓" : "2"}
              </div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: C.azulOscuro }}>Descargar imagen del reporte</p>
            </div>
            <p style={{ margin: "0 0 12px", fontSize: 12, color: C.gris, paddingLeft: 38 }}>
              Se guarda en tu galería. Desde WhatsApp adjúntala al grupo junto con el mensaje.
            </p>
            <button onClick={descargarImagen}
              style={{ width: "100%", padding: "13px", background: imagenDescargada ? "#EEF9F3" : C.azulOscuro, border: `2px solid ${imagenDescargada ? C.verdeSi : "transparent"}`, borderRadius: 12, color: imagenDescargada ? C.verdeSi : "white", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {imagenDescargada ? "✓ Imagen descargada — ya está en tu galería" : "⬇️  Descargar imagen"}
            </button>
          </div>

          {/* Acciones secundarias */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button onClick={() => { setPantalla("form"); setSeccionActiva(0); }}
              style={{ flex: 1, padding: "13px", background: "white", border: `2px solid ${C.grisClaro}`, borderRadius: 14, color: C.azulOscuro, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              ← Editar
            </button>
            <button onClick={resetear}
              style={{ flex: 1, padding: "13px", background: "white", border: `2px solid ${C.grisClaro}`, borderRadius: 14, color: C.gris, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              Nuevo checklist
            </button>
          </div>
        </div>
      </div>
    );
  }
}
