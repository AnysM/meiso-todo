import { useState, useCallback, createContext, useContext, useEffect, useRef } from "react";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const C = {
  bg:        "#04243a",
  bgCard:    "#0a3a52",
  bgDeep:    "#062d43",
  border:    "rgba(168,216,232,0.1)",
  eau:       "#2a7fa0",
  eauLight:  "#4aa8cc",
  teal:      "#2ABFBF",
  sel:       "#b8d8e8",
  lumiere:   "#e0f2f9",
  sage:      "#3a7a6a",
  sageLight: "#5aaa8a",
  amber:     "#c4924a",
  amberLight:"#e8b870",
  lavande:   "#5a6aa0",
  lavLight:  "#8899cc",
  alert:     "#c46050",
  textPrimary:   "rgba(224,242,249,0.95)",
  textSecondary: "rgba(184,216,232,0.6)",
  textMuted:     "rgba(168,216,232,0.3)",
};

const DATA = {
  matin: [
    { section:"Cabines",             color:C.eau,       icon:"🛁", priority:true,  tasks:["Mettre les petites poubelles dans les cabines","Mettre les flacons de vinaigre/eau dans les cabines","Remplir les sprays d'eau douce","Vérifier la propreté de l'eau — épuisette si besoin","Lancer la filtration des bassins"] },
    { section:"Zone poupounage & WC",color:C.sage,      icon:"🚿", priority:true,  tasks:["Nettoyer les WC : spray javel + liquide WC (éponge bord coupé)","Nettoyer l'évier : spray vinaigre + bicarbonate (autre éponge)","Zone poupounage : plateau, sèche-cheveux, produits de beauté"] },
    { section:"Jiao Gulan",          color:C.lavande,   icon:"🍵", priority:true,  tasks:["Remplir 2 boules à thé à moitié avec du Jiao Gulan","Thermostat sur 4 jusqu'à ce que ça ne chauffe plus, puis baisser à 2"] },
    { section:"Ménage",              color:C.eauLight,  icon:"🧹", priority:true,  tasks:["Aspirer tout le centre — étage compris (~1j/2) et le dojo, sol et futons","Vider l'aspirateur après utilisation","Passer un coup de serpillère dans tout le centre (~1j/2)","Vérifier que le Dojo et le Salon japonais soient accueillants"] },
    { section:"Serviettes",          color:C.sageLight, icon:"🧺", priority:false, tasks:["Compter les serviettes restant de la veille","Lancer une ou deux machines si besoin","Garder les serviettes propres à plier pour plus tard"] },
    { section:"Machines",            color:C.amber,     icon:"🔄", priority:false, tasks:["Mettre les machines en route dès 11 serviettes sales","Faire tourner les machines le plus souvent possible"] },
  ],
  soir: [
    { section:"Cabines",             color:C.eau,       icon:"🛁", priority:true,  tasks:["Nettoyer les cabines avec plus de soin qu'entre deux flotteurs","Fermer la porte coulissante et éteindre les lumières","Spray sur le repose-tête et le rincer","⚡ Douchette sur les parois noires, notamment à l'entrée du bassin (traces de sel)","⚡ Nettoyer le réceptacle rouge de la douche — pastille de javel si besoin","⚡ Vider l'eau stagnante dans le réceptacle rouge de la zone sèche","Vider les sprays d'eau douce et les rincer","Vider les poubelles et les laver","Remplir les tubes de gel douche/shampooing","Remplir les sprays d'eau vinaigrée","Secouer et plier les tapis (si secs)"] },
    { section:"Poubelles",           color:C.alert,     icon:"🗑️", priority:true,  tasks:["Sortir + changer sac : cuisine + RECYCLABLE","Sortir + changer sac : évier d'en bas","Sortir + changer sac : zone post-float","Sortir + changer sac : toilettes"] },
    { section:"Machines",            color:C.amber,     icon:"🔄", priority:true,  tasks:["Nettoyer filtre, planche, sèche-linge","Lancer les deux dernières machines de la journée","Étendre les serviettes en rab sur le banc noir (zone post-float)","Rouler les serviettes propres","Étendre le tapis de l'évier"] },
    { section:"Jiao Gulan",          color:C.lavande,   icon:"🍵", priority:true,  tasks:["Éteindre l'appareil","Vider l'infusion","Jeter le contenu des boules à thé","Éponge dans la cuve"] },
    { section:"Zone Post-float",     color:C.sage,      icon:"✨", priority:false, note:"Possible pendant la dernière séance", tasks:["Remettre cotons-tiges et disques démaquillants si besoin","Spray sur la poubelle + WC + produits de beauté","⚡ Spray sur les sèche-cheveux et le meuble"] },
    { section:"Cuisine",             color:C.sageLight, icon:"🍽️",priority:false, note:"Possible pendant la dernière séance", tasks:["Éponge sur la grande table","Vaisselle faite et rangée si sèche","Éponge dans l'évier","⚠️ Ne pas laisser de nourriture consommable sur la grande table"] },
    { section:"Entrée",              color:C.eauLight,  icon:"🚪", priority:false, note:"Possible pendant la dernière séance", tasks:["Spray sur la table des explications","Spray sur les tongs usagées et les ranger","Rassembler les coussins : table explications + futon à côté de la salle de soins"] },
    { section:"Autre",               color:C.lavLight,  icon:"📋", priority:false, note:"Possible pendant la dernière séance", tasks:["Disposition des coussins : salon japonais + fatboys","Vérifier le Dojo, ramasser et laver les tasses","Ranger les dépliants","Penser au MF du lendemain matin (de la SDS)","Vider les déshumidificateurs de la SDS (dans les WC de préférence)"] },
    { section:"Ménage général",      color:C.sel,       icon:"🧹", priority:false, tasks:["Miroirs, meuble à chaussures/chaussons","Poussière : meuble entrée, sous les tasses zone bar, tuyauterie, rambardes, échelle...","Se référer à ASANA si besoin","Centre aussi accueillant que possible — ne pas lésiner sur torchon et sanitol"] },
  ],
  hebdo: {
    Lundi:    { journee:["Rangement et nettoyage du comptoir + étagères + meuble porte-manteau entrée","Dépoussiérer et passer l'aspirateur derrière si besoin"], soiree:["Nettoyer les casiers pour les chaussures","Arroser les plantes","SFA 200mL"], produit:"SFA 200mL" },
    Mardi:    { journee:["Dépoussiérer/nettoyer toutes les surfaces boisées côté cuisine et salon japonais","Remise en ordre/en beauté des espaces pour les flotteurs"], soiree:["Nettoyage approfondi de la cuisine : détartrage évier, plaques, placard sous l'évier, table..."], produit:"Enzymes" },
    Mercredi: { journee:["Ménage salle de soin : vider poubelle, dépoussiérer/nettoyer surfaces, retirer toiles d'araignée, passer l'aspirateur"], soiree:["Dépoussiérer/nettoyer toutes les surfaces boisées côté dojo","Remise en ordre/en beauté des espaces pour les flotteurs"], produit:"Javel" },
    Jeudi:    { journee:["Nettoyer meubles cabines (traces de sel et poussière)","Déplacer meubles si besoin pour dépoussiérer et passer l'aspirateur derrière"], soiree:["Ranger/trier/nettoyer les bureaux (vitres dessus + surfaces dessous)","Nettoyer le coin repos derrière la cuisine"], produit:"Enzymes" },
    Vendredi: { journee:["Nettoyer les vitres (porte d'entrée intérieur et extérieur...)"], soiree:["Nettoyer le frigo + trier/jeter si besoin"], produit:"Javel" },
    Samedi:   { journee:[], soiree:[], produit:"Enzymes" },
    Dimanche: { journee:[], soiree:[], produit:"Enzymes" },
  },
};

// ── Contexts ──────────────────────────────────────────────────────────────────
const TickContext = createContext(null);
const CelebContext = createContext(null);
const useTick = () => useContext(TickContext);
const useCeleb = () => useContext(CelebContext);

function getKey(tab, section, task, day) { return `meiso||${tab}||${day||""}||${section}||${task}`; }
function readChecked(key) { try { return localStorage.getItem(key)==="1"; } catch { return false; } }
function writeChecked(key, val) { try { localStorage.setItem(key, val?"1":"0"); } catch {} }
function countProgress(tab, day) {
  let total=0, done=0;
  const sections = tab==="hebdo"
    ? [{section:"Journée",tasks:DATA.hebdo[day]?.journee||[]},{section:"Soirée",tasks:DATA.hebdo[day]?.soiree||[]}]
    : DATA[tab];
  sections.forEach(s=>s.tasks.forEach(t=>{ total++; if(readChecked(getKey(tab,s.section,t,day))) done++; }));
  return { total, done, pct: total ? Math.round((done/total)*100) : 0 };
}
function hexToRgb(hex) {
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;
}

// ── Inject keyframes ──────────────────────────────────────────────────────────
if (!document.getElementById("meiso-kf")) {
  const s = document.createElement("style");
  s.id = "meiso-kf";
  s.textContent = `
    @keyframes ripple    { from{opacity:1;transform:scale(0.5)} to{opacity:0;transform:scale(2.2)} }
    @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pop       { 0%{transform:scale(1)} 40%{transform:scale(1.22)} 100%{transform:scale(1)} }
    @keyframes bubbleUp  { 0%{transform:translateY(0) scale(1);opacity:0.9} 100%{transform:translateY(-120px) scale(0.3);opacity:0} }
    @keyframes sectionFlash { 0%{opacity:0;transform:scale(0.95)} 30%{opacity:1;transform:scale(1.01)} 100%{opacity:0;transform:scale(1)} }
    @keyframes waveExpand { from{transform:translate(-50%,-50%) scale(0);opacity:0.6} to{transform:translate(-50%,-50%) scale(3);opacity:0} }
    @keyframes fullBubble { 0%{opacity:0.8;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-110vh) scale(0.5)} }
    @keyframes msgIn      { 0%{opacity:0;transform:translate(-50%,-50%) scale(0.7)} 20%{opacity:1;transform:translate(-50%,-50%) scale(1.05)} 80%{opacity:1;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(0.9)} }
    @keyframes shimmer    { 0%{background-position:200% center} 100%{background-position:-200% center} }
  `;
  document.head.appendChild(s);
}

// ── Bubble burst on section complete ──────────────────────────────────────────
function SectionBurst({ color, onDone }) {
  const count = 8;
  useEffect(() => { const t = setTimeout(onDone, 900); return ()=>clearTimeout(t); }, []);
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", borderRadius:"14px", zIndex:5 }}>
      {Array.from({length:count}).map((_,i) => {
        const size = 6 + Math.random()*8;
        const left = 10 + Math.random()*80;
        const delay = Math.random()*0.3;
        const dur = 0.6 + Math.random()*0.3;
        return (
          <div key={i} style={{
            position:"absolute",
            bottom: "20%",
            left: `${left}%`,
            width: size, height: size,
            borderRadius:"50%",
            background:`rgba(${hexToRgb(color)},0.7)`,
            animation:`bubbleUp ${dur}s ease-out ${delay}s forwards`,
          }}/>
        );
      })}
    </div>
  );
}

// ── Full screen celebration ───────────────────────────────────────────────────
function FullCelebration({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return ()=>clearTimeout(t); }, []);

  const bubbles = Array.from({length:28}).map((_,i) => ({
    size: 8 + Math.random()*20,
    left: Math.random()*100,
    delay: Math.random()*0.8,
    dur: 1.8 + Math.random()*1.2,
    color: [C.teal, C.eauLight, C.sel, C.sageLight, C.lavLight][Math.floor(Math.random()*5)],
  }));

  const msgs = ["✦ Section complète", "( meïsō )", "Bien joué"];

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:100,
      pointerEvents:"none",
      overflow:"hidden",
    }}>
      {/* Dark overlay, fades in/out */}
      <div style={{
        position:"absolute", inset:0,
        background:`radial-gradient(ellipse at 50% 60%, rgba(${hexToRgb(C.teal)},0.18) 0%, rgba(4,36,58,0.85) 70%)`,
        animation:"sectionFlash 3s ease forwards",
      }}/>

      {/* Wave ring */}
      <div style={{
        position:"absolute", top:"50%", left:"50%",
        width:"200px", height:"200px",
        borderRadius:"50%",
        border:`2px solid rgba(${hexToRgb(C.teal)},0.6)`,
        animation:"waveExpand 1.2s ease-out 0.1s forwards",
        opacity:0,
      }}/>
      <div style={{
        position:"absolute", top:"50%", left:"50%",
        width:"200px", height:"200px",
        borderRadius:"50%",
        border:`1px solid rgba(${hexToRgb(C.sel)},0.4)`,
        animation:"waveExpand 1.2s ease-out 0.35s forwards",
        opacity:0,
      }}/>

      {/* Bubbles floating up */}
      {bubbles.map((b,i) => (
        <div key={i} style={{
          position:"absolute",
          bottom: `-${b.size}px`,
          left: `${b.left}%`,
          width: b.size, height: b.size,
          borderRadius:"50%",
          background:`rgba(${hexToRgb(b.color)},0.55)`,
          animation:`fullBubble ${b.dur}s ease-out ${b.delay}s forwards`,
        }}/>
      ))}

      {/* Center message */}
      <div style={{
        position:"absolute", top:"50%", left:"50%",
        animation:"msgIn 2.8s ease forwards",
        opacity:0,
        textAlign:"center",
        pointerEvents:"none",
      }}>
        <div style={{
          fontSize:"13px", letterSpacing:"0.2em", textTransform:"uppercase",
          color:`rgba(${hexToRgb(C.sel)},0.7)`,
          marginBottom:"8px",
          fontWeight:"600",
        }}>Section complète</div>
        <div style={{
          fontSize:"32px", fontWeight:"800", letterSpacing:"-0.02em",
          background:`linear-gradient(135deg, ${C.teal}, ${C.sel}, ${C.eauLight})`,
          backgroundSize:"200% auto",
          WebkitBackgroundClip:"text",
          WebkitTextFillColor:"transparent",
          animation:"shimmer 1.5s linear infinite",
        }}>( meïsō )</div>
      </div>
    </div>
  );
}

// ── All-done celebration (bigger) ─────────────────────────────────────────────
function AllDoneCelebration({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return ()=>clearTimeout(t); }, []);

  const bubbles = Array.from({length:40}).map((_,i) => ({
    size: 6 + Math.random()*24,
    left: Math.random()*100,
    delay: Math.random()*1.2,
    dur: 2 + Math.random()*1.5,
    color: [C.teal, C.eauLight, C.sel, C.sageLight, C.lavLight, C.lumiere][Math.floor(Math.random()*6)],
  }));

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:100,
      pointerEvents:"none", overflow:"hidden",
    }}>
      <div style={{
        position:"absolute", inset:0,
        background:`radial-gradient(ellipse at 50% 50%, rgba(${hexToRgb(C.teal)},0.28) 0%, rgba(4,36,58,0.92) 70%)`,
        animation:"sectionFlash 4s ease forwards",
      }}/>

      {[0,0.2,0.4].map((d,i) => (
        <div key={i} style={{
          position:"absolute", top:"50%", left:"50%",
          width:"220px", height:"220px", borderRadius:"50%",
          border:`${i===0?"2px":"1px"} solid rgba(${hexToRgb(C.teal)},${0.7-i*0.2})`,
          animation:`waveExpand 1.4s ease-out ${d}s forwards`, opacity:0,
        }}/>
      ))}

      {bubbles.map((b,i) => (
        <div key={i} style={{
          position:"absolute", bottom:`-${b.size}px`, left:`${b.left}%`,
          width:b.size, height:b.size, borderRadius:"50%",
          background:`rgba(${hexToRgb(b.color)},0.5)`,
          animation:`fullBubble ${b.dur}s ease-out ${b.delay}s forwards`,
        }}/>
      ))}

      <div style={{
        position:"absolute", top:"50%", left:"50%",
        animation:"msgIn 3.6s ease forwards", opacity:0, textAlign:"center",
      }}>
        <div style={{ fontSize:"11px", letterSpacing:"0.25em", textTransform:"uppercase", color:C.textMuted, marginBottom:"10px" }}>
          Tout est fait
        </div>
        <div style={{
          fontSize:"38px", fontWeight:"800", letterSpacing:"-0.02em",
          background:`linear-gradient(135deg, ${C.teal}, ${C.sel}, ${C.eauLight}, ${C.teal})`,
          backgroundSize:"300% auto",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          animation:"shimmer 1.2s linear infinite",
        }}>( meïsō )</div>
        <div style={{ fontSize:"14px", color:`rgba(${hexToRgb(C.sel)},0.6)`, marginTop:"10px", letterSpacing:"0.05em" }}>
          Le centre est prêt ✦
        </div>
      </div>
    </div>
  );
}

// ── CheckItem ─────────────────────────────────────────────────────────────────
function CheckItem({ label, storageKey, color }) {
  const tick = useTick();
  const checked = readChecked(storageKey);
  const [rippling, setRippling] = useState(false);
  const isWarn = label.startsWith("⚠️");
  const isHL   = label.startsWith("⚡");

  const toggle = useCallback((e) => {
    e.stopPropagation();
    const next = !checked;
    writeChecked(storageKey, next);
    if (next) { setRippling(true); setTimeout(()=>setRippling(false), 500); }
    tick();
  }, [storageKey, checked, tick]);

  return (
    <div onClick={toggle} style={{
      display:"flex", alignItems:"center", gap:"14px",
      padding:"14px 14px", marginBottom:"6px", borderRadius:"12px",
      position:"relative", overflow:"hidden",
      background: checked ? "rgba(10,58,82,0.3)"
        : isWarn ? "rgba(196,146,74,0.1)" : isHL ? `rgba(${hexToRgb(color)},0.12)` : `rgba(${hexToRgb(color)},0.07)`,
      border:`1px solid ${checked ? "rgba(168,216,232,0.06)" : isWarn ? "rgba(196,146,74,0.2)" : isHL ? `rgba(${hexToRgb(color)},0.35)` : `rgba(${hexToRgb(color)},0.18)`}`,
      cursor:"pointer", userSelect:"none", WebkitTapHighlightColor:"transparent",
      transition:"all 0.2s", minHeight:"52px", opacity: checked ? 0.55 : 1,
    }}>
      {rippling && (
        <span style={{
          position:"absolute", inset:0, borderRadius:"inherit",
          background:`radial-gradient(circle, rgba(${hexToRgb(color)},0.35) 0%, transparent 70%)`,
          animation:"ripple 0.45s ease-out forwards",
          pointerEvents:"none",
        }}/>
      )}
      <div style={{
        width:"30px", height:"30px", borderRadius:"8px", flexShrink:0,
        border: checked ? "none" : `2px solid rgba(${hexToRgb(color)},0.45)`,
        background: checked ? color : "transparent",
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"all 0.2s",
        boxShadow: checked ? `0 0 10px rgba(${hexToRgb(color)},0.5)` : "none",
        animation: checked ? "pop 0.3s ease" : "none",
      }}>
        {checked && (
          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
            <path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke={C.bg} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span style={{
        fontSize:"15px", lineHeight:"1.4", fontWeight: checked ? "400" : "500",
        color: checked ? C.textMuted : isWarn ? C.amberLight : isHL ? C.eauLight : C.textPrimary,
        textDecoration: checked ? "line-through" : "none",
        transition:"all 0.2s", flex:1,
      }}>{label}</span>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
function Section({ data, tab, day }) {
  const tick = useTick();
  const { triggerSection, triggerAll } = useCeleb();
  const [open, setOpen] = useState(true);
  const [bursting, setBursting] = useState(false);
  const prevAllDone = useRef(false);

  const keys = data.tasks.map(t => getKey(tab, data.section, t, day));
  const checkedStates = keys.map(readChecked);
  const doneCount = checkedStates.filter(Boolean).length;
  const total = data.tasks.length;
  const allDone = doneCount === total;

  // Detect transition to allDone
  useEffect(() => {
    if (allDone && !prevAllDone.current) {
      setBursting(true);
      triggerSection(data.color);
    }
    prevAllDone.current = allDone;
  }, [allDone]);

  const sorted = data.tasks
    .map((task,i) => ({ task, key:keys[i], done:checkedStates[i] }))
    .sort((a,b) => a.done - b.done);

  return (
    <div style={{
      marginBottom:"12px",
      opacity: allDone ? 0.6 : 1,
      transition:"opacity 0.4s",
      position:"relative",
    }}>
      {bursting && (
        <SectionBurst color={data.color} onDone={() => setBursting(false)} />
      )}

      <div onClick={()=>setOpen(o=>!o)} style={{
        display:"flex", alignItems:"center", gap:"10px",
        padding:"10px 14px",
        background: allDone ? `rgba(${hexToRgb(data.color)},0.12)` : C.bgCard,
        borderRadius: open ? "14px 14px 0 0" : "14px",
        cursor:"pointer",
        borderLeft:`4px solid ${data.color}`,
        border:`1px solid ${allDone ? `rgba(${hexToRgb(data.color)},0.25)` : C.border}`,
        borderLeft:`4px solid ${data.color}`,
        transition:"background 0.3s",
      }}>
        <span style={{ fontSize:"17px", lineHeight:1, flexShrink:0 }}>{data.icon}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:"11px", fontWeight:"700", color: allDone ? data.color : C.textSecondary, letterSpacing:"0.06em", textTransform:"uppercase" }}>
            {data.section}
          </div>
          {data.note && <div style={{ fontSize:"10px", color:C.textMuted, marginTop:"1px" }}>{data.note}</div>}
        </div>
        <div style={{
          padding:"4px 10px", borderRadius:"20px", flexShrink:0,
          background: allDone ? data.color : "rgba(168,216,232,0.07)",
          fontSize:"11px", fontWeight:"700",
          color: allDone ? C.bg : C.textMuted,
          minWidth:"44px", textAlign:"center",
        }}>
          {allDone ? "✓" : `${doneCount}/${total}`}
        </div>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"
          style={{ transform:open?"rotate(180deg)":"none", transition:"0.2s", opacity:0.25, flexShrink:0 }}>
          <path d="M1 1L5 5L9 1" stroke={C.sel} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {open && (
        <div style={{
          padding:"10px 8px 6px",
          background:C.bgDeep,
          borderRadius:"0 0 14px 14px",
          borderLeft:`4px solid ${data.color}`,
          borderRight:`1px solid ${C.border}`,
          borderBottom:`1px solid ${C.border}`,
          animation:"slideDown 0.2s ease",
        }}>
          {sorted.map(({task,key}) => (
            <CheckItem key={key} label={task} storageKey={key} color={data.color}/>
          ))}
        </div>
      )}
    </div>
  );
}

// ── SortedSections ────────────────────────────────────────────────────────────
function SortedSections({ sections, tab, day }) {
  const withDone = sections.map(s => {
    const keys = s.tasks.map(t => getKey(tab, s.section, t, day));
    return { ...s, allDone: keys.every(readChecked) };
  });
  return [...withDone].sort((a,b) => a.allDone - b.allDone)
    .map(s => <Section key={s.section} data={s} tab={tab} day={day}/>);
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ tab, day }) {
  const { done, total, pct } = countProgress(tab, day);
  const allDone = done===total && total>0;
  return (
    <div style={{ padding:"12px 20px 0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
        <span style={{ fontSize:"12px", fontWeight:"600", color: allDone ? C.sageLight : C.textSecondary }}>
          {done} / {total} tâches
        </span>
        <span style={{ fontSize:"13px", fontWeight:"800", color: allDone ? C.sageLight : C.teal, letterSpacing:"-0.01em" }}>
          {allDone ? "✓ Tout bon !" : `${pct}%`}
        </span>
      </div>
      {/* Track */}
      <div style={{ height:"8px", background:"rgba(168,216,232,0.1)", borderRadius:"6px", overflow:"hidden", border:`1px solid rgba(168,216,232,0.08)` }}>
        <div style={{
          height:"100%", width:`${pct}%`, borderRadius:"6px",
          transition:"width 0.4s cubic-bezier(0.4,0,0.2,1)",
          background: allDone
            ? `linear-gradient(90deg,${C.sage},${C.teal})`
            : `linear-gradient(90deg,${C.eau},${C.teal},${C.eauLight})`,
          boxShadow: pct > 0 ? `0 0 10px rgba(42,191,191,0.4)` : "none",
        }}/>
      </div>
    </div>
  );
}

function Divider({ label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"10px", margin:"20px 0 12px" }}>
      <div style={{ flex:1, height:"1px", background:C.border }}/>
      <span style={{ fontSize:"10px", fontWeight:"700", color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase" }}>{label}</span>
      <div style={{ flex:1, height:"1px", background:C.border }}/>
    </div>
  );
}

// ── Hebdo ─────────────────────────────────────────────────────────────────────
function HebdoView() {
  const todayIdx = new Date().getDay();
  const [day, setDay] = useState(DAYS[todayIdx===0?6:todayIdx-1]);
  const data = DATA.hebdo[day];
  const sections = [
    { section:"Journée (8h-15h)", color:C.eauLight, icon:"☀️", tasks:data.journee },
    { section:"Soirée (14h30-23h)", color:C.amber, icon:"🌙", tasks:data.soiree },
  ].filter(s=>s.tasks.length>0);

  return (
    <div>
      <div style={{ display:"flex", gap:"8px", overflowX:"auto", paddingBottom:"12px", marginBottom:"16px", scrollbarWidth:"none" }}>
        {DAYS.map(d=>(
          <button key={d} onClick={()=>setDay(d)} style={{
            flexShrink:0, padding:"10px 14px", borderRadius:"12px",
            border:`1px solid ${d===day?C.eau:C.border}`,
            background:d===day?C.eau:C.bgCard,
            color:d===day?C.lumiere:C.textSecondary,
            fontSize:"13px", fontWeight:d===day?"800":"400", cursor:"pointer",
          }}>{d.slice(0,3)}</button>
        ))}
      </div>
      {data.produit && (
        <div style={{
          display:"flex", alignItems:"center", gap:"12px",
          padding:"14px 16px", marginBottom:"16px",
          background:`rgba(${hexToRgb(C.lavande)},0.15)`,
          borderRadius:"12px", border:`1px solid rgba(${hexToRgb(C.lavande)},0.3)`,
        }}>
          <span style={{ fontSize:"22px" }}>🧪</span>
          <div>
            <div style={{ fontSize:"10px", fontWeight:"700", color:C.lavLight, letterSpacing:"0.08em", marginBottom:"2px" }}>PRODUIT DU JOUR</div>
            <div style={{ fontSize:"16px", fontWeight:"700", color:C.textPrimary }}>{data.produit}</div>
          </div>
        </div>
      )}
      <ProgressBar tab="hebdo" day={day}/>
      <SortedSections sections={sections} tab="hebdo" day={day}/>
      {sections.length===0 && (
        <div style={{ textAlign:"center", padding:"60px 0", color:C.textMuted }}>Pas de tâches spécifiques ce jour.</div>
      )}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("matin");
  const [tick, setTick] = useState(0);
  const [celeb, setCeleb] = useState(null); // null | "section" | "all"
  const [celebColor, setCelebColor] = useState(C.teal);
  const prevProgress = useRef({});

  const bump = useCallback(() => setTick(n=>n+1), []);

  const triggerSection = useCallback((color) => {
    setCelebColor(color);
    setCeleb("section");
  }, []);

  const triggerAll = useCallback(() => {
    setCeleb("all");
  }, []);

  // Watch for all-done
  useEffect(() => {
    if (tab === "hebdo") return;
    const { done, total } = countProgress(tab);
    const key = tab;
    const prev = prevProgress.current[key] || 0;
    if (done === total && total > 0 && prev < total) {
      setTimeout(() => setCeleb("all"), 600);
    }
    prevProgress.current[key] = done;
  });

  const tabs = [
    { id:"matin", label:"Matin", icon:"☀️" },
    { id:"soir",  label:"Soir",  icon:"🌙" },
    { id:"hebdo", label:"Hebdo", icon:"📅" },
  ];

  const resetAll = () => {
    if (!confirm("Réinitialiser toutes les tâches ?")) return;
    Object.keys(localStorage).filter(k=>k.startsWith("meiso||")).forEach(k=>localStorage.removeItem(k));
    prevProgress.current = {};
    bump();
  };

  const primary   = tab!=="hebdo" ? DATA[tab].filter(s=>s.priority)  : [];
  const secondary = tab!=="hebdo" ? DATA[tab].filter(s=>!s.priority) : [];

  return (
    <TickContext.Provider value={bump}>
      <CelebContext.Provider value={{ triggerSection, triggerAll }}>
        <div style={{ minHeight:"100vh", background:C.bg, color:C.textPrimary, maxWidth:"480px", margin:"0 auto" }}>

          {celeb === "section" && (
            <FullCelebration onDone={() => setCeleb(null)} />
          )}
          {celeb === "all" && (
            <AllDoneCelebration onDone={() => setCeleb(null)} />
          )}

          {/* Header */}
          <div style={{
            position:"sticky", top:0, zIndex:10, background:C.bg,
            paddingTop:"env(safe-area-inset-top,14px)",
            borderBottom:`1px solid ${C.border}`,
          }}>
            <div style={{ padding:"16px 20px 0" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
                <div>
                  <div style={{ fontSize:"11px", color:C.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"3px" }}>
                    {new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}
                  </div>
                  <div style={{ fontSize:"22px", fontWeight:"800", letterSpacing:"-0.03em", color:C.lumiere }}>
                    meïsō <span style={{ color:C.teal, fontWeight:"300" }}>·</span> tâches
                  </div>
                </div>
                <button onClick={resetAll} style={{
                  background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:"10px",
                  color:C.textMuted, fontSize:"12px", padding:"8px 12px", cursor:"pointer",
                }}>↺ Reset</button>
              </div>
            </div>
            {/* Progress bar */}
            {tab !== "hebdo" && <ProgressBar tab={tab} key={`pb-${tab}-${tick}`}/>}
            <div style={{ height:"12px" }}/>
          </div>

          {/* Content */}
          <div style={{ padding:"16px 16px", paddingBottom:"calc(env(safe-area-inset-bottom,0px) + 90px)" }}>
            {tab!=="hebdo" && (
              <>
                <SortedSections sections={primary} tab={tab}/>
                {secondary.length>0 && (
                  <>
                    <Divider label="À faire aussi"/>
                    <SortedSections sections={secondary} tab={tab}/>
                  </>
                )}
              </>
            )}
            {tab==="hebdo" && <HebdoView key={`hebdo-${tick}`}/>}
          </div>

          {/* Bottom nav */}
          <div style={{
            position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
            width:"100%", maxWidth:"480px", zIndex:20,
            background:"rgba(4,36,58,0.96)",
            backdropFilter:"blur(20px)",
            WebkitBackdropFilter:"blur(20px)",
            borderTop:`1px solid ${C.border}`,
            paddingBottom:"env(safe-area-inset-bottom,0px)",
          }}>
            <div style={{ display:"flex", padding:"4px 0" }}>
              {tabs.map(t => {
                const active = tab === t.id;
                return (
                  <button key={t.id} onClick={()=>setTab(t.id)} style={{
                    flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"3px",
                    padding:"10px 6px 8px", border:"none", background:"transparent",
                    cursor:"pointer", WebkitTapHighlightColor:"transparent", position:"relative",
                  }}>
                    {active && (
                      <div style={{
                        position:"absolute", top:0, left:"25%", right:"25%",
                        height:"2px", borderRadius:"0 0 2px 2px",
                        background:C.teal,
                        boxShadow:`0 0 8px rgba(42,191,191,0.7)`,
                      }}/>
                    )}
                    <span style={{
                      fontSize:"24px", lineHeight:1,
                      transition:"transform 0.2s",
                      transform: active ? "scale(1.1)" : "scale(1)",
                    }}>{t.icon}</span>
                    <span style={{
                      fontSize:"11px", fontWeight: active ? "700" : "400",
                      color: active ? C.teal : C.textMuted,
                      letterSpacing:"0.02em", transition:"color 0.2s",
                    }}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </CelebContext.Provider>
    </TickContext.Provider>
  );
}
