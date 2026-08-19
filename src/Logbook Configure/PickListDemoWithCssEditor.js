// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { InputTextarea } from "primereact/inputtextarea";
// import { ListBox } from "primereact/listbox";
// import { Divider } from "primereact/divider";
// import { Button } from "primereact/button";
// import LocalVariablesTab from "./LocalVariablesTab";

// // ═══════════════════════════════════════════════════════════════════════
// // 1. CSS PROPERTIES DATABASE
// // ═══════════════════════════════════════════════════════════════════════
// const CSS_PROPERTIES = [
//   { property: "color", values: ["red","blue","green","black","white","yellow","orange","purple","pink","gray","transparent","inherit","initial","#000","#fff","#333","#666","rgb(0,0,0)","currentColor"] },
//   { property: "background-color", values: ["red","blue","green","black","white","yellow","orange","purple","pink","gray","transparent","inherit","initial","#f0f0f0","#fff","#000","rgb(255,255,255)"] },
//   { property: "background", values: ["none","transparent","red","blue","#fff","#000","linear-gradient(to right, red, blue)","url()","inherit"] },
//   { property: "font-size", values: ["10px","12px","14px","16px","18px","20px","24px","28px","32px","36px","48px","1em","1.5em","2em","0.875rem","1rem","1.25rem","1.5rem","2rem","small","medium","large","x-large","xx-large"] },
//   { property: "font-weight", values: ["normal","bold","bolder","lighter","100","200","300","400","500","600","700","800","900"] },
//   { property: "font-style", values: ["normal","italic","oblique"] },
//   { property: "font-family", values: ["Arial, sans-serif","Helvetica, sans-serif","'Times New Roman', serif","Georgia, serif","Verdana, sans-serif","'Courier New', monospace","sans-serif","serif","monospace","cursive","fantasy","system-ui"] },
//   { property: "text-align", values: ["left","right","center","justify","start","end"] },
//   { property: "text-decoration", values: ["none","underline","overline","line-through","underline dotted","underline wavy red"] },
//   { property: "text-transform", values: ["none","uppercase","lowercase","capitalize"] },
//   { property: "text-indent", values: ["0","1em","2em","20px","40px"] },
//   { property: "line-height", values: ["normal","1","1.2","1.4","1.5","1.6","2","16px","20px","24px","28px"] },
//   { property: "letter-spacing", values: ["normal","0.5px","1px","2px","3px","-0.5px","-1px","0.05em","0.1em"] },
//   { property: "word-spacing", values: ["normal","1px","2px","4px","8px"] },
//   { property: "margin", values: ["0","4px","8px","12px","16px","20px","24px","32px","auto","0 auto","8px 16px","16px 24px"] },
//   { property: "margin-top", values: ["0","4px","8px","12px","16px","20px","24px","auto"] },
//   { property: "margin-bottom", values: ["0","4px","8px","12px","16px","20px","24px","auto"] },
//   { property: "margin-left", values: ["0","4px","8px","12px","16px","20px","24px","auto"] },
//   { property: "margin-right", values: ["0","4px","8px","12px","16px","20px","24px","auto"] },
//   { property: "padding", values: ["0","4px","8px","12px","16px","20px","24px","32px","8px 16px","16px 24px"] },
//   { property: "padding-top", values: ["0","4px","8px","12px","16px","20px","24px"] },
//   { property: "padding-bottom", values: ["0","4px","8px","12px","16px","20px","24px"] },
//   { property: "padding-left", values: ["0","4px","8px","12px","16px","20px","24px"] },
//   { property: "padding-right", values: ["0","4px","8px","12px","16px","20px","24px"] },
//   { property: "border", values: ["none","1px solid black","1px solid gray","1px solid #ccc","2px solid black","1px dashed gray","1px dotted gray","2px dashed red","1px solid red","1px solid blue"] },
//   { property: "border-radius", values: ["0","2px","4px","6px","8px","10px","12px","16px","20px","50%","9999px"] },
//   { property: "border-color", values: ["black","gray","red","blue","green","#ccc","#ddd","transparent","inherit"] },
//   { property: "border-width", values: ["0","1px","2px","3px","4px","thin","medium","thick"] },
//   { property: "border-style", values: ["none","solid","dashed","dotted","double","groove","ridge","inset","outset"] },
//   { property: "border-top", values: ["none","1px solid black","1px solid #ccc","2px solid red"] },
//   { property: "border-bottom", values: ["none","1px solid black","1px solid #ccc","2px solid red"] },
//   { property: "border-left", values: ["none","1px solid black","1px solid #ccc","2px solid red"] },
//   { property: "border-right", values: ["none","1px solid black","1px solid #ccc","2px solid red"] },
//   { property: "display", values: ["block","inline","inline-block","flex","inline-flex","grid","inline-grid","none","table","table-row","table-cell","contents"] },
//   { property: "position", values: ["static","relative","absolute","fixed","sticky"] },
//   { property: "top", values: ["0","4px","8px","16px","24px","50%","100%","auto"] },
//   { property: "bottom", values: ["0","4px","8px","16px","24px","50%","auto"] },
//   { property: "left", values: ["0","4px","8px","16px","24px","50%","100%","auto"] },
//   { property: "right", values: ["0","4px","8px","16px","24px","50%","auto"] },
//   { property: "width", values: ["auto","100%","50%","75%","25%","100px","200px","300px","400px","500px","fit-content","max-content","min-content","100vw"] },
//   { property: "height", values: ["auto","100%","50%","100px","200px","300px","400px","500px","fit-content","100vh"] },
//   { property: "max-width", values: ["none","100%","200px","300px","500px","800px","1200px"] },
//   { property: "min-width", values: ["0","50px","100px","200px","300px","auto"] },
//   { property: "max-height", values: ["none","100%","200px","300px","500px"] },
//   { property: "min-height", values: ["0","50px","100px","200px","300px","auto"] },
//   { property: "overflow", values: ["visible","hidden","scroll","auto","clip"] },
//   { property: "overflow-x", values: ["visible","hidden","scroll","auto"] },
//   { property: "overflow-y", values: ["visible","hidden","scroll","auto"] },
//   { property: "opacity", values: ["0","0.1","0.2","0.3","0.4","0.5","0.6","0.7","0.8","0.9","1"] },
//   { property: "z-index", values: ["auto","0","1","2","5","10","50","100","1000","9999","-1"] },
//   { property: "cursor", values: ["auto","default","pointer","move","text","wait","help","crosshair","not-allowed","grab","grabbing","col-resize","row-resize"] },
//   { property: "visibility", values: ["visible","hidden","collapse"] },
//   { property: "box-shadow", values: ["none","0 1px 3px rgba(0,0,0,0.12)","0 2px 4px rgba(0,0,0,0.1)","0 4px 6px rgba(0,0,0,0.1)","0 4px 12px rgba(0,0,0,0.15)","0 8px 24px rgba(0,0,0,0.15)","inset 0 1px 3px rgba(0,0,0,0.12)","0 0 0 3px rgba(66,153,225,0.5)"] },
//   { property: "text-shadow", values: ["none","1px 1px 2px rgba(0,0,0,0.3)","2px 2px 4px rgba(0,0,0,0.3)","0 0 10px rgba(0,0,0,0.5)"] },
//   { property: "flex-direction", values: ["row","row-reverse","column","column-reverse"] },
//   { property: "justify-content", values: ["flex-start","flex-end","center","space-between","space-around","space-evenly","start","end"] },
//   { property: "align-items", values: ["stretch","flex-start","flex-end","center","baseline","start","end"] },
//   { property: "align-self", values: ["auto","stretch","flex-start","flex-end","center","baseline"] },
//   { property: "flex-wrap", values: ["nowrap","wrap","wrap-reverse"] },
//   { property: "flex-grow", values: ["0","1","2","3"] },
//   { property: "flex-shrink", values: ["0","1","2"] },
//   { property: "flex-basis", values: ["auto","0","50%","100%","100px","200px","content"] },
//   { property: "flex", values: ["0","1","auto","none","1 1 auto","0 0 auto","1 0 0"] },
//   { property: "gap", values: ["0","2px","4px","8px","12px","16px","20px","24px","32px"] },
//   { property: "row-gap", values: ["0","4px","8px","12px","16px","20px"] },
//   { property: "column-gap", values: ["0","4px","8px","12px","16px","20px"] },
//   { property: "white-space", values: ["normal","nowrap","pre","pre-wrap","pre-line","break-spaces"] },
//   { property: "word-break", values: ["normal","break-all","keep-all","break-word"] },
//   { property: "word-wrap", values: ["normal","break-word"] },
//   { property: "text-overflow", values: ["clip","ellipsis"] },
//   { property: "transform", values: ["none","rotate(45deg)","rotate(90deg)","rotate(180deg)","scale(1.5)","scale(0.5)","translateX(10px)","translateY(10px)","translate(50%, 50%)","skewX(10deg)"] },
//   { property: "transition", values: ["none","all 0.3s ease","all 0.5s ease","all 0.2s ease-in-out","color 0.3s","background-color 0.3s","opacity 0.3s","transform 0.3s"] },
//   { property: "animation", values: ["none"] },
//   { property: "outline", values: ["none","1px solid black","2px solid blue","1px dashed gray","2px solid red","0"] },
//   { property: "outline-offset", values: ["0","2px","4px","-2px"] },
//   { property: "list-style", values: ["none","disc","circle","square","decimal","lower-alpha","upper-alpha"] },
//   { property: "list-style-type", values: ["none","disc","circle","square","decimal"] },
//   { property: "float", values: ["none","left","right","inline-start","inline-end"] },
//   { property: "clear", values: ["none","left","right","both"] },
//   { property: "vertical-align", values: ["baseline","top","middle","bottom","text-top","text-bottom","sub","super"] },
//   { property: "object-fit", values: ["fill","contain","cover","none","scale-down"] },
//   { property: "pointer-events", values: ["auto","none"] },
//   { property: "user-select", values: ["auto","none","text","all"] },
//   { property: "resize", values: ["none","both","horizontal","vertical"] },
//   { property: "box-sizing", values: ["content-box","border-box"] },
//   { property: "content", values: ['""',"none","attr()","counter()","open-quote","close-quote"] },
//   { property: "filter", values: ["none","blur(4px)","brightness(0.5)","contrast(200%)","grayscale(100%)","saturate(200%)","sepia(100%)","drop-shadow(2px 2px 4px rgba(0,0,0,0.3))"] },
//   { property: "backdrop-filter", values: ["none","blur(4px)","blur(10px)","brightness(0.5)"] },
//   { property: "clip-path", values: ["none","circle(50%)","inset(10px)","polygon(50% 0%, 0% 100%, 100% 100%)"] },
//   { property: "mix-blend-mode", values: ["normal","multiply","screen","overlay","darken","lighten"] },
//   { property: "isolation", values: ["auto","isolate"] },
//   { property: "grid-template-columns", values: ["none","1fr","repeat(2, 1fr)","repeat(3, 1fr)","repeat(4, 1fr)","200px 1fr","1fr 2fr"] },
//   { property: "grid-template-rows", values: ["none","auto","1fr","repeat(2, 1fr)","100px auto"] },
//   { property: "grid-column", values: ["auto","1","1 / 3","1 / -1","span 2","span 3"] },
//   { property: "grid-row", values: ["auto","1","1 / 3","span 2"] },
//   { property: "place-items", values: ["center","start","end","stretch","center center"] },
//   { property: "place-content", values: ["center","start","end","space-between","space-around"] },
// ];

// const ALL_PROPERTY_NAMES = CSS_PROPERTIES.map((p) => p.property);

// // List of CSS properties that accept unitless numeric values
// const UNITLESS_PROPERTIES = [
//   "opacity","z-index","flex-grow","flex-shrink","flex","line-height",
//   "font-weight","order","orphans","widows","columns","column-count",
//   "fill-opacity","stroke-opacity","tab-size",
// ];

// // ═══════════════════════════════════════════════════════════════════════
// // 2. VALIDATION HELPERS
// // ═══════════════════════════════════════════════════════════════════════

// /** Extract all CSS backtick blocks from code */
// const extractCssBlocks = (code) => {
//   const blocks = [];
//   const regex = /`([^`]*)`/g;
//   let match;
//   while ((match = regex.exec(code)) !== null) {
//     blocks.push({
//       css: match[1],
//       startIndex: match.index + 1,
//       endIndex: match.index + match[1].length,
//     });
//   }
//   return blocks;
// };

// /** Validate a CSS block — returns errors, warnings, and parsed declarations */
// const validateCssBlock = (cssText) => {
//   const errors = [];
//   const warnings = [];
//   const parsedDeclarations = [];

//   if (!cssText || cssText.trim().length === 0) {
//     return { errors, warnings, parsedDeclarations };
//   }

//   // Split into individual declarations (handle both newline and semicolon separation)
//   const rawDeclarations = [];
//   const lines = cssText.split("\n");
//   let lineNumber = 0;

//   for (const line of lines) {
//     lineNumber++;
//     const trimmedLine = line.trim();
//     if (!trimmedLine) continue;

//     // Split line by semicolons for multi-declaration lines
//     const parts = trimmedLine.split(";");
//     for (const part of parts) {
//       const partTrimmed = part.trim();
//       if (!partTrimmed) continue;
//       rawDeclarations.push({ text: partTrimmed, line: lineNumber });
//     }
//   }

//   for (const { text: decl, line } of rawDeclarations) {
//     // Must contain a colon
//     if (!decl.includes(":")) {
//       errors.push({
//         line,
//         message: `Missing colon (:) — "${decl}" is not a valid CSS declaration`,
//         text: decl,
//       });
//       continue;
//     }

//     const colonIdx = decl.indexOf(":");
//     const property = decl.substring(0, colonIdx).trim().toLowerCase();
//     let value = decl.substring(colonIdx + 1).trim();

//     // Remove trailing semicolons
//     value = value.replace(/;+$/, "").trim();

//     if (!property) {
//       errors.push({ line, message: "Empty property name", text: decl });
//       continue;
//     }
//     if (!value) {
//       errors.push({
//         line,
//         message: `Missing value for property "${property}"`,
//         text: decl,
//       });
//       continue;
//     }

//     // Check for known CSS property
//     const knownProp = CSS_PROPERTIES.find((p) => p.property === property);
//     if (!knownProp) {
//       // Check if it might be a vendor prefix
//       if (property.startsWith("-webkit-") || property.startsWith("-moz-") || property.startsWith("-ms-") || property.startsWith("-o-")) {
//         // Vendor prefixed — just note it
//       } else {
//         warnings.push({
//           line,
//           message: `Unknown CSS property: "${property}"`,
//           text: decl,
//         });
//       }
//     }

//     // Border shorthand without style
//     if (property === "border") {
//       const borderStyles = ["solid","dashed","dotted","double","groove","ridge","inset","outset","none","hidden"];
//       const hasStyle = borderStyles.some((s) => value.toLowerCase().includes(s));
//       if (!hasStyle && value !== "none" && value !== "0") {
//         warnings.push({
//           line,
//           message: `"border: ${value}" — no border-style found. The border may not be visible. Try "border: ${value} solid"`,
//           text: decl,
//         });
//       }
//     }

//     // Number without units
//     if (
//       !UNITLESS_PROPERTIES.includes(property) &&
//       /^\d+(\.\d+)?$/.test(value) &&
//       value !== "0"
//     ) {
//       warnings.push({
//         line,
//         message: `"${property}: ${value}" — numeric value without units. Did you mean "${value}px"?`,
//         text: decl,
//       });
//     }

//     // Duplicate property check
//     const existingIdx = parsedDeclarations.findIndex((d) => d.property === property);
//     if (existingIdx !== -1) {
//       warnings.push({
//         line,
//         message: `Duplicate property "${property}" — the later value will override the earlier one`,
//         text: decl,
//       });
//     }

//     parsedDeclarations.push({ property, value, line });
//   }

//   return { errors, warnings, parsedDeclarations };
// };

// /** Convert parsed CSS declarations to a React style object */
// const cssDeclarationsToStyleObject = (declarations) => {
//   const style = {};
//   for (const { property, value } of declarations) {
//     const camelCase = property.replace(/-([a-z])/g, (_, letter) =>
//       letter.toUpperCase()
//     );
//     style[camelCase] = value;
//   }
//   return style;
// };

// // ═══════════════════════════════════════════════════════════════════════
// // 3. EXPRESSION EVALUATOR
// // ═══════════════════════════════════════════════════════════════════════

// /**
//  * Evaluates the user's expression code.
//  * Replaces {{variables}} with placeholder strings, then wraps backtick
//  * template literals with a capture function so we can extract the CSS
//  * string that results from executing the conditional logic.
//  */
// const evaluateExpression = (code) => {
//   if (!code || code.trim() === "") {
//     return { success: false, results: [], jsError: null, rawOutput: null };
//   }

//   // Check for unclosed backticks
//   const backtickCount = (code.match(/`/g) || []).length;
//   if (backtickCount % 2 !== 0) {
//     return {
//       success: false,
//       results: [],
//       jsError:
//         "Unclosed template literal (backtick). Ensure all ` are properly paired.",
//       rawOutput: null,
//     };
//   }

//   // Check there are actually CSS blocks
//   if (backtickCount === 0) {
//     return {
//       success: false,
//       results: [],
//       jsError: null,
//       rawOutput: null,
//     };
//   }

//   try {
//     // Replace {{variable}} with string placeholder (for JS evaluation context)
//     let processedCode = code.replace(
//       /\{\{([^}]+)\}\}/g,
//       (_, varName) => `"__var_${varName.trim()}__"`
//     );

//     // Wrap each backtick template literal with a capture function call
//     // so we can intercept the CSS string that gets "executed"
//     const results = [];
//     const captureCSS = (val) => {
//       results.push(val);
//       return val;
//     };

//     let transformedCode = processedCode.replace(
//       /`([\s\S]*?)`/g,
//       "__captureCSS__(`$1`)"
//     );

//     // Create and execute the function
//     const fn = new Function("__captureCSS__", transformedCode);
//     fn(captureCSS);

//     if (results.length > 0) {
//       return { success: true, results, jsError: null, rawOutput: results[results.length - 1] };
//     }

//     return {
//       success: false,
//       results: [],
//       jsError:
//         "Expression executed but no CSS block was reached. Check your conditions.",
//       rawOutput: null,
//     };
//   } catch (e) {
//     return {
//       success: false,
//       results: [],
//       jsError: e.message,
//       rawOutput: null,
//     };
//   }
// };

// // ═══════════════════════════════════════════════════════════════════════
// // 4. SUB-COMPONENTS
// // ═══════════════════════════════════════════════════════════════════════

// /** Autocomplete suggestion popup */
// const SuggestionPopup = ({ suggestions, onSelect, position, visible, selectedIndex }) => {
//   const listRef = useRef(null);

//   useEffect(() => {
//     if (listRef.current && selectedIndex >= 0) {
//       const items = listRef.current.querySelectorAll("li");
//       if (items[selectedIndex]) {
//         items[selectedIndex].scrollIntoView({ block: "nearest" });
//       }
//     }
//   }, [selectedIndex]);

//   if (!visible || suggestions.length === 0) return null;

//   return (
//     <div
//       ref={listRef}
//       style={{
//         position: "absolute",
//         top: position.top,
//         left: position.left,
//         zIndex: 9999,
//         backgroundColor: "#fff",
//         border: "1px solid #d0d7de",
//         borderRadius: "8px",
//         boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
//         maxHeight: "220px",
//         overflowY: "auto",
//         minWidth: "240px",
//         maxWidth: "380px",
//       }}
//     >
//       <ul style={{ listStyle: "none", margin: 0, padding: "4px 0" }}>
//         {suggestions.map((s, idx) => (
//           <li
//             key={idx}
//             onMouseDown={(e) => {
//               e.preventDefault();
//               onSelect(s);
//             }}
//             style={{
//               padding: "6px 14px",
//               cursor: "pointer",
//               backgroundColor:
//                 idx === selectedIndex ? "#dbeafe" : "transparent",
//               fontSize: "13px",
//               fontFamily: "'Fira Code', Consolas, monospace",
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//               transition: "background-color 0.1s",
//             }}
//             onMouseEnter={(e) => {
//               if (idx !== selectedIndex)
//                 e.currentTarget.style.backgroundColor = "#f6f8fa";
//             }}
//             onMouseLeave={(e) => {
//               if (idx !== selectedIndex)
//                 e.currentTarget.style.backgroundColor = "transparent";
//             }}
//           >
//             <span
//               style={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "20px",
//                 height: "20px",
//                 borderRadius: "4px",
//                 backgroundColor:
//                   s.type === "property" ? "#dbeafe" : "#dcfce7",
//                 color: s.type === "property" ? "#2563eb" : "#16a34a",
//                 fontSize: "10px",
//                 fontWeight: "bold",
//                 flexShrink: 0,
//               }}
//             >
//               {s.type === "property" ? "P" : "V"}
//             </span>
//             <span style={{ flex: 1 }}>{s.label}</span>
//             <span style={{ fontSize: "10px", color: "#9ca3af" }}>
//               {s.type}
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// /** Diagnostics panel showing JS errors and CSS errors/warnings */
// const DiagnosticsPanel = ({ jsError, cssErrors, cssWarnings }) => {
//   const hasContent =
//     jsError || cssErrors.length > 0 || cssWarnings.length > 0;
//   if (!hasContent) return null;

//   return (
//     <div
//       style={{
//         marginTop: "10px",
//         maxHeight: "150px",
//         overflowY: "auto",
//         borderRadius: "8px",
//         border: "1px solid #e5e7eb",
//         fontSize: "12px",
//         fontFamily: "'Fira Code', Consolas, monospace",
//       }}
//     >
//       {/* JS Error */}
//       {jsError && (
//         <div
//           style={{
//             padding: "8px 14px",
//             backgroundColor: "#fef2f2",
//             color: "#991b1b",
//             borderBottom: "1px solid #fecaca",
//             display: "flex",
//             alignItems: "flex-start",
//             gap: "8px",
//           }}
//         >
//           <i
//             className="pi pi-times-circle"
//             style={{ fontSize: "14px", marginTop: "1px", flexShrink: 0 }}
//           />
//           <div>
//             <strong>JavaScript Error:</strong> {jsError}
//           </div>
//         </div>
//       )}

//       {/* CSS Errors */}
//       {cssErrors.map((err, idx) => (
//         <div
//           key={`cerr-${idx}`}
//           style={{
//             padding: "6px 14px",
//             backgroundColor: "#fff1f2",
//             color: "#be123c",
//             borderBottom: "1px solid #fecdd3",
//             display: "flex",
//             alignItems: "flex-start",
//             gap: "8px",
//           }}
//         >
//           <i
//             className="pi pi-times-circle"
//             style={{ fontSize: "13px", marginTop: "1px", flexShrink: 0 }}
//           />
//           <span>
//             <strong>
//               CSS{err.blockIndex != null ? ` Block ${err.blockIndex}` : ""}{" "}
//               Line {err.line}:
//             </strong>{" "}
//             {err.message}
//           </span>
//         </div>
//       ))}

//       {/* CSS Warnings */}
//       {cssWarnings.map((warn, idx) => (
//         <div
//           key={`cwarn-${idx}`}
//           style={{
//             padding: "6px 14px",
//             backgroundColor: "#fffbeb",
//             color: "#92400e",
//             borderBottom: "1px solid #fde68a",
//             display: "flex",
//             alignItems: "flex-start",
//             gap: "8px",
//           }}
//         >
//           <i
//             className="pi pi-exclamation-triangle"
//             style={{ fontSize: "13px", marginTop: "1px", flexShrink: 0 }}
//           />
//           <span>
//             <strong>
//               CSS{warn.blockIndex != null ? ` Block ${warn.blockIndex}` : ""}{" "}
//               Line {warn.line}:
//             </strong>{" "}
//             {warn.message}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// /** Live preview showing the evaluated CSS applied to Sample Text */
// const LivePreviewPanel = ({ evaluationResult, cssValidation }) => {
//   if (
//     !evaluationResult ||
//     !evaluationResult.success ||
//     evaluationResult.results.length === 0
//   ) {
//     return null;
//   }

//   const lastCss = evaluationResult.results[evaluationResult.results.length - 1];
//   const { parsedDeclarations } = validateCssBlock(lastCss);
//   const styleObj = cssDeclarationsToStyleObject(parsedDeclarations);

//   return (
//     <div
//       style={{
//         marginTop: "12px",
//         border: "1px solid #e5e7eb",
//         borderRadius: "10px",
//         overflow: "hidden",
//       }}
//     >
//       {/* Header */}
//       <div
//         style={{
//           padding: "10px 16px",
//           backgroundColor: "#f8fafc",
//           borderBottom: "1px solid #e5e7eb",
//           display: "flex",
//           alignItems: "center",
//           gap: "8px",
//           fontSize: "13px",
//           fontWeight: "600",
//           color: "#475569",
//         }}
//       >
//         <i className="pi pi-eye" style={{ fontSize: "14px" }} />
//         Live Preview — Evaluated Result
//       </div>

//       <div style={{ display: "flex" }}>
//         {/* CSS Output */}
//         <div
//           style={{
//             flex: 1,
//             padding: "14px 16px",
//             borderRight: "1px solid #e5e7eb",
//           }}
//         >
//           <div
//             style={{
//               fontSize: "11px",
//               color: "#94a3b8",
//               marginBottom: "8px",
//               textTransform: "uppercase",
//               letterSpacing: "0.5px",
//               fontWeight: "600",
//             }}
//           >
//             Evaluated CSS
//           </div>
//           <div
//             style={{
//               fontFamily: "'Fira Code', Consolas, monospace",
//               fontSize: "12px",
//               lineHeight: "1.8",
//               backgroundColor: "#f1f5f9",
//               padding: "10px 14px",
//               borderRadius: "6px",
//               color: "#334155",
//             }}
//           >
//             {parsedDeclarations.map((d, i) => (
//               <div key={i}>
//                 <span style={{ color: "#7c3aed" }}>{d.property}</span>
//                 <span style={{ color: "#64748b" }}>: </span>
//                 <span style={{ color: "#059669" }}>{d.value}</span>
//                 <span style={{ color: "#94a3b8" }}>;</span>
//               </div>
//             ))}
//             {parsedDeclarations.length === 0 && (
//               <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
//                 No valid CSS declarations
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Preview */}
//         <div style={{ flex: 1, padding: "14px 16px" }}>
//           <div
//             style={{
//               fontSize: "11px",
//               color: "#94a3b8",
//               marginBottom: "8px",
//               textTransform: "uppercase",
//               letterSpacing: "0.5px",
//               fontWeight: "600",
//             }}
//           >
//             Sample Text Preview
//           </div>
//           <div
//             style={{
//               backgroundColor: "#fff",
//               border: "2px dashed #e2e8f0",
//               borderRadius: "8px",
//               padding: "24px 20px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               minHeight: "80px",
//             }}
//           >
//             <span style={styleObj}>Sample Text</span>
//           </div>
//           {evaluationResult.results.length > 1 && (
//             <div
//               style={{
//                 marginTop: "8px",
//                 fontSize: "11px",
//                 color: "#94a3b8",
//                 fontStyle: "italic",
//               }}
//             >
//               {evaluationResult.results.length} CSS block(s) executed — showing
//               the last result
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Variable placeholder note */}
//       <div
//         style={{
//           padding: "8px 16px",
//           backgroundColor: "#eff6ff",
//           borderTop: "1px solid #e5e7eb",
//           fontSize: "11px",
//           color: "#3b82f6",
//           display: "flex",
//           alignItems: "center",
//           gap: "6px",
//         }}
//       >
//         <i className="pi pi-info-circle" style={{ fontSize: "12px" }} />
//         {"{{variables}}"} are replaced with placeholders during preview
//         evaluation.
//       </div>
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════
// // 5. MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════

// const PickListDemoWithCssEditor = ({
//   data,
//   textAreaValue,
//   setTextAreaValue,
//   depData,
//   disabledArea,
// }) => {
//   const textAreaRef = useRef(null);
//   const editorContainerRef = useRef(null);

//   // ── Suggestion state ──────────────────────────────────────────────
//   const [suggestions, setSuggestions] = useState([]);
//   const [suggestionVisible, setSuggestionVisible] = useState(false);
//   const [suggestionPosition, setSuggestionPosition] = useState({
//     top: 0,
//     left: 0,
//   });
//   const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
//   const [suggestionContext, setSuggestionContext] = useState(null);

//   // ── Evaluation state ──────────────────────────────────────────────
//   const [evaluationResult, setEvaluationResult] = useState(null);
//   const [isEvaluating, setIsEvaluating] = useState(false);

//   // ── Validation state ──────────────────────────────────────────────
//   const [cssErrors, setCssErrors] = useState([]);
//   const [cssWarnings, setCssWarnings] = useState([]);

//   // ═══════════════════════════════════════════════════════════════════
//   // EXISTING FUNCTIONALITY — UNCHANGED
//   // ═══════════════════════════════════════════════════════════════════

//   let listBoxData = null;
//   if (data) {
//     listBoxData = data
//       .flatMap((item) => item.cellInfo)
//       .map((cell) => ({
//         label: `${cell.aliasId} (${cell.cellId})`,
//         value: cell.cellId,
//       }));
//   } else {
//     listBoxData = depData?.map((item) => ({
//       label: `${item.aliasId} (${item.cellId})`,
//       value: item.cellId,
//     }));
//   }

//   const handleLabelClick = (value) => {
//     console.log("My Value : ", value);
//     value = ` {{${value}}} `;
//     const { selectionStart, selectionEnd } = textAreaRef?.current;
//     console.log("My TextArea Value : ", textAreaValue);
//     if (textAreaValue === null) {
//       setTextAreaValue(value);
//     } else {
//       const newValue =
//         textAreaValue.slice(0, selectionStart) +
//         value +
//         textAreaValue.slice(selectionEnd);
//       setTextAreaValue(newValue);
//       setTimeout(() => {
//         textAreaRef.current.setSelectionRange(
//           selectionStart + value.length,
//           selectionStart + value.length
//         );
//         textAreaRef.current.focus();
//       }, 0);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════════
//   // CSS SUGGESTION INTELLIGENCE
//   // ═══════════════════════════════════════════════════════════════════

//   /** Check if cursor sits inside a backtick CSS block */
//   const isCursorInsideCssBlock = useCallback((text, cursorPos) => {
//     let inside = false;
//     let blockStart = -1;
//     for (let i = 0; i < text.length && i < cursorPos; i++) {
//       if (text[i] === "`") {
//         inside = !inside;
//         if (inside) blockStart = i;
//       }
//     }
//     if (inside) {
//       return { inside: true, blockStart: blockStart + 1 };
//     }
//     return { inside: false, blockStart: -1 };
//   }, []);

//   /** Determine if we should suggest property names or values */
//   const computeSuggestionContext = useCallback(
//     (text, cursorPos) => {
//       const { inside, blockStart } = isCursorInsideCssBlock(text, cursorPos);
//       if (!inside) return null;

//       const cssBeforeCursor = text.substring(blockStart, cursorPos);
//       const lines = cssBeforeCursor.split("\n");
//       const currentLine = lines[lines.length - 1];
//       const trimmedLine = currentLine.trimStart();

//       const colonIndex = trimmedLine.indexOf(":");
//       if (colonIndex !== -1) {
//         // Typing a value — after the colon
//         const propertyPart = trimmedLine
//           .substring(0, colonIndex)
//           .trim()
//           .toLowerCase();
//         const valuePart = trimmedLine
//           .substring(colonIndex + 1)
//           .trim()
//           .replace(/;$/, "");

//         const lineStartInText = cursorPos - currentLine.length;
//         const valueStartInLine = currentLine.indexOf(":") + 1;
//         const leadingSpaces =
//           currentLine.substring(valueStartInLine).length -
//           currentLine.substring(valueStartInLine).trimStart().length;
//         const replaceStart = lineStartInText + valueStartInLine + leadingSpaces;

//         return {
//           type: "value",
//           property: propertyPart,
//           currentInput: valuePart,
//           replaceStart,
//           replaceEnd: cursorPos,
//         };
//       }

//       // Typing a property name
//       const lineStartInText = cursorPos - currentLine.length;
//       const leadingSpaces = currentLine.length - currentLine.trimStart().length;
//       return {
//         type: "property",
//         currentInput: trimmedLine.replace(/;$/, ""),
//         replaceStart: lineStartInText + leadingSpaces,
//         replaceEnd: cursorPos,
//       };
//     },
//     [isCursorInsideCssBlock]
//   );

//   /** Get matching suggestions */
//   const getSuggestions = useCallback((context) => {
//     if (!context) return [];

//     if (context.type === "property") {
//       const input = context.currentInput.toLowerCase();
//       if (input.length === 0) {
//         return ALL_PROPERTY_NAMES.slice(0, 20).map((p) => ({
//           label: p,
//           value: p + ": ",
//           type: "property",
//         }));
//       }
//       return ALL_PROPERTY_NAMES.filter(
//         (p) => p.startsWith(input) || p.includes(input)
//       )
//         .slice(0, 15)
//         .map((p) => ({ label: p, value: p + ": ", type: "property" }));
//     }

//     if (context.type === "value") {
//       const prop = CSS_PROPERTIES.find((p) => p.property === context.property);
//       if (!prop) return [];
//       const input = context.currentInput.toLowerCase();
//       return prop.values
//         .filter(
//           (v) =>
//             v.toLowerCase().startsWith(input) ||
//             (input.length > 0 && v.toLowerCase().includes(input))
//         )
//         .slice(0, 15)
//         .map((v) => ({ label: v, value: v + ";", type: "value" }));
//     }

//     return [];
//   }, []);

//   /** Estimate popup position relative to the editor container */
//   const estimateCursorPosition = useCallback(() => {
//     const textarea = textAreaRef.current;
//     if (!textarea) return { top: 0, left: 0 };

//     const text = textAreaValue || "";
//     const beforeCursor = text.substring(0, textarea.selectionStart);
//     const lines = beforeCursor.split("\n");
//     const lineNum = lines.length;
//     const colNum = lines[lines.length - 1].length;

//     const lineHeight = 18;
//     const charWidth = 7.8;

//     return {
//       top: Math.max(lineNum * lineHeight - textarea.scrollTop + 22, 20),
//       left: Math.min(Math.max(colNum * charWidth, 10), 400),
//     };
//   }, [textAreaValue]);

//   /** Apply a selected suggestion */
//   const applySuggestion = useCallback(
//     (suggestion) => {
//       if (!suggestionContext) return;

//       const { replaceStart, replaceEnd } = suggestionContext;
//       const text = textAreaValue || "";
//       const before = text.substring(0, replaceStart);
//       const after = text.substring(replaceEnd);
//       const newValue = before + suggestion.value + after;
//       setTextAreaValue(newValue);

//       const newCursorPos = replaceStart + suggestion.value.length;

//       setSuggestionVisible(false);
//       setSuggestions([]);

//       setTimeout(() => {
//         if (textAreaRef.current) {
//           textAreaRef.current.setSelectionRange(newCursorPos, newCursorPos);
//           textAreaRef.current.focus();
//         }
//       }, 0);
//     },
//     [suggestionContext, textAreaValue, setTextAreaValue]
//   );

//   /** Trigger suggestion computation */
//   const triggerSuggestions = useCallback(
//     (text, cursorPos) => {
//       const ctx = computeSuggestionContext(text, cursorPos);
//       setSuggestionContext(ctx);

//       const newSuggestions = getSuggestions(ctx);
//       setSuggestions(newSuggestions);
//       setSelectedSuggestionIndex(0);
//       setSuggestionVisible(newSuggestions.length > 0);

//       if (newSuggestions.length > 0) {
//         setSuggestionPosition(estimateCursorPosition());
//       }
//     },
//     [computeSuggestionContext, getSuggestions, estimateCursorPosition]
//   );

//   // ═══════════════════════════════════════════════════════════════════
//   // EXPRESSION EVALUATION (debounced)
//   // ═══════════════════════════════════════════════════════════════════

//   /** Run evaluation */
//   const runEvaluation = useCallback(
//     (code) => {
//       const result = evaluateExpression(code);
//       setEvaluationResult(result);

//       // Validate all CSS blocks in the source for inline diagnostics
//       const allErrors = [];
//       const allWarnings = [];

//       if (code) {
//         const blocks = extractCssBlocks(code);
//         blocks.forEach((block, blockIdx) => {
//           const { errors, warnings } = validateCssBlock(block.css);
//           errors.forEach((e) =>
//             allErrors.push({ ...e, blockIndex: blockIdx + 1 })
//           );
//           warnings.forEach((w) =>
//             allWarnings.push({ ...w, blockIndex: blockIdx + 1 })
//           );
//         });
//       }

//       setCssErrors(allErrors);
//       setCssWarnings(allWarnings);
//     },
//     []
//   );

//   // Auto-evaluate on text change (debounced 700ms)
//   useEffect(() => {
//     if (!textAreaValue) {
//       setEvaluationResult(null);
//       setCssErrors([]);
//       setCssWarnings([]);
//       return;
//     }

//     setIsEvaluating(true);
//     const timer = setTimeout(() => {
//       runEvaluation(textAreaValue);
//       setIsEvaluating(false);
//     }, 700);

//     return () => {
//       clearTimeout(timer);
//       setIsEvaluating(false);
//     };
//   }, [textAreaValue, runEvaluation]);

//   // ═══════════════════════════════════════════════════════════════════
//   // EVENT HANDLERS
//   // ═══════════════════════════════════════════════════════════════════

//   const handleTextChange = (e) => {
//     const newValue = e.target.value;
//     setTextAreaValue(newValue);

//     // Trigger suggestions after state update
//     setTimeout(() => {
//       const cursorPos = e.target.selectionStart;
//       triggerSuggestions(newValue, cursorPos);
//     }, 0);
//   };

//   const handleKeyDown = (e) => {
//     // Suggestion navigation
//     if (suggestionVisible && suggestions.length > 0) {
//       if (e.key === "ArrowDown") {
//         e.preventDefault();
//         setSelectedSuggestionIndex((prev) =>
//           Math.min(prev + 1, suggestions.length - 1)
//         );
//         return;
//       }
//       if (e.key === "ArrowUp") {
//         e.preventDefault();
//         setSelectedSuggestionIndex((prev) => Math.max(prev - 1, 0));
//         return;
//       }
//       if (e.key === "Enter" || e.key === "Tab") {
//         e.preventDefault();
//         applySuggestion(suggestions[selectedSuggestionIndex]);
//         return;
//       }
//       if (e.key === "Escape") {
//         e.preventDefault();
//         setSuggestionVisible(false);
//         return;
//       }
//     }

//     // Ctrl+Enter = manual run
//     if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
//       e.preventDefault();
//       if (textAreaValue) {
//         runEvaluation(textAreaValue);
//       }
//     }
//   };

//   const handleClick = () => {
//     setTimeout(() => {
//       if (!textAreaRef.current || !textAreaValue) return;
//       triggerSuggestions(textAreaValue, textAreaRef.current.selectionStart);
//     }, 0);
//   };

//   const handleBlur = () => {
//     setTimeout(() => setSuggestionVisible(false), 200);
//   };

//   const handleManualRun = () => {
//     if (textAreaValue) {
//       runEvaluation(textAreaValue);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════════
//   // STATUS INDICATOR
//   // ═══════════════════════════════════════════════════════════════════

//   const getStatusInfo = () => {
//     if (!textAreaValue) return null;
//     const blocks = extractCssBlocks(textAreaValue);
//     if (blocks.length === 0) return null;

//     if (evaluationResult?.jsError) {
//       return {
//         icon: "pi pi-times-circle",
//         color: "#dc2626",
//         bgColor: "#fef2f2",
//         text: "JS Error",
//       };
//     }
//     if (cssErrors.length > 0) {
//       return {
//         icon: "pi pi-times-circle",
//         color: "#dc2626",
//         bgColor: "#fef2f2",
//         text: `${cssErrors.length} CSS error(s)`,
//       };
//     }
//     if (cssWarnings.length > 0) {
//       return {
//         icon: "pi pi-exclamation-triangle",
//         color: "#d97706",
//         bgColor: "#fffbeb",
//         text: `${cssWarnings.length} warning(s)`,
//       };
//     }
//     if (evaluationResult?.success) {
//       return {
//         icon: "pi pi-check-circle",
//         color: "#16a34a",
//         bgColor: "#f0fdf4",
//         text: "Valid ✓",
//       };
//     }
//     if (isEvaluating) {
//       return {
//         icon: "pi pi-spin pi-spinner",
//         color: "#6366f1",
//         bgColor: "#eef2ff",
//         text: "Evaluating...",
//       };
//     }
//     return null;
//   };

//   const statusInfo = getStatusInfo();

//   // ═══════════════════════════════════════════════════════════════════
//   // RENDER
//   // ═══════════════════════════════════════════════════════════════════

//   return (
//     <div style={{ display: "flex", gap: "10px" }}>
//       {/* ─── LEFT PANEL (existing — unchanged) ─── */}
//       <div>
//         <span className="font-bold text-sm">
//           Click on dependent/local fields to add in the Editor
//         </span>

//         <LocalVariablesTab handleLabelClick={handleLabelClick} />

//         {depData?.length !== 0 && (
//           <ListBox
//             listStyle={{ height: "398px", width: "300px" }}
//             style={{ marginTop: "1rem" }}
//             options={listBoxData}
//             filter
//             filterPlaceholder="Search..."
//             className="ListBoxStyle newlistboxStyleforgap"
//             onChange={(e) => handleLabelClick(e.value)}
//             itemTemplate={(option) => (
//               <div
//                 style={{
//                   cursor: "pointer",
//                   padding: "11px",
//                   backgroundColor: "#e0f7fa",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   borderRadius: "6px",
//                   marginBottom: "1px",
//                 }}
//               >
//                 <span>{option.label}</span>
//                 <i
//                   className="pi pi-angle-right"
//                   style={{ fontSize: "16px" }}
//                 />
//               </div>
//             )}
//           />
//         )}
//       </div>

//       <Divider layout="vertical" />

//       {/* ─── RIGHT PANEL ─── */}
//       <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
//         {/* Header row */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             flexWrap: "wrap",
//             gap: "8px",
//           }}
//         >
//           <span>
//             {disabledArea === true ? (
//               <span className="font-bold text-sm">
//                 Logic Editor (return true or false)
//               </span>
//             ) : (
//               <span className="font-bold text-sm">Logic Editor</span>
//             )}
//           </span>

//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             {/* Status badge */}
//             {statusInfo && (
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "5px",
//                   padding: "4px 12px",
//                   borderRadius: "20px",
//                   backgroundColor: statusInfo.bgColor,
//                   fontSize: "12px",
//                   color: statusInfo.color,
//                   fontWeight: "600",
//                   border: `1px solid ${statusInfo.color}22`,
//                 }}
//               >
//                 <i className={statusInfo.icon} style={{ fontSize: "12px" }} />
//                 {statusInfo.text}
//               </div>
//             )}

//             {/* Run button */}
//             <Button
//               icon="pi pi-play"
//               label="Run"
//               size="small"
//               severity="success"
//               outlined
//               onClick={handleManualRun}
//               disabled={!textAreaValue}
//               tooltip="Execute expression (Ctrl+Enter)"
//               tooltipOptions={{ position: "bottom" }}
//               style={{ height: "30px", fontSize: "12px" }}
//             />
//           </div>
//         </div>

//         {/* Editor with suggestion popup */}
//         <div
//           ref={editorContainerRef}
//           style={{ position: "relative", marginTop: "0.75rem" }}
//         >
//           <InputTextarea
//             ref={textAreaRef}
//             value={textAreaValue}
//             placeholder={`Write conditional CSS logic here. Example:\n\nif({{fieldId}} > 100){\n  \`color: red;\n  font-weight: bold;\`\n} else {\n  \`color: green;\n  font-size: 16px;\`\n}\n\nCSS must be inside backticks (\`). Suggestions appear automatically.`}
//             onChange={handleTextChange}
//             onKeyDown={handleKeyDown}
//             onClick={handleClick}
//             onBlur={handleBlur}
//             rows={28}
//             style={{
//               minWidth: "100%",
//               resize: "none",
//               height: "470px",
//               fontFamily: "'Fira Code', Consolas, 'Courier New', monospace",
//               fontSize: "13px",
//               lineHeight: "18px",
//               tabSize: 2,
//               border:
//                 evaluationResult?.jsError
//                   ? "2px solid #fca5a5"
//                   : cssErrors.length > 0
//                   ? "2px solid #fca5a5"
//                   : evaluationResult?.success
//                   ? "2px solid #86efac"
//                   : undefined,
//               transition: "border-color 0.3s",
//             }}
//           />

//           {/* Suggestion popup */}
//           <SuggestionPopup
//             suggestions={suggestions}
//             onSelect={applySuggestion}
//             position={suggestionPosition}
//             visible={suggestionVisible}
//             selectedIndex={selectedSuggestionIndex}
//           />
//         </div>

//         {/* Keyboard shortcut hint */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginTop: "4px",
//             fontSize: "11px",
//             color: "#94a3b8",
//           }}
//         >
//           <span>
//             <kbd style={kbdStyle}>↑</kbd> <kbd style={kbdStyle}>↓</kbd> navigate
//             &nbsp;·&nbsp; <kbd style={kbdStyle}>Enter</kbd> /{" "}
//             <kbd style={kbdStyle}>Tab</kbd> accept &nbsp;·&nbsp;{" "}
//             <kbd style={kbdStyle}>Esc</kbd> dismiss
//           </span>
//           <span>
//             <kbd style={kbdStyle}>Ctrl</kbd>+<kbd style={kbdStyle}>Enter</kbd>{" "}
//             to run
//           </span>
//         </div>

//         {/* Diagnostics panel */}
//         <DiagnosticsPanel
//           jsError={evaluationResult?.jsError || null}
//           cssErrors={cssErrors}
//           cssWarnings={cssWarnings}
//         />

//         {/* Live preview */}
//         <LivePreviewPanel evaluationResult={evaluationResult} />
//       </div>
//     </div>
//   );
// };

// /** Small style for keyboard hint badges */
// const kbdStyle = {
//   display: "inline-block",
//   padding: "1px 5px",
//   fontSize: "10px",
//   fontFamily: "Consolas, monospace",
//   backgroundColor: "#f1f5f9",
//   border: "1px solid #cbd5e1",
//   borderRadius: "3px",
//   color: "#64748b",
// };

// export default PickListDemoWithCssEditor;

import React, { useState, useRef, useEffect, useCallback } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { ListBox } from "primereact/listbox";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import LocalVariablesTab from "./LocalVariablesTab";

// ═══════════════════════════════════════════════════════════════════════
// 1. CSS PROPERTIES DATABASE
// ═══════════════════════════════════════════════════════════════════════
const CSS_PROPERTIES = [
  { property: "color", values: ["red","blue","green","black","white","yellow","orange","purple","pink","gray","transparent","inherit","initial","#000","#fff","#333","#666","rgb(0,0,0)","currentColor"] },
  { property: "background-color", values: ["red","blue","green","black","white","yellow","orange","purple","pink","gray","transparent","inherit","initial","#f0f0f0","#fff","#000","rgb(255,255,255)"] },
  { property: "background", values: ["none","transparent","red","blue","#fff","#000","linear-gradient(to right, red, blue)","url()","inherit"] },
  { property: "font-size", values: ["10px","12px","14px","16px","18px","20px","24px","28px","32px","36px","48px","1em","1.5em","2em","0.875rem","1rem","1.25rem","1.5rem","2rem","small","medium","large","x-large","xx-large"] },
  { property: "font-weight", values: ["normal","bold","bolder","lighter","100","200","300","400","500","600","700","800","900"] },
  { property: "font-style", values: ["normal","italic","oblique"] },
  { property: "font-family", values: ["Arial, sans-serif","Helvetica, sans-serif","'Times New Roman', serif","Georgia, serif","Verdana, sans-serif","'Courier New', monospace","sans-serif","serif","monospace","cursive","system-ui"] },
  { property: "text-align", values: ["left","right","center","justify","start","end"] },
  { property: "text-decoration", values: ["none","underline","overline","line-through","underline dotted","underline wavy red"] },
  { property: "text-transform", values: ["none","uppercase","lowercase","capitalize"] },
  { property: "text-indent", values: ["0","1em","2em","20px","40px"] },
  { property: "line-height", values: ["normal","1","1.2","1.4","1.5","1.6","2","16px","20px","24px","28px"] },
  { property: "letter-spacing", values: ["normal","0.5px","1px","2px","3px","-0.5px","-1px","0.05em","0.1em"] },
  { property: "word-spacing", values: ["normal","1px","2px","4px","8px"] },
  { property: "margin", values: ["0","4px","8px","12px","16px","20px","24px","32px","auto","0 auto","8px 16px","16px 24px"] },
  { property: "margin-top", values: ["0","4px","8px","12px","16px","20px","24px","auto"] },
  { property: "margin-bottom", values: ["0","4px","8px","12px","16px","20px","24px","auto"] },
  { property: "margin-left", values: ["0","4px","8px","12px","16px","20px","24px","auto"] },
  { property: "margin-right", values: ["0","4px","8px","12px","16px","20px","24px","auto"] },
  { property: "padding", values: ["0","4px","8px","12px","16px","20px","24px","32px","8px 16px","16px 24px"] },
  { property: "padding-top", values: ["0","4px","8px","12px","16px","20px","24px"] },
  { property: "padding-bottom", values: ["0","4px","8px","12px","16px","20px","24px"] },
  { property: "padding-left", values: ["0","4px","8px","12px","16px","20px","24px"] },
  { property: "padding-right", values: ["0","4px","8px","12px","16px","20px","24px"] },
  { property: "border", values: ["none","1px solid black","1px solid gray","1px solid #ccc","2px solid black","1px dashed gray","1px dotted gray","2px dashed red","1px solid red","1px solid blue"] },
  { property: "border-radius", values: ["0","2px","4px","6px","8px","10px","12px","16px","20px","50%","9999px"] },
  { property: "border-color", values: ["black","gray","red","blue","green","#ccc","#ddd","transparent","inherit"] },
  { property: "border-width", values: ["0","1px","2px","3px","4px","thin","medium","thick"] },
  { property: "border-style", values: ["none","solid","dashed","dotted","double","groove","ridge","inset","outset"] },
  { property: "border-top", values: ["none","1px solid black","1px solid #ccc","2px solid red"] },
  { property: "border-bottom", values: ["none","1px solid black","1px solid #ccc","2px solid red"] },
  { property: "border-left", values: ["none","1px solid black","1px solid #ccc","2px solid red"] },
  { property: "border-right", values: ["none","1px solid black","1px solid #ccc","2px solid red"] },
  { property: "display", values: ["block","inline","inline-block","flex","inline-flex","grid","inline-grid","none","table","table-row","table-cell","contents"] },
  { property: "position", values: ["static","relative","absolute","fixed","sticky"] },
  { property: "top", values: ["0","4px","8px","16px","24px","50%","100%","auto"] },
  { property: "bottom", values: ["0","4px","8px","16px","24px","50%","auto"] },
  { property: "left", values: ["0","4px","8px","16px","24px","50%","100%","auto"] },
  { property: "right", values: ["0","4px","8px","16px","24px","50%","auto"] },
  { property: "width", values: ["auto","100%","50%","75%","25%","100px","200px","300px","400px","500px","fit-content","max-content","min-content","100vw"] },
  { property: "height", values: ["auto","100%","50%","100px","200px","300px","400px","500px","fit-content","100vh"] },
  { property: "max-width", values: ["none","100%","200px","300px","500px","800px","1200px"] },
  { property: "min-width", values: ["0","50px","100px","200px","300px","auto"] },
  { property: "max-height", values: ["none","100%","200px","300px","500px"] },
  { property: "min-height", values: ["0","50px","100px","200px","300px","auto"] },
  { property: "overflow", values: ["visible","hidden","scroll","auto","clip"] },
  { property: "overflow-x", values: ["visible","hidden","scroll","auto"] },
  { property: "overflow-y", values: ["visible","hidden","scroll","auto"] },
  { property: "opacity", values: ["0","0.1","0.2","0.3","0.4","0.5","0.6","0.7","0.8","0.9","1"] },
  { property: "z-index", values: ["auto","0","1","2","5","10","50","100","1000","9999","-1"] },
  { property: "cursor", values: ["auto","default","pointer","move","text","wait","help","crosshair","not-allowed","grab","grabbing"] },
  { property: "visibility", values: ["visible","hidden","collapse"] },
  { property: "box-shadow", values: ["none","0 1px 3px rgba(0,0,0,0.12)","0 2px 4px rgba(0,0,0,0.1)","0 4px 6px rgba(0,0,0,0.1)","0 4px 12px rgba(0,0,0,0.15)","0 8px 24px rgba(0,0,0,0.15)","inset 0 1px 3px rgba(0,0,0,0.12)"] },
  { property: "text-shadow", values: ["none","1px 1px 2px rgba(0,0,0,0.3)","2px 2px 4px rgba(0,0,0,0.3)"] },
  { property: "flex-direction", values: ["row","row-reverse","column","column-reverse"] },
  { property: "justify-content", values: ["flex-start","flex-end","center","space-between","space-around","space-evenly","start","end"] },
  { property: "align-items", values: ["stretch","flex-start","flex-end","center","baseline","start","end"] },
  { property: "align-self", values: ["auto","stretch","flex-start","flex-end","center","baseline"] },
  { property: "flex-wrap", values: ["nowrap","wrap","wrap-reverse"] },
  { property: "flex-grow", values: ["0","1","2","3"] },
  { property: "flex-shrink", values: ["0","1","2"] },
  { property: "flex-basis", values: ["auto","0","50%","100%","100px","200px","content"] },
  { property: "flex", values: ["0","1","auto","none","1 1 auto","0 0 auto","1 0 0"] },
  { property: "gap", values: ["0","2px","4px","8px","12px","16px","20px","24px","32px"] },
  { property: "row-gap", values: ["0","4px","8px","12px","16px","20px"] },
  { property: "column-gap", values: ["0","4px","8px","12px","16px","20px"] },
  { property: "white-space", values: ["normal","nowrap","pre","pre-wrap","pre-line","break-spaces"] },
  { property: "word-break", values: ["normal","break-all","keep-all","break-word"] },
  { property: "word-wrap", values: ["normal","break-word"] },
  { property: "text-overflow", values: ["clip","ellipsis"] },
  { property: "transform", values: ["none","rotate(45deg)","rotate(90deg)","scale(1.5)","scale(0.5)","translateX(10px)","translateY(10px)","translate(50%, 50%)"] },
  { property: "transition", values: ["none","all 0.3s ease","all 0.5s ease","all 0.2s ease-in-out","color 0.3s","background-color 0.3s","opacity 0.3s","transform 0.3s"] },
  { property: "outline", values: ["none","1px solid black","2px solid blue","1px dashed gray","2px solid red","0"] },
  { property: "list-style", values: ["none","disc","circle","square","decimal"] },
  { property: "float", values: ["none","left","right"] },
  { property: "clear", values: ["none","left","right","both"] },
  { property: "vertical-align", values: ["baseline","top","middle","bottom","text-top","text-bottom","sub","super"] },
  { property: "object-fit", values: ["fill","contain","cover","none","scale-down"] },
  { property: "pointer-events", values: ["auto","none"] },
  { property: "user-select", values: ["auto","none","text","all"] },
  { property: "resize", values: ["none","both","horizontal","vertical"] },
  { property: "box-sizing", values: ["content-box","border-box"] },
  { property: "filter", values: ["none","blur(4px)","brightness(0.5)","contrast(200%)","grayscale(100%)","saturate(200%)","sepia(100%)"] },
  { property: "backdrop-filter", values: ["none","blur(4px)","blur(10px)"] },
  { property: "grid-template-columns", values: ["none","1fr","repeat(2, 1fr)","repeat(3, 1fr)","repeat(4, 1fr)","200px 1fr"] },
  { property: "grid-template-rows", values: ["none","auto","1fr","repeat(2, 1fr)","100px auto"] },
  { property: "place-items", values: ["center","start","end","stretch"] },
  { property: "place-content", values: ["center","start","end","space-between","space-around"] },
];

const ALL_PROPERTY_NAMES = CSS_PROPERTIES.map((p) => p.property);

const UNITLESS_PROPERTIES = [
  "opacity","z-index","flex-grow","flex-shrink","flex","line-height",
  "font-weight","order","orphans","widows","columns","column-count",
  "fill-opacity","stroke-opacity","tab-size",
];

// ═══════════════════════════════════════════════════════════════════════
// 2. PLACEHOLDER HELPERS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Regex that matches all placeholder variants:
 *   {{_8_9}}  {{ _8_9 }}  { { _2_6 } }  {{lv_user.userID}}
 */
const PLACEHOLDER_REGEX = /\{\s*\{\s*([^{}]+?)\s*\}\s*\}/g;

/** Extract unique placeholders from code */
const extractPlaceholders = (code) => {
  if (!code) return [];
  const seen = new Map();
  let match;
  const regex = new RegExp(PLACEHOLDER_REGEX.source, "g");
  while ((match = regex.exec(code)) !== null) {
    const name = match[1].trim();
    if (!seen.has(name)) {
      seen.set(name, {
        name,
        originalMatches: new Set(),
      });
    }
    seen.get(name).originalMatches.add(match[0]);
  }
  return Array.from(seen.values());
};

/** Check if code contains any placeholders */
const hasPlaceholders = (code) => {
  if (!code) return false;
  return new RegExp(PLACEHOLDER_REGEX.source).test(code);
};

/** Replace all placeholders with user-provided values */
const replacePlaceholders = (code, valuesMap) => {
  let result = code;
  for (const [name, { value, type }] of Object.entries(valuesMap)) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Match any spacing variant of this placeholder
    const regex = new RegExp(
      `\\{\\s*\\{\\s*${escapedName}\\s*\\}\\s*\\}`,
      "g"
    );
    let replacement;
    switch (type) {
      case "number":
        replacement = isNaN(Number(value)) ? "0" : String(Number(value));
        break;
      case "boolean":
        replacement = value === "true" || value === "1" ? "true" : "false";
        break;
      case "string":
      default:
        replacement = `"${(value || "").replace(/"/g, '\\"')}"`;
        break;
    }
    result = result.replace(regex, replacement);
  }
  return result;
};

// ═══════════════════════════════════════════════════════════════════════
// 3. VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════════════

const extractCssBlocks = (code) => {
  const blocks = [];
  const regex = /`([^`]*)`/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    blocks.push({
      css: match[1],
      startIndex: match.index + 1,
      endIndex: match.index + match[1].length,
    });
  }
  return blocks;
};

const validateCssBlock = (cssText) => {
  const errors = [];
  const warnings = [];
  const parsedDeclarations = [];

  if (!cssText || cssText.trim().length === 0) {
    return { errors, warnings, parsedDeclarations };
  }

  const rawDeclarations = [];
  const lines = cssText.split("\n");
  let lineNumber = 0;

  for (const line of lines) {
    lineNumber++;
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const parts = trimmedLine.split(";");
    for (const part of parts) {
      const partTrimmed = part.trim();
      if (!partTrimmed) continue;
      rawDeclarations.push({ text: partTrimmed, line: lineNumber });
    }
  }

  for (const { text: decl, line } of rawDeclarations) {
    if (!decl.includes(":")) {
      errors.push({
        line,
        message: `Missing colon (:) — "${decl}" is not a valid CSS declaration`,
        text: decl,
      });
      continue;
    }

    const colonIdx = decl.indexOf(":");
    const property = decl.substring(0, colonIdx).trim().toLowerCase();
    let value = decl.substring(colonIdx + 1).trim().replace(/;+$/, "").trim();

    if (!property) {
      errors.push({ line, message: "Empty property name", text: decl });
      continue;
    }
    if (!value) {
      errors.push({
        line,
        message: `Missing value for property "${property}"`,
        text: decl,
      });
      continue;
    }

    const knownProp = CSS_PROPERTIES.find((p) => p.property === property);
    if (!knownProp) {
      if (
        !property.startsWith("-webkit-") &&
        !property.startsWith("-moz-") &&
        !property.startsWith("-ms-") &&
        !property.startsWith("-o-")
      ) {
        warnings.push({
          line,
          message: `Unknown CSS property: "${property}"`,
          text: decl,
        });
      }
    }

    if (property === "border") {
      const borderStyles = ["solid","dashed","dotted","double","groove","ridge","inset","outset","none","hidden"];
      const hasStyle = borderStyles.some((s) => value.toLowerCase().includes(s));
      if (!hasStyle && value !== "none" && value !== "0") {
        warnings.push({
          line,
          message: `"border: ${value}" — missing border-style. Try "border: ${value} solid"`,
          text: decl,
        });
      }
    }

    if (
      !UNITLESS_PROPERTIES.includes(property) &&
      /^\d+(\.\d+)?$/.test(value) &&
      value !== "0"
    ) {
      warnings.push({
        line,
        message: `"${property}: ${value}" — value without units. Did you mean "${value}px"?`,
        text: decl,
      });
    }

    const existingIdx = parsedDeclarations.findIndex((d) => d.property === property);
    if (existingIdx !== -1) {
      warnings.push({
        line,
        message: `Duplicate property "${property}" — later value overrides earlier`,
        text: decl,
      });
    }

    parsedDeclarations.push({ property, value, line });
  }

  return { errors, warnings, parsedDeclarations };
};

const cssDeclarationsToStyleObject = (declarations) => {
  const style = {};
  for (const { property, value } of declarations) {
    const camelCase = property.replace(/-([a-z])/g, (_, l) => l.toUpperCase());
    style[camelCase] = value;
  }
  return style;
};

// ═══════════════════════════════════════════════════════════════════════
// 4. EXPRESSION EVALUATOR
// ═══════════════════════════════════════════════════════════════════════

/**
 * Evaluates code that has already had placeholders replaced with actual values.
 * Wraps backtick template literals with a capture function.
 */
const evaluateCode = (processedCode) => {
  const backtickCount = (processedCode.match(/`/g) || []).length;
  if (backtickCount % 2 !== 0) {
    return {
      success: false,
      results: [],
      jsError: "Unclosed template literal (backtick). Ensure all ` are properly paired.",
      rawOutput: null,
    };
  }
  if (backtickCount === 0) {
    return {
      success: false,
      results: [],
      jsError: "No CSS blocks found. Wrap CSS in backticks (`).",
      rawOutput: null,
    };
  }

  try {
    const results = [];
    const captureCSS = (val) => {
      results.push(val);
      return val;
    };

    const transformedCode = processedCode.replace(
      /`([\s\S]*?)`/g,
      "__captureCSS__(`$1`)"
    );

    const fn = new Function("__captureCSS__", transformedCode);
    fn(captureCSS);

    if (results.length > 0) {
      return {
        success: true,
        results,
        jsError: null,
        rawOutput: results[results.length - 1],
      };
    }

    return {
      success: false,
      results: [],
      jsError: "Expression executed but no CSS block was reached. Check your conditions.",
      rawOutput: null,
    };
  } catch (e) {
    return {
      success: false,
      results: [],
      jsError: e.message,
      rawOutput: null,
    };
  }
};

// ═══════════════════════════════════════════════════════════════════════
// 5. SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

/* ─── Suggestion Popup ─── */
const SuggestionPopup = ({ suggestions, onSelect, position, visible, selectedIndex }) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const items = listRef.current.querySelectorAll("li");
      if (items[selectedIndex]) {
        items[selectedIndex].scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!visible || suggestions.length === 0) return null;

  return (
    <div
      ref={listRef}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        zIndex: 9999,
        backgroundColor: "#fff",
        border: "1px solid #d0d7de",
        borderRadius: "8px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
        maxHeight: "220px",
        overflowY: "auto",
        minWidth: "240px",
        maxWidth: "380px",
      }}
    >
      <ul style={{ listStyle: "none", margin: 0, padding: "4px 0" }}>
        {suggestions.map((s, idx) => (
          <li
            key={idx}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(s);
            }}
            style={{
              padding: "6px 14px",
              cursor: "pointer",
              backgroundColor: idx === selectedIndex ? "#dbeafe" : "transparent",
              fontSize: "13px",
              fontFamily: "'Fira Code', Consolas, monospace",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              transition: "background-color 0.1s",
            }}
            onMouseEnter={(e) => {
              if (idx !== selectedIndex) e.currentTarget.style.backgroundColor = "#f6f8fa";
            }}
            onMouseLeave={(e) => {
              if (idx !== selectedIndex) e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "20px",
                height: "20px",
                borderRadius: "4px",
                backgroundColor: s.type === "property" ? "#dbeafe" : "#dcfce7",
                color: s.type === "property" ? "#2563eb" : "#16a34a",
                fontSize: "10px",
                fontWeight: "bold",
                flexShrink: 0,
              }}
            >
              {s.type === "property" ? "P" : "V"}
            </span>
            <span style={{ flex: 1 }}>{s.label}</span>
            <span style={{ fontSize: "10px", color: "#9ca3af" }}>{s.type}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ─── Diagnostics Panel ─── */
const DiagnosticsPanel = ({ jsError, cssErrors, cssWarnings }) => {
  const hasContent = jsError || cssErrors.length > 0 || cssWarnings.length > 0;
  if (!hasContent) return null;

  return (
    <div
      style={{
        marginTop: "10px",
        maxHeight: "150px",
        overflowY: "auto",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        fontSize: "12px",
        fontFamily: "'Fira Code', Consolas, monospace",
      }}
    >
      {jsError && (
        <div
          style={{
            padding: "8px 14px",
            backgroundColor: "#fef2f2",
            color: "#991b1b",
            borderBottom: "1px solid #fecaca",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <i className="pi pi-times-circle" style={{ fontSize: "14px", marginTop: "1px", flexShrink: 0 }} />
          <div><strong>JavaScript Error:</strong> {jsError}</div>
        </div>
      )}
      {cssErrors.map((err, idx) => (
        <div
          key={`cerr-${idx}`}
          style={{
            padding: "6px 14px",
            backgroundColor: "#fff1f2",
            color: "#be123c",
            borderBottom: "1px solid #fecdd3",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <i className="pi pi-times-circle" style={{ fontSize: "13px", marginTop: "1px", flexShrink: 0 }} />
          <span>
            <strong>CSS Block {err.blockIndex} Line {err.line}:</strong> {err.message}
          </span>
        </div>
      ))}
      {cssWarnings.map((warn, idx) => (
        <div
          key={`cwarn-${idx}`}
          style={{
            padding: "6px 14px",
            backgroundColor: "#fffbeb",
            color: "#92400e",
            borderBottom: "1px solid #fde68a",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <i className="pi pi-exclamation-triangle" style={{ fontSize: "13px", marginTop: "1px", flexShrink: 0 }} />
          <span>
            <strong>CSS Block {warn.blockIndex} Line {warn.line}:</strong> {warn.message}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ─── Live Preview Panel ─── */
const LivePreviewPanel = ({ evaluationResult, submittedValues }) => {
  if (!evaluationResult || !evaluationResult.success || evaluationResult.results.length === 0) {
    return null;
  }

  const cssText = evaluationResult.results[evaluationResult.results.length - 1];
  const { parsedDeclarations } = validateCssBlock(cssText);
  const styleObj = cssDeclarationsToStyleObject(parsedDeclarations);

  // Build the values used summary
  const valuesUsed = submittedValues
    ? Object.entries(submittedValues).map(([name, { value, type }]) => ({
        name,
        value,
        type,
      }))
    : [];

  return (
    <div
      style={{
        marginTop: "12px",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 16px",
          backgroundColor: "#f0fdf4",
          borderBottom: "1px solid #bbf7d0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#166534",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="pi pi-check-circle" style={{ fontSize: "16px" }} />
          Expression Evaluated Successfully
        </div>
        {evaluationResult.results.length > 1 && (
          <Tag
            value={`${evaluationResult.results.length} block(s) executed`}
            severity="success"
            style={{ fontSize: "11px" }}
          />
        )}
      </div>

      {/* Values Used */}
      {valuesUsed.length > 0 && (
        <div
          style={{
            padding: "10px 16px",
            backgroundColor: "#f8fafc",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontWeight: "600",
            }}
          >
            Placeholder Values Used
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {valuesUsed.map((v, i) => (
              <div
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  backgroundColor: "#eef2ff",
                  border: "1px solid #c7d2fe",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
              >
                <span style={{ color: "#6366f1", fontWeight: "600" }}>
                  {`{{${v.name}}}`}
                </span>
                <span style={{ color: "#94a3b8" }}>=</span>
                <span style={{ color: "#0f172a" }}>{v.value}</span>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                    backgroundColor: "#f1f5f9",
                    padding: "1px 5px",
                    borderRadius: "3px",
                  }}
                >
                  {v.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex" }}>
        {/* CSS Output */}
        <div style={{ flex: 1, padding: "14px 16px", borderRight: "1px solid #e5e7eb" }}>
          <div
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontWeight: "600",
            }}
          >
            Resulting CSS
          </div>
          <div
            style={{
              fontFamily: "'Fira Code', Consolas, monospace",
              fontSize: "12px",
              lineHeight: "1.8",
              backgroundColor: "#f1f5f9",
              padding: "10px 14px",
              borderRadius: "6px",
              color: "#334155",
            }}
          >
            {parsedDeclarations.map((d, i) => (
              <div key={i}>
                <span style={{ color: "#7c3aed" }}>{d.property}</span>
                <span style={{ color: "#64748b" }}>: </span>
                <span style={{ color: "#059669" }}>{d.value}</span>
                <span style={{ color: "#94a3b8" }}>;</span>
              </div>
            ))}
            {parsedDeclarations.length === 0 && (
              <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
                No valid CSS declarations
              </span>
            )}
          </div>
        </div>

        {/* Preview */}
        <div style={{ flex: 1, padding: "14px 16px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontWeight: "600",
            }}
          >
            Sample Text Preview
          </div>
          <div
            style={{
              backgroundColor: "#fff",
              border: "2px dashed #e2e8f0",
              borderRadius: "8px",
              padding: "28px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "90px",
            }}
          >
            <span style={styleObj}>Sample Text</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Placeholder Values Dialog ─── */
const PlaceholderDialog = ({
  visible,
  placeholders,
  placeholderValues,
  onValueChange,
  onTypeChange,
  onSubmit,
  onCancel,
}) => {
  const typeOptions = [
    { label: "Number", value: "number" },
    { label: "String", value: "string" },
    { label: "Boolean", value: "boolean" },
  ];

  const booleanOptions = [
    { label: "true", value: "true" },
    { label: "false", value: "false" },
  ];

  const allFilled = placeholders.every((p) => {
    const v = placeholderValues[p.name];
    return v && v.value !== undefined && v.value !== "";
  });

  const footer = (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
      <Button
        label="Cancel"
        icon="pi pi-times"
        severity="secondary"
        outlined
        onClick={onCancel}
      />
      <Button
        label="Run Expression"
        icon="pi pi-play"
        severity="success"
        onClick={onSubmit}
        disabled={!allFilled}
      />
    </div>
  );

  return (
    <Dialog
      header={
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <i
            className="pi pi-code"
            style={{
              fontSize: "20px",
              color: "#6366f1",
              backgroundColor: "#eef2ff",
              padding: "8px",
              borderRadius: "8px",
            }}
          />
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>
              Provide Placeholder Values
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "400", marginTop: "2px" }}>
              Your expression contains {placeholders.length} placeholder
              {placeholders.length > 1 ? "s" : ""} that need values to evaluate
            </div>
          </div>
        </div>
      }
      visible={visible}
      style={{ width: "560px" }}
      modal
      footer={footer}
      onHide={onCancel}
      draggable={false}
      resizable={false}
      closable
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "8px 0" }}>
        {placeholders.map((placeholder, idx) => {
          const currentVal = placeholderValues[placeholder.name] || {
            value: "",
            type: "number",
          };

          return (
            <div
              key={idx}
              style={{
                padding: "14px 16px",
                borderRadius: "10px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              {/* Placeholder Name */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    backgroundColor: "#eef2ff",
                    border: "1px solid #c7d2fe",
                    fontFamily: "monospace",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#4f46e5",
                  }}
                >
                  <i className="pi pi-hashtag" style={{ fontSize: "11px" }} />
                  {`{{${placeholder.name}}}`}
                </div>

                {/* All original match variants */}
                {placeholder.originalMatches.size > 1 && (
                  <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                    {placeholder.originalMatches.size} occurrences
                  </span>
                )}
              </div>

              {/* Type + Value Row */}
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
                {/* Type selector */}
                <div style={{ flex: "0 0 130px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#64748b",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Type
                  </label>
                  <Dropdown
                    value={currentVal.type}
                    options={typeOptions}
                    onChange={(e) => onTypeChange(placeholder.name, e.value)}
                    style={{ width: "100%" }}
                    className="p-inputtext-sm"
                  />
                </div>

                {/* Value input */}
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#64748b",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Value
                  </label>
                  {currentVal.type === "boolean" ? (
                    <Dropdown
                      value={currentVal.value || "true"}
                      options={booleanOptions}
                      onChange={(e) => onValueChange(placeholder.name, e.value)}
                      style={{ width: "100%" }}
                      className="p-inputtext-sm"
                    />
                  ) : (
                    <InputText
                      value={currentVal.value || ""}
                      onChange={(e) =>
                        onValueChange(placeholder.name, e.target.value)
                      }
                      placeholder={
                        currentVal.type === "number"
                          ? "e.g. 42"
                          : 'e.g. hello'
                      }
                      style={{ width: "100%" }}
                      className="p-inputtext-sm"
                      keyfilter={currentVal.type === "number" ? /[\d.\-]/ : null}
                    />
                  )}
                </div>
              </div>

              {/* Preview of replacement */}
              {currentVal.value && (
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "11px",
                    color: "#64748b",
                    fontFamily: "monospace",
                    backgroundColor: "#f1f5f9",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  <span style={{ color: "#94a3b8" }}>will replace as → </span>
                  <span style={{ color: "#059669", fontWeight: "600" }}>
                    {currentVal.type === "string"
                      ? `"${currentVal.value}"`
                      : currentVal.value}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Dialog>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// 6. MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

const PickListDemoWithCssEditor = ({
  data,
  textAreaValue,
  setTextAreaValue,
  depData,
  disabledArea,
}) => {
  const textAreaRef = useRef(null);
  const editorContainerRef = useRef(null);

  // ── Suggestion state ─────────────────────────────────────────────
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionVisible, setSuggestionVisible] = useState(false);
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [suggestionContext, setSuggestionContext] = useState(null);

  // ── Evaluation state ─────────────────────────────────────────────
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [submittedValues, setSubmittedValues] = useState(null);

  // ── Validation state ─────────────────────────────────────────────
  const [cssErrors, setCssErrors] = useState([]);
  const [cssWarnings, setCssWarnings] = useState([]);
  const [jsCheckError, setJsCheckError] = useState(null);

  // ── Placeholder dialog state ─────────────────────────────────────
  const [showPlaceholderDialog, setShowPlaceholderDialog] = useState(false);
  const [detectedPlaceholders, setDetectedPlaceholders] = useState([]);
  const [placeholderValues, setPlaceholderValues] = useState({});

  // ═══════════════════════════════════════════════════════════════════
  // EXISTING FUNCTIONALITY — UNCHANGED
  // ═══════════════════════════════════════════════════════════════════

  let listBoxData = null;
  if (data) {
    listBoxData = data
      .flatMap((item) => item.cellInfo)
      .map((cell) => ({
        label: `${cell.aliasId} (${cell.cellId})`,
        value: cell.cellId,
      }));
  } else {
    listBoxData = depData?.map((item) => ({
      label: `${item.aliasId} (${item.cellId})`,
      value: item.cellId,
    }));
  }

  const handleLabelClick = (value) => {
    console.log("My Value : ", value);
    value = ` {{${value}}} `;
    const { selectionStart, selectionEnd } = textAreaRef?.current;
    console.log("My TextArea Value : ", textAreaValue);
    if (textAreaValue === null) {
      setTextAreaValue(value);
    } else {
      const newValue =
        textAreaValue.slice(0, selectionStart) +
        value +
        textAreaValue.slice(selectionEnd);
      setTextAreaValue(newValue);
      setTimeout(() => {
        textAreaRef.current.setSelectionRange(
          selectionStart + value.length,
          selectionStart + value.length
        );
        textAreaRef.current.focus();
      }, 0);
    }
  };

  // ═══════════════════════════════════════════════════════════════════
  // CSS SUGGESTION INTELLIGENCE
  // ═══════════════════════════════════════════════════════════════════

  const isCursorInsideCssBlock = useCallback((text, cursorPos) => {
    let inside = false;
    let blockStart = -1;
    for (let i = 0; i < text.length && i < cursorPos; i++) {
      if (text[i] === "`") {
        inside = !inside;
        if (inside) blockStart = i;
      }
    }
    return inside ? { inside: true, blockStart: blockStart + 1 } : { inside: false, blockStart: -1 };
  }, []);

  const computeSuggestionContext = useCallback(
    (text, cursorPos) => {
      const { inside, blockStart } = isCursorInsideCssBlock(text, cursorPos);
      if (!inside) return null;

      const cssBeforeCursor = text.substring(blockStart, cursorPos);
      const lines = cssBeforeCursor.split("\n");
      const currentLine = lines[lines.length - 1];
      const trimmedLine = currentLine.trimStart();

      const colonIndex = trimmedLine.indexOf(":");
      if (colonIndex !== -1) {
        const propertyPart = trimmedLine.substring(0, colonIndex).trim().toLowerCase();
        const valuePart = trimmedLine.substring(colonIndex + 1).trim().replace(/;$/, "");
        const lineStartInText = cursorPos - currentLine.length;
        const valueStartInLine = currentLine.indexOf(":") + 1;
        const leadingSpaces =
          currentLine.substring(valueStartInLine).length -
          currentLine.substring(valueStartInLine).trimStart().length;
        return {
          type: "value",
          property: propertyPart,
          currentInput: valuePart,
          replaceStart: lineStartInText + valueStartInLine + leadingSpaces,
          replaceEnd: cursorPos,
        };
      }

      const lineStartInText = cursorPos - currentLine.length;
      const leadingSpaces = currentLine.length - currentLine.trimStart().length;
      return {
        type: "property",
        currentInput: trimmedLine.replace(/;$/, ""),
        replaceStart: lineStartInText + leadingSpaces,
        replaceEnd: cursorPos,
      };
    },
    [isCursorInsideCssBlock]
  );

  const getSuggestions = useCallback((context) => {
    if (!context) return [];
    if (context.type === "property") {
      const input = context.currentInput.toLowerCase();
      if (input.length === 0) {
        return ALL_PROPERTY_NAMES.slice(0, 20).map((p) => ({
          label: p, value: p + ": ", type: "property",
        }));
      }
      return ALL_PROPERTY_NAMES
        .filter((p) => p.startsWith(input) || p.includes(input))
        .slice(0, 15)
        .map((p) => ({ label: p, value: p + ": ", type: "property" }));
    }
    if (context.type === "value") {
      const prop = CSS_PROPERTIES.find((p) => p.property === context.property);
      if (!prop) return [];
      const input = context.currentInput.toLowerCase();
      return prop.values
        .filter((v) => v.toLowerCase().startsWith(input) || (input.length > 0 && v.toLowerCase().includes(input)))
        .slice(0, 15)
        .map((v) => ({ label: v, value: v + ";", type: "value" }));
    }
    return [];
  }, []);

  const estimateCursorPosition = useCallback(() => {
    const textarea = textAreaRef.current;
    if (!textarea) return { top: 0, left: 0 };
    const text = textAreaValue || "";
    const beforeCursor = text.substring(0, textarea.selectionStart);
    const lines = beforeCursor.split("\n");
    return {
      top: Math.max(lines.length * 18 - textarea.scrollTop + 22, 20),
      left: Math.min(Math.max(lines[lines.length - 1].length * 7.8, 10), 400),
    };
  }, [textAreaValue]);

  const applySuggestion = useCallback(
    (suggestion) => {
      if (!suggestionContext) return;
      const { replaceStart, replaceEnd } = suggestionContext;
      const text = textAreaValue || "";
      const newValue = text.substring(0, replaceStart) + suggestion.value + text.substring(replaceEnd);
      setTextAreaValue(newValue);
      const newCursorPos = replaceStart + suggestion.value.length;
      setSuggestionVisible(false);
      setSuggestions([]);
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          textAreaRef.current.focus();
        }
      }, 0);
    },
    [suggestionContext, textAreaValue, setTextAreaValue]
  );

  const triggerSuggestions = useCallback(
    (text, cursorPos) => {
      const ctx = computeSuggestionContext(text, cursorPos);
      setSuggestionContext(ctx);
      const newSuggestions = getSuggestions(ctx);
      setSuggestions(newSuggestions);
      setSelectedSuggestionIndex(0);
      setSuggestionVisible(newSuggestions.length > 0);
      if (newSuggestions.length > 0) {
        setSuggestionPosition(estimateCursorPosition());
      }
    },
    [computeSuggestionContext, getSuggestions, estimateCursorPosition]
  );

  // ═══════════════════════════════════════════════════════════════════
  // AUTO-VALIDATION (CSS only — runs on every text change)
  // ═══════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!textAreaValue) {
      setCssErrors([]);
      setCssWarnings([]);
      setJsCheckError(null);
      setEvaluationResult(null);
      setSubmittedValues(null);
      return;
    }

    const timer = setTimeout(() => {
      // Validate CSS blocks
      const blocks = extractCssBlocks(textAreaValue);
      const allErrors = [];
      const allWarnings = [];
      blocks.forEach((block, idx) => {
        const { errors, warnings } = validateCssBlock(block.css);
        errors.forEach((e) => allErrors.push({ ...e, blockIndex: idx + 1 }));
        warnings.forEach((w) => allWarnings.push({ ...w, blockIndex: idx + 1 }));
      });
      setCssErrors(allErrors);
      setCssWarnings(allWarnings);

      // Quick JS syntax check (replace placeholders with dummy values)
      if (blocks.length > 0) {
        const hasPH = hasPlaceholders(textAreaValue);
        let testCode = textAreaValue;
        if (hasPH) {
          // Replace all placeholders with 0 just for syntax checking
          testCode = testCode.replace(
            new RegExp(PLACEHOLDER_REGEX.source, "g"),
            "0"
          );
        }

        const backtickCount = (testCode.match(/`/g) || []).length;
        if (backtickCount % 2 !== 0) {
          setJsCheckError("Unclosed backtick (`) detected");
        } else {
          try {
            const transformed = testCode.replace(/`([\s\S]*?)`/g, "__c__(`$1`)");
            new Function("__c__", transformed);
            setJsCheckError(null);
          } catch (e) {
            setJsCheckError(e.message);
          }
        }

        // If no placeholders and no errors, auto-evaluate
        if (!hasPH && allErrors.length === 0) {
          const result = evaluateCode(testCode);
          setEvaluationResult(result);
          setSubmittedValues(null);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [textAreaValue]);

  // ═══════════════════════════════════════════════════════════════════
  // RUN BUTTON HANDLER
  // ═══════════════════════════════════════════════════════════════════

  const handleRunClick = useCallback(() => {
    if (!textAreaValue) return;

    const phs = extractPlaceholders(textAreaValue);

    if (phs.length === 0) {
      // No placeholders → evaluate directly
      const result = evaluateCode(textAreaValue);
      setEvaluationResult(result);
      setSubmittedValues(null);
    } else {
      // Has placeholders → open dialog
      setDetectedPlaceholders(phs);

      // Preserve previously entered values
      const newValues = { ...placeholderValues };
      phs.forEach((ph) => {
        if (!newValues[ph.name]) {
          newValues[ph.name] = { value: "", type: "number" };
        }
      });
      // Remove values for placeholders that no longer exist
      Object.keys(newValues).forEach((key) => {
        if (!phs.find((ph) => ph.name === key)) {
          delete newValues[key];
        }
      });
      setPlaceholderValues(newValues);
      setShowPlaceholderDialog(true);
    }
  }, [textAreaValue, placeholderValues]);

  const handlePlaceholderValueChange = useCallback((name, value) => {
    setPlaceholderValues((prev) => ({
      ...prev,
      [name]: { ...prev[name], value },
    }));
  }, []);

  const handlePlaceholderTypeChange = useCallback((name, type) => {
    setPlaceholderValues((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        type,
        // Reset value when switching to boolean
        value: type === "boolean" ? "true" : prev[name]?.value || "",
      },
    }));
  }, []);

  const handlePlaceholderSubmit = useCallback(() => {
    setShowPlaceholderDialog(false);

    // Replace placeholders with actual values
    const processedCode = replacePlaceholders(textAreaValue, placeholderValues);

    // Evaluate
    const result = evaluateCode(processedCode);
    setEvaluationResult(result);
    setSubmittedValues({ ...placeholderValues });
  }, [textAreaValue, placeholderValues]);

  const handlePlaceholderCancel = useCallback(() => {
    setShowPlaceholderDialog(false);
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  // TEXT AREA EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════════════

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setTextAreaValue(newValue);
    // Clear previous evaluation when code changes
    setEvaluationResult(null);
    setSubmittedValues(null);

    setTimeout(() => {
      triggerSuggestions(newValue, e.target.selectionStart);
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (suggestionVisible && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => Math.max(prev - 1, 0));
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        applySuggestion(suggestions[selectedSuggestionIndex]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setSuggestionVisible(false);
        return;
      }
    }

    // Ctrl+Enter = run
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleRunClick();
    }
  };

  const handleClick = () => {
    setTimeout(() => {
      if (!textAreaRef.current || !textAreaValue) return;
      triggerSuggestions(textAreaValue, textAreaRef.current.selectionStart);
    }, 0);
  };

  const handleBlur = () => {
    setTimeout(() => setSuggestionVisible(false), 200);
  };

  // ═══════════════════════════════════════════════════════════════════
  // STATUS INDICATOR
  // ═══════════════════════════════════════════════════════════════════

  const getStatusInfo = () => {
    if (!textAreaValue) return null;
    const blocks = extractCssBlocks(textAreaValue);
    if (blocks.length === 0) return null;

    const hasPH = hasPlaceholders(textAreaValue);

    if (jsCheckError) {
      return { icon: "pi pi-times-circle", color: "#dc2626", bgColor: "#fef2f2", text: "JS Error" };
    }
    if (cssErrors.length > 0) {
      return { icon: "pi pi-times-circle", color: "#dc2626", bgColor: "#fef2f2", text: `${cssErrors.length} CSS error(s)` };
    }
    if (cssWarnings.length > 0 && !hasPH && evaluationResult?.success) {
      return { icon: "pi pi-exclamation-triangle", color: "#d97706", bgColor: "#fffbeb", text: `Valid with ${cssWarnings.length} warning(s)` };
    }
    if (cssWarnings.length > 0) {
      return { icon: "pi pi-exclamation-triangle", color: "#d97706", bgColor: "#fffbeb", text: `${cssWarnings.length} warning(s)` };
    }
    if (hasPH) {
      const phCount = extractPlaceholders(textAreaValue).length;
      return {
        icon: "pi pi-hashtag",
        color: "#6366f1",
        bgColor: "#eef2ff",
        text: `${phCount} placeholder${phCount > 1 ? "s" : ""} — click Run`,
      };
    }
    if (evaluationResult?.success) {
      return { icon: "pi pi-check-circle", color: "#16a34a", bgColor: "#f0fdf4", text: "Valid ✓" };
    }
    return null;
  };

  const statusInfo = getStatusInfo();
  const hasPH = hasPlaceholders(textAreaValue);

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {/* ─── LEFT PANEL (existing — unchanged) ─── */}
      <div>
        <span className="font-bold text-sm">
          Click on dependent/local fields to add in the Editor
        </span>

        <LocalVariablesTab handleLabelClick={handleLabelClick} />

        {depData?.length !== 0 && (
          <ListBox
            listStyle={{ height: "398px", width: "300px" }}
            style={{ marginTop: "1rem" }}
            options={listBoxData}
            filter
            filterPlaceholder="Search..."
            className="ListBoxStyle newlistboxStyleforgap"
            onChange={(e) => handleLabelClick(e.value)}
            itemTemplate={(option) => (
              <div
                style={{
                  cursor: "pointer",
                  padding: "11px",
                  backgroundColor: "#e0f7fa",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: "6px",
                  marginBottom: "1px",
                }}
              >
                <span>{option.label}</span>
                <i className="pi pi-angle-right" style={{ fontSize: "16px" }} />
              </div>
            )}
          />
        )}
      </div>

      <Divider layout="vertical" />

      {/* ─── RIGHT PANEL ─── */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <span>
            {disabledArea === true ? (
              <span className="font-bold text-sm">Logic Editor (return true or false)</span>
            ) : (
              <span className="font-bold text-sm">Logic Editor</span>
            )}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {statusInfo && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  backgroundColor: statusInfo.bgColor,
                  fontSize: "12px",
                  color: statusInfo.color,
                  fontWeight: "600",
                  border: `1px solid ${statusInfo.color}22`,
                }}
              >
                <i className={statusInfo.icon} style={{ fontSize: "12px" }} />
                {statusInfo.text}
              </div>
            )}

            <Button
              icon="pi pi-play"
              label={hasPH ? "Run with Values" : "Run"}
              size="small"
              severity="success"
              outlined
              onClick={handleRunClick}
              disabled={!textAreaValue}
              tooltip="Execute expression (Ctrl+Enter)"
              tooltipOptions={{ position: "bottom" }}
              style={{ height: "30px", fontSize: "12px" }}
            />
          </div>
        </div>

        {/* Placeholder info bar */}
        {hasPH && !showPlaceholderDialog && (
          <div
            style={{
              marginTop: "8px",
              padding: "8px 14px",
              backgroundColor: "#eef2ff",
              border: "1px solid #c7d2fe",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#4338ca",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <i className="pi pi-info-circle" style={{ fontSize: "14px" }} />
            <div style={{ flex: 1 }}>
              <strong>Placeholders detected:</strong>{" "}
              {extractPlaceholders(textAreaValue)
                .map((p) => `{{${p.name}}}`)
                .join(", ")}
              {" — "}
              Click <strong>"Run with Values"</strong> to provide test values and evaluate.
            </div>
          </div>
        )}

        {/* Editor with suggestion popup */}
        <div ref={editorContainerRef} style={{ position: "relative", marginTop: "0.75rem" }}>
          <InputTextarea
            ref={textAreaRef}
            value={textAreaValue}
            placeholder={`Write conditional CSS logic. Example:\n\nif({{_8_9}} > 100){\n  \`color: red;\n  font-weight: bold;\`\n} else {\n  \`color: green;\n  font-size: 16px;\`\n}\n\nPlaceholders: {{fieldId}}, {{ fieldId }}, { { fieldId } }\nCSS must be inside backticks (\`).\nSuggestions appear automatically inside backticks.`}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            onBlur={handleBlur}
            rows={28}
            style={{
              minWidth: "100%",
              resize: "none",
              height: "470px",
              fontFamily: "'Fira Code', Consolas, 'Courier New', monospace",
              fontSize: "13px",
              lineHeight: "18px",
              tabSize: 2,
              border:
                jsCheckError || cssErrors.length > 0
                  ? "2px solid #fca5a5"
                  : evaluationResult?.success
                  ? "2px solid #86efac"
                  : hasPH && cssErrors.length === 0 && !jsCheckError
                  ? "2px solid #a5b4fc"
                  : undefined,
              transition: "border-color 0.3s",
            }}
          />

          <SuggestionPopup
            suggestions={suggestions}
            onSelect={applySuggestion}
            position={suggestionPosition}
            visible={suggestionVisible}
            selectedIndex={selectedSuggestionIndex}
          />
        </div>

        {/* Keyboard shortcut hints */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "4px",
            fontSize: "11px",
            color: "#94a3b8",
          }}
        >
          <span>
            <kbd style={kbdStyle}>↑</kbd> <kbd style={kbdStyle}>↓</kbd> navigate
            &nbsp;·&nbsp; <kbd style={kbdStyle}>Enter</kbd> / <kbd style={kbdStyle}>Tab</kbd> accept
            &nbsp;·&nbsp; <kbd style={kbdStyle}>Esc</kbd> dismiss
          </span>
          <span>
            <kbd style={kbdStyle}>Ctrl</kbd>+<kbd style={kbdStyle}>Enter</kbd> to run
          </span>
        </div>

        {/* Diagnostics panel */}
        <DiagnosticsPanel
          jsError={jsCheckError || (evaluationResult?.jsError ?? null)}
          cssErrors={cssErrors}
          cssWarnings={cssWarnings}
        />

        {/* Live preview */}
        <LivePreviewPanel
          evaluationResult={evaluationResult}
          submittedValues={submittedValues}
        />
      </div>

      {/* ─── Placeholder Values Dialog ─── */}
      <PlaceholderDialog
        visible={showPlaceholderDialog}
        placeholders={detectedPlaceholders}
        placeholderValues={placeholderValues}
        onValueChange={handlePlaceholderValueChange}
        onTypeChange={handlePlaceholderTypeChange}
        onSubmit={handlePlaceholderSubmit}
        onCancel={handlePlaceholderCancel}
      />
    </div>
  );
};

const kbdStyle = {
  display: "inline-block",
  padding: "1px 5px",
  fontSize: "10px",
  fontFamily: "Consolas, monospace",
  backgroundColor: "#f1f5f9",
  border: "1px solid #cbd5e1",
  borderRadius: "3px",
  color: "#64748b",
};

export default PickListDemoWithCssEditor;