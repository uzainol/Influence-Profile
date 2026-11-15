/* Influence Self-Audit · Full report engine (Growth Impact Group)
   Builds the paid, multi-page report from a participant's scores and the private content library.
   The content library lives in Firestore (readable by the admin only) and is passed in as `C`. */
(function () {
  var CSS = "\n:root{--green:#36AA54;--ink:#1A1A1A;--muted:#5F656C;--grey:#8A9099;--hair:#DDE0E3;--frame:#CBD0D4;--tint:#F2F8F4;}\n@page{size:A4;margin:16mm 16mm 18mm}\n*{box-sizing:border-box}\nbody{margin:0;font-family:Arial,Helvetica,sans-serif;color:var(--ink);font-size:10.5pt;line-height:1.5}\nh1,h2,h3,.k,.lab,th{font-family:\"Arial Narrow\",Arial,sans-serif}\n.page{page-break-after:always}\n.page:last-child{page-break-after:auto}\n.k{font-weight:700;font-size:8.5pt;letter-spacing:.2em;color:var(--green);text-transform:uppercase;display:flex;align-items:center;gap:8px}\n.k:before{content:\"\";width:9px;height:9px;background:var(--green);display:inline-block}\nh2{font-size:24pt;line-height:1.02;text-transform:uppercase;margin:8px 0 10px}\nh3{font-size:15pt;text-transform:uppercase;margin:0}\np{margin:0 0 9px}\n.lead{font-size:11.5pt;color:var(--muted);margin-bottom:14px}\n.muted{color:var(--muted)}\n.small{font-size:8.5pt;color:var(--grey)}\n/* cover */\n.cover{height:255mm;display:flex;flex-direction:column}\n.cover img{width:120px}\n.cover .t{margin-top:62mm}\n.cover h1{font-size:44pt;line-height:.95;text-transform:uppercase;margin:12px 0 0}\n.cover h1 span{color:var(--green)}\n.cover .who{margin-top:22px;font-size:15pt;font-weight:700}\n.cover .meta{color:var(--muted);margin-top:4px}\n.cover .foot{margin-top:auto;border-top:1px solid var(--hair);padding-top:10px;font-size:8.5pt;color:var(--grey)}\n.sample{display:inline-block;border:1px solid var(--green);color:var(--green);font-weight:700;font-size:8pt;letter-spacing:.16em;padding:3px 8px;margin-top:18px}\n/* glance */\n.glance{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px}\n.gbox{border:1px solid var(--hair);padding:12px 14px}\n.gbox.wide{grid-column:1 / -1}\n.gbox.green{background:var(--tint);border-color:var(--tint);border-top:3px solid var(--green)}\n.lab{font-weight:700;font-size:8pt;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}\n.big{font-family:\"Arial Narrow\",Arial;font-weight:700;font-size:20pt;text-transform:uppercase;line-height:1}\n.gval{font-size:11pt;font-weight:700}\n/* style box */\n.style{background:var(--tint);border-top:4px solid var(--green);padding:18px 20px;margin-top:6px}\n.style .name{font-family:\"Arial Narrow\",Arial;font-weight:700;font-size:30pt;text-transform:uppercase;line-height:1}\n.style .hl{color:var(--green);font-weight:700;font-size:14pt;margin:8px 0 10px}\n.style hr{border:0;border-top:1px solid var(--frame);margin:12px 0}\n/* scores */\ntable.sc{width:100%;border-collapse:collapse;margin-top:6px}\ntable.sc td{padding:3px 4px;border-bottom:1px solid var(--hair);font-size:9.3pt}\n.famrow td{border-bottom:2px solid var(--ink)!important;font-weight:700;letter-spacing:.14em;font-size:8pt;padding-top:8px!important}\n.famrow .avg{font-weight:400;letter-spacing:0;color:var(--muted);margin-left:8px}\n.sw{display:inline-block;width:11px;height:11px;margin-right:7px;vertical-align:-1px;border:1px solid var(--frame)}\ntd.ln{font-weight:700;text-transform:uppercase;font-family:\"Arial Narrow\",Arial;width:42%}\ntd.bar{width:30%}\n.cell{display:inline-block;width:22%;height:10px;margin-right:2%;background:#F2F8F4;border:1px solid var(--hair)}\n.cell.on{background:var(--ink);border-color:var(--ink)}\ntd.bd{text-align:right;color:var(--muted)}\n.focusrow td{color:var(--green)}\n.note{border-left:3px solid var(--green);padding:6px 0 6px 12px;margin:14px 0;font-size:9.5pt;color:var(--muted)}\n/* strengths */\n.lever{border:1px solid var(--hair);padding:10px 14px;margin-bottom:8px;page-break-inside:avoid}\n.lvhead{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px}\n.lvsc{font-weight:700;color:var(--green)}\n.grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px}\n.pane{padding:8px 10px;font-size:9pt;line-height:1.42}\n.pane p{margin:0}\n.pane.good{background:var(--tint)}\n.pane.over{background:#F7F7F5;border-left:3px solid var(--frame)}\n.line{font-size:9pt;line-height:1.42;margin:0 0 4px}\n/* range */\n.meter{display:flex;gap:4px;margin:6px 0 4px}\n.meter span{flex:1;height:12px;background:var(--hair)}\n.meter span.on{background:var(--green)}\n.pair{display:grid;grid-template-columns:1fr 26px 1fr;align-items:center;gap:6px;margin:8px 0}\n.chip{border:1px solid var(--ink);padding:8px 10px;text-align:center;font-weight:700;font-family:\"Arial Narrow\",Arial;text-transform:uppercase;font-size:10.5pt}\n.chip.g{border-color:var(--green);color:var(--green)}\n.plus{text-align:center;font-weight:700;color:var(--green);font-size:16pt}\n/* tables */\ntable.t{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:8px}\ntable.t th{text-align:left;font-size:8pt;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);border-bottom:2px solid var(--ink);padding:6px 6px}\ntable.t td{border-bottom:1px solid var(--hair);padding:8px 6px;vertical-align:top}\n.fit{color:var(--green);font-weight:700}\n.gap{color:var(--muted)}\n/* plan */\n.plan{border:2px solid var(--ink);padding:14px 16px;margin-top:8px}\n.plan .ifthen{font-size:12.5pt;line-height:1.45;margin:6px 0 4px}\n.plan .ifthen b{color:var(--green)}\n.blank{border-bottom:1px solid var(--frame);height:22px;margin:4px 0}\ntable.track td{height:30px}\n.box{display:inline-block;width:12px;height:12px;border:1.5px solid var(--frame);vertical-align:-2px;margin-right:6px}\n.two{display:grid;grid-template-columns:1fr 1fr;gap:14px}\n.ask{background:var(--tint);padding:12px 14px;margin-top:6px}\n.ask ol{margin:6px 0 0 18px;padding:0}\n.ask li{margin-bottom:6px}\n.badge{display:flex;align-items:center;gap:18px;background:var(--tint);border-top:4px solid var(--green);padding:16px 18px;margin-top:4px}\n.bicon{width:64px;height:64px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;flex-shrink:0}\n.dashrow{display:flex;gap:10px;margin-top:10px}\n.dashrow > *{min-width:0}\n.dcard{border:1px solid var(--hair);padding:10px 12px}\n.dcard.exp{border:2px solid var(--ink)}\n.split{display:flex;height:26px;margin-top:6px;font-family:\"Arial Narrow\",Arial;font-weight:700;font-size:9pt}\n.split span{display:flex;align-items:center;justify-content:center;border-right:2px solid #fff}\n.tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:4px}\n.tile{border:1px solid var(--hair);padding:12px 10px;text-align:center}\n.tile.edge{border:2px solid var(--green);background:var(--tint)}\n.ticon{display:flex;justify-content:center;margin-bottom:6px}\n.tname{font-family:\"Arial Narrow\",Arial;font-weight:700;text-transform:uppercase;font-size:10pt;line-height:1.15;min-height:24px}\n.tdots{margin:7px 0 3px}\n.dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin:0 2px}\n.tlab{font-size:7.5pt;letter-spacing:.12em;color:var(--muted);font-weight:700}\n.tile.edge .tlab{color:var(--green)}\n.scale{position:relative;display:flex;height:28px;margin:18px 0 6px;font-family:\"Arial Narrow\",Arial;font-weight:700;font-size:8pt;letter-spacing:.08em;text-transform:uppercase}\n.zone{display:flex;align-items:center;justify-content:center}\n.z1{flex:30;background:#EEF0F2;color:#8A9099;justify-content:flex-start;padding-left:8px}\n.z2{flex:40;background:#D5EEDC;color:#1E7A38}\n.z3{flex:30;background:#F6EBD6;color:#9A6B1F;justify-content:flex-end;padding-right:8px}\n.marker{position:absolute;top:-12px;bottom:-4px;width:0;border-left:3px solid var(--ink)}\n.marker span{position:absolute;top:-4px;left:-15px;background:var(--ink);color:#fff;font-size:7pt;padding:1px 4px;letter-spacing:.1em}\n.ends{display:flex;justify-content:space-between;gap:16px;font-size:9pt;margin-bottom:6px}\n.legend{display:flex;gap:16px;font-size:8.5pt;color:var(--muted);margin:6px 0 4px;flex-wrap:wrap}\n.legend span{display:flex;align-items:center;gap:5px}\n.legend svg{width:14px;height:14px}\n.fitmap{border-top:2px solid var(--ink)}\n.fitrow{display:grid;grid-template-columns:36px 1fr 1fr;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid var(--hair)}\n.fs b{font-size:10.5pt}\n.ft{font-size:9.3pt;color:var(--ink)}\n.fitrow.quiet .ft{color:var(--muted)}\n.ethic{border:1px solid var(--hair);padding:12px 14px;margin-top:12px;font-size:9.3pt;color:var(--muted)}\n\nhtml{-webkit-print-color-adjust:exact;print-color-adjust:exact}\n.split span{min-width:48px}\n.compact .lever{padding:6px 12px;margin-bottom:5px}.compact .scale{margin:14px 0 4px;height:24px}.compact .line{margin-bottom:2px;font-size:8.8pt}.compact .ends{font-size:8.8pt;margin-bottom:3px}.compact .lvhead{margin-bottom:2px}.compact h3{font-size:13pt}\n.toolbar{position:sticky;top:0;z-index:5;display:flex;justify-content:space-between;align-items:center;gap:12px;background:#1A1A1A;color:#fff;padding:10px 16px;font-family:Arial;font-size:13px}\n.toolbar button{font-family:\"Arial Narrow\",Arial;font-weight:700;letter-spacing:.12em;font-size:13px;padding:9px 16px;background:#36AA54;color:#fff;border:0;cursor:pointer}\n@media screen{body{background:#E9ECEE}.page{background:#fff;width:210mm;min-height:297mm;margin:16px auto;padding:16mm;box-shadow:0 1px 6px rgba(0,0,0,.12)}.cover{height:auto;min-height:297mm}}\n@media print{.toolbar{display:none}}\n";
  var ICONS = {"bar-chart-2": "<line x1=\"18\" y1=\"20\" x2=\"18\" y2=\"10\"></line><line x1=\"12\" y1=\"20\" x2=\"12\" y2=\"4\"></line><line x1=\"6\" y1=\"20\" x2=\"6\" y2=\"14\"></line>", "message-circle": "<path d=\"M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z\"></path>", "tool": "<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"></path>", "sun": "<circle cx=\"12\" cy=\"12\" r=\"5\"></circle><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"3\"></line><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"23\"></line><line x1=\"4.22\" y1=\"4.22\" x2=\"5.64\" y2=\"5.64\"></line><line x1=\"18.36\" y1=\"18.36\" x2=\"19.78\" y2=\"19.78\"></line><line x1=\"1\" y1=\"12\" x2=\"3\" y2=\"12\"></line><line x1=\"21\" y1=\"12\" x2=\"23\" y2=\"12\"></line><line x1=\"4.22\" y1=\"19.78\" x2=\"5.64\" y2=\"18.36\"></line><line x1=\"18.36\" y1=\"5.64\" x2=\"19.78\" y2=\"4.22\"></line>", "trending-up": "<polyline points=\"23 6 13.5 15.5 8.5 10.5 1 18\"></polyline><polyline points=\"17 6 23 6 23 12\"></polyline>", "heart": "<path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"></path>", "smile": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M8 14s1.5 2 4 2 4-2 4-2\"></path><line x1=\"9\" y1=\"9\" x2=\"9.01\" y2=\"9\"></line><line x1=\"15\" y1=\"9\" x2=\"15.01\" y2=\"9\"></line>", "repeat": "<polyline points=\"17 1 21 5 17 9\"></polyline><path d=\"M3 11V9a4 4 0 0 1 4-4h14\"></path><polyline points=\"7 23 3 19 7 15\"></polyline><path d=\"M21 13v2a4 4 0 0 1-4 4H3\"></path>", "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"12 6 12 12 16 14\"></polyline>", "book-open": "<path d=\"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z\"></path><path d=\"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z\"></path>", "users": "<path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"></path><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"></path>", "flag": "<path d=\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z\"></path><line x1=\"4\" y1=\"22\" x2=\"4\" y2=\"15\"></line>"};
  var ORDER = ["rational", "consultation", "collaboration", "inspirational", "apprising", "ingratiation", "personal", "exchange", "pressure", "legitimating", "coalition"];
  var FILL = { CORE: "#E2F1E5", SOFT: "#F4EDDD", HARD: "#E6EAF0" };
  var FAMNAME = { CORE: "Core", SOFT: "Soft", HARD: "Hard" };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function ic(name, size, color, sw) {
    return '<svg width="' + (size || 20) + '" height="' + (size || 20) + '" viewBox="0 0 24 24" fill="none" stroke="' + (color || "#1A1A1A") + '" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || "") + "</svg>";
  }
  function joinAnd(a) { return a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function band(s) { return s >= 3 ? "Signature" : s === 2 ? "Situational" : "Less used"; }
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
      var anc = Math.abs(Math.cos(ang(i))) < 0.3 ? "middle" : (Math.cos(ang(i)) > 0 ? "start" : "end");
      o.push('<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="' + anc + '" font-size="' + labelSize + '" font-weight="700" fill="' + (f ? "#36AA54" : "#1A1A1A") + '">' + esc(l.short.toUpperCase()) + "</text>");
      o.push('<text x="' + lx.toFixed(1) + '" y="' + (ly + subSize + 2).toFixed(1) + '" text-anchor="' + anc + '" font-size="' + subSize + '" fill="' + (f ? "#36AA54" : "#5F656C") + '">' + l.score + "/4" + (f ? " · FOCUS" : "") + "</text>");
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
      + '<text x="' + cx + '" y="' + (cy + 10) + '" text-anchor="middle" font-size="7.5" letter-spacing="1.5" fill="#8A9099" font-family="Arial">CONSISTENCY</text></svg>';
  }

  function dots(n, col) { var s = ""; for (var k = 0; k < 4; k++) s += '<span class="dot" style="background:' + (k < n ? col : "#E6E9EC") + '"></span>'; return s; }
  function tile(l, edge) {
    var col = edge ? "#36AA54" : "#1A1A1A";
    return '<div class="tile' + (edge ? " edge" : "") + '"><div class="ticon">' + ic(l.icon, 22, col) + '</div><div class="tname">' + esc(l.name) + '</div><div class="tdots">' + dots(l.score, col) + '</div><div class="tlab">' + (edge ? "YOUR EDGE · " : "") + l.score + "/4</div></div>";
  }
  function meter(n) { var s = ""; for (var i = 0; i < 11; i++) s += i < n ? '<span class="on"></span>' : "<span></span>"; return '<div class="meter">' + s + "</div>"; }
  function mark(kind) {
    if (kind === "full") return '<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="11" fill="#36AA54"/></svg>';
    if (kind === "half") return '<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="11" fill="#fff" stroke="#36AA54" stroke-width="2"/><path d="M13 2 A11 11 0 0 0 13 24 Z" fill="#36AA54"/></svg>';
    return '<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="11" fill="#fff" stroke="#CBD0D4" stroke-width="2"/></svg>';
  }

  function build(input, C) {
    var scored = ORDER.map(function (id) {
      var c = C.levers[id];
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
    var main = focus.filter(function (s) { return s.family !== "HARD"; });
    var reserve = focus.filter(function (s) { return s.family === "HARD"; });
    var derivedMain = false;
    if (!main.length) {
      var cores = scored.filter(function (s) { return s.family === "CORE"; });
      var cmin = Math.min.apply(null, cores.map(function (s) { return s.score; }));
      main = [cores.filter(function (s) { return s.score === cmin; })[0]];
      derivedMain = true;
    }
    var mainShown = main.slice(0, 2), reserveShown = reserve.slice(0, mainShown.length >= 2 ? 1 : 2);
    var M = mainShown[0];

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
    var care = null;
    C.combos.care.some(function (p) { var a = byId[p[0][0]], b = byId[p[0][1]]; if (a.score >= 3 && b.score >= 3) { care = p[1]; return true; } return false; });
    if (!care && byId.ingratiation.score >= 3) care = C.combos.careSingle.ingratiation;
    if (!care && byId.pressure.score >= 3) care = C.combos.careSingle.pressure;
    if (!care) care = C.combos.careNone;
    var topStrength = strengths[0];

    // Situational fit
    var fits = C.situations.map(function (st) {
      var ws = st.works.map(function (id) { return byId[id]; });
      var pts = ws.reduce(function (a, s) { return a + (s.score >= 3 ? 1 : s.score === 2 ? 0.5 : 0); }, 0);
      var ratio = pts / ws.length;
      var kind = ratio >= 0.6 ? "full" : ratio >= 0.3 ? "half" : "empty";
      var strong = ws.filter(function (s) { return s.score >= 3; }).map(function (s) { return s.name; });
      var mid = ws.filter(function (s) { return s.score === 2; }).map(function (s) { return s.name; });
      var borrow = ws.slice().sort(function (a, b) { return a.score - b.score; })[0];
      var tip;
      if (kind === "full") tip = st.full.replace("{strong}", joinAnd(strong.length ? strong : mid) + (strong.length + mid.length > 1 || (strong.length === 0 && mid.length > 1) ? "" : ""));
      else if (kind === "half") tip = (strong.length ? "You bring " + joinAnd(strong) + ". " : "You use " + joinAnd(mid) + " situationally. ") + "Add " + borrow.c.edge + " (" + borrow.name + ") to complete the fit.";
      else tip = st.empty;
      return { st: st, kind: kind, tip: tip };
    });
    var fullNames = fits.filter(function (f) { return f.kind === "full"; }).map(function (f) { return f.st.name.toLowerCase(); });
    var emptyNames = fits.filter(function (f) { return f.kind === "empty"; }).map(function (f) { return f.st.name.toLowerCase(); });
    var pattern = (fullNames.length ? "Your style fits most naturally in these moments: " + joinAnd(fullNames) + ". " : "No single moment is a perfect natural fit, which is common. ")
      + (emptyNames.length ? "Plan ahead for " + joinAnd(emptyNames) + ", where your natural style needs a deliberate extra gear." : "Your style travels well. The half-filled moments are where one added lever makes the biggest difference.");

    // Malaysian lens
    var hierNames = ["rational", "consultation", "apprising"].filter(function (id) { return byId[id].score >= 3; }).map(function (id) { return byId[id].name; });
    var lensH = hierNames.length ? C.lens.hierarchyFit.replace("{names}", joinAnd(hierNames)) : C.lens.hierarchyBuild;
    var lensS = famAvg.SOFT >= 2.5 ? C.lens.softHigh : famAvg.SOFT <= 1.5 ? C.lens.softLow : C.lens.softMid;
    var lensF = famAvg.HARD <= 1.4 ? C.lens.hardLow : famAvg.HARD >= 2.5 ? C.lens.hardHigh : C.lens.hardMid;

    // Text pieces
    var topNames = scored.filter(function (s) { return s.score === max; }).map(function (s) { return s.name; });
    var lowNames = focus.map(function (s) { return s.name; });
    var edgeAll = mainShown.concat(reserveShown).map(function (s) { return s.c.edge + " (" + s.name + ")"; });
    var famCaption = famRank[0] === "CORE" ? "Most of your weight sits in Core levers, the ones most linked to genuine commitment."
      : famRank[0] === "SOFT" ? "Your weight leans towards relationship levers, with " + FAMNAME[famRank[2]] + " levers used least."
      : "Your weight leans towards Hard levers, which drive action but can cost goodwill if overused.";
    var big = S.big + " Your clearest growth opportunity is " + M.c.edge + " (" + M.name + ")" + (reserveShown.length ? ", while keeping " + joinAnd(reserveShown.map(function (s) { return s.c.edge; })) + " in reserve for when goodwill isn’t enough." : ".");
    var dateBit = input.dateText ? " · Completed " + esc(input.dateText) : "";
    var who = esc(input.name || "Participant");
    var focusTitle = joinAnd(mainShown.concat(reserveShown).map(function (s) { return s.name; }));

    function scoreRows() {
      var r = "";
      ["CORE", "SOFT", "HARD"].forEach(function (f) {
        r += '<tr class="famrow"><td colspan="3"><span class="sw" style="background:' + FILL[f] + '"></span>' + f + ' <span class="avg">average ' + f1(famAvg[f]) + " / 4</span></td></tr>";
        scored.filter(function (s) { return s.family === f; }).forEach(function (s) {
          var bar = ""; for (var k = 0; k < 4; k++) bar += '<span class="cell' + (k < s.score ? " on" : "") + '"></span>';
          r += "<tr" + (s.isFocus ? ' class="focusrow"' : "") + '><td class="ln">' + esc(s.name) + '</td><td class="bar">' + bar + '</td><td class="bd"><b>' + s.score + "</b> · " + (s.isFocus ? "Focus" : band(s.score)) + "</td></tr>";
        });
      });
      return r;
    }
    function strengthCard(s) {
      var pos = { 0: 6, 1: 22, 2: 42, 3: 62, 4: 80 }[s.score];
      return '<div class="lever"><div class="lvhead"><h3 style="display:flex;align-items:center;gap:8px">' + ic(s.icon, 20) + esc(s.name) + '</h3><span class="lvsc">' + s.score + "/4</span></div>"
        + '<div class="scale"><div class="zone z1">Underused</div><div class="zone z2">Sweet spot</div><div class="zone z3">Overplay risk</div><div class="marker" style="left:' + pos + '%"><span>YOU</span></div></div>'
        + '<div class="ends"><div><b style="color:var(--green)">At its best:</b> ' + s.c.best + '</div><div style="text-align:right"><b style="color:#9A6B1F">If overplayed:</b> ' + s.c.over + "</div></div>"
        + '<p class="line"><b>Early warning signs.</b> ' + s.c.signs + '</p><p class="line"><b>Stretch.</b> ' + s.c.stretch + "</p></div>";
    }
    function devCard(s, isFirst) {
      return '<div class="lever"' + (isFirst ? ' style="border:2px solid var(--green)"' : "") + '><div class="lvhead"><h3 style="display:flex;align-items:center;gap:8px">' + ic(s.icon, 20, "#36AA54") + esc(s.name) + '</h3><span class="lvsc">' + s.score + "/4 · " + (isFirst ? "Main focus" : "Also a focus") + "</span></div>"
        + '<p class="muted" style="margin-bottom:8px">' + s.c.defn + "</p>"
        + '<div class="two"><div><div class="lab">Why it matters</div><p style="font-size:9.6pt">' + s.c.why + '</p><div class="lab" style="margin-top:8px">Why you might use it less</div><p style="font-size:9.6pt">' + s.c.whyLess + "</p></div>"
        + '<div><div class="lab">Phrases to try</div><p style="font-size:9.6pt">' + s.c.phrases.join("<br>") + '</p><div class="ask" style="margin-top:8px;font-size:9.4pt"><b>Try this.</b> ' + s.c.tryThis + " <b>Reflect:</b> " + s.c.reflect + "</div></div></div></div>";
    }
    function reserveCard(s) {
      return '<div class="lever"><div class="lvhead"><h3 style="display:flex;align-items:center;gap:8px">' + ic(s.icon, 20) + esc(s.name) + '</h3><span class="lvsc" style="color:var(--muted)">' + s.score + "/4 · Keep in reserve</span></div>"
        + '<p style="font-size:9.8pt">' + s.c.reserve + '</p><p style="font-size:9.8pt;margin:0"><b>Try this line:</b> ' + s.c.reserveLine + "</p></div>";
    }
    var tiles = strengths.slice(0, 5).map(function (s) { return tile(s, false); }).join("");
    var edgeTiles = mainShown.concat(reserveShown).slice(0, 2).map(function (s) { return tile(s, true); }).join("");
    var plan2 = reserveShown.length ? reserveShown[0] : (mainShown[1] || null);

    var h = [];
    h.push('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>' + who + " · Influence Profile (Full report)</title><style>" + CSS + "</style></head><body>");
    h.push('<div class="toolbar"><span>Full report · ' + who + '</span><button onclick="window.print()">⤓ SAVE AS PDF</button></div>');

    // 1 Cover
    h.push('<section class="page cover"><img src="' + C.logo + '" alt="Growth Impact Group"><div class="t"><div class="k">Influence Self-Audit · Full report</div><h1>Your Influence<br><span>Profile</span></h1><div class="who">' + who + '</div>' + ((input.designation || input.organisation) ? '<div class="meta" style="color:var(--ink)">' + esc([input.designation, input.organisation].filter(Boolean).join(" · ")) + "</div>" : "") + '<div class="meta">' + (input.session ? "Session " + esc(input.session) : "") + dateBit + " · Consistency " + pct + '%</div></div><div class="foot">Growth Impact Group Malaysia Sdn. Bhd. · This report describes the influence preferences you showed in a forced-choice exercise. It is a development tool, not a test of ability. Confidential to the participant and their facilitator.</div></section>');

    // 2 At a glance
    h.push('<section class="page"><div class="k">At a glance</div><h2>Your profile on one page</h2>'
      + '<div class="badge"><div class="bicon">' + ic("users", 34, "#FFFFFF") + '</div><div><div class="lab" style="color:var(--green);margin:0">Your influence style</div><div class="big" style="font-size:28pt">' + esc(S.name) + '</div><div style="color:var(--green);font-weight:700;font-size:12pt;margin-top:4px">' + esc(S.headline) + "</div></div></div>"
      + '<div class="dashrow"><div class="dcard" style="flex:1.25"><div class="lab">Your influence web</div><div style="margin:-6px -8px -10px">' + radar(scored, 15, 13) + "</div></div>"
      + '<div style="flex:1;display:flex;flex-direction:column;gap:10px"><div class="dcard"><div class="lab">How reliable is this read?</div><div style="width:82%;margin:0 auto">' + gauge(pct) + '</div><p class="small" style="margin:0;text-align:center">'
      + (reliable ? '<b style="color:var(--ink)">Reliable.</b> Above the 80% line, so the profile can be trusted.' : '<b style="color:var(--ink)">Worth exploring further.</b> Below 80%: a starting point to discuss with your facilitator.') + "</p></div>"
      + '<div class="dcard"><div class="lab">Where your 22 choices went</div><div class="split"><span style="flex:' + famSum.CORE + ';background:#E2F1E5">Core ' + famSum.CORE + '</span><span style="flex:' + famSum.SOFT + ';background:#F4EDDD">Soft ' + famSum.SOFT + '</span><span style="flex:' + famSum.HARD + ';background:#E6EAF0">Hard ' + famSum.HARD + "</span></div>"
      + '<p class="small" style="margin:6px 0 0">' + famCaption + '</p><div class="lab" style="margin-top:10px">Your range</div>' + meter(inUse) + '<p class="small" style="margin:0"><b style="color:var(--ink)">' + R[0] + ".</b> " + inUse + " of 11 levers in active use.</p></div></div></div>"
      + '<div class="lab" style="margin-top:14px">Your go-to moves</div><div class="tiles" style="grid-template-columns:repeat(' + Math.max(3, Math.min(5, strengths.length)) + ',1fr)">' + tiles + "</div>"
      + '<div class="dashrow" style="margin-top:10px;align-items:stretch"><div class="tiles" style="flex:1;grid-template-columns:repeat(' + Math.min(2, mainShown.length + reserveShown.length) + ',1fr);margin:0">' + edgeTiles + "</div>"
      + '<div class="dcard exp" style="flex:1.2"><div class="lab" style="color:var(--ink)">' + ic("flag", 13, "#36AA54") + ' Your one experiment this month</div><p style="margin:2px 0 0;font-size:10.5pt"><b style="color:var(--green)">IF</b> ' + M.c.ifThen[0] + ', <b style="color:var(--green)">THEN</b> ' + M.c.ifThen[1] + "</p></div></div></section>");

    // 3 Style
    h.push('<section class="page"><div class="k">Your influence style</div><h2>How you influence, as a whole</h2><div class="style"><div class="lab" style="color:var(--green)">Your influence style</div><div class="name">' + esc(S.name) + '</div><div class="hl">' + esc(S.headline) + "</div><p>" + S.desc + "</p><hr>"
      + "<p><b>Your signature moves:</b> " + joinAnd(strengths.map(function (s) { return s.c.sigNoun + " (" + s.name + ")"; })) + ".</p>"
      + "<p><b>People experience you as:</b> " + S.people + "</p>"
      + '<p style="margin:0"><b>Your untapped edge:</b> ' + joinAnd(edgeAll) + ", a great place to stretch next. " + S.further + "</p></div>"
      + '<h3 style="margin-top:22px;font-size:12pt">When this style is overplayed</h3><p class="muted">' + S.overplayed + "</p>"
      + '<h3 style="margin-top:16px;font-size:12pt">Where this style shines</h3><p class="muted">' + S.shines + "</p>"
      + '<div class="note" style="margin-top:18px"><b style="color:var(--ink)">The big picture.</b> ' + big + "</div></section>");

    // 4 Web
    h.push('<section class="page"><div class="k">Your influence web</div><h2>All 11 levers</h2><p class="muted">Each spoke is one lever, scored 0–4 by how often you chose it across four head-to-heads. The dashed green ring marks 2, the balance point. The shape shows your mix of habits, not your level of skill.</p>'
      + '<div style="width:80%;margin:-4px auto -6px">' + radar(scored, 12.5, 11.5) + '</div><table class="sc">' + scoreRows() + "</table>"
      + '<div class="note"><b style="color:var(--ink)">How to read the scores.</b> Each lever is based on four comparisons, so treat scores within one point of each other as similar. ' + (max === min ? "All your levers scored " + max + ", a perfectly even profile, so no single lever stands out." : "The meaningful signals in your profile are " + joinAnd(topNames) + " (" + max + ") at the top and " + joinAnd(lowNames) + " (" + min + ") at the bottom.") + " Scores add up to a fixed 22 points, so a low score means “chosen less often than your other options”, not “absent”.</div></section>");

    // 5 Strengths
    var n = strengths.length;
    h.push('<section class="page' + (n >= 4 ? " compact" : "") + '"><div class="k">Your signature strengths</div><h2>Your strengths and their shadow side</h2><p class="lead" style="margin-bottom:8px">'
      + (strengths[0].score >= 3 ? "You have " + (n === 1 ? "one signature strength" : n + " signature strengths") + (n >= 5 ? ", more than most people" : "") + ". " : "None of your levers reached the Signature band (3–4), so your highest-scoring levers are shown here. ")
      + "The marker shows how often you chose each lever: the further right it sits, the more it is worth watching for the overplayed version.</p>" + strengths.slice(0, 6).map(strengthCard).join("") + "</section>");

    // 6 Range and combinations
    h.push('<section class="page"><div class="k">Range and combinations</div><h2>How you combine your levers</h2><div class="two"><div><div class="lab">Your range</div>' + meter(inUse) + '<p class="small">' + inUse + " of 11 levers scored 2 or more.</p><p>" + R[1] + " Your profile is weighted towards " + FAMNAME[famRank[0]] + " levers (average " + f1(famAvg[famRank[0]]) + ") and lighter on " + FAMNAME[famRank[2]] + " levers (average " + f1(famAvg[famRank[2]]) + ").</p></div>"
      + '<div><div class="lab">Your natural combination</div>' + (natural ? '<div class="pair"><div class="chip">' + esc(natural.a.short) + '</div><div class="plus">+</div><div class="chip">' + esc(natural.b.short) + "</div></div><p>" + natural.text + "</p>" : "<p>" + C.combos.naturalFallback + "</p>") + "</div></div>"
      + '<div class="style" style="margin-top:18px"><div class="lab" style="color:var(--green)">Your power pairing</div><div class="pair"><div class="chip">' + esc(topStrength.short) + ' · your strength</div><div class="plus">+</div><div class="chip g">' + esc(M.short) + " · your edge</div></div>"
      + "<p>The easiest way to grow a less-used lever is to attach it to something you already do well. You already " + topStrength.c.sigVerb + ". Next time, " + M.c.bridge + " You keep your natural style, and add a lever that widens your reach.</p></div>"
      + '<h3 style="margin-top:18px;font-size:12pt">A combination to handle with care</h3><p class="muted">' + care + "</p></section>");

    // 7 Development focus
    h.push('<section class="page' + (mainShown.length + reserveShown.length >= 3 ? " compact" : "") + '"><div class="k">Your development focus</div><h2>' + esc(focusTitle) + '</h2><p class="lead">'
      + (derivedMain ? "Your lowest scores are all Hard levers (" + joinAnd(reserveShown.map(function (s) { return s.name; })) + "), which is common and often healthy. Your growth lever is your least-used Core lever, " + M.name + " (" + M.score + "/4)."
        : joinAnd(focus.map(function (s) { return s.name; })) + (focus.length > 1 ? " were" : " was") + " your lowest-scoring " + (focus.length > 1 ? "levers" : "lever") + " (" + min + " of 4)" + (min === 0 ? ": in this audit, you chose other approaches every time." : ".") + (reserveShown.length ? " Core and Soft levers are worth building; Hard levers are worth keeping in reserve." : ""))
      + "</p>" + mainShown.map(function (s, i) { return devCard(s, i === 0); }).join("") + reserveShown.map(reserveCard).join("")
      + (focus.length > mainShown.length + reserveShown.length + (derivedMain ? 0 : 0) ? '<p class="small">Also tied for your lowest score: ' + joinAnd(focus.filter(function (s) { return mainShown.indexOf(s) < 0 && reserveShown.indexOf(s) < 0; }).map(function (s) { return s.name; })) + ". Start with the focus above; one lever at a time works best.</p>" : "")
      + "</section>");

    // 8 Playbook + lens
    h.push('<section class="page"><div class="k">Situational playbook</div><h2>Matching the lever to the moment</h2><p class="muted">The best influencers choose their approach for the situation. Here is how your natural style fits six common moments at work.</p>'
      + '<div class="legend"><span>' + mark("full") + " Natural fit</span><span>" + mark("half") + " Partly fits: add one lever</span><span>" + mark("empty") + ' Less natural: borrow a lever</span></div><div class="fitmap">'
      + fits.map(function (f) { return '<div class="fitrow' + (f.kind === "empty" ? " quiet" : "") + '"><div class="fm">' + mark(f.kind) + '</div><div class="fs"><b>' + esc(f.st.name) + '</b><div class="small" style="margin-top:2px">What tends to work: ' + f.st.works.map(function (id) { return byId[id].name; }).join(" · ") + '</div></div><div class="ft">' + f.tip + "</div></div>"; }).join("")
      + '</div><div class="note" style="margin-top:12px"><b style="color:var(--ink)">The pattern.</b> ' + pattern + "</div>"
      + '<div class="k" style="margin-top:20px">The Malaysian workplace lens</div><p style="margin-top:8px"><b>Respect and hierarchy.</b> ' + lensH + "</p><p><b>Relationships and <i>budi bahasa</i>.</b> " + lensS + "</p><p><b>Firmness without losing face.</b> " + lensF + "</p>" + (C.lens.discretion ? "<p><b>Choosing with <i>budi bicara</i>.</b> " + C.lens.discretion + "</p>" : "") + "</section>");

    // 9 Action plan
    h.push('<section class="page"><div class="k">Your action plan</div><h2>From insight to habit</h2><p class="muted">People who decide exactly <i>when</i> and <i>how</i> they will act are far more likely to follow through than those who simply set a goal (Gollwitzer and Sheeran, 2006). Your plan is pre-filled from your results. Edit it to fit your work.</p>'
      + '<div class="plan"><div class="lab">My if-then plan</div><div class="ifthen"><b>IF</b> ' + M.c.ifThen[0] + ",<br><b>THEN</b> " + M.c.ifThen[1] + "</div>"
      + (plan2 ? '<div class="lab" style="margin-top:10px">And for ' + esc(plan2.name) + '</div><div class="ifthen" style="font-size:11pt"><b>IF</b> ' + plan2.c.ifThen[0] + ",<br><b>THEN</b> " + plan2.c.ifThen[1] + "</div>" : '<div class="lab" style="margin-top:10px">Or write your own</div><div class="blank"></div><div class="blank"></div>')
      + '</div><div class="lab" style="margin-top:16px">Two-week tracker</div><table class="t track"><tr><th style="width:18%">Date</th><th style="width:34%">Situation</th><th style="width:24%">What I did</th><th>How it landed</th></tr>'
      + "<tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr></table>"
      + '<div class="two" style="margin-top:16px"><div class="ask"><b>Check it with others.</b> Ask two colleagues:<ol><li>“When I need your support, what do I usually do?”</li><li>“What could I do more of that would make it easier to say yes?”</li><li>' + M.c.checkQ + '</li></ol><p class="small" style="margin:6px 0 0">Where their answers match this report, you can trust the profile. Where they differ, that is worth exploring.</p></div>'
      + '<div class="ask"><b>Reflect before your debrief.</b><ol><li>What surprised you in this report?</li><li>Where does your ' + esc(S.name.replace(/^The /, "")) + " style work best for you today?</li><li>" + M.c.reflect + '</li></ol><p class="small" style="margin:6px 0 0">Review date: <span style="display:inline-block;width:90px;border-bottom:1px solid var(--frame)"></span></p></div></div>'
      + '<div class="ethic"><b style="color:var(--ink)">Influence, not manipulation.</b> These tactics are tools, not tricks. Use them only where your claim is true and the interest is genuinely shared. This is a relative profile based on your own choices. It is best read alongside honest feedback from colleagues and your facilitator. Questions about your data: enquiries@growthimpact.org.</div></section>');

    h.push("</body></html>");
    return h.join("");
  }

  window.GIGFullReport = { build: build };
})();
