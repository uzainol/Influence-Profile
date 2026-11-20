/* Influence Self-Audit · Full report engine (Growth Impact Group)
   Builds the paid, multi-page report from a participant's scores and the private content library.
   The content library lives in Firestore (readable by the admin only) and is passed in as `C`. */
(function () {
  var CSS = "\n:root{--green:#36AA54;--ink:#1A1A1A;--muted:#5F656C;--grey:#8A9099;--hair:#DDE0E3;--frame:#CBD0D4;--tint:#F2F8F4;}\n@page{size:A4;margin:16mm 16mm 18mm}\n*{box-sizing:border-box}\nbody{margin:0;font-family:Arial,Helvetica,sans-serif;color:var(--ink);font-size:10.5pt;line-height:1.5}\nh1,h2,h3,.k,.lab,th{font-family:\"Arial Narrow\",Arial,sans-serif}\n.page{page-break-after:always}\n.page:last-child{page-break-after:auto}\n.k{font-weight:700;font-size:8.5pt;letter-spacing:.2em;color:var(--green);text-transform:uppercase;display:flex;align-items:center;gap:8px}\n.k:before{content:\"\";width:9px;height:9px;background:var(--green);display:inline-block}\nh2{font-size:24pt;line-height:1.02;text-transform:uppercase;margin:8px 0 10px}\nh3{font-size:15pt;text-transform:uppercase;margin:0}\np{margin:0 0 9px}\n.lead{font-size:11.5pt;color:var(--muted);margin-bottom:14px}\n.muted{color:var(--muted)}\n.small{font-size:8.5pt;color:var(--grey)}\n/* cover */\n.cover{height:255mm;display:flex;flex-direction:column}\n.cover img{width:120px}\n.cover .t{margin-top:62mm}\n.cover h1{font-size:44pt;line-height:.95;text-transform:uppercase;margin:12px 0 0}\n.cover h1 span{color:var(--green)}\n.cover .who{margin-top:22px;font-size:15pt;font-weight:700}\n.cover .meta{color:var(--muted);margin-top:4px}\n.cover .foot{margin-top:auto;border-top:1px solid var(--hair);padding-top:10px;font-size:8.5pt;color:var(--grey)}\n.sample{display:inline-block;border:1px solid var(--green);color:var(--green);font-weight:700;font-size:8pt;letter-spacing:.16em;padding:3px 8px;margin-top:18px}\n/* glance */\n.glance{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px}\n.gbox{border:1px solid var(--hair);padding:12px 14px}\n.gbox.wide{grid-column:1 / -1}\n.gbox.green{background:var(--tint);border-color:var(--tint);border-top:3px solid var(--green)}\n.lab{font-weight:700;font-size:8pt;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}\n.big{font-family:\"Arial Narrow\",Arial;font-weight:700;font-size:20pt;text-transform:uppercase;line-height:1}\n.gval{font-size:11pt;font-weight:700}\n/* style box */\n.style{background:var(--tint);border-top:4px solid var(--green);padding:18px 20px;margin-top:6px}\n.style .name{font-family:\"Arial Narrow\",Arial;font-weight:700;font-size:30pt;text-transform:uppercase;line-height:1}\n.style .hl{color:var(--green);font-weight:700;font-size:14pt;margin:8px 0 10px}\n.style hr{border:0;border-top:1px solid var(--frame);margin:12px 0}\n/* scores */\ntable.sc{width:100%;border-collapse:collapse;margin-top:6px}\ntable.sc td{padding:3px 4px;border-bottom:1px solid var(--hair);font-size:9.3pt}\n.famrow td{border-bottom:2px solid var(--ink)!important;font-weight:700;letter-spacing:.14em;font-size:8pt;padding-top:8px!important}\n.famrow .avg{font-weight:400;letter-spacing:0;color:var(--muted);margin-left:8px}\n.sw{display:inline-block;width:11px;height:11px;margin-right:7px;vertical-align:-1px;border:1px solid var(--frame)}\ntd.ln{font-weight:700;text-transform:uppercase;font-family:\"Arial Narrow\",Arial;width:42%}\ntd.bar{width:30%}\n.cell{display:inline-block;width:22%;height:10px;margin-right:2%;background:#F2F8F4;border:1px solid var(--hair)}\n.cell.on{background:var(--ink);border-color:var(--ink)}\ntd.bd{text-align:right;color:var(--muted)}\n.focusrow td{color:var(--green)}\n.note{border-left:3px solid var(--green);padding:6px 0 6px 12px;margin:14px 0;font-size:9.5pt;color:var(--muted)}\n/* strengths */\n.lever{border:1px solid var(--hair);padding:10px 14px;margin-bottom:8px;page-break-inside:avoid}\n.lvhead{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px}\n.lvsc{font-weight:700;color:var(--green)}\n.grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px}\n.pane{padding:8px 10px;font-size:9pt;line-height:1.42}\n.pane p{margin:0}\n.pane.good{background:var(--tint)}\n.pane.over{background:#F7F7F5;border-left:3px solid var(--frame)}\n.line{font-size:9pt;line-height:1.42;margin:0 0 4px}\n/* range */\n.meter{display:flex;gap:4px;margin:6px 0 4px}\n.meter span{flex:1;height:12px;background:var(--hair)}\n.meter span.on{background:var(--green)}\n.pair{display:grid;grid-template-columns:1fr 26px 1fr;align-items:center;gap:6px;margin:8px 0}\n.chip{border:1px solid var(--ink);padding:8px 10px;text-align:center;font-weight:700;font-family:\"Arial Narrow\",Arial;text-transform:uppercase;font-size:10.5pt}\n.chip.g{border-color:var(--green);color:var(--green)}\n.plus{text-align:center;font-weight:700;color:var(--green);font-size:16pt}\n/* tables */\ntable.t{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:8px}\ntable.t th{text-align:left;font-size:8pt;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);border-bottom:2px solid var(--ink);padding:6px 6px}\ntable.t td{border-bottom:1px solid var(--hair);padding:8px 6px;vertical-align:top}\n.fit{color:var(--green);font-weight:700}\n.gap{color:var(--muted)}\n/* plan */\n.plan{border:2px solid var(--ink);padding:14px 16px;margin-top:8px}\n.plan .ifthen{font-size:12.5pt;line-height:1.45;margin:6px 0 4px}\n.plan .ifthen b{color:var(--green)}\n.blank{border-bottom:1px solid var(--frame);height:22px;margin:4px 0}\ntable.track td{height:30px}\n.box{display:inline-block;width:12px;height:12px;border:1.5px solid var(--frame);vertical-align:-2px;margin-right:6px}\n.two{display:grid;grid-template-columns:1fr 1fr;gap:14px}\n.ask{background:var(--tint);padding:12px 14px;margin-top:6px}\n.ask ol{margin:6px 0 0 18px;padding:0}\n.ask li{margin-bottom:6px}\n.badge{display:flex;align-items:center;gap:18px;background:var(--tint);border-top:4px solid var(--green);padding:16px 18px;margin-top:4px}\n.bicon{width:64px;height:64px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;flex-shrink:0}\n.dashrow{display:flex;gap:10px;margin-top:10px}\n.dashrow > *{min-width:0}\n.dcard{border:1px solid var(--hair);padding:10px 12px}\n.dcard.exp{border:2px solid var(--ink)}\n.split{display:flex;height:26px;margin-top:6px;font-family:\"Arial Narrow\",Arial;font-weight:700;font-size:9pt}\n.split span{display:flex;align-items:center;justify-content:center;border-right:2px solid #fff}\n.tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:4px}\n.tile{border:1px solid var(--hair);padding:12px 10px;text-align:center}\n.tile.edge{border:2px solid var(--green);background:var(--tint)}\n.ticon{display:flex;justify-content:center;margin-bottom:6px}\n.tname{font-family:\"Arial Narrow\",Arial;font-weight:700;text-transform:uppercase;font-size:10pt;line-height:1.15;min-height:24px}\n.tdots{margin:7px 0 3px}\n.dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin:0 2px}\n.tlab{font-size:7.5pt;letter-spacing:.12em;color:var(--muted);font-weight:700}\n.tile.edge .tlab{color:var(--green)}\n.scale{position:relative;display:flex;height:28px;margin:18px 0 6px;font-family:\"Arial Narrow\",Arial;font-weight:700;font-size:8pt;letter-spacing:.08em;text-transform:uppercase}\n.zone{display:flex;align-items:center;justify-content:center}\n.z1{flex:30;background:#EEF0F2;color:#8A9099;justify-content:flex-start;padding-left:8px}\n.z2{flex:40;background:#D5EEDC;color:#1E7A38}\n.z3{flex:30;background:#F6EBD6;color:#9A6B1F;justify-content:flex-end;padding-right:8px}\n.marker{position:absolute;top:-12px;bottom:-4px;width:0;border-left:3px solid var(--ink)}\n.marker span{position:absolute;top:-4px;left:-15px;background:var(--ink);color:#fff;font-size:7pt;padding:1px 4px;letter-spacing:.1em}\n.ends{display:flex;justify-content:space-between;gap:16px;font-size:9pt;margin-bottom:6px}\n.legend{display:flex;gap:16px;font-size:8.5pt;color:var(--muted);margin:6px 0 4px;flex-wrap:wrap}\n.legend span{display:flex;align-items:center;gap:5px}\n.legend svg{width:14px;height:14px}\n.fitmap{border-top:2px solid var(--ink)}\n.fitrow{display:grid;grid-template-columns:36px 1fr 1fr;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid var(--hair)}\n.fs b{font-size:10.5pt}\n.ft{font-size:9.3pt;color:var(--ink)}\n.fitrow.quiet .ft{color:var(--muted)}\n.ethic{border:1px solid var(--hair);padding:12px 14px;margin-top:12px;font-size:9.3pt;color:var(--muted)}\n\nhtml{-webkit-print-color-adjust:exact;print-color-adjust:exact}\n.split span{min-width:48px}\n.compact .lever{padding:6px 12px;margin-bottom:5px}.compact .scale{margin:14px 0 4px;height:24px}.compact .line{margin-bottom:2px;font-size:8.8pt}.compact .ends{font-size:8.8pt;margin-bottom:3px}.compact .lvhead{margin-bottom:2px}.compact h3{font-size:13pt}\n.toolbar{position:sticky;top:0;z-index:5;display:flex;justify-content:space-between;align-items:center;gap:12px;background:#1A1A1A;color:#fff;padding:10px 16px;font-family:Arial;font-size:13px}\n.toolbar button{font-family:\"Arial Narrow\",Arial;font-weight:700;letter-spacing:.12em;font-size:13px;padding:9px 16px;background:#36AA54;color:#fff;border:0;cursor:pointer}\n@media screen{body{background:#E9ECEE}.page{background:#fff;width:210mm;min-height:297mm;margin:16px auto;padding:16mm;box-shadow:0 1px 6px rgba(0,0,0,.12)}.cover{height:auto;min-height:297mm}}\n@media print{.toolbar{display:none}}\n\n.tile.reserve{border:2px solid #CBD0D4;background:#F7F7F5}.tile.reserve .tlab{color:#8A9099}\n.toolbar .tbr{display:flex;gap:10px;align-items:center}\n.toolbar .langs{display:inline-flex;border:1px solid #5F656C}\n.toolbar button.lang{background:transparent;color:#CBD0D4;padding:8px 12px;letter-spacing:.14em}\n.toolbar button.lang.on{background:#fff;color:#1A1A1A;cursor:default}\n/*BM*/\nbody.ms{font-size:9.7pt;line-height:1.45}\nbody.ms h2{font-size:21pt}\nbody.ms .lead{font-size:10.3pt;margin-bottom:10px}\nbody.ms .muted{font-size:9.5pt}\nbody.ms .big{font-size:21pt!important}\nbody.ms .badge{padding:12px 16px}\nbody.ms .badge .lab+.big+div{font-size:10.5pt!important}\nbody.ms .tile{padding:8px 6px}\nbody.ms .tname{font-size:8.6pt;min-height:30px}\nbody.ms .small{font-size:8pt}\nbody.ms .dcard{padding:8px 10px}\nbody.ms .style{padding:14px 16px}\nbody.ms .style .name{font-size:24pt}\nbody.ms .style .hl{font-size:12pt}\nbody.ms .lever{padding:6px 12px;margin-bottom:5px}\nbody.ms .scale{margin:14px 0 4px;height:22px;font-size:7.2pt}\nbody.ms .line,body.ms .ends{font-size:8.5pt;margin-bottom:2px}\nbody.ms .lvhead{margin-bottom:2px}\nbody.ms .lever h3{font-size:12pt}\nbody.ms .pane,body.ms .two p{font-size:9pt}\nbody.ms .fitrow{padding:5px 0;gap:8px}\nbody.ms .fs b{font-size:9.6pt}\nbody.ms .ft{font-size:8.7pt}\nbody.ms .legend{font-size:8pt}\nbody.ms .note{font-size:8.8pt;margin:10px 0}\nbody.ms section p{margin-bottom:6px}\nbody.ms .plan{padding:10px 14px}\nbody.ms .plan .ifthen{font-size:11pt}\nbody.ms .ask{font-size:8.9pt;padding:10px 12px}\nbody.ms .ask li{margin-bottom:3px}\nbody.ms table.track td{height:22px}\nbody.ms .ethic{font-size:8.6pt;margin-top:8px;padding:8px 12px}\n/*FIT*/\n.legend{gap:4px 14px;font-size:7.8pt;margin:4px 0}\n.fitrow{padding:6px 0}\n.ft{font-size:9pt}\n.fs b{font-size:10pt}\n.fitmap + .note{font-size:9pt}\nbody.ms .fitrow{padding:4px 0}\nbody.ms .ft{font-size:8.5pt}\n/*LENS*/\n.lens p{font-size:11pt;line-height:1.6;margin-bottom:14px;padding-left:12px;border-left:3px solid var(--tint)}\nbody.ms .lens p{font-size:10.5pt}\n\n/*V14 theory*/\n.theory p{font-size:9.8pt}\n.outc{display:flex;align-items:stretch;gap:6px;margin:8px 0 2px}\n.oc{flex:1;padding:8px 10px;font-size:8.8pt;line-height:1.35;display:flex;flex-direction:column;gap:2px}\n.oc b{font-family:\"Arial Narrow\",Arial;text-transform:uppercase;letter-spacing:.08em;font-size:9.5pt}\n.oc.o0{background:#E2F1E5}.oc.o0 b{color:#1E7A38}\n.oc.o1{background:#F2F3F4}\n.oc.o2{background:#F6EBD6}.oc.o2 b{color:#9A6B1F}\n.oarr{display:flex;align-items:center;color:var(--grey);font-size:16pt;font-weight:700}\nul.fl{margin:2px 0 0 16px;padding:0;font-size:9.4pt;line-height:1.4}\nul.fl li{margin-bottom:4px}\n.rbox{border:1px solid var(--hair);padding:10px 12px;margin-top:8px}\ntable.rchart{width:100%;border-collapse:collapse;margin-top:4px;font-size:9pt}\ntable.rchart th{text-align:left;font-size:7.5pt;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);border-bottom:2px solid var(--ink);padding:3px 4px}\ntable.rchart td{padding:2.5px 4px;border-bottom:1px solid var(--hair);vertical-align:middle}\ntable.rchart tr.rfam td{font-family:\"Arial Narrow\",Arial;font-weight:700;letter-spacing:.14em;font-size:7.5pt;padding-top:6px;border-bottom:1px solid var(--frame)}\ntd.rn{font-family:\"Arial Narrow\",Arial;font-weight:700;text-transform:uppercase;font-size:9pt}\n.rtrack{position:relative;height:14px;background:#F2F3F4}\n.rbar{position:absolute;left:0;top:0;bottom:0}\n.rlab{position:absolute;left:6px;top:0;line-height:14px;font-size:7.6pt;font-weight:700;color:#fff;letter-spacing:.04em}\ntd.ru{font-size:8.4pt;color:var(--muted)}\ntd.ryou{white-space:nowrap;font-size:8.6pt}\ntd.ryou .dot{width:7px;height:7px;margin:0 1px}\n.src{margin-top:8px;font-size:7.6pt;color:var(--grey);line-height:1.35}\n.src ol{margin:2px 0 0 14px;padding:0}\n.src li{margin-bottom:1px}\n/*V14 scenarios*/\n.scen{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:6px}\n.scard{border:1px solid var(--hair);padding:7px 10px;page-break-inside:avoid}\n.scard[data-kind=\"full\"]{border-color:#9FD3AE}\n.shead{display:flex;gap:8px;align-items:flex-start;margin-bottom:4px}\n.shead svg{width:18px;height:18px;flex-shrink:0;margin-top:1px}\n.shead b{font-size:9.8pt;line-height:1.2;display:block}\n.shead .small{font-size:7.6pt;margin-top:1px}\n.scard p{font-size:8.6pt;line-height:1.36;margin:0 0 3px}\n.scard p .small{font-size:7.4pt}\n.scard .sl{font-family:\"Arial Narrow\",Arial;text-transform:uppercase;letter-spacing:.06em;font-size:8.2pt}\n.scard .stry{background:var(--tint);padding:4px 6px;margin:4px 0 0}\n.scard .stry .sl{color:var(--green)}\n.line.rs{color:var(--muted)}\n.line.rs b{color:var(--ink)}\n.toolbar .nm{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#CBD0D4}\n.toolbar .nm input{font:13px Arial;padding:7px 8px;border:1px solid #5F656C;background:#fff;color:#1A1A1A;width:110px}\n.toolbar .nm button{padding:8px 10px;background:transparent;border:1px solid #5F656C;color:#fff}\nbody.ms .scard p{font-size:8.2pt}\nbody.ms .theory p{font-size:9.2pt}\n\n/*V14 fit*/\n.theory h2{margin-bottom:6px}\n.theory p{font-size:9.4pt;margin-bottom:6px;line-height:1.42}\n.theory .lead{margin-bottom:4px!important}\n.outc{margin:4px 0 0}\n.oc{padding:6px 9px;font-size:8.4pt}\nul.fl{font-size:9pt;line-height:1.35}\nul.fl li{margin-bottom:2px}\n.theory .two{gap:12px}\n.theory .two p{font-size:9pt}\n.rbox{padding:7px 10px;margin-top:6px}\ntable.rchart td{padding:1.5px 4px}\ntable.rchart tr.rfam td{padding-top:4px}\n.rtrack{height:12px}.rlab{line-height:12px;font-size:7.2pt}\n.src{margin-top:5px;font-size:7.2pt;line-height:1.3}\n.glance-sc table.sc td{padding:1.6px 4px;font-size:8.8pt}\n.glance-sc .famrow td{padding-top:5px!important}\n.glance-sc .note{margin:8px 0 0;padding:4px 0 4px 10px;font-size:9pt}\n\n.scen{gap:6px}\n.scard{padding:6px 9px}\n.scard p{font-size:8.4pt;line-height:1.33}\n.glance-sc .dcard{padding:8px 10px}\n\n.scard p{margin-bottom:2px}\n.scard .stry{margin-top:3px;padding:3px 6px}\n.shead{margin-bottom:3px}\n\n.compact6 .lever{padding:5px 11px;margin-bottom:4px}\n.compact6 .scale{margin:11px 0 3px;height:19px;font-size:7.2pt}\n.compact6 .marker{top:-9px}\n.compact6 .ends,.compact6 .line{font-size:8.3pt;line-height:1.32}\n.compact6 h3{font-size:12pt}\n.compact6 .lead{font-size:10pt;margin-bottom:6px!important}\nbody.ms .glance-sc table.sc td{padding:1.2px 4px;font-size:8.5pt}\n\n.theory .small{font-size:7.6pt;line-height:1.3}\n\n.lensin{margin-top:22px;padding-top:14px;border-top:1px solid var(--hair)}\n.lensin h3{font-size:16pt;margin:6px 0 4px}\n.lensin p{font-size:10pt;line-height:1.5;margin-bottom:9px}\nbody.ms .lensin p{font-size:9.6pt}\nbody.ms .scard p{font-size:8pt;line-height:1.3} body.ms .compact6 .ends,body.ms .compact6 .line{font-size:8pt} body.ms .compact6 .scale{margin:10px 0 2px;height:18px}\n\n/*V14 scale*/\n.scalebox{background:var(--tint);border-top:3px solid var(--green);padding:8px 12px 8px;margin-top:8px}\n.scalebox p{font-size:8.9pt;line-height:1.38;margin:6px 0 3px}\n.sstrip{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-top:4px}\n.sstep{background:#fff;padding:5px 7px;display:flex;flex-direction:column;gap:1px;font-size:7.8pt;line-height:1.25}\n.sstep .snum{font-family:\"Arial Narrow\",Arial;font-weight:700;font-size:15pt;line-height:1}\n.sstep .sdots .dot{width:7px;height:7px;margin:0 1px 0 0}\n.sstep b{font-size:8.4pt;margin-top:2px}\n.sstep span{color:var(--muted)}\n.sstep i{font-style:normal;font-size:7pt;letter-spacing:.08em;text-transform:uppercase;color:var(--green);font-weight:700;margin-top:2px}\nbody.ms .scalebox p{font-size:8.5pt}\nbody.ms .sstep{font-size:7.4pt}\n\n.smine{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:6px 0}\n.smine div{background:#fff;padding:6px 9px;font-size:8.6pt;line-height:1.35}\nbody.ms .smine div{font-size:8.2pt}\n\n/*V14 glossary*/\ntable.gl{width:100%;border-collapse:collapse;margin-top:4px}\ntable.gl th{text-align:left;font-size:7.8pt;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);border-bottom:2px solid var(--ink);padding:4px 6px}\ntable.gl td{border-bottom:1px solid var(--hair);padding:7px 6px;vertical-align:top;font-size:9.4pt;line-height:1.4}\ntable.gl tr.gfam td{font-family:\"Arial Narrow\",Arial;font-weight:700;letter-spacing:.14em;font-size:8.2pt;padding-top:12px;border-bottom:1px solid var(--frame);background:#fff}\n.gfd{font-family:Arial;font-weight:400;letter-spacing:0;color:var(--muted);font-size:8.6pt;margin-left:6px}\ntd.gn{font-family:\"Arial Narrow\",Arial;font-weight:700;text-transform:uppercase;font-size:10pt}\ntd.gn svg{vertical-align:-3px;margin-right:6px}\ntd.gs{color:var(--muted);font-style:italic}\nbody.ms table.gl td{font-size:9pt;padding:6px}\n\n.loops{margin-top:6px;border-top:1px solid var(--hair);padding-top:5px;font-size:8pt;line-height:1.3}\n.loops b{display:block;font-size:8pt;margin-bottom:2px}\n.loops .lp{font-family:\"Arial Narrow\",Arial;font-weight:700;text-transform:uppercase;font-size:8.2pt;color:#B23B3B;letter-spacing:.02em}\n.loops span{display:block;color:var(--muted);margin-top:3px;font-size:7.6pt}\n\n.loops{margin-top:8px;border:1px solid #E7C9C9;background:#FCF6F6;padding:6px 10px;font-size:8pt;line-height:1.3}\n.loops b{display:inline;font-size:inherit;margin:0}\n.lps{display:flex;flex-wrap:wrap;gap:4px 6px;margin-top:4px}\n.loops .lp{font-family:\"Arial Narrow\",Arial;font-weight:700;text-transform:uppercase;font-size:8pt;color:#B23B3B;background:#fff;border:1px solid #E7C9C9;padding:2px 6px;letter-spacing:.02em}\n.loops .lpm{font-size:7.8pt;color:var(--muted);align-self:center}\n.loops span{display:inline;margin:0}\n.glance-sc .dcard p.small{line-height:1.35}\n\nbody.ms .glance-sc .lead{font-size:10pt}\nbody.ms .glance-sc .dcard p.small{font-size:7.8pt}\nbody.ms .scalebox p{font-size:8.2pt;line-height:1.32}\nbody.ms .smine div{font-size:7.9pt;padding:5px 8px}\nbody.ms .sstep{font-size:7.1pt;padding:4px 6px}\n\nbody.ms .glance-sc .dcard{padding:6px 9px}\nbody.ms .glance-sc .dashrow{gap:8px}\nbody.ms .loops .small{font-size:7.4pt}\n.loops{border-color:#EBD9B4;background:#FCF7EE}\n.loops .lp{color:#9A6B1F;border-color:#EBD9B4}\n/*V14 BM fit*/\nbody.ms .theory p{font-size:8.8pt;line-height:1.36;margin-bottom:5px}\nbody.ms .theory .lead{font-size:10pt}\nbody.ms .theory h2{font-size:24pt}\nbody.ms .oc{font-size:7.9pt;padding:5px 8px}\nbody.ms ul.fl{font-size:8.4pt;line-height:1.3}\nbody.ms .theory .two p{font-size:8.4pt}\nbody.ms table.rchart{font-size:8.4pt}\nbody.ms table.rchart td{padding:1px 4px}\nbody.ms td.rn{font-size:8.4pt}\nbody.ms .rtrack{height:11px}\nbody.ms .rlab{line-height:11px;font-size:6.8pt}\nbody.ms .src{font-size:6.9pt}\nbody.ms .scard p{font-size:7.8pt;line-height:1.28}\nbody.ms .shead b{font-size:9.2pt}\nbody.ms .scen{gap:5px}\nbody.ms .rbox{padding:5px 8px;margin-top:4px}\nbody.ms .outc{margin-top:2px}\nbody.ms .theory .two{margin-top:5px!important}\nbody.ms table.rchart tr.rfam td{padding-top:3px}\nbody.ms .src li{margin-bottom:0}\nbody.ms .src{font-size:6.6pt;line-height:1.25}\nbody.ms ul.fl li{margin-bottom:1px}\nbody.ms .theory p{line-height:1.32}\nbody.ms .scard{padding:5px 8px}\nbody.ms .scard p{font-size:7.6pt;line-height:1.27;margin-bottom:1px}\nbody.ms .shead .small{font-size:7.1pt}\nbody.ms .scard .stry{padding:3px 5px;margin-top:2px}\nbody.ms .compact .lever .two p,body.ms .compact .lever > p{font-size:8.9pt!important;line-height:1.36}\n";
  var ICONS = {"bar-chart-2": "<line x1=\"18\" y1=\"20\" x2=\"18\" y2=\"10\"></line><line x1=\"12\" y1=\"20\" x2=\"12\" y2=\"4\"></line><line x1=\"6\" y1=\"20\" x2=\"6\" y2=\"14\"></line>", "message-circle": "<path d=\"M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z\"></path>", "tool": "<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"></path>", "sun": "<circle cx=\"12\" cy=\"12\" r=\"5\"></circle><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"3\"></line><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"23\"></line><line x1=\"4.22\" y1=\"4.22\" x2=\"5.64\" y2=\"5.64\"></line><line x1=\"18.36\" y1=\"18.36\" x2=\"19.78\" y2=\"19.78\"></line><line x1=\"1\" y1=\"12\" x2=\"3\" y2=\"12\"></line><line x1=\"21\" y1=\"12\" x2=\"23\" y2=\"12\"></line><line x1=\"4.22\" y1=\"19.78\" x2=\"5.64\" y2=\"18.36\"></line><line x1=\"18.36\" y1=\"5.64\" x2=\"19.78\" y2=\"4.22\"></line>", "trending-up": "<polyline points=\"23 6 13.5 15.5 8.5 10.5 1 18\"></polyline><polyline points=\"17 6 23 6 23 12\"></polyline>", "heart": "<path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"></path>", "smile": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M8 14s1.5 2 4 2 4-2 4-2\"></path><line x1=\"9\" y1=\"9\" x2=\"9.01\" y2=\"9\"></line><line x1=\"15\" y1=\"9\" x2=\"15.01\" y2=\"9\"></line>", "repeat": "<polyline points=\"17 1 21 5 17 9\"></polyline><path d=\"M3 11V9a4 4 0 0 1 4-4h14\"></path><polyline points=\"7 23 3 19 7 15\"></polyline><path d=\"M21 13v2a4 4 0 0 1-4 4H3\"></path>", "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"12 6 12 12 16 14\"></polyline>", "book-open": "<path d=\"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z\"></path><path d=\"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z\"></path>", "users": "<path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"></path><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"></path>", "flag": "<path d=\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z\"></path><line x1=\"4\" y1=\"22\" x2=\"4\" y2=\"15\"></line>"};
  CSS += '\n/*V16 glossary with scale*/\n.gloss .lead{margin-bottom:4px!important}\n.gloss table.gl td{padding:3.5px 6px;font-size:8.9pt;line-height:1.33}\n.gloss table.gl tr.gfam td{padding-top:6px}\nbody.ms .gloss table.gl td{padding:3px 6px;font-size:8.5pt;line-height:1.3}\n.gloss .scalebox{margin-top:10px}\n.gloss .scalebox p{font-size:8.6pt}\nbody.ms .gloss .scalebox p{font-size:8.2pt}\n/*V16 key findings*/\n.kf h2{margin-bottom:4px}\n.kf .lead{margin-bottom:6px}\n.kfp{font-family:Arial;font-weight:400;letter-spacing:0;text-transform:none;color:var(--grey);font-size:7.6pt;margin-left:6px}\n.kf-top{display:grid;grid-template-columns:1.25fr 1fr;gap:14px;align-items:start}\n.kf-web{margin:-6px -8px -10px}\n.kf-style{display:flex;gap:12px;align-items:center;padding:2px 0 8px;border-bottom:1px solid var(--hair)}\n.kf-badge{width:56px;flex-shrink:0}\n.kf-badge svg{display:block}\n.kf-sname{font-family:"Arial Narrow",Arial;font-weight:700;font-size:22pt;text-transform:uppercase;line-height:1}\n.kf-shl{color:var(--green);font-weight:700;font-size:10.5pt;margin-top:3px;line-height:1.25}\n.kf-big{font-size:9pt;color:var(--muted);line-height:1.4;margin:8px 0 0}\n.kf-mini{display:grid;grid-template-columns:92px 1fr;gap:10px;align-items:center;margin-top:8px}\n.kf-mini p{font-size:8.6pt;color:var(--muted);margin:0;line-height:1.35}\n.kf-mini b{color:var(--ink)}\n.kf-cap{font-size:8.4pt;color:var(--muted);margin:4px 0 0;line-height:1.35}\n.kf-sec{margin-top:8px}\n.kf-tiles{display:grid;gap:14px}\n.kf-tg{display:grid;gap:6px}\n.kf-tg2{display:grid;gap:6px;padding-left:14px;border-left:2px dashed var(--frame)}\n.kt{text-align:center;padding:2px 2px 0}\n.kic{width:44px;height:44px;border-radius:50%;border:2px solid #1A1A1A;display:flex;align-items:center;justify-content:center;margin:0 auto 4px;background:#fff}\n.kt.main .kic,.kt.main2 .kic{background:var(--tint)}\n.kn{font-family:"Arial Narrow",Arial;font-weight:700;text-transform:uppercase;font-size:8.6pt;line-height:1.12;min-height:20px}\n.kd{margin:3px 0 1px}.kd .dot{width:7px;height:7px;margin:0 1px}\n.kl{font-size:6.8pt;font-weight:700;letter-spacing:.1em}\n.kf-sits{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;margin-top:2px}\n.ks{text-align:center}\n.ksi{position:relative;width:40px;height:40px;border-radius:50%;margin:0 auto 3px;display:flex;align-items:center;justify-content:center;background:#F2F3F4}\n.ks.full .ksi{background:var(--tint)}\n.ksm{position:absolute;right:-5px;bottom:-3px}.ksm svg{width:15px;height:15px}\n.ksn{font-size:8pt;line-height:1.15;font-weight:700}\n.ks.empty .ksn{color:var(--muted)}\n.kf-leg{display:flex;gap:14px;font-size:7.6pt;color:var(--muted);margin-top:5px}\n.kf-leg span{display:flex;align-items:center;gap:4px}.kf-leg svg{width:11px;height:11px}\n.kf-next{margin-top:9px;background:var(--tint);border-top:3px solid var(--green);padding:9px 14px 10px;display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:center}\n.kf-pair{display:flex;align-items:center;gap:6px}\n.kf-pair .kic{margin:0 auto}\n.kf-pair .plus{font-size:16pt;font-weight:700;color:var(--green)}\n.kf-pl{font-size:6.8pt;font-weight:700;letter-spacing:.1em;text-align:center;margin-top:2px}\n.kf-next p{margin:0;font-size:9.2pt;line-height:1.4}\n.kf-next .ifthen{font-size:10pt;margin-top:4px}.kf-next .ifthen b{color:var(--green)}\n.kf .loops{margin-top:8px}\nbody.ms .kf-big,body.ms .kf-cap,body.ms .kf-mini p{font-size:8pt}\nbody.ms .kf-sname{font-size:19pt}\nbody.ms .kf-shl{font-size:9.5pt}\nbody.ms .kn{font-size:7.9pt}\nbody.ms .ksn{font-size:7.3pt}\nbody.ms .kl,body.ms .kf-pl{font-size:6.3pt}\nbody.ms .kf-next p{font-size:8.6pt}\nbody.ms .kf-next .ifthen{font-size:9.2pt}\nbody.ms .kf-leg{font-size:7.2pt}\n/*V16 style page*/\n.sbox{display:grid;grid-template-columns:210px 1fr;gap:16px;align-items:center;padding:8px 18px 8px 6px!important}\n.smap svg{display:block}\n.swhy{font-size:9.4pt;line-height:1.42;margin:0 0 6px;color:var(--ink)}\nbody.ms .swhy{font-size:8.8pt}\n.sscards{gap:10px}\n.sscards>div{padding:9px 12px 8px}\n.sscards p{margin:0}\n.sc-good{background:var(--tint);border-top:3px solid var(--green)}\n.sc-over{background:#FCF7EE;border-top:3px solid #E3C88F}\n.combos .pair{margin:4px 0 8px}\n.chip.w{border-color:#C9A24E;color:#9A6B1F}\n.plus.w{color:#C9A24E}\n/*V16 BM fit*/\n.kf .loops .small{font-size:7.4pt}\nbody.ms .kf .lead{font-size:9.6pt}\nbody.ms .kf-sname{font-size:14pt}\nbody.ms .kf-shl{font-size:9pt!important}\nbody.ms .kf-big{margin-top:6px}\nbody.ms .kf .loops{font-size:7.4pt;padding:4px 8px;margin-top:6px}\nbody.ms .kf .loops .small{font-size:6.9pt;line-height:1.25}\nbody.ms .kf-sec{margin-top:6px}\nbody.ms .gloss table.gl td{font-size:8.2pt;padding:2.5px 6px;line-height:1.28}\nbody.ms .gloss .scalebox p{font-size:7.9pt;line-height:1.3}\nbody.ms .sbox{grid-template-columns:185px 1fr}\nbody.ms .sbox .name{font-size:17pt!important}\nbody.ms .swhy{font-size:8.3pt;line-height:1.36}\nbody.ms .sscards p,body.ms .combos p{font-size:8.7pt!important;line-height:1.38}\n/*V16 tighter key findings when circles are shown*/\n.kf-loops .kf-sec{margin-top:6px}\n.kf-loops .kf-next{margin-top:7px;padding:7px 14px 8px}\n.kf-loops .kf-web{margin:-10px -8px -14px}\n.kf .loops .lp{font-size:7.6pt;padding:1px 5px}\nbody.ms .style .pair .chip{font-size:8.6pt;padding:6px 6px}\nbody.ms .sscards p,body.ms .combos p{font-size:8.4pt!important}\nbody.ms .sbox{padding:6px 16px 6px 4px!important}\n';
  ICONS["calendar"] = '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>';
  ICONS["user-plus"] = '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>';
  ICONS["briefcase"] = '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>';
  ICONS["link"] = '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>';
  ICONS["layers"] = '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>';
  ICONS["alert-circle"] = '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>';
  ICONS["check-circle"] = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>';
  var ORDER = ["rational", "consultation", "collaboration", "inspirational", "apprising", "ingratiation", "personal", "exchange", "pressure", "legitimating", "coalition"];
  var FILL = { CORE: "#E2F1E5", SOFT: "#F4EDDD", HARD: "#E6EAF0" };
  var LG = "en";
  function x(en, ms) { return LG === "ms" ? ms : en; }
  function famName(f) { return (LG === "ms" ? { CORE: "Teras", SOFT: "Lembut", HARD: "Keras" } : { CORE: "Core", SOFT: "Soft", HARD: "Hard" })[f]; }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function ic(name, size, color, sw) {
    return '<svg width="' + (size || 20) + '" height="' + (size || 20) + '" viewBox="0 0 24 24" fill="none" stroke="' + (color || "#1A1A1A") + '" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || "") + "</svg>";
  }
  function joinAnd(a) { return a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + x(" and ", " dan ") + a[a.length - 1]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  /* The name people are called by: skips common Malaysian name prefixes (Nurul, Siti, Mohd, Syed…)
     and stops at bin/binti/a/l. The admin can override it from the report toolbar. */
  var PRE = ["nurul", "nur", "noor", "nor", "siti", "sri", "muhammad", "muhamad", "mohamad", "mohammad", "mohamed", "mohammed", "mohd", "md", "muhd", "abdul", "abd", "ab", "syed", "sharifah", "syarifah", "tengku", "tunku", "engku", "wan", "nik", "che", "raja", "puteri", "megat", "dayang", "awang", "haji", "hajah", "hj", "dr", "ir", "datuk", "dato", "datin"];
  var STOP = ["bin", "binti", "bt", "bte", "a/l", "a/p", "s/o", "d/o"];
  function firstName(full) {
    var t = String(full || "").trim().split(/\s+/).filter(Boolean), out = [];
    for (var i = 0; i < t.length; i++) { var w = t[i].toLowerCase().replace(/[.,]/g, ""); if (STOP.indexOf(w) >= 0) break; out.push(t[i]); }
    if (!out.length) out = t.slice(0, 1);
    var k = 0; while (k < out.length - 1 && PRE.indexOf(out[k].toLowerCase().replace(/[.,]/g, "")) >= 0) k++;
    var f = out[k] || "";
    return f && f === f.toUpperCase() ? f.charAt(0) + f.slice(1).toLowerCase() : f;
  }
  function band(s) { return s >= 3 ? x("Signature", "Kecenderungan utama") : s === 2 ? x("Situational", "Mengikut keadaan") : x("Less used", "Jarang dipilih"); }
  function f1(x) { return (Math.round(x * 10) / 10).toFixed(1); }

  /* Same rule as the free report: top set decides the style. */
  function pickStyle(scored) {
    var vals = scored.map(function (s) { return s.score; });
    var max = Math.max.apply(null, vals);
    var top = scored.filter(function (s) { return s.score === max; });
    if (top.length === 1) {
      var rest = vals.filter(function (v) { return v < max; });
      if (rest.length) { var second = Math.max.apply(null, rest); top = top.concat(scored.filter(function (s) { return s.score === second; })); }
    }
    var f = {}; top.forEach(function (s) { f[s.family] = true; });
    var key = f.CORE && f.SOFT && f.HARD ? "adapter" : f.CORE && f.SOFT ? "engager" : f.CORE && f.HARD ? "strategist" : f.SOFT && f.HARD ? "dealmaker" : f.CORE ? "builder" : f.SOFT ? "connector" : "driver";
    return { key: key, top: top };
  }

  function radar(scored, labelSize, subSize) {
    var W = 620, H = 430, cx = 310, cy = 215, R = 150, R0 = 16, n = scored.length, step = 2 * Math.PI / n;
    function ang(i) { return -Math.PI / 2 + i * step; }
    function rr(v) { return R0 + (R - R0) * v / 4; }
    function pt(i, v) { return [cx + rr(v) * Math.cos(ang(i)), cy + rr(v) * Math.sin(ang(i))]; }
    var o = ['<svg viewBox="0 0 ' + W + " " + H + '" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">'];
    scored.forEach(function (l, i) {
      var a0 = ang(i) - step / 2, a1 = ang(i) + step / 2;
      o.push('<path d="M' + cx + "," + cy + " L" + (cx + R * Math.cos(a0)).toFixed(1) + "," + (cy + R * Math.sin(a0)).toFixed(1) + " A" + R + "," + R + " 0 0 1 " + (cx + R * Math.cos(a1)).toFixed(1) + "," + (cy + R * Math.sin(a1)).toFixed(1) + ' Z" fill="' + FILL[l.family] + '"/>');
    });
    [1, 2, 3, 4].forEach(function (v) {
      var pts = scored.map(function (_, i) { var p = pt(i, v); return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ");
      o.push(v === 2 ? '<polygon points="' + pts + '" fill="none" stroke="#36AA54" stroke-width="1.6" stroke-dasharray="5 4"/>' : '<polygon points="' + pts + '" fill="none" stroke="#FFFFFF" stroke-width="1.4"/>');
    });
    scored.forEach(function (_, i) { var p = pt(i, 4); o.push('<line x1="' + cx + '" y1="' + cy + '" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) + '" stroke="#FFFFFF" stroke-width="1.2"/>'); });
    o.push('<polygon points="' + scored.map(function (l, i) { var p = pt(i, l.score); return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ") + '" fill="#1A1A1A" fill-opacity="0.07" stroke="#1A1A1A" stroke-width="2"/>');
    scored.forEach(function (l, i) {
      var p = pt(i, l.score), f = l.isFocus;
      o.push('<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (f ? 5 : 3.6) + '" fill="' + (f ? "#36AA54" : "#1A1A1A") + '"/>');
      var lx = cx + (R + 34) * Math.cos(ang(i)), ly = cy + (R + 30) * Math.sin(ang(i));
      var anc = Math.abs(Math.cos(ang(i))) < 0.12 ? "middle" : (Math.cos(ang(i)) > 0 ? "start" : "end");
      o.push('<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="' + anc + '" font-size="' + labelSize + '" font-weight="700" fill="' + (f ? "#36AA54" : "#1A1A1A") + '">' + esc(l.short.toUpperCase()) + (l.inLoop ? "*" : "") + "</text>");
      o.push('<text x="' + lx.toFixed(1) + '" y="' + (ly + subSize + 2).toFixed(1) + '" text-anchor="' + anc + '" font-size="' + subSize + '" fill="' + (f ? "#36AA54" : "#5F656C") + '">' + l.score + "/4" + (f ? x(" · FOCUS", " · FOKUS") : "") + "</text>");
    });
    o.push("</svg>");
    return o.join("");
  }

  function gauge(pct) {
    var r = 62, cx = 80, cy = 76, w = 14, ok = pct >= 80;
    function P(f) { var a = Math.PI * (1 - f); return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; }
    var p0 = P(0), p1 = P(1), pp = P(Math.max(0.001, pct / 100)), a = Math.PI * 0.2;
    var m1 = [cx + (r - w / 2 - 4) * Math.cos(a), cy - (r - w / 2 - 4) * Math.sin(a)], m2 = [cx + (r + w / 2 + 4) * Math.cos(a), cy - (r + w / 2 + 4) * Math.sin(a)];
    var col = ok ? "#36AA54" : "#1A1A1A";
    return '<svg viewBox="0 0 160 96" width="100%"><path d="M' + p0[0].toFixed(1) + "," + p0[1].toFixed(1) + " A" + r + "," + r + " 0 0 1 " + p1[0].toFixed(1) + "," + p1[1].toFixed(1) + '" fill="none" stroke="#E6E9EC" stroke-width="' + w + '"/>'
      + '<path d="M' + p0[0].toFixed(1) + "," + p0[1].toFixed(1) + " A" + r + "," + r + " 0 0 1 " + pp[0].toFixed(1) + "," + pp[1].toFixed(1) + '" fill="none" stroke="' + col + '" stroke-width="' + w + '"/>'
      + '<line x1="' + m1[0].toFixed(1) + '" y1="' + m1[1].toFixed(1) + '" x2="' + m2[0].toFixed(1) + '" y2="' + m2[1].toFixed(1) + '" stroke="#1A1A1A" stroke-width="2"/>'
      + '<text x="' + (m2[0] + 3).toFixed(1) + '" y="' + (m2[1] - 2).toFixed(1) + '" font-size="7.5" fill="#5F656C" font-family="Arial">80%</text>'
      + '<text x="' + cx + '" y="' + (cy - 6) + '" text-anchor="middle" font-size="24" font-weight="700" fill="' + col + '" font-family="Arial Narrow, Arial">' + pct + "%</text>"
      + '<text x="' + cx + '" y="' + (cy + 10) + '" text-anchor="middle" font-size="7.5" letter-spacing="1.5" fill="#8A9099" font-family="Arial">' + x("CONSISTENCY", "KETEKALAN") + '</text></svg>';
  }

  var STYFAM = { builder: ["CORE"], connector: ["SOFT"], driver: ["HARD"], engager: ["CORE", "SOFT"], strategist: ["CORE", "HARD"], dealmaker: ["SOFT", "HARD"], adapter: ["CORE", "SOFT", "HARD"] };
  var VC = { CORE: [110, 96], SOFT: [170, 96], HARD: [140, 146] }, VR = 70;
  var VLAB = { builder: [74, 84], connector: [206, 84], driver: [140, 196], engager: [140, 62], strategist: [99, 147], dealmaker: [181, 147], adapter: [140, 113] };
  var vennN = 0;
  function venn(key, mini, labels) {
    var id = "gv" + (vennN++), FAMS = ["CORE", "SOFT", "HARD"], inn = STYFAM[key] || [], out = FAMS.filter(function (f) { return inn.indexOf(f) < 0; });
    var circ = function (f, extra) { return '<circle cx="' + VC[f][0] + '" cy="' + VC[f][1] + '" r="' + VR + '"' + extra + "/>"; };
    var o = '<svg viewBox="' + (mini ? "34 22 212 200" : "0 0 280 236") + '" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif"><defs>';
    FAMS.forEach(function (f) { o += '<clipPath id="' + id + f + '">' + circ(f, "") + "</clipPath>"; });
    o += '<mask id="' + id + 'm"><rect width="280" height="240" fill="#fff"/>' + out.map(function (f) { return circ(f, ' fill="#000"'); }).join("") + "</mask></defs>";
    FAMS.forEach(function (f) { o += circ(f, ' fill="' + FILL[f] + '" style="mix-blend-mode:multiply"'); });
    var region = '<rect width="280" height="240" fill="#36AA54" mask="url(#' + id + 'm)"/>';
    inn.forEach(function (f) { region = '<g clip-path="url(#' + id + f + ')">' + region + "</g>"; });
    o += region;
    FAMS.forEach(function (f) { o += circ(f, ' fill="none" stroke="#FFFFFF" stroke-width="' + (mini ? 4 : 2) + '"'); });
    if (!mini) {
      o += '<text x="44" y="22" font-size="11" font-weight="700" letter-spacing="1.5" fill="#1E7A38">' + esc(famName("CORE").toUpperCase()) + '</text><text x="236" y="22" text-anchor="end" font-size="11" font-weight="700" letter-spacing="1.5" fill="#9A6B1F">' + esc(famName("SOFT").toUpperCase()) + '</text><text x="140" y="232" text-anchor="middle" font-size="11" font-weight="700" letter-spacing="1.5" fill="#5F656C">' + esc(famName("HARD").toUpperCase()) + "</text>";
      Object.keys(VLAB).forEach(function (k) {
        var on = k === key;
        o += '<text x="' + VLAB[k][0] + '" y="' + (VLAB[k][1] + 4) + '" text-anchor="middle" font-size="' + (on ? 9.5 : 8.6) + '" font-weight="700" fill="' + (on ? "#FFFFFF" : "#5F656C") + '">' + esc(labels[k]) + "</text>";
      });
    }
    return o + "</svg>";
  }

  function dots(n, col) { var s = ""; for (var k = 0; k < 4; k++) s += '<span class="dot" style="background:' + (k < n ? col : "#E6E9EC") + '"></span>'; return s; }
  function tile(l, kind) {
    var col = kind === "main" || kind === "main2" ? "#36AA54" : kind === "reserve" ? "#8A9099" : "#1A1A1A";
    var lab = kind === "main" ? x("MAIN FOCUS · ", "FOKUS UTAMA · ") : kind === "main2" ? x("ALSO A FOCUS · ", "FOKUS TAMBAHAN · ") : kind === "reserve" ? x("KEEP IN RESERVE · ", "GUNA BILA PERLU · ") : "";
    var cls = kind === "main" || kind === "main2" ? " edge" : kind === "reserve" ? " reserve" : "";
    return '<div class="tile' + cls + '"><div class="ticon">' + ic(l.icon, 22, col) + '</div><div class="tname">' + esc(l.name) + '</div><div class="tdots">' + dots(l.score, col) + '</div><div class="tlab">' + lab + l.score + "/4</div></div>";
  }
  function meter(n) { var s = ""; for (var i = 0; i < 11; i++) s += i < n ? '<span class="on"></span>' : "<span></span>"; return '<div class="meter">' + s + "</div>"; }
  function mark(kind) {
    if (kind === "full") return '<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="11" fill="#36AA54"/></svg>';
    if (kind === "half") return '<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="11" fill="#fff" stroke="#36AA54" stroke-width="2"/><path d="M13 2 A11 11 0 0 0 13 24 Z" fill="#36AA54"/></svg>';
    return '<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="11" fill="#fff" stroke="#CBD0D4" stroke-width="2"/></svg>';
  }

  function build(input, C0, lang) {
    LG = lang === "ms" ? "ms" : "en";
    var C = LG === "ms" && C0.ms ? C0.ms : C0;
    var scored = ORDER.map(function (id) {
      var c = C === C0 ? C.levers[id] : Object.assign({}, C0.levers[id], C.levers[id]);  // untranslated fields fall back to English
      return { id: id, name: c.name, short: c.short, family: c.family, icon: c.icon, c: c, score: Number(input.scores[id]) || 0 };
    });
    var byId = {}; scored.forEach(function (s) { byId[s.id] = s; });
    var max = Math.max.apply(null, scored.map(function (s) { return s.score; }));
    var min = Math.min.apply(null, scored.map(function (s) { return s.score; }));
    var focus = scored.filter(function (s) { return s.score === min; });
    focus.forEach(function (s) { s.isFocus = true; });

    // Strengths: every lever at 3–4, highest first; otherwise the top-scoring levers.
    var desc = scored.slice().sort(function (a, b) { return b.score - a.score || ORDER.indexOf(a.id) - ORDER.indexOf(b.id); });
    var strengths = desc.filter(function (s) { return s.score >= 3; });
    if (!strengths.length) strengths = desc.filter(function (s) { return s.score === max; }).slice(0, 3);
    strengths = strengths.slice(0, 6);

    // Development: Core/Soft focus levers are built; Hard focus levers are kept in reserve.
    // A lever already shown as a strength goes to the back of the queue, so it is never also the edge.
    // (In practice this only happens when all 11 levers score 2.)
    var strengthIds = strengths.map(function (s) { return s.id; });
    function strengthLast(list) { return list.filter(function (s) { return strengthIds.indexOf(s.id) < 0; }).concat(list.filter(function (s) { return strengthIds.indexOf(s.id) >= 0; })); }
    var flat = max === min;
    var main = strengthLast(focus.filter(function (s) { return s.family !== "HARD"; }));
    var reserve = focus.filter(function (s) { return s.family === "HARD"; });
    var derivedMain = false;
    if (!main.length) {
      var cores = scored.filter(function (s) { return s.family === "CORE"; });
      var cmin = Math.min.apply(null, cores.map(function (s) { return s.score; }));
      main = [strengthLast(cores.filter(function (s) { return s.score === cmin; }))[0]];
      derivedMain = true;
    }
    var mainShown = main.slice(0, 2), reserveShown = reserve.slice(0, mainShown.length >= 2 ? 1 : 2);
    var M = mainShown[0];
    // With a flat profile every lever ties for lowest; mark only the levers shown on the development page.
    if (flat) { scored.forEach(function (s) { s.isFocus = false; }); mainShown.concat(reserveShown).forEach(function (s) { s.isFocus = true; }); }

    var style = pickStyle(scored), S = C.styles[style.key];
    var famAvg = {}, famSum = {};
    ["CORE", "SOFT", "HARD"].forEach(function (f) {
      var ls = scored.filter(function (s) { return s.family === f; });
      famSum[f] = ls.reduce(function (a, s) { return a + s.score; }, 0);
      famAvg[f] = famSum[f] / ls.length;
    });
    var famRank = ["CORE", "SOFT", "HARD"].slice().sort(function (a, b) { return famAvg[b] - famAvg[a]; });
    var inUse = scored.filter(function (s) { return s.score >= 2; }).length;
    var rangeKey = inUse >= 9 ? "veryBroad" : inUse >= 7 ? "broad" : inUse >= 5 ? "focused" : "narrow";
    var R = C.range[rangeKey];
    var pct = Math.round(Number(input.consistencyPct) || 0), reliable = pct >= 80;

    // Combinations
    var natural = null;
    [3, 2].some(function (th) {
      var best = null;
      C.combos.natural.forEach(function (p) {
        var a = byId[p[0][0]], b = byId[p[0][1]];
        if (a.score >= th && b.score >= th && (!best || a.score + b.score > best.sum)) best = { a: a, b: b, text: p[1], sum: a.score + b.score };
      });
      natural = best; return !!best;
    });
    var care = null, careIds = [];
    C.combos.care.some(function (p) { var a = byId[p[0][0]], b = byId[p[0][1]]; if (a.score >= 3 && b.score >= 3) { care = p[1]; careIds = p[0]; return true; } return false; });
    if (!care && byId.ingratiation.score >= 3) { care = C.combos.careSingle.ingratiation; careIds = ["ingratiation"]; }
    if (!care && byId.pressure.score >= 3) { care = C.combos.careSingle.pressure; careIds = ["pressure"]; }
    if (!care) care = C.combos.careNone;
    var topStrength = strengths.concat(desc).filter(function (s) { return s.id !== M.id; })[0];  // never pair a lever with itself

    // Real situations. Every line on a card is generated from these same scores,
    // so the "likely move", the dot and the tip can never disagree.
    function sc(s) { return s.name + " (" + s.score + "/4)"; }
    var SCEN = C.scenarios || C0.scenarios;
    var fits = SCEN.map(function (st) {
      var ws = st.works.map(function (id) { return byId[id]; });
      var pts = ws.reduce(function (a, s) { return a + (s.score >= 3 ? 1 : s.score === 2 ? 0.5 : 0); }, 0);
      var ratio = pts / ws.length;
      var kind = ratio >= 0.6 ? "full" : ratio >= 0.3 ? "half" : "empty";
      // Likely move: highest-scoring lever people realistically reach for here (ties: what works first, then lever order)
      var reach = st.reach.map(function (id) { return byId[id]; }).sort(function (a, b) {
        return b.score - a.score || (st.works.indexOf(a.id) < 0) - (st.works.indexOf(b.id) < 0) || ORDER.indexOf(a.id) - ORDER.indexOf(b.id);
      });
      var L1 = reach[0], L2 = reach[1] && reach[1].score >= 2 ? reach[1] : null;
      var likely = x("You’ll probably ", "Anda mungkin akan ") + L1.c.lead + (L2 ? x(", then ", ", kemudian ") + L2.c.back : "") + '. <span class="small">(' + L1.short + " " + L1.score + "/4" + (L2 ? ", " + L2.short + " " + L2.score + "/4" : "") + ")</span>";
      var inWorks = st.works.indexOf(L1.id) >= 0 && L1.score >= 2;
      var land = inWorks ? st.good + (kind === "full" ? "" : x(" Your other approaches here are less used, so add the one below.", " Pendekatan lain anda di sini kurang digunakan, jadi tambah yang di bawah.")) : st.fam[L1.family];
      // Tip: the least-used approach that works here (ties: order listed)
      var tl = ws.slice().sort(function (a, b) { return a.score - b.score || st.works.indexOf(a.id) - st.works.indexOf(b.id); })[0];
      // Strongest approach that works here, for when the first instinct isn't one of them
      var sw = ws.slice().sort(function (a, b) { return b.score - a.score || st.works.indexOf(a.id) - st.works.indexOf(b.id); })[0];
      var tip, tipId;
      if (!inWorks && sw.score >= 3) { tipId = sw.id; tip = x("Lead with " + sw.name + " (" + sw.score + "/4) instead, which you already use: ", "Mulakan dengan " + sw.name + " (" + sw.score + "/4), yang sudah anda gunakan: ") + st.tips[sw.id]; }
      else if (inWorks && kind === "full") { tipId = tl.id; tip = (tl.score >= 3 ? x("Keep it up: ", "Teruskan: ") : x("Keep it up. To round it out, add " + tl.name + ": ", "Teruskan. Untuk melengkapkannya, tambah " + tl.name + ": ")) + st.tips[tl.id]; }
      else { tipId = tl.id; tip = x("Add " + tl.name + " (" + tl.score + "/4): ", "Tambah " + tl.name + " (" + tl.score + "/4): ") + st.tips[tl.id]; }
      return { st: st, kind: kind, likely: likely, land: land, tip: tip, L1: L1, tl: byId[tipId] };
    });
    function practiseIn(s) {
      return SCEN.filter(function (st) { return st.works.indexOf(s.id) >= 0; }).map(function (st) { return esc(st.name); }).join(" · ");
    }

    // Malaysian lens
    var hierNames = ["rational", "consultation", "apprising"].filter(function (id) { return byId[id].score >= 3; }).map(function (id) { return byId[id].name; });
    var lensH = hierNames.length ? C.lens.hierarchyFit.replace("{names}", joinAnd(hierNames)) : C.lens.hierarchyBuild;
    var lensS = famAvg.SOFT >= 2.5 ? C.lens.softHigh : famAvg.SOFT <= 1.5 ? C.lens.softLow : C.lens.softMid;
    var lensF = famAvg.HARD <= 1.4 ? C.lens.hardLow : famAvg.HARD >= 2.5 ? C.lens.hardHigh : C.lens.hardMid;

    // Text pieces
    var topNames = scored.filter(function (s) { return s.score === max; }).map(function (s) { return s.name; });
    var lowNames = focus.map(function (s) { return s.name; });
    var edgeAll = mainShown.concat(reserveShown).map(function (s) { return s.c.edge + " (" + s.name + ")"; });
    var famCaption = famRank[0] === "CORE" ? x("Most of your weight sits in Core levers, the ones most linked to genuine commitment.", "Sebahagian besar pilihan anda tertumpu pada pendekatan Teras, yang paling kerap dikaitkan dengan komitmen sebenar.")
      : famRank[0] === "SOFT" ? x("Your weight leans towards relationship levers, with " + famName(famRank[2]) + " levers used least.", "Pilihan anda lebih cenderung kepada pendekatan hubungan, dengan pendekatan " + famName(famRank[2]) + " paling jarang digunakan.")
      : x("Your weight leans towards Hard levers, which drive action but can cost goodwill if overused.", "Pilihan anda lebih cenderung kepada pendekatan Keras, yang menggerakkan tindakan tetapi boleh menghakis muhibah jika berlebihan.");
    var big = S.big + x(" Your clearest growth opportunity is ", " Peluang perkembangan anda yang paling jelas ialah ") + M.c.edge + " (" + M.name + ")" + (reserveShown.length ? x(", while keeping ", ", sambil menyimpan ") + joinAnd(reserveShown.map(function (s) { return s.c.edge; })) + x(" in reserve for when goodwill isn’t enough.", " untuk digunakan apabila hubungan baik tidak mencukupi.") : ".");
    var dateBit = input.dateText ? x(" · Completed ", " · Dijawab pada ") + esc(input.dateText) : "";
    var who = esc(input.name || x("Participant", "Peserta"));
    var first = String(input.callName || "").trim() || firstName(input.name) || x("Hello", "Hai");
    var focusTitle = joinAnd(mainShown.concat(reserveShown).map(function (s) { return s.name; }));

    function scoreRows() {
      var r = "";
      ["CORE", "SOFT", "HARD"].forEach(function (f) {
        r += '<tr class="famrow"><td colspan="3"><span class="sw" style="background:' + FILL[f] + '"></span>' + famName(f).toUpperCase() + ' <span class="avg">' + x("average ", "purata ") + f1(famAvg[f]) + " / 4</span></td></tr>";
        scored.filter(function (s) { return s.family === f; }).forEach(function (s) {
          var bar = ""; for (var k = 0; k < 4; k++) bar += '<span class="cell' + (k < s.score ? " on" : "") + '"></span>';
          r += "<tr" + (s.isFocus ? ' class="focusrow"' : "") + '><td class="ln">' + esc(s.name) + '</td><td class="bar">' + bar + '</td><td class="bd"><b>' + s.score + "</b> · " + (s.isFocus ? x("Focus", "Fokus") : band(s.score)) + "</td></tr>";
        });
      });
      return r;
    }
    function strengthCard(s) {
      var pos = { 0: 6, 1: 22, 2: 42, 3: 62, 4: 80 }[s.score];
      return '<div class="lever"><div class="lvhead"><h3 style="display:flex;align-items:center;gap:8px">' + ic(s.icon, 20) + esc(s.name) + '</h3><span class="lvsc">' + s.score + "/4</span></div>"
        + '<div class="scale"><div class="zone z1">' + x("Underused", "Jarang digunakan") + '</div><div class="zone z2">' + x("Sweet spot", "Tahap seimbang") + '</div><div class="zone z3">' + x("Overplay risk", "Risiko berlebihan") + '</div><div class="marker" style="left:' + pos + '%"><span>' + x("YOU", "ANDA") + '</span></div></div>'
        + '<div class="ends"><div><b style="color:var(--green)">' + x("At its best:", "Pada tahap terbaik:") + '</b> ' + s.c.best + '</div><div style="text-align:right"><b style="color:#9A6B1F">' + x("If overplayed:", "Jika berlebihan:") + '</b> ' + s.c.over + "</div></div>"
        + '<p class="line"><b>' + x("Early warning signs.", "Tanda awal.") + '</b> ' + s.c.signs + '</p>' + (strengths.length >= 6 ? "" : research(s, strengths.length >= 5)) + "</div>";
    }
    function research(s, short) {
      var rs = s.c.research || C0.levers[s.id].research;
      if (short) return '<p class="line rs"><b>' + x("What the research says.", "Apa kata kajian.") + '</b> ' + x("Rated " + rs[0].toLowerCase() + " for winning commitment.", "Dinilai " + ({ "High": "tinggi", "Moderate": "sederhana", "Low to moderate": "rendah hingga sederhana", "Low": "rendah" }[rs[0]]) + " untuk mendapatkan komitmen.") + "</p>";
      var lvl = LG === "ms" ? { "High": "tinggi", "Moderate": "sederhana", "Low to moderate": "rendah hingga sederhana", "Low": "rendah" }[rs[0]] : rs[0].toLowerCase();
      return '<p class="line rs"><b>' + x("What the research says.", "Apa kata kajian.") + '</b> ' + x("Rated " + lvl + " for winning commitment. ", "Dinilai " + lvl + " untuk mendapatkan komitmen. ") + rs[1] + "</p>";
    }
    function devCard(s, isFirst) {
      return '<div class="lever"' + (isFirst ? ' style="border:2px solid var(--green)"' : "") + '><div class="lvhead"><h3 style="display:flex;align-items:center;gap:8px">' + ic(s.icon, 20, "#36AA54") + esc(s.name) + '</h3><span class="lvsc">' + s.score + "/4 · " + (isFirst ? x("Main focus", "Fokus utama") : x("Also a focus", "Fokus tambahan")) + "</span></div>"
        + '<div class="two"><div><div class="lab">' + x("Why it matters", "Kenapa ia penting") + '</div><p style="font-size:9.6pt">' + s.c.why + '</p><div class="lab" style="margin-top:8px">' + x("Why you might use it less", "Kenapa anda mungkin kurang menggunakannya") + '</div><p style="font-size:9.6pt">' + s.c.whyLess + "</p></div>"
        + '<div><div class="lab">' + x("Phrases to try", "Ayat yang boleh dicuba") + '</div><p style="font-size:9.6pt">' + s.c.phrases.join("<br>") + '</p>' + (practiseIn(s) ? '<div class="lab" style="margin-top:8px">' + x("Where to practise first", "Di mana untuk berlatih dahulu") + '</div><p style="font-size:9.6pt;margin:0">' + practiseIn(s) + "</p>" : "") + "</div></div>" + research(s) + "</div>";
    }
    function reserveCard(s, short) {
      return '<div class="lever"><div class="lvhead"><h3 style="display:flex;align-items:center;gap:8px">' + ic(s.icon, 20) + esc(s.name) + '</h3><span class="lvsc" style="color:var(--muted)">' + s.score + "/4 · " + x("Keep in reserve", "Guna bila perlu") + "</span></div>"
        + (short ? "" : '<p style="font-size:9.8pt">' + s.c.reserve + "</p>") + '<p style="font-size:9.8pt;margin:0"><b>' + x("Try this line:", "Cuba ayat ini:") + '</b> ' + s.c.reserveLine + "</p></div>";
    }
    var tiles = strengths.slice(0, 5).map(function (s) { return tile(s, false); }).join("");
    var edgeTiles = mainShown.map(function (s, i) { return tile(s, i === 0 ? "main" : "main2"); }).concat(reserveShown.map(function (s) { return tile(s, "reserve"); })).slice(0, 2).join("");
    var plan2 = reserveShown.length ? reserveShown[0] : (mainShown[1] || null);

    var h = [];
    h.push('<!doctype html><html lang="' + LG + '"><head><meta charset="utf-8"><title>' + who + x(" · Influence Profile (Full report)", " · Profil Gaya Mempengaruhi (Laporan Penuh)") + "</title><style>" + CSS + "</style></head><body class=\"" + LG + "\">");
    var rid = String(input.reportId || "").replace(/[^A-Za-z0-9_-]/g, "");
    var sw = function (code, label) {
      return '<button class="lang' + (LG === code ? " on" : "") + '"' + (LG === code ? " disabled" : ' onclick="if(window.opener&&window.opener.GIGRenderFull){window.opener.GIGRenderFull(\'' + rid + '\',\'' + code + '\',window)}else{alert(\'' + x("Open this report again from the admin page to switch language.", "Buka semula laporan ini dari halaman admin untuk menukar bahasa.") + '\')}"') + ">" + label + "</button>";
    };
    var nameBox = rid ? '<span class="nm">' + x("Call them", "Panggilan") + ' <input id="gigfn" value="' + esc(first) + '" size="10"><button onclick="if(window.opener&&window.opener.GIGRenderFull){window.opener.GIGRenderFull(\'' + rid + '\',\'' + LG + '\',window,document.getElementById(\'gigfn\').value)}">' + x("UPDATE", "KEMAS KINI") + "</button></span>" : "";
    h.push('<div class="toolbar"><span>' + x("Full report · ", "Laporan penuh · ") + who + '</span><span class="tbr">' + nameBox + (rid ? '<span class="langs">' + sw("ms", "BM") + sw("en", "EN") + "</span>" : "") + '<button onclick="window.print()">' + x("⤓ SAVE AS PDF", "⤓ SIMPAN SEBAGAI PDF") + "</button></span></div>");

    // 1 Cover
    var coverAt = h.length + 1;
    h.push('<section class="page cover"><img src="' + C0.logo + '" alt="Growth Impact Group"><div class="t"><div class="k">' + x("Influence Self-Audit · Full report", "Audit Kendiri Pengaruh · Laporan penuh") + '</div><h1>' + x("Your Influence<br><span>Profile</span>", "Profil Gaya<br><span>Mempengaruhi Anda</span>") + '</h1><div class="who">' + who + '</div>' + ((input.designation || input.organisation) ? '<div class="meta" style="color:var(--ink)">' + esc([input.designation, input.organisation].filter(Boolean).join(" · ")) + "</div>" : "") + '<div class="meta">' + (input.session ? x("Session ", "Sesi ") + esc(input.session) : "") + dateBit + x(" · Consistency ", " · Ketekalan ") + pct + '%</div></div><div class="foot">Growth Impact Group Malaysia Sdn. Bhd. · ' + x("This report describes the influence preferences you showed in a forced-choice exercise. It is a development tool, not a test of ability. Confidential to the participant and their facilitator.", "Laporan ini menggambarkan kecenderungan mempengaruhi yang anda tunjukkan dalam latihan pilihan paksa. Ia alat pembangunan, bukan ujian kebolehan. Sulit untuk peserta dan fasilitator mereka.") + '</div></section>');

    // Circular choices: three levers where every one "beat" another (A over B, B over C, C over A).
    // These are exactly the triads that lower the consistency score.
    function findLoops(ans) {
      if (!ans || typeof ans !== "object") return null;
      var w = {}, ids = {};
      Object.keys(ans).forEach(function (k) { var pr = k.split("__"); if (pr.length !== 2) return; w[pr[0] + ">" + pr[1]] = ans[k] === pr[0]; w[pr[1] + ">" + pr[0]] = ans[k] === pr[1]; ids[pr[0]] = ids[pr[1]] = 1; });
      var L = Object.keys(ids), out = [];
      function beats(a, b) { return w[a + ">" + b]; }
      function has(a, b) { return (a + ">" + b) in w; }
      for (var i = 0; i < L.length; i++) for (var j = i + 1; j < L.length; j++) for (var k = j + 1; k < L.length; k++) {
        var A = L[i], B = L[j], Cc = L[k];
        if (!(has(A, B) && has(B, Cc) && has(A, Cc))) continue;
        if (beats(A, B) && beats(B, Cc) && beats(Cc, A)) out.push([A, B, Cc]);
        else if (beats(B, A) && beats(A, Cc) && beats(Cc, B)) out.push([B, A, Cc]);
      }
      return out.filter(function (t) { return byId[t[0]] && byId[t[1]] && byId[t[2]]; });
    }
    var loops = findLoops(input.answers);
    scored.forEach(function (sx) { sx.inLoop = !!(loops && loops.some(function (t) { return t.indexOf(sx.id) >= 0; })); });
    function loopBox() {
      if (!loops || !loops.length) return "";
      var shown = loops.slice(0, 4);
      return '<div class="loops"><div class="lab" style="color:#9A6B1F;margin:0">' + x("Choices that went in a circle", "Pilihan yang berpusing dalam bulatan") + " (" + loops.length + ')*</div><div class="lps">'
        + shown.map(function (t) { return '<span class="lp">' + t.concat([t[0]]).map(function (id) { return esc(byId[id].short); }).join(" › ") + "</span>"; }).join("")
        + (loops.length > shown.length ? '<span class="lpm">' + x("+" + (loops.length - shown.length) + " more", "+" + (loops.length - shown.length) + " lagi") + "</span>" : "") + "</div>"
        + '<p class="small" style="margin:3px 0 0">' + x("These lowered your consistency score: in each loop you chose the first lever over the second and the second over the third, but the third over the first. Usually those levers feel close for you, or depend on the situation. Worth discussing in your debrief. <b>*</b> marks these levers on your influence web: read their scores with a little more care.", "Inilah yang merendahkan skor konsistensi anda: dalam setiap bulatan, anda memilih yang pertama berbanding yang kedua dan yang kedua berbanding yang ketiga, tetapi yang ketiga berbanding yang pertama. Biasanya pendekatan itu hampir sama bagi anda, atau bergantung pada situasi. Wajar dibincangkan semasa sesi taklimat. <b>*</b> menandakan pendekatan ini pada carta anda: baca skornya dengan lebih berhati-hati.") + "</p></div>";
    }

    // What a 0–4 score means: tendency, not ability
    function scaleBox() {
      var steps = [
        [0, x("Least likely", "Paling kurang cenderung"), x("You chose another approach every time.", "Anda memilih pendekatan lain setiap kali."), x("Less used", "Jarang dipilih")],
        [1, x("Rarely", "Jarang"), x("Seldom your first choice.", "Jarang menjadi pilihan pertama."), x("Less used", "Jarang dipilih")],
        [2, x("Sometimes", "Kadang-kadang"), x("Depends on the situation.", "Bergantung pada situasi."), x("Situational", "Mengikut keadaan")],
        [3, x("Often", "Kerap"), x("One of your go-to moves.", "Antara pendekatan utama anda."), x("Signature", "Kecenderungan utama")],
        [4, x("Most likely", "Paling cenderung"), x("Your default.", "Pilihan lazim anda."), x("Signature", "Kecenderungan utama")]
      ];
      var strip = steps.map(function (st) {
        var d = ""; for (var k = 0; k < 4; k++) d += '<span class="dot" style="background:' + (k < st[0] ? "#1A1A1A" : "#E6E9EC") + '"></span>';
        return '<div class="sstep"><div class="snum">' + st[0] + '</div><div class="sdots">' + d + '</div><b>' + st[1] + "</b><span>" + st[2] + '</span><i>' + st[3] + "</i></div>";
      }).join("");
      var signal = max === min ? x("All your levers scored " + max + ", so none stands out.", "Semua pendekatan anda mendapat skor " + max + ", jadi tiada yang menonjol.")
        : x("Your clearest signals are ", "Isyarat paling jelas anda ialah ") + joinAnd(topNames) + " (" + max + x(") at the top and ", ") di atas dan ") + joinAnd(lowNames) + " (" + min + x(") at the bottom.", ") di bawah.");
      return '<div class="scalebox"><div class="lab" style="color:var(--ink)">' + x("What your scores mean", "Maksud skor anda") + '</div><div class="sstrip">' + strip + "</div>"
        + '<p><b>' + x("Scores show tendency, not ability.", "Skor menunjukkan kecenderungan, bukan kebolehan.") + "</b> "
        + x("They rank how likely you are to reach for each lever compared with your other options. A 0 doesn’t mean you’re bad at a lever, only that when you had a choice, you reached for something else. Your development focus explores why, and when choosing it would help. A 4 doesn’t mean you’re skilled at it either, only that it’s your default, which is why this report also looks at when it gets overplayed.",
            "Ia menyusun sejauh mana anda cenderung menggunakan setiap pendekatan berbanding pilihan lain. Skor 0 tidak bermakna anda lemah dalam pendekatan itu, cuma apabila diberi pilihan, anda memilih yang lain. Fokus perkembangan anda meneroka sebabnya, dan bila memilihnya akan membantu. Skor 4 juga tidak bermakna anda mahir, cuma ia pilihan lazim anda, sebab itu laporan ini turut melihat bila ia digunakan secara berlebihan.") + "</p>"
        + (true ? "" : '<div class="smine"><div><b>' + joinAnd(topNames) + " (" + max + ")</b> " + x((topNames.length > 1 ? "are your defaults" : "is your default") + ": what you’re most likely to reach for first. A real strength, to use deliberately and to watch for overuse.", (topNames.length > 1 ? "ialah pilihan lazim anda" : "ialah pilihan lazim anda") + ": apa yang paling mungkin anda gunakan dahulu. Satu kekuatan sebenar, untuk digunakan dengan sengaja dan diawasi supaya tidak berlebihan.") + "</div><div><b>" + joinAnd(lowNames) + " (" + min + ")</b> " + x((lowNames.length > 1 ? "are" : "is") + " what you’re least likely to use. Not a weakness, but a habit worth exploring: your development focus looks at why, and where it would help.", "ialah apa yang paling kurang cenderung anda gunakan. Bukan kelemahan, tetapi kebiasaan yang wajar diterokai: fokus perkembangan anda melihat sebabnya, dan di mana ia boleh membantu.") + "</div></div>")
        + '<p class="small" style="margin:0">' + x("Each score comes from four comparisons, and all 11 always add up to 22, so treat scores one point apart as similar.", "Setiap skor datang daripada empat perbandingan, dan jumlah kesemua 11 sentiasa 22, jadi anggap skor yang berbeza satu mata sebagai hampir sama.") + "" + "</p></div>";
    }

    // 2 The research behind the report
    var T = C.theory || C0.theory;
    var RORDER = ["rational", "consultation", "collaboration", "inspirational", "apprising", "ingratiation", "personal", "exchange", "coalition", "legitimating", "pressure"];
    var RW = { "High": 100, "Moderate": 64, "Low to moderate": 40, "Low": 22 };
    var RBAR = { CORE: "#36AA54", SOFT: "#C9A24E", HARD: "#7D8895" };
    function rchart() {
      var r = '<table class="rchart"><tr><th style="width:27%">' + x("Tactic", "Taktik") + '</th><th>' + x("Research rating for winning commitment", "Penilaian kajian untuk mendapatkan komitmen") + '</th><th style="width:15%">' + x("Used mainly with", "Banyak digunakan dengan") + '</th><th style="width:15%">' + x("You", "Anda") + "</th></tr>";
      var lastFam = "";
      RORDER.forEach(function (id) {
        var s = byId[id], rs = s.c.research || C0.levers[id].research, uw = s.c.usedWith || C0.levers[id].usedWith;
        if (s.family !== lastFam) { lastFam = s.family; r += '<tr class="rfam"><td colspan="4"><span class="sw" style="background:' + FILL[s.family] + '"></span>' + famName(s.family).toUpperCase() + "</td></tr>"; }
        r += '<tr><td class="rn">' + esc(s.name) + '</td><td><div class="rtrack"><div class="rbar" style="width:' + RW[rs[0]] + "%;background:" + RBAR[s.family] + '"></div><span class="rlab">' + esc(LG === "ms" ? { "High": "Tinggi", "Moderate": "Sederhana", "Low to moderate": "Rendah–sederhana", "Low": "Rendah" }[rs[0]] : rs[0]) + '</span></div></td><td class="ru">' + esc(uw) + '</td><td class="ryou">' + dots(s.score, s.isFocus ? "#36AA54" : "#1A1A1A") + " <b>" + s.score + "</b></td></tr>";
      });
      return r + "</table>";
    }
    h.push('<section class="page theory"><div class="k">' + x("The research behind your report", "Kajian di sebalik laporan anda") + '</div><h2>' + x("Built on decades of influence research", "Berasaskan kajian pengaruh selama beberapa dekad") + '</h2>'
      + '<p class="lead" style="margin-bottom:8px">' + esc(first) + x(", before your results, here is where they come from.", ", sebelum keputusan anda, berikut ialah asas laporan ini.") + "</p>"
      + "<p>" + T.intro + "</p>"
      + '<div class="outc">' + T.outcomes.map(function (o, i) { return '<div class="oc o' + i + '"><b>' + esc(o[0]) + "</b><span>" + o[1] + "</span></div>"; }).join('<div class="oarr">›</div>') + "</div>"
      + '<div class="two" style="margin-top:10px"><div><div class="lab">' + x("What the research found", "Dapatan kajian") + '</div><ul class="fl">' + T.findings.map(function (f) { return "<li>" + f + "</li>"; }).join("") + '</ul></div><div><div class="lab">' + x("How this report uses it", "Cara laporan ini menggunakannya") + '</div><p style="font-size:9.6pt">' + T.how + "</p></div></div>"
      + '<div class="rbox"><div class="lab" style="color:var(--ink)">' + esc(T.chartTitle) + "</div>" + rchart() + '<p class="small" style="margin:6px 0 0">' + T.chartNote + "</p></div>"
      + '<div class="src"><b>' + x("Sources", "Sumber") + "</b><ol>" + T.sources.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol></div></section>");

    // 2b Glossary of the 11 levers
    var FAMDESC = {
      CORE: x("Win genuine commitment: people agree because they see the sense, share the goal or get real help.", "Mendapatkan komitmen sebenar: orang bersetuju kerana nampak rasionalnya, berkongsi matlamat atau mendapat bantuan sebenar."),
      SOFT: x("Draw on relationships and goodwill: appreciation, trust and give-and-take.", "Bergantung pada hubungan dan muhibah: penghargaan, kepercayaan dan saling membantu."),
      HARD: x("Rely on authority, deadlines or other people. Useful for keeping things moving, but best kept in reserve.", "Bergantung pada autoriti, tarikh akhir atau pihak lain. Berguna untuk memastikan kerja bergerak, tetapi lebih baik disimpan untuk digunakan bila perlu.")
    };
    var gl = "";
    ["CORE", "SOFT", "HARD"].forEach(function (f) {
      gl += '<tr class="gfam"><td colspan="3"><span class="sw" style="background:' + FILL[f] + '"></span>' + famName(f).toUpperCase() + ' <span class="gfd">' + FAMDESC[f] + "</span></td></tr>";
      RORDER.filter(function (id) { return byId[id].family === f; }).forEach(function (id) {
        var s = byId[id], say = (s.c.phrases && s.c.phrases[0]) || s.c.reserveLine || "";
        gl += '<tr><td class="gn">' + ic(s.icon, 16, s.isFocus ? "#36AA54" : "#1A1A1A") + "<span>" + esc(s.name) + '</span></td><td class="gd">' + s.c.defn + '</td><td class="gs">' + say + "</td></tr>";
      });
    });
    h.push('<section class="page gloss"><div class="k">' + x("Glossary", "Glosari") + '</div><h2>' + x("The 11 levers", "11 pendekatan mempengaruhi") + '</h2><p class="lead" style="margin-bottom:8px">' + esc(first) + x(", here are the 11 levers in plain words, in the three groups this report uses. The names are the ones used in Yukl’s research.", ", berikut ialah 11 pendekatan dalam bahasa mudah, mengikut tiga kumpulan yang digunakan dalam laporan ini.") + "</p>"
      + '<table class="gl"><tr><th style="width:24%">' + x("Lever", "Pendekatan") + "</th><th>" + x("What it means", "Maksudnya") + '</th><th style="width:34%">' + x("What it sounds like", "Contoh ayat") + "</th></tr>" + gl + "</table>" + scaleBox() + "</section>");

    // 2 Key findings: the whole report on one page (replaces the old "results at a glance" page)
    var planPage = mainShown.length + reserveShown.length === 1 ? 9 : 10;
    function pref(t) { return '<span class="kfp">' + x("p. ", "hlm. ") + t + "</span>"; }
    function bigTile(s, kind) {
      var col = kind === "main" || kind === "main2" ? "#36AA54" : kind === "reserve" ? "#8A9099" : "#1A1A1A";
      var lab = kind === "main" ? x("MAIN FOCUS", "FOKUS UTAMA") : kind === "main2" ? x("ALSO A FOCUS", "FOKUS TAMBAHAN") : kind === "reserve" ? x("KEEP IN RESERVE", "GUNA BILA PERLU")
        : s.score === 4 ? x("YOUR DEFAULT", "PILIHAN LAZIM") : s.score === 3 ? x("GO-TO MOVE", "KERAP DIPILIH") : x("MOST USED", "PALING KERAP");
      return '<div class="kt' + (kind ? " " + kind : "") + '"><div class="kic" style="border-color:' + col + '">' + ic(s.icon, 22, col) + '</div><div class="kn">' + esc(s.name) + '</div><div class="kd">' + dots(s.score, col) + '</div><div class="kl" style="color:' + col + '">' + lab + "</div></div>";
    }
    var SICON = { deadline: "calendar", stranger: "user-plus", boss: "briefcase", peer: "link", team: "layers", pushback: "alert-circle", change: "flag", commit: "check-circle" };
    function sitIcon(f) {
      var col = f.kind === "full" ? "#36AA54" : f.kind === "half" ? "#1A1A1A" : "#8A9099";
      return '<div class="ks ' + f.kind + '"><div class="ksi">' + ic(SICON[f.st.id] || "flag", 20, col, 1.8) + '<span class="ksm">' + mark(f.kind) + '</span></div><div class="ksn">' + esc(f.st.short || f.st.name) + "</div></div>";
    }
    // Compact version of the circles box for this page: up to 3 circles and a short explanation.
    function kfLoops() {
      if (!loops || !loops.length) return "";
      var shown = loops.slice(0, 3);
      return '<div class="loops"><div class="lab" style="color:#9A6B1F;margin:0">' + x("Choices that went in a circle", "Pilihan yang berpusing dalam bulatan") + " (" + loops.length + ')*</div><div class="lps">'
        + shown.map(function (t) { return '<span class="lp">' + t.concat([t[0]]).map(function (id) { return esc(byId[id].short); }).join(" › ") + "</span>"; }).join("")
        + (loops.length > shown.length ? '<span class="lpm">' + x("+" + (loops.length - shown.length) + " more", "+" + (loops.length - shown.length) + " lagi") + "</span>" : "") + "</div>"
        + '<p class="small" style="margin:3px 0 0">' + x("In each circle you chose the first lever over the second and the second over the third, but the third over the first. These levers probably feel close for you, or depend on the situation, so read their scores (marked * on your web) with care, and discuss them in your debrief.",
          "Dalam setiap bulatan, anda memilih yang pertama berbanding yang kedua dan yang kedua berbanding yang ketiga, tetapi yang ketiga berbanding yang pertama. Pendekatan ini mungkin hampir sama bagi anda, atau bergantung pada situasi, jadi baca skornya (bertanda * pada carta) dengan berhati-hati dan bincangkannya semasa sesi taklimat.") + "</p></div>";
    }
    var growTiles = mainShown.map(function (s, i) { return [s, i === 0 ? "main" : "main2"]; }).concat(reserveShown.map(function (s) { return [s, "reserve"]; })).slice(0, 3);
    var leanTiles = strengths.slice(0, Math.min(5, 7 - growTiles.length));
    var kf = '<section class="page kf' + (loops && loops.length ? " kf-loops" : "") + '"><div class="k">' + x("Your key findings", "Dapatan utama anda") + '</div><h2>' + x("Your influence at a glance", "Pengaruh anda sekilas pandang") + "</h2>"
      + '<p class="lead">' + esc(first) + x(", here are your 22 choices and what they add up to, on one page. The page numbers show where each point is explained in full.", ", berikut ialah 22 pilihan anda dan maksudnya, dalam satu halaman. Nombor halaman menunjukkan di mana setiap perkara dijelaskan sepenuhnya.") + "</p>"
      + '<div class="kf-top"><div><div class="lab">' + x("Your influence web", "Carta gaya mempengaruhi anda") + '</div><div class="kf-web">' + radar(scored, 15, 13) + "</div>"
      + '<p class="small" style="margin:6px 0 0;line-height:1.35">' + x("Each spoke is one lever, scored 0–4. The further out the dot, the more likely you are to use it. The dashed ring marks 2, the balance point. Scores show tendency, not ability (page 4).", "Setiap jejari ialah satu pendekatan, dengan skor 0–4. Semakin jauh titik dari tengah, semakin cenderung anda menggunakannya. Gelang putus-putus menandakan 2, titik tengah. Skor menunjukkan kecenderungan, bukan kebolehan (halaman 4).") + "</p></div>"
      + '<div><div class="kf-style"><div class="kf-badge">' + venn(style.key, true) + '</div><div><div class="lab" style="margin:0">' + x("Your style", "Gaya anda") + pref(5) + '</div><div class="kf-sname">' + esc(S.name) + '</div><div class="kf-shl">' + esc(S.headline) + "</div></div></div>"
      + '<p class="kf-big">' + S.big + "</p>"
      + '<div class="kf-mini"><div>' + gauge(pct) + "</div><p>" + (reliable ? x("<b>Reliable.</b> Your choices agree with each other " + pct + "% of the time.", "<b>Boleh dipercayai.</b> Pilihan anda selaras antara satu sama lain " + pct + "% daripada masa.") : x("<b>Worth exploring further.</b> Below 80%, so treat this as a starting point to discuss with your facilitator.", "<b>Perlu diteliti lanjut.</b> Di bawah 80%, jadi anggap ini titik permulaan untuk dibincangkan bersama fasilitator anda.")) + "</p></div>"
      + '<div class="lab" style="margin-top:8px">' + x("Where your 22 choices went", "Pembahagian 22 pilihan anda") + '</div><div class="split"><span style="flex:' + famSum.CORE + ';background:#E2F1E5">' + famName("CORE") + " " + famSum.CORE + '</span><span style="flex:' + famSum.SOFT + ';background:#F4EDDD">' + famName("SOFT") + " " + famSum.SOFT + '</span><span style="flex:' + famSum.HARD + ';background:#E6EAF0">' + famName("HARD") + " " + famSum.HARD + "</span></div>"
      + '<div class="lab" style="margin-top:8px">' + x("Your range", "Julat pendekatan anda") + "</div>" + meter(inUse) + '<p class="kf-cap" style="margin:0"><b style="color:var(--ink)">' + R[0] + ".</b> " + inUse + x(" of 11 levers scored 2 or more.", " daripada 11 pendekatan mendapat skor 2 atau lebih.") + "</p>"
      + "</div></div>"
      + '<div class="kf-sec kf-tiles" style="grid-template-columns:' + leanTiles.length + "fr " + (growTiles.length + 0.4) + 'fr"><div><div class="lab">' + x("What you lean on", "Pendekatan yang biasa anda gunakan") + pref(7) + '</div><div class="kf-tg" style="grid-template-columns:repeat(' + leanTiles.length + ',1fr)">' + leanTiles.map(function (s) { return bigTile(s, ""); }).join("") + "</div></div>"
      + '<div><div class="lab" style="padding-left:14px">' + x("Where to grow", "Ruang untuk berkembang") + pref(8) + '</div><div class="kf-tg2" style="grid-template-columns:repeat(' + growTiles.length + ',1fr)">' + growTiles.map(function (g) { return bigTile(g[0], g[1]); }).join("") + "</div></div></div>"
      + '<div class="kf-sec"><div class="lab">' + x("Where your style fits", "Kesesuaian gaya anda") + pref(6) + '</div><div class="kf-sits">' + fits.map(sitIcon).join("") + "</div>"
      + '<div class="kf-leg"><span>' + mark("full") + x(" Fits naturally", " Sepadan secara semula jadi") + "</span><span>" + mark("half") + x(" Partly fits", " Sebahagiannya sepadan") + "</span><span>" + mark("empty") + x(" Not a natural fit yet", " Belum sepadan") + "</span></div></div>"
      + '<div class="kf-next"><div class="kf-pair"><div><div class="kic">' + ic(topStrength.icon, 22, "#1A1A1A") + '</div><div class="kf-pl">' + esc(topStrength.short.toUpperCase()) + '</div></div><span class="plus">+</span><div><div class="kic" style="border-color:#36AA54">' + ic(M.icon, 22, "#36AA54") + '</div><div class="kf-pl" style="color:#36AA54">' + esc(M.short.toUpperCase()) + "</div></div></div>"
      + '<div><div class="lab" style="color:var(--green)">' + x("Your next step", "Langkah seterusnya") + '<span class="kfp">' + x("p. 5 and p. " + planPage, "hlm. 5 dan " + planPage) + "</span></div><p>" + x("You already ", "Anda sudah biasa ") + topStrength.c.sigVerb + x(". Next time, ", ". Lain kali, ") + M.c.bridge + "</p>"
      + '<p class="ifthen"><b>' + x("IF", "JIKA") + "</b> " + M.c.ifThen[0] + ", <b>" + x("THEN", "MAKA") + "</b> " + M.c.ifThen[1] + "</p></div></div>"
      + kfLoops() + "</section>";
    h.splice(coverAt, 0, kf);

    var styleLabels = {};
    Object.keys(STYFAM).forEach(function (k) { styleLabels[k] = (C.styles[k] && C.styles[k].short) || C0.styles[k].short || C0.styles[k].name.replace(/^The /, ""); });
    var topSorted = style.top.slice().sort(function (a, b) { return b.score - a.score || ORDER.indexOf(a.id) - ORDER.indexOf(b.id); });
    var topGroups = [];
    topSorted.forEach(function (s) { var g = topGroups[topGroups.length - 1]; if (g && g.score === s.score) g.names.push(s.name); else topGroups.push({ score: s.score, names: [s.name] }); });
    var topList = topGroups.map(function (g) { return "<b>" + esc(joinAnd(g.names)) + "</b> (" + g.score + ")"; });
    topList = topList.length > 1 ? topList.slice(0, -1).join(", ") + x(" and ", " dan ") + topList[topList.length - 1] : topList[0];
    var topFams = ["CORE", "SOFT", "HARD"].filter(function (f) { return style.top.some(function (s) { return s.family === f; }); });
    var famList = joinAnd(topFams.map(function (f) { return "<b>" + famName(f) + "</b>"; }));
    var styleWhy = LG === "ms"
      ? "Pendekatan utama anda, " + topList + ", datang daripada kumpulan " + famList + ". " + (topFams.length === 1 ? "Kumpulan " + famName(topFams[0]) + " sahaja menjadikan gaya anda " + esc(S.name) + "." : topFams.length === 2 ? "Gabungan " + famName(topFams[0]) + " dan " + famName(topFams[1]) + " menjadikan gaya anda " + esc(S.name) + "." : "Gabungan ketiga-tiga kumpulan menjadikan gaya anda " + esc(S.name) + ".")
      : "Your top levers, " + topList + ", come from the " + famList + (topFams.length > 1 ? " families" : " family") + ". " + (topFams.length === 1 ? famName(topFams[0]) + " alone makes " + esc(S.name) + "." : topFams.length === 2 ? famName(topFams[0]) + " and " + famName(topFams[1]) + " together makes " + esc(S.name) + "." : "Drawing on all three makes " + esc(S.name) + ".");

    // 4 Style in depth (the free report already gave the description, signature moves and untapped edge)
    h.push('<section class="page"><div class="k">' + x("Your influence style", "Gaya anda mempengaruhi orang lain") + '</div><h2>' + x("Your style in depth", "Gaya anda dengan lebih mendalam") + '</h2>'
      + '<p class="lead" style="margin-bottom:10px">' + esc(first) + x(", your free report introduced your style. This page goes further: where it works, where it can trip you up, and how to combine your levers.", ", laporan percuma anda telah memperkenalkan gaya anda. Halaman ini pergi lebih jauh: di mana ia berkesan, di mana ia boleh menyukarkan anda, dan cara menggabungkan pendekatan anda.") + "</p>"
      + '<div class="style sbox"><div class="smap">' + venn(style.key, false, styleLabels) + '</div><div><div class="lab" style="color:var(--green)">' + x("Your influence style", "Gaya anda mempengaruhi orang lain") + '</div><div class="name" style="font-size:' + (LG === "ms" ? 22 : 26) + 'pt">' + esc(S.name) + '</div><div class="hl" style="margin-bottom:8px">' + esc(S.headline) + "</div>"
      + '<p class="swhy">' + styleWhy + '</p><p class="swhy" style="color:var(--muted);margin:0;font-size:8.4pt">' + x("The map shows all 7 styles. Your style depends on which families your top levers come from.", "Peta ini menunjukkan kesemua 7 gaya. Gaya anda bergantung pada kumpulan pendekatan utama anda.") + "</p></div></div>"
      + '<div class="two sscards" style="margin-top:14px"><div class="sc-good"><div class="lab" style="color:var(--green)">' + x("Where this style shines", "Di mana gaya ini paling berkesan") + '</div><p style="font-size:9.8pt">' + S.shines + '</p></div><div class="sc-over"><div class="lab" style="color:#9A6B1F">' + x("When it’s overplayed", "Apabila ia digunakan secara berlebihan") + '</div><p style="font-size:9.8pt">' + S.overplayed + "</p></div></div>"
      + '<div class="two combos" style="margin-top:12px"><div><div class="lab">' + x("Your natural combination", "Gabungan semula jadi anda") + '</div>' + (natural ? '<div class="pair"><div class="chip">' + esc(natural.a.short) + '</div><div class="plus">+</div><div class="chip">' + esc(natural.b.short) + '</div></div><p style="font-size:9.8pt">' + natural.text + "</p>" : '<p style="font-size:9.8pt">' + C.combos.naturalFallback + "</p>") + "</div>"
      + '<div><div class="lab">' + x("A combination to handle with care", "Gabungan yang perlu dikendalikan dengan berhati-hati") + '</div>' + (careIds.length ? '<div class="pair"' + (careIds.length === 1 ? ' style="grid-template-columns:1fr"' : "") + ">" + careIds.map(function (id) { return '<div class="chip w">' + esc(byId[id].short) + "</div>"; }).join('<div class="plus w">+</div>') + "</div>" : "") + '<p style="font-size:9.8pt">' + care + "</p></div></div>"
      + '<div class="style" style="margin-top:12px"><div class="lab" style="color:var(--green)">' + x("Your power pairing", "Gandingan berkesan anda") + '</div><div class="pair"><div class="chip">' + esc(topStrength.short) + x(" · your strength", " · kekuatan anda") + '</div><div class="plus">+</div><div class="chip g">' + esc(M.short) + x(" · your edge", " · ruang perkembangan") + "</div></div>"
      + '<p style="margin:0">' + x("The easiest way to grow a less-used lever is to attach it to something you already do well. You already ", "Cara paling mudah untuk mengembangkan pendekatan yang jarang digunakan ialah menggandingkannya dengan sesuatu yang sudah anda kuasai. Anda sudah biasa ") + topStrength.c.sigVerb + x(". Next time, ", ". Lain kali, ") + M.c.bridge + x(" You keep your natural style, and add a lever that widens your reach.", " Anda kekal dengan gaya semula jadi anda, sambil menambah pendekatan yang meluaskan pengaruh anda.") + "</p></div>"
      + '<div class="note" style="margin-bottom:0"><b style="color:var(--ink)">' + x("The big picture.", "Gambaran keseluruhan.") + '</b> ' + big + "</div></section>");

    // 5 Real situations
    h.push('<section class="page"><div class="k">' + x("Your style in real situations", "Gaya anda dalam situasi sebenar") + '</div><h2>' + x("What you’re likely to do", "Apa yang mungkin anda lakukan") + '</h2>'
      + '<p class="lead" style="margin-bottom:6px">' + esc(first) + x(", here is how your choices are likely to show up in eight common situations at work: your likely first move, how it tends to land, and one thing to try.", ", berikut ialah bagaimana pilihan anda mungkin terserlah dalam lapan situasi biasa di tempat kerja: langkah pertama anda, kesannya, dan satu perkara untuk dicuba.") + "</p>"
      + '<div class="legend"><span>' + mark("full") + x(" Your style matches what usually works", " Gaya anda sepadan dengan apa yang biasanya berkesan") + "</span><span>" + mark("half") + x(" Partly matches", " Sebahagiannya sepadan") + "</span><span>" + mark("empty") + x(" Doesn’t naturally match yet", " Belum sepadan") + '</span></div><div class="scen">'
      + fits.map(function (f) {
        return '<div class="scard" data-kind="' + f.kind + '" data-l1="' + f.L1.id + '" data-tip="' + f.tl.id + '"><div class="shead">' + mark(f.kind) + "<div><b>" + esc(f.st.name) + '</b><div class="small">' + x("What tends to work: ", "Biasanya berkesan: ") + f.st.works.map(function (id) { return byId[id].short; }).join(" · ") + "</div></div></div>"
          + '<p><b class="sl">' + x("Likely move.", "Langkah anda.") + "</b> " + f.likely + '</p><p><b class="sl">' + x("How it lands.", "Kesannya.") + "</b> " + f.land + '</p><p class="stry"><b class="sl">' + x("Try.", "Cuba.") + "</b> " + f.tip + "</p></div>";
      }).join("")
      + '</div><p class="small" style="margin:6px 0 0">' + x("These are tendencies based on the choices you made in this audit, not predictions. Under pressure, most people fall back on their most practised approach, which is why your top-scoring levers show up most often here.", "Ini ialah kecenderungan berdasarkan pilihan anda dalam audit ini, bukan ramalan. Apabila tertekan, kebanyakan orang kembali kepada pendekatan yang paling biasa mereka gunakan, sebab itu pendekatan dengan skor tertinggi anda paling kerap muncul di sini.") + "</p></section>");

    // 6 Strengths
    var n = strengths.length;
    h.push('<section class="page' + (n >= 4 ? " compact" : "") + (n >= 6 ? " compact6" : "") + '"><div class="k">' + x("Your signature strengths", "Kecenderungan utama anda") + '</div><h2>' + x("Your strengths and their shadow side", "Kekuatan anda dan sisi berlebihannya") + '</h2><p class="lead" style="margin-bottom:8px">'
      + (strengths[0].score >= 3 ? esc(first) + x(", you have " + (n === 1 ? "one signature strength" : n + " signature strengths") + (n >= 5 ? ", more than most people" : "") + ". ", ", anda mempunyai " + (n === 1 ? "satu kecenderungan utama" : n + " kecenderungan utama") + (n >= 5 ? ", lebih daripada kebanyakan orang" : "") + ". ") : esc(first) + x(", none of your levers reached the Signature band (3–4), so your highest-scoring levers are shown here. ", ", tiada pendekatan anda mencapai tahap Kecenderungan Utama (3–4), jadi pendekatan dengan skor tertinggi anda dipaparkan di sini. "))
      + x("The marker shows how often you chose each one: the further right, the more it is worth watching for the overplayed version.", "Penanda menunjukkan kekerapan anda memilih setiap satu: semakin ke kanan, semakin wajar anda berwaspada terhadap penggunaan berlebihan.") + "</p>" + strengths.slice(0, 6).map(strengthCard).join("") + "</section>");

    // 7 Development focus
    var lensJoin = mainShown.length + reserveShown.length === 1;
    h.push('<section class="page' + (mainShown.length + reserveShown.length >= 3 ? " compact" : "") + '"><div class="k">' + x("Your development focus", "Fokus perkembangan anda") + '</div><h2>' + esc(focusTitle) + '</h2><p class="lead">'
      + (flat ? x("All 11 of your levers scored " + min + ", so none stands out as least used: your choices were spread evenly. The levers below are good places to start.", "Kesemua 11 pendekatan anda mendapat skor " + min + ", jadi tiada satu pun yang menonjol sebagai paling jarang digunakan: pilihan anda tersebar secara sekata. Pendekatan di bawah sesuai untuk dimulakan.")
        : derivedMain ? x("Your lowest scores are all Hard levers (", "Skor terendah anda semuanya pendekatan Keras (") + joinAnd(reserveShown.map(function (s) { return s.name; })) + x("), which is common and often healthy. Your growth lever is your least-used Core lever, ", "), yang biasa dan selalunya sihat. Pendekatan untuk dikembangkan ialah pendekatan Teras yang paling jarang anda gunakan, ") + M.name + " (" + M.score + "/4)."
        : joinAnd(focus.map(function (s) { return s.name; })) + x((focus.length > 1 ? " were" : " was") + " your lowest-scoring " + (focus.length > 1 ? "levers" : "lever") + " (" + min + " of 4)", " ialah pendekatan dengan skor terendah anda (" + min + " daripada 4)") + (min === 0 ? x(": in this audit, you chose other approaches every time.", ": dalam audit ini, anda memilih pendekatan lain setiap kali.") : ".") + (reserveShown.length ? x(" Core and Soft levers are worth building; Hard levers are worth keeping in reserve.", " Pendekatan Teras dan Lembut wajar dikembangkan; pendekatan Keras wajar disimpan untuk digunakan bila perlu.") : ""))
      + x(" Your free report gave you a first experiment. This page shows why it matters, what gets in the way, and where to practise.", " Laporan percuma anda telah memberikan eksperimen pertama. Halaman ini menunjukkan kenapa ia penting, apa yang menghalang, dan di mana untuk berlatih.")
      + "</p>" + mainShown.map(function (s, i) { return devCard(s, i === 0); }).join("") + reserveShown.map(function (s) { return reserveCard(s, false); }).join("")
      + (!flat && focus.length > mainShown.length + reserveShown.length ? '<p class="small">' + x("Also tied for your lowest score: ", "Turut berkongsi skor terendah: ") + joinAnd(focus.filter(function (s) { return mainShown.indexOf(s) < 0 && reserveShown.indexOf(s) < 0; }).map(function (s) { return s.name; })) + x(". Start with the focus above; one lever at a time works best.", ". Mulakan dengan fokus di atas; satu pendekatan pada satu masa adalah paling berkesan.") + "</p>" : "")
      + "</section>");

    // 8 Malaysian lens (joins the development page when there is only one focus card, so that page isn't half empty)
    var lensBody = '<p><b>' + x("Respect and hierarchy.", "Hormat dan hierarki.") + '</b> ' + lensH + "</p><p><b>" + x("Relationships and <i>budi bahasa</i>.", "Hubungan dan <i>budi bahasa</i>.") + "</b> " + lensS + "</p><p><b>" + x("Firmness without losing face.", "Tegas tanpa menjatuhkan <i>air muka</i>.") + "</b> " + lensF + "</p>" + (C.lens.discretion ? "<p><b>" + x("Choosing with <i>budi bicara</i>.", "Memilih dengan <i>budi bicara</i>.") + "</b> " + C.lens.discretion + "</p>" : "");
    var lensKicker = '<div class="k">' + x("The Malaysian workplace lens", "Konteks tempat kerja di Malaysia") + "</div>";
    if (lensJoin) {
      h[h.length - 1] = h[h.length - 1].replace(/<\/section>$/, '<div class="lens lensin">' + lensKicker + '<h3>' + x("Influence in Malaysian workplaces", "Mempengaruhi di tempat kerja Malaysia") + '</h3><p class="muted" style="border:0;padding:0;margin-bottom:8px">' + x("How your profile plays out in a Malaysian working culture.", "Bagaimana profil anda dipraktikkan dalam budaya kerja di Malaysia.") + "</p>" + lensBody + "</div></section>");
    } else {
      h.push('<section class="page lens">' + lensKicker + '<h2>' + x("Influence in Malaysian workplaces", "Mempengaruhi di tempat kerja Malaysia") + '</h2><p class="muted" style="margin-bottom:14px">' + x("How your profile plays out in a Malaysian working culture.", "Bagaimana profil anda dipraktikkan dalam budaya kerja di Malaysia.") + "</p>" + lensBody + "</section>");
    }

    // 9 Action plan
    h.push('<section class="page"><div class="k">' + x("Your action plan", "Pelan tindakan anda") + '</div><h2>' + x("From insight to habit", "Daripada kesedaran kepada kebiasaan") + '</h2><p class="muted">' + x("People who decide exactly <i>when</i> and <i>how</i> they will act are far more likely to follow through than those who simply set a goal (Gollwitzer and Sheeran, 2006). Your plan is pre-filled from your results. Edit it to fit your work.", "Mereka yang menentukan dengan tepat <i>bila</i> dan <i>bagaimana</i> mereka akan bertindak jauh lebih berkemungkinan melaksanakannya berbanding mereka yang sekadar menetapkan matlamat (Gollwitzer dan Sheeran, 2006). Pelan ini telah diisi berdasarkan keputusan anda. Ubah suai mengikut kerja anda.") + '</p>'
      + '<div class="plan"><div class="lab">' + x("My if-then plan", "Pelan jika-maka saya") + '</div><div class="ifthen"><b>' + x("IF", "JIKA") + '</b> ' + M.c.ifThen[0] + ",<br><b>" + x("THEN", "MAKA") + "</b> " + M.c.ifThen[1] + "</div>"
      + (plan2 ? '<div class="lab" style="margin-top:10px">' + x("And for ", "Dan untuk ") + esc(plan2.name) + '</div><div class="ifthen" style="font-size:11pt"><b>' + x("IF", "JIKA") + '</b> ' + plan2.c.ifThen[0] + ",<br><b>" + x("THEN", "MAKA") + "</b> " + plan2.c.ifThen[1] + "</div>" : '<div class="lab" style="margin-top:10px">' + x("Or write your own", "Atau tulis pelan anda sendiri") + '</div><div class="blank"></div><div class="blank"></div>')
      + '</div><div class="lab" style="margin-top:16px">' + x("Two-week tracker", "Penjejak dua minggu") + '</div><table class="t track"><tr><th style="width:18%">' + x("Date", "Tarikh") + '</th><th style="width:34%">' + x("Situation", "Situasi") + '</th><th style="width:24%">' + x("What I did", "Apa yang saya lakukan") + "</th><th>" + x("How it landed", "Hasilnya") + "</th></tr>"
      + "<tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr></table>"
      + '<div class="two" style="margin-top:16px"><div class="ask"><b>' + x("Check it with others.", "Semak bersama orang lain.") + "</b> " + x("Ask two colleagues:", "Tanya dua rakan sekerja:") + "<ol><li>" + x("“When I need your support, what do I usually do?”", "“Apabila saya memerlukan sokongan anda, apa yang biasanya saya lakukan?”") + "</li><li>" + x("“What could I do more of that would make it easier to say yes?”", "“Apa yang boleh saya lakukan lebih kerap supaya anda lebih mudah bersetuju?”") + "</li><li>" + M.c.checkQ + '</li></ol><p class="small" style="margin:6px 0 0">' + x("Where their answers match this report, you can trust the profile. Where they differ, that is worth exploring.", "Jika jawapan mereka sepadan dengan laporan ini, anda boleh mempercayai profil ini. Jika berbeza, ia wajar diterokai.") + "</p></div>"
      + '<div class="ask"><b>' + x("Reflect before your debrief.", "Renungkan sebelum sesi taklimat.") + "</b><ol><li>" + x("What surprised you in this report?", "Apakah yang mengejutkan anda dalam laporan ini?") + "</li><li>" + x("Where does your " + esc(S.name.replace(/^The /, "")) + " style work best for you today?", "Di manakah gaya " + esc(S.name) + " anda paling berkesan pada masa ini?") + "</li><li>" + M.c.reflect + '</li></ol><p class="small" style="margin:6px 0 0">' + x("Review date:", "Tarikh semakan:") + ' <span style="display:inline-block;width:90px;border-bottom:1px solid var(--frame)"></span></p></div></div>'
      + '<div class="ethic"><b style="color:var(--ink)">' + x("Influence, not manipulation.", "Mempengaruhi, bukan memanipulasi.") + "</b> " + x("These tactics are tools, not tricks. Use them only where your claim is true and the interest is genuinely shared. This is a relative profile based on your own choices. It is best read alongside honest feedback from colleagues and your facilitator. Questions about your data: enquiries@growthimpact.org.", "Taktik ini ialah alat, bukan helah. Gunakannya hanya apabila dakwaan anda benar dan kepentingannya benar-benar dikongsi. Ini ialah profil relatif berdasarkan pilihan anda sendiri. Ia paling baik dibaca bersama maklum balas jujur daripada rakan sekerja dan fasilitator anda. Pertanyaan tentang data anda: enquiries@growthimpact.org.") + '</div></section>');

    h.push("</body></html>");
    return h.join("");
  }

  window.GIGFullReport = { build: build };
})();
