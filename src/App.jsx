import { useState, useCallback, createContext, useContext } from "react";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

// Palette Meiso : bleu marine #063c56, eau #2a7fa0, sel #b8d8e8, lumière #e8f4f8
const C = {
  bg:      "#04243a",
  bgCard:  "#0a3a52",
  bgDeep:  "#062d43",
  border:  "rgba(168, 216, 232, 0.1)",
  borderHL:"rgba(168, 216, 232, 0.25)",
  eau:     "#2a7fa0",
  eauLight:"#4aa8cc",
  sel:     "#b8d8e8",
  lumiere: "#e0f2f9",
  sage:    "#3a7a6a",
  sageLight:"#5aaa8a",
  amber:   "#c4924a",
  amberLight:"#e8b870",
  lavande: "#5a6aa0",
  lavLight:"#8899cc",
  alert:   "#c46050",
  alertLight:"#f0a090",
  textPrimary:"rgba(224,242,249,0.95)",
  textSecondary:"rgba(184,216,232,0.6)",
  textMuted:"rgba(168,216,232,0.3)",
};

const DATA = {
  matin: [
    // === PRIORITAIRES ===
    {
      section: "Cabines",
      color: C.eau,
      icon: "🛁",
      priority: true,
      tasks: [
        "Mettre les petites poubelles dans les cabines",
        "Mettre les flacons de vinaigre/eau dans les cabines",
        "Remplir les sprays d'eau douce",
        "Vérifier la propreté de l'eau — épuisette si besoin",
        "Lancer la filtration des bassins",
      ],
    },
    {
      section: "Zone poupounage & WC",
      color: C.sage,
      icon: "🚿",
      priority: true,
      tasks: [
        "Nettoyer les WC : spray javel + liquide WC (éponge bord coupé)",
        "Nettoyer l'évier : spray vinaigre + bicarbonate (autre éponge)",
        "Zone poupounage : plateau, sèche-cheveux, produits de beauté",
      ],
    },
    {
      section: "Jiao Gulan",
      color: C.lavande,
      icon: "🍵",
      priority: true,
      tasks: [
        "Remplir 2 boules à thé à moitié avec du Jiao Gulan",
        "Thermostat sur 4 jusqu'à ce que ça ne chauffe plus, puis baisser à 2",
      ],
    },
    {
      section: "Ménage",
      color: C.eauLight,
      icon: "🧹",
      priority: true,
      tasks: [
        "Aspirer tout le centre — étage compris (~1j/2) et le dojo, sol et futons",
        "Vider l'aspirateur après utilisation",
        "Passer un coup de serpillère dans tout le centre (~1j/2)",
        "Vérifier que le Dojo et le Salon japonais soient accueillants",
      ],
    },
    // === SECONDAIRES ===
    {
      section: "Serviettes",
      color: C.sageLight,
      icon: "🧺",
      priority: false,
      tasks: [
        "Compter les serviettes restant de la veille",
        "Lancer une ou deux machines si besoin",
        "Garder les serviettes propres à plier pour plus tard",
      ],
    },
    {
      section: "Machines",
      color: C.amber,
      icon: "🔄",
      priority: false,
      tasks: [
        "Mettre les machines en route dès 11 serviettes sales",
        "Faire tourner les machines le plus souvent possible",
      ],
    },
  ],

  soir: [
    // === PRIORITAIRES ===
    {
      section: "Cabines",
      color: C.eau,
      icon: "🛁",
      priority: true,
      tasks: [
        "Nettoyer les cabines avec plus de soin qu'entre deux flotteurs",
        "Fermer la porte coulissante et éteindre les lumières",
        "Spray sur le repose-tête et le rincer",
        "⚡ Douchette sur les parois noires, notamment à l'entrée du bassin (traces de sel)",
        "⚡ Nettoyer le réceptacle rouge de la douche — pastille de javel si besoin",
        "⚡ Vider l'eau stagnante dans le réceptacle rouge de la zone sèche",
        "Vider les sprays d'eau douce et les rincer",
        "Vider les poubelles et les laver",
        "Remplir les tubes de gel douche/shampooing",
        "Remplir les sprays d'eau vinaigrée",
        "Secouer et plier les tapis (si secs)",
      ],
    },
    {
      section: "Poubelles",
      color: C.alert,
      icon: "🗑️",
      priority: true,
      tasks: [
        "Sortir + changer sac : cuisine + RECYCLABLE",
        "Sortir + changer sac : évier d'en bas",
        "Sortir + changer sac : zone post-float",
        "Sortir + changer sac : toilettes",
      ],
    },
    {
      section: "Machines",
      color: C.amber,
      icon: "🔄",
      priority: true,
      tasks: [
        "Nettoyer filtre, planche, sèche-linge",
        "Lancer les deux dernières machines de la journée",
        "Étendre les serviettes en rab sur le banc noir (zone post-float)",
        "Rouler les serviettes propres",
        "Étendre le tapis de l'évier",
      ],
    },
    {
      section: "Jiao Gulan",
      color: C.lavande,
      icon: "🍵",
      priority: true,
      tasks: [
        "Éteindre l'appareil",
        "Vider l'infusion",
        "Jeter le contenu des boules à thé",
        "Éponge dans la cuve",
      ],
    },
    // === SECONDAIRES (possible pendant dernière séance) ===
    {
      section: "Zone Post-float",
      color: C.sage,
      icon: "✨",
      priority: false,
      note: "Possible pendant la dernière séance",
      tasks: [
        "Remettre cotons-tiges et disques démaquillants si besoin",
        "Spray sur la poubelle + WC + produits de beauté",
        "⚡ Spray sur les sèche-cheveux et le meuble",
      ],
    },
    {
      section: "Cuisine",
      color: C.sageLight,
      icon: "🍽️",
      priority: false,
      note: "Possible pendant la dernière séance",
      tasks: [
        "Éponge sur la grande table",
        "Vaisselle faite et rangée si sèche",
        "Éponge dans l'évier",
        "⚠️ Ne pas laisser de nourriture consommable sur la grande table",
      ],
    },
    {
      section: "Entrée",
      color: C.eauLight,
      icon: "🚪",
      priority: false,
      note: "Possible pendant la dernière séance",
      tasks: [
        "Spray sur la table des explications",
        "Spray sur les tongs usagées et les ranger",
        "Rassembler les coussins : table explications + futon à côté de la salle de soins",
      ],
    },
    {
      section: "Autre",
      color: C.lavLight,
      icon: "📋",
      priority: false,
      note: "Possible pendant la dernière séance",
      tasks: [
        "Disposition des coussins : salon japonais + fatboys",
        "Vérifier le Dojo, ramasser et laver les tasses",
        "Ranger les dépliants",
        "Penser au MF du lendemain matin (de la SDS)",
        "Vider les déshumidificateurs de la SDS (dans les WC de préférence)",
      ],
    },
    {
      section: "Ménage général",
      color: C.sel,
      icon: "🧹",
      priority: false,
      tasks: [
        "Miroirs, meuble à chaussures/chaussons",
        "Poussière : meuble entrée, sous les tasses zone bar, tuyauterie, rambardes, échelle...",
        "Se référer à ASANA si besoin",
        "Centre aussi accueillant que possible — ne pas lésiner sur torchon et sanitol",
      ],
    },
  ],

  hebdo: {
    Lundi: {
      journee: [
        "Rangement et nettoyage du comptoir + étagères + meuble porte-manteau entrée",
        "Dépoussiérer et passer l'aspirateur derrière si besoin",
      ],
      soiree: ["Nettoyer les casiers pour les chaussures", "Arroser les plantes", "SFA 200mL"],
      produit: "SFA 200mL",
    },
    Mardi: {
      journee: [
        "Dépoussiérer/nettoyer toutes les surfaces boisées côté cuisine et salon japonais",
        "Remise en ordre/en beauté des espaces pour les flotteurs",
      ],
      soiree: ["Nettoyage approfondi de la cuisine : détartrage évier, plaques, placard sous l'évier, table..."],
      produit: "Enzymes",
    },
    Mercredi: {
      journee: ["Ménage salle de soin : vider poubelle, dépoussiérer/nettoyer surfaces, retirer toiles d'araignée, passer l'aspirateur"],
      soiree: ["Dépoussiérer/nettoyer toutes les surfaces boisées côté dojo", "Remise en ordre/en beauté des espaces pour les flotteurs"],
      produit: "Javel",
    },
    Jeudi: {
      journee: ["Nettoyer meubles cabines (traces de sel et poussière)", "Déplacer meubles si besoin pour dépoussiérer et passer l'aspirateur derrière"],
      soiree: ["Ranger/trier/nettoyer les bureaux (vitres dessus + surfaces dessous)", "Nettoyer le coin repos derrière la cuisine"],
      produit: "Enzymes",
    },
    Vendredi: {
      journee: ["Nettoyer les vitres (porte d'entrée intérieur et extérieur...)"],
      soiree: ["Nettoyer le frigo + trier/jeter si besoin"],
      produit: "Javel",
    },
    Samedi: { journee: [], soiree: [], produit: "Enzymes" },
    Dimanche: { journee: [], soiree: [], produit: "Enzymes" },
  },
};

const TickContext = createContext(null);
const useTick = () => useContext(TickContext);

function getKey(tab, section, task, day) {
  return `meiso||${tab}||${day || ""}||${section}||${task}`;
}
function readChecked(key) {
  try { return localStorage.getItem(key) === "1"; } catch { return false; }
}
function writeChecked(key, val) {
  try { localStorage.setItem(key, val ? "1" : "0"); } catch {}
}
function countProgress(tab, day) {
  let total = 0, done = 0;
  const sections = tab === "hebdo"
    ? [{ section: "Journée", tasks: DATA.hebdo[day]?.journee || [] }, { section: "Soirée", tasks: DATA.hebdo[day]?.soiree || [] }]
    : DATA[tab];
  sections.forEach(s => s.tasks.forEach(t => {
    total++;
    if (readChecked(getKey(tab, s.section, t, day))) done++;
  }));
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

// ── CheckItem ─────────────────────────────────────────────────────────────────
function CheckItem({ label, storageKey, color }) {
  const tick = useTick();
  const checked = readChecked(storageKey);
  const isWarn = label.startsWith("⚠️");
  const isHL   = label.startsWith("⚡");

  const toggle = useCallback((e) => {
    e.stopPropagation();
    writeChecked(storageKey, !checked);
    tick();
  }, [storageKey, checked, tick]);

  return (
    <div onClick={toggle} style={{
      display: "flex", alignItems: "center", gap: "14px",
      padding: "14px 14px",
      marginBottom: "6px",
      borderRadius: "12px",
      background: checked ? "rgba(10,58,82,0.4)"
        : isWarn ? `rgba(196,146,74,0.12)`
        : isHL   ? `rgba(${hexToRgb(color)},0.14)`
        : `rgba(${hexToRgb(color)},0.08)`,
      border: `1px solid ${
        checked ? C.border
        : isWarn ? "rgba(196,146,74,0.25)"
        : isHL   ? `rgba(${hexToRgb(color)},0.4)`
        : `rgba(${hexToRgb(color)},0.2)`}`,
      cursor: "pointer",
      userSelect: "none",
      WebkitTapHighlightColor: "transparent",
      transition: "all 0.15s",
      minHeight: "52px",
    }}>
      {/* Checkbox */}
      <div style={{
        width: "30px", height: "30px", borderRadius: "8px", flexShrink: 0,
        border: checked ? "none" : `2px solid rgba(${hexToRgb(color)},0.5)`,
        background: checked ? color : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
        boxShadow: checked ? `0 0 8px rgba(${hexToRgb(color)},0.4)` : "none",
      }}>
        {checked && (
          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
            <path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke={C.bg} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span style={{
        fontSize: "15px", lineHeight: "1.4", fontWeight: checked ? "400" : "500",
        color: checked ? C.textMuted
          : isWarn ? C.amberLight
          : isHL   ? C.eauLight
          : C.textPrimary,
        textDecoration: checked ? "line-through" : "none",
        transition: "all 0.15s",
        flex: 1,
      }}>{label}</span>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
function Section({ data, tab, day }) {
  const [open, setOpen] = useState(true);
  const keys = data.tasks.map(t => getKey(tab, data.section, t, day));
  const doneCount = keys.filter(readChecked).length;
  const total = data.tasks.length;
  const allDone = doneCount === total;

  return (
    <div style={{ marginBottom: "12px" }}>
      <div onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "14px 16px",
        background: allDone ? `rgba(${hexToRgb(data.color)},0.15)` : C.bgCard,
        borderRadius: open ? "14px 14px 0 0" : "14px",
        cursor: "pointer",
        borderLeft: `4px solid ${allDone ? data.color : "rgba(168,216,232,0.2)"}`,
        border: `1px solid ${allDone ? `rgba(${hexToRgb(data.color)},0.3)` : C.border}`,
        borderLeft: `4px solid ${data.color}`,
        transition: "background 0.2s",
      }}>
        <span style={{ fontSize: "22px", lineHeight: 1, flexShrink: 0 }}>{data.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "14px", fontWeight: "700", color: allDone ? data.color : C.textPrimary, letterSpacing: "0.01em" }}>
            {data.section}
          </div>
          {data.note && <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>{data.note}</div>}
        </div>
        <div style={{
          padding: "5px 12px", borderRadius: "20px", flexShrink: 0,
          background: allDone ? data.color : "rgba(168,216,232,0.07)",
          fontSize: "12px", fontWeight: "700",
          color: allDone ? C.bg : C.textSecondary,
          minWidth: "48px", textAlign: "center",
        }}>
          {allDone ? "✓" : `${doneCount}/${total}`}
        </div>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "0.2s", opacity: 0.3, flexShrink: 0 }}>
          <path d="M1 1L5 5L9 1" stroke={C.sel} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {open && (
        <div style={{
          padding: "10px 8px 6px",
          background: C.bgDeep,
          borderRadius: "0 0 14px 14px",
          borderLeft: `4px solid ${data.color}`,
          borderRight: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}>
          {data.tasks.map((task, i) => (
            <CheckItem key={i} label={task} storageKey={keys[i]} color={data.color} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ tab, day }) {
  const { done, total, pct } = countProgress(tab, day);
  const allDone = done === total && total > 0;
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontSize: "12px", color: C.textMuted }}>{done} / {total} tâches</span>
        <span style={{ fontSize: "13px", fontWeight: "700", color: allDone ? C.sageLight : C.eauLight }}>
          {allDone ? "✓ Tout bon !" : `${pct}%`}
        </span>
      </div>
      <div style={{ height: "5px", background: "rgba(168,216,232,0.08)", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, borderRadius: "3px", transition: "width 0.35s ease",
          background: allDone
            ? `linear-gradient(90deg, ${C.sage}, ${C.eau})`
            : `linear-gradient(90deg, ${C.eau}, ${C.eauLight})`,
        }} />
      </div>
    </div>
  );
}

// ── Section divider ────────────────────────────────────────────────────────────
function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "20px 0 12px" }}>
      <div style={{ flex: 1, height: "1px", background: C.border }} />
      <span style={{ fontSize: "10px", fontWeight: "700", color: C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: C.border }} />
    </div>
  );
}

// ── Hebdo view ─────────────────────────────────────────────────────────────────
function HebdoView() {
  const todayIdx = new Date().getDay();
  const todayName = DAYS[todayIdx === 0 ? 6 : todayIdx - 1];
  const [day, setDay] = useState(todayName);
  const data = DATA.hebdo[day];
  const sections = [
    { section: "Journée (8h-15h)", color: C.eauLight, icon: "☀️", tasks: data.journee },
    { section: "Soirée (14h30-23h)", color: C.amber, icon: "🌙", tasks: data.soiree },
  ].filter(s => s.tasks.length > 0);

  return (
    <div>
      {/* Day picker */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", marginBottom: "16px", scrollbarWidth: "none" }}>
        {DAYS.map(d => (
          <button key={d} onClick={() => setDay(d)} style={{
            flexShrink: 0, padding: "10px 14px", borderRadius: "12px", border: "none",
            background: d === day ? C.eau : C.bgCard,
            color: d === day ? C.lumiere : C.textSecondary,
            fontSize: "13px", fontWeight: d === day ? "800" : "400", cursor: "pointer",
            border: `1px solid ${d === day ? C.eau : C.border}`,
          }}>{d.slice(0, 3)}</button>
        ))}
      </div>

      {data.produit && (
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "14px 16px", marginBottom: "16px",
          background: `rgba(${hexToRgb(C.lavande)},0.15)`,
          borderRadius: "12px", border: `1px solid rgba(${hexToRgb(C.lavande)},0.3)`,
        }}>
          <span style={{ fontSize: "22px" }}>🧪</span>
          <div>
            <div style={{ fontSize: "10px", fontWeight: "700", color: C.lavLight, letterSpacing: "0.08em", marginBottom: "2px" }}>PRODUIT DU JOUR</div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: C.textPrimary }}>{data.produit}</div>
          </div>
        </div>
      )}

      <ProgressBar tab="hebdo" day={day} />

      {sections.map((s, i) => <Section key={i} data={s} tab="hebdo" day={day} />)}
      {sections.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.textMuted, fontSize: "15px" }}>
          Pas de tâches spécifiques ce jour.
        </div>
      )}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("matin");
  const [tick, setTick] = useState(0);
  const bump = useCallback(() => setTick(n => n + 1), []);

  const todayIdx = new Date().getDay();
  const todayName = DAYS[todayIdx === 0 ? 6 : todayIdx - 1];

  const tabs = [
    { id: "matin", label: "Matin", icon: "☀️" },
    { id: "soir",  label: "Soir",  icon: "🌙" },
    { id: "hebdo", label: "Hebdo", icon: "📅" },
  ];

  const resetAll = () => {
    if (!confirm("Réinitialiser toutes les tâches ?")) return;
    Object.keys(localStorage).filter(k => k.startsWith("meiso||")).forEach(k => localStorage.removeItem(k));
    bump();
  };

  const primarySections  = tab !== "hebdo" ? DATA[tab].filter(s => s.priority) : [];
  const secondarySections = tab !== "hebdo" ? DATA[tab].filter(s => !s.priority) : [];

  return (
    <TickContext.Provider value={bump}>
      <div style={{ minHeight: "100vh", background: C.bg, color: C.textPrimary, maxWidth: "480px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          position: "sticky", top: 0, zIndex: 10, background: C.bg,
          paddingTop: "env(safe-area-inset-top, 14px)",
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ padding: "16px 20px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <div>
                <div style={{ fontSize: "11px", color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "3px" }}>
                  {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                </div>
                <div style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.03em", color: C.lumiere }}>
                  meïsō <span style={{ color: C.eau, fontWeight: "300" }}>·</span> tâches
                </div>
              </div>
              <button onClick={resetAll} style={{
                background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px",
                color: C.textMuted, fontSize: "12px", padding: "8px 12px", cursor: "pointer",
              }}>↺ Reset</button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex" }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  flex: 1, padding: "10px 6px", border: "none",
                  borderBottom: tab === t.id ? `3px solid ${C.eauLight}` : "3px solid transparent",
                  background: "transparent",
                  color: tab === t.id ? C.eauLight : C.textMuted,
                  fontSize: "13px", fontWeight: tab === t.id ? "700" : "400", cursor: "pointer",
                }}>{t.icon} {t.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 16px", paddingBottom: "env(safe-area-inset-bottom, 40px)" }}>
          {tab !== "hebdo" && (
            <>
              <ProgressBar tab={tab} key={`pb-${tab}-${tick}`} />
              {primarySections.map((s, i) => <Section key={i} data={s} tab={tab} />)}
              {secondarySections.length > 0 && (
                <>
                  <Divider label="À faire aussi" />
                  {secondarySections.map((s, i) => <Section key={i} data={s} tab={tab} />)}
                </>
              )}
            </>
          )}
          {tab === "hebdo" && <HebdoView key={`hebdo-${tick}`} />}
        </div>
      </div>
    </TickContext.Provider>
  );
}
