import { useState, useEffect, useCallback } from "react";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const DATA = {
  matin: [
    {
      section: "Cabines",
      color: "#7BB5C4",
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
      tasks: [
        "Compter les serviettes restant de la veille",
        "Lancer une ou deux machines si besoin",
        "Garder les serviettes propres à plier pour plus tard",
      ],
    },
    {
      section: "Zone poupounage & WC",
      color: "#C4A87B",
      tasks: [
        "Nettoyer les WC : spray javel + liquide WC (éponge bord coupé)",
        "Nettoyer l'évier : spray vinaigre + bicarbonate (autre éponge)",
        "Zone poupounage : plateau, sèche-cheveux, produits de beauté (spray vinaigre + bicarbonate)",
      ],
    },
    {
      section: "Jiao Gulan",
      color: "#B07BC4",
      tasks: [
        "Remplir 2 boules à thé à moitié avec du Jiao Gulan",
        "Thermostat sur 4 jusqu'à ce que ça ne chauffe plus, puis baisser à 2",
      ],
    },
    {
      section: "Ménage",
      color: "#7B9BC4",
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
      tasks: [
        "Remettre cotons-tiges et disques démaquillants si besoin",
        "Spray sur la poubelle et celle des WC + produits de beauté",
        "⚡ Spray sur les sèche-cheveux et le meuble",
      ],
    },
    {
      section: "Cuisine",
      color: "#8BA888",
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
      journee: [
        "Nettoyer les vitres (porte d'entrée intérieur et extérieur...)",
      ],
      soiree: [
        "Nettoyer le frigo + trier/jeter si besoin",
      ],
      produit: "Javel",
    },
    Samedi: {
      journee: [],
      soiree: [],
      produit: "Enzymes",
    },
    Dimanche: {
      journee: [],
      soiree: [],
      produit: "Enzymes",
    },
  },
};

function getKey(tab, section, task, day) {
  return `meiso||${tab}||${day || ""}||${section}||${task}`;
}

function useChecked(key) {
  const [checked, setChecked] = useState(() => {
    try { return localStorage.getItem(key) === "1"; } catch { return false; }
  });
  const toggle = useCallback(() => {
    setChecked(v => {
      const next = !v;
      try { localStorage.setItem(key, next ? "1" : "0"); } catch {}
      return next;
    });
  }, [key]);
  return [checked, toggle];
}

function CheckItem({ label, storageKey }) {
  const [checked, toggle] = useChecked(storageKey);
  const isWarn = label.startsWith("⚠️");
  const isHighlight = label.startsWith("⚡");

  return (
    <div onClick={toggle} style={{
      display: "flex", alignItems: "flex-start", gap: "12px",
      padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
      cursor: "pointer", userSelect: "none",
    }}>
      <div style={{
        width: "20px", height: "20px", borderRadius: "5px", flexShrink: 0, marginTop: "2px",
        border: checked ? "none" : "1.5px solid rgba(255,255,255,0.25)",
        background: checked ? "#7BB5C4" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}>
        {checked && <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path d="M1 4L4 7.5L10 1" stroke="#0d1117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>}
      </div>
      <span style={{
        fontSize: "14px", lineHeight: "1.5",
        color: checked ? "rgba(255,255,255,0.25)" : isWarn ? "#f0c070" : isHighlight ? "#a8d8e8" : "rgba(255,255,255,0.82)",
        textDecoration: checked ? "line-through" : "none",
        transition: "all 0.15s",
      }}>{label}</span>
    </div>
  );
}

function Section({ data, tab, day }) {
  const [open, setOpen] = useState(true);
  const keys = data.tasks.map(t => getKey(tab, data.section, t, day));
  
  const doneCount = keys.filter(k => {
    try { return localStorage.getItem(k) === "1"; } catch { return false; }
  }).length;

  return (
    <div style={{ marginBottom: "12px" }}>
      <div onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "11px 14px", background: "rgba(255,255,255,0.04)",
        borderRadius: open ? "10px 10px 0 0" : "10px",
        cursor: "pointer", borderLeft: `3px solid ${data.color}`,
      }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "700", color: data.color, letterSpacing: "0.06em" }}>
            {data.section.toUpperCase()}
          </div>
          {data.note && <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "1px" }}>{data.note}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", color: doneCount === data.tasks.length ? "#7BB5C4" : "rgba(255,255,255,0.3)" }}>
            {doneCount}/{data.tasks.length}
          </span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", opacity: 0.4 }}>
            <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      {open && (
        <div style={{ padding: "0 14px", background: "rgba(255,255,255,0.02)", borderRadius: "0 0 10px 10px", borderLeft: `3px solid ${data.color}` }}>
          {data.tasks.map((task, i) => (
            <CheckItem key={i} label={task} storageKey={keys[i]} />
          ))}
        </div>
      )}
    </div>
  );
}

function countProgress(tab, day) {
  let total = 0, done = 0;
  const sections = tab === "hebdo"
    ? (() => {
        const d = DATA.hebdo[day];
        return [
          { section: "Journée", tasks: d.journee },
          { section: "Soirée", tasks: d.soiree },
        ];
      })()
    : DATA[tab];

  sections.forEach(s => {
    s.tasks.forEach(t => {
      total++;
      const k = tab === "hebdo" ? getKey(tab, s.section, t, day) : getKey(tab, s.section, t);
      try { if (localStorage.getItem(k) === "1") done++; } catch {}
    });
  });
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

function HebdoView() {
  const todayIdx = new Date().getDay();
  const todayName = DAYS[todayIdx === 0 ? 6 : todayIdx - 1];
  const [day, setDay] = useState(todayName);
  const [, forceUpdate] = useState(0);
  const data = DATA.hebdo[day];
  const { done, total, pct } = countProgress("hebdo", day);

  const sections = [
    { section: "Journée (8h-15h)", color: "#7BB5C4", tasks: data.journee },
    { section: "Soirée (14h30-23h)", color: "#C4A87B", tasks: data.soiree },
  ].filter(s => s.tasks.length > 0);

  return (
    <div onClick={() => forceUpdate(n => n + 1)}>
      <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "12px", marginBottom: "12px", scrollbarWidth: "none" }}>
        {DAYS.map(d => (
          <button key={d} onClick={e => { e.stopPropagation(); setDay(d); }} style={{
            flexShrink: 0, padding: "6px 12px", borderRadius: "20px", border: "none",
            background: d === day ? "#7BB5C4" : "rgba(255,255,255,0.07)",
            color: d === day ? "#0d1117" : "rgba(255,255,255,0.5)",
            fontSize: "12px", fontWeight: d === day ? "700" : "400", cursor: "pointer",
          }}>{d.slice(0, 3)}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {data.produit && (
          <div style={{
            flex: 1, padding: "10px 14px", background: "rgba(176,123,196,0.12)",
            borderRadius: "8px", borderLeft: "3px solid #B07BC4",
          }}>
            <div style={{ fontSize: "10px", color: "#B07BC4", fontWeight: "700", letterSpacing: "0.06em", marginBottom: "2px" }}>PRODUIT DU JOUR</div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", fontWeight: "600" }}>{data.produit}</div>
          </div>
        )}
        <div style={{
          flex: 1, padding: "10px 14px", background: "rgba(123,181,196,0.1)",
          borderRadius: "8px", borderLeft: "3px solid #7BB5C4",
        }}>
          <div style={{ fontSize: "10px", color: "#7BB5C4", fontWeight: "700", letterSpacing: "0.06em", marginBottom: "2px" }}>PROGRESSION</div>
          <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", fontWeight: "600" }}>{done}/{total} — {pct}%</div>
        </div>
      </div>

      {sections.map((s, i) => (
        <Section key={i} data={s} tab="hebdo" day={day} />
      ))}

      {sections.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>
          Pas de tâches spécifiques ce jour.
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("matin");
  const [, forceUpdate] = useState(0);

  const todayIdx = new Date().getDay();
  const todayName = DAYS[todayIdx === 0 ? 6 : todayIdx - 1];
  const prog = tab !== "hebdo" ? countProgress(tab) : countProgress("hebdo", todayName);

  const tabs = [
    { id: "matin", label: "Matin", icon: "☀️" },
    { id: "soir", label: "Soir", icon: "🌙" },
    { id: "hebdo", label: "Hebdo", icon: "📅" },
  ];

  const resetAll = () => {
    if (!confirm("Réinitialiser toutes les tâches cochées ?")) return;
    Object.keys(localStorage).filter(k => k.startsWith("meiso||")).forEach(k => localStorage.removeItem(k));
    forceUpdate(n => n + 1);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "white", maxWidth: "480px", margin: "0 auto" }}>
      {/* Sticky header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "#0d1117",
        paddingTop: "env(safe-area-inset-top, 12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ padding: "16px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
            <div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "3px" }}>
                {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
              </div>
              <div style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "-0.02em" }}>
                Meiso <span style={{ color: "#7BB5C4", fontWeight: "300" }}>·</span> Tâches
              </div>
            </div>
            <button onClick={resetAll} style={{
              background: "rgba(255,255,255,0.05)", border: "none", borderRadius: "8px",
              color: "rgba(255,255,255,0.35)", fontSize: "11px", padding: "7px 11px", cursor: "pointer",
            }}>↺ Reset</button>
          </div>

          {/* Progress bar */}
          {tab !== "hebdo" && (
            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "rgba(255,255,255,0.25)", marginBottom: "5px" }}>
                <span>{prog.done} tâches complétées</span>
                <span>{prog.pct}%</span>
              </div>
              <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
                <div style={{ height: "100%", width: `${prog.pct}%`, background: prog.pct === 100 ? "#8BA888" : "#7BB5C4", borderRadius: "2px", transition: "width 0.3s ease" }} />
              </div>
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, padding: "9px 4px", border: "none",
                borderBottom: tab === t.id ? "2px solid #7BB5C4" : "2px solid transparent",
                background: "transparent",
                color: tab === t.id ? "#7BB5C4" : "rgba(255,255,255,0.3)",
                fontSize: "13px", fontWeight: tab === t.id ? "600" : "400", cursor: "pointer",
              }}>{t.icon} {t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div onClick={() => forceUpdate(n => n + 1)} style={{ padding: "16px 20px", paddingBottom: "env(safe-area-inset-bottom, 32px)" }}>
        {tab !== "hebdo" && DATA[tab].map((section, i) => (
          <Section key={i} data={section} tab={tab} />
        ))}
        {tab === "hebdo" && <HebdoView />}
      </div>
    </div>
  );
}
