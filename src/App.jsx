import { useState, useCallback, createContext, useContext, useEffect } from "react";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const DATA = {
  matin: [
    {
      section: "Cabines",
      color: "#7BB5C4",
      icon: "🛁",
      tasks: [
        "Mettre les petites poubelles dans les cabines",
        "Mettre les flacons de vinaigre/eau dans les cabines",
        "Remplir les sprays d'eau douce",
        "Vérifier la propreté de l'eau — épuisette si besoin",
        "Lancer la filtration des bassins",
      ],
    },
    {
      section: "Serviettes",
      color: "#8BA888",
      icon: "🧺",
      tasks: [
        "Compter les serviettes restant de la veille",
        "Lancer une ou deux machines si besoin",
        "Garder les serviettes propres à plier pour plus tard",
      ],
    },
    {
      section: "Zone poupounage & WC",
      color: "#C4A87B",
      icon: "🚿",
      tasks: [
        "Nettoyer les WC : spray javel + liquide WC (éponge bord coupé)",
        "Nettoyer l'évier : spray vinaigre + bicarbonate (autre éponge)",
        "Zone poupounage : plateau, sèche-cheveux, produits de beauté (spray vinaigre + bicarbonate)",
      ],
    },
    {
      section: "Jiao Gulan",
      color: "#B07BC4",
      icon: "🍵",
      tasks: [
        "Remplir 2 boules à thé à moitié avec du Jiao Gulan",
        "Thermostat sur 4 jusqu'à ce que ça ne chauffe plus, puis baisser à 2",
      ],
    },
    {
      section: "Ménage",
      color: "#7B9BC4",
      icon: "🧹",
      tasks: [
        "Aspirer tout le centre — étage compris (~1j/2) et le dojo, sol et futons",
        "Vider l'aspirateur après utilisation",
        "Passer un coup de serpillère dans tout le centre (~1j/2)",
        "Vérifier que le Dojo et le Salon japonais soient accueillants",
      ],
    },
    {
      section: "Machines",
      color: "#C47B7B",
      icon: "🔄",
      tasks: [
        "Mettre les machines en route dès 11 serviettes sales",
        "Faire tourner les machines le plus souvent possible",
      ],
    },
  ],

  soir: [
    {
      section: "Cabines",
      color: "#7BB5C4",
      icon: "🛁",
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
      color: "#C47B7B",
      icon: "🗑️",
      tasks: [
        "Sortir + changer sac : cuisine + RECYCLABLE",
        "Sortir + changer sac : évier d'en bas",
        "Sortir + changer sac : zone post-float",
        "Sortir + changer sac : toilettes",
      ],
    },
    {
      section: "Zone Post-float",
      color: "#C4A87B",
      icon: "✨",
      tasks: [
        "Remettre cotons-tiges et disques démaquillants si besoin",
        "Spray sur la poubelle + WC + produits de beauté",
        "⚡ Spray sur les sèche-cheveux et le meuble",
      ],
    },
    {
      section: "Cuisine",
      color: "#8BA888",
      icon: "🍽️",
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
      color: "#8BA888",
      icon: "🚪",
      note: "Possible pendant la dernière séance",
      tasks: [
        "Spray sur la table des explications",
        "Spray sur les tongs usagées et les ranger",
        "Rassembler les coussins : table explications + futon à côté de la salle de soins",
      ],
    },
    {
      section: "Machines",
      color: "#7B9BC4",
      icon: "🔄",
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
      color: "#B07BC4",
      icon: "🍵",
      tasks: [
        "Éteindre l'appareil",
        "Vider l'infusion",
        "Jeter le contenu des boules à thé",
        "Éponge dans la cuve",
      ],
    },
    {
      section: "Autre",
      color: "#7BB5C4",
      icon: "📋",
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
      color: "#8BA888",
      icon: "🧹",
      tasks: [
        "Miroirs, meuble à chaussures/chaussons",
        "Poussière : meuble entrée, sous les tasses zone bar, tuyauterie, rambardes, échelle...",
        "Se référer à ASANA si besoin",
        "Centre aussi accueillant que possible — ne pas lésiner sur le torchon et le sanitol",
      ],
    },
  ],

  hebdo: {
    Lundi: {
      journee: [
        "Rangement et nettoyage du comptoir + étagères + meuble porte-manteau entrée",
        "Dépoussiérer et passer l'aspirateur derrière si besoin",
      ],
      soiree: [
        "Nettoyer les casiers pour les chaussures",
        "Arroser les plantes",
        "SFA 200mL",
      ],
      produit: "SFA 200mL",
    },
    Mardi: {
      journee: [
        "Dépoussiérer/nettoyer toutes les surfaces boisées côté cuisine et salon japonais",
        "Remise en ordre/en beauté des espaces pour les flotteurs",
      ],
      soiree: [
        "Nettoyage approfondi de la cuisine : détartrage évier, plaques, placard sous l'évier, table...",
      ],
      produit: "Enzymes",
    },
    Mercredi: {
      journee: [
        "Ménage salle de soin : vider poubelle, dépoussiérer/nettoyer surfaces, retirer toiles d'araignée, passer l'aspirateur",
      ],
      soiree: [
        "Dépoussiérer/nettoyer toutes les surfaces boisées côté dojo",
        "Remise en ordre/en beauté des espaces pour les flotteurs",
      ],
      produit: "Javel",
    },
    Jeudi: {
      journee: [
        "Nettoyer meubles cabines (traces de sel et poussière)",
        "Déplacer meubles si besoin pour dépoussiérer et passer l'aspirateur derrière",
      ],
      soiree: [
        "Ranger/trier/nettoyer les bureaux (vitres dessus + surfaces dessous)",
        "Nettoyer le coin repos derrière la cuisine",
      ],
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

// ── Global tick context ──────────────────────────────────────────────────────
const TickContext = createContext(null);

function useTick() {
  return useContext(TickContext);
}

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
    ? [
        { section: "Journée", tasks: DATA.hebdo[day]?.journee || [] },
        { section: "Soirée", tasks: DATA.hebdo[day]?.soiree || [] },
      ]
    : DATA[tab];
  sections.forEach(s => {
    s.tasks.forEach(t => {
      total++;
      if (readChecked(getKey(tab, s.section, t, day))) done++;
    });
  });
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

// ── CheckItem ────────────────────────────────────────────────────────────────
function CheckItem({ label, storageKey, color }) {
  const tick = useTick();
  const checked = readChecked(storageKey);

  const toggle = useCallback((e) => {
    e.stopPropagation();
    writeChecked(storageKey, !checked);
    tick();
  }, [storageKey, checked, tick]);

  const isWarn = label.startsWith("⚠️");
  const isHL = label.startsWith("⚡");

  return (
    <div
      onClick={toggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "14px 16px",
        marginBottom: "6px",
        borderRadius: "12px",
        background: checked
          ? "rgba(255,255,255,0.03)"
          : isWarn
          ? "rgba(240,192,112,0.08)"
          : isHL
          ? `rgba(${hexToRgb(color)},0.1)`
          : "rgba(255,255,255,0.06)",
        cursor: "pointer",
        userSelect: "none",
        transition: "background 0.15s, transform 0.1s",
        border: checked
          ? "1px solid rgba(255,255,255,0.04)"
          : isWarn
          ? "1px solid rgba(240,192,112,0.2)"
          : isHL
          ? `1px solid rgba(${hexToRgb(color)},0.3)`
          : "1px solid rgba(255,255,255,0.08)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Checkbox */}
      <div style={{
        width: "28px",
        height: "28px",
        borderRadius: "8px",
        flexShrink: 0,
        border: checked ? "none" : `2px solid ${checked ? color : "rgba(255,255,255,0.2)"}`,
        background: checked ? color : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s",
      }}>
        {checked && (
          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
            <path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#0d1117" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Label */}
      <span style={{
        fontSize: "15px",
        lineHeight: "1.4",
        fontWeight: checked ? "400" : "500",
        color: checked
          ? "rgba(255,255,255,0.2)"
          : isWarn
          ? "#f0c070"
          : isHL
          ? "#a8d8e8"
          : "rgba(255,255,255,0.88)",
        textDecoration: checked ? "line-through" : "none",
        transition: "all 0.15s",
        flex: 1,
      }}>
        {label}
      </span>
    </div>
  );
}

// ── Section card ─────────────────────────────────────────────────────────────
function Section({ data, tab, day }) {
  const tick = useTick();
  const [open, setOpen] = useState(true);

  const keys = data.tasks.map(t => getKey(tab, data.section, t, day));
  const doneCount = keys.filter(readChecked).length;
  const total = data.tasks.length;
  const allDone = doneCount === total;

  return (
    <div style={{ marginBottom: "16px" }}>
      {/* Section header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 16px",
          background: allDone
            ? `rgba(${hexToRgb(data.color)},0.12)`
            : "rgba(255,255,255,0.05)",
          borderRadius: open ? "14px 14px 0 0" : "14px",
          cursor: "pointer",
          borderLeft: `4px solid ${data.color}`,
          transition: "background 0.2s",
        }}
      >
        <span style={{ fontSize: "22px", lineHeight: 1 }}>{data.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: "700", color: allDone ? data.color : "rgba(255,255,255,0.9)", letterSpacing: "0.02em" }}>
            {data.section}
          </div>
          {data.note && (
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{data.note}</div>
          )}
        </div>

        {/* Mini progress pill */}
        <div style={{
          padding: "4px 10px",
          borderRadius: "20px",
          background: allDone ? data.color : "rgba(255,255,255,0.07)",
          fontSize: "12px",
          fontWeight: "700",
          color: allDone ? "#0d1117" : "rgba(255,255,255,0.4)",
          minWidth: "48px",
          textAlign: "center",
        }}>
          {allDone ? "✓" : `${doneCount}/${total}`}
        </div>

        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "0.2s", opacity: 0.3, flexShrink: 0 }}>
          <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Tasks */}
      {open && (
        <div style={{
          padding: "10px 0 4px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "0 0 14px 14px",
          borderLeft: `4px solid ${data.color}`,
          borderRight: "1px solid rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}>
          {data.tasks.map((task, i) => (
            <CheckItem
              key={i}
              label={task}
              storageKey={keys[i]}
              color={data.color}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ tab, day }) {
  const { done, total, pct } = countProgress(tab, day);
  const allDone = done === total && total > 0;

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
          {done} / {total} tâches
        </span>
        <span style={{ fontSize: "13px", fontWeight: "700", color: allDone ? "#8BA888" : "#7BB5C4" }}>
          {allDone ? "✓ Tout bon !" : `${pct}%`}
        </span>
      </div>
      <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: allDone
            ? "linear-gradient(90deg, #8BA888, #7BB5C4)"
            : `linear-gradient(90deg, #7BB5C4, #7B9BC4)`,
          borderRadius: "3px",
          transition: "width 0.35s ease",
        }} />
      </div>
    </div>
  );
}

// ── Hebdo view ────────────────────────────────────────────────────────────────
function HebdoView() {
  const todayIdx = new Date().getDay();
  const todayName = DAYS[todayIdx === 0 ? 6 : todayIdx - 1];
  const [day, setDay] = useState(todayName);
  const data = DATA.hebdo[day];

  const sections = [
    { section: "Journée (8h-15h)", color: "#7BB5C4", icon: "☀️", tasks: data.journee },
    { section: "Soirée (14h30-23h)", color: "#C4A87B", icon: "🌙", tasks: data.soiree },
  ].filter(s => s.tasks.length > 0);

  return (
    <div>
      {/* Day selector */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", marginBottom: "16px", scrollbarWidth: "none" }}>
        {DAYS.map(d => (
          <button key={d} onClick={() => setDay(d)} style={{
            flexShrink: 0,
            padding: "10px 14px",
            borderRadius: "12px",
            border: "none",
            background: d === day ? "#7BB5C4" : "rgba(255,255,255,0.06)",
            color: d === day ? "#0d1117" : "rgba(255,255,255,0.5)",
            fontSize: "13px",
            fontWeight: d === day ? "800" : "400",
            cursor: "pointer",
            letterSpacing: "0.01em",
          }}>{d.slice(0, 3)}</button>
        ))}
      </div>

      {/* Produit du jour */}
      {data.produit && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 16px",
          background: "rgba(176,123,196,0.1)",
          borderRadius: "12px",
          border: "1px solid rgba(176,123,196,0.25)",
          marginBottom: "16px",
        }}>
          <span style={{ fontSize: "20px" }}>🧪</span>
          <div>
            <div style={{ fontSize: "10px", fontWeight: "700", color: "#B07BC4", letterSpacing: "0.08em", marginBottom: "2px" }}>PRODUIT DU JOUR</div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "rgba(255,255,255,0.9)" }}>{data.produit}</div>
          </div>
        </div>
      )}

      <ProgressBar tab="hebdo" day={day} />

      {sections.map((s, i) => (
        <Section key={i} data={s} tab="hebdo" day={day} />
      ))}

      {sections.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.2)", fontSize: "15px" }}>
          Pas de tâches spécifiques ce jour.
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
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
    { id: "soir", label: "Soir", icon: "🌙" },
    { id: "hebdo", label: "Hebdo", icon: "📅" },
  ];

  const resetAll = () => {
    if (!confirm("Réinitialiser toutes les tâches ?")) return;
    Object.keys(localStorage).filter(k => k.startsWith("meiso||")).forEach(k => localStorage.removeItem(k));
    bump();
  };

  return (
    <TickContext.Provider value={bump}>
      <div style={{ minHeight: "100vh", background: "#0d1117", color: "white", maxWidth: "480px", margin: "0 auto" }}>

        {/* Sticky header */}
        <div style={{
          position: "sticky", top: 0, zIndex: 10,
          background: "#0d1117",
          paddingTop: "env(safe-area-inset-top, 14px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
          <div style={{ padding: "16px 20px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "3px" }}>
                  {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                </div>
                <div style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.03em" }}>
                  Meiso <span style={{ color: "#7BB5C4", fontWeight: "300" }}>·</span> Tâches
                </div>
              </div>
              <button onClick={resetAll} style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                color: "rgba(255,255,255,0.3)",
                fontSize: "12px",
                padding: "8px 12px",
                cursor: "pointer",
              }}>↺ Reset</button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "0" }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  flex: 1,
                  padding: "10px 6px",
                  border: "none",
                  borderBottom: tab === t.id ? "3px solid #7BB5C4" : "3px solid transparent",
                  background: "transparent",
                  color: tab === t.id ? "#7BB5C4" : "rgba(255,255,255,0.3)",
                  fontSize: "13px",
                  fontWeight: tab === t.id ? "700" : "400",
                  cursor: "pointer",
                  letterSpacing: "0.01em",
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
              {DATA[tab].map((section, i) => (
                <Section key={i} data={section} tab={tab} />
              ))}
            </>
          )}

          {tab === "hebdo" && <HebdoView key={`hebdo-${tick}`} />}
        </div>
      </div>
    </TickContext.Provider>
  );
}
