import { useState, useEffect, useRef } from "react";

// ─── MODES ───────────────────────────────────────────────────────────────────
const MODES = [
  { id:"dieet",      label:"Diëten",      emoji:"🥗", color:"#2d9e6b" },
  { id:"allergie",   label:"Allergieën",  emoji:"⚠️",  color:"#f97316" },
  { id:"zwanger",    label:"Zwanger",     emoji:"🤰",  color:"#ec4899" },
];

const DIETS = [
  { id:"keto",        label:"Keto",        color:"#f97316", emoji:"🥑" },
  { id:"vegan",       label:"Vegan",       color:"#22c55e", emoji:"🌱" },
  { id:"glutenvrij",  label:"Glutenvrij",  color:"#a855f7", emoji:"🌾" },
  { id:"lactosevrij", label:"Lactosevrij", color:"#38bdf8", emoji:"🥛" },
  { id:"suikervrij",  label:"Suikervrij",  color:"#f43f5e", emoji:"🍬" },
  { id:"mediterraan", label:"Mediterraan", color:"#fbbf24", emoji:"🫒" },
  { id:"paleo",       label:"Paleo",       color:"#84cc16", emoji:"🦴" },
  { id:"caloriearm",  label:"Caloriearm",  color:"#fb7185", emoji:"⚖️" },
  { id:"punten",      label:"Puntendieet", color:"#c084fc", emoji:"🔢" },
  { id:"fodmap",      label:"FODMAP",      color:"#34d399", emoji:"🌿" },
  { id:"antiinfl",    label:"Anti-inflam.", color:"#f59e0b", emoji:"🔥" },
  { id:"dash",        label:"DASH",        color:"#60a5fa", emoji:"❤️" },
];

const ALLERGIES = [
  { id:"noten",      label:"Noten",       color:"#fb923c", emoji:"🥜" },
  { id:"gluten",     label:"Gluten",      color:"#c084fc", emoji:"🌾" },
  { id:"melk",       label:"Melk",        color:"#60a5fa", emoji:"🥛" },
  { id:"ei",         label:"Ei",          color:"#facc15", emoji:"🥚" },
  { id:"vis",        label:"Vis",         color:"#34d399", emoji:"🐟" },
  { id:"soja",       label:"Soja",        color:"#a78bfa", emoji:"🫘" },
  { id:"schaaldier", label:"Schaaldier",  color:"#f87171", emoji:"🦐" },
  { id:"sesam",      label:"Sesam",       color:"#fbbf24", emoji:"🌱" },
];

// DB: k=keto v=vegan g=glutenvrij l=lactosevrij s=suikervrij m=mediterraan
//     an=noten ag=gluten am=melk ae=ei af=vis aso=soja asc=schaaldier ase=sesam
//     zw: 1=veilig 0=niet veilig 2=met mate  zr=reden zwangerschap
const DB = {
  "Kipfilet":     {k:1,v:0,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["E"],cal:165,info:"Magere eiwitbron.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Goed gekookte kip is veilig tijdens de zwangerschap.",
    r:{k:"Eiwitrijk, geen koolhydraten",v:"Dierlijk product",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Aanbevolen"}},
  "Zalm":         {k:1,v:0,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["E", "O"],cal:208,info:"Vette vis, rijk aan omega-3.",
    an:1,ag:1,am:1,ae:1,af:0,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Bevat vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig mits goed doorbakken. Beperkt tot 2x per week vanwege kwik.",
    r:{k:"Vette vis, ideaal",v:"Dierlijk product",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Kernproduct mediterraan"}},
  "Tonijn":       {k:1,v:0,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["E"],cal:144,info:"Magere vis, veel eiwit.",
    an:1,ag:1,am:1,ae:1,af:0,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Bevat vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:2,zr:"Max. 2x per week door hoog kwikgehalte. Verse tonijn is risicovoller dan blik.",
    r:{k:"Mager eiwit",v:"Dierlijk product",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Veelgebruikt"}},
  "Garnalen":     {k:1,v:0,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["E"],cal:99,info:"Schaaldier, weinig calorieën.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:0,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis (schaaldier)",aso:"Geen soja",asc:"Bevat schaaldieren",ase:"Geen sesam"},
    zw:2,zr:"Alleen goed doorbakken garnalen zijn veilig. Rauw of halfgaar vermijden.",
    r:{k:"Eiwitrijk, geen koolhydraten",v:"Dierlijk product",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Populair mediterraan"}},
  "Ei":           {k:1,v:0,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["E", "V2"],cal:155,info:"Voedzaam, eiwitten en vetten.",
    an:1,ag:1,am:1,ae:0,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Bevat ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:2,zr:"Alleen goed doorgekookte eieren zijn veilig. Rauwe eieren (mayonaise, tiramisu) vermijden.",
    r:{k:"Bijna geen koolhydraten",v:"Dierlijk product",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Aanbevolen"}},
  "Avocado":      {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:0,pu:0,fo:0,ai:1,da:1,vevo:["V", "V2", "O"],pest:{level:"laag",badge:"🟢 Clean Fifteen",tip:"Veilig conventioneel. Minder dan 2% van monsters had detecteerbare pesticiden."},cal:160,info:"Rijk aan gezonde vetten.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Uitstekend tijdens de zwangerschap: foliumzuur, kalium en gezonde vetten.",
    r:{k:"Hoog vet, weinig koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Gezonde vetbron"}},
  "Broccoli":     {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V", "V2"],pest:{level:"laag",badge:"🟢 Clean Fifteen",tip:"Veilig conventioneel. Weinig pesticiden gevonden."},cal:34,info:"Groene groente, vitamine C.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Uitstekend: foliumzuur, calcium en vitamine C. Goed wassen voor gebruik.",
    r:{k:"Weinig koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Aanbevolen groente"}},
  "Spinazie":     {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V", "V2"],pest:{level:"hoog",badge:"🔴 Dirty Dozen",tip:"Koop biologisch. Bevat gemiddeld de meeste pesticiden. Systemische stoffen die niet afwasbaar zijn."},cal:23,info:"Bladgroente, ijzer en foliumzuur.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Rijk aan foliumzuur, ijzer en calcium. Goed wassen voor gebruik.",
    r:{k:"Zeer weinig koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Mediterrane groente"}},
  "Tomaat":       {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V", "V2"],pest:{level:"middel",badge:"🟡 Middel",tip:"Wassen is voldoende. Matig pesticidenbelasting in EU."},cal:18,info:"Vruchtgroente, lycopeen.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig en voedzaam. Goed wassen voor gebruik.",
    r:{k:"Weinig koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Weinig suiker",m:"Basis mediterraan"}},
  "Komkommer":    {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V", "V2"],pest:{level:"middel",badge:"🟡 Middel",tip:"Wassen is voldoende. In Nederland ook hormoonverstorende stoffen gevonden."},cal:12,info:"Waterrijke groente.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig tijdens zwangerschap. Helpt bij hydratatie.",
    r:{k:"Bijna geen koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Veel gebruikt"}},
  "Paprika":      {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V", "V2"],pest:{level:"hoog",badge:"🔴 Dirty Dozen",tip:"Koop biologisch. Nr. 1 in Nederlandse PAN-lijst. Systemische pesticiden in vruchtvlees."},cal:31,info:"Kleurrijke vruchtgroente.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Uitstekend: hoog vitamine C-gehalte. Goed wassen voor gebruik.",
    r:{k:"Weinig koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Licht zoet",m:"Basis ingrediënt"}},
  "Champignons":  {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:0,ai:1,da:1,vevo:["V", "V2", "E"],pest:{level:"laag",badge:"🟢 Clean Fifteen",tip:"Veilig conventioneel. Weinig pesticiden nodig in teelt."},cal:22,info:"Paddenstoel, laag in calorieën.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig mits goed doorgekookt. Rauwe champignons beperken.",
    r:{k:"Weinig koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Veel gebruikt"}},
  "Melk":         {k:0,v:0,g:1,l:0,s:0,m:1,p:0,ca:0,pu:0,fo:1,ai:0,da:1,vevo:["E", "V2"],cal:61,info:"Bevat eiwitten en lactose.",
    an:1,ag:1,am:0,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Bevat melkeiwitten",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Goed voor calcium en vitamine D. Kies gepasteuriseerde melk.",
    r:{k:"Bevat lactose",v:"Dierlijk product",g:"Geen gluten",l:"Bevat lactose",s:"Bevat melksuiker",m:"Met mate"}},
  "Kaas":         {k:1,v:0,g:1,l:0,s:1,m:1,p:0,ca:0,pu:0,fo:0,ai:0,da:1,vevo:["E", "V2", "O"],cal:402,info:"Zuivelproduct, calcium en eiwit.",
    an:1,ag:1,am:0,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Bevat melkeiwitten",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:2,zr:"Harde gepasteuriseerde kaas is veilig. Zachte kaas van rauwe melk (brie, camembert) vermijden.",
    r:{k:"Vet en eiwit",v:"Dierlijk product",g:"Geen gluten",l:"Bevat lactose",s:"Geen suiker",m:"Met mate"}},
  "Yoghurt":      {k:0,v:0,g:1,l:0,s:0,m:1,p:0,ca:1,pu:1,fo:0,ai:1,da:1,vevo:["E", "V2"],cal:59,info:"Gefermenteerd zuivelproduct.",
    an:1,ag:1,am:0,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Bevat melkeiwitten",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Gepasteuriseerde yoghurt is veilig en goed voor calcium.",
    r:{k:"Bevat koolhydraten",v:"Dierlijk product",g:"Geen gluten",l:"Bevat lactose",s:"Bevat melksuiker",m:"Aanbevolen"}},
  "Boter":        {k:1,v:0,g:1,l:0,s:1,m:0,p:0,ca:0,pu:0,fo:1,ai:0,da:0,vevo:["O"],cal:717,info:"Vetproduct van room.",
    an:1,ag:1,am:0,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Bevat melkeiwitten",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Gepasteuriseerde boter is veilig. Met mate gebruiken.",
    r:{k:"Bijna puur vet",v:"Dierlijk product",g:"Geen gluten",l:"Sporen lactose",s:"Geen suiker",m:"Olijfolie is beter"}},
  "Feta":         {k:1,v:0,g:1,l:0,s:1,m:1,p:0,ca:0,pu:0,fo:0,ai:0,da:1,vevo:["E", "V2"],cal:264,info:"Gezouten Griekse kaas.",
    an:1,ag:1,am:0,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Bevat melkeiwitten",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:0,zr:"Traditionele feta van rauwe schapen-/geitenmelk is NIET veilig. Gepasteuriseerde feta wel.",
    r:{k:"Vet en eiwit",v:"Dierlijk product",g:"Geen gluten",l:"Bevat lactose",s:"Geen suiker",m:"Typisch mediterraan"}},
  "Witbrood":     {k:0,v:1,g:0,l:1,s:0,m:0,p:0,ca:0,pu:0,fo:1,ai:0,da:0,vevo:["V"],cal:265,info:"Brood van geraffineerde bloem.",
    an:1,ag:0,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Bevat gluten (tarwe)",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig maar weinig voedingswaarde. Volkoren is voedzamer.",
    r:{k:"Veel koolhydraten",v:"Plantaardig",g:"Bevat gluten",l:"Geen lactose",s:"Bevat suiker",m:"Volkoren is beter"}},
  "Volkoren brood":{k:0,v:1,g:0,l:1,s:1,m:1,p:0,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V", "V2"],cal:247,info:"Voedzamer dan witbrood.",
    an:1,ag:0,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Bevat gluten (tarwe)",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Aanbevolen: rijk aan vezels, foliumzuur en ijzer.",
    r:{k:"Te veel koolhydraten",v:"Plantaardig",g:"Bevat gluten",l:"Geen lactose",s:"Geen toegevoegde suikers",m:"Met mate"}},
  "Pasta":        {k:0,v:1,g:0,l:1,s:1,m:1,p:0,ca:0,pu:0,fo:1,ai:1,da:1,vevo:["V"],cal:371,info:"Koolhydraatrijk graanproduct.",
    an:1,ag:0,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Bevat gluten (tarwe)",am:"Geen melk",ae:"Kan ei bevatten",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Goed doorgekookte pasta is veilig. Volkoren variant is voedzamer.",
    r:{k:"Veel koolhydraten",v:"Plantaardig",g:"Bevat gluten",l:"Geen lactose",s:"Geen suiker",m:"Basis mediterraan dieet"}},
  "Rijst":        {k:0,v:1,g:1,l:1,s:1,m:1,p:0,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V"],pest:{level:"middel",badge:"🟡 Middel",tip:"Niet van toepassing op de Dirty Dozen. Spoelen voor gebruik."},cal:360,info:"Graansoort, veelzijdig.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig tijdens zwangerschap. Zilvervliesrijst heeft meer voedingsstoffen.",
    r:{k:"Te veel koolhydraten",v:"Plantaardig",g:"Glutenvrij",l:"Geen lactose",s:"Geen suiker",m:"Met mate"}},
  "Quinoa":       {k:0,v:1,g:1,l:1,s:1,m:1,p:0,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V", "E", "V2"],pest:{level:"middel",badge:"🟡 Middel",tip:"Goed afspoelen voor gebruik om bitterheid (saponinen) te verwijderen."},cal:368,info:"Pseudograan, compleet eiwit.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Uitstekend: volledig eiwit, ijzer en foliumzuur. Goed afspoelen voor gebruik.",
    r:{k:"Bevat koolhydraten",v:"Volledig eiwit",g:"Van nature glutenvrij",l:"Geen lactose",s:"Geen suiker",m:"Aanbevolen"}},
  "Havermout":    {k:0,v:1,g:0,l:1,s:1,m:1,p:0,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V", "V2"],pest:{level:"middel",badge:"🟡 Middel",tip:"Niet op de Dirty Dozen. Kies biologisch bij coeliakie."},cal:389,info:"Complexe koolhydraten en vezels.",
    an:1,ag:0,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Kan gluten bevatten (kruisbesmetting)",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Goed voor vezels en ijzer. Kies gecertificeerde glutenvrije haver bij coeliakie.",
    r:{k:"Te veel koolhydraten",v:"Plantaardig",g:"Kruisbesmetting mogelijk",l:"Geen lactose",s:"Geen suiker",m:"Aanbevolen volkoren"}},
  "Amandelen":    {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:0,pu:0,fo:1,ai:1,da:1,vevo:["V", "E", "V2", "O"],cal:579,info:"Noot rijk aan vitamine E.",
    an:0,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Bevat noten (amandelen)",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Gezond: magnesium, calcium en vitamine E. Met mate eten.",
    r:{k:"Vet en eiwit",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Aanbevolen snack"}},
  "Walnoten":     {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:0,pu:0,fo:1,ai:1,da:1,vevo:["V", "E", "V2", "O"],cal:654,info:"Hersenvormige noot, omega-3.",
    an:0,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Bevat noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Uitstekend: omega-3 voor de hersenontwikkeling van de baby.",
    r:{k:"Gezonde vetten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Klassiek mediterraan"}},
  "Pindakaas":    {k:1,v:1,g:1,l:1,s:0,m:0,p:0,ca:0,pu:0,fo:1,ai:0,da:1,vevo:["E", "O"],cal:588,info:"Pasta van gemalen pinda's.",
    an:0,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Bevat pinda's (peulvrucht, kruisreactie noten)",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig tijdens zwangerschap bij gematigde inname. Kies naturel zonder toegevoegd zout/suiker.",
    r:{k:"Vet en eiwit",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Bevat suiker",m:"Niet mediterraan"}},
  "Tahini":       {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:0,pu:0,fo:1,ai:1,da:1,vevo:["E", "O"],cal:595,info:"Pasta van sesamzaad.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:0,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Bevat sesam"},
    zw:1,zr:"Goed voor calcium en ijzer tijdens de zwangerschap.",
    r:{k:"Vet en eiwit",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Mediterraan"}},
  "Olijfolie":    {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:0,pu:0,fo:1,ai:1,da:1,vevo:["O"],cal:884,info:"Basisolie mediterrane keuken.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Uitstekend: gezonde vetten en vitamine E. Aanbevolen tijdens zwangerschap.",
    r:{k:"Puur vet, ideaal",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Gouden standaard"}},
  "Linzen":       {k:0,v:1,g:1,l:1,s:1,m:1,p:0,ca:1,pu:1,fo:0,ai:1,da:1,vevo:["V", "E", "V2"],cal:353,info:"Eiwitrijke peulvrucht.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Uitstekend: rijk aan foliumzuur, ijzer en eiwitten. Goed doorkoken.",
    r:{k:"Te veel koolhydraten",v:"Plantaardig eiwit",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Basis mediterraan"}},
  "Kikkererwten": {k:0,v:1,g:1,l:1,s:1,m:1,p:0,ca:1,pu:1,fo:0,ai:1,da:1,vevo:["V", "E", "V2"],cal:364,info:"Basis van hummus, eiwitrijk.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Aanbevolen: veel foliumzuur, ijzer en proteïne. Goed doorkoken.",
    r:{k:"Te veel koolhydraten",v:"Plantaardig eiwit",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Klassiek mediterraan"}},
  "Hummus":       {k:0,v:1,g:1,l:1,s:1,m:1,p:0,ca:1,pu:1,fo:0,ai:1,da:1,vevo:["V", "E", "O"],cal:177,info:"Dip van kikkererwten en tahini.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:0,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Bevat sesam (tahini)"},
    zw:1,zr:"Veilig en voedzaam: ijzer en foliumzuur. Let op sesam bij allergieën.",
    r:{k:"Bevat koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Typisch mediterraan"}},
  "Appel":        {k:0,v:1,g:1,l:1,s:0,m:1,p:1,ca:1,pu:1,fo:0,ai:1,da:1,vevo:["V", "V2"],pest:{level:"hoog",badge:"🔴 Dirty Dozen",tip:"Koop biologisch. In 90%+ van monsters pesticiden gevonden, ook na wassen en schillen."},cal:52,info:"Populair fruit, rijk aan vezels.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig en voedzaam. Goed wassen voor gebruik.",
    r:{k:"Te veel koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Bevat fruitsuiker",m:"Aanbevolen fruit"}},
  "Banaan":       {k:0,v:1,g:1,l:1,s:0,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V", "V2"],pest:{level:"laag",badge:"🟢 Clean Fifteen",tip:"Veilig conventioneel. Dikke schil, vruchtvlees nauwelijks belast."},cal:89,info:"Energierijk, rijk aan kalium.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Aanbevolen: kalium helpt bij kramp, vezels bij obstipatie.",
    r:{k:"Hoog suikergehalte",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Hoog in fruitsuiker",m:"Met mate"}},
  "Aardbei":      {k:1,v:1,g:1,l:1,s:0,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V", "V2"],pest:{level:"hoog",badge:"🔴 Dirty Dozen",tip:"Koop biologisch. Staat op nr. 3 in 2026. In 90%+ van monsters meerdere pesticiden gevonden."},cal:32,info:"Rood besje, laag in calorieën.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig en rijk aan vitamine C en foliumzuur. Goed wassen.",
    r:{k:"Weinig koolhydraten voor fruit",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Licht zoet",m:"Aanbevolen"}},
  "Blauwe bessen":{k:1,v:1,g:1,l:1,s:0,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V", "V2"],pest:{level:"hoog",badge:"🔴 Dirty Dozen",tip:"Koop biologisch. Nieuw in Dirty Dozen. In bijna 90% van monsters pesticiden gevonden."},cal:57,info:"Antioxidantrijk superfruit.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Aanbevolen: antioxidanten goed voor moeder en baby.",
    r:{k:"Kleine hoeveelheid",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Bevat fruitsuikers",m:"Aanbevolen"}},
  "Citroen":      {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V2"],pest:{level:"middel",badge:"🟡 Middel",tip:"Wassen aanbevolen, zeker als je de schil gebruikt."},cal:29,info:"Citrusvrucht als smaakmaker.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig. Vitamine C helpt bij ijzeropname. Helpt ook bij ochtendmisselijkheid.",
    r:{k:"Nauwelijks suiker",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Zuur, nauwelijks suiker",m:"Essentieel"}},
  "Koffie":       {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:0,da:1,vevo:[],cal:2,info:"Cafeïnehoudende drank.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk (zwart)",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:2,zr:"Max. 200mg cafeïne per dag (±2 kopjes). Meer kan groeivertraging of miskraam veroorzaken.",
    r:{k:"Geen koolhydraten (zwart)",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose (zwart)",s:"Geen suiker (ongezoet)",m:"Met mate"}},
  "Groene thee":  {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V2"],cal:1,info:"Antioxidantrijke thee.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:2,zr:"Bevat cafeïne. Max. 3 koppen per dag. Vermindert ook ijzeropname, drink niet bij maaltijden.",
    r:{k:"Geen koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Populair"}},
  "Chocolade":    {k:0,v:0,g:1,l:0,s:0,m:0,p:0,ca:0,pu:0,fo:1,ai:0,da:0,cal:546,info:"Zoetigheid van cacao.",
    an:1,ag:1,am:0,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Kan noten bevatten (check label)",ag:"Meestal glutenvrij",am:"Melkchocolade bevat melk",ae:"Geen ei",af:"Geen vis",aso:"Kan soja bevatten",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:2,zr:"Pure chocolade met mate is veilig. Bevat cafeïne — beperk inname.",
    r:{k:"Veel suiker",v:"Melk bevat dierlijk",g:"Meestal glutenvrij",l:"Melkchocolade heeft lactose",s:"Veel suiker",m:"Kleine traktatie"}},
  "Wijn":         {k:0,v:1,g:1,l:1,s:0,m:1,p:0,ca:0,pu:0,fo:1,ai:0,da:0,cal:83,info:"Gefermenteerde druiven.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:0,zr:"NIET VEILIG. Er is geen veilige hoeveelheid alcohol tijdens de zwangerschap.",
    r:{k:"Droge wijn met mate",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Bevat suiker",m:"Glas rode wijn"}},
  "Bier":         {k:0,v:1,g:0,l:1,s:0,m:0,p:0,ca:0,pu:0,fo:0,ai:0,da:0,cal:43,info:"Alcoholische drank van graan.",
    an:1,ag:0,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Bevat gluten (gerst/tarwe)",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:0,zr:"NIET VEILIG. Geen alcohol tijdens de zwangerschap.",
    r:{k:"Koolhydraten en alcohol",v:"Plantaardig",g:"Bevat gluten",l:"Geen lactose",s:"Bevat suiker",m:"Wijn is mediterraner"}},
  "Sojamelk":     {k:0,v:1,g:1,l:1,s:0,m:0,p:0,ca:1,pu:1,fo:1,ai:1,da:1,cal:54,info:"Plantaardige melk van soja.",
    an:1,ag:1,am:1,ae:1,af:1,aso:0,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Bevat soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig met mate. Kies gefortificeerde versie met calcium en vitamine D.",
    r:{k:"Bevat koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Bevat suikers",m:"Niet traditioneel"}},
  "Amandelmelk":  {k:1,v:1,g:1,l:1,s:0,m:0,p:1,ca:1,pu:1,fo:1,ai:1,da:1,cal:15,info:"Plantaardige melkalternatief.",
    an:0,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Bevat amandelen (noten)",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig. Kies gefortificeerde versie met calcium en vitamine D.",
    r:{k:"Weinig koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Ongezoete versie suikervrij",m:"Niet traditioneel"}},
  "Water":        {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:[],cal:0,info:"Onmisbaar voor hydratatie.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Essentieel! Drink 2-3 liter per dag tijdens de zwangerschap.",
    r:{k:"Geen koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Basis gezond dieet"}},
  "Lever":        {k:1,v:0,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:0,da:1,cal:135,info:"Orgaanvlees, rijk aan vitamine A en ijzer.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:0,zr:"NIET VEILIG. Lever bevat te veel vitamine A, wat schadelijk is voor de foetus.",
    r:{k:"Eiwitrijk",v:"Dierlijk product",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Traditioneel onderdeel"}},
  "Chips":        {k:0,v:1,g:1,l:1,s:1,m:0,p:0,ca:0,pu:0,fo:1,ai:0,da:0,cal:536,info:"Gefrituurde aardappelschijfjes.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:2,zr:"Veilig maar weinig voedzaam. Hoog zoutgehalte kan bloeddruk verhogen.",
    r:{k:"Te veel koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Ongezonde snack"}},
  "Ketchup":      {k:0,v:1,g:1,l:1,s:0,m:0,p:0,ca:0,pu:0,fo:1,ai:0,da:0,cal:112,info:"Tomatensaus met veel suiker.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:2,zr:"Veilig in kleine hoeveelheden. Hoog suiker- en zoutgehalte.",
    r:{k:"Veel suiker",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Veel suiker",m:"Niet mediterraan"}},
  "Courgette":    {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V", "V2"],pest:{level:"middel",badge:"🟡 Middel",tip:"Wassen is voldoende. Middelmatige pesticidenbelasting."},cal:17,info:"Zomergroente, veelzijdig.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig en voedzaam. Goed wassen voor gebruik.",
    r:{k:"Weinig koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Populair mediterraan"}},
  "Aubergine":    {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V", "V2"],pest:{level:"middel",badge:"🟡 Middel",tip:"Wassen is voldoende. Middel in pesticidenbelasting."},cal:25,info:"Paarse vruchtgroente.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig. Altijd goed doorkoken voor consumptie.",
    r:{k:"Weinig koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Typisch mediterraan"}},
  "Knoflook":     {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:0,ai:1,da:1,vevo:["V2"],pest:{level:"laag",badge:"🟢 Clean Fifteen",tip:"Veilig conventioneel. Beschermende schil, weinig residuen."},cal:149,info:"Geneeskrachtige smaakmaker.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig in normale hoeveelheden. Grote supplementen vermijden.",
    r:{k:"Kleine hoeveelheid",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Onmisbaar"}},
  "Ui":           {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:0,ai:1,da:1,vevo:["V", "V2"],pest:{level:"laag",badge:"🟢 Clean Fifteen",tip:"Veilig conventioneel. Dikke schil beschermt goed."},cal:40,info:"Smaakmaker, prebiotisch.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig. Kan misselijkheid verergeren bij sommige vrouwen.",
    r:{k:"Kleine hoeveelheid",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Licht zoet",m:"Essentieel"}},
  "Alpro Haver":   {k:0,v:1,g:0,l:1,s:0,m:0,p:0,ca:1,pu:1,fo:0,ai:1,da:1,vevo:["V"],cal:46,info:"Plantaardige havermelk van Alpro.",
    an:1,ag:0,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Bevat haver (gluten mogelijk)",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig. Kies de gefortificeerde variant met calcium en vitamine D.",
    r:{k:"Bevat koolhydraten",v:"100% plantaardig",g:"Haver kan gluten bevatten",l:"Geen lactose",s:"Bevat suikers",m:"Niet traditioneel",p:"Granen niet toegestaan in paleo"}},
  "Alpro Soja":    {k:0,v:1,g:1,l:1,s:0,m:0,p:0,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["E"],cal:33,info:"Plantaardige sojamelk van Alpro.",
    an:1,ag:1,am:1,ae:1,af:1,aso:0,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Bevat soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig met mate. Kies gefortificeerde versie.",
    r:{k:"Bevat koolhydraten",v:"100% plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Bevat suikers",m:"Niet traditioneel",p:"Soja is peulvrucht, niet paleo"}},
  "Oatly Barista": {k:0,v:1,g:0,l:1,s:0,m:0,p:0,ca:0,pu:0,fo:0,ai:1,da:1,cal:70,info:"Romige havermelk, ideaal voor koffie.",
    an:1,ag:0,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Bevat haver (gluten mogelijk)",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig. Beverdinkt calorie-inname door romig gehalte.",
    r:{k:"Veel koolhydraten",v:"100% plantaardig",g:"Haver bevat gluten",l:"Geen lactose",s:"Bevat suikers",m:"Niet traditioneel",p:"Granen niet paleo"}},
  "Oatly Haver":   {k:0,v:1,g:0,l:1,s:0,m:0,p:0,ca:1,pu:1,fo:0,ai:1,da:1,vevo:["V"],cal:45,info:"Standaard havermelk van Oatly.",
    an:1,ag:0,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Bevat haver",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig. Goed alternatief voor koemelk.",
    r:{k:"Veel koolhydraten",v:"100% plantaardig",g:"Bevat gluten",l:"Geen lactose",s:"Bevat suikers",m:"Niet traditioneel",p:"Niet paleo"}},
  "AH Volkoren":   {k:0,v:1,g:0,l:1,s:1,m:1,p:0,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V"],cal:240,info:"Albert Heijn volkoren brood.",
    an:1,ag:0,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Bevat gluten (tarwe)",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig. Voedzamer dan witbrood door vezels.",
    r:{k:"Te veel koolhydraten",v:"Plantaardig",g:"Bevat gluten",l:"Geen lactose",s:"Geen toegevoegde suikers",m:"Met mate aanbevolen",p:"Granen niet paleo"}},
  "AH Halfvolle melk":{k:0,v:0,g:1,l:0,s:0,m:1,p:0,ca:0,pu:0,fo:1,ai:0,da:1,cal:46,info:"Albert Heijn halfvolle melk.",
    an:1,ag:1,am:0,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Bevat melkeiwitten",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Gepasteuriseerde melk is veilig. Goed voor calcium.",
    r:{k:"Bevat lactose",v:"Dierlijk product",g:"Geen gluten",l:"Bevat lactose",s:"Bevat melksuiker",m:"Met mate",p:"Zuivel niet paleo"}},
  "Quaker Havermout":{k:0,v:1,g:0,l:1,s:1,m:1,p:0,ca:1,pu:1,fo:0,ai:1,da:1,vevo:["V", "V2"],cal:370,info:"Klassieke havermout van Quaker.",
    an:1,ag:0,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Kan gluten bevatten (kruisbesmetting)",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Goed voor vezels en ijzer. Kies glutenvrije haver bij coeliakie.",
    r:{k:"Te veel koolhydraten",v:"Plantaardig",g:"Kruisbesmetting mogelijk",l:"Geen lactose",s:"Geen suiker",m:"Aanbevolen volkoren",p:"Granen niet paleo"}},
  "Activia Yoghurt":{k:0,v:0,g:1,l:0,s:0,m:1,p:0,ca:1,pu:1,fo:0,ai:1,da:1,vevo:["E", "V2"],cal:75,info:"Probiotische yoghurt van Activia.",
    an:1,ag:1,am:0,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Bevat melkeiwitten",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Gepasteuriseerde yoghurt is veilig. Goed voor darmen.",
    r:{k:"Bevat koolhydraten",v:"Dierlijk product",g:"Geen gluten",l:"Bevat lactose",s:"Bevat suikers",m:"Aanbevolen",p:"Zuivel niet paleo"}},
  "Lay's Chips":   {k:0,v:1,g:1,l:1,s:1,m:0,p:0,ca:0,pu:0,fo:1,ai:0,da:0,cal:536,info:"Populaire chips van Lay's.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:2,zr:"Veilig maar weinig voedzaam. Hoog zout- en vetgehalte.",
    r:{k:"Te veel koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Ongezonde snack",p:"Bewerkt product, niet paleo"}},
  "Bonduelle Mais": {k:0,v:1,g:1,l:1,s:1,m:1,p:0,ca:1,pu:1,fo:1,ai:1,da:1,cal:86,info:"Gekookte maïs in blik van Bonduelle.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig en voedzaam. Goed in salades.",
    r:{k:"Te veel koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Met mate",p:"Granen niet paleo"}},
  "Rode kool":      {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,cal:31,info:"Paarse bladgroente, rijk aan antioxidanten.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    pest:{level:"laag",badge:"🟢 Clean Fifteen",tip:"Veilig conventioneel. Koolsoorten bevatten weinig pesticiden."},
    zw:1,zr:"Veilig en voedzaam. Rijk aan vitamine C en foliumzuur.",
    r:{k:"Weinig koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Aanbevolen",p:"Groenten zijn paleo",ca:"Zeer caloriearm",pu:"Nul punten",fo:"Lage FODMAP",ai:"Anthocyanen zijn krachtig antioxidant",da:"Uitstekend voor DASH"}},
  "Witte kool":     {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,cal:25,info:"Milde koolsoort, veelzijdig te gebruiken.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    pest:{level:"laag",badge:"🟢 Clean Fifteen",tip:"Veilig conventioneel. Koolsoorten staan bekend om lage pesticidenbelasting."},
    zw:1,zr:"Veilig en rijk aan vitamine C.",
    r:{k:"Weinig koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Aanbevolen",p:"Groenten zijn paleo",ca:"Zeer caloriearm",pu:"Nul punten",fo:"Lage FODMAP",ai:"Vezels en vitamine C",da:"Goed voor DASH"}},
  "Spruiten":       {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:0,ai:1,da:1,cal:43,info:"Kleine spruitjes, rijk aan vezels en vitamine K.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2","E"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    pest:{level:"middel",badge:"🟡 Middel",tip:"Goed wassen aanbevolen."},
    zw:1,zr:"Voedzaam. Rijk aan foliumzuur en vitamine K.",
    r:{k:"Weinig koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Aanbevolen",p:"Groenten zijn paleo",ca:"Caloriearm",pu:"Nul punten",fo:"Hoge FODMAP — vermijden",ai:"Antioxidanten en vezels",da:"Aanbevolen voor DASH"}},
  "Prei":           {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:0,ai:1,da:1,cal:61,info:"Milde uiachtige groente, rijk aan foliumzuur.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    pest:{level:"middel",badge:"🟡 Middel",tip:"Goed wassen aanbevolen, pesticiden kunnen tussen de lagen zitten."},
    zw:1,zr:"Goed voor foliumzuur. Goed wassen voor gebruik.",
    r:{k:"Weinig koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Populair mediterraan",p:"Groenten zijn paleo",ca:"Caloriearm",pu:"Nul punten",fo:"Hoge FODMAP — gebruik alleen het groene deel",ai:"Quercetine werkt antioxidatief",da:"Goed voor DASH"}},
  "Bleekselderij":  {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,cal:16,info:"Knapperige groente, bijna calorievrij.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    pest:{level:"hoog",badge:"🔴 Dirty Dozen",tip:"Koop biologisch. Bleekselderij absorbeert pesticiden sterk."},
    zw:1,zr:"Veilig. Helpt bij hydratatie door hoog watergehalte.",
    r:{k:"Bijna geen koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Veel gebruikt",p:"Groenten zijn paleo",ca:"Bijna calorievrij",pu:"Nul punten",fo:"Lage FODMAP (2 stelen max)",ai:"Antioxidanten en ontstekingsremmend",da:"Uitstekend voor DASH"}},
  "Venkel":         {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:0,ai:1,da:1,cal:31,info:"Anijsachtige smaak, goed voor spijsvertering.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    pest:{level:"middel",badge:"🟡 Middel",tip:"Goed wassen aanbevolen."},
    zw:1,zr:"Kan helpen bij misselijkheid en spijsverteringsklachten.",
    r:{k:"Weinig koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Typisch mediterraan",p:"Groenten zijn paleo",ca:"Caloriearm",pu:"Nul punten",fo:"Hoge FODMAP — vermijden",ai:"Antioxidanten",da:"Goed voor DASH"}},
  "Pompoen":        {k:0,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,cal:26,info:"Oranje vruchtgroente, rijk aan bètacaroteen.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    pest:{level:"laag",badge:"🟢 Clean Fifteen",tip:"Veilig conventioneel. Dikke schil beschermt goed."},
    zw:1,zr:"Uitstekend: bètacaroteen, vitamine C en foliumzuur.",
    r:{k:"Te veel koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Populair in herfst",p:"Groenten zijn paleo",ca:"Caloriearm",pu:"Laag in punten",fo:"Lage FODMAP",ai:"Bètacaroteen is krachtig antioxidant",da:"Goed voor DASH"}},
  "Mango":          {k:0,v:1,g:1,l:1,s:0,m:0,p:1,ca:0,pu:0,fo:0,ai:1,da:1,cal:60,info:"Tropisch fruit, rijk aan vitamine A en C.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    pest:{level:"laag",badge:"🟢 Clean Fifteen",tip:"Veilig conventioneel. Dikke schil, weinig residuen."},
    zw:1,zr:"Veilig. Rijk aan foliumzuur en vitamine C.",
    r:{k:"Te veel suiker",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Hoog in fruitsuiker",m:"Niet traditioneel mediterraan",p:"Fruit is paleo",ca:"Calorierijker fruit",pu:"Matig in punten",fo:"Hoge FODMAP",ai:"Polyfenolen zijn antioxidatief",da:"Met mate voor DASH"}},
  "Ananas":         {k:0,v:1,g:1,l:1,s:0,m:0,p:1,ca:1,pu:0,fo:0,ai:1,da:1,cal:50,info:"Tropisch fruit met bromelaïne, ontstekingsremmend enzym.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    pest:{level:"laag",badge:"🟢 Clean Fifteen",tip:"Veilig conventioneel. Dikke schil, bijna geen pesticiden gevonden."},
    zw:1,zr:"Veilig. Bromelaïne kan helpen bij ontstekingen.",
    r:{k:"Te veel koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Hoog in fruitsuiker",m:"Niet mediterraan",p:"Fruit is paleo",ca:"Matig calorieën",pu:"Matig in punten",fo:"Hoge FODMAP",ai:"Bromelaïne is ontstekingsremmend",da:"Met mate voor DASH"}},
  "Watermeloen":    {k:0,v:1,g:1,l:1,s:0,m:0,p:1,ca:1,pu:1,fo:0,ai:1,da:1,cal:30,info:"Zomerfruit, 92% water, verfrissend en licht.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    pest:{level:"laag",badge:"🟢 Clean Fifteen",tip:"Veilig conventioneel. Dikke schil beschermt goed."},
    zw:1,zr:"Veilig. Helpt bij hydratatie.",
    r:{k:"Te veel suiker",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Bevat fruitsuiker",m:"Populair zomerfruit",p:"Fruit is paleo",ca:"Laag in calorieën",pu:"Laag in punten",fo:"Hoge FODMAP bij grote hoeveelheid",ai:"Lycopeen is antioxidant",da:"Goed voor DASH"}},
  "Granaatappel":   {k:0,v:1,g:1,l:1,s:0,m:1,p:1,ca:0,pu:0,fo:0,ai:1,da:1,cal:83,info:"Superfruit, extreem rijk aan antioxidanten.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    pest:{level:"middel",badge:"🟡 Middel",tip:"Goed wassen aanbevolen."},
    zw:1,zr:"Veilig. Rijk aan foliumzuur en antioxidanten.",
    r:{k:"Te veel suiker",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Hoog in fruitsuiker",m:"Typisch mediterraan",p:"Fruit is paleo",ca:"Calorierijker fruit",pu:"Hoog in punten",fo:"Hoge FODMAP",ai:"Punicalagins zijn krachtigste antioxidanten",da:"Met mate voor DASH"}},
  "Pruim":          {k:0,v:1,g:1,l:1,s:0,m:1,p:1,ca:1,pu:1,fo:0,ai:1,da:1,cal:46,info:"Zoet steenfruit, goed voor de darmwerking.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    pest:{level:"hoog",badge:"🔴 Dirty Dozen",tip:"Koop biologisch. Pruimen staan hoog in pesticidenbelasting."},
    zw:1,zr:"Veilig. Helpt bij obstipatie door sorbitol.",
    r:{k:"Te veel suiker",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Hoog in fruitsuiker",m:"Met mate",p:"Fruit is paleo",ca:"Matig calorieën",pu:"Matig in punten",fo:"Hoge FODMAP",ai:"Polyfenolen",da:"Met mate voor DASH"}},
  "Nectarine":      {k:0,v:1,g:1,l:1,s:0,m:1,p:1,ca:1,pu:1,fo:0,ai:1,da:1,cal:44,info:"Perzikachtig steenfruit zonder velletje.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    pest:{level:"hoog",badge:"🔴 Dirty Dozen",tip:"Koop biologisch. Nr. 5 in Dirty Dozen 2026."},
    zw:1,zr:"Veilig. Rijk aan vitamine C en kalium.",
    r:{k:"Te veel suiker",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Hoog in fruitsuiker",m:"Mediterraan fruit",p:"Fruit is paleo",ca:"Laag in calorieën",pu:"Laag in punten",fo:"Hoge FODMAP",ai:"Vitamine C en polyfenolen",da:"Goed fruit voor DASH"}},
  "Mais":           {k:0,v:1,g:1,l:1,s:0,m:1,p:0,ca:1,pu:1,fo:1,ai:0,da:1,cal:86,info:"Gele graansoort, veelzijdig en zoet.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    pest:{level:"laag",badge:"🟢 Clean Fifteen",tip:"Veilig conventioneel. Suikermaïs staat bovenaan Clean Fifteen."},
    zw:1,zr:"Veilig. Goed voor vezels en energie.",
    r:{k:"Te veel koolhydraten",v:"Plantaardig",g:"Glutenvrij graan",l:"Geen lactose",s:"Bevat suikers",m:"Met mate",p:"Granen niet paleo",ca:"Matig calorieën",pu:"Matig in punten",fo:"Lage FODMAP",ai:"Bevat suiker, minder anti-inflammatoir",da:"Met mate voor DASH"}},
  "Radijs":         {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,cal:16,info:"Pittige kleine knol, knapperig en verfrissend.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    pest:{level:"middel",badge:"🟡 Middel",tip:"Goed wassen aanbevolen."},
    zw:1,zr:"Veilig. Goed wassen voor gebruik.",
    r:{k:"Bijna geen koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Salade ingredient",p:"Groenten zijn paleo",ca:"Bijna calorievrij",pu:"Nul punten",fo:"Lage FODMAP",ai:"Antioxidanten",da:"Prima voor DASH"}},
  "Witlof":         {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,cal:17,info:"Lichtgele bladgroente, licht bitter van smaak.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    pest:{level:"middel",badge:"🟡 Middel",tip:"Goed wassen aanbevolen."},
    zw:1,zr:"Veilig. Bitter stof inuline is goed voor darmbacteriën.",
    r:{k:"Weinig koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Typisch Nederlands/Belgisch",p:"Groenten zijn paleo",ca:"Caloriearm",pu:"Nul punten",fo:"Lage FODMAP",ai:"Inuline ondersteunt darmflora",da:"Goed voor DASH"}},
  "Rucola":         {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,cal:25,info:"Pittige saladeblaadjes, rijk aan vitamine K.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    pest:{level:"middel",badge:"🟡 Middel",tip:"Goed wassen aanbevolen."},
    zw:1,zr:"Veilig. Rijk aan foliumzuur en vitamine K.",
    r:{k:"Nauwelijks koolhydraten",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Typisch Italiaans",p:"Groenten zijn paleo",ca:"Bijna calorievrij",pu:"Nul punten",fo:"Lage FODMAP",ai:"Glucosinolaten zijn kankerremmend",da:"Uitstekend voor DASH"}},
  "Makreel":        {k:1,v:0,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,cal:205,info:"Vette vis, rijk aan omega-3 en vitamine D.",
    an:1,ag:1,am:1,ae:1,af:0,aso:1,asc:1,ase:1,vevo:["E","O"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Bevat vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig mits goed doorbakken. Beperkt tot 2x per week vanwege kwik.",
    r:{k:"Vette vis, uitstekend",v:"Dierlijk product",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Aanbevolen vette vis",p:"Vis is paleo",ca:"Calorierijk maar voedzaam",pu:"Matig in punten",fo:"Geen FODMAP",ai:"Omega-3 sterk ontstekingsremmend",da:"Uitstekend voor DASH"}},
  "Haring":         {k:1,v:0,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,cal:158,info:"Traditioneel Nederlandse vette vis.",
    an:1,ag:1,am:1,ae:1,af:0,aso:1,asc:1,ase:1,vevo:["E","O"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Bevat vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:0,zr:"NIET VEILIG rauw. Alleen gemarineerde of verhitte haring is veilig tijdens zwangerschap.",
    r:{k:"Vette vis",v:"Dierlijk product",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Gezonde vette vis",p:"Vis is paleo",ca:"Matig calorieën",pu:"Matig in punten",fo:"Geen FODMAP",ai:"Omega-3 vetzuren",da:"Goed voor DASH"}},
  "Sardines":       {k:1,v:0,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,cal:208,info:"Kleine vette vis, rijk aan calcium en omega-3.",
    an:1,ag:1,am:1,ae:1,af:0,aso:1,asc:1,ase:1,vevo:["E","O","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Bevat vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig mits goed doorbakken. Laag in kwik.",
    r:{k:"Vette vis, perfect",v:"Dierlijk product",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Typisch mediterraan",p:"Vis is paleo",ca:"Calorierijk maar voedzaam",pu:"Matig in punten",fo:"Geen FODMAP",ai:"Omega-3 en calcium",da:"Uitstekend voor DASH"}},
  "Kabeljauw":      {k:1,v:0,g:1,l:1,s:1,m:1,p:1,ca:1,pu:1,fo:1,ai:1,da:1,cal:82,info:"Witte magere vis, mild van smaak.",
    an:1,ag:1,am:1,ae:1,af:0,aso:1,asc:1,ase:1,vevo:["E"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Bevat vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig mits goed doorbakken. Laag in kwik.",
    r:{k:"Mager eiwit, geen koolhydraten",v:"Dierlijk product",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Aanbevolen witte vis",p:"Vis is paleo",ca:"Zeer caloriearm",pu:"Laag in punten",fo:"Geen FODMAP",ai:"Mager eiwit, weinig ontsteking",da:"Uitstekend voor DASH"}},
  "Biefstuk":       {k:1,v:0,g:1,l:1,s:1,m:0,p:1,ca:0,pu:0,fo:1,ai:0,da:0,cal:271,info:"Mals stuk rundvlees, eiwitrijk.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["E"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Goed doorbakken is veilig. Rauw of rosé vermijden tijdens zwangerschap.",
    r:{k:"Eiwitrijk, geen koolhydraten",v:"Dierlijk product",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Rood vlees met mate",p:"Vlees is paleo",ca:"Calorierijk",pu:"Hoog in punten",fo:"Geen FODMAP",ai:"Verzadigd vet is pro-inflammatoir",da:"Rood vlees beperken bij DASH"}},
  "Gehakt":         {k:1,v:0,g:1,l:1,s:1,m:0,p:1,ca:0,pu:0,fo:1,ai:0,da:0,cal:254,info:"Gemalen vlees, veelzijdig te bereiden.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["E"],
    ar:{an:"Geen noten",ag:"Puur gehakt is glutenvrij",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Goed doorbakken is essentieel. Rosé gehakt is niet veilig.",
    r:{k:"Eiwitrijk en vetrijk",v:"Dierlijk product",g:"Puur gehakt glutenvrij",l:"Geen lactose",s:"Geen suiker",m:"Rood vlees met mate",p:"Vlees is paleo",ca:"Calorierijk",pu:"Hoog in punten",fo:"Geen FODMAP",ai:"Pro-inflammatoir door verzadigd vet",da:"Met mate voor DASH"}},
  "Ham":            {k:1,v:0,g:1,l:1,s:0,m:0,p:0,ca:1,pu:1,fo:1,ai:0,da:0,cal:145,info:"Gekookt of gerookt varkensvlees.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["E"],
    ar:{an:"Geen noten",ag:"Meestal glutenvrij",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:2,zr:"Beperkt eten. Hoog zoutgehalte en bewerkt vlees. Kies magere, ongekruide variant.",
    r:{k:"Eiwitrijk",v:"Dierlijk product",g:"Meestal glutenvrij",l:"Geen lactose",s:"Bevat suikers",m:"Bewerkt vlees",p:"Bewerkt, niet paleo",ca:"Matig calorieën",pu:"Matig in punten",fo:"Geen FODMAP",ai:"Bewerkt vlees is pro-inflammatoir",da:"Vermijden door zoutgehalte"}},
  "Spek":           {k:1,v:0,g:1,l:1,s:1,m:0,p:0,ca:0,pu:0,fo:1,ai:0,da:0,cal:541,info:"Gerookt buikspek, zeer vetrijk.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["E","O"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:2,zr:"Met mate. Hoog zout- en vetgehalte. Kies magere variant.",
    r:{k:"Vetrijk, keto-vriendelijk",v:"Dierlijk product",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Niet mediterraan",p:"Bewerkt, niet paleo",ca:"Zeer calorierijk",pu:"Hoog in punten",fo:"Geen FODMAP",ai:"Sterk pro-inflammatoir",da:"Vermijden bij DASH"}},
  "Kwark":          {k:0,v:0,g:1,l:0,s:0,m:1,p:0,ca:1,pu:1,fo:0,ai:1,da:1,cal:58,info:"Verse kaassoort, eiwitrijk en laag in vet.",
    an:1,ag:1,am:0,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["E","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Bevat melkeiwitten",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Gepasteuriseerde kwark is veilig. Goed voor calcium en eiwit.",
    r:{k:"Bevat koolhydraten",v:"Dierlijk product",g:"Geen gluten",l:"Bevat lactose",s:"Bevat melksuiker",m:"Eiwitrijke optie",p:"Zuivel niet paleo",ca:"Matig calorieën",pu:"Matig in punten",fo:"Hoge FODMAP",ai:"Probiotica positief",da:"Magere kwark voor DASH"}},
  "Ricotta":        {k:1,v:0,g:1,l:0,s:1,m:1,p:0,ca:1,pu:1,fo:1,ai:0,da:1,cal:174,info:"Zachte Italiaanse kaas van weipoeder.",
    an:1,ag:1,am:0,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["E","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Bevat melkeiwitten",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Gepasteuriseerde ricotta is veilig. Controleer het label.",
    r:{k:"Laag in koolhydraten",v:"Dierlijk product",g:"Geen gluten",l:"Bevat lactose",s:"Geen suiker",m:"Typisch Italiaans",p:"Zuivel niet paleo",ca:"Matig calorieën",pu:"Matig in punten",fo:"Kleine hoeveelheid lage FODMAP",ai:"Verzadigd vet",da:"Met mate voor DASH"}},
  "Pijnboompitten": {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:0,pu:0,fo:1,ai:1,da:1,cal:673,info:"Zaden van de pijnboom, basis van pesto.",
    an:0,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["E","O","V2"],
    ar:{an:"Bevat noten (pijnboompitten)",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig. Rijk aan zink en vitamine E.",
    r:{k:"Vet en eiwit",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Basis van pesto",p:"Noten zijn paleo",ca:"Calorierijk",pu:"Hoog in punten",fo:"Lage FODMAP",ai:"Vitamine E en gezonde vetten",da:"Met mate voor DASH"}},
  "Sesamzaad":      {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:0,pu:0,fo:1,ai:1,da:1,cal:573,info:"Klein zaad, rijk aan calcium en gezonde vetten.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:0,vevo:["E","O","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Bevat sesam"},
    zw:1,zr:"Veilig. Goed voor calcium bij lactose-intolerantie.",
    r:{k:"Vet en eiwit",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Mediterraan en Midden-Oosten",p:"Zaden zijn paleo",ca:"Calorierijk",pu:"Hoog in punten",fo:"Lage FODMAP",ai:"Sesamol is antioxidant",da:"Met mate voor DASH"}},
  "Pompoenpitten":  {k:1,v:1,g:1,l:1,s:1,m:1,p:1,ca:0,pu:0,fo:1,ai:1,da:1,cal:559,info:"Rijke bron van zink en magnesium.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["E","O","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig. Rijk aan zink en magnesium.",
    r:{k:"Vet en eiwit",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Gezonde snack",p:"Zaden zijn paleo",ca:"Calorierijk",pu:"Hoog in punten",fo:"Lage FODMAP",ai:"Zink en magnesium zijn anti-inflammatoir",da:"Met mate voor DASH"}},
  "Sojasaus":       {k:1,v:1,g:0,l:1,s:0,m:0,p:0,ca:1,pu:1,fo:1,ai:0,da:0,cal:60,info:"Gefermenteerde saus van sojabonen en tarwe.",
    an:1,ag:0,am:1,ae:1,af:1,aso:0,asc:1,ase:1,vevo:[],
    ar:{an:"Geen noten",ag:"Bevat gluten (tarwe)",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Bevat soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:2,zr:"Veilig met mate. Hoog natriumgehalte — beperk inname.",
    r:{k:"Weinig koolhydraten",v:"Plantaardig",g:"Bevat gluten",l:"Geen lactose",s:"Bevat suiker",m:"Niet mediterraan",p:"Bewerkt, niet paleo",ca:"Weinig calorieën",pu:"Laag in punten",fo:"Lage FODMAP",ai:"Hoog zout is pro-inflammatoir",da:"Vermijden door zoutgehalte"}},
  "Kokosolie":      {k:1,v:1,g:1,l:1,s:1,m:0,p:1,ca:0,pu:0,fo:1,ai:0,da:0,cal:862,info:"Tropische olie, hoog in verzadigd vet.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["O"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig met mate.",
    r:{k:"Puur vet",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen suiker",m:"Niet mediterraan",p:"Toegestaan in paleo",ca:"Zeer calorierijk",pu:"Hoog in punten",fo:"Geen FODMAP",ai:"Omstreden: laurinezuur",da:"Olijfolie is beter voor DASH"}},
  "Zilvervliesrijst":{k:0,v:1,g:1,l:1,s:1,m:1,p:0,ca:1,pu:1,fo:1,ai:1,da:1,cal:362,info:"Voller dan witte rijst, meer vezels en voedingsstoffen.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig. Beter alternatief voor witte rijst.",
    r:{k:"Te veel koolhydraten",v:"Plantaardig",g:"Glutenvrij",l:"Geen lactose",s:"Geen suiker",m:"Beter alternatief",p:"Granen niet paleo",ca:"Meer vezels dan wit",pu:"Matig in punten",fo:"Lage FODMAP",ai:"Vezels werken ontstekingsremmend",da:"Aanbevolen boven witte rijst"}},
  "Speltbrood":     {k:0,v:1,g:0,l:1,s:1,m:1,p:0,ca:1,pu:1,fo:0,ai:1,da:1,cal:254,info:"Oud graan, beter verteerbaar dan tarwe.",
    an:1,ag:0,am:1,ae:1,af:1,aso:1,asc:1,ase:1,vevo:["V","V2"],
    ar:{an:"Geen noten",ag:"Bevat gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig. Voedzamer dan witbrood.",
    r:{k:"Te veel koolhydraten",v:"Plantaardig",g:"Bevat gluten",l:"Geen lactose",s:"Geen suiker",m:"Met mate aanbevolen",p:"Granen niet paleo",ca:"Meer vezels dan wit",pu:"Matig in punten",fo:"Hoge FODMAP",ai:"Volkoren werkt entstekingsremmend",da:"Aanbevolen volkoren variant"}},
  "Aardappel":    {k:0,v:1,g:1,l:1,s:1,m:1,p:0,ca:1,pu:1,fo:1,ai:1,da:1,vevo:["V", "V2"],pest:{level:"hoog",badge:"🔴 Dirty Dozen",tip:"Koop biologisch of schil goed. Staat onderaan Dirty Dozen maar bevat systemische pesticiden."},cal:77,info:"Knolgewas, zetmeelrijk.",
    an:1,ag:1,am:1,ae:1,af:1,aso:1,asc:1,ase:1,
    ar:{an:"Geen noten",ag:"Geen gluten",am:"Geen melk",ae:"Geen ei",af:"Geen vis",aso:"Geen soja",asc:"Geen schaaldieren",ase:"Geen sesam"},
    zw:1,zr:"Veilig. Goed doorkoken. Rijk aan kalium en vitamine C.",
    r:{k:"Te zetmeelrijk",v:"Plantaardig",g:"Geen gluten",l:"Geen lactose",s:"Geen toegevoegde suiker",m:"Met mate"}},
};

const CATEGORIES = {
  "🥩 Vlees & Vis":    ["Kipfilet","Zalm","Tonijn","Garnalen","Ei","Lever"],
  "🥦 Groenten":       ["Broccoli","Spinazie","Tomaat","Komkommer","Paprika","Champignons","Courgette","Aubergine","Knoflook","Ui","Rode kool","Witte kool","Spruiten","Prei","Bleekselderij","Venkel","Pompoen","Radijs","Witlof","Rucola","Mais"],
  "🍎 Fruit":          ["Appel","Banaan","Aardbei","Blauwe bessen","Citroen","Mango","Ananas","Watermeloen","Granaatappel","Pruim","Nectarine"],
  "🧀 Zuivel":         ["Melk","Kaas","Yoghurt","Boter","Feta","Amandelmelk","Sojamelk","Kwark","Ricotta"],
  "🌾 Granen & Brood": ["Witbrood","Volkoren brood","Pasta","Rijst","Quinoa","Havermout","Zilvervliesrijst","Speltbrood"],
  "🥜 Noten & Zaden":  ["Amandelen","Walnoten","Pindakaas","Tahini","Pijnboompitten","Sesamzaad","Pompoenpitten"],
  "🫘 Peulvruchten":   ["Linzen","Kikkererwten","Hummus"],
  "🛢️ Overig":         ["Olijfolie","Ketchup","Avocado","Koffie","Groene thee","Wijn","Bier","Water","Chips","Chocolade","Aardappel","Sojasaus","Kokosolie"],
};

const RECIPES = {
  keto: [
    { name:"Zalm met spinazie", time:"20 min", cal:380, ingredients:["Zalm","Spinazie","Boter","Knoflook","Citroen"], desc:"Gebakken zalm op een bed van gekruide spinazie." },
    { name:"Avocado ei salade", time:"10 min", cal:290, ingredients:["Avocado","Ei","Tomaat","Citroen"], desc:"Romige avocado met hardgekookte eieren." },
    { name:"Kip met broccoli", time:"25 min", cal:340, ingredients:["Kipfilet","Broccoli","Knoflook","Olijfolie"], desc:"Geroosterde kipfilet met knoflookbroccoli." },
    { name:"Roerei met champignons", time:"10 min", cal:320, ingredients:["Ei","Champignons","Boter","Knoflook"], desc:"Luchtig roerei met gebakken champignons." },
    { name:"Courgette noedels", time:"15 min", cal:260, ingredients:["Courgette","Zalm","Knoflook","Olijfolie","Citroen"], desc:"Courgetteslierten met gerookte zalm." },
    { name:"Keto kaasomelet", time:"10 min", cal:350, ingredients:["Ei","Kaas","Spinazie","Boter"], desc:"Dikke omelet gevuld met gesmolten kaas." },
    { name:"Kippensoep", time:"30 min", cal:290, ingredients:["Kipfilet","Ui","Knoflook","Spinazie","Broccoli"], desc:"Verwarmende kippensoep zonder pasta." },
    { name:"Tonijn salade", time:"10 min", cal:310, ingredients:["Tonijn","Avocado","Komkommer","Citroen"], desc:"Frisse tonijnsalade met romige avocado." },
    { name:"Gegrilde garnalen", time:"15 min", cal:270, ingredients:["Garnalen","Knoflook","Olijfolie","Citroen","Paprika"], desc:"Snel gegrilde garnalen met knoflook." },
    { name:"Bloemkoolrijst bowl", time:"20 min", cal:230, ingredients:["Bloemkool","Ei","Knoflook","Olijfolie"], desc:"Bloemkool als gezonde rijstvervanger." },
    { name:"Keto ontbijt bowl", time:"10 min", cal:380, ingredients:["Ei","Spek","Avocado","Tomaat"], desc:"Vullend keto ontbijt zonder koolhydraten." },
    { name:"Zalm met rode kool", time:"25 min", cal:360, ingredients:["Zalm","Rode kool","Citroen","Olijfolie"], desc:"Kleurrijke keto maaltijd met rode kool." },
    { name:"Kip met venkel", time:"30 min", cal:310, ingredients:["Kipfilet","Venkel","Knoflook","Olijfolie","Citroen"], desc:"Aromatische kip met geroosterde venkel." },
    { name:"Makreel salade", time:"10 min", cal:340, ingredients:["Makreel","Komkommer","Rucola","Citroen","Olijfolie"], desc:"Snelle salade met vette makreel." },
    { name:"Keto groentesoep", time:"25 min", cal:180, ingredients:["Courgette","Spinazie","Broccoli","Knoflook","Olijfolie"], desc:"Romige groentesoep zonder aardappel." },
    { name:"Gevulde paprika keto", time:"30 min", cal:350, ingredients:["Paprika","Gehakt","Champignons","Kaas","Knoflook"], desc:"Paprika gevuld met gehakt en kaas." },
    { name:"Sardines met rucola", time:"10 min", cal:290, ingredients:["Sardines","Rucola","Citroen","Olijfolie"], desc:"Snelle mediterrane keto snack." },
    { name:"Witlof met ham", time:"15 min", cal:260, ingredients:["Witlof","Ham","Kaas","Boter"], desc:"Klassiek Nederlands keto gerecht." },
    { name:"Spruiten met spek", time:"20 min", cal:310, ingredients:["Spruiten","Spek","Boter","Knoflook"], desc:"Krokante spruiten met gebakken spek." },
    { name:"Kip rode kool stoofpot", time:"35 min", cal:370, ingredients:["Kipfilet","Rode kool","Ui","Olijfolie","Knoflook"], desc:"Warme keto stoofpot voor de herfst." },
  ],
  vegan: [
    { name:"Quinoa bowl", time:"20 min", cal:420, ingredients:["Quinoa","Kikkererwten","Spinazie","Tomaat","Citroen"], desc:"Voedzame plantaardige bowl." },
    { name:"Hummus & groenten", time:"5 min", cal:220, ingredients:["Hummus","Komkommer","Paprika","Tomaat"], desc:"Snelle vegan snack met verse groenten." },
    { name:"Linzensoep", time:"35 min", cal:310, ingredients:["Linzen","Tomaat","Ui","Knoflook","Olijfolie"], desc:"Hartverwarmende mediterrane linzensoep." },
    { name:"Avocado toast", time:"10 min", cal:380, ingredients:["Volkoren brood","Avocado","Tomaat","Citroen"], desc:"Krokante toast met verse avocado." },
    { name:"Boeddha bowl", time:"25 min", cal:460, ingredients:["Rijst","Kikkererwten","Avocado","Spinazie","Tahini"], desc:"Kleurrijke bowl met tahinidressing." },
    { name:"Groentecurry", time:"30 min", cal:390, ingredients:["Kikkererwten","Spinazie","Tomaat","Ui","Knoflook"], desc:"Romige curry met kikkererwten." },
    { name:"Havermout ontbijt", time:"10 min", cal:340, ingredients:["Havermout","Banaan","Blauwe bessen","Amandelmelk"], desc:"Warme havermout met verse bessen." },
    { name:"Tomatensalade", time:"10 min", cal:150, ingredients:["Tomaat","Ui","Olijfolie","Citroen"], desc:"Zomerse tomatensalade met vinaigrette." },
    { name:"Linzen dhal", time:"40 min", cal:430, ingredients:["Linzen","Tomaat","Ui","Knoflook","Rijst"], desc:"Indiaas geïnspireerde linzenstoofpot." },
    { name:"Courgette soep", time:"25 min", cal:180, ingredients:["Courgette","Ui","Knoflook","Olijfolie"], desc:"Lichte romige courgettesoep." },
    { name:"Rode kool salade", time:"15 min", cal:190, ingredients:["Rode kool","Appel","Walnoten","Citroen","Olijfolie"], desc:"Frisse winterse salade met walnoten." },
    { name:"Pompoen soep", time:"30 min", cal:210, ingredients:["Pompoen","Ui","Knoflook","Olijfolie","Amandelmelk"], desc:"Romige pompoenvsoep zonder room." },
    { name:"Spruiten wok", time:"20 min", cal:260, ingredients:["Spruiten","Prei","Knoflook","Sojasaus","Sesamzaad"], desc:"Aziatische wok van wintergroenten." },
    { name:"Witlof salade", time:"10 min", cal:170, ingredients:["Witlof","Appel","Walnoten","Citroen","Olijfolie"], desc:"Klassieke Belgische witlofsalade." },
    { name:"Gevulde paprika vegan", time:"35 min", cal:350, ingredients:["Paprika","Quinoa","Kikkererwten","Tomaat","Knoflook"], desc:"Paprika gevuld met quinoa en kikkererwten." },
    { name:"Granaatappel salade", time:"10 min", cal:220, ingredients:["Rucola","Granaatappel","Walnoten","Olijfolie","Citroen"], desc:"Feestelijke salade met granaatappelpitjes." },
    { name:"Venkel sinaasappel salade", time:"10 min", cal:160, ingredients:["Venkel","Sinaasappel","Olijfolie","Citroen"], desc:"Frisse Italiaanse wintersalade." },
    { name:"Prei soep", time:"25 min", cal:180, ingredients:["Prei","Aardappel","Ui","Olijfolie","Amandelmelk"], desc:"Romige preisoep helemaal plantaardig." },
    { name:"Radijs komkommer snack", time:"5 min", cal:80, ingredients:["Radijs","Komkommer","Hummus","Citroen"], desc:"Lichte vegan snack voor tussendoor." },
    { name:"Mais avocado bowl", time:"15 min", cal:390, ingredients:["Mais","Avocado","Tomaat","Citroen","Koriander"], desc:"Mexicaanse stijl vegan bowl." },
  ],
  mediterraan: [
    { name:"Griekse salade", time:"10 min", cal:260, ingredients:["Tomaat","Komkommer","Feta","Ui","Olijfolie"], desc:"Klassieke Griekse salade met feta." },
    { name:"Gegrilde zalm", time:"20 min", cal:390, ingredients:["Zalm","Citroen","Olijfolie","Knoflook"], desc:"Mediterraans gekruide zalm van de grill." },
    { name:"Hummus toast", time:"5 min", cal:280, ingredients:["Volkoren brood","Hummus","Tomaat","Komkommer"], desc:"Volkoren toast met huisgemaakte hummus." },
    { name:"Kip met courgette", time:"25 min", cal:350, ingredients:["Kipfilet","Courgette","Tomaat","Olijfolie","Knoflook"], desc:"Mediterrane kipschotel." },
    { name:"Tonijn pasta", time:"20 min", cal:480, ingredients:["Pasta","Tonijn","Tomaat","Olijfolie","Knoflook"], desc:"Snelle Italiaanse pasta met tonijn." },
    { name:"Gegrilde aubergine", time:"20 min", cal:200, ingredients:["Aubergine","Olijfolie","Knoflook","Citroen"], desc:"Zachte gegrilde aubergine." },
    { name:"Garnalen risotto", time:"35 min", cal:520, ingredients:["Rijst","Garnalen","Ui","Knoflook","Olijfolie"], desc:"Romige risotto met garnalen." },
    { name:"Feta salade", time:"10 min", cal:290, ingredients:["Spinazie","Feta","Walnoten","Olijfolie","Citroen"], desc:"Frisse spinaziesalade met feta." },
    { name:"Linzen stoofpot", time:"40 min", cal:400, ingredients:["Linzen","Tomaat","Ui","Knoflook","Olijfolie"], desc:"Hartige mediterrane linzenstoofpot." },
    { name:"Mediterraanse omelet", time:"15 min", cal:330, ingredients:["Ei","Tomaat","Olijfolie","Spinazie","Feta"], desc:"Omelet met Griekse toppings." },
    { name:"Sardines met citroen", time:"10 min", cal:270, ingredients:["Sardines","Citroen","Olijfolie","Rucola"], desc:"Eenvoudig Italiaans antipasto." },
    { name:"Gevulde aubergine", time:"35 min", cal:310, ingredients:["Aubergine","Gehakt","Tomaat","Feta","Knoflook"], desc:"Klassieke gevulde aubergine." },
    { name:"Makreel met venkel", time:"25 min", cal:370, ingredients:["Makreel","Venkel","Citroen","Olijfolie"], desc:"Vette vis met aromatische venkel." },
    { name:"Rucola granaatappel", time:"10 min", cal:220, ingredients:["Rucola","Granaatappel","Pijnboompitten","Olijfolie","Citroen"], desc:"Elegante Italiaanse salade." },
    { name:"Rode kool stoofpot", time:"40 min", cal:290, ingredients:["Rode kool","Ui","Olijfolie","Citroen","Knoflook"], desc:"Mediterraanse wintergroenteschotel." },
    { name:"Witlof met ansjovis", time:"15 min", cal:240, ingredients:["Witlof","Olijfolie","Citroen","Knoflook"], desc:"Bittere witlof met mediterrane smaken." },
    { name:"Spruiten met tahini", time:"20 min", cal:280, ingredients:["Spruiten","Tahini","Citroen","Knoflook","Sesamzaad"], desc:"Midden-Oosterse twist op spruiten." },
    { name:"Pompoen feta schotel", time:"30 min", cal:320, ingredients:["Pompoen","Feta","Olijfolie","Knoflook","Walnoten"], desc:"Kleurrijke herfstschotel met feta." },
    { name:"Kabeljauw tomaat", time:"25 min", cal:290, ingredients:["Kabeljauw","Tomaat","Olijfolie","Knoflook","Citroen"], desc:"Lichte witte vis in tomatensaus." },
    { name:"Prei met feta", time:"20 min", cal:250, ingredients:["Prei","Feta","Olijfolie","Citroen","Knoflook"], desc:"Warme preischotel met verkruimelde feta." },
  ],
  paleo: [
    { name:"Kip met zoete aardappel", time:"30 min", cal:420, ingredients:["Kipfilet","Zoete aardappel","Ui","Knoflook","Olijfolie"], desc:"Geroosterde kip met gekarameliseerde zoete aardappel." },
    { name:"Zalm met avocado", time:"15 min", cal:480, ingredients:["Zalm","Avocado","Citroen","Olijfolie"], desc:"Gebakken zalm met verse avocadosalade." },
    { name:"Paleo bowl", time:"20 min", cal:390, ingredients:["Kipfilet","Spinazie","Paprika","Amandelen","Olijfolie"], desc:"Voedzame paleo bowl met geroosterde kip." },
    { name:"Eieren met groenten", time:"10 min", cal:310, ingredients:["Ei","Paprika","Spinazie","Champignons","Olijfolie"], desc:"Gebakken eieren met verse seizoensgroenten." },
    { name:"Gegrilde zalm salade", time:"15 min", cal:350, ingredients:["Zalm","Komkommer","Tomaat","Walnoten","Citroen"], desc:"Frisse salade met gegrilde zalm en walnoten." },
    { name:"Paleo ontbijt", time:"10 min", cal:360, ingredients:["Ei","Spek","Avocado","Tomaat","Spinazie"], desc:"Vullend paleo ontbijt zonder granen." },
    { name:"Biefstuk met groenten", time:"20 min", cal:450, ingredients:["Biefstuk","Courgette","Paprika","Knoflook","Olijfolie"], desc:"Klassieke paleo maaltijd met biefstuk." },
    { name:"Makreel salade paleo", time:"10 min", cal:330, ingredients:["Makreel","Rucola","Komkommer","Citroen","Olijfolie"], desc:"Snelle paleo salade met vette vis." },
    { name:"Pompoen stoofpot", time:"35 min", cal:380, ingredients:["Kipfilet","Pompoen","Ui","Knoflook","Olijfolie"], desc:"Warme herfststoofpot zonder granen." },
    { name:"Garnalen met groenten", time:"15 min", cal:280, ingredients:["Garnalen","Paprika","Courgette","Knoflook","Olijfolie"], desc:"Snelle paleo wok zonder soja." },
    { name:"Kip rode kool paleo", time:"30 min", cal:360, ingredients:["Kipfilet","Rode kool","Appel","Ui","Olijfolie"], desc:"Hartige paleo stoofschotel." },
    { name:"Spruiten met noten", time:"20 min", cal:310, ingredients:["Spruiten","Amandelen","Spek","Olijfolie","Knoflook"], desc:"Krokante paleo winterschotel." },
    { name:"Witlof met ei", time:"15 min", cal:280, ingredients:["Witlof","Ei","Ham","Olijfolie","Citroen"], desc:"Snelle paleo lunch met witlof." },
    { name:"Sardines met pompoen", time:"25 min", cal:320, ingredients:["Sardines","Pompoen","Rucola","Citroen","Olijfolie"], desc:"Voedzame paleo combinatie." },
    { name:"Venkel kip schotel", time:"30 min", cal:370, ingredients:["Kipfilet","Venkel","Tomaat","Knoflook","Olijfolie"], desc:"Aromatische paleo schotel met venkel." },
  ],
  caloriearm: [
    { name:"Kip met groenten", time:"20 min", cal:280, ingredients:["Kipfilet","Broccoli","Paprika","Courgette","Olijfolie"], desc:"Lichte kipschotel met verse seizoensgroenten." },
    { name:"Tonijn salade", time:"10 min", cal:220, ingredients:["Tonijn","Komkommer","Tomaat","Citroen","Sla"], desc:"Frisse en lichte tonijnsalade." },
    { name:"Groentebouillon", time:"25 min", cal:150, ingredients:["Spinazie","Courgette","Tomaat","Ui","Knoflook"], desc:"Lichte groentesoep boordevol vitamines." },
    { name:"Eiwit ontbijt", time:"10 min", cal:260, ingredients:["Ei","Spinazie","Tomaat","Paprika"], desc:"Laag-calorie omelet met verse groenten." },
    { name:"Zalm met salade", time:"15 min", cal:310, ingredients:["Zalm","Sla","Komkommer","Citroen","Olijfolie"], desc:"Licht en voedzaam." },
    { name:"Rode kool soep", time:"30 min", cal:140, ingredients:["Rode kool","Ui","Knoflook","Olijfolie","Citroen"], desc:"Antioxidantrijke lichte soep." },
    { name:"Kabeljauw met groenten", time:"20 min", cal:240, ingredients:["Kabeljauw","Courgette","Tomaat","Citroen","Olijfolie"], desc:"Magere vis met lichte groenten." },
    { name:"Rucola salade", time:"10 min", cal:160, ingredients:["Rucola","Tomaat","Komkommer","Citroen","Olijfolie"], desc:"Nul-punten salade boordevol smaak." },
    { name:"Spruiten met kipfilet", time:"25 min", cal:290, ingredients:["Spruiten","Kipfilet","Knoflook","Olijfolie"], desc:"Laag-calorie wintermaaltijd." },
    { name:"Pompoen soep caloriearm", time:"25 min", cal:130, ingredients:["Pompoen","Ui","Knoflook","Olijfolie"], desc:"Romige soep zonder room." },
    { name:"Waterkers salade", time:"10 min", cal:120, ingredients:["Rucola","Radijs","Komkommer","Citroen","Olijfolie"], desc:"Superfrisse calorievrije salade." },
    { name:"Kip venkel schotel", time:"25 min", cal:270, ingredients:["Kipfilet","Venkel","Tomaat","Olijfolie","Citroen"], desc:"Lichte mediterrane schotel." },
    { name:"Witlof met tonijn", time:"15 min", cal:200, ingredients:["Witlof","Tonijn","Citroen","Olijfolie"], desc:"Lichte lunch met bittere witlof." },
    { name:"Mais komkommer salade", time:"10 min", cal:170, ingredients:["Mais","Komkommer","Tomaat","Citroen","Olijfolie"], desc:"Frisse zomerse salade." },
    { name:"Bleekselderij soep", time:"25 min", cal:110, ingredients:["Bleekselderij","Ui","Knoflook","Olijfolie"], desc:"Ultralight detox soep." },
  ],
  punten: [
    { name:"Nul-punten soep", time:"25 min", cal:120, ingredients:["Kipfilet","Spinazie","Tomaat","Ui","Broccoli"], desc:"Klassieke nul-punten soep vol groenten." },
    { name:"Nul-punten salade", time:"10 min", cal:100, ingredients:["Sla","Tomaat","Komkommer","Paprika","Citroen"], desc:"Onbeperkt te eten frisse salade." },
    { name:"Gevulde paprika", time:"30 min", cal:280, ingredients:["Paprika","Kipfilet","Rijst","Tomaat","Ui"], desc:"Gevulde paprika's met kip en rijst." },
    { name:"Kwark met fruit", time:"5 min", cal:180, ingredients:["Kwark","Aardbei","Blauwe bessen","Banaan"], desc:"Eiwitrijk dessert met weinig punten." },
    { name:"Kip stir-fry", time:"20 min", cal:240, ingredients:["Kipfilet","Paprika","Broccoli","Courgette","Olijfolie"], desc:"Kleurrijke roerbak, laag in punten." },
    { name:"Rode kool nul-punten", time:"20 min", cal:110, ingredients:["Rode kool","Ui","Appel","Citroen"], desc:"Nul-punten bijgerecht van rode kool." },
    { name:"Spruiten soep", time:"25 min", cal:130, ingredients:["Spruiten","Ui","Knoflook","Olijfolie"], desc:"Nul-punten spruitjessoep." },
    { name:"Kipfilet salade", time:"15 min", cal:220, ingredients:["Kipfilet","Rucola","Tomaat","Komkommer","Citroen"], desc:"Laag-punten maaltijdsalade." },
    { name:"Pompoen curry", time:"30 min", cal:260, ingredients:["Pompoen","Ui","Knoflook","Tomaat","Spinazie"], desc:"Plantaardige curry met pompoen." },
    { name:"Witlof nul-punten", time:"15 min", cal:100, ingredients:["Witlof","Tomaat","Citroen","Olijfolie"], desc:"Lichte witlofsalade als nul-punten snack." },
    { name:"Mais tomaat salade", time:"10 min", cal:150, ingredients:["Mais","Tomaat","Komkommer","Citroen","Olijfolie"], desc:"Zomerse nul-punten salade." },
    { name:"Groentesoep punten", time:"20 min", cal:120, ingredients:["Prei","Courgette","Ui","Knoflook","Tomaat"], desc:"Rijke groentesoep met nul punten." },
    { name:"Kabeljauw salade", time:"15 min", cal:200, ingredients:["Kabeljauw","Komkommer","Tomaat","Citroen","Olijfolie"], desc:"Lichte vismaaltijd met weinig punten." },
    { name:"Ei met groenten", time:"10 min", cal:190, ingredients:["Ei","Spinazie","Tomaat","Paprika","Olijfolie"], desc:"Eiwitrijke maaltijd laag in punten." },
    { name:"Bleekselderij soep punten", time:"20 min", cal:90, ingredients:["Bleekselderij","Ui","Knoflook","Olijfolie"], desc:"Bijna nul-punten detox soep." },
  ],
  fodmap: [
    { name:"FODMAP kipschotel", time:"25 min", cal:370, ingredients:["Kipfilet","Rijst","Courgette","Paprika","Olijfolie"], desc:"Veilige kipschotel zonder FODMAP-rijke ingrediënten." },
    { name:"FODMAP salade", time:"10 min", cal:230, ingredients:["Sla","Komkommer","Tomaat","Zalm","Citroen"], desc:"Frisse salade zonder ui of knoflook." },
    { name:"Rijst met spinazie", time:"20 min", cal:320, ingredients:["Rijst","Spinazie","Olijfolie","Citroen"], desc:"Simpel en veilig voor prikkelbare darm." },
    { name:"Eieren met courgette", time:"15 min", cal:290, ingredients:["Ei","Courgette","Paprika","Olijfolie"], desc:"FODMAP-vriendelijke omelet." },
    { name:"Aardbeien smoothie", time:"5 min", cal:160, ingredients:["Aardbei","Blauwe bessen","Amandelmelk","Banaan"], desc:"FODMAP-vriendelijke smoothie." },
    { name:"Kabeljauw met rijst", time:"25 min", cal:340, ingredients:["Kabeljauw","Rijst","Courgette","Citroen","Olijfolie"], desc:"Veilige vismaaltijd voor gevoelige darmen." },
    { name:"Mais salade FODMAP", time:"10 min", cal:210, ingredients:["Mais","Komkommer","Tomaat","Citroen","Olijfolie"], desc:"Laag-FODMAP zomersalade." },
    { name:"Kippensoep FODMAP", time:"30 min", cal:260, ingredients:["Kipfilet","Rijst","Courgette","Spinazie","Olijfolie"], desc:"Veilige kippensoep zonder ui of knoflook." },
    { name:"Pompoen rijst schotel", time:"30 min", cal:350, ingredients:["Pompoen","Rijst","Olijfolie","Citroen"], desc:"Laag-FODMAP herfstschotel." },
    { name:"Radijs komkommer salade", time:"10 min", cal:90, ingredients:["Radijs","Komkommer","Citroen","Olijfolie"], desc:"Ultralight FODMAP-vriendelijke salade." },
    { name:"Zalm met courgette FODMAP", time:"20 min", cal:380, ingredients:["Zalm","Courgette","Citroen","Olijfolie"], desc:"Eenvoudige FODMAP-veilige vismaaltijd." },
    { name:"Quinoa salade FODMAP", time:"15 min", cal:310, ingredients:["Quinoa","Komkommer","Tomaat","Citroen","Olijfolie"], desc:"Voedzame FODMAP-vriendelijke salade." },
    { name:"Spruiten FODMAP", time:"20 min", cal:180, ingredients:["Spruiten","Olijfolie","Citroen"], desc:"Kleine portie spruiten is FODMAP-veilig." },
    { name:"Mais met kipfilet", time:"20 min", cal:360, ingredients:["Mais","Kipfilet","Paprika","Olijfolie","Citroen"], desc:"Kleurrijke FODMAP-maaltijd." },
    { name:"Wortels met ei FODMAP", time:"15 min", cal:260, ingredients:["Wortel","Ei","Olijfolie","Citroen"], desc:"Simpele FODMAP-veilige lunch." },
  ],
  antiinfl: [
    { name:"Anti-inflam. bowl", time:"20 min", cal:420, ingredients:["Zalm","Quinoa","Spinazie","Blauwe bessen","Walnoten"], desc:"Superfood bowl vol ontstekingsremmers." },
    { name:"Kurkuma kip", time:"25 min", cal:360, ingredients:["Kipfilet","Spinazie","Olijfolie","Citroen","Knoflook"], desc:"Gekruide kip met anti-inflammatoire kruiden." },
    { name:"Walnoten salade", time:"10 min", cal:340, ingredients:["Spinazie","Walnoten","Blauwe bessen","Citroen","Olijfolie"], desc:"Salade vol omega-3 en antioxidanten." },
    { name:"Groene thee smoothie", time:"5 min", cal:180, ingredients:["Groene thee","Blauwe bessen","Spinazie","Banaan"], desc:"Antioxidantrijke smoothie." },
    { name:"Mediterrane zalm", time:"20 min", cal:440, ingredients:["Zalm","Tomaat","Olijfolie","Citroen","Knoflook"], desc:"Omega-3 rijke zalmschotel." },
    { name:"Granaatappel salade anti", time:"10 min", cal:250, ingredients:["Rucola","Granaatappel","Walnoten","Olijfolie","Citroen"], desc:"Krachtige antioxidantensalade." },
    { name:"Makreel met rode kool", time:"25 min", cal:380, ingredients:["Makreel","Rode kool","Citroen","Olijfolie","Walnoten"], desc:"Dubbele dosis antioxidanten en omega-3." },
    { name:"Spruiten walnoten schotel", time:"20 min", cal:310, ingredients:["Spruiten","Walnoten","Olijfolie","Citroen","Knoflook"], desc:"Rijk aan antioxidanten en gezonde vetten." },
    { name:"Kurkuma pompoen soep", time:"30 min", cal:220, ingredients:["Pompoen","Olijfolie","Knoflook","Ui","Amandelmelk"], desc:"Ontstekingsremmende gouden soep." },
    { name:"Sardines spinazie", time:"15 min", cal:300, ingredients:["Sardines","Spinazie","Citroen","Olijfolie","Knoflook"], desc:"Dubbele omega-3 bron met ijzerrijke spinazie." },
    { name:"Blauwe bessen kwark", time:"5 min", cal:200, ingredients:["Kwark","Blauwe bessen","Walnoten"], desc:"Ontbijt vol antioxidanten en eiwitten." },
    { name:"Venkel zalm schotel", time:"25 min", cal:390, ingredients:["Zalm","Venkel","Citroen","Olijfolie","Knoflook"], desc:"Venkel heeft eigen ontstekingsremmende werking." },
    { name:"Rode kool walnoten salade", time:"15 min", cal:270, ingredients:["Rode kool","Walnoten","Appel","Citroen","Olijfolie"], desc:"Anthocyanen en omega-3 in één salade." },
    { name:"Kip met kurkuma rijst", time:"30 min", cal:400, ingredients:["Kipfilet","Zilvervliesrijst","Knoflook","Olijfolie"], desc:"Anti-inflammatoire rijstschotel." },
    { name:"Ananas smoothie anti", time:"5 min", cal:190, ingredients:["Ananas","Spinazie","Amandelmelk","Citroen"], desc:"Bromelaïne uit ananas werkt entstekingsremmend." },
  ],
  dash: [
    { name:"DASH kipschotel", time:"25 min", cal:390, ingredients:["Kipfilet","Volkoren brood","Spinazie","Tomaat","Olijfolie"], desc:"Hartvriendelijk DASH recept." },
    { name:"DASH salade", time:"10 min", cal:260, ingredients:["Spinazie","Zalm","Blauwe bessen","Walnoten","Citroen"], desc:"Kaliumrijke salade voor DASH." },
    { name:"Havermout ontbijt DASH", time:"10 min", cal:320, ingredients:["Havermout","Banaan","Blauwe bessen","Amandelmelk"], desc:"Vezels en kalium voor gezonde bloeddruk." },
    { name:"Linzen soep DASH", time:"35 min", cal:340, ingredients:["Linzen","Tomaat","Spinazie","Ui","Olijfolie"], desc:"Kaliumrijke soep met weinig zout." },
    { name:"Kip met groenten DASH", time:"25 min", cal:370, ingredients:["Kipfilet","Broccoli","Zoete aardappel","Olijfolie"], desc:"Volledig DASH-maaltijd." },
    { name:"Volkoren pasta groenten", time:"25 min", cal:420, ingredients:["Volkoren brood","Courgette","Tomaat","Knoflook","Olijfolie"], desc:"Volkoren pasta met verse saus." },
    { name:"Kabeljauw met broccoli DASH", time:"20 min", cal:290, ingredients:["Kabeljauw","Broccoli","Citroen","Olijfolie"], desc:"Hartvriendelijke vismaaltijd." },
    { name:"Pompoen soep DASH", time:"25 min", cal:200, ingredients:["Pompoen","Ui","Knoflook","Olijfolie","Amandelmelk"], desc:"Kaliumrijke soep zonder te veel zout." },
    { name:"Spruiten met quinoa DASH", time:"25 min", cal:350, ingredients:["Spruiten","Quinoa","Olijfolie","Citroen","Knoflook"], desc:"Vezelrijke DASH combinatie." },
    { name:"Granaatappel kwark", time:"5 min", cal:220, ingredients:["Kwark","Granaatappel","Blauwe bessen","Walnoten"], desc:"Kaliumrijke ontbijt of dessert." },
    { name:"Prei soep DASH", time:"25 min", cal:180, ingredients:["Prei","Aardappel","Ui","Olijfolie"], desc:"Laagzout DASH soep." },
    { name:"Zalm quinoa bowl DASH", time:"25 min", cal:450, ingredients:["Zalm","Quinoa","Spinazie","Citroen","Olijfolie"], desc:"Complete DASH maaltijd vol voedingsstoffen." },
    { name:"Mais spinazie omelet DASH", time:"15 min", cal:310, ingredients:["Ei","Mais","Spinazie","Olijfolie"], desc:"Kaliumrijke omelet voor DASH." },
    { name:"Rode kool schotel DASH", time:"30 min", cal:260, ingredients:["Rode kool","Appel","Ui","Olijfolie","Citroen"], desc:"Antioxidantrijke bijgerecht voor DASH." },
    { name:"Walnoten haver ontbijt", time:"10 min", cal:380, ingredients:["Havermout","Walnoten","Banaan","Amandelmelk"], desc:"Omega-3 en vezels voor gezonde bloeddruk." },
  ],
  glutenvrij: [
    { name:"Rijst met kip", time:"25 min", cal:420, ingredients:["Rijst","Kipfilet","Paprika","Ui","Olijfolie"], desc:"Simpele glutenvrije rijstschotel." },
    { name:"Quinoa salade", time:"15 min", cal:370, ingredients:["Quinoa","Komkommer","Tomaat","Citroen","Olijfolie"], desc:"Lichte glutenvrije quinoasalade." },
    { name:"Omelet met groenten", time:"10 min", cal:280, ingredients:["Ei","Paprika","Champignons","Spinazie"], desc:"Glutenvrije omelet vol groenten." },
    { name:"Zalm met rijst", time:"20 min", cal:460, ingredients:["Zalm","Rijst","Spinazie","Citroen"], desc:"Simpele zalmmaaltijd met rijst." },
    { name:"Aardappelsoep", time:"30 min", cal:290, ingredients:["Aardappel","Ui","Knoflook","Olijfolie"], desc:"Romige aardappelsoep, glutenvrij." },
    { name:"Pompoen quinoa schotel", time:"30 min", cal:380, ingredients:["Pompoen","Quinoa","Spinazie","Olijfolie","Knoflook"], desc:"Voedzame glutenvrije herfstmaaltijd." },
    { name:"Kip mais salade", time:"20 min", cal:350, ingredients:["Kipfilet","Mais","Komkommer","Tomaat","Citroen"], desc:"Kleurrijke glutenvrije maaltijdsalade." },
    { name:"Rode kool met kipfilet", time:"25 min", cal:340, ingredients:["Rode kool","Kipfilet","Appel","Olijfolie","Citroen"], desc:"Glutenvrije stoofschotel." },
    { name:"Zilvervliesrijst bowl", time:"20 min", cal:400, ingredients:["Zilvervliesrijst","Kipfilet","Broccoli","Olijfolie","Knoflook"], desc:"Voedzame glutenvrije bowl." },
    { name:"Spruiten met ei glutenvrij", time:"20 min", cal:290, ingredients:["Spruiten","Ei","Olijfolie","Knoflook"], desc:"Simpele glutenvrije wintermaaltijd." },
    { name:"Mais omelet", time:"15 min", cal:310, ingredients:["Ei","Mais","Paprika","Olijfolie"], desc:"Kleurrijke glutenvrije omelet." },
    { name:"Kabeljauw met quinoa", time:"25 min", cal:370, ingredients:["Kabeljauw","Quinoa","Spinazie","Citroen","Olijfolie"], desc:"Glutenvrije vismaaltijd." },
    { name:"Pompoen soep glutenvrij", time:"25 min", cal:210, ingredients:["Pompoen","Ui","Knoflook","Olijfolie"], desc:"Romige glutenvrije herfstsoep." },
    { name:"Quinoa met garnalen", time:"20 min", cal:390, ingredients:["Quinoa","Garnalen","Courgette","Citroen","Olijfolie"], desc:"Glutenvrije zeevruchtenmaaltijd." },
    { name:"Mais avocado salade gv", time:"10 min", cal:300, ingredients:["Mais","Avocado","Tomaat","Citroen","Olijfolie"], desc:"Frisse glutenvrije zomersalade." },
  ],
  lactosevrij: [
    { name:"Kip stir-fry", time:"20 min", cal:360, ingredients:["Kipfilet","Paprika","Broccoli","Ui","Olijfolie"], desc:"Snelle roerbak zonder lactose." },
    { name:"Avocado salade", time:"10 min", cal:260, ingredients:["Avocado","Tomaat","Komkommer","Citroen","Olijfolie"], desc:"Frisse salade zonder zuivel." },
    { name:"Tonijn met rijst", time:"15 min", cal:410, ingredients:["Tonijn","Rijst","Komkommer","Citroen"], desc:"Makkelijke tonijnmaaltijd." },
    { name:"Groentewok", time:"20 min", cal:230, ingredients:["Broccoli","Paprika","Champignons","Ui","Olijfolie"], desc:"Lichte wok zonder lactose." },
    { name:"Zalm met groenten", time:"25 min", cal:400, ingredients:["Zalm","Courgette","Tomaat","Citroen","Olijfolie"], desc:"Gebakken zalm met mediterrane groenten." },
    { name:"Rode kool soep lv", time:"25 min", cal:150, ingredients:["Rode kool","Ui","Knoflook","Olijfolie","Citroen"], desc:"Lactosevrije antioxidantensoep." },
    { name:"Kipfilet mais salade", time:"20 min", cal:370, ingredients:["Kipfilet","Mais","Tomaat","Komkommer","Olijfolie"], desc:"Lactosevrije zomersalade." },
    { name:"Spruiten met kipfilet lv", time:"25 min", cal:310, ingredients:["Spruiten","Kipfilet","Olijfolie","Knoflook","Citroen"], desc:"Lactosevrije wintermaaltijd." },
    { name:"Garnalen met quinoa", time:"20 min", cal:380, ingredients:["Garnalen","Quinoa","Spinazie","Citroen","Olijfolie"], desc:"Lactosevrije zeevruchtenmaaltijd." },
    { name:"Makreel salade lv", time:"10 min", cal:340, ingredients:["Makreel","Rucola","Tomaat","Citroen","Olijfolie"], desc:"Lactosevrije salade met vette vis." },
    { name:"Pompoen soep lv", time:"25 min", cal:190, ingredients:["Pompoen","Ui","Knoflook","Olijfolie"], desc:"Romige pompoensoep zonder room." },
    { name:"Prei soep lactosevrij", time:"25 min", cal:170, ingredients:["Prei","Aardappel","Olijfolie","Ui"], desc:"Klassieke preisoep zonder boter of room." },
    { name:"Kabeljauw tomaat lv", time:"20 min", cal:260, ingredients:["Kabeljauw","Tomaat","Knoflook","Olijfolie","Citroen"], desc:"Lichte lactosevrije vismaaltijd." },
    { name:"Witlof met tonijn lv", time:"15 min", cal:220, ingredients:["Witlof","Tonijn","Citroen","Olijfolie"], desc:"Snelle lactosevrije lunch." },
    { name:"Mais spinazie wok lv", time:"20 min", cal:280, ingredients:["Mais","Spinazie","Ei","Olijfolie","Knoflook"], desc:"Kleurrijke lactosevrije wok." },
  ],
  suikervrij: [
    { name:"Kipfilet met sla", time:"15 min", cal:300, ingredients:["Kipfilet","Sla","Komkommer","Olijfolie","Citroen"], desc:"Lichte suikervrije maaltijdsalade." },
    { name:"Eieren met avocado", time:"10 min", cal:340, ingredients:["Ei","Avocado","Tomaat","Citroen"], desc:"Vullend suikervrij ontbijt." },
    { name:"Noten mix", time:"2 min", cal:480, ingredients:["Amandelen","Walnoten","Blauwe bessen"], desc:"Snelle suikervrije snack." },
    { name:"Zalm salade", time:"15 min", cal:370, ingredients:["Zalm","Spinazie","Komkommer","Olijfolie","Citroen"], desc:"Frisse salade zonder suikers." },
    { name:"Groentebouillon", time:"30 min", cal:80, ingredients:["Ui","Knoflook","Spinazie","Olijfolie"], desc:"Warme suikervrije bouillon." },
    { name:"Rode kool suikervrij", time:"20 min", cal:140, ingredients:["Rode kool","Ui","Olijfolie","Citroen","Knoflook"], desc:"Suikervrije bijgerecht van rode kool." },
    { name:"Kip met spruiten sv", time:"25 min", cal:310, ingredients:["Kipfilet","Spruiten","Olijfolie","Knoflook","Citroen"], desc:"Suikervrije wintermaaltijd." },
    { name:"Makreel rucola salade", time:"10 min", cal:320, ingredients:["Makreel","Rucola","Citroen","Olijfolie"], desc:"Suikervrije salade met vette vis." },
    { name:"Venkel kipschotel sv", time:"30 min", cal:330, ingredients:["Kipfilet","Venkel","Olijfolie","Citroen","Knoflook"], desc:"Aromatische suikervrije schotel." },
    { name:"Witlof ei suikervrij", time:"15 min", cal:260, ingredients:["Witlof","Ei","Olijfolie","Citroen"], desc:"Snelle suikervrije lunch." },
    { name:"Pompoen kipsoep sv", time:"30 min", cal:270, ingredients:["Pompoen","Kipfilet","Ui","Olijfolie","Knoflook"], desc:"Suikervrije herfstsoep." },
    { name:"Mais avocado sv", time:"10 min", cal:310, ingredients:["Mais","Avocado","Citroen","Olijfolie"], desc:"Suikervrije snack of lichte lunch." },
    { name:"Kabeljauw met groenten sv", time:"20 min", cal:250, ingredients:["Kabeljauw","Courgette","Tomaat","Olijfolie","Citroen"], desc:"Magere suikervrije vismaaltijd." },
    { name:"Blauwe bessen kwark sv", time:"5 min", cal:190, ingredients:["Kwark","Blauwe bessen","Walnoten"], desc:"Suikervrij ontbijt of dessert." },
    { name:"Sardines rode kool sv", time:"15 min", cal:280, ingredients:["Sardines","Rode kool","Citroen","Olijfolie"], desc:"Suikervrije salade vol omega-3." },
  ],
};

const WEEKDAYS = ["Ma","Di","Wo","Do","Vr","Za","Zo"];
const MEALS = ["Ontbijt","Lunch","Diner"];
const ALL_PRODUCTS = [...new Set(Object.values(CATEGORIES).flat())];
const keyMap  = { keto:"k", vegan:"v", glutenvrij:"g", lactosevrij:"l", suikervrij:"s", mediterraan:"m", paleo:"p", caloriearm:"ca", punten:"pu", fodmap:"fo", antiinfl:"ai", dash:"da" };
const aKeyMap = { noten:"an", gluten:"ag", melk:"am", ei:"ae", vis:"af", soja:"aso", schaaldier:"asc", sesam:"ase" };
const BARCODE_PRODUCTS = ["Kipfilet","Zalm","Avocado","Broccoli","Yoghurt","Amandelen","Quinoa","Olijfolie","Hummus","Aardbei"];

const DAILY_TIPS = [
  { emoji:"🥦", tip:"Eet elke dag minstens 250g groenten — varieer met kleur voor de meeste voedingsstoffen." },
  { emoji:"💧", tip:"Begin je dag met een groot glas water. Hydratatie verbetert je energie en spijsvertering." },
  { emoji:"🚶", tip:"30 minuten wandelen per dag verlaagt je stressniveau én ondersteunt je gewicht." },
  { emoji:"😴", tip:"Slaap 7-9 uur per nacht. Slaaptekort verstoort hongerhormonen en verhoogt suikerbehoefte." },
  { emoji:"🧘", tip:"Stress verhoogt cortisol, wat vetopslag rond je buik stimuleert. Neem dagelijks even rust." },
  { emoji:"🥗", tip:"Eet de regenboog! Elke kleur groente bevat andere antioxidanten die je lichaam beschermen." },
  { emoji:"🍽️", tip:"Eet langzamer. Het duurt 20 minuten voor je hersenen het 'vol'-signaal ontvangen." },
  { emoji:"🌿", tip:"Kruidenrijke voeding zoals kurkuma en gember heeft ontstekingsremmende eigenschappen." },
];

const FAQ = [
  { q:"Wat is het verschil tussen keto en paleo?", a:"Keto focust op minimale koolhydraten (max. 20-50g/dag) om in ketose te komen. Paleo eet zoals de oermens: geen granen, zuivel of bewerkt voedsel, maar wel fruit en knollen. Keto is strenger in koolhydraten, paleo is strenger in het vermijden van moderne voedingsmiddelen." },
  { q:"Kan ik meerdere diëten combineren?", a:"Ja, maar hoe meer diëten je combineert, hoe beperkter je keuzes worden. Keto + glutenvrij werkt goed. Vegan + keto is uitdagend maar mogelijk. Raadpleeg bij twijfel een diëtist." },
  { q:"Wat betekent orthomoleculaire therapie?", a:"Orthomoleculaire therapie richt zich op het optimaliseren van de hoeveelheid voedingsstoffen in het lichaam. Denk aan vitamines, mineralen en vetzuren op cellulair niveau — voor herstel en preventie van klachten." },
  { q:"Is intermittent fasting veilig voor iedereen?", a:"Niet voor iedereen. Zwangeren, kinderen, mensen met diabetes of een eetgeschiedenis moeten IF vermijden of alleen onder begeleiding toepassen. Raadpleeg altijd je arts." },
  { q:"Hoe betrouwbaar is de voedingsinformatie in de app?", a:"De informatie is gebaseerd op erkende voedingsrichtlijnen en de kennis van Amanda als leefstijlcoach. De app is informatief en vervangt geen medisch of diëtistisch advies." },
  { q:"Waarom staat mijn product er niet in?", a:"De database groeit continu. Gebruik de scanner om via Open Food Facts te zoeken, of stuur Amanda een bericht als Pro-lid." },
];

const ROADMAP = [
  { done:true,  label:"Productendatabase (130+ producten)" },
  { done:true,  label:"6 diëten + Paleo" },
  { done:true,  label:"Allergieëncheck (8 allergenen)" },
  { done:true,  label:"Zwangerschapsmodus" },
  { done:true,  label:"Weekmenu planner + IF schema" },
  { done:true,  label:"Recepten per dieet" },
  { done:false, label:"Open Food Facts barcode koppeling" },
  { done:false, label:"Persoonlijk dagrapport" },
  { done:false, label:"Push notificaties & dagelijkse tips" },
  { done:false, label:"Maaltijdtracking & calorieënteller" },
  { done:false, label:"Community forum voor Pro-leden" },
  { done:false, label:"iOS & Android native app" },
];

const REVIEWS = [
  { name:"Lisa M.", stars:5, text:"Eindelijk een app die ook zwangerschapsinfo combineert met diëten. Super handig!", dieet:"Zwanger + Glutenvrij" },
  { name:"Joost V.", stars:5, text:"De paleo-check werkt perfect. Kan nu snel zien wat ik wel en niet mag eten.", dieet:"Paleo" },
  { name:"Sarah K.", stars:4, text:"Geweldige app! Zou graag meer supermarktproducten zien maar verder top.", dieet:"Vegan + Lactosevrij" },
  { name:"Mark B.", stars:5, text:"Amanda's persoonlijk advies was precies wat ik nodig had. Aanrader!", dieet:"Keto" },
];

const PRICING = [
  { id:"gratis", label:"Gratis", price:"€0", period:"voor altijd", color:"#2d9e6b",
    features:["✅ Productcheck (96+ producten)","✅ 13 diëten incl. FODMAP & DASH","✅ 8 allergenen check","✅ Zwangerschapsmodus","✅ VEVO maaltijdcheck","✅ Pesticideninfo per product","✅ Dagelijkse tips","❌ Recepten & weekmenu","❌ Doelen stellen","❌ Leefstijl module","❌ Supplementenadvies","❌ Persoonlijk advies"] },
  { id:"starter", label:"Starter", price:"€4,99", period:"per maand", color:"#f97316",
    features:["✅ Alles van Gratis","✅ Weekmenu planner + IF schema","✅ Recepten per dieet (60+)","✅ Doelen stellen & bijhouden","✅ Favorieten opslaan","✅ Voortgang bijhouden","❌ Leefstijl module (slaap/stress/beweging)","❌ Supplementenadvies","❌ Persoonlijk advies Amanda"] },
  { id:"pro", label:"Pro", price:"€7,99", period:"per maand", color:"#ec4899",
    features:["✅ Alles van Starter","✅ Leefstijl module — slaap, stress & beweging","✅ Supplementenadvies op maat","✅ Persoonlijk leefstijladvies van Amanda","✅ Reactie binnen 3 werkdagen","✅ Doelen delen met coach","✅ Maaltijd URL & eigen maaltijden","✅ Prioriteit in wachtrij"] },
];

const SUPPLEMENTS = [
  {
    id:"vitd", name:"Vitamine D3", emoji:"☀️", color:"#fbbf24",
    beschrijving:"Ondersteunt botten, immuunsysteem en stemming. Veel Nederlanders hebben een tekort, vooral in de winter.",
    geschiktVoor:{ dieten:["keto","paleo","caloriearm","dash","antiinfl"], doelen:["slaap","ontspanning","beweging"], zwanger:true },
    dosering:"1000-2000 IE per dag, bij voorkeur met vet innemen.",
    tip:"Combineer met vitamine K2 voor optimale opname.",
    interacties:"Overleg bij gebruik van bloedverdunners."
  },
  {
    id:"magnesium", name:"Magnesium", emoji:"💪", color:"#60a5fa",
    beschrijving:"Essentieel voor spierontspanning, slaap, energieproductie en stressregulatie. Bij veel mensen onvoldoende aanwezig.",
    geschiktVoor:{ dieten:["keto","paleo","caloriearm","dash","antiinfl","mediterraan"], doelen:["slaap","ontspanning","beweging","scherm"], zwanger:true },
    dosering:"300-400 mg per dag, 's avonds innemen voor slaap en ontspanning.",
    tip:"Magnesium bisglycinaat wordt het beste opgenomen en is zacht voor de maag.",
    interacties:"Vermijd bij nierproblemen zonder overleg met arts."
  },
  {
    id:"omega3", name:"Omega-3 (EPA/DHA)", emoji:"🐟", color:"#34d399",
    beschrijving:"Ontstekingsremmend, goed voor hart, hersenen en gewrichten. Essentieel bij weinig vette vis in het dieet.",
    geschiktVoor:{ dieten:["vegan","vegetarisch","caloriearm","antiinfl","dash","fodmap","mediterraan"], doelen:["beweging","ontspanning","slaap"], zwanger:true },
    dosering:"1000-2000 mg EPA/DHA per dag bij de maaltijd.",
    tip:"Kies voor algenolie als je vegan bent — dezelfde DHA zonder vis.",
    interacties:"Hogere doseringen kunnen bloedverdunning versterken."
  },
  {
    id:"foliumzuur", name:"Foliumzuur (B9)", emoji:"🤰", color:"#ec4899",
    beschrijving:"Onmisbaar voor celdeeling en de aanmaak van DNA. Extra belangrijk voor zwangere vrouwen en vrouwen die zwanger willen worden.",
    geschiktVoor:{ dieten:[], doelen:[], zwanger:true },
    dosering:"400-800 mcg per dag, bij voorkeur al voor de zwangerschap starten.",
    tip:"Kies voor de actieve vorm (5-MTHF) bij MTHFR-genmutatie.",
    interacties:"Vrijwel geen — dit supplement is zeer veilig."
  },
  {
    id:"vitc", name:"Vitamine C", emoji:"🍊", color:"#f97316",
    beschrijving:"Krachtig antioxidant, ondersteunt immuunsysteem, collageenaanmaak en ijzeropname. Bijdrage aan vermindering van vermoeidheid.",
    geschiktVoor:{ dieten:["caloriearm","antiinfl","dash","fodmap","keto","paleo"], doelen:["beweging","ontspanning"], zwanger:true },
    dosering:"500-1000 mg per dag, verdeeld over de dag innemen.",
    tip:"Neem vitamine C samen met ijzerrijke voeding voor betere ijzeropname.",
    interacties:"Hoge doseringen kunnen maagklachten geven."
  },
  {
    id:"probiotica", name:"Probiotica", emoji:"🦠", color:"#a78bfa",
    beschrijving:"Ondersteunt de darmflora, versterkt het immuunsysteem en kan helpen bij prikkelbare darm, spijsverteringsklachten en stressregulatie.",
    geschiktVoor:{ dieten:["fodmap","vegan","caloriearm","antiinfl"], doelen:["voeding","ontspanning"], zwanger:true },
    dosering:"Minimaal 10 miljard CFU per dag, op nuchtere maag of bij de maaltijd.",
    tip:"Kies voor een breed spectrum met meerdere Lactobacillus- en Bifidobacterium-stammen.",
    interacties:"Veilig tijdens zwangerschap. Overleg bij immuunsuppressie."
  },
  {
    id:"ijzer", name:"IJzer", emoji:"🩸", color:"#f43f5e",
    beschrijving:"Essentieel voor bloedaanmaak en zuurstoftransport. Tekort is veel voorkomend bij vrouwen, vegetariërs en zwangere vrouwen.",
    geschiktVoor:{ dieten:["vegan","vegetarisch","caloriearm"], doelen:["beweging","voeding"], zwanger:true },
    dosering:"Alleen bij aangetoond tekort: 15-30 mg per dag, op nuchtere maag met vitamine C.",
    tip:"Neem geen ijzer tegelijk met calcium of koffie — dit remt de opname.",
    interacties:"Overleg altijd met arts voor gebruik — te veel ijzer is schadelijk."
  },
  {
    id:"zink", name:"Zink", emoji:"🛡️", color:"#38bdf8",
    beschrijving:"Ondersteunt het immuunsysteem, wondgenezing, hormoonbalans en vruchtbaarheid. Vegan eten verhoogt de behoefte.",
    geschiktVoor:{ dieten:["vegan","vegetarisch","keto","paleo","caloriearm"], doelen:["beweging","ontspanning"], zwanger:true },
    dosering:"8-15 mg per dag bij de maaltijd.",
    tip:"Zink bisglycinaat of zinkcitaat worden beter opgenomen dan zinkoxide.",
    interacties:"Hoge doses kunnen koperopname verlagen. Niet langer dan 6 maanden zonder pauze."
  },
  {
    id:"vitb12", name:"Vitamine B12", emoji:"⚡", color:"#22c55e",
    beschrijving:"Essentieel voor het zenuwstelsel, energiemetabolisme en bloedaanmaak. Vrijwel alleen aanwezig in dierlijke producten.",
    geschiktVoor:{ dieten:["vegan","vegetarisch"], doelen:["beweging","ontspanning","slaap"], zwanger:true },
    dosering:"500-1000 mcg per dag (methylcobalamine vorm).",
    tip:"Veganisten en vegetariërs hebben dit supplement altijd nodig — geen plantaardige bronnen zijn voldoende.",
    interacties:"Vrijwel geen interacties — zeer veilig supplement."
  },
  {
    id:"ashwagandha", name:"Ashwagandha", emoji:"🌿", color:"#84cc16",
    beschrijving:"Adaptogeen kruid dat cortisol verlaagt, stress vermindert en slaapkwaliteit verbetert. Populair bij burn-out en chronische stress.",
    geschiktVoor:{ dieten:["keto","paleo","mediterraan","antiinfl"], doelen:["slaap","ontspanning","scherm"], zwanger:false },
    dosering:"300-600 mg KSM-66 extract per dag, 's avonds innemen.",
    tip:"Neemt 4-8 weken voor merkbaar effect. Neem een pauze na 3 maanden gebruik.",
    interacties:"Niet gebruiken tijdens zwangerschap of bij schildklierproblemen zonder overleg."
  },
  {
    id:"curcumine", name:"Curcumine (Kurkuma)", emoji:"🟡", color:"#f59e0b",
    beschrijving:"Krachtig ontstekingsremmend en antioxidatief. Ondersteunt gewrichten, spijsvertering en hersenfunctie.",
    geschiktVoor:{ dieten:["antiinfl","mediterraan","paleo","keto","vegan"], doelen:["beweging","ontspanning"], zwanger:false },
    dosering:"500-1000 mg curcumine-extract per dag, bij voorkeur met zwarte peper (piperine) voor betere opname.",
    tip:"Standaard kurkumapoeder heeft slechte opname — kies voor een liposomale of piperine-formule.",
    interacties:"Kan bloedverdunning versterken. Overleg bij galsteenproblemen."
  },
  {
    id:"vitb_complex", name:"Vitamine B-complex", emoji:"🔋", color:"#c084fc",
    beschrijving:"Alle B-vitamines samengebundeld voor energie, zenuwstelsel, hormoonbalans en stressverwerking.",
    geschiktVoor:{ dieten:["vegan","caloriearm","keto","paleo"], doelen:["ontspanning","slaap","scherm","beweging"], zwanger:true },
    dosering:"Dagelijkse aanbevolen hoeveelheid per vitamine — kijk op de verpakking.",
    tip:"Kies voor actieve vormen (methylfolaat, methylcobalamine) voor betere biologische beschikbaarheid.",
    interacties:"Kleur van urine kan geel worden door riboflavine (B2) — dit is normaal."
  },
];

const GOAL_TYPES = [
  { id:"slaap",      label:"Slaap",         emoji:"😴", color:"#6366f1", unit:"uur/nacht",   placeholder:"Bijv. 8 uur per nacht slapen" },
  { id:"ontspanning",label:"Ontspanning",   emoji:"🧘", color:"#a855f7", unit:"min/dag",     placeholder:"Bijv. 20 min meditatie per dag" },
  { id:"beweging",   label:"Beweging",      emoji:"🏃", color:"#f97316", unit:"min/dag",     placeholder:"Bijv. 30 min wandelen per dag" },
  { id:"voeding",    label:"Voeding/Dieet", emoji:"🥗", color:"#2d9e6b", unit:"dagen",       placeholder:"Bijv. keto dieet volhouden" },
  { id:"water",      label:"Water",         emoji:"💧", color:"#38bdf8", unit:"glazen/dag",  placeholder:"Bijv. 8 glazen water per dag" },
  { id:"scherm",     label:"Schermtijd",    emoji:"📵", color:"#ec4899", unit:"uur/dag max", placeholder:"Bijv. max 2 uur scherm voor slapen" },
];

// Blocked business/shared domains
const BUSINESS_DOMAINS = [
  "gmail.com","hotmail.com","outlook.com","live.com","icloud.com",
  "yahoo.com","protonmail.com","kpnmail.nl","ziggo.nl","xs4all.nl",
  "planet.nl","home.nl","hetnet.nl","tele2.nl","casema.nl","upcmail.nl",
  "chello.nl","online.nl","quicknet.nl","zeelandnet.nl","solcon.nl",
];

const isPersonalEmail = (email) => {
  if (!email || !email.includes("@")) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  // Block known personal/free email providers — require work/personal custom domain
  if (BUSINESS_DOMAINS.includes(domain)) return false;
  // Must have valid TLD
  if (!domain.includes(".")) return false;
  return true;
};

const getEmailError = (email) => {
  if (!email) return "";
  if (!email.includes("@")) return "Voer een geldig e-mailadres in.";
  const domain = email.split("@")[1]?.toLowerCase();
  if (BUSINESS_DOMAINS.includes(domain)) {
    return `❌ ${domain} is niet toegestaan. Gebruik een zakelijk of persoonlijk werkdomein (bijv. naam@uwpraktijk.nl).`;
  }
  return "";
};

const LEEFSTIJL = {
  slaap: {
    emoji: "😴",
    color: "#6366f1",
    titel: "Slaap",
    intro: "Slaap is de meest onderschatte pijler van een gezonde leefstijl. Tijdens je slaap herstelt je lichaam, verwerkt je brein emoties en worden hormonen gereguleerd. Chronisch slaaptekort verhoogt het risico op overgewicht, hart- en vaatziekten en burn-out.",
    tips: [
      { titel:"Vaste slaaptijden", tekst:"Ga elke dag op dezelfde tijd naar bed en sta op dezelfde tijd op — ook in het weekend. Je biologische klok wordt hier stabieler van." },
      { titel:"Vermijd blauw licht", tekst:"Stop 1 uur voor bedtijd met je telefoon en laptop. Blauw licht remt de aanmaak van melatonine, het slaaphormoon." },
      { titel:"Koele en donkere kamer", tekst:"De ideale slaaptemperatuur is 16-18 graden. Verduisterende gordijnen helpen enorm." },
      { titel:"Cafeïne na 14:00", tekst:"Koffie en thee met cafeïne blijven tot 8 uur actief in je lichaam. Stop na 14:00 met cafeïne voor een betere nachtrust." },
      { titel:"Magnesium voor het slapen", tekst:"Magnesium bisglycinaat voor het slapengaan ontspant spieren en zenuwstelsel en kan de slaapkwaliteit significant verbeteren." },
    ],
    oefeningen: [
      { titel:"4-7-8 ademhaling", duur:"5 min", beschrijving:"Adem 4 tellen in door je neus, houd 7 tellen vast, adem 8 tellen uit door je mond. Herhaal 4 keer. Activeert het parasympathische zenuwstelsel en kalmeert je lichaam voor het slapen." },
      { titel:"Body scan", duur:"10 min", beschrijving:"Ga op je rug liggen. Richt je aandacht langzaam van je tenen naar je hoofd. Span elk lichaamsdeel 5 tellen aan en laat het dan bewust los. Ontspant spieren en vermindert rumineren." },
      { titel:"Dankbaarheidsdagboek", duur:"5 min", beschrijving:"Schrijf voor het slapen 3 dingen op waar je dankbaar voor bent. Onderzoek toont aan dat dit piekeren vermindert en de slaapkwaliteit verbetert." },
    ],
    schema: [
      { tijd:"21:00", actie:"Schermen uit of nachtmodus aan" },
      { tijd:"21:30", actie:"Warm bad of douche (verlaagt lichaamstemperatuur)" },
      { tijd:"22:00", actie:"4-7-8 ademhaling of body scan" },
      { tijd:"22:15", actie:"Dankbaarheidsdagboek schrijven" },
      { tijd:"22:30", actie:"Lichten uit, kamer koel" },
    ]
  },
  stress: {
    emoji: "🧘",
    color: "#a855f7",
    titel: "Stress",
    intro: "Chronische stress is een van de grootste gezondheidsbedreigingen van onze tijd. Het verhoogt cortisol, verstoort je slaap, spijsvertering en hormoonbalans, en bevordert ontsteking in het lichaam. Het goede nieuws: kleine dagelijkse gewoontes maken een enorm verschil.",
    tips: [
      { titel:"Herken je stresssignalen", tekst:"Gespannen kaak, onrustige gedachten, snel geïrriteerd zijn — dit zijn vroege signalen. Hoe eerder je ze herkent, hoe beter je kunt ingrijpen." },
      { titel:"Beweeg dagelijks", tekst:"30 minuten bewegen per dag verlaagt cortisol aantoonbaar. Het hoeft geen intensieve sport te zijn — wandelen werkt uitstekend." },
      { titel:"Zeg vaker nee", tekst:"Overvolle agenda's zijn een van de grootste stressbronnen. Leer onderscheid te maken tussen wat echt belangrijk is en wat wacht." },
      { titel:"Voeding en stress", tekst:"Suiker en cafeïne versterken stressreacties. Magnesium, omega-3 en B-vitamines ondersteunen het zenuwstelsel en helpen bij stressregulatie." },
      { titel:"Sociale verbinding", tekst:"Tijd doorbrengen met mensen die je energie geven verlaagt cortisol. Isolatie verhoogt juist stresshormonen." },
    ],
    oefeningen: [
      { titel:"Box breathing", duur:"5 min", beschrijving:"Adem 4 tellen in, houd 4 tellen vast, adem 4 tellen uit, houd 4 tellen leeg. Herhaal 5 minuten. Wordt gebruikt door mariniers en topsporters om snel te kalmeren." },
      { titel:"5-4-3-2-1 grounding", duur:"3 min", beschrijving:"Benoem 5 dingen die je ziet, 4 die je hoort, 3 die je kunt aanraken, 2 die je ruikt, 1 die je proeft. Haalt je uit je hoofd en brengt je terug in het moment." },
      { titel:"Progressieve spierontspanning", duur:"15 min", beschrijving:"Span systematisch elke spiergroep 5 tellen aan van voeten naar hoofd, dan bewust loslaten. Verlaagt spierspanning en activeert het ontspanningsrespons." },
      { titel:"Dagelijkse wandeling", duur:"30 min", beschrijving:"Buiten wandelen in de natuur verlaagt cortisol, verbetert stemming en helpt bij het verwerken van gedachten. Probeer zonder telefoon te wandelen." },
    ],
    schema: [
      { tijd:"Ochtend", actie:"5 min box breathing na het wakker worden" },
      { tijd:"Middag", actie:"30 min wandeling buiten (geen telefoon)" },
      { tijd:"Middag", actie:"Gezonde lunch zonder scherm" },
      { tijd:"Avond", actie:"Schrijf 3 dingen op die je energie kostten en 3 die energie gaven" },
      { tijd:"Avond", actie:"15 min progressieve spierontspanning" },
    ]
  },
  beweging: {
    emoji: "🏃",
    color: "#f97316",
    titel: "Beweging",
    intro: "Bewegen is medicijn. Regelmatige beweging verlaagt het risico op meer dan 35 chronische ziekten, verbetert stemming, slaap en energie, en is even effectief als antidepressiva bij milde tot matige depressie. Het hoeft niet intensief — consistent is wat telt.",
    tips: [
      { titel:"Start klein", tekst:"10 minuten wandelen per dag is beter dan 0. Bouw langzaam op. Perfectie is de vijand van consistent." },
      { titel:"Maak het makkelijk", tekst:"Leg je sportkleren de avond ervoor klaar. Hoe minder drempel, hoe groter de kans dat je het doet." },
      { titel:"NEAT — onbewust bewegen", tekst:"NEAT (Non-Exercise Activity Thermogenesis) is alle beweging buiten sport. Trap nemen, staand werken, fietsen naar de supermarkt — dit telt enorm mee." },
      { titel:"Krachttraining voor vrouwen", tekst:"Spiermassa verbrandt meer calorieën in rust, beschermt botten en verbetert hormoonbalans. 2x per week krachttraining heeft grote voordelen voor vrouwen." },
      { titel:"Herstel is ook training", tekst:"Rustdagen zijn essentieel. Overtraining verhoogt cortisol en verhoogt het risico op blessures. Plan bewust rustmomenten in." },
    ],
    oefeningen: [
      { titel:"Beginners wandelschema", duur:"30 min", beschrijving:"Week 1-2: 15 min wandelen per dag. Week 3-4: 20 min. Week 5-6: 30 min. Week 7+: 30-45 min met af en toe versnelling. Doe dit 5 dagen per week." },
      { titel:"10-minuten ochtendbeweging", duur:"10 min", beschrijving:"10 jumping jacks, 10 knieheffen, 10 armcirkels, 10 heupkantels, 30 sec plank. Herhaal 2x. Wakker worden voor je lichaam zonder fitnessruimte nodig te hebben." },
      { titel:"Stappendoel", duur:"Hele dag", beschrijving:"Streef naar 7.000-10.000 stappen per dag. Gebruik je telefoon als teller. Park verder weg, neem de trap, loop tijdens telefoongesprekken." },
      { titel:"7-minuten workout", duur:"7 min", beschrijving:"Jumping jacks (30s), muurzit (30s), push-ups (30s), buikspieroefening (30s), opstap op stoel (30s), squats (30s), triceps dips (30s). Wetenschappelijk onderbouwd als effectieve korte workout." },
    ],
    schema: [
      { tijd:"Ma/Wo/Vr", actie:"30 min wandelen of 7-minuten workout" },
      { tijd:"Di/Do", actie:"Krachttraining of yoga (20-45 min)" },
      { tijd:"Za", actie:"Langere actieve activiteit — fietsen, zwemmen, wandelen" },
      { tijd:"Zo", actie:"Rustdag — lichte wandeling toegestaan" },
      { tijd:"Dagelijks", actie:"Minimaal 7.000 stappen" },
    ]
  }
};

const ONBOARD_STEPS = [
  { id:"amanda", color:"#2d9e6b" },
  { id:"app1",   color:"#f97316" },
  { id:"app2",   color:"#a855f7" },
  { id:"app3",   color:"#ec4899" },
];

export default function App() {
  const [screen, setScreen]       = useState("splash");
  const [tab, setTab]             = useState("checker");
  const [mode, setMode]           = useState("dieet");
  const [selectedDiets, setSelectedDiets]       = useState(["keto","vegan"]);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [result, setResult]       = useState(null);
  const [currentProduct, setCurrentProduct] = useState("");
  const [catView, setCatView]     = useState(null);
  const [history, setHistory]     = useState([]);
  const [scanning, setScanning]   = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isStarter, setIsStarter] = useState(false);
  const hasStarter = isStarter || isPremium; // starter OR pro
  const [showPaywall, setShowPaywall] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser]           = useState(null);
  const [loginForm, setLoginForm] = useState({ email:"", password:"", name:"" });
  const [isRegister, setIsRegister] = useState(false);
  const [weekMenu, setWeekMenu]   = useState({});
  const [ifMode, setIfMode]       = useState(false);
  const [msgText, setMsgText]     = useState("");
  const [msgSent, setMsgSent]     = useState(false);
  const [msgCategory, setMsgCategory] = useState("voeding");
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showGoalDetail, setShowGoalDetail] = useState(null);
  const [newGoal, setNewGoal] = useState({ type:"slaap", label:"", target:"", unit:"uur/nacht", days:14, dieet:"", comment:"" });
  const [goalEvalComment, setGoalEvalComment] = useState("");
  const [showVoortgang, setShowVoortgang] = useState(false);
  const [checkinLog, setCheckinLog] = useState([]); // kept for pro dashboard compat
  const [favorites, setFavorites] = useState([]);
  const [showRequestProduct, setShowRequestProduct] = useState(false);
  const [requestedProducts, setRequestedProducts] = useState([]);
  const [requestProductName, setRequestProductName] = useState("");
  const [showShareApp, setShowShareApp] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [pricingTab, setPricingTab] = useState("starter");
  const [proMode, setProMode] = useState(false);
  const [proUser, setProUser] = useState(null);
  const [proLoginForm, setProLoginForm] = useState({email:"",password:"",name:"",type:"diëtist"});
  const [proEmailError, setProEmailError] = useState("");
  const [suppTab, setSuppTab] = useState("advies");
  const [suppFilter, setSuppFilter] = useState("alles");
  const [suppMsgText, setSuppMsgText] = useState("");
  const [suppMsgSent, setSuppMsgSent] = useState(false);
  const [suppMsgCategory, setSuppMsgCategory] = useState("supplement");
  const [showSuppDetail, setShowSuppDetail] = useState(null);
  const [leefstijlTab, setLeefstijlTab] = useState("slaap");
  const [leefstijlSectie, setLeefstijlSectie] = useState("tips");
  const [slaapTracker, setSlaapTracker] = useState({ uren:"", kwaliteit:0 });
  const [stresTracker, setStresTracker] = useState({ score:0, notitie:"" });
  const [bewegingTracker, setBewegingTracker] = useState({ minuten:"", type:"wandelen" });
  const [trackerLog, setTrackerLog] = useState([]);
  const [trackerSaved, setTrackerSaved] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [accessCodeError, setAccessCodeError] = useState("");
  const [accessCodeSuccess, setAccessCodeSuccess] = useState(false);
  const [vevoMeal, setVevoMeal] = useState([]);
  const [vevoSearch, setVevoSearch] = useState("");
  const [vevoSuggestions, setVevoSuggestions] = useState([]);
  const [showVevo, setShowVevo] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    });
  }, []);

  const redeemAccessCode = () => {
    if (accessCodeInput.trim().toUpperCase() === "VITAAL2026") {
      setIsPremium(true); setIsStarter(true);
      setAccessCodeSuccess(true);
      setAccessCodeError("");
      setTimeout(() => { setShowAccessCode(false); setAccessCodeSuccess(false); setAccessCodeInput(""); }, 2000);
    } else {
      setAccessCodeError("Ongeldige code. Probeer het opnieuw.");
    }
  };

  const installApp = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then(() => {
        setInstallPrompt(null);
        setShowInstallBanner(false);
      });
    }
  };
  const [proTab, setProTab] = useState("clients");
  const [clients, setClients] = useState([
    { id:1, name:"Lisa Janssen", age:34, diets:["keto","lactosevrij"], allergies:["melk"], notes:"Bezig met gewichtsafname. Goed op schema.", progress:[{dag:"Ma",score:"Goed",emoji:"😊"},{dag:"Di",score:"Top!",emoji:"🎉"},{dag:"Wo",score:"Oké",emoji:"😐"}], lastCheck:"Avocado", weekmenu:{}, sharedGoals:[{type:"slaap",label:"8 uur slapen",target:"8",unit:"uur/nacht",days:21,dailyLogs:[{dag:"Ma",score:4,comment:"Ging goed!"},{dag:"Di",score:3,comment:"Wat moeilijker"},{dag:"Wo",score:5,comment:"Perfect!"}],finalEval:null}] },
    { id:2, name:"Mark de Vries", age:41, diets:["mediterraan"], allergies:[], notes:"Hoge bloeddruk, nadruk op zoutarm eten.", progress:[{dag:"Ma",score:"Matig",emoji:"😕"},{dag:"Di",score:"Goed",emoji:"😊"}], lastCheck:"Zalm", weekmenu:{} },
    { id:3, name:"Sarah Bakker", age:28, diets:["vegan","glutenvrij"], allergies:["gluten","ei"], notes:"Zwanger, let extra op foliumzuur.", progress:[{dag:"Ma",score:"Top!",emoji:"🎉"},{dag:"Di",score:"Top!",emoji:"🎉"},{dag:"Wo",score:"Goed",emoji:"😊"}], lastCheck:"Quinoa", weekmenu:{} },
  ]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientNote, setClientNote] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({name:"",age:"",diets:[],allergies:[],notes:""});
  const [showProPaywall, setShowProPaywall] = useState(false);
  const [clientTab, setClientTab] = useState("profiel");
  const [shareClientProduct, setShareClientProduct] = useState("");
  const [mealPicker, setMealPicker] = useState(null); // {day, meal}
  const [mealUrl, setMealUrl] = useState("");
  const [mealUrlLoading, setMealUrlLoading] = useState(false);
  const [mealProductSearch, setMealProductSearch] = useState("");
  const [mealProductResults, setMealProductResults] = useState([]);
  const [mealPickerTab, setMealPickerTab] = useState("recept"); // recept | url | producten
  const [customMealItems, setCustomMealItems] = useState([]); // items being built
  const [ifSchema, setIfSchema]   = useState("16_8");
  const [menuDiet, setMenuDiet]   = useState("keto");
  const [onboarding, setOnboarding] = useState(true);
  const [onboardStep, setOnboardStep] = useState(0);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [shareProduct, setShareProduct] = useState(null);
  const [barcodeQuery, setBarcodeQuery] = useState("");
  const [barcodeLoading, setBarcodeLoading] = useState(false);
  const scanTimer = useRef(null);

  // ── Persistence: load from localStorage on mount ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vitaalcheck_data");
      if (saved) {
        const d = JSON.parse(saved);
        if (d.weekMenu) setWeekMenu(d.weekMenu);
        if (d.checkinLog) setCheckinLog(d.checkinLog);
        if (d.history) setHistory(d.history);
        if (d.selectedDiets) setSelectedDiets(d.selectedDiets);
        if (d.selectedAllergies) setSelectedAllergies(d.selectedAllergies);
        if (d.isPremium) setIsPremium(d.isPremium);
        if (d.isStarter) setIsStarter(d.isStarter);
        if (d.user) setUser(d.user);
        if (d.favorites) setFavorites(d.favorites);
        if (d.goals) setGoals(d.goals);
        if (d.onboarding === false) setOnboarding(false);
        if (d.requestedProducts) setRequestedProducts(d.requestedProducts);
      }
    } catch(e) { console.log("Load error:", e); }
  }, []);

  // ── Persistence: save to localStorage on change ──
  useEffect(() => {
    try {
      localStorage.setItem("vitaalcheck_data", JSON.stringify({
        weekMenu, checkinLog, history: history.slice(0,20),
        selectedDiets, selectedAllergies, isPremium, user,
        favorites, onboarding: false, requestedProducts, goals, isStarter
      }));
    } catch(e) { console.log("Save error:", e); }
  }, [weekMenu, checkinLog, history, selectedDiets, selectedAllergies, isPremium, user, favorites, requestedProducts]);

  useEffect(() => { setTimeout(() => setScreen("main"), 2200); }, []);
  useEffect(() => {
    if (searchQuery.length > 1) {
      const q = searchQuery.toLowerCase();
      setSuggestions(ALL_PRODUCTS.filter(p => p.toLowerCase().includes(q)).slice(0,5));
    } else setSuggestions([]);
  }, [searchQuery]);

  const toggleDiet    = id => setSelectedDiets(p => p.includes(id) ? p.filter(d=>d!==id) : [...p,id]);
  const toggleAllergy = id => setSelectedAllergies(p => p.includes(id) ? p.filter(a=>a!==id) : [...p,id]);

  const analyze = (name) => {
    if (!name || !DB[name]) { setResult({ error:`"${name}" staat nog niet in de database.` }); setTab("checker"); return; }
    const data = DB[name];
    const res = { product:name, info:data.info, cal:data.cal };

    if (mode==="dieet") {
      const dieten = {};
      selectedDiets.forEach(id => { dieten[id] = { toegestaan:!!data[keyMap[id]], reden:data.r[id] }; });
      res.dieten = dieten;
    } else if (mode==="allergie") {
      const allergies = {};
      selectedAllergies.forEach(id => { allergies[id] = { veilig:!!data[aKeyMap[id]], reden:data.ar[id] }; });
      res.allergies = allergies;
    } else if (mode==="zwanger") {
      res.zwanger = { status: data.zw, reden: data.zr };
    }

    setResult(res); setCurrentProduct(name); setSuggestions([]);
    setHistory(p => [{ product:name, result:res, mode, time:new Date() }, ...p.slice(0,9)]);
    setTab("checker");
  };

  const startScan = () => {
    setScanning(true); setScanResult(null);
    scanTimer.current = setTimeout(() => {
      const p = BARCODE_PRODUCTS[Math.floor(Math.random()*BARCODE_PRODUCTS.length)];
      setScanning(false); setScanResult(p); analyze(p);
    }, 2000);
  };
  const stopScan = () => { clearTimeout(scanTimer.current); setScanning(false); };
  const addToMenu = (day, meal, recipe) => setWeekMenu(p => ({...p,[`${day}-${meal}`]:recipe}));
  const handleLogin = () => {
    if (!loginForm.email||!loginForm.password) return;
    setUser({ name: isRegister ? loginForm.name : loginForm.email.split("@")[0], email:loginForm.email });
    setShowLogin(false);
  };
  // ⚠️ VEREIST: Vervang '31653713095' hieronder door jouw echte WhatsApp-nummer (zonder + en zonder 0 aan het begin, dus 316xxxxxxxx)
  const openWhatsApp = (plan) => {
    const messages = {
      starter: "Hoi Amanda! Ik wil graag een VitaalCheck Starter abonnement afsluiten (€4,99/mnd). Kunnen we dat regelen?",
      pro:     "Hoi Amanda! Ik wil graag een VitaalCheck Pro abonnement afsluiten (€7,99/mnd). Kunnen we dat regelen?",
      prof:    "Hoi Amanda! Ik wil graag een VitaalCheck Professional abonnement afsluiten (€19,99/mnd). Kunnen we dat regelen?",
    };
    const msg = encodeURIComponent(messages[plan] || messages.pro);
    window.open(`https://wa.me/31653713095?text=${msg}`, "_blank");
    setShowPaywall(false);
  };
  const handlePremium = () => openWhatsApp("pro");
  const handleStarterDemo = () => { setIsStarter(true); setShowPaywall(false); };
  const handleShare = (product, res) => { setShareProduct({ product, result: res }); setShowShare(true); };
  const toggleFavorite = (product) => {
    setFavorites(p => p.includes(product) ? p.filter(x=>x!==product) : [...p, product]);
  };
  const fetchRecipeFromUrl = async (url) => {
    if (!url.trim()) return;
    setMealUrlLoading(true);
    try {
      // Extract recipe name from URL
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/").filter(Boolean);
      const slug = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2] || "Recept van internet";
      const name = slug.replace(/-/g," ").replace(/\w/g, l => l.toUpperCase()).slice(0,40);
      const meal = { name, desc:`Recept van ${urlObj.hostname}`, url, ingredients:[], cal:0, fromUrl:true };
      if (mealPicker) {
        addToMenu(mealPicker.day, mealPicker.meal, meal);
        setMealPicker(null); setMealUrl("");
      }
    } catch {
      alert("Ongeldige URL. Zorg dat de URL begint met https://");
    }
    setMealUrlLoading(false);
  };

  const searchMealProducts = (q) => {
    setMealProductSearch(q);
    if (q.length < 2) { setMealProductResults([]); return; }
    const results = ALL_PRODUCTS.filter(p => p.toLowerCase().includes(q.toLowerCase())).slice(0,8);
    setMealProductResults(results);
  };

  const addProductToCustomMeal = (product) => {
    setCustomMealItems(p => p.includes(product) ? p : [...p, product]);
    setMealProductSearch(""); setMealProductResults([]);
  };

  const saveCustomMeal = () => {
    if (customMealItems.length === 0) return;
    const meal = { name: customMealItems.slice(0,2).join(" & ") + (customMealItems.length > 2 ? " e.a." : ""), desc:"Zelfgemaakt", ingredients: customMealItems, cal: customMealItems.length * 80, fromCustom:true };
    if (mealPicker) { addToMenu(mealPicker.day, mealPicker.meal, meal); setMealPicker(null); setCustomMealItems([]); }
  };

  const searchOpenFoodFacts = async (query) => {
    if (!query.trim()) return;
    setBarcodeLoading(true);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=1&lc=nl`);
      const data = await res.json();
      const product = data.products?.[0];
      if (product) {
        const name = product.product_name_nl || product.product_name || query;
        const cal = Math.round(product.nutriments?.["energy-kcal_100g"] || 0);
        const brands = product.brands || "";
        setResult({ product: name, info: brands ? `Merk: ${brands}` : "Via Open Food Facts", cal, dieten:{}, allergies:{}, zwanger:null, external:true });
        setCurrentProduct(name);
        setTab("checker");
      } else {
        setResult({ error: `Geen product gevonden voor "${query}" in Open Food Facts.` });
        setTab("checker");
      }
    } catch {
      setResult({ error: "Open Food Facts is niet bereikbaar. Probeer later opnieuw." });
      setTab("checker");
    }
    setBarcodeLoading(false);
  };

  const dc = id => DIETS.find(d=>d.id===id)?.color||"#fff";
  const ac = id => ALLERGIES.find(a=>a.id===id)?.color||"#fff";

  const zwStatusColor = s => s===1 ? "#22c55e" : s===0 ? "#ef4444" : "#f59e0b";
  const zwStatusLabel = s => s===1 ? "Veilig ✅" : s===0 ? "Niet veilig ❌" : "Met mate ⚠️";
  const zwStatusBg    = s => s===1 ? "rgba(34,197,94,0.08)" : s===0 ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)";
  const zwStatusBorder= s => s===1 ? "rgba(34,197,94,0.25)" : s===0 ? "rgba(239,68,68,0.25)" : "rgba(245,158,11,0.25)";

  // ── PRO DASHBOARD ────────────────────────────────────────────────────────
  if (proMode) {
    const client = clients.find(cl=>cl.id===selectedClient);
    return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0f172a,#1e293b)", fontFamily:"'DM Sans',sans-serif", color:"#f1f5f9", maxWidth:430, margin:"0 auto", paddingBottom:80 }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');
          @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
          @keyframes spin{to{transform:rotate(360deg)}}
          *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
          input::placeholder{color:rgba(255,255,255,0.3)} input,textarea{color:#f1f5f9}
          ::-webkit-scrollbar{display:none}
        `}</style>

        {/* Pro Header */}
        <div style={{ background:"rgba(15,23,42,0.95)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(99,102,241,0.2)", padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {selectedClient && <button onClick={()=>setSelectedClient(null)} style={{ background:"rgba(99,102,241,0.15)", border:"none", borderRadius:8, width:30, height:30, color:"#818cf8", cursor:"pointer", fontSize:16 }}>←</button>}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:18 }}>🏥</span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:18, background:"linear-gradient(90deg,#818cf8,#c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>VitaalCheck Pro</span>
                <span style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius:6, fontSize:10, fontWeight:700, padding:"2px 7px", color:"#fff" }}>PROFESSIONAL</span>
              </div>
              {proUser && <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.4)" }}>{proUser.name} · {proUser.type}</p>}
            </div>
          </div>
          <button onClick={()=>{ setProMode(false); setProUser(null); setSelectedClient(null); }} style={{ background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.25)", borderRadius:10, padding:"6px 12px", color:"#818cf8", fontSize:12, cursor:"pointer" }}>← Terug</button>
        </div>

        {/* Pro Login */}
        {!proUser ? (
          <div style={{ padding:"40px 24px", animation:"fadeUp 0.3s ease" }}>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <div style={{ fontSize:52, marginBottom:12 }}>🏥</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, margin:"0 0 8px" }}>Professioneel account</h2>
              <p style={{ color:"rgba(255,255,255,0.5)", fontSize:14, margin:0 }}>Voor diëtisten en leefstijlcoaches</p>
            </div>
            <div style={{ background:"rgba(99,102,241,0.08)", borderRadius:16, padding:20, marginBottom:16, border:"1px solid rgba(99,102,241,0.2)" }}>
              <p style={{ margin:"0 0 14px", fontSize:13, fontWeight:700, color:"#818cf8" }}>✨ Wat je krijgt voor €19,99/mnd:</p>
              {["👥 Onbeperkt cliënten beheren","📋 Notities per cliënt","📅 Weekmenu's voor cliënten","📊 Voortgang bijhouden","🔗 Productchecks delen","📄 PDF rapporten exporteren"].map(f => (
                <p key={f} style={{ margin:"0 0 6px", fontSize:12, color:"rgba(255,255,255,0.7)" }}>{f}</p>
              ))}
            </div>
            <div style={{ marginBottom:12 }}>
              <p style={{ margin:"0 0 6px", fontSize:12, color:"rgba(255,255,255,0.5)" }}>Ik ben een:</p>
              <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                {["diëtist","leefstijlcoach","huisarts","andere professional"].map(t => (
                  <button key={t} onClick={()=>setProLoginForm(p=>({...p,type:t}))} style={{ flex:1, padding:"7px 4px", borderRadius:10, border:`1.5px solid ${proLoginForm.type===t?"#818cf8":"rgba(99,102,241,0.2)"}`, background:proLoginForm.type===t?"rgba(99,102,241,0.15)":"transparent", color:proLoginForm.type===t?"#818cf8":"rgba(255,255,255,0.4)", fontSize:10, cursor:"pointer", fontWeight:proLoginForm.type===t?700:400 }}>{t}</button>
                ))}
              </div>
              <input type="text" value={proLoginForm.name} onChange={e=>setProLoginForm(p=>({...p,name:e.target.value}))}
                placeholder="Naam" style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"1px solid rgba(99,102,241,0.25)", background:"rgba(99,102,241,0.08)", fontSize:14, outline:"none", color:"#f1f5f9", marginBottom:8, display:"block" }} />
              
              {/* Email with validation */}
              <input type="email" value={proLoginForm.email}
                onChange={e=>{ setProLoginForm(p=>({...p,email:e.target.value})); setProEmailError(getEmailError(e.target.value)); }}
                onBlur={e=>setProEmailError(getEmailError(e.target.value))}
                placeholder="Zakelijk e-mailadres (bijv. naam@praktijk.nl)"
                style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:`1px solid ${proEmailError?"rgba(239,68,68,0.5)":proLoginForm.email&&isPersonalEmail(proLoginForm.email)?"rgba(34,197,94,0.4)":"rgba(99,102,241,0.25)"}`, background:"rgba(255,255,255,0.12)", fontSize:14, outline:"none", color:"#f1f5f9", marginBottom:proEmailError?4:8, display:"block" }} />
              {proEmailError && <p style={{ margin:"0 0 8px", fontSize:11, color:"#f87171", lineHeight:1.5 }}>{proEmailError}</p>}
              {proLoginForm.email && isPersonalEmail(proLoginForm.email) && !proEmailError && (
                <p style={{ margin:"0 0 8px", fontSize:11, color:"#4ade80" }}>✅ Zakelijk e-mailadres geaccepteerd</p>
              )}

              <input type="password" value={proLoginForm.password} onChange={e=>setProLoginForm(p=>({...p,password:e.target.value}))}
                placeholder="Wachtwoord" style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"1px solid rgba(99,102,241,0.25)", background:"rgba(99,102,241,0.08)", fontSize:14, outline:"none", color:"#f1f5f9", marginBottom:8, display:"block" }} />

              {/* Info box */}
              <div style={{ background:"rgba(99,102,241,0.1)", borderRadius:12, padding:"10px 14px", marginBottom:4, border:"1px solid rgba(99,102,241,0.2)" }}>
                <p style={{ margin:"0 0 3px", fontSize:12, fontWeight:700, color:"#818cf8" }}>ℹ️ Persoonlijk account vereist</p>
                <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.5)", lineHeight:1.5 }}>
                  Elk account is persoonlijk en gekoppeld aan één professional. Gebruik je zakelijk e-mailadres van je eigen praktijk of instelling. Gratis e-maildiensten zoals Gmail of Hotmail zijn niet toegestaan.
                </p>
              </div>
            </div>
            <button
              onClick={()=>{ 
                const err = getEmailError(proLoginForm.email);
                if(err){ setProEmailError(err); return; }
                if(!isPersonalEmail(proLoginForm.email)){ setProEmailError("Gebruik een zakelijk e-mailadres van je eigen praktijk."); return; }
                if(proLoginForm.name&&proLoginForm.email) setProUser({name:proLoginForm.name,email:proLoginForm.email,type:proLoginForm.type});
              }}
              disabled={!proLoginForm.name||!proLoginForm.email||!proLoginForm.password||!!proEmailError||!isPersonalEmail(proLoginForm.email)}
              style={{ width:"100%", padding:14, borderRadius:14, border:"none", background: proLoginForm.name&&isPersonalEmail(proLoginForm.email)&&proLoginForm.password ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(99,102,241,0.25)", color:"#fff", fontSize:15, fontWeight:700, cursor: proLoginForm.name&&isPersonalEmail(proLoginForm.email)&&proLoginForm.password?"pointer":"default", marginBottom:10, transition:"all 0.2s" }}>
              Inloggen / Registreren
            </button>
            <button onClick={()=>openWhatsApp("prof")} style={{ width:"100%", marginTop:10, padding:13, borderRadius:12, border:"none", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              📱 Aanmelden via WhatsApp →
            </button>
            <p style={{ textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.3)", margin:"8px 0 0" }}>7 dagen gratis proberen · daarna €19,99/mnd</p>
          </div>
        ) : selectedClient ? (
          /* ── CLIENT DETAIL ── */
          <div style={{ padding:"14px 16px", animation:"fadeUp 0.3s ease" }}>
            <div style={{ background:"rgba(99,102,241,0.08)", borderRadius:16, padding:16, marginBottom:14, border:"1px solid rgba(99,102,241,0.2)" }}>
              <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:10 }}>
                <div style={{ width:48, height:48, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#c084fc)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:700, color:"#fff" }}>{client.name[0]}</div>
                <div>
                  <p style={{ margin:"0 0 2px", fontSize:17, fontWeight:700 }}>{client.name}</p>
                  <p style={{ margin:0, fontSize:12, color:"rgba(255,255,255,0.45)" }}>{client.age} jaar · {client.diets.join(", ")}</p>
                </div>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {client.diets.map(d => { const diet=DIETS.find(x=>x.id===d); return diet ? <span key={d} style={{ background:`${diet.color}20`, borderRadius:16, padding:"3px 10px", fontSize:11, color:diet.color, border:`1px solid ${diet.color}40` }}>{diet.emoji} {diet.label}</span> : null; })}
                {client.allergies.map(a => { const all=ALLERGIES.find(x=>x.id===a); return all ? <span key={a} style={{ background:"rgba(239,68,68,0.1)", borderRadius:16, padding:"3px 10px", fontSize:11, color:"#f87171", border:"1px solid rgba(239,68,68,0.2)" }}>{all.emoji} {all.label}</span> : null; })}
              </div>
            </div>

            {/* Client tabs */}
            <div style={{ display:"flex", background:"rgba(99,102,241,0.08)", borderRadius:12, padding:3, marginBottom:14, gap:2 }}>
              {[["profiel","📋 Profiel"],["voortgang","📊 Voortgang"],["weekmenu","📅 Menu"],["rapport","📄 Rapport"]].map(([id,label]) => (
                <button key={id} onClick={()=>setClientTab(id)} style={{ flex:1, padding:"8px 0", border:"none", borderRadius:9, cursor:"pointer", background:clientTab===id?"rgba(99,102,241,0.25)":"transparent", color:clientTab===id?"#818cf8":"rgba(255,255,255,0.35)", fontSize:11, fontWeight:clientTab===id?700:400 }}>{label}</button>
              ))}
            </div>

            {/* Profiel tab */}
            {clientTab==="profiel" && (
              <div>
                <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:16, marginBottom:12, border:"1px solid rgba(255,255,255,0.07)" }}>
                  <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:700, color:"#818cf8" }}>📝 Notities</p>
                  <p style={{ margin:"0 0 10px", fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.6 }}>{client.notes || "Nog geen notities."}</p>
                  <textarea value={clientNote} onChange={e=>setClientNote(e.target.value)} placeholder="Voeg een notitie toe..."
                    rows={3} style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid rgba(99,102,241,0.25)", background:"rgba(99,102,241,0.08)", fontSize:13, outline:"none", color:"#f1f5f9", color:"#f1f5f9", resize:"none", fontFamily:"inherit", lineHeight:1.5, boxSizing:"border-box" }} />
                  <button onClick={()=>{ if(clientNote.trim()){ setClients(p=>p.map(cl=>cl.id===client.id?{...cl,notes:clientNote}:cl)); setClientNote(""); }}}
                    style={{ marginTop:8, padding:"8px 16px", borderRadius:10, border:"none", background:"#6366f1", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>Opslaan</button>
                </div>
                <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:16, marginBottom:12, border:"1px solid rgba(255,255,255,0.07)" }}>
                  <p style={{ margin:"0 0 10px", fontSize:13, fontWeight:700, color:"#818cf8" }}>🔗 Productcheck delen</p>
                  <p style={{ margin:"0 0 10px", fontSize:12, color:"rgba(255,255,255,0.45)" }}>Stuur een productcheck naar {client.name}:</p>
                  <div style={{ display:"flex", gap:8 }}>
                    <input value={shareClientProduct} onChange={e=>setShareClientProduct(e.target.value)} placeholder="Product naam..." style={{ flex:1, padding:"9px 12px", borderRadius:10, border:"1px solid rgba(99,102,241,0.25)", background:"rgba(99,102,241,0.08)", fontSize:13, outline:"none", color:"#f1f5f9" }} />
                    <button onClick={()=>{ if(shareClientProduct.trim()){ alert(`Productcheck voor "${shareClientProduct}" is gedeeld met ${client.name}!`); setShareClientProduct(""); }}} style={{ padding:"9px 14px", borderRadius:10, border:"none", background:"#6366f1", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>Deel</button>
                  </div>
                </div>
              </div>
            )}

            {/* Voortgang tab */}
            {clientTab==="voortgang" && (
              <div>
                <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:16, marginBottom:12, border:"1px solid rgba(255,255,255,0.07)" }}>
                  <p style={{ margin:"0 0 12px", fontSize:13, fontWeight:700, color:"#818cf8" }}>📊 Check-in geschiedenis</p>
                  {client.progress.length === 0
                    ? <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13 }}>Nog geen check-ins.</p>
                    : client.progress.map((p,i) => (
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(99,102,241,0.08)", borderRadius:10, padding:"10px 14px", marginBottom:7, border:"1px solid rgba(99,102,241,0.15)" }}>
                          <span style={{ fontSize:22 }}>{p.emoji}</span>
                          <div><p style={{ margin:"0 0 1px", fontSize:13, fontWeight:700 }}>{p.score}</p><p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.4)" }}>{p.dag}</p></div>
                          <div style={{ marginLeft:"auto", fontSize:11, color:"rgba(255,255,255,0.35)" }}>Geregistreerd</div>
                        </div>
                      ))
                  }
                </div>
                <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:16, border:"1px solid rgba(255,255,255,0.07)" }}>
                  <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:700, color:"#818cf8" }}>📈 Samenvatting</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {[["Check-ins",client.progress.length],["Top! 🎉",client.progress.filter(p=>p.score==="Top!").length],["Goed 😊",client.progress.filter(p=>p.score==="Goed").length],["Aandacht 😕",client.progress.filter(p=>p.score==="Matig").length]].map(([l,v]) => (
                      <div key={l} style={{ background:"rgba(99,102,241,0.08)", borderRadius:10, padding:"10px 12px" }}>
                        <p style={{ margin:"0 0 2px", fontSize:11, color:"rgba(255,255,255,0.45)" }}>{l}</p>
                        <p style={{ margin:0, fontSize:22, fontWeight:800 }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Weekmenu tab */}
            {clientTab==="weekmenu" && (
              <div>
                <p style={{ margin:"0 0 12px", fontSize:13, color:"rgba(255,255,255,0.5)" }}>Stel een weekmenu samen voor {client.name}:</p>
                {["Ma","Di","Wo","Do","Vr","Za","Zo"].map(day => (
                  <div key={day} style={{ marginBottom:10 }}>
                    <p style={{ margin:"0 0 6px", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:1 }}>{day}</p>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:5 }}>
                      {["Ontbijt","Lunch","Diner"].map(meal => {
                        const key=`${day}-${meal}`, item=client.weekmenu?.[key];
                        const opts = (RECIPES[client.diets[0]]||RECIPES.mediterraan||[]);
                        return (
                          <div key={meal} onClick={()=>{ const r=opts[Math.floor(Math.random()*opts.length)]; setClients(p=>p.map(cl=>cl.id===client.id?{...cl,weekmenu:{...cl.weekmenu,[key]:r}}:cl)); }}
                            style={{ background:item?"rgba(99,102,241,0.15)":"rgba(99,102,241,0.06)", border:`1px solid ${item?"rgba(99,102,241,0.3)":"rgba(99,102,241,0.12)"}`, borderRadius:10, padding:"8px 7px", cursor:"pointer", minHeight:50 }}>
                            <p style={{ margin:"0 0 2px", fontSize:9, color:"rgba(255,255,255,0.35)", textTransform:"uppercase" }}>{meal}</p>
                            <p style={{ margin:0, fontSize:10, color:item?"#818cf8":"rgba(255,255,255,0.25)", lineHeight:1.4 }}>{item?item.name:"+ Voeg toe"}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Rapport tab */}
            {clientTab==="rapport" && (
              <div>
                <div style={{ background:"rgba(99,102,241,0.08)", borderRadius:16, padding:18, marginBottom:14, border:"1px solid rgba(99,102,241,0.2)" }}>
                  <p style={{ margin:"0 0 4px", fontSize:15, fontWeight:700 }}>📄 Rapport voor {client.name}</p>
                  <p style={{ margin:"0 0 14px", fontSize:12, color:"rgba(255,255,255,0.45)" }}>Gegenereerd door VitaalCheck Professional</p>
                  <div style={{ background:"rgba(15,23,42,0.5)", borderRadius:12, padding:14, marginBottom:12 }}>
                    <p style={{ margin:"0 0 6px", fontSize:12, fontWeight:700, color:"#818cf8" }}>Cliëntgegevens</p>
                    <p style={{ margin:"0 0 3px", fontSize:12, color:"rgba(255,255,255,0.65)" }}>Naam: {client.name}</p>
                    <p style={{ margin:"0 0 3px", fontSize:12, color:"rgba(255,255,255,0.65)" }}>Leeftijd: {client.age} jaar</p>
                    <p style={{ margin:"0 0 3px", fontSize:12, color:"rgba(255,255,255,0.65)" }}>Diëten: {client.diets.join(", ") || "Geen"}</p>
                    <p style={{ margin:0, fontSize:12, color:"rgba(255,255,255,0.65)" }}>Allergieën: {client.allergies.join(", ") || "Geen"}</p>
                  </div>
                  <div style={{ background:"rgba(15,23,42,0.5)", borderRadius:12, padding:14, marginBottom:12 }}>
                    <p style={{ margin:"0 0 6px", fontSize:12, fontWeight:700, color:"#818cf8" }}>Notities coach</p>
                    <p style={{ margin:0, fontSize:12, color:"rgba(255,255,255,0.65)", lineHeight:1.6 }}>{client.notes || "Geen notities."}</p>
                  </div>
                  <div style={{ background:"rgba(15,23,42,0.5)", borderRadius:12, padding:14 }}>
                    <p style={{ margin:"0 0 6px", fontSize:12, fontWeight:700, color:"#818cf8" }}>Voortgang ({client.progress.length} check-ins)</p>
                    <p style={{ margin:0, fontSize:12, color:"rgba(255,255,255,0.65)" }}>Top!: {client.progress.filter(p=>p.score==="Top!").length}x · Goed: {client.progress.filter(p=>p.score==="Goed").length}x · Oké: {client.progress.filter(p=>p.score==="Oké").length}x · Matig: {client.progress.filter(p=>p.score==="Matig").length}x</p>
                  </div>
                </div>
                <button onClick={()=>alert("PDF export is beschikbaar in de native app. Je kunt nu ook een screenshot maken van dit rapport.")}
                  style={{ width:"100%", padding:14, borderRadius:14, border:"none", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", marginBottom:8 }}>
                  📄 Exporteer als PDF
                </button>
                <button onClick={()=>alert(`Rapport voor ${client.name} gedeeld via WhatsApp!`)}
                  style={{ width:"100%", padding:12, borderRadius:12, border:"1px solid rgba(99,102,241,0.25)", background:"rgba(99,102,241,0.08)", color:"#818cf8", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                  📱 Deel rapport met cliënt
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── CLIENT OVERVIEW ── */
          <div style={{ padding:"14px 16px", animation:"fadeUp 0.3s ease" }}>
            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
              {[["👥",clients.length,"Cliënten"],["✅",clients.reduce((s,cl)=>s+cl.progress.length,0),"Check-ins"],["📅",clients.reduce((s,cl)=>s+Object.keys(cl.weekmenu||{}).length,0),"Menu's"]].map(([emoji,val,label]) => (
                <div key={label} style={{ background:"rgba(99,102,241,0.1)", borderRadius:12, padding:"12px 10px", textAlign:"center", border:"1px solid rgba(99,102,241,0.2)" }}>
                  <p style={{ margin:"0 0 2px", fontSize:20 }}>{emoji}</p>
                  <p style={{ margin:"0 0 1px", fontSize:22, fontWeight:800 }}>{val}</p>
                  <p style={{ margin:0, fontSize:10, color:"rgba(255,255,255,0.45)" }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Client list */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <p style={{ margin:0, fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.7)" }}>Mijn cliënten</p>
              <button onClick={()=>setShowAddClient(true)} style={{ padding:"6px 14px", borderRadius:10, border:"none", background:"#6366f1", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Toevoegen</button>
            </div>

            {clients.map(cl => (
              <div key={cl.id} onClick={()=>{ setSelectedClient(cl.id); setClientTab("profiel"); setClientNote(cl.notes||""); }}
                style={{ background:"rgba(99,102,241,0.08)", borderRadius:14, padding:"14px 16px", marginBottom:10, cursor:"pointer", border:"1px solid rgba(99,102,241,0.18)", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#c084fc)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:"#fff", flexShrink:0 }}>{cl.name[0]}</div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:"0 0 2px", fontSize:14, fontWeight:700 }}>{cl.name}</p>
                  <p style={{ margin:"0 0 4px", fontSize:11, color:"rgba(255,255,255,0.45)" }}>{cl.age} jaar · {cl.diets.map(d=>DIETS.find(x=>x.id===d)?.emoji).join(" ")}</p>
                  <div style={{ display:"flex", gap:6 }}>
                    <span style={{ fontSize:10, background:"rgba(99,102,241,0.15)", borderRadius:8, padding:"2px 7px", color:"#818cf8" }}>📊 {cl.progress.length} check-ins</span>
                    {cl.lastCheck && <span style={{ fontSize:10, background:"rgba(45,158,107,0.12)", borderRadius:8, padding:"2px 7px", color:"#4ade80" }}>🔍 {cl.lastCheck}</span>}
                  </div>
                </div>
                <span style={{ color:"rgba(255,255,255,0.3)", fontSize:18 }}>›</span>
              </div>
            ))}
          </div>
        )}

        {/* Add client modal */}
        {showAddClient && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:100, display:"flex", alignItems:"flex-end" }} onClick={()=>setShowAddClient(false)}>
            <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:430, margin:"0 auto", background:"#0f172a", borderRadius:"24px 24px 0 0", padding:28, border:"1px solid rgba(99,102,241,0.25)" }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 16px", fontSize:20 }}>👤 Nieuwe cliënt</h3>
              {[["Naam","name","text"],["Leeftijd","age","number"],["Notities","notes","text"]].map(([label,key,type]) => (
                <input key={key} type={type} value={newClient[key]} onChange={e=>setNewClient(p=>({...p,[key]:e.target.value}))}
                  placeholder={label} style={{ width:"100%", padding:"11px 14px", borderRadius:11, border:"1px solid rgba(99,102,241,0.25)", background:"rgba(99,102,241,0.08)", fontSize:13, outline:"none", color:"#f1f5f9", color:"#f1f5f9", marginBottom:8, display:"block" }} />
              ))}
              <p style={{ margin:"0 0 6px", fontSize:12, color:"rgba(255,255,255,0.5)" }}>Diëten:</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
                {DIETS.map(d => <button key={d.id} onClick={()=>setNewClient(p=>({...p,diets:p.diets.includes(d.id)?p.diets.filter(x=>x!==d.id):[...p.diets,d.id]}))} style={{ padding:"4px 10px", borderRadius:16, border:`1.5px solid ${newClient.diets.includes(d.id)?d.color:"rgba(255,255,255,0.15)"}`, background:newClient.diets.includes(d.id)?`${d.color}20`:"transparent", color:newClient.diets.includes(d.id)?d.color:"rgba(255,255,255,0.4)", fontSize:11, cursor:"pointer" }}>{d.emoji} {d.label}</button>)}
              </div>
              <button onClick={()=>{ if(newClient.name){ setClients(p=>[...p,{id:Date.now(),name:newClient.name,age:parseInt(newClient.age)||0,diets:newClient.diets,allergies:[],notes:newClient.notes,progress:[],weekmenu:{},lastCheck:""}]); setNewClient({name:"",age:"",diets:[],allergies:[],notes:""}); setShowAddClient(false); }}}
                style={{ width:"100%", padding:13, borderRadius:12, border:"none", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
                Cliënt toevoegen
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (onboarding) {
    const colors = ["#2d9e6b","#f97316","#a855f7","#ec4899"];
    const col = colors[onboardStep];
    const isLast = onboardStep === ONBOARD_STEPS.length - 1;

    const renderStep = () => {
      if (onboardStep === 0) return (
        <div style={{ animation:"fadeUp 0.4s ease", width:"100%", overflowY:"auto", flex:1, paddingBottom:16 }}>
          {/* Hero */}
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <div style={{ width:90, height:90, borderRadius:"50%", background:"linear-gradient(135deg,#2d9e6b,#a8e6cf)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:42, margin:"0 auto 14px" }}>💚</div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:900, color:"#1a3a1a", margin:"0 0 8px" }}>Welkom bij VitaalCheck</h1>
            <p style={{ margin:"0 0 14px", fontSize:14, color:"rgba(30,90,30,0.7)", lineHeight:1.7, fontStyle:"italic" }}>VitaalCheck is de enige Nederlandse app die voeding, leefstijl, allergieën, zwangerschap en persoonlijke coaching combineert — voor zowel consumenten als professionals.</p>
            <div style={{ display:"flex", gap:7, justifyContent:"center", flexWrap:"wrap" }}>
              {["🥗 Diëten","⚠️ Allergieën","🤰 Zwangerschap","💊 Leefstijl"].map(tag => (
                <span key={tag} style={{ background:"rgba(45,158,107,0.1)", borderRadius:20, padding:"4px 11px", fontSize:11, color:"#2d9e6b", border:"1px solid rgba(45,158,107,0.25)" }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Over Amanda */}
          <div style={{ background:"rgba(45,158,107,0.07)", borderRadius:14, padding:16, marginBottom:12, border:"1px solid rgba(45,158,107,0.15)" }}>
            <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#2d9e6b,#a8e6cf)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🌿</div>
              <div>
                <p style={{ margin:"0 0 2px", fontSize:14, fontWeight:700, color:"#1a3a1a" }}>Amanda</p>
                <p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.55)" }}>Sociaal werker · Orthomoleculair Therapeut · Leefstijlcoach</p>
              </div>
            </div>
            <p style={{ margin:"0 0 10px", fontSize:13, color:"rgba(30,90,30,0.75)", lineHeight:1.7 }}>Ik ben Amanda, hardwerkende moeder van twee, met een achtergrond als sociaal werker, orthomoleculair therapeut en leefstijlcoach met een erkende opleiding.</p>
            <p style={{ margin:"0 0 10px", fontSize:13, color:"rgba(30,90,30,0.75)", lineHeight:1.7 }}>Omdat mijn dagen al goed gevuld zijn, heb ik lang niet altijd tijd of zin om goed op een gezonde leefstijl te letten. Vragen als: mag ik dit wel of niet eten bij een bepaalde allergie of dieet? Wat voor recepten passen bij mij? Beweeg ik wel voldoende? Heb ik niet te veel stress en zo ja, wat doe ik daar dan aan? Dit allemaal bijhouden in minstens vijf verschillende apps waarvan de helft in het Engels is — het is al bijna een dagtaak op zichzelf.</p>
            <p style={{ margin:"0 0 10px", fontSize:13, color:"rgba(30,90,30,0.75)", lineHeight:1.7 }}>Ik dacht: <strong style={{ color:"#2d9e6b" }}>dat moet anders kunnen!</strong> En zo werd het idee voor VitaalCheck geboren.</p>
            <p style={{ margin:"0 0 10px", fontSize:13, color:"rgba(30,90,30,0.75)", lineHeight:1.7 }}>Ik hoop dat jullie de app net zo nuttig vinden als ik, en ik ontvang graag eventuele vragen en feedback.</p>
            <p style={{ margin:"0 0 6px", fontSize:13, color:"#2d9e6b", fontWeight:700, lineHeight:1.7, fontStyle:"italic" }}>"Diëten is goed voor een tijdje, maar een gezonde leefstijl is voor altijd!"</p>
            <p style={{ margin:0, fontSize:13, color:"rgba(30,90,30,0.75)", lineHeight:1.7 }}>Groetjes, Amanda 🌿</p>
          </div>

          {/* Visie */}
          <div style={{ background:"rgba(45,158,107,0.07)", borderRadius:14, padding:16, marginBottom:12, border:"1px solid rgba(45,158,107,0.15)" }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 8px", fontSize:16, color:"#1a3a1a" }}>Mijn visie</h3>
            <p style={{ margin:"0 0 10px", fontSize:13, color:"rgba(30,90,30,0.75)", lineHeight:1.7 }}>Diëten kan helpen — maar niet voor altijd en niet in extreme vorm. Ik geloof in <strong style={{ color:"#2d9e6b" }}>gevarieerd eten met mate</strong>. Wie gevarieerd eet, voldoende beweegt en let op stress en slaap, komt al een heel eind.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[["🥗","Gevarieerd eten","Geen enkel voedsel is verboden. Variatie is de sleutel."],["🏃","Bewegen","Dagelijks wandelen maakt al een groot verschil."],["😴","Slaap & herstel","Minstens zo belangrijk als wat je eet."],["🧘","Stressmanagement","Rust is geen luxe, maar een noodzaak."]].map(([e,t,b]) => (
                <div key={t} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>{e}</span>
                  <div><p style={{ margin:"0 0 1px", fontSize:12, fontWeight:700, color:"#2d9e6b" }}>{t}</p><p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.6)", lineHeight:1.5 }}>{b}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* Opleidingen */}
          <div style={{ background:"rgba(45,158,107,0.07)", borderRadius:14, padding:16, border:"1px solid rgba(45,158,107,0.15)" }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 10px", fontSize:16, color:"#1a3a1a" }}>Opleidingen</h3>
            {[["🎓","Erkend Leefstijlcoach","Duurzame gedragsverandering rondom voeding, beweging, slaap en stress."],["💊","Orthomoleculaire Therapie","Voedingsstoffen en supplementen op cellulair niveau."]].map(([e,t,b]) => (
              <div key={t} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"rgba(45,158,107,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{e}</div>
                <div><p style={{ margin:"0 0 2px", fontSize:13, fontWeight:600, color:"#1a3a1a" }}>{t}</p><p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.6)", lineHeight:1.5 }}>{b}</p></div>
              </div>
            ))}
          </div>
        </div>
      );
      if (onboardStep === 1) return (
        <div style={{ animation:"fadeUp 0.4s ease", textAlign:"center", flex:1, display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <div style={{ width:90, height:90, borderRadius:24, background:"rgba(249,115,22,0.12)", border:"2px solid rgba(249,115,22,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, margin:"0 auto 22px" }}>🔍</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:"#1a3a1a", margin:"0 0 12px" }}>Check elk product</h2>
          <p style={{ fontSize:14, color:"rgba(30,90,30,0.7)", lineHeight:1.7, margin:"0 auto 24px", maxWidth:280 }}>Zoek of scan een product en zie direct of het past bij jouw <strong>dieet</strong>, <strong>allergie</strong> of tijdens de <strong>zwangerschap</strong>.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8, textAlign:"left" }}>
            {[["🥗","7 diëten","Keto, Vegan, Glutenvrij, Lactosevrij, Suikervrij, Mediterraan, Paleo"],["⚠️","8 allergenen","Noten, Gluten, Melk, Ei, Vis, Soja, Schaaldieren, Sesam"],["🤰","Zwangerschapsmodus","Veiligheidscheck voor elk product tijdens je zwangerschap"]].map(([e,t,b]) => (
              <div key={t} style={{ background:"rgba(249,115,22,0.07)", borderRadius:12, padding:"11px 14px", border:"1px solid rgba(249,115,22,0.15)", display:"flex", gap:10 }}>
                <span style={{ fontSize:20 }}>{e}</span>
                <div><p style={{ margin:"0 0 2px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>{t}</p><p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.6)" }}>{b}</p></div>
              </div>
            ))}
          </div>
        </div>
      );
      if (onboardStep === 2) return (
        <div style={{ animation:"fadeUp 0.4s ease", textAlign:"center", flex:1, display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <div style={{ width:90, height:90, borderRadius:24, background:"rgba(168,85,247,0.12)", border:"2px solid rgba(168,85,247,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, margin:"0 auto 22px" }}>📅</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:"#1a3a1a", margin:"0 0 12px" }}>Plan je weekmenu</h2>
          <p style={{ fontSize:14, color:"rgba(30,90,30,0.7)", lineHeight:1.7, margin:"0 auto 24px", maxWidth:280 }}>Stel je maaltijdplan samen voor de hele week — met recepten die passen bij jouw dieet.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8, textAlign:"left" }}>
            {[["🍳","60+ recepten","Per dieet gesorteerd, met ingrediënten en calorieën"],["⏱","Intermittent Fasting","16:8, 18:6, 20:4 of 5:2 — kies je schema"],["🌍","Open Food Facts","Zoek miljoenen echte supermarktproducten op naam"]].map(([e,t,b]) => (
              <div key={t} style={{ background:"rgba(168,85,247,0.07)", borderRadius:12, padding:"11px 14px", border:"1px solid rgba(168,85,247,0.15)", display:"flex", gap:10 }}>
                <span style={{ fontSize:20 }}>{e}</span>
                <div><p style={{ margin:"0 0 2px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>{t}</p><p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.6)" }}>{b}</p></div>
              </div>
            ))}
          </div>
        </div>
      );
      if (onboardStep === 3) return (
        <div style={{ animation:"fadeUp 0.4s ease", textAlign:"center", flex:1, display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <div style={{ width:90, height:90, borderRadius:24, background:"rgba(236,72,153,0.12)", border:"2px solid rgba(236,72,153,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, margin:"0 auto 22px" }}>⭐</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:"#1a3a1a", margin:"0 0 12px" }}>Upgrade naar Pro</h2>
          <p style={{ fontSize:14, color:"rgba(30,90,30,0.7)", lineHeight:1.7, margin:"0 auto 24px", maxWidth:280 }}>Haal het meeste uit VitaalCheck met een Pro-lidmaatschap.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8, textAlign:"left", marginBottom:16 }}>
            {[["💬","Persoonlijk leefstijladvies","Stel Amanda een persoonlijke vraag over jouw leefstijl"],["📅","Weekmenu planner","Plan en beheer al je maaltijden"],["🍳","Volledige recepten","Toegang tot alle recepten en bereidingswijzen"],["❤️","Favorieten","Sla je favoriete producten en recepten op"]].map(([e,t,b]) => (
              <div key={t} style={{ background:"rgba(236,72,153,0.07)", borderRadius:12, padding:"11px 14px", border:"1px solid rgba(236,72,153,0.15)", display:"flex", gap:10 }}>
                <span style={{ fontSize:20 }}>{e}</span>
                <div><p style={{ margin:"0 0 2px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>{t}</p><p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.6)" }}>{b}</p></div>
              </div>
            ))}
          </div>
          <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.4)" }}>7 dagen gratis proberen · daarna €7,99/mnd</p>
        </div>
      );
    };

    return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#f0faf0,#e4f7e4)", fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column", padding:"48px 24px 40px", maxWidth:430, margin:"0 auto" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap'); @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
        {renderStep()}
        <div style={{ display:"flex", flexDirection:"column", gap:10, alignItems:"center", marginTop:16, flexShrink:0 }}>
          <div style={{ display:"flex", gap:7 }}>
            {ONBOARD_STEPS.map((_,i) => <div key={i} style={{ width: i===onboardStep ? 24 : 8, height:8, borderRadius:4, background: i===onboardStep ? col : "rgba(30,90,30,0.2)", transition:"all 0.3s" }} />)}
          </div>
          <button onClick={()=>{ if(isLast) setOnboarding(false); else setOnboardStep(p=>p+1); }} style={{ width:"100%", padding:15, borderRadius:14, border:"none", background:`linear-gradient(135deg,${col},#a8e6cf)`, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer" }}>
            {isLast ? "Aan de slag! 🚀" : "Volgende →"}
          </button>
          <div style={{ display:"flex", gap:16 }}>
            {onboardStep > 0 && <button onClick={()=>setOnboardStep(p=>p-1)} style={{ background:"none", border:"none", color:"rgba(30,90,30,0.45)", fontSize:13, cursor:"pointer" }}>← Terug</button>}
            <button onClick={()=>setOnboarding(false)} style={{ background:"none", border:"none", color:"rgba(30,90,30,0.3)", fontSize:12, cursor:"pointer" }}>Overslaan</button>
          </div>
        </div>
      </div>
    );
  }

  if (screen==="splash") return (
    <div style={{ minHeight:"100vh", background:"#f4faf4", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}} @keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
      <div style={{ animation:"pulse 1.5s ease-in-out infinite", fontSize:64, marginBottom:20 }}>🥗</div>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:42, fontWeight:900, margin:0, animation:"fadeUp 0.8s ease forwards", background:"linear-gradient(135deg,#56cfe1,#b8f0b0,#fed6e3)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>VitaalCheck</h1>
      <p style={{ fontFamily:"'DM Sans',sans-serif", color:"rgba(30,90,30,0.55)", marginTop:8, animation:"fadeUp 0.8s 0.3s ease both" }}>Diëten · Allergieën · Zwangerschap</p>
      <div style={{ marginTop:40, width:40, height:40, border:"3px solid rgba(34,139,34,0.15)", borderTop:"3px solid #56cfe1", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f4faf4", fontFamily:"'DM Sans',sans-serif", color:"#1a3a1a", maxWidth:430, margin:"0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes scanline{0%{top:10%}50%{top:85%}100%{top:10%}}
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        input::placeholder{color:rgba(30,90,30,0.4)} input:not([style*="color:#f1f5f9"]){color:#1a3a1a !important} textarea{color:#1a3a1a !important}
        ::-webkit-scrollbar{display:none} button:active{opacity:0.75}
      `}</style>

      {/* HEADER */}
      <div style={{ position:"sticky", top:0, zIndex:50, background:"rgba(244,250,244,0.97)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(34,139,34,0.15)", padding:"12px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:20 }}>🥗</span>
          <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:19, background:"linear-gradient(90deg,#56cfe1,#b8f0b0)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>VitaalCheck</span>
          {isPremium && <span style={{ background:"linear-gradient(135deg,#fbbf24,#f97316)", borderRadius:6, fontSize:10, fontWeight:700, padding:"2px 7px", color:"#1a0a00" }}>PRO</span>}
        </div>
        {!user
          ? <button onClick={()=>setShowLogin(true)} style={{ background:"rgba(34,139,34,0.10)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:"5px 13px", color:"#1a3a1a", fontSize:12, cursor:"pointer" }}>Inloggen</button>
          : <div onClick={()=>setShowLogin(true)} style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#56cfe1,#b8f0b0)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, color:"#f4faf4", cursor:"pointer" }}>{user.name[0].toUpperCase()}</div>
        }
      </div>

      {/* MODE SWITCHER */}
      <div style={{ padding:"14px 16px 0" }}>
        <div style={{ display:"flex", gap:6 }}>
          {MODES.map(m => (
            <button key={m.id} onClick={()=>{ setMode(m.id); setResult(null); }} style={{
              flex:1, padding:"10px 6px", borderRadius:12, border:`1.5px solid ${mode===m.id ? m.color : "rgba(34,139,34,0.11)"}`,
              background: mode===m.id ? `${m.color}18` : "rgba(255,255,255,0.03)",
              color: mode===m.id ? m.color : "rgba(30,90,30,0.55)",
              fontSize:12, cursor:"pointer", fontWeight: mode===m.id ? 700 : 400, transition:"all 0.18s",
              display:"flex", flexDirection:"column", alignItems:"center", gap:3
            }}>
              <span style={{ fontSize:18 }}>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DIET PILLS (only in dieet mode) */}
      {mode==="dieet" && (
        <div style={{ padding:"12px 16px 0" }}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {DIETS.map(diet => {
              const on = selectedDiets.includes(diet.id);
              return <button key={diet.id} onClick={()=>toggleDiet(diet.id)} style={{ padding:"5px 11px", borderRadius:20, border:`1.5px solid ${on?diet.color:"rgba(34,139,34,0.14)"}`, background:on?`${diet.color}20`:"transparent", color:on?diet.color:"rgba(30,90,30,0.5)", fontSize:12, cursor:"pointer", fontWeight:on?600:400, transition:"all 0.18s" }}>{diet.emoji} {diet.label}</button>;
            })}
          </div>
        </div>
      )}

      {/* ALLERGY PILLS (only in allergie mode) */}
      {mode==="allergie" && (
        <div style={{ padding:"12px 16px 0" }}>
          <p style={{ margin:"0 0 8px", fontSize:11, color:"rgba(30,90,30,0.55)", textTransform:"uppercase", letterSpacing:1 }}>Selecteer jouw allergieën</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {ALLERGIES.map(a => {
              const on = selectedAllergies.includes(a.id);
              return <button key={a.id} onClick={()=>toggleAllergy(a.id)} style={{ padding:"5px 11px", borderRadius:20, border:`1.5px solid ${on?a.color:"rgba(34,139,34,0.14)"}`, background:on?`${a.color}20`:"transparent", color:on?a.color:"rgba(30,90,30,0.5)", fontSize:12, cursor:"pointer", fontWeight:on?600:400, transition:"all 0.18s" }}>{a.emoji} {a.label}</button>;
            })}
          </div>
        </div>
      )}

      {/* PREGNANT INFO (in zwanger mode) */}
      {mode==="zwanger" && (
        <div style={{ padding:"12px 16px 0" }}>
          <div style={{ background:"rgba(236,72,153,0.08)", border:"1px solid rgba(236,72,153,0.2)", borderRadius:12, padding:"10px 14px", display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:22 }}>🤰</span>
            <div>
              <p style={{ margin:"0 0 2px", fontSize:13, fontWeight:600, color:"#ec4899" }}>Zwangerschapsmodus</p>
              <p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.6)" }}>Gebaseerd op richtlijnen van het Voedingscentrum</p>
            </div>
          </div>
        </div>
      )}

      {/* TABS */}
      <div style={{ display:"flex", margin:"12px 16px 0", background:"rgba(34,139,34,0.06)", borderRadius:12, padding:3, gap:2 }}>
        {[{id:"checker",label:"🔍 Check"},{id:"scanner",label:"📷 Scan"},{id:"recepten",label:"🍳 Recepten"},{id:"weekmenu",label:"📅 Menu"},{id:"profiel",label:"👤 Profiel"},{id:"supplementen",label:"💊 Suppls"}].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:"8px 0", border:"none", borderRadius:9, cursor:"pointer", background:tab===t.id?"rgba(34,139,34,0.13)":"transparent", color:tab===t.id?"#fff":"rgba(30,90,30,0.45)", fontSize:11, fontWeight:tab===t.id?600:400, transition:"all 0.18s" }}>{t.label}</button>
        ))}
      </div>

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div style={{ margin:"10px 16px 0", background:"linear-gradient(135deg,rgba(45,158,107,0.12),rgba(168,230,207,0.1))", border:"1px solid rgba(45,158,107,0.3)", borderRadius:14, padding:"10px 14px", display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:22, flexShrink:0 }}>📲</span>
          <div style={{ flex:1 }}>
            <p style={{ margin:"0 0 1px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>Voeg toe aan je thuisscherm</p>
            <p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.55)" }}>Gebruik VitaalCheck als app op je telefoon</p>
          </div>
          <div style={{ display:"flex", gap:6, flexShrink:0 }}>
            <button onClick={installApp} style={{ padding:"6px 12px", borderRadius:8, border:"none", background:"#2d9e6b", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>Installeer</button>
            <button onClick={()=>setShowInstallBanner(false)} style={{ padding:"6px 8px", borderRadius:8, border:"none", background:"transparent", color:"rgba(30,90,30,0.4)", fontSize:14, cursor:"pointer" }}>✕</button>
          </div>
        </div>
      )}

      {/* Daily tip banner */}
      {showTip && tab==="checker" && (
        <div style={{ margin:"10px 16px 0", background:"linear-gradient(135deg,rgba(45,158,107,0.1),rgba(168,230,207,0.12))", border:"1px solid rgba(45,158,107,0.25)", borderRadius:14, padding:"10px 14px", display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:22, flexShrink:0 }}>{DAILY_TIPS[tipIndex].emoji}</span>
          <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.7)", lineHeight:1.5, flex:1 }}><strong style={{ color:"#2d9e6b" }}>Tip van Amanda:</strong> {DAILY_TIPS[tipIndex].tip}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <button onClick={()=>setTipIndex(p=>(p+1)%DAILY_TIPS.length)} style={{ background:"none", border:"none", color:"#2d9e6b", cursor:"pointer", fontSize:14, padding:0 }}>→</button>
            <button onClick={()=>setShowTip(false)} style={{ background:"none", border:"none", color:"rgba(30,90,30,0.3)", cursor:"pointer", fontSize:12, padding:0 }}>✕</button>
          </div>
        </div>
      )}

      <div style={{ padding:"14px 16px 40px", animation:"fadeUp 0.3s ease" }}>

        {/* ═══ CHECKER TAB ═══ */}
        {tab==="checker" && (
          <div>
            <div style={{ position:"relative", marginBottom:10 }}>
              <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyze(searchQuery)}
                placeholder={mode==="zwanger" ? "Zoek product voor zwangerschap..." : mode==="allergie" ? "Zoek product voor allergie check..." : "Zoek een product..."}
                style={{ width:"100%", padding:"13px 48px 13px 16px", borderRadius:14, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(34,139,34,0.09)", fontSize:15, outline:"none" }} />
              <button onClick={()=>analyze(searchQuery)} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"linear-gradient(135deg,#56cfe1,#b8f0b0)", border:"none", borderRadius:9, width:34, height:34, fontSize:16, color:"#f4faf4", fontWeight:700, cursor:"pointer" }}>→</button>
            </div>

            {suggestions.length>0 && (
              <div style={{ background:"rgba(235,248,235,0.99)", borderRadius:12, marginBottom:10, overflow:"hidden", border:"1px solid rgba(255,255,255,0.08)" }}>
                {suggestions.map(s => <div key={s} onClick={()=>{setSearchQuery(s);analyze(s);setSuggestions([]);}} style={{ padding:"10px 16px", cursor:"pointer", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:14 }}>🔍 {s}</div>)}
              </div>
            )}

            {/* Category grid */}
            {!catView && !result && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                {Object.keys(CATEGORIES).map(cat => (
                  <button key={cat} onClick={()=>setCatView(cat)} style={{ padding:"13px 10px", borderRadius:13, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(34,139,34,0.06)", color:"#1a3a1a", fontSize:13, cursor:"pointer", textAlign:"left", fontWeight:500 }}>{cat}</button>
                ))}
              </div>
            )}
            {catView && !result && (
              <div>
                <button onClick={()=>setCatView(null)} style={{ background:"none", border:"none", color:"#2d9e6b", cursor:"pointer", fontSize:13, marginBottom:10, padding:0 }}>← Terug</button>
                <p style={{ margin:"0 0 10px", fontSize:13, color:"rgba(30,90,30,0.55)" }}>{catView}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                  {CATEGORIES[catView].map(p => <button key={p} onClick={()=>{setCatView(null);analyze(p);}} style={{ padding:"7px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.12)", background:"rgba(34,139,34,0.08)", color:"#1a3a1a", fontSize:13, cursor:"pointer" }}>{p}</button>)}
                </div>
              </div>
            )}

            {/* ─── RESULT ─── */}
            {result && (
              <div style={{ animation:"fadeUp 0.25s ease" }}>
                <button onClick={()=>{setResult(null);setCatView(null);}} style={{ background:"none", border:"none", color:"#2d9e6b", cursor:"pointer", fontSize:13, marginBottom:10, padding:0 }}>← Terug</button>

                {result.error
                  ? <div>
                      <div style={{ background:"rgba(249,115,22,0.1)", border:"1px solid rgba(249,115,22,0.25)", borderRadius:13, padding:14, color:"#fb923c", fontSize:13, marginBottom:10 }}>⚠️ {result.error}</div>
                      <button onClick={()=>{ setRequestProductName(searchQuery); setShowRequestProduct(true); }} style={{ width:"100%", padding:12, borderRadius:12, border:"1px solid rgba(45,158,107,0.25)", background:"rgba(45,158,107,0.07)", color:"#2d9e6b", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                        📩 Product aanvragen bij Amanda
                      </button>
                    </div>
                  : <>
                      {/* Product card */}
                      <div style={{ background:"rgba(34,139,34,0.08)", borderRadius:16, padding:16, marginBottom:12, border:"1px solid rgba(255,255,255,0.07)" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                          <h2 style={{ margin:"0 0 4px", fontSize:22, fontFamily:"'Playfair Display',serif" }}>{result.product}</h2>
                          <span style={{ background:"rgba(34,139,34,0.11)", borderRadius:8, padding:"3px 10px", fontSize:12, color:"rgba(30,90,30,0.65)" }}>{result.cal} kcal</span>
                        </div>
                        <p style={{ margin:0, color:"rgba(30,90,30,0.6)", fontSize:13 }}>{result.info}</p>
                      </div>

                      {/* Pesticide info */}
                      {result.product && DB[result.product]?.pest && (
                        <div style={{ background: DB[result.product].pest.level==="hoog" ? "rgba(239,68,68,0.07)" : DB[result.product].pest.level==="laag" ? "rgba(34,197,94,0.07)" : "rgba(251,191,36,0.07)", borderRadius:13, padding:"11px 14px", marginBottom:10, border:`1px solid ${DB[result.product].pest.level==="hoog"?"rgba(239,68,68,0.2)":DB[result.product].pest.level==="laag"?"rgba(34,197,94,0.2)":"rgba(251,191,36,0.2)"}` }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                            <span style={{ fontSize:16 }}>🌿</span>
                            <span style={{ fontSize:12, fontWeight:700, color:"#1a3a1a" }}>Pesticiden</span>
                            <span style={{ fontSize:11, background: DB[result.product].pest.level==="hoog"?"rgba(239,68,68,0.12)":DB[result.product].pest.level==="laag"?"rgba(34,197,94,0.12)":"rgba(251,191,36,0.12)", color: DB[result.product].pest.level==="hoog"?"#ef4444":DB[result.product].pest.level==="laag"?"#22c55e":"#d97706", borderRadius:8, padding:"2px 8px", border:`1px solid ${DB[result.product].pest.level==="hoog"?"rgba(239,68,68,0.25)":DB[result.product].pest.level==="laag"?"rgba(34,197,94,0.25)":"rgba(251,191,36,0.25)"}` }}>{DB[result.product].pest.badge}</span>
                          </div>
                          <p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.65)", lineHeight:1.5 }}>{DB[result.product].pest.tip}</p>
                          <p style={{ margin:"5px 0 0", fontSize:10, color:"rgba(30,90,30,0.4)" }}>Bron: EWG Dirty Dozen & Clean Fifteen 2026 · PAN Nederland</p>
                        </div>
                      )}

                      {/* Share + Favorite buttons */}
                      {!result.error && (
                        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                          <button onClick={()=>handleShare(result.product, result)} style={{ flex:1, padding:"9px 14px", borderRadius:12, border:"1px solid rgba(45,158,107,0.25)", background:"rgba(45,158,107,0.06)", color:"#2d9e6b", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5, fontWeight:600 }}>
                            📤 Delen
                          </button>
                          <button onClick={()=>{ if(!hasStarter){setShowPaywall(true);return;} toggleFavorite(result.product); }} style={{ flex:1, padding:"9px 14px", borderRadius:12, border:`1px solid ${favorites.includes(result.product) ? "rgba(236,72,153,0.4)" : "rgba(45,158,107,0.25)"}`, background: favorites.includes(result.product) ? "rgba(236,72,153,0.1)" : "rgba(45,158,107,0.06)", color: favorites.includes(result.product) ? "#ec4899" : "#2d9e6b", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5, fontWeight:600 }}>
                            {favorites.includes(result.product) ? "❤️ Opgeslagen" : "🤍 Opslaan"}
                          </button>
                        </div>
                      )}

                      {/* DIEET results */}
                      {mode==="dieet" && result.dieten && (
                        <>
                          <div style={{ background:"rgba(34,139,34,0.06)", borderRadius:13, padding:"10px 14px", marginBottom:10, display:"flex", alignItems:"center", gap:10 }}>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:11, color:"rgba(30,90,30,0.55)", marginBottom:5 }}>Geschiktheid</div>
                              <div style={{ display:"flex", gap:3 }}>
                                {selectedDiets.map(id => <div key={id} style={{ flex:1, height:6, borderRadius:3, background:result.dieten[id]?.toegestaan?dc(id):"rgba(34,139,34,0.14)" }} />)}
                              </div>
                            </div>
                            <div style={{ fontSize:22, fontWeight:700, color: Object.values(result.dieten).filter(d=>d.toegestaan).length===selectedDiets.length?"#22c55e":Object.values(result.dieten).filter(d=>d.toegestaan).length===0?"#f43f5e":"#fbbf24" }}>
                              {Object.values(result.dieten).filter(d=>d.toegestaan).length}/{selectedDiets.length}
                            </div>
                          </div>
                          {selectedDiets.map(dietId => {
                            const diet=DIETS.find(d=>d.id===dietId), info=result.dieten[dietId];
                            if (!info) return null;
                            return (
                              <div key={dietId} style={{ background:info.toegestaan?"rgba(34,197,94,0.07)":"rgba(244,63,94,0.07)", border:`1px solid ${info.toegestaan?"rgba(34,197,94,0.2)":"rgba(244,63,94,0.2)"}`, borderRadius:13, padding:"11px 14px", marginBottom:8, display:"flex", gap:12, alignItems:"flex-start" }}>
                                <div style={{ fontSize:20 }}>{info.toegestaan?"✅":"❌"}</div>
                                <div>
                                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                                    <span style={{ color:diet.color, fontWeight:600, fontSize:13 }}>{diet.emoji} {diet.label}</span>
                                    <span style={{ fontSize:10, padding:"2px 7px", borderRadius:8, background:info.toegestaan?"rgba(34,197,94,0.15)":"rgba(244,63,94,0.15)", color:info.toegestaan?"#4ade80":"#fb7185" }}>{info.toegestaan?"Toegestaan":"Niet toegestaan"}</span>
                                  </div>
                                  <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.6)" }}>{info.reden}</p>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}

                      {/* ALLERGIE results */}
                      {mode==="allergie" && result.allergies && (
                        <>
                          {selectedAllergies.length===0 && <p style={{ color:"rgba(30,90,30,0.55)", fontSize:13 }}>Selecteer eerst allergieën bovenaan.</p>}
                          {selectedAllergies.map(aId => {
                            const allergy=ALLERGIES.find(a=>a.id===aId), info=result.allergies[aId];
                            if (!info) return null;
                            return (
                              <div key={aId} style={{ background:info.veilig?"rgba(34,197,94,0.07)":"rgba(239,68,68,0.07)", border:`1px solid ${info.veilig?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)"}`, borderRadius:13, padding:"11px 14px", marginBottom:8, display:"flex", gap:12, alignItems:"flex-start" }}>
                                <div style={{ fontSize:20 }}>{info.veilig?"✅":"⚠️"}</div>
                                <div>
                                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                                    <span style={{ color:allergy.color, fontWeight:600, fontSize:13 }}>{allergy.emoji} {allergy.label}</span>
                                    <span style={{ fontSize:10, padding:"2px 7px", borderRadius:8, background:info.veilig?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)", color:info.veilig?"#4ade80":"#fca5a5" }}>{info.veilig?"Geen allergie risico":"Bevat allergeen"}</span>
                                  </div>
                                  <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.6)" }}>{info.reden}</p>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}

                      {/* ZWANGER result */}
                      {mode==="zwanger" && result.zwanger && (
                        <div style={{ background:zwStatusBg(result.zwanger.status), border:`1px solid ${zwStatusBorder(result.zwanger.status)}`, borderRadius:16, padding:18 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                            <div style={{ fontSize:36 }}>🤰</div>
                            <div>
                              <div style={{ fontSize:11, color:"rgba(30,90,30,0.55)", marginBottom:3 }}>Tijdens zwangerschap</div>
                              <div style={{ fontSize:20, fontWeight:700, color:zwStatusColor(result.zwanger.status) }}>{zwStatusLabel(result.zwanger.status)}</div>
                            </div>
                          </div>
                          <p style={{ margin:0, fontSize:13, color:"rgba(30,90,30,0.78)", lineHeight:1.6 }}>{result.zwanger.reden}</p>
                          <p style={{ margin:"12px 0 0", fontSize:11, color:"rgba(30,90,30,0.45)" }}>⚕️ Raadpleeg altijd je verloskundige of arts voor persoonlijk advies.</p>
                        </div>
                      )}
                    </>
                }
              </div>
            )}

            {/* Recent history */}
            {!result && history.length>0 && !catView && (
              <div style={{ marginTop:6 }}>
                <p style={{ margin:"0 0 8px", fontSize:11, color:"rgba(30,90,30,0.45)", textTransform:"uppercase", letterSpacing:1 }}>Recent</p>
                <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                  {history.slice(0,6).map((h,i) => <button key={i} onClick={()=>{setResult(h.result);setMode(h.mode);}} style={{ padding:"6px 12px", borderRadius:20, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(34,139,34,0.06)", color:"rgba(30,90,30,0.75)", fontSize:12, cursor:"pointer" }}>{h.product}</button>)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ SCANNER TAB ═══ */}
        {tab==="scanner" && (
          <div>
            {/* Open Food Facts — hoofdfunctie */}
            <div style={{ background:"linear-gradient(135deg,rgba(45,158,107,0.1),rgba(168,230,207,0.1))", borderRadius:18, padding:20, marginBottom:14, border:"1px solid rgba(45,158,107,0.25)" }}>
              <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:14 }}>
                <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,#2d9e6b,#a8e6cf)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🌍</div>
                <div>
                  <p style={{ margin:"0 0 2px", fontSize:15, fontWeight:700, color:"#1a3a1a" }}>Open Food Facts</p>
                  <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.55)" }}>Zoek miljoenen echte supermarktproducten</p>
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <input
                  value={barcodeQuery}
                  onChange={e=>setBarcodeQuery(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&searchOpenFoodFacts(barcodeQuery)}
                  placeholder="Bijv. Alpro Haverdrank, Gouda kaas..."
                  style={{ flex:1, padding:"12px 14px", borderRadius:12, border:"1px solid rgba(45,158,107,0.3)", background:"rgba(255,255,255,0.9)", fontSize:14, outline:"none", color:"#1a3a1a" }}
                />
                <button
                  onClick={()=>searchOpenFoodFacts(barcodeQuery)}
                  disabled={barcodeLoading}
                  style={{ padding:"12px 18px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#2d9e6b,#a8e6cf)", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", flexShrink:0, minWidth:70 }}>
                  {barcodeLoading ? "⏳" : "Zoek 🔍"}
                </button>
              </div>
              <p style={{ margin:"10px 0 0", fontSize:11, color:"rgba(30,90,30,0.4)", textAlign:"center" }}>
                Powered by <strong>Open Food Facts</strong> — open database met 3+ miljoen producten
              </p>
            </div>

            {/* Populaire zoektermen */}
            <p style={{ margin:"0 0 8px", fontSize:11, color:"rgba(30,90,30,0.5)", textTransform:"uppercase", letterSpacing:1 }}>Populaire zoekopdrachten</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:18 }}>
              {["Alpro", "Oatly", "Activia yoghurt", "Quaker havermout", "Lay's chips", "AH volkoren"].map(term => (
                <button key={term} onClick={()=>{ setBarcodeQuery(term); searchOpenFoodFacts(term); }}
                  style={{ padding:"6px 13px", borderRadius:20, border:"1px solid rgba(45,158,107,0.25)", background:"rgba(45,158,107,0.07)", color:"#2d9e6b", fontSize:12, cursor:"pointer" }}>
                  {term}
                </button>
              ))}
            </div>

            {/* Barcode scanner uitleg */}
            <div style={{ background:"rgba(34,139,34,0.05)", borderRadius:14, padding:16, border:"1px solid rgba(34,139,34,0.14)" }}>
              <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:28 }}>📷</span>
                <div>
                  <p style={{ margin:"0 0 4px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>Barcode scannen</p>
                  <p style={{ margin:"0 0 10px", fontSize:12, color:"rgba(30,90,30,0.55)", lineHeight:1.6 }}>
                    Echte barcode-scanning werkt in de native iOS/Android app. Typ hieronder het barcodenummer om toch te zoeken via Open Food Facts.
                  </p>
                  <div style={{ display:"flex", gap:8 }}>
                    <input
                      placeholder="Barcodenummer (bijv. 8710400399193)"
                      value={barcodeQuery}
                      onChange={e=>setBarcodeQuery(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&searchOpenFoodFacts(barcodeQuery)}
                      style={{ flex:1, padding:"9px 12px", borderRadius:10, border:"1px solid rgba(45,158,107,0.25)", background:"rgba(255,255,255,0.7)", fontSize:12, outline:"none", color:"#1a3a1a" }}
                    />
                    <button onClick={()=>searchOpenFoodFacts(barcodeQuery)} style={{ padding:"9px 14px", borderRadius:10, border:"none", background:"#2d9e6b", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>→</button>
                  </div>
                </div>
              </div>
            </div>

            {barcodeLoading && (
              <div style={{ textAlign:"center", padding:"24px 0" }}>
                <div style={{ width:32, height:32, border:"3px solid rgba(34,139,34,0.15)", borderTop:"3px solid #2d9e6b", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 10px" }} />
                <p style={{ color:"rgba(30,90,30,0.5)", fontSize:13 }}>Zoeken in Open Food Facts...</p>
              </div>
            )}
          </div>
        )}

        {/* ═══ RECEPTEN TAB ═══ */}
        {tab==="recepten" && (
          <div>
            <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
              {["keto","vegan","mediterraan","paleo","caloriearm","punten","fodmap","antiinfl","dash","glutenvrij","lactosevrij","suikervrij"].map(d => {
                const diet=DIETS.find(x=>x.id===d);
                return <button key={d} onClick={()=>setMenuDiet(d)} style={{ padding:"5px 12px", borderRadius:20, border:`1.5px solid ${menuDiet===d?diet.color:"rgba(34,139,34,0.14)"}`, background:menuDiet===d?`${diet.color}20`:"transparent", color:menuDiet===d?diet.color:"rgba(30,90,30,0.5)", fontSize:11, cursor:"pointer", fontWeight:menuDiet===d?600:400 }}>{diet.emoji} {diet.label}</button>;
              })}
            </div>
            {(RECIPES[menuDiet]||[]).map((rec,i) => (
              <div key={i} style={{ background:"rgba(34,139,34,0.06)", borderRadius:16, padding:16, marginBottom:10, border:"1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                  <h3 style={{ margin:0, fontSize:16, fontFamily:"'Playfair Display',serif" }}>{rec.name}</h3>
                  <span style={{ fontSize:11, color:"rgba(30,90,30,0.55)" }}>⏱ {rec.time}</span>
                </div>
                <p style={{ margin:"0 0 10px", fontSize:12, color:"rgba(30,90,30,0.6)" }}>{rec.desc}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
                  {rec.ingredients.map(ing => <span key={ing} style={{ background:"rgba(34,139,34,0.10)", borderRadius:8, padding:"3px 9px", fontSize:11, color:"rgba(30,90,30,0.7)" }}>{ing}</span>)}
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:11, color:"rgba(30,90,30,0.5)" }}>🔥 {rec.cal} kcal</span>
                  {!hasStarter && <button onClick={()=>setShowPaywall(true)} style={{ marginLeft:"auto", fontSize:11, background:"rgba(251,191,36,0.1)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:8, padding:"3px 10px", color:"#fbbf24", cursor:"pointer" }}>🔒 Volledig recept (Starter)</button>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ WEEKMENU TAB ═══ */}
        {tab==="weekmenu" && (
          <div>
            {!hasStarter && <div onClick={()=>setShowPaywall(true)} style={{ background:"linear-gradient(135deg,rgba(251,191,36,0.1),rgba(249,115,22,0.1))", border:"1px solid rgba(251,191,36,0.2)", borderRadius:14, padding:14, marginBottom:14, cursor:"pointer", textAlign:"center" }}>
              <p style={{ margin:"0 0 4px", color:"#fbbf24", fontWeight:600, fontSize:14 }}>🔒 Pro functie</p>
              <p style={{ margin:0, color:"rgba(30,90,30,0.65)", fontSize:12 }}>Ontgrendel weekmenu planner voor €7,99/maand</p>
            </div>}
            <div style={{ opacity:hasStarter?1:0.4, pointerEvents:hasStarter?"auto":"none" }}>
              {/* IF Toggle */}
              <div style={{ background:"rgba(34,139,34,0.06)", borderRadius:14, padding:"12px 14px", marginBottom:14, border:"1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: ifMode ? 12 : 0 }}>
                  <div>
                    <p style={{ margin:"0 0 2px", fontSize:13, fontWeight:600 }}>⏱ Intermittent Fasting</p>
                    <p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.55)" }}>Voeg een vastenperiode toe aan je schema</p>
                  </div>
                  <div onClick={()=>setIfMode(p=>!p)} style={{ width:44, height:24, borderRadius:12, background:ifMode?"#2d9e6b":"rgba(34,139,34,0.18)", cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:3, left:ifMode?23:3, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"left 0.2s" }} />
                  </div>
                </div>
                {ifMode && (
                  <div>
                    <p style={{ margin:"0 0 8px", fontSize:11, color:"rgba(30,90,30,0.55)" }}>Kies je IF-schema:</p>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                      {[
                        { id:"16_8",  label:"16:8",  desc:"16u vasten, 8u eten",     window:"12:00 – 20:00" },
                        { id:"18_6",  label:"18:6",  desc:"18u vasten, 6u eten",     window:"13:00 – 19:00" },
                        { id:"20_4",  label:"20:4",  desc:"20u vasten, 4u eten",     window:"14:00 – 18:00" },
                        { id:"5_2",   label:"5:2",   desc:"5 normaal, 2 beperkt",    window:"Ma & Do beperkt" },
                      ].map(schema => (
                        <div key={schema.id} onClick={()=>setIfSchema(schema.id)} style={{ background:ifSchema===schema.id?"rgba(45,158,107,0.14)":"rgba(34,139,34,0.06)", border:`1px solid ${ifSchema===schema.id?"rgba(45,158,107,0.4)":"rgba(34,139,34,0.11)"}`, borderRadius:10, padding:"10px 12px", cursor:"pointer" }}>
                          <p style={{ margin:"0 0 2px", fontWeight:700, fontSize:15, color:ifSchema===schema.id?"#2d9e6b":"#fff" }}>{schema.label}</p>
                          <p style={{ margin:"0 0 3px", fontSize:11, color:"rgba(30,90,30,0.6)" }}>{schema.desc}</p>
                          <p style={{ margin:0, fontSize:10, color:ifSchema===schema.id?"#2d9e6b":"rgba(30,90,30,0.45)" }}>🕐 {schema.window}</p>
                        </div>
                      ))}
                    </div>
                    {ifSchema && (
                      <div style={{ marginTop:10, background:"rgba(45,158,107,0.08)", borderRadius:10, padding:"9px 12px", border:"1px solid rgba(86,207,225,0.15)" }}>
                        <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.65)" }}>
                          💡 <strong style={{ color:"#2d9e6b" }}>Tip:</strong> Sla je maaltijden in je eetvenster in. Koffie en water zijn toegestaan tijdens het vasten.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Diet filter for menu */}
              <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
                {["keto","vegan","mediterraan","paleo","caloriearm","punten","fodmap","antiinfl","dash","glutenvrij","lactosevrij","suikervrij"].map(d => {
                  const diet=DIETS.find(x=>x.id===d); if(!diet) return null;
                  return <button key={d} onClick={()=>setMenuDiet(d)} style={{ padding:"4px 10px", borderRadius:16, border:`1.5px solid ${menuDiet===d?diet.color:"rgba(34,139,34,0.14)"}`, background:menuDiet===d?`${diet.color}18`:"transparent", color:menuDiet===d?diet.color:"rgba(30,90,30,0.5)", fontSize:11, cursor:"pointer", fontWeight:menuDiet===d?600:400 }}>{diet.emoji} {diet.label}</button>;
                })}
              </div>

              {WEEKDAYS.map(day => {
                const isFastDay = ifMode && ifSchema==="5_2" && (day==="Ma"||day==="Do");
                const meals = ifMode && ifSchema!=="5_2" ? ["Lunch","Diner"] : MEALS;
                return (
                  <div key={day} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <p style={{ margin:0, fontSize:12, fontWeight:600, color:"rgba(30,90,30,0.65)", textTransform:"uppercase", letterSpacing:1 }}>{day}</p>
                      {ifMode && isFastDay && <span style={{ fontSize:10, background:"rgba(239,68,68,0.15)", color:"#fca5a5", borderRadius:6, padding:"1px 7px", border:"1px solid rgba(239,68,68,0.2)" }}>🚫 Vastdag (~500 kcal)</span>}
                      {ifMode && !isFastDay && ifSchema!=="5_2" && <span style={{ fontSize:10, background:"rgba(45,158,107,0.12)", color:"#2d9e6b", borderRadius:6, padding:"1px 7px", border:"1px solid rgba(86,207,225,0.15)" }}>⏱ Eetvenster</span>}
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns: meals.length===2 ? "1fr 1fr" : "1fr 1fr 1fr", gap:5 }}>
                      {meals.map(meal => {
                        const key=`${day}-${meal}`, item=weekMenu[key];
                        return (
                          <div key={meal} style={{ position:"relative" }}>
                            <div onClick={()=>{ setMealPicker({day,meal}); setMealPickerTab("recept"); setMealUrl(""); setCustomMealItems([]); setMealProductSearch(""); setMealProductResults([]); }} style={{ background:item?"rgba(45,158,107,0.12)":"rgba(34,139,34,0.06)", border:`1px solid ${item?"rgba(45,158,107,0.22)":"rgba(34,139,34,0.10)"}`, borderRadius:10, padding:"9px 8px", cursor:"pointer", minHeight:52 }}>
                              <p style={{ margin:"0 0 2px", fontSize:9, color:"rgba(30,90,30,0.5)", textTransform:"uppercase" }}>{meal}</p>
                              <p style={{ margin:0, fontSize:11, color:item?"#2d9e6b":"rgba(30,90,30,0.35)", lineHeight:1.4 }}>{item ? item.name : "+ Voeg toe"}</p>
                              {item?.fromUrl && <p style={{ margin:"2px 0 0", fontSize:9, color:"rgba(30,90,30,0.4)" }}>🔗 url</p>}
                              {item?.fromCustom && <p style={{ margin:"2px 0 0", fontSize:9, color:"rgba(30,90,30,0.4)" }}>🥘 eigen</p>}
                            </div>
                            {item && <button onClick={e=>{ e.stopPropagation(); const k=`${day}-${meal}`; setWeekMenu(p=>{ const n={...p}; delete n[k]; return n; }); }} style={{ position:"absolute", top:4, right:4, background:"rgba(239,68,68,0.12)", border:"none", borderRadius:6, width:18, height:18, fontSize:10, cursor:"pointer", color:"#ef4444", display:"flex", alignItems:"center", justifyContent:"center", padding:0 }}>✕</button>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ SUPPLEMENTEN TAB ═══ */}
        {tab==="supplementen" && (
          <div style={{ animation:"fadeUp 0.3s ease" }}>

            {/* Header */}
            <div style={{ background:"linear-gradient(135deg,rgba(192,132,252,0.1),rgba(168,230,207,0.08))", borderRadius:16, padding:18, marginBottom:14, border:"1px solid rgba(192,132,252,0.2)", textAlign:"center" }}>
              <div style={{ fontSize:36, marginBottom:6 }}>💊</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 4px", fontSize:20, color:"#1a3a1a" }}>Supplementenadvies</h2>
              <p style={{ margin:0, fontSize:13, color:"rgba(30,90,30,0.6)", lineHeight:1.5 }}>Op basis van jouw dieet, doelen en situatie. Samengesteld door Amanda, orthomoleculair therapeut.</p>
            </div>

            {/* Tabs */}
            <div style={{ display:"flex", background:"rgba(34,139,34,0.06)", borderRadius:12, padding:3, marginBottom:14, gap:2 }}>
              {[["advies","🎯 Mijn advies"],["alle","💊 Alle suppls"],["vraag","💬 Vraag aan Amanda"]].map(([id,label]) => (
                <button key={id} onClick={()=>setSuppTab(id)} style={{ flex:1, padding:"8px 4px", border:"none", borderRadius:9, cursor:"pointer", background:suppTab===id?"rgba(192,132,252,0.2)":"transparent", color:suppTab===id?"#c084fc":"rgba(30,90,30,0.5)", fontSize:11, fontWeight:suppTab===id?700:400, transition:"all 0.15s" }}>{label}</button>
              ))}
            </div>

            {/* TAB: Persoonlijk advies */}
            {suppTab==="advies" && (
              <div>
                <p style={{ margin:"0 0 12px", fontSize:12, color:"rgba(30,90,30,0.55)" }}>
                  Gebaseerd op jouw geselecteerde diëten: <strong style={{ color:"#2d9e6b" }}>{selectedDiets.map(id=>DIETS.find(d=>d.id===id)?.label).join(", ") || "Geen dieet geselecteerd"}</strong>
                  {mode==="zwanger" ? " · 🤰 Zwanger" : ""}
                </p>

                {/* Filter */}
                <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
                  {[["alles","Alles"],["zwanger","🤰 Zwanger"],["slaap","😴 Slaap"],["energie","⚡ Energie"],["stress","🧘 Stress"],["sport","🏃 Sport"]].map(([id,label]) => (
                    <button key={id} onClick={()=>setSuppFilter(id)} style={{ padding:"5px 12px", borderRadius:16, border:`1.5px solid ${suppFilter===id?"#c084fc":"rgba(34,139,34,0.2)"}`, background:suppFilter===id?"rgba(192,132,252,0.12)":"transparent", color:suppFilter===id?"#c084fc":"rgba(30,90,30,0.5)", fontSize:11, cursor:"pointer", fontWeight:suppFilter===id?700:400 }}>{label}</button>
                  ))}
                </div>

                {SUPPLEMENTS.filter(s => {
                  if (suppFilter==="zwanger") return s.geschiktVoor.zwanger && mode==="zwanger";
                  if (suppFilter==="slaap") return s.geschiktVoor.doelen.includes("slaap");
                  if (suppFilter==="energie") return ["vitd","vitb12","vitb_complex","vitc","ijzer"].includes(s.id);
                  if (suppFilter==="stress") return s.geschiktVoor.doelen.includes("ontspanning");
                  if (suppFilter==="sport") return s.geschiktVoor.doelen.includes("beweging");
                  // "alles": show relevant to selected diets or zwanger
                  if (mode==="zwanger" && s.geschiktVoor.zwanger) return true;
                  return selectedDiets.some(d => s.geschiktVoor.dieten.includes(d)) || s.geschiktVoor.doelen.some(d => goals.map(g=>g.type).includes(d));
                }).map((supp,i) => (
                  <div key={i} style={{ background:"rgba(34,139,34,0.05)", borderRadius:14, padding:14, marginBottom:10, border:"1px solid rgba(34,139,34,0.12)", cursor:"pointer" }} onClick={()=>setShowSuppDetail(supp.id)}>
                    <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                      <div style={{ width:42, height:42, borderRadius:12, background:`${supp.color}18`, border:`1px solid ${supp.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{supp.emoji}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                          <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#1a3a1a" }}>{supp.name}</p>
                          {supp.geschiktVoor.zwanger && mode==="zwanger" && <span style={{ fontSize:10, background:"rgba(236,72,153,0.12)", color:"#ec4899", borderRadius:8, padding:"2px 8px", border:"1px solid rgba(236,72,153,0.2)" }}>🤰 Zwanger</span>}
                        </div>
                        <p style={{ margin:"0 0 8px", fontSize:12, color:"rgba(30,90,30,0.6)", lineHeight:1.5 }}>{supp.beschrijving}</p>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                          {supp.geschiktVoor.dieten.filter(d=>selectedDiets.includes(d)).map(d => {
                            const diet=DIETS.find(x=>x.id===d);
                            return diet ? <span key={d} style={{ fontSize:10, background:`${diet.color}15`, color:diet.color, borderRadius:8, padding:"2px 7px", border:`1px solid ${diet.color}30` }}>{diet.emoji} {diet.label}</span> : null;
                          })}
                          {supp.geschiktVoor.doelen.filter(d=>goals.map(g=>g.type).includes(d)).map(d => {
                            const gt=GOAL_TYPES.find(x=>x.id===d);
                            return gt ? <span key={d} style={{ fontSize:10, background:`${gt.color}15`, color:gt.color, borderRadius:8, padding:"2px 7px", border:`1px solid ${gt.color}30` }}>{gt.emoji} {gt.label}</span> : null;
                          })}
                        </div>
                        <p style={{ margin:"8px 0 0", fontSize:11, color:"rgba(30,90,30,0.4)" }}>Tik voor dosering & tips →</p>
                      </div>
                    </div>
                  </div>
                ))}

                {selectedDiets.length===0 && mode!=="zwanger" && (
                  <div style={{ textAlign:"center", padding:"20px 0", color:"rgba(30,90,30,0.4)" }}>
                    <p style={{ fontSize:14 }}>Selecteer eerst een dieet bovenaan voor persoonlijk advies.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Alle supplementen */}
            {suppTab==="alle" && (
              <div>
                {SUPPLEMENTS.map((supp,i) => (
                  <div key={i} onClick={()=>setShowSuppDetail(supp.id)} style={{ background:"rgba(34,139,34,0.05)", borderRadius:14, padding:"12px 14px", marginBottom:8, border:"1px solid rgba(34,139,34,0.12)", cursor:"pointer", display:"flex", gap:12, alignItems:"center" }}>
                    <div style={{ width:40, height:40, borderRadius:11, background:`${supp.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{supp.emoji}</div>
                    <div style={{ flex:1 }}>
                      <p style={{ margin:"0 0 2px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>{supp.name}</p>
                      <p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.5)", lineHeight:1.4 }}>{supp.beschrijving.slice(0,70)}...</p>
                    </div>
                    <span style={{ color:"rgba(30,90,30,0.35)", fontSize:16 }}>›</span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: Vraag aan Amanda */}
            {suppTab==="vraag" && (
              <div>
                <div style={{ background:"rgba(192,132,252,0.07)", borderRadius:14, padding:16, marginBottom:14, border:"1px solid rgba(192,132,252,0.18)" }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                    <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#2d9e6b,#a8e6cf)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🌿</div>
                    <div>
                      <p style={{ margin:"0 0 1px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>Amanda — Orthomoleculair Therapeut</p>
                      <p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.5)" }}>Stel een vraag over supplementen en leefstijl</p>
                    </div>
                  </div>
                  <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.6)", lineHeight:1.6 }}>
                    Heb je een vraag over welk supplement past bij jouw situatie, hoe je supplementen combineert, of wat de beste keuze is voor jouw dieet of zwangerschap? Stel het gerust!
                  </p>
                </div>

                {!isPremium ? (
                  <div style={{ textAlign:"center", padding:"10px 0" }}>
                    <p style={{ margin:"0 0 14px", fontSize:13, color:"rgba(30,90,30,0.6)" }}>🔒 Persoonlijk supplementadvies is beschikbaar voor Pro-leden.</p>
                    <button onClick={()=>setShowPaywall(true)} style={{ padding:"11px 24px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#fbbf24,#f97316)", color:"#1a0a00", fontSize:13, fontWeight:700, cursor:"pointer" }}>Upgrade naar Pro</button>
                  </div>
                ) : suppMsgSent ? (
                  <div style={{ textAlign:"center", padding:"20px 0" }}>
                    <div style={{ fontSize:36, marginBottom:8 }}>✅</div>
                    <p style={{ margin:"0 0 4px", fontWeight:700, fontSize:15, color:"#1a3a1a" }}>Vraag verzonden! 🎉</p>
                    <p style={{ margin:"0 0 14px", fontSize:13, color:"rgba(30,90,30,0.55)" }}>Amanda reageert binnen 3 werkdagen met persoonlijk advies.</p>
                    <button onClick={()=>{ setSuppMsgSent(false); setSuppMsgText(""); }} style={{ padding:"9px 20px", borderRadius:10, border:"1px solid rgba(45,158,107,0.25)", background:"transparent", color:"#2d9e6b", fontSize:12, cursor:"pointer" }}>Nieuwe vraag stellen</button>
                  </div>
                ) : (
                  <div>
                    <p style={{ margin:"0 0 8px", fontSize:12, color:"rgba(30,90,30,0.55)", fontWeight:600 }}>Waar gaat je vraag over?</p>
                    <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
                      {[["💊","supplement"],["🤰","zwangerschap"],["⚖️","dieet & suppls"],["🏃","sport & suppls"],["😴","slaap & suppls"],["🧘","stress & suppls"]].map(([emoji,cat]) => (
                        <button key={cat} onClick={()=>setSuppMsgCategory(cat)} style={{ padding:"5px 10px", borderRadius:16, border:`1.5px solid ${suppMsgCategory===cat?"#c084fc":"rgba(34,139,34,0.2)"}`, background:suppMsgCategory===cat?"rgba(192,132,252,0.12)":"transparent", color:suppMsgCategory===cat?"#c084fc":"rgba(30,90,30,0.5)", fontSize:11, cursor:"pointer", fontWeight:suppMsgCategory===cat?700:400 }}>{emoji} {cat}</button>
                      ))}
                    </div>
                    <textarea value={suppMsgText} onChange={e=>setSuppMsgText(e.target.value)}
                      placeholder={`Stel je vraag over ${suppMsgCategory}...`} rows={4}
                      style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"1px solid rgba(192,132,252,0.25)", background:"rgba(255,255,255,0.9)", color:"#1a3a1a", fontSize:13, outline:"none", resize:"none", fontFamily:"inherit", lineHeight:1.6, boxSizing:"border-box", marginBottom:10 }} />
                    <button onClick={()=>{ if(suppMsgText.trim()) setSuppMsgSent(true); }} disabled={!suppMsgText.trim()}
                      style={{ width:"100%", padding:13, borderRadius:12, border:"none", background:suppMsgText.trim()?"linear-gradient(135deg,#c084fc,#818cf8)":"rgba(192,132,252,0.1)", color:suppMsgText.trim()?"#fff":"rgba(30,90,30,0.35)", fontSize:14, fontWeight:700, cursor:suppMsgText.trim()?"pointer":"default", transition:"all 0.2s" }}>
                      Verstuur vraag →
                    </button>
                    <p style={{ margin:"8px 0 0", fontSize:10, color:"rgba(30,90,30,0.35)", textAlign:"center" }}>⏱ Reactie binnen 3 werkdagen · Vertrouwelijk</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══ VEVO TAB ═══ */}
        {tab==="vevo" && (
          <div style={{ animation:"fadeUp 0.3s ease" }}>

            {/* Header */}
            <div style={{ background:"linear-gradient(135deg,rgba(251,191,36,0.1),rgba(249,115,22,0.08))", borderRadius:16, padding:18, marginBottom:14, border:"1px solid rgba(251,191,36,0.2)" }}>
              <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:10 }}>
                <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,#fbbf24,#f97316)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:900, color:"#1a0a00" }}>V</div>
                <div>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 2px", fontSize:20, color:"#1a3a1a" }}>VEVO Maaltijdcheck</h2>
                  <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.55)" }}>Gebaseerd op het VEVO-principe van Dr. Elise Janssen</p>
                </div>
              </div>
              <p style={{ margin:0, fontSize:13, color:"rgba(30,90,30,0.7)", lineHeight:1.6 }}>
                Een volwaardige maaltijd bevat alle vier de VEVO-pijlers: <strong style={{ color:"#f97316" }}>V</strong>ezels · <strong style={{ color:"#2d9e6b" }}>E</strong>iwitten · <strong style={{ color:"#a855f7" }}>V</strong>itamines · <strong style={{ color:"#38bdf8" }}>O</strong>nverzadigde vetten
              </p>
            </div>

            {!isPremium ? (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <p style={{ fontSize:13, color:"rgba(30,90,30,0.55)", marginBottom:16 }}>De VEVO-maaltijdcheck is beschikbaar voor Pro-leden.</p>
                <button onClick={()=>setShowPaywall(true)} style={{ padding:"12px 28px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#fbbf24,#f97316)", color:"#1a0a00", fontSize:14, fontWeight:700, cursor:"pointer" }}>⭐ Upgrade naar Pro</button>
              </div>
            ) : (
              <div>
                {/* VEVO legenda */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                  {[["V","Vezels","#f97316","Spijsvertering & verzadiging"],["E","Eiwitten","#2d9e6b","Spieren & bloedsuiker"],["V","Vitamines","#a855f7","Weerstand & energie"],["O","Onverz. vetten","#38bdf8","Cellen & hormonen"]].map(([letter,naam,color,uitleg],i) => (
                    <div key={i} style={{ background:`${color}10`, borderRadius:12, padding:"10px 12px", border:`1px solid ${color}25` }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                        <div style={{ width:26, height:26, borderRadius:8, background:color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:"#fff", flexShrink:0 }}>{letter}</div>
                        <span style={{ fontSize:12, fontWeight:700, color:"#1a3a1a" }}>{naam}</span>
                      </div>
                      <p style={{ margin:0, fontSize:10, color:"rgba(30,90,30,0.55)", lineHeight:1.4 }}>{uitleg}</p>
                    </div>
                  ))}
                </div>

                {/* Product zoeken */}
                <div style={{ position:"relative", marginBottom:10 }}>
                  <input value={vevoSearch} onChange={e=>{
                    setVevoSearch(e.target.value);
                    if(e.target.value.length>1) {
                      setVevoSuggestions(ALL_PRODUCTS.filter(p=>p.toLowerCase().includes(e.target.value.toLowerCase())).slice(0,6));
                    } else setVevoSuggestions([]);
                  }} placeholder="Voeg product toe aan je maaltijd..."
                    style={{ width:"100%", padding:"12px 48px 12px 16px", borderRadius:12, border:"1px solid rgba(251,191,36,0.3)", background:"rgba(255,255,255,0.9)", fontSize:14, outline:"none", color:"#1a3a1a", boxSizing:"border-box" }} />
                  <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", fontSize:18 }}>🔍</span>
                </div>

                {vevoSuggestions.length>0 && (
                  <div style={{ background:"rgba(255,255,255,0.95)", borderRadius:11, marginBottom:10, overflow:"hidden", border:"1px solid rgba(251,191,36,0.25)", boxShadow:"0 4px 12px rgba(0,0,0,0.08)" }}>
                    {vevoSuggestions.map(s => (
                      <div key={s} onClick={()=>{
                        if(!vevoMeal.includes(s)) setVevoMeal(p=>[...p,s]);
                        setVevoSearch(""); setVevoSuggestions([]);
                      }} style={{ padding:"10px 14px", cursor:"pointer", borderBottom:"1px solid rgba(251,191,36,0.1)", fontSize:13, color:"#1a3a1a", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span>{s}</span>
                        <span style={{ fontSize:10, color:"rgba(30,90,30,0.45)" }}>
                          {(DB[s]?.vevo||[]).map(v=>v==="V2"?"V":v).join(" · ") || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Geselecteerde producten */}
                {vevoMeal.length>0 && (
                  <div style={{ marginBottom:14 }}>
                    <p style={{ margin:"0 0 8px", fontSize:11, color:"rgba(30,90,30,0.5)", textTransform:"uppercase", letterSpacing:1 }}>Jouw maaltijd</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                      {vevoMeal.map(product => (
                        <span key={product} onClick={()=>setVevoMeal(p=>p.filter(x=>x!==product))}
                          style={{ background:"rgba(251,191,36,0.12)", borderRadius:16, padding:"5px 12px", fontSize:12, color:"#92400e", cursor:"pointer", border:"1px solid rgba(251,191,36,0.3)", display:"flex", alignItems:"center", gap:5 }}>
                          {product} <span style={{ fontSize:10, opacity:0.6 }}>✕</span>
                        </span>
                      ))}
                    </div>

                    {/* VEVO score */}
                    {(() => {
                      const allPillars = vevoMeal.flatMap(p => DB[p]?.vevo || []);
                      const hasV  = allPillars.includes("V");
                      const hasE  = allPillars.includes("E");
                      const hasV2 = allPillars.includes("V2");
                      const hasO  = allPillars.includes("O");
                      const score = [hasV,hasE,hasV2,hasO].filter(Boolean).length;

                      const suggestions = [];
                      if(!hasV)  suggestions.push({ pijler:"Vezels",  color:"#f97316", tip:"Voeg toe: volkoren brood, groenten, fruit, havermout of linzen" });
                      if(!hasE)  suggestions.push({ pijler:"Eiwitten",color:"#2d9e6b", tip:"Voeg toe: kip, ei, tonijn, yoghurt, peulvruchten of kaas" });
                      if(!hasV2) suggestions.push({ pijler:"Vitamines",color:"#a855f7", tip:"Voeg toe: paprika, spinazie, broccoli, tomaat of fruit" });
                      if(!hasO)  suggestions.push({ pijler:"Onverzadigde vetten",color:"#38bdf8", tip:"Voeg toe: avocado, olijfolie, walnoten, zalm of amandelen" });

                      return (
                        <div>
                          {/* Score visual */}
                          <div style={{ background:"rgba(34,139,34,0.06)", borderRadius:14, padding:16, marginBottom:12, border:"1px solid rgba(34,139,34,0.12)" }}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                              <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#1a3a1a" }}>VEVO-score</p>
                              <div style={{ background: score===4?"rgba(34,197,94,0.15)":score>=2?"rgba(251,191,36,0.15)":"rgba(239,68,68,0.15)", borderRadius:10, padding:"4px 12px", border:`1px solid ${score===4?"rgba(34,197,94,0.3)":score>=2?"rgba(251,191,36,0.3)":"rgba(239,68,68,0.3)"}` }}>
                                <span style={{ fontSize:16, fontWeight:800, color:score===4?"#22c55e":score>=2?"#d97706":"#ef4444" }}>{score}/4</span>
                              </div>
                            </div>
                            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                              {[["V","Vezels","#f97316",hasV],["E","Eiwitten","#2d9e6b",hasE],["V","Vitamines","#a855f7",hasV2],["O","Onverz. vetten","#38bdf8",hasO]].map(([letter,naam,color,has],i) => (
                                <div key={i} style={{ display:"flex", gap:8, alignItems:"center", background:has?`${color}10`:"rgba(239,68,68,0.06)", borderRadius:10, padding:"8px 10px", border:`1px solid ${has?`${color}25`:"rgba(239,68,68,0.15)"}` }}>
                                  <div style={{ width:24, height:24, borderRadius:7, background:has?color:"rgba(239,68,68,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:"#fff", flexShrink:0 }}>{has?"✓":letter}</div>
                                  <span style={{ fontSize:11, fontWeight:600, color:has?"#1a3a1a":"rgba(30,90,30,0.45)" }}>{naam}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Compleet! */}
                          {score===4 && (
                            <div style={{ background:"rgba(34,197,94,0.1)", borderRadius:13, padding:14, marginBottom:12, border:"1px solid rgba(34,197,94,0.25)", textAlign:"center" }}>
                              <p style={{ margin:"0 0 4px", fontSize:16 }}>🎉</p>
                              <p style={{ margin:"0 0 3px", fontSize:14, fontWeight:700, color:"#1a3a1a" }}>Perfecte VEVO-maaltijd!</p>
                              <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.6)" }}>Jouw maaltijd bevat alle vier de pijlers. Goed bezig!</p>
                            </div>
                          )}

                          {/* Suggesties */}
                          {suggestions.length>0 && (
                            <div>
                              <p style={{ margin:"0 0 8px", fontSize:12, fontWeight:700, color:"#1a3a1a" }}>💡 Maak je maaltijd compleet:</p>
                              {suggestions.map((s,i) => (
                                <div key={i} style={{ background:`${s.color}08`, borderRadius:12, padding:"10px 13px", marginBottom:7, border:`1px solid ${s.color}20`, display:"flex", gap:10, alignItems:"flex-start" }}>
                                  <div style={{ width:22, height:22, borderRadius:6, background:s.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:"#fff", flexShrink:0, marginTop:1 }}>!</div>
                                  <div>
                                    <p style={{ margin:"0 0 2px", fontSize:12, fontWeight:700, color:"#1a3a1a" }}>Mist: {s.pijler}</p>
                                    <p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.6)", lineHeight:1.5 }}>{s.tip}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <button onClick={()=>setVevoMeal([])} style={{ width:"100%", marginTop:8, padding:11, borderRadius:11, border:"1px solid rgba(34,139,34,0.2)", background:"transparent", color:"rgba(30,90,30,0.5)", fontSize:12, cursor:"pointer" }}>
                            🗑️ Maaltijd wissen
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {vevoMeal.length===0 && (
                  <div style={{ textAlign:"center", padding:"20px 0", color:"rgba(30,90,30,0.4)" }}>
                    <p style={{ fontSize:36, marginBottom:8 }}>🍽️</p>
                    <p style={{ fontSize:14 }}>Voeg producten toe om je maaltijd te checken</p>
                    <p style={{ fontSize:12, marginTop:4 }}>Bijv. havermout + blauwe bessen + walnoten + yoghurt</p>
                  </div>
                )}

                {/* Uitleg onderaan */}
                <div style={{ background:"rgba(251,191,36,0.06)", borderRadius:12, padding:14, marginTop:8, border:"1px solid rgba(251,191,36,0.15)" }}>
                  <p style={{ margin:"0 0 4px", fontSize:12, fontWeight:700, color:"#92400e" }}>ℹ️ Over het VEVO-principe</p>
                  <p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.6)", lineHeight:1.6 }}>Het VEVO-principe is ontwikkeld door leefstijlhuisarts Dr. Elise Janssen. Door bij elke maaltijd te zorgen voor vezels, eiwitten, vitamines én onverzadigde vetten, voed je je lichaam volledig en voorkom je cravings en energiedips.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ LEEFSTIJL TAB ═══ */}
        {tab==="leefstijl" && (
          <div style={{ animation:"fadeUp 0.3s ease" }}>

            {/* Header */}
            <div style={{ background:"linear-gradient(135deg,rgba(99,102,241,0.08),rgba(168,85,247,0.06))", borderRadius:16, padding:16, marginBottom:14, border:"1px solid rgba(99,102,241,0.15)", textAlign:"center" }}>
              <p style={{ margin:"0 0 4px", fontSize:20 }}>💪</p>
              <h2 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 4px", fontSize:20, color:"#1a3a1a" }}>Slaap, Stress & Beweging</h2>
              <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.55)" }}>Tips, oefeningen en schema's van Amanda</p>
              {!isPremium && <button onClick={()=>setShowPaywall(true)} style={{ marginTop:10, padding:"7px 18px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#ec4899,#f97316)", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>🔒 Pro-functie — Upgrade naar Pro</button>}
            </div>

            {isPremium ? (
              <div>
                {/* Onderwerp tabs */}
                <div style={{ display:"flex", gap:6, marginBottom:14 }}>
                  {Object.values(LEEFSTIJL).map(ls => (
                    <button key={ls.titel} onClick={()=>{ setLeefstijlTab(ls.titel.toLowerCase()); setLeefstijlSectie("tips"); }} style={{ flex:1, padding:"10px 4px", borderRadius:12, border:`1.5px solid ${leefstijlTab===ls.titel.toLowerCase()?ls.color:"rgba(34,139,34,0.2)"}`, background:leefstijlTab===ls.titel.toLowerCase()?`${ls.color}15`:"rgba(255,255,255,0.4)", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                      <span style={{ fontSize:20 }}>{ls.emoji}</span>
                      <span style={{ fontSize:11, color:leefstijlTab===ls.titel.toLowerCase()?ls.color:"rgba(30,90,30,0.55)", fontWeight:leefstijlTab===ls.titel.toLowerCase()?700:400 }}>{ls.titel}</span>
                    </button>
                  ))}
                </div>

                {Object.values(LEEFSTIJL).filter(ls=>ls.titel.toLowerCase()===leefstijlTab).map(ls => (
                  <div key={ls.titel}>
                    {/* Intro */}
                    <div style={{ background:`${ls.color}10`, borderRadius:13, padding:14, marginBottom:12, border:`1px solid ${ls.color}25` }}>
                      <p style={{ margin:0, fontSize:13, color:"rgba(30,90,30,0.75)", lineHeight:1.7 }}>{ls.intro}</p>
                    </div>

                    {/* Sectie tabs */}
                    <div style={{ display:"flex", background:"rgba(34,139,34,0.06)", borderRadius:12, padding:3, marginBottom:12, gap:2 }}>
                      {[["tips","💡 Tips"],["oefeningen","🏋️ Oefeningen"],["schema","📅 Schema"],["tracker","📊 Tracker"]].map(([id,label]) => (
                        <button key={id} onClick={()=>setLeefstijlSectie(id)} style={{ flex:1, padding:"7px 0", border:"none", borderRadius:9, cursor:"pointer", background:leefstijlSectie===id?`${ls.color}20`:"transparent", color:leefstijlSectie===id?ls.color:"rgba(30,90,30,0.45)", fontSize:10, fontWeight:leefstijlSectie===id?700:400, transition:"all 0.15s" }}>{label}</button>
                      ))}
                    </div>

                    {/* TIPS */}
                    {leefstijlSectie==="tips" && ls.tips.map((tip,i) => (
                      <div key={i} style={{ background:"rgba(34,139,34,0.05)", borderRadius:13, padding:14, marginBottom:8, border:"1px solid rgba(34,139,34,0.12)" }}>
                        <p style={{ margin:"0 0 5px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>{i+1}. {tip.titel}</p>
                        <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.7)", lineHeight:1.6 }}>{tip.tekst}</p>
                      </div>
                    ))}

                    {/* OEFENINGEN */}
                    {leefstijlSectie==="oefeningen" && ls.oefeningen.map((oe,i) => (
                      <div key={i} style={{ background:"rgba(34,139,34,0.05)", borderRadius:13, padding:14, marginBottom:8, border:`1px solid ${ls.color}20` }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                          <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#1a3a1a" }}>{oe.titel}</p>
                          <span style={{ fontSize:11, background:`${ls.color}15`, color:ls.color, borderRadius:8, padding:"2px 9px", border:`1px solid ${ls.color}25` }}>⏱ {oe.duur}</span>
                        </div>
                        <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.7)", lineHeight:1.6 }}>{oe.beschrijving}</p>
                      </div>
                    ))}

                    {/* SCHEMA */}
                    {leefstijlSectie==="schema" && (
                      <div style={{ background:"rgba(34,139,34,0.05)", borderRadius:13, padding:14, border:"1px solid rgba(34,139,34,0.12)" }}>
                        <p style={{ margin:"0 0 12px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>📅 Dagschema {ls.titel}</p>
                        {ls.schema.map((item,i) => (
                          <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:10, paddingBottom:10, borderBottom: i<ls.schema.length-1?"1px solid rgba(34,139,34,0.08)":"none" }}>
                            <span style={{ fontSize:11, fontWeight:700, color:ls.color, background:`${ls.color}12`, borderRadius:8, padding:"3px 9px", flexShrink:0, marginTop:1 }}>{item.tijd}</span>
                            <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.75)", lineHeight:1.5 }}>{item.actie}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* TRACKER */}
                    {leefstijlSectie==="tracker" && (
                      <div>
                        <p style={{ margin:"0 0 12px", fontSize:12, color:"rgba(30,90,30,0.55)" }}>Houd dagelijks bij hoe het gaat:</p>

                        {ls.titel==="Slaap" && (
                          <div style={{ background:"rgba(34,139,34,0.05)", borderRadius:13, padding:14, marginBottom:10, border:"1px solid rgba(34,139,34,0.12)" }}>
                            <p style={{ margin:"0 0 10px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>😴 Slaap van afgelopen nacht</p>
                            <p style={{ margin:"0 0 6px", fontSize:12, color:"rgba(30,90,30,0.55)" }}>Aantal uren geslapen:</p>
                            <input type="number" value={slaapTracker.uren} onChange={e=>setSlaapTracker(p=>({...p,uren:e.target.value}))} placeholder="Bijv. 7.5" min="0" max="12" step="0.5"
                              style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1px solid rgba(34,139,34,0.25)", background:"rgba(255,255,255,0.9)", fontSize:14, outline:"none", color:"#1a3a1a", marginBottom:10, boxSizing:"border-box" }} />
                            <p style={{ margin:"0 0 8px", fontSize:12, color:"rgba(30,90,30,0.55)" }}>Kwaliteit van je slaap:</p>
                            <div style={{ display:"flex", gap:6 }}>
                              {[["😴","Slecht"],["😐","Matig"],["🙂","Oké"],["😊","Goed"],["🎉","Top!"]].map(([emoji,label],i) => (
                                <button key={i} onClick={()=>setSlaapTracker(p=>({...p,kwaliteit:i+1}))} style={{ flex:1, padding:"8px 2px", borderRadius:9, border:`1.5px solid ${slaapTracker.kwaliteit===i+1?"#6366f1":"rgba(34,139,34,0.2)"}`, background:slaapTracker.kwaliteit===i+1?"rgba(99,102,241,0.12)":"rgba(255,255,255,0.5)", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                                  <span style={{ fontSize:16 }}>{emoji}</span>
                                  <span style={{ fontSize:9, color:"rgba(30,90,30,0.55)" }}>{label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {ls.titel==="Stress" && (
                          <div style={{ background:"rgba(34,139,34,0.05)", borderRadius:13, padding:14, marginBottom:10, border:"1px solid rgba(34,139,34,0.12)" }}>
                            <p style={{ margin:"0 0 10px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>🧘 Stressniveau vandaag</p>
                            <div style={{ display:"flex", gap:6, marginBottom:10 }}>
                              {[["😌","Rustig"],["🙂","Licht"],["😐","Matig"],["😟","Hoog"],["😰","Zwaar"]].map(([emoji,label],i) => (
                                <button key={i} onClick={()=>setStresTracker(p=>({...p,score:i+1}))} style={{ flex:1, padding:"8px 2px", borderRadius:9, border:`1.5px solid ${stresTracker.score===i+1?"#a855f7":"rgba(34,139,34,0.2)"}`, background:stresTracker.score===i+1?"rgba(168,85,247,0.12)":"rgba(255,255,255,0.5)", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                                  <span style={{ fontSize:16 }}>{emoji}</span>
                                  <span style={{ fontSize:9, color:"rgba(30,90,30,0.55)" }}>{label}</span>
                                </button>
                              ))}
                            </div>
                            <textarea value={stresTracker.notitie} onChange={e=>setStresTracker(p=>({...p,notitie:e.target.value}))} placeholder="Waar komt de stress vandaan? (optioneel)" rows={2}
                              style={{ width:"100%", padding:"9px 12px", borderRadius:10, border:"1px solid rgba(34,139,34,0.2)", background:"rgba(255,255,255,0.9)", fontSize:12, outline:"none", resize:"none", fontFamily:"inherit", color:"#1a3a1a", boxSizing:"border-box" }} />
                          </div>
                        )}

                        {ls.titel==="Beweging" && (
                          <div style={{ background:"rgba(34,139,34,0.05)", borderRadius:13, padding:14, marginBottom:10, border:"1px solid rgba(34,139,34,0.12)" }}>
                            <p style={{ margin:"0 0 10px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>🏃 Beweging van vandaag</p>
                            <p style={{ margin:"0 0 6px", fontSize:12, color:"rgba(30,90,30,0.55)" }}>Aantal minuten bewogen:</p>
                            <input type="number" value={bewegingTracker.minuten} onChange={e=>setBewegingTracker(p=>({...p,minuten:e.target.value}))} placeholder="Bijv. 30" min="0"
                              style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1px solid rgba(34,139,34,0.25)", background:"rgba(255,255,255,0.9)", fontSize:14, outline:"none", color:"#1a3a1a", marginBottom:10, boxSizing:"border-box" }} />
                            <p style={{ margin:"0 0 8px", fontSize:12, color:"rgba(30,90,30,0.55)" }}>Type beweging:</p>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                              {["wandelen","fietsen","zwemmen","sporten","yoga","anders"].map(type => (
                                <button key={type} onClick={()=>setBewegingTracker(p=>({...p,type}))} style={{ padding:"5px 12px", borderRadius:16, border:`1.5px solid ${bewegingTracker.type===type?"#f97316":"rgba(34,139,34,0.2)"}`, background:bewegingTracker.type===type?"rgba(249,115,22,0.12)":"rgba(255,255,255,0.5)", color:bewegingTracker.type===type?"#f97316":"rgba(30,90,30,0.55)", fontSize:11, cursor:"pointer", fontWeight:bewegingTracker.type===type?700:400 }}>{type}</button>
                              ))}
                            </div>
                          </div>
                        )}

                        <button onClick={()=>{
                          const entry = {
                            datum: new Date().toLocaleDateString("nl-NL",{weekday:"short",day:"numeric",month:"short"}),
                            type: ls.titel,
                            data: ls.titel==="Slaap" ? slaapTracker : ls.titel==="Stress" ? stresTracker : bewegingTracker
                          };
                          setTrackerLog(p=>[entry,...p.slice(0,29)]);
                          setTrackerSaved(true);
                          setTimeout(()=>setTrackerSaved(false), 2000);
                        }} style={{ width:"100%", padding:12, borderRadius:12, border:"none", background:`linear-gradient(135deg,${ls.color},#a8e6cf)`, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                          {trackerSaved ? "✅ Opgeslagen!" : "💾 Sla op"}
                        </button>

                        {/* Tracker geschiedenis */}
                        {trackerLog.filter(l=>l.type===ls.titel).length > 0 && (
                          <div style={{ marginTop:14 }}>
                            <p style={{ margin:"0 0 8px", fontSize:11, color:"rgba(30,90,30,0.5)", textTransform:"uppercase", letterSpacing:1 }}>Geschiedenis</p>
                            {trackerLog.filter(l=>l.type===ls.titel).slice(0,5).map((log,i) => (
                              <div key={i} style={{ background:"rgba(34,139,34,0.05)", borderRadius:10, padding:"9px 12px", marginBottom:6, border:"1px solid rgba(34,139,34,0.1)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                                <span style={{ fontSize:12, color:"rgba(30,90,30,0.6)" }}>{log.datum}</span>
                                <span style={{ fontSize:12, color:"#2d9e6b", fontWeight:600 }}>
                                  {log.type==="Slaap" ? `${log.data.uren}u · ${"⭐".repeat(log.data.kwaliteit||0)}` :
                                   log.type==="Stress" ? `${["😌","🙂","😐","😟","😰"][log.data.score-1]||"—"}` :
                                   `${log.data.minuten} min ${log.data.type}`}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <p style={{ fontSize:13, color:"rgba(30,90,30,0.55)", marginBottom:16 }}>De leefstijl module met slaap, stress en beweging is beschikbaar voor Pro-leden.</p>
                <button onClick={()=>setShowPaywall(true)} style={{ padding:"12px 28px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#ec4899,#f97316)", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>⭐ Upgrade naar Pro — €7,99/mnd</button>
              </div>
            )}
          </div>
        )}

        {/* ═══ PROFIEL TAB ═══ */}
        {tab==="profiel" && (
          <div>
            {/* Altijd zichtbaar — ook zonder inlog */}
            <button onClick={()=>{ setOnboarding(true); setOnboardStep(0); }} style={{ width:"100%", padding:12, borderRadius:12, border:"1px solid rgba(34,139,34,0.2)", background:"rgba(34,139,34,0.05)", color:"#2d9e6b", fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:12, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>🌿 Bekijk welkomstscherm opnieuw</button>

            {!user
              ? <div style={{ textAlign:"center", padding:"30px 0" }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>👤</div>
                  <p style={{ color:"rgba(30,90,30,0.65)", fontSize:14, marginBottom:20 }}>Log in om je voortgang bij te houden</p>
                  <button onClick={()=>setShowLogin(true)} style={{ padding:"12px 32px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#2d9e6b,#a8e6cf)", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", marginBottom:14 }}>Inloggen / Registreren</button>
                  <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:14 }}>
                    <button onClick={()=>setShowFAQ(true)} style={{ padding:"8px 16px", borderRadius:10, border:"1px solid rgba(34,139,34,0.22)", background:"rgba(34,139,34,0.06)", color:"#2d9e6b", fontSize:12, cursor:"pointer" }}>❓ FAQ</button>
                    <button onClick={()=>setShowDisclaimer(true)} style={{ padding:"8px 16px", borderRadius:10, border:"1px solid rgba(34,139,34,0.22)", background:"rgba(34,139,34,0.06)", color:"#2d9e6b", fontSize:12, cursor:"pointer" }}>⚕️ Disclaimer</button>
                  </div>
                  <button onClick={()=>setProMode(true)} style={{ padding:"10px 20px", borderRadius:12, border:"1px solid rgba(99,102,241,0.3)", background:"rgba(99,102,241,0.08)", color:"#818cf8", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6, margin:"0 auto" }}>🏥 Professioneel account</button>
                </div>
              : <>
                  {/* Profiel header met foto placeholder */}
                  <div style={{ background:"rgba(34,139,34,0.08)", borderRadius:16, padding:18, marginBottom:12, display:"flex", gap:14, alignItems:"center" }}>
                    <div style={{ position:"relative", flexShrink:0 }}>
                      <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#2d9e6b,#a8e6cf)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:700, color:"#fff" }}>{user.name[0].toUpperCase()}</div>
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ margin:"0 0 2px", fontWeight:700, fontSize:17, color:"#1a3a1a" }}>{user.name}</p>
                      <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.55)" }}>{user.email}</p>
                    </div>
                    {isPremium && <span style={{ background:"linear-gradient(135deg,#fbbf24,#f97316)", borderRadius:8, fontSize:11, fontWeight:700, padding:"3px 10px", color:"#1a0a00" }}>PRO</span>}
                  </div>

                  {/* Dagelijkse check-in */}
                  {/* ── DOELEN ── */}
                  <div style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                      <div>
                        <p style={{ margin:"0 0 2px", fontSize:14, fontWeight:700, color:"#1a3a1a" }}>🎯 Mijn doelen</p>
                        <p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.5)" }}>Stel doelen en evalueer je voortgang</p>
                      </div>
                      <button onClick={()=>{ if(!hasStarter){setShowPaywall(true);return;} setNewGoal({type:"slaap",label:"",target:"",unit:"uur/nacht",days:14,dieet:"",comment:""}); setShowAddGoal(true); }} style={{ padding:"7px 14px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#2d9e6b,#a8e6cf)", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Doel</button>
                    </div>

                    {!isPremium && goals.length===0 && (
                      <div onClick={()=>setShowPaywall(true)} style={{ background:"linear-gradient(135deg,rgba(45,158,107,0.08),rgba(168,230,207,0.06))", border:"1px dashed rgba(45,158,107,0.3)", borderRadius:14, padding:16, textAlign:"center", cursor:"pointer" }}>
                        <p style={{ margin:"0 0 4px", fontSize:13, fontWeight:700, color:"#2d9e6b" }}>🔒 Doelen stellen is een Starter-functie</p>
                        <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.5)" }}>Upgrade naar Starter om doelen te stellen en voortgang bij te houden</p>
                      </div>
                    )}

                    {goals.map((goal, gi) => {
                      const gt = GOAL_TYPES.find(x=>x.id===goal.type);
                      const daysLeft = Math.max(0, goal.days - goal.dailyLogs.length);
                      const pct = Math.min(100, Math.round((goal.dailyLogs.length / goal.days) * 100));
                      const done = goal.dailyLogs.length >= goal.days;
                      return (
                        <div key={gi} style={{ background:"rgba(34,139,34,0.06)", borderRadius:14, padding:14, marginBottom:8, border:`1px solid ${done?"rgba(34,197,94,0.25)":"rgba(34,139,34,0.14)"}` }}>
                          <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                            <div style={{ width:38, height:38, borderRadius:10, background:`${gt?.color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{gt?.emoji}</div>
                            <div style={{ flex:1 }}>
                              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                                <div>
                                  <p style={{ margin:"0 0 1px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>{goal.label || gt?.label}</p>
                                  <p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.5)" }}>{goal.target} {goal.unit} · {goal.days} dagen</p>
                                </div>
                                <span style={{ fontSize:11, background: done?"rgba(34,197,94,0.15)":"rgba(34,139,34,0.1)", color:done?"#22c55e":"rgba(30,90,30,0.6)", borderRadius:8, padding:"2px 8px", border:`1px solid ${done?"rgba(34,197,94,0.3)":"rgba(34,139,34,0.2)"}` }}>{done?"✅ Klaar":`${daysLeft}d over`}</span>
                              </div>
                              {/* Progress bar */}
                              <div style={{ marginTop:8, marginBottom:6 }}>
                                <div style={{ background:"rgba(34,139,34,0.1)", borderRadius:4, height:6, overflow:"hidden" }}>
                                  <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${gt?.color},#a8e6cf)`, borderRadius:4, transition:"width 0.3s" }} />
                                </div>
                                <p style={{ margin:"3px 0 0", fontSize:10, color:"rgba(30,90,30,0.5)" }}>{goal.dailyLogs.length}/{goal.days} dagen · {pct}%</p>
                              </div>
                              <div style={{ display:"flex", gap:6 }}>
                                <button onClick={()=>setShowGoalDetail(gi)} style={{ flex:1, padding:"6px 0", borderRadius:8, border:"1px solid rgba(34,139,34,0.2)", background:"rgba(34,139,34,0.06)", color:"#2d9e6b", fontSize:11, cursor:"pointer", fontWeight:600 }}>📊 Bekijk & evalueer</button>
                                {!done && <button onClick={()=>{ const today=new Date().toLocaleDateString("nl-NL",{weekday:"short",day:"numeric"}); setGoals(p=>p.map((g,i)=>i===gi?{...g,dailyLogs:[...g.dailyLogs,{dag:today,score:null,comment:""}]}:g)); }} style={{ padding:"6px 12px", borderRadius:8, border:"1px solid rgba(45,158,107,0.3)", background:"rgba(45,158,107,0.1)", color:"#2d9e6b", fontSize:11, cursor:"pointer", fontWeight:600 }}>✓ Dag check-in</button>}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Statistieken */}
                  <div style={{ background:"rgba(34,139,34,0.06)", borderRadius:14, padding:16, marginBottom:10 }}>
                    <p style={{ margin:"0 0 10px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>📊 Jouw statistieken</p>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      {[["🔍 Gecheckt",history.length,"producten"],["📋 Diëten",selectedDiets.length,"actief"],["🎯 Doelen",goals.length,"actief"],["📅 Menu items",Object.keys(weekMenu).length,"gepland"]].map(([l,v,sub]) => (
                        <div key={l} style={{ background:"rgba(34,139,34,0.08)", borderRadius:10, padding:"10px 12px" }}>
                          <p style={{ margin:"0 0 2px", fontSize:11, color:"rgba(30,90,30,0.55)" }}>{l}</p>
                          <p style={{ margin:"0 0 1px", fontSize:24, fontWeight:800, color:"#1a3a1a" }}>{v}</p>
                          <p style={{ margin:0, fontSize:10, color:"rgba(30,90,30,0.4)" }}>{sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bericht aan Amanda (Pro) */}
                  <div style={{ borderRadius:14, overflow:"hidden", marginBottom:10, border:"1px solid rgba(45,158,107,0.2)" }}>
                    <div style={{ background:"linear-gradient(135deg,rgba(45,158,107,0.12),rgba(168,230,207,0.1))", padding:"12px 16px", borderBottom:"1px solid rgba(45,158,107,0.15)" }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                        <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#2d9e6b,#a8e6cf)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🌿</div>
                        <div>
                          <p style={{ margin:"0 0 1px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>💬 Persoonlijk leefstijladvies</p>
                          <p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.55)" }}>Stel Amanda een persoonlijke vraag over jouw leefstijl</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding:16, background:"rgba(255,255,255,0.4)" }}>
                      {!isPremium ? (
                        <div style={{ textAlign:"center", padding:"8px 0" }}>
                          <p style={{ margin:"0 0 12px", fontSize:13, color:"rgba(30,90,30,0.6)" }}>🔒 Alleen Pro-leden kunnen Amanda een bericht sturen.</p>
                          <button onClick={()=>setShowPaywall(true)} style={{ padding:"10px 24px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#fbbf24,#f97316)", color:"#1a0a00", fontSize:13, fontWeight:700, cursor:"pointer" }}>Upgrade naar Pro</button>
                        </div>
                      ) : msgSent ? (
                        <div style={{ textAlign:"center", padding:"8px 0" }}>
                          <div style={{ fontSize:32, marginBottom:6 }}>✅</div>
                          <p style={{ margin:"0 0 3px", fontWeight:700, fontSize:14, color:"#1a3a1a" }}>Bericht verzonden!</p>
                          <p style={{ margin:"0 0 12px", fontSize:12, color:"rgba(30,90,30,0.55)" }}>Amanda reageert binnen 3 werkdagen.</p>
                          <button onClick={()=>{ setMsgSent(false); setMsgText(""); }} style={{ padding:"8px 18px", borderRadius:10, border:"1px solid rgba(45,158,107,0.25)", background:"transparent", color:"#2d9e6b", fontSize:12, cursor:"pointer" }}>Nieuw bericht</button>
                        </div>
                      ) : (
                        <div>
                          <p style={{ margin:"0 0 10px", fontSize:12, color:"rgba(30,90,30,0.55)" }}>Kies een onderwerp en stel je vraag:</p>
                          <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
                            {[["🥗","voeding"],["🏃","beweging"],["😴","slaap & stress"],["🤰","zwangerschap"],["💊","supplementen"],["⚖️","gewicht"]].map(([emoji, cat]) => (
                              <button key={cat} onClick={()=>setMsgCategory(cat)} style={{ padding:"5px 10px", borderRadius:16, border:`1.5px solid ${msgCategory===cat ? "#2d9e6b" : "rgba(45,158,107,0.2)"}`, background: msgCategory===cat ? "rgba(45,158,107,0.12)" : "transparent", color: msgCategory===cat ? "#2d9e6b" : "rgba(30,90,30,0.5)", fontSize:11, cursor:"pointer", fontWeight: msgCategory===cat ? 700 : 400 }}>{emoji} {cat}</button>
                            ))}
                          </div>
                          <textarea value={msgText} onChange={e=>setMsgText(e.target.value)}
                            placeholder={`Stel je vraag over ${msgCategory}...`} rows={3}
                            style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:"1px solid rgba(45,158,107,0.25)", background:"rgba(255,255,255,0.9)", color:"#1a3a1a", fontSize:13, outline:"none", resize:"none", fontFamily:"inherit", lineHeight:1.6, boxSizing:"border-box" }} />
                          <button onClick={()=>{ if(msgText.trim()) setMsgSent(true); }} disabled={!msgText.trim()}
                            style={{ width:"100%", marginTop:8, padding:12, borderRadius:11, border:"none", background: msgText.trim() ? "linear-gradient(135deg,#2d9e6b,#a8e6cf)" : "rgba(34,139,34,0.1)", color: msgText.trim() ? "#fff" : "rgba(30,90,30,0.35)", fontSize:13, fontWeight:700, cursor: msgText.trim() ? "pointer" : "default", transition:"all 0.2s" }}>
                            Verstuur bericht →
                          </button>
                          <p style={{ margin:"8px 0 0", fontSize:10, color:"rgba(30,90,30,0.35)", textAlign:"center" }}>⏱ Reactie binnen 3 werkdagen · Vertrouwelijk</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Roadmap, FAQ, Disclaimer */}
                  <div style={{ background:"rgba(34,139,34,0.05)", borderRadius:14, padding:16, marginBottom:10, border:"1px solid rgba(34,139,34,0.12)" }}>
                    <p style={{ margin:"0 0 10px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>🗺️ Roadmap</p>
                    {ROADMAP.map((item,i) => (
                      <div key={i} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:7 }}>
                        <span style={{ fontSize:13 }}>{item.done ? "✅" : "🔜"}</span>
                        <span style={{ fontSize:12, color: item.done ? "rgba(30,90,30,0.8)" : "rgba(30,90,30,0.4)" }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                  {/* Favorieten */}
                  {favorites.length > 0 && (
                    <div style={{ background:"rgba(236,72,153,0.06)", borderRadius:14, padding:14, marginBottom:10, border:"1px solid rgba(236,72,153,0.15)" }}>
                      <p style={{ margin:"0 0 10px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>❤️ Favorieten ({favorites.length})</p>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                        {favorites.map(fav => (
                          <span key={fav} onClick={()=>{ setResult(DB[fav] ? { product:fav, info:DB[fav].info, cal:DB[fav].cal, dieten:{}, allergies:{}, zwanger:null } : null); setCurrentProduct(fav); setTab("checker"); }} style={{ background:"rgba(236,72,153,0.1)", borderRadius:16, padding:"5px 12px", fontSize:12, color:"#ec4899", cursor:"pointer", border:"1px solid rgba(236,72,153,0.2)" }}>{fav}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prijzen */}
                  <div style={{ background:"rgba(34,139,34,0.05)", borderRadius:14, padding:16, marginBottom:10, border:"1px solid rgba(34,139,34,0.12)" }}>
                    <p style={{ margin:"0 0 12px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>💰 Abonnementen</p>
                    <div style={{ display:"flex", gap:6, marginBottom:12 }}>
                      {PRICING.map(p => <button key={p.id} onClick={()=>setPricingTab(p.id)} style={{ flex:1, padding:"7px 4px", borderRadius:10, border:`1.5px solid ${pricingTab===p.id?p.color:"rgba(34,139,34,0.18)"}`, background:pricingTab===p.id?`${p.color}15`:"transparent", color:pricingTab===p.id?p.color:"rgba(30,90,30,0.5)", fontSize:11, cursor:"pointer", fontWeight:pricingTab===p.id?700:400 }}>{p.label}</button>)}
                    </div>
                    {PRICING.filter(p=>p.id===pricingTab).map(plan => (
                      <div key={plan.id}>
                        <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:10 }}>
                          <span style={{ fontSize:26, fontWeight:800, color:plan.color }}>{plan.price}</span>
                          <span style={{ fontSize:12, color:"rgba(30,90,30,0.5)" }}>{plan.period}</span>
                        </div>
                        {plan.features.map(f => <p key={f} style={{ margin:"0 0 5px", fontSize:12, color: f.startsWith("✅") ? "rgba(30,90,30,0.75)" : "rgba(30,90,30,0.35)" }}>{f}</p>)}
                        {plan.id !== "gratis" && <button onClick={()=>openWhatsApp(plan.id==="pro"?"pro":plan.id==="starter"?"starter":"prof")} style={{ width:"100%", marginTop:10, padding:11, borderRadius:10, border:"none", background:`linear-gradient(135deg,${plan.color},#a8e6cf)`, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>📱 Aanmelden via WhatsApp →</button>}
                      </div>
                    ))}
                  </div>

                  {/* Reviews */}
                  <div style={{ background:"rgba(34,139,34,0.05)", borderRadius:14, padding:16, marginBottom:10, border:"1px solid rgba(34,139,34,0.12)" }}>
                    <p style={{ margin:"0 0 12px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>⭐ Wat gebruikers zeggen</p>
                    {REVIEWS.map((r,i) => (
                      <div key={i} style={{ background:"rgba(45,158,107,0.07)", borderRadius:12, padding:12, marginBottom:8, border:"1px solid rgba(45,158,107,0.12)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                          <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#2d9e6b,#a8e6cf)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff" }}>{r.name[0]}</div>
                          <div>
                            <p style={{ margin:0, fontSize:12, fontWeight:700, color:"#1a3a1a" }}>{r.name}</p>
                            <p style={{ margin:0, fontSize:10, color:"rgba(30,90,30,0.45)" }}>{r.dieet}</p>
                          </div>
                          <span style={{ marginLeft:"auto", fontSize:12 }}>{"⭐".repeat(r.stars)}</span>
                        </div>
                        <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.65)", lineHeight:1.5, fontStyle:"italic" }}>"{r.text}"</p>
                      </div>
                    ))}
                  </div>

                  {/* Deel de app */}
                  <button onClick={()=>setShowShareApp(true)} style={{ width:"100%", padding:12, borderRadius:12, border:"1px solid rgba(34,139,34,0.2)", background:"rgba(34,139,34,0.05)", color:"#2d9e6b", fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>📲 Deel VitaalCheck met vrienden</button>
                  <button onClick={()=>setShowFAQ(true)} style={{ width:"100%", padding:12, borderRadius:12, border:"1px solid rgba(34,139,34,0.2)", background:"rgba(34,139,34,0.05)", color:"#2d9e6b", fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>❓ Veelgestelde vragen</button>
                  <button onClick={()=>setShowDisclaimer(true)} style={{ width:"100%", padding:12, borderRadius:12, border:"1px solid rgba(34,139,34,0.2)", background:"rgba(34,139,34,0.05)", color:"#2d9e6b", fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:10, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>⚕️ Disclaimer & Privacy</button>
                  {!isPremium && <button onClick={()=>setShowPaywall(true)} style={{ width:"100%", padding:14, borderRadius:14, border:"none", background:"linear-gradient(135deg,#fbbf24,#f97316)", color:"#1a0a00", fontSize:14, fontWeight:700, cursor:"pointer", marginBottom:10 }}>⭐ Upgrade naar Pro — €7,99/mnd</button>}
                  <button onClick={()=>setUser(null)} style={{ width:"100%", padding:12, borderRadius:12, border:"1px solid rgba(34,139,34,0.15)", background:"transparent", color:"rgba(30,90,30,0.45)", fontSize:13, cursor:"pointer" }}>Uitloggen</button>
                </>
            }
          </div>
        )}
      </div>


      {/* PAYWALL MODAL */}
      {showPaywall && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:100, display:"flex", alignItems:"flex-end" }} onClick={()=>setShowPaywall(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:430, margin:"0 auto", background:"#e8f5e8", borderRadius:"24px 24px 0 0", padding:28, border:"1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:40, marginBottom:8 }}>⭐</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 6px", fontSize:24 }}>VitaalCheck Pro</h2>
              <p style={{ color:"rgba(30,90,30,0.65)", fontSize:13, margin:0 }}>Alles voor jouw gezonde levensstijl</p>
            </div>
            {[["🍳","Volledige recepten","500+ recepten per dieet"],["📅","Weekmenu planner","Plan maaltijden van tevoren"],["❤️","Favorieten","Sla producten en recepten op"],["📊","Voortgang","Bijhouden wat je gecheckt hebt"],["🔔","Meldingen","Dagelijkse dieet- en zwangerschapstips"]].map(([e,t,s]) => (
              <div key={t} style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
                <span style={{ fontSize:20 }}>{e}</span>
                <div><p style={{ margin:0, fontSize:14, fontWeight:600 }}>{t}</p><p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.55)" }}>{s}</p></div>
              </div>
            ))}
            {/* Drie plan knoppen in paywall */}
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:8 }}>
              <button onClick={()=>openWhatsApp("starter")} style={{ width:"100%", padding:13, borderRadius:12, border:"none", background:"linear-gradient(135deg,#f97316,#fbbf24)", color:"#1a0a00", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", paddingLeft:18, paddingRight:18 }}>
                <span>⚡ Starter — recepten & weekmenu & doelen</span><span>€4,99/mnd →</span>
              </button>
              <button onClick={()=>openWhatsApp("pro")} style={{ width:"100%", padding:13, borderRadius:12, border:"none", background:"linear-gradient(135deg,#ec4899,#f97316)", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", paddingLeft:18, paddingRight:18 }}>
                <span>⭐ Pro — alles inclusief</span><span>€7,99/mnd →</span>
              </button>
              <button onClick={()=>openWhatsApp("prof")} style={{ width:"100%", padding:13, borderRadius:12, border:"none", background:"linear-gradient(135deg,#6366f1,#ec4899)", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", paddingLeft:18, paddingRight:18 }}>
                <span>🏥 Professional</span><span>€19,99/mnd →</span>
              </button>
            </div>
            <p style={{ margin:"10px 0 0", fontSize:11, color:"rgba(30,90,30,0.45)", textAlign:"center" }}>
              📱 Je wordt doorgestuurd naar WhatsApp om je aanmelding te bevestigen
            </p>
                     <div style={{ margin:"12px 0 0", background:"rgba(45,158,107,0.08)", borderRadius:12, padding:"12px 14px", border:"1px solid rgba(45,158,107,0.2)" }}>
              <p style={{ margin:"0 0 8px", fontSize:12, fontWeight:700, color:"#2d9e6b" }}>🎟️ Heb je een toegangscode?</p>
              <div style={{ display:"flex", gap:8 }}>
                <input value={accessCodeInput} onChange={e=>{ setAccessCodeInput(e.target.value); setAccessCodeError(""); }}
                  onKeyDown={e=>e.key==="Enter"&&redeemAccessCode()}
                  placeholder="Voer code in..."
                  style={{ flex:1, padding:"9px 12px", borderRadius:10, border:`1px solid ${accessCodeError?"rgba(239,68,68,0.4)":"rgba(45,158,107,0.3)"}`, background:"rgba(255,255,255,0.9)", fontSize:13, outline:"none", color:"#1a3a1a", fontWeight:600 }} />
                <button onClick={redeemAccessCode} style={{ padding:"9px 14px", borderRadius:10, border:"none", background:"#2d9e6b", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>✓</button>
              </div>
              {accessCodeError && <p style={{ margin:"4px 0 0", fontSize:11, color:"#ef4444" }}>{accessCodeError}</p>}
              {accessCodeSuccess && <p style={{ margin:"4px 0 0", fontSize:12, color:"#22c55e", fontWeight:700 }}>✅ Geactiveerd! Sluit dit scherm.</p>}
            </div>
     <button onClick={()=>setShowPaywall(false)} style={{ width:"100%", marginTop:8, padding:10, background:"transparent", border:"none", color:"rgba(30,90,30,0.5)", fontSize:13, cursor:"pointer" }}>Niet nu</button>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {showShare && shareProduct && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:100, display:"flex", alignItems:"flex-end" }} onClick={()=>setShowShare(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:430, margin:"0 auto", background:"#e8f5e8", borderRadius:"24px 24px 0 0", padding:28, border:"1px solid rgba(34,139,34,0.2)" }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 6px", fontSize:20, color:"#1a3a1a" }}>📤 Deel resultaat</h3>
            <p style={{ margin:"0 0 18px", fontSize:13, color:"rgba(30,90,30,0.6)" }}>Deel de uitslag van <strong>{shareProduct.product}</strong> met vrienden of familie</p>
            <div style={{ background:"rgba(45,158,107,0.08)", borderRadius:14, padding:16, marginBottom:16, border:"1px solid rgba(45,158,107,0.2)" }}>
              <p style={{ margin:"0 0 4px", fontWeight:700, fontSize:15, color:"#1a3a1a" }}>🥗 VitaalCheck resultaat</p>
              <p style={{ margin:"0 0 6px", fontSize:13, color:"rgba(30,90,30,0.6)" }}>Product: {shareProduct.product}</p>
              <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.5)" }}>Gecheckt via VitaalCheck — de app van Amanda, erkend leefstijlcoach</p>
            </div>
            {[["📱 WhatsApp","#25d366"],["📸 Instagram Stories","#e1306c"],["📋 Kopieer tekst","#2d9e6b"]].map(([label, color]) => (
              <button key={label} onClick={()=>setShowShare(false)} style={{ width:"100%", marginBottom:8, padding:13, borderRadius:12, border:"none", background:color, color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer" }}>{label}</button>
            ))}
            <button onClick={()=>setShowShare(false)} style={{ width:"100%", padding:10, background:"transparent", border:"none", color:"rgba(30,90,30,0.4)", fontSize:13, cursor:"pointer" }}>Annuleren</button>
          </div>
        </div>
      )}

      {/* FAQ MODAL */}
      {showFAQ && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:100, display:"flex", alignItems:"flex-end" }} onClick={()=>setShowFAQ(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:430, margin:"0 auto", background:"#e8f5e8", borderRadius:"24px 24px 0 0", padding:28, maxHeight:"80vh", overflowY:"auto", border:"1px solid rgba(34,139,34,0.2)" }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 18px", fontSize:22, color:"#1a3a1a" }}>❓ Veelgestelde vragen</h3>
            {FAQ.map((item,i) => (
              <div key={i} style={{ background:"rgba(45,158,107,0.07)", borderRadius:12, padding:14, marginBottom:10, border:"1px solid rgba(45,158,107,0.15)" }}>
                <p style={{ margin:"0 0 6px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>{item.q}</p>
                <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.65)", lineHeight:1.6 }}>{item.a}</p>
              </div>
            ))}
            <button onClick={()=>setShowFAQ(false)} style={{ width:"100%", marginTop:6, padding:13, borderRadius:12, border:"none", background:"#2d9e6b", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer" }}>Sluiten</button>
          </div>
        </div>
      )}

      {/* DISCLAIMER MODAL */}
      {showDisclaimer && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:100, display:"flex", alignItems:"flex-end" }} onClick={()=>setShowDisclaimer(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:430, margin:"0 auto", background:"#e8f5e8", borderRadius:"24px 24px 0 0", padding:28, maxHeight:"80vh", overflowY:"auto", border:"1px solid rgba(34,139,34,0.2)" }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 6px", fontSize:22, color:"#1a3a1a" }}>⚕️ Disclaimer</h3>
            <p style={{ margin:"0 0 18px", fontSize:12, color:"rgba(30,90,30,0.5)" }}>Laatste update: april 2025</p>
            {[
              ["📋 Informatief gebruik","VitaalCheck is uitsluitend bedoeld voor informatieve doeleinden. De informatie in deze app vervangt geen professioneel medisch, diëtistisch of farmaceutisch advies, diagnose of behandeling."],
              ["👩‍⚕️ Raadpleeg een professional","Raadpleeg altijd een gekwalificeerde zorgverlener, arts of diëtist bij vragen over jouw persoonlijke gezondheidssituatie, medicijngebruik of dieet."],
              ["🤰 Zwangerschap","De zwangerschapsinformatie is gebaseerd op richtlijnen van het Voedingscentrum. Raadpleeg altijd je verloskundige of gynaecoloog voor persoonlijk advies."],
              ["⚠️ Allergieën","De allergie-informatie is indicatief. Controleer altijd zelf de etiketten van producten. Producenten kunnen ingrediënten wijzigen."],
              ["🔒 Privacy","VitaalCheck verzamelt geen persoonlijke gegevens zonder toestemming. Berichten aan Amanda worden vertrouwelijk behandeld en niet gedeeld met derden. Je gegevens worden opgeslagen conform de AVG/GDPR."],
              ["©️ Auteursrecht","Alle content, teksten en functionaliteit in VitaalCheck zijn eigendom van Amanda. Niets mag worden gereproduceerd zonder toestemming."],
            ].map(([title, text]) => (
              <div key={title} style={{ marginBottom:14 }}>
                <p style={{ margin:"0 0 4px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>{title}</p>
                <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.65)", lineHeight:1.6 }}>{text}</p>
              </div>
            ))}
            <button onClick={()=>setShowDisclaimer(false)} style={{ width:"100%", marginTop:6, padding:13, borderRadius:12, border:"none", background:"#2d9e6b", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer" }}>Begrepen</button>
          </div>
        </div>
      )}

      {/* MEAL PICKER MODAL */}
      {mealPicker && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:100, display:"flex", alignItems:"flex-end" }} onClick={()=>setMealPicker(null)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:430, margin:"0 auto", background:"#e8f5e8", borderRadius:"24px 24px 0 0", padding:"24px 20px 32px", maxHeight:"85vh", overflowY:"auto", border:"1px solid rgba(34,139,34,0.2)" }}>
            
            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 2px", fontSize:20, color:"#1a3a1a" }}>
                  {mealPicker.meal} — {mealPicker.day}
                </h3>
                <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.5)" }}>Kies hoe je deze maaltijd wil toevoegen</p>
              </div>
              <button onClick={()=>setMealPicker(null)} style={{ background:"rgba(34,139,34,0.1)", border:"none", borderRadius:8, width:32, height:32, fontSize:16, cursor:"pointer", color:"#2d9e6b" }}>✕</button>
            </div>

            {/* Tab switcher */}
            <div style={{ display:"flex", background:"rgba(34,139,34,0.08)", borderRadius:12, padding:3, marginBottom:16, gap:2 }}>
              {[["recept","🍳 Recept"],["url","🔗 URL"],["producten","🥘 Producten"]].map(([id,label]) => (
                <button key={id} onClick={()=>setMealPickerTab(id)} style={{ flex:1, padding:"8px 4px", border:"none", borderRadius:9, cursor:"pointer", background:mealPickerTab===id?"rgba(45,158,107,0.2)":"transparent", color:mealPickerTab===id?"#2d9e6b":"rgba(30,90,30,0.5)", fontSize:12, fontWeight:mealPickerTab===id?700:400, transition:"all 0.15s" }}>{label}</button>
              ))}
            </div>

            {/* TAB: Recept uit app */}
            {mealPickerTab==="recept" && (
              <div>
                <p style={{ margin:"0 0 10px", fontSize:12, color:"rgba(30,90,30,0.55)" }}>Kies een recept uit de app:</p>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                  {["keto","vegan","mediterraan","paleo","caloriearm","punten","fodmap","antiinfl","dash","glutenvrij","lactosevrij","suikervrij"].map(d => {
                    const diet=DIETS.find(x=>x.id===d); if(!diet) return null;
                    return <button key={d} onClick={()=>setMenuDiet(d)} style={{ padding:"4px 10px", borderRadius:16, border:`1.5px solid ${menuDiet===d?diet.color:"rgba(34,139,34,0.18)"}`, background:menuDiet===d?`${diet.color}15`:"transparent", color:menuDiet===d?diet.color:"rgba(30,90,30,0.5)", fontSize:11, cursor:"pointer", fontWeight:menuDiet===d?600:400 }}>{diet.emoji} {diet.label}</button>;
                  })}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:300, overflowY:"auto" }}>
                  {(RECIPES[menuDiet]||[]).map((rec,i) => (
                    <div key={i} onClick={()=>{ addToMenu(mealPicker.day, mealPicker.meal, rec); setMealPicker(null); }} style={{ background:"rgba(45,158,107,0.07)", borderRadius:12, padding:"11px 14px", cursor:"pointer", border:"1px solid rgba(45,158,107,0.15)", display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ flex:1 }}>
                        <p style={{ margin:"0 0 2px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>{rec.name}</p>
                        <p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.5)" }}>⏱ {rec.time} · 🔥 {rec.cal} kcal</p>
                      </div>
                      <span style={{ color:"#2d9e6b", fontSize:18 }}>+</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: URL van internet */}
            {mealPickerTab==="url" && (
              <div>
                <p style={{ margin:"0 0 6px", fontSize:12, color:"rgba(30,90,30,0.55)" }}>Plak de URL van een recept van internet:</p>
                <p style={{ margin:"0 0 12px", fontSize:11, color:"rgba(30,90,30,0.4)" }}>Bijv. van 15gram.nl, Allerhande, Jumbo, HelloFresh, etc.</p>
                <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                  <input value={mealUrl} onChange={e=>setMealUrl(e.target.value)}
                    placeholder="https://www.15gram.nl/recept/..."
                    style={{ flex:1, padding:"12px 14px", borderRadius:12, border:"1px solid rgba(45,158,107,0.3)", background:"rgba(255,255,255,0.9)", fontSize:13, outline:"none", color:"#1a3a1a" }} />
                </div>
                <button onClick={()=>fetchRecipeFromUrl(mealUrl)} disabled={!mealUrl.trim() || mealUrlLoading}
                  style={{ width:"100%", padding:13, borderRadius:12, border:"none", background: mealUrl.trim() ? "linear-gradient(135deg,#2d9e6b,#a8e6cf)" : "rgba(34,139,34,0.1)", color: mealUrl.trim() ? "#fff" : "rgba(30,90,30,0.35)", fontSize:14, fontWeight:700, cursor: mealUrl.trim() ? "pointer" : "default" }}>
                  {mealUrlLoading ? "⏳ Laden..." : "➕ Toevoegen aan schema"}
                </button>
                <div style={{ marginTop:14 }}>
                  <p style={{ margin:"0 0 8px", fontSize:11, color:"rgba(30,90,30,0.45)", textTransform:"uppercase", letterSpacing:1 }}>Populaire receptsites</p>
                  {[["15gram.nl","https://www.15gram.nl"],["Allerhande","https://www.ah.nl/allerhande"],["Jumbo recepten","https://www.jumbo.com/recepten"],["HelloFresh","https://www.hellofresh.nl/recipes"]].map(([name, url]) => (
                    <div key={name} onClick={()=>setMealUrl(url+"/")} style={{ padding:"9px 12px", borderRadius:10, background:"rgba(45,158,107,0.07)", border:"1px solid rgba(45,158,107,0.15)", marginBottom:6, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:13, color:"#1a3a1a" }}>🔗 {name}</span>
                      <span style={{ fontSize:11, color:"#2d9e6b" }}>Gebruik →</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Losse producten */}
            {mealPickerTab==="producten" && (
              <div>
                <p style={{ margin:"0 0 10px", fontSize:12, color:"rgba(30,90,30,0.55)" }}>Zoek producten en stel je eigen maaltijd samen:</p>
                <div style={{ position:"relative", marginBottom:10 }}>
                  <input value={mealProductSearch} onChange={e=>searchMealProducts(e.target.value)}
                    placeholder="Zoek product... bijv. zalm, rijst, spinazie"
                    style={{ width:"100%", padding:"11px 14px", borderRadius:12, border:"1px solid rgba(45,158,107,0.3)", background:"rgba(255,255,255,0.9)", fontSize:13, outline:"none", color:"#1a3a1a", boxSizing:"border-box" }} />
                  {mealProductResults.length > 0 && (
                    <div style={{ position:"absolute", top:"100%", left:0, right:0, background:"#fff", borderRadius:10, border:"1px solid rgba(45,158,107,0.2)", overflow:"hidden", zIndex:10, boxShadow:"0 4px 12px rgba(0,0,0,0.1)" }}>
                      {mealProductResults.map(p => (
                        <div key={p} onClick={()=>addProductToCustomMeal(p)} style={{ padding:"10px 14px", cursor:"pointer", borderBottom:"1px solid rgba(45,158,107,0.08)", fontSize:13, color:"#1a3a1a", display:"flex", justifyContent:"space-between" }}>
                          {p} <span style={{ color:"#2d9e6b" }}>+</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected products */}
                {customMealItems.length > 0 && (
                  <div style={{ background:"rgba(45,158,107,0.07)", borderRadius:12, padding:12, marginBottom:12, border:"1px solid rgba(45,158,107,0.15)" }}>
                    <p style={{ margin:"0 0 8px", fontSize:11, color:"rgba(30,90,30,0.55)", fontWeight:600 }}>Jouw maaltijd:</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {customMealItems.map(item => (
                        <span key={item} onClick={()=>setCustomMealItems(p=>p.filter(x=>x!==item))} style={{ background:"rgba(45,158,107,0.15)", borderRadius:16, padding:"4px 10px", fontSize:12, color:"#2d9e6b", cursor:"pointer", border:"1px solid rgba(45,158,107,0.25)", display:"flex", alignItems:"center", gap:5 }}>
                          {item} <span style={{ fontSize:10, opacity:0.7 }}>✕</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={saveCustomMeal} disabled={customMealItems.length===0}
                  style={{ width:"100%", padding:13, borderRadius:12, border:"none", background: customMealItems.length>0 ? "linear-gradient(135deg,#2d9e6b,#a8e6cf)" : "rgba(34,139,34,0.1)", color: customMealItems.length>0 ? "#fff" : "rgba(30,90,30,0.35)", fontSize:14, fontWeight:700, cursor: customMealItems.length>0 ? "pointer" : "default" }}>
                  {customMealItems.length>0 ? `➕ Voeg ${customMealItems.length} product${customMealItems.length!==1?"en":""} toe` : "Zoek eerst producten"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUPPLEMENT DETAIL MODAL */}
      {showSuppDetail && (() => {
        const supp = SUPPLEMENTS.find(s=>s.id===showSuppDetail);
        if (!supp) return null;
        return (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:100, display:"flex", alignItems:"flex-end" }} onClick={()=>setShowSuppDetail(null)}>
            <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:430, margin:"0 auto", background:"#e8f5e8", borderRadius:"24px 24px 0 0", padding:28, maxHeight:"85vh", overflowY:"auto", border:"1px solid rgba(34,139,34,0.2)" }}>
              
              <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:16 }}>
                <div style={{ width:56, height:56, borderRadius:16, background:`${supp.color}18`, border:`2px solid ${supp.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>{supp.emoji}</div>
                <div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 3px", fontSize:22, color:"#1a3a1a" }}>{supp.name}</h3>
                  <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.5)" }}>Orthomoleculair advies van Amanda</p>
                </div>
              </div>

              <div style={{ background:"rgba(34,139,34,0.06)", borderRadius:13, padding:14, marginBottom:12, border:"1px solid rgba(34,139,34,0.12)" }}>
                <p style={{ margin:"0 0 4px", fontSize:12, fontWeight:700, color:"#2d9e6b" }}>Wat doet het?</p>
                <p style={{ margin:0, fontSize:13, color:"rgba(30,90,30,0.75)", lineHeight:1.6 }}>{supp.beschrijving}</p>
              </div>

              <div style={{ background:"rgba(34,139,34,0.06)", borderRadius:13, padding:14, marginBottom:12, border:"1px solid rgba(34,139,34,0.12)" }}>
                <p style={{ margin:"0 0 4px", fontSize:12, fontWeight:700, color:"#2d9e6b" }}>💊 Dosering</p>
                <p style={{ margin:0, fontSize:13, color:"rgba(30,90,30,0.75)", lineHeight:1.6 }}>{supp.dosering}</p>
              </div>

              <div style={{ background:"rgba(192,132,252,0.08)", borderRadius:13, padding:14, marginBottom:12, border:"1px solid rgba(192,132,252,0.2)" }}>
                <p style={{ margin:"0 0 4px", fontSize:12, fontWeight:700, color:"#c084fc" }}>💡 Amanda's tip</p>
                <p style={{ margin:0, fontSize:13, color:"rgba(30,90,30,0.75)", lineHeight:1.6 }}>{supp.tip}</p>
              </div>

              {supp.interacties && (
                <div style={{ background:"rgba(249,115,22,0.08)", borderRadius:13, padding:14, marginBottom:12, border:"1px solid rgba(249,115,22,0.2)" }}>
                  <p style={{ margin:"0 0 4px", fontSize:12, fontWeight:700, color:"#fb923c" }}>⚠️ Let op</p>
                  <p style={{ margin:0, fontSize:13, color:"rgba(30,90,30,0.75)", lineHeight:1.6 }}>{supp.interacties}</p>
                </div>
              )}

              {!supp.geschiktVoor.zwanger && (
                <div style={{ background:"rgba(236,72,153,0.08)", borderRadius:13, padding:14, marginBottom:12, border:"1px solid rgba(236,72,153,0.2)" }}>
                  <p style={{ margin:"0 0 4px", fontSize:12, fontWeight:700, color:"#ec4899" }}>🤰 Zwangerschap</p>
                  <p style={{ margin:0, fontSize:13, color:"rgba(30,90,30,0.75)", lineHeight:1.6 }}>Dit supplement wordt afgeraden tijdens de zwangerschap. Overleg altijd met je verloskundige of arts.</p>
                </div>
              )}

              <div style={{ background:"rgba(34,139,34,0.05)", borderRadius:13, padding:14, marginBottom:16, border:"1px solid rgba(34,139,34,0.1)" }}>
                <p style={{ margin:"0 0 4px", fontSize:12, fontWeight:700, color:"#2d9e6b" }}>Geschikt bij</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:6 }}>
                  {supp.geschiktVoor.dieten.map(d => { const diet=DIETS.find(x=>x.id===d); return diet?<span key={d} style={{ fontSize:11, background:`${diet.color}15`, color:diet.color, borderRadius:8, padding:"3px 9px", border:`1px solid ${diet.color}30` }}>{diet.emoji} {diet.label}</span>:null; })}
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {supp.geschiktVoor.doelen.map(d => { const gt=GOAL_TYPES.find(x=>x.id===d); return gt?<span key={d} style={{ fontSize:11, background:`${gt.color}15`, color:gt.color, borderRadius:8, padding:"3px 9px", border:`1px solid ${gt.color}30` }}>{gt.emoji} {gt.label}</span>:null; })}
                  {supp.geschiktVoor.zwanger && <span style={{ fontSize:11, background:"rgba(236,72,153,0.12)", color:"#ec4899", borderRadius:8, padding:"3px 9px", border:"1px solid rgba(236,72,153,0.25)" }}>🤰 Zwanger</span>}
                </div>
              </div>

              <p style={{ margin:"0 0 14px", fontSize:11, color:"rgba(30,90,30,0.35)", textAlign:"center", lineHeight:1.5 }}>
                ⚕️ Dit is informatief advies van Amanda als orthomoleculair therapeut. Raadpleeg altijd je arts bij medische vragen of medicijngebruik.
              </p>

              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setShowSuppDetail(null)} style={{ flex:1, padding:13, borderRadius:12, border:"none", background:"#2d9e6b", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>Sluiten</button>
                <button onClick={()=>{ setShowSuppDetail(null); setSuppTab("vraag"); setTab("supplementen"); }} style={{ flex:1, padding:13, borderRadius:12, border:"1px solid rgba(192,132,252,0.3)", background:"rgba(192,132,252,0.08)", color:"#c084fc", fontSize:13, fontWeight:600, cursor:"pointer" }}>💬 Vraag stellen</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* SHARE APP MODAL */}
      {showShareApp && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:100, display:"flex", alignItems:"flex-end" }} onClick={()=>setShowShareApp(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:430, margin:"0 auto", background:"#e8f5e8", borderRadius:"24px 24px 0 0", padding:28, border:"1px solid rgba(34,139,34,0.2)" }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 6px", fontSize:22, color:"#1a3a1a" }}>📲 Deel VitaalCheck</h3>
            <p style={{ margin:"0 0 18px", fontSize:13, color:"rgba(30,90,30,0.6)" }}>Help anderen gezonder te eten — deel de app!</p>
            <div style={{ background:"rgba(45,158,107,0.08)", borderRadius:14, padding:14, marginBottom:16, border:"1px solid rgba(45,158,107,0.2)" }}>
              <p style={{ margin:"0 0 6px", fontWeight:700, fontSize:14, color:"#1a3a1a" }}>💚 VitaalCheck — Jouw leefstijl app</p>
              <p style={{ margin:0, fontSize:13, color:"rgba(30,90,30,0.65)", lineHeight:1.6 }}>Check producten op dieet, allergie & zwangerschap. Gemaakt door Amanda, erkend leefstijlcoach. Probeer het gratis! 🥗</p>
            </div>
            {[["📱 Deel via WhatsApp","#25d366"],["📸 Deel via Instagram","#e1306c"],["📧 Deel via e-mail","#2d9e6b"],["📋 Kopieer tekst","#64748b"]].map(([label,color]) => (
              <button key={label} onClick={()=>setShowShareApp(false)} style={{ width:"100%", marginBottom:8, padding:13, borderRadius:12, border:"none", background:color, color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer" }}>{label}</button>
            ))}
            <button onClick={()=>setShowShareApp(false)} style={{ width:"100%", padding:10, background:"transparent", border:"none", color:"rgba(30,90,30,0.4)", fontSize:13, cursor:"pointer" }}>Sluiten</button>
          </div>
        </div>
      )}

      {/* REQUEST PRODUCT MODAL */}
      {showRequestProduct && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:100, display:"flex", alignItems:"flex-end" }} onClick={()=>setShowRequestProduct(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:430, margin:"0 auto", background:"#e8f5e8", borderRadius:"24px 24px 0 0", padding:28, border:"1px solid rgba(34,139,34,0.2)" }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 6px", fontSize:22, color:"#1a3a1a" }}>📩 Product aanvragen</h3>
            <p style={{ margin:"0 0 16px", fontSize:13, color:"rgba(30,90,30,0.6)" }}>Staat jouw product er niet in? Vraag Amanda om het toe te voegen!</p>
            <input value={requestProductName} onChange={e=>setRequestProductName(e.target.value)}
              placeholder="Naam van het product..."
              style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"1px solid rgba(45,158,107,0.3)", background:"rgba(255,255,255,0.9)", fontSize:14, outline:"none", color:"#1a3a1a", marginBottom:10, boxSizing:"border-box" }} />
            <button onClick={()=>{
              if(requestProductName.trim()) {
                setRequestedProducts(p=>[...p, { name:requestProductName, date: new Date().toLocaleDateString("nl-NL") }]);
                setShowRequestProduct(false); setRequestProductName("");
                alert(`Bedankt! "${requestProductName}" is aangevraagd. Amanda voegt het zo snel mogelijk toe.`);
              }
            }} disabled={!requestProductName.trim()} style={{ width:"100%", padding:13, borderRadius:12, border:"none", background: requestProductName.trim()?"linear-gradient(135deg,#2d9e6b,#a8e6cf)":"rgba(34,139,34,0.1)", color: requestProductName.trim()?"#fff":"rgba(30,90,30,0.35)", fontSize:14, fontWeight:700, cursor: requestProductName.trim()?"pointer":"default" }}>
              Aanvraag versturen →
            </button>
            {requestedProducts.length > 0 && (
              <div style={{ marginTop:14 }}>
                <p style={{ margin:"0 0 8px", fontSize:11, color:"rgba(30,90,30,0.5)", textTransform:"uppercase" }}>Eerder aangevraagd</p>
                {requestedProducts.slice(-3).map((r,i) => <p key={i} style={{ margin:"0 0 4px", fontSize:12, color:"rgba(30,90,30,0.55)" }}>• {r.name} <span style={{ opacity:0.5 }}>({r.date})</span></p>)}
              </div>
            )}
            <button onClick={()=>setShowRequestProduct(false)} style={{ width:"100%", marginTop:10, padding:10, background:"transparent", border:"none", color:"rgba(30,90,30,0.4)", fontSize:13, cursor:"pointer" }}>Sluiten</button>
          </div>
        </div>
      )}

      {/* ADD GOAL MODAL */}
      {showAddGoal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:100, display:"flex", alignItems:"flex-end" }} onClick={()=>setShowAddGoal(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:430, margin:"0 auto", background:"#e8f5e8", borderRadius:"24px 24px 0 0", padding:24, maxHeight:"88vh", overflowY:"auto", border:"1px solid rgba(34,139,34,0.2)" }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 4px", fontSize:22, color:"#1a3a1a" }}>🎯 Nieuw doel</h3>
            <p style={{ margin:"0 0 16px", fontSize:13, color:"rgba(30,90,30,0.55)" }}>Waar wil jij de komende tijd aan werken?</p>
            
            {/* Type kiezen */}
            <p style={{ margin:"0 0 8px", fontSize:12, color:"rgba(30,90,30,0.55)", fontWeight:600 }}>Type doel:</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:14 }}>
              {GOAL_TYPES.map(gt => (
                <button key={gt.id} onClick={()=>setNewGoal(p=>({...p,type:gt.id,unit:gt.unit}))} style={{ padding:"10px 6px", borderRadius:12, border:`1.5px solid ${newGoal.type===gt.id?gt.color:"rgba(34,139,34,0.2)"}`, background:newGoal.type===gt.id?`${gt.color}18`:"rgba(255,255,255,0.5)", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <span style={{ fontSize:22 }}>{gt.emoji}</span>
                  <span style={{ fontSize:11, color:newGoal.type===gt.id?gt.color:"rgba(30,90,30,0.6)", fontWeight:newGoal.type===gt.id?700:400 }}>{gt.label}</span>
                </button>
              ))}
            </div>

            {/* Omschrijving */}
            <p style={{ margin:"0 0 6px", fontSize:12, color:"rgba(30,90,30,0.55)", fontWeight:600 }}>Omschrijving:</p>
            <input value={newGoal.label} onChange={e=>setNewGoal(p=>({...p,label:e.target.value}))}
              placeholder={GOAL_TYPES.find(x=>x.id===newGoal.type)?.placeholder}
              style={{ width:"100%", padding:"11px 14px", borderRadius:12, border:"1px solid rgba(45,158,107,0.3)", background:"rgba(255,255,255,0.7)", fontSize:13, outline:"none", marginBottom:10, display:"block", color:"#1a3a1a", boxSizing:"border-box" }} />

            {/* Doel + eenheid */}
            <div style={{ display:"flex", gap:8, marginBottom:10 }}>
              <div style={{ flex:1 }}>
                <p style={{ margin:"0 0 6px", fontSize:12, color:"rgba(30,90,30,0.55)", fontWeight:600 }}>Streefwaarde:</p>
                <input value={newGoal.target} onChange={e=>setNewGoal(p=>({...p,target:e.target.value}))} placeholder="Bijv. 8"
                  style={{ width:"100%", padding:"11px 14px", borderRadius:12, border:"1px solid rgba(45,158,107,0.3)", background:"rgba(255,255,255,0.9)", fontSize:13, outline:"none", color:"#1a3a1a", boxSizing:"border-box" }} />
              </div>
              <div style={{ flex:1 }}>
                <p style={{ margin:"0 0 6px", fontSize:12, color:"rgba(30,90,30,0.55)", fontWeight:600 }}>Eenheid:</p>
                <input value={newGoal.unit} onChange={e=>setNewGoal(p=>({...p,unit:e.target.value}))}
                  style={{ width:"100%", padding:"11px 14px", borderRadius:12, border:"1px solid rgba(45,158,107,0.3)", background:"rgba(255,255,255,0.9)", fontSize:13, outline:"none", color:"#1a3a1a", boxSizing:"border-box" }} />
              </div>
            </div>

            {/* Looptijd in dagen */}
            <p style={{ margin:"0 0 8px", fontSize:12, color:"rgba(30,90,30,0.55)", fontWeight:600 }}>Hoeveel dagen wil je dit volhouden?</p>
            <div style={{ display:"flex", gap:7, marginBottom:10, flexWrap:"wrap" }}>
              {[7,14,21,30,60,90].map(d => (
                <button key={d} onClick={()=>setNewGoal(p=>({...p,days:d}))} style={{ padding:"7px 14px", borderRadius:20, border:`1.5px solid ${newGoal.days===d?"#2d9e6b":"rgba(34,139,34,0.2)"}`, background:newGoal.days===d?"rgba(45,158,107,0.15)":"rgba(255,255,255,0.5)", color:newGoal.days===d?"#2d9e6b":"rgba(30,90,30,0.6)", fontSize:12, cursor:"pointer", fontWeight:newGoal.days===d?700:400 }}>{d} dagen</button>
              ))}
            </div>

            {/* Dieet koppelen (alleen bij voeding) */}
            {newGoal.type==="voeding" && (
              <div style={{ marginBottom:10 }}>
                <p style={{ margin:"0 0 8px", fontSize:12, color:"rgba(30,90,30,0.55)", fontWeight:600 }}>Koppel een dieet (optioneel):</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {DIETS.map(d => <button key={d.id} onClick={()=>setNewGoal(p=>({...p,dieet:p.dieet===d.id?"":d.id}))} style={{ padding:"5px 11px", borderRadius:16, border:`1.5px solid ${newGoal.dieet===d.id?d.color:"rgba(34,139,34,0.2)"}`, background:newGoal.dieet===d.id?`${d.color}18`:"transparent", color:newGoal.dieet===d.id?d.color:"rgba(30,90,30,0.5)", fontSize:11, cursor:"pointer" }}>{d.emoji} {d.label}</button>)}
                </div>
              </div>
            )}

            <button onClick={()=>{
              if(!newGoal.label.trim()||!newGoal.target) return;
              const goal = { ...newGoal, id:Date.now(), startDate:new Date().toLocaleDateString("nl-NL"), dailyLogs:[], finalEval:null, sharedWithPro:false };
              setGoals(p=>[...p,goal]);
              setShowAddGoal(false);
            }} disabled={!newGoal.label.trim()||!newGoal.target}
              style={{ width:"100%", padding:14, borderRadius:14, border:"none", background:newGoal.label&&newGoal.target?"linear-gradient(135deg,#2d9e6b,#a8e6cf)":"rgba(34,139,34,0.1)", color:newGoal.label&&newGoal.target?"#fff":"rgba(30,90,30,0.35)", fontSize:14, fontWeight:700, cursor:newGoal.label&&newGoal.target?"pointer":"default" }}>
              🎯 Doel opslaan
            </button>
          </div>
        </div>
      )}

      {/* GOAL DETAIL MODAL */}
      {showGoalDetail !== null && goals[showGoalDetail] && (() => {
        const goal = goals[showGoalDetail];
        const gt = GOAL_TYPES.find(x=>x.id===goal.type);
        const done = goal.dailyLogs.length >= goal.days;
        const pct = Math.min(100,Math.round((goal.dailyLogs.length/goal.days)*100));
        return (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:100, display:"flex", alignItems:"flex-end" }} onClick={()=>setShowGoalDetail(null)}>
            <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:430, margin:"0 auto", background:"#e8f5e8", borderRadius:"24px 24px 0 0", padding:24, maxHeight:"88vh", overflowY:"auto", border:"1px solid rgba(34,139,34,0.2)" }}>
              
              {/* Header */}
              <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
                <div style={{ width:46, height:46, borderRadius:12, background:`${gt?.color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{gt?.emoji}</div>
                <div style={{ flex:1 }}>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 2px", fontSize:20, color:"#1a3a1a" }}>{goal.label}</h3>
                  <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.5)" }}>Gestart: {goal.startDate} · {goal.target} {goal.unit}</p>
                </div>
                <span style={{ fontSize:12, background:done?"rgba(34,197,94,0.15)":"rgba(34,139,34,0.1)", color:done?"#22c55e":"rgba(30,90,30,0.6)", borderRadius:10, padding:"3px 10px", border:`1px solid ${done?"rgba(34,197,94,0.3)":"rgba(34,139,34,0.2)"}` }}>{done?"✅ Voltooid":`${pct}%`}</span>
              </div>

              {/* Progress */}
              <div style={{ background:"rgba(34,139,34,0.06)", borderRadius:12, padding:14, marginBottom:12, border:"1px solid rgba(34,139,34,0.12)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#1a3a1a" }}>📊 Voortgang</p>
                  <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.55)" }}>{goal.dailyLogs.length} van {goal.days} dagen</p>
                </div>
                <div style={{ background:"rgba(34,139,34,0.1)", borderRadius:6, height:10, overflow:"hidden", marginBottom:8 }}>
                  <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${gt?.color},#a8e6cf)`, borderRadius:6 }} />
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                  {Array.from({length:goal.days}).map((_,i) => (
                    <div key={i} style={{ width:20, height:20, borderRadius:5, background:i<goal.dailyLogs.length?`${gt?.color}80`:"rgba(34,139,34,0.1)", border:`1px solid ${i<goal.dailyLogs.length?gt?.color:"rgba(34,139,34,0.2)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9 }}>
                      {i<goal.dailyLogs.length?"✓":""}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dagelijkse evaluatie */}
              <div style={{ background:"rgba(34,139,34,0.06)", borderRadius:12, padding:14, marginBottom:12, border:"1px solid rgba(34,139,34,0.12)" }}>
                <p style={{ margin:"0 0 10px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>📅 Dagelijkse evaluatie</p>
                {goal.dailyLogs.length === 0
                  ? <p style={{ margin:0, fontSize:12, color:"rgba(30,90,30,0.45)" }}>Nog geen dagelijkse logs.</p>
                  : [...goal.dailyLogs].reverse().slice(0,5).map((log,i) => (
                      <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:8, background:"rgba(255,255,255,0.5)", borderRadius:10, padding:"9px 12px" }}>
                        <div>
                          <p style={{ margin:"0 0 2px", fontSize:12, fontWeight:600, color:"#1a3a1a" }}>{log.dag}</p>
                          {log.score && <div style={{ display:"flex", gap:5 }}>{[1,2,3,4,5].map(s=><span key={s} style={{ fontSize:14, opacity:s<=log.score?1:0.25 }}>⭐</span>)}</div>}
                          {log.comment && <p style={{ margin:"3px 0 0", fontSize:11, color:"rgba(30,90,30,0.6)", fontStyle:"italic" }}>"{log.comment}"</p>}
                        </div>
                      </div>
                    ))
                }
                {/* Add daily evaluation */}
                {!done && (
                  <div style={{ marginTop:10, background:"rgba(45,158,107,0.08)", borderRadius:10, padding:12, border:"1px solid rgba(45,158,107,0.15)" }}>
                    <p style={{ margin:"0 0 8px", fontSize:12, fontWeight:600, color:"#1a3a1a" }}>Hoe ging het vandaag?</p>
                    <div style={{ display:"flex", gap:6, marginBottom:8 }}>
                      {[1,2,3,4,5].map(s => (
                        <button key={s} onClick={()=>{ setGoals(p=>p.map((g,i)=>i===showGoalDetail?{...g,dailyLogs:[...g.dailyLogs.filter((_,li)=>li!==g.dailyLogs.length-1||g.dailyLogs[g.dailyLogs.length-1]?.score),{dag:new Date().toLocaleDateString("nl-NL",{weekday:"short",day:"numeric"}),score:s,comment:goalEvalComment}]}:g)); }}
                          style={{ flex:1, padding:"8px 0", borderRadius:8, border:"1px solid rgba(45,158,107,0.2)", background:"rgba(255,255,255,0.6)", cursor:"pointer", fontSize:16 }}>{"⭐".repeat(s)}</button>
                      ))}
                    </div>
                    <textarea value={goalEvalComment} onChange={e=>setGoalEvalComment(e.target.value)} placeholder="Wat ging goed? Wat was moeilijk?" rows={2}
                      style={{ width:"100%", padding:"9px 12px", borderRadius:10, border:"1px solid rgba(45,158,107,0.25)", background:"rgba(255,255,255,0.9)", fontSize:12, outline:"none", resize:"none", fontFamily:"inherit", color:"#1a3a1a", boxSizing:"border-box" }} />
                    <button onClick={()=>{
                      const entry={dag:new Date().toLocaleDateString("nl-NL",{weekday:"short",day:"numeric"}),score:3,comment:goalEvalComment};
                      setGoals(p=>p.map((g,i)=>i===showGoalDetail?{...g,dailyLogs:[...g.dailyLogs,entry]}:g));
                      setGoalEvalComment("");
                    }} style={{ width:"100%", marginTop:8, padding:10, borderRadius:10, border:"none", background:"#2d9e6b", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                      Sla evaluatie op ✓
                    </button>
                  </div>
                )}
              </div>

              {/* Eindevaluatie */}
              {done && (
                <div style={{ background:"rgba(34,197,94,0.07)", borderRadius:12, padding:14, marginBottom:12, border:"1px solid rgba(34,197,94,0.2)" }}>
                  <p style={{ margin:"0 0 10px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>🏁 Eindevaluatie</p>
                  {goal.finalEval
                    ? <div>
                        <p style={{ margin:"0 0 6px", fontSize:13, color:"rgba(30,90,30,0.75)", fontStyle:"italic" }}>"{goal.finalEval.comment}"</p>
                        <p style={{ margin:0, fontSize:11, color:"rgba(30,90,30,0.5)" }}>Gedeeld met coach: {goal.finalEval.shared?"✅ Ja":"Nee"}</p>
                      </div>
                    : <div>
                        <p style={{ margin:"0 0 8px", fontSize:12, color:"rgba(30,90,30,0.6)" }}>Gefeliciteerd! Schrijf je eindevaluatie:</p>
                        <textarea value={goalEvalComment} onChange={e=>setGoalEvalComment(e.target.value)}
                          placeholder="Hoe is het gegaan? Wat ging goed? Wat was moeilijk? Wat ga je anders doen?"
                          rows={4} style={{ width:"100%", padding:"11px 14px", borderRadius:12, border:"1px solid rgba(34,197,94,0.25)", background:"rgba(255,255,255,0.7)", fontSize:13, outline:"none", resize:"none", fontFamily:"inherit", color:"#1a3a1a", boxSizing:"border-box", marginBottom:10 }} />
                        <button onClick={()=>{ if(goalEvalComment.trim()){ setGoals(p=>p.map((g,i)=>i===showGoalDetail?{...g,finalEval:{comment:goalEvalComment,date:new Date().toLocaleDateString("nl-NL"),shared:false}}:g)); setGoalEvalComment(""); }}}
                          style={{ width:"100%", padding:12, borderRadius:12, border:"none", background:"linear-gradient(135deg,#2d9e6b,#a8e6cf)", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                          Sla eindevaluatie op →
                        </button>
                      </div>
                  }
                </div>
              )}

              {/* Deel met coach */}
              <div style={{ background:"rgba(99,102,241,0.06)", borderRadius:12, padding:14, marginBottom:12, border:"1px solid rgba(99,102,241,0.15)" }}>
                <p style={{ margin:"0 0 6px", fontSize:13, fontWeight:700, color:"#1a3a1a" }}>🏥 Deel met je coach</p>
                <p style={{ margin:"0 0 10px", fontSize:12, color:"rgba(30,90,30,0.55)", lineHeight:1.5 }}>Deel je voortgang en evaluaties met jouw diëtist of leefstijlcoach, zodat zij je gericht kunnen begeleiden op de moeilijke onderdelen.</p>
                {goal.sharedWithPro
                  ? <p style={{ margin:0, fontSize:13, color:"#818cf8", fontWeight:600 }}>✅ Al gedeeld met je coach</p>
                  : <button onClick={()=>{ setGoals(p=>p.map((g,i)=>i===showGoalDetail?{...g,sharedWithPro:true}:g)); alert("Jouw doel en voortgang zijn gedeeld met je coach!"); }}
                      style={{ width:"100%", padding:11, borderRadius:12, border:"none", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                      📤 Deel voortgang met coach
                    </button>
                }
              </div>

              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setShowGoalDetail(null)} style={{ flex:1, padding:12, borderRadius:12, border:"none", background:"#2d9e6b", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Sluiten</button>
                <button onClick={()=>{ setGoals(p=>p.filter((_,i)=>i!==showGoalDetail)); setShowGoalDetail(null); }} style={{ padding:"12px 16px", borderRadius:12, border:"1px solid rgba(239,68,68,0.3)", background:"rgba(239,68,68,0.08)", color:"#ef4444", fontSize:13, cursor:"pointer" }}>🗑️</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* LOGIN MODAL */}
      {showLogin && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:100, display:"flex", alignItems:"flex-end" }} onClick={()=>setShowLogin(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:430, margin:"0 auto", background:"#e8f5e8", borderRadius:"24px 24px 0 0", padding:28, border:"1px solid rgba(255,255,255,0.1)" }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 6px", fontSize:22 }}>{isRegister?"Account aanmaken":"Welkom terug"}</h2>
            <p style={{ color:"rgba(30,90,30,0.55)", fontSize:13, margin:"0 0 20px" }}>{isRegister?"Maak een gratis account aan":"Log in op je account"}</p>
            {isRegister && <input value={loginForm.name} onChange={e=>setLoginForm(p=>({...p,name:e.target.value}))} placeholder="Naam" style={{ width:"100%", padding:"12px 16px", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(34,139,34,0.09)", fontSize:14, outline:"none", marginBottom:10, display:"block" }} />}
            <input value={loginForm.email} onChange={e=>setLoginForm(p=>({...p,email:e.target.value}))} placeholder="E-mailadres" style={{ width:"100%", padding:"12px 16px", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(34,139,34,0.09)", fontSize:14, outline:"none", marginBottom:10, display:"block" }} />
            <input value={loginForm.password} onChange={e=>setLoginForm(p=>({...p,password:e.target.value}))} type="password" placeholder="Wachtwoord" style={{ width:"100%", padding:"12px 16px", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(34,139,34,0.09)", fontSize:14, outline:"none", marginBottom:16, display:"block" }} />
            <button onClick={handleLogin} style={{ width:"100%", padding:14, borderRadius:14, border:"none", background:"linear-gradient(135deg,#56cfe1,#b8f0b0)", color:"#f4faf4", fontSize:15, fontWeight:700, cursor:"pointer" }}>{isRegister?"Account aanmaken":"Inloggen"}</button>
            <button onClick={()=>setIsRegister(p=>!p)} style={{ width:"100%", marginTop:10, padding:10, background:"transparent", border:"none", color:"rgba(30,90,30,0.55)", fontSize:13, cursor:"pointer" }}>{isRegister?"Al een account? Inloggen":"Nog geen account? Registreer"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
