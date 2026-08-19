import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { SketchPicker } from "react-color";

// Helper: Parse CSS string to JS object
function parseCssString(cssString) {
  const style = {};
  cssString?.split(";").forEach((rule) => {
    const [prop, val] = rule.split(":").map((s) => s && s.trim());
    if (prop && val) {
      const camelProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      style[camelProp] = val;
    }
  });
  return style;
}

const textAlignOptions = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
];

const fontWeightOptions = [
  { label: "Normal", value: "normal" },
  { label: "Bold", value: "bold" },
];

const borderStyleOptions = [
  { label: "None", value: "none" },
  { label: "Solid", value: "solid" },
  { label: "Dashed", value: "dashed" },
  { label: "Dotted", value: "dotted" },
];

// Removed width and height from defaults
const defaultCss = {
  textAlign: "left",
  fontSize: "14px",
  fontWeight: "normal",
  color: "#000000",
  backgroundColor: "#ffffff",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "#cccccc",
  padding: "4px",
};

export default function CellCssBuilder({ value, onChange }) {
  // --- CSS object state ----------------------------------------------------
  const [css, setCss] = useState(() => {
    if (value) {
      const parsed = parseCssString(value);
      return { ...defaultCss, ...parsed };
    }
    return defaultCss;
  });

  // --- string representation ----------------------------------------------
  // Construct string conditionally to avoid "width: undefined"
  let baseString = `
    text-align: ${css.textAlign};
    font-size: ${css.fontSize};
    font-weight: ${css.fontWeight};
    color: ${css.color};
    background-color: ${css.backgroundColor};
    border: ${css.borderWidth} ${css.borderStyle} ${css.borderColor};
    padding: ${css.padding};
  `;

  // Only add width/height if they exist in state (user typed them)
  if (css.width) baseString += ` width: ${css.width};`;
  if (css.height) baseString += ` height: ${css.height};`;

  const cssString = baseString.replace(/\s+/g, " ").trim();

  // fire upwards
  useEffect(() => onChange(cssString), [cssString, onChange]); // Changed dependency to cssString to match generation

  // --- text area state (two-way binding) ----------------------------------
  const [cssText, setCssText] = useState(cssString);

  useEffect(() => setCssText(cssString), [cssString]);

  // parse user edits
  const handleCssTextChange = (e) => {
    const txt = e.target.value;
    setCssText(txt);
    const parsed = parseCssString(txt);

    // border shorthand split
    if (parsed.border) {
      const parts = parsed.border.split(" ");
      // Simple heuristic for shorthand: width style color
      if (parts.length >= 3) {
        parsed.borderWidth = parts[0];
        parsed.borderStyle = parts[1];
        parsed.borderColor = parts.slice(2).join(" ");
      }
      delete parsed.border;
    }

    setCss((prev) => {
      const nextState = { ...prev, ...parsed };
      
      // IMPORTANT: Since we removed UI controls, the text box is the source of truth.
      // If 'width' is not in the parsed text, remove it from state (so it doesn't persist).
      if (!parsed.width) delete nextState.width;
      if (!parsed.height) delete nextState.height;
      
      return nextState;
    });
  };

  // --- preview box style ---------------------------------------------------
  const previewStyle = {
    textAlign: css.textAlign,
    fontSize: css.fontSize,
    fontWeight: css.fontWeight,
    color: css.color,
    backgroundColor: css.backgroundColor,
    border: `${css.borderWidth} ${css.borderStyle} ${css.borderColor}`,
    padding: css.padding,
    // Use values from state, or let them be undefined (auto size)
    width: css.width,
    height: css.height,
    marginTop: 8,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // ------------------------------------------------------------------------
  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div>
          <label>Text Align</label>
          <Dropdown
            value={css.textAlign}
            options={textAlignOptions}
            onChange={(e) => setCss((c) => ({ ...c, textAlign: e.value }))}
          />
        </div>
        <div>
          <label>Font Size</label>
          <InputNumber
            value={parseInt(css.fontSize)}
            min={8}
            max={48}
            onValueChange={(e) =>
              setCss((c) => ({ ...c, fontSize: (e.value || 14) + "px" }))
            }
          />
        </div>
        <div>
          <label>Font Weight</label>
          <Dropdown
            value={css.fontWeight}
            options={fontWeightOptions}
            onChange={(e) => setCss((c) => ({ ...c, fontWeight: e.value }))}
          />
        </div>
        
        {/* Width and Height controls have been removed */}

        <div>
          <label>Text Color</label>
          <SketchPicker
            color={css.color}
            onChangeComplete={(color) =>
              setCss((c) => ({ ...c, color: color.hex }))
            }
          />
        </div>
        <div>
          <label>Background</label>
          <SketchPicker
            color={css.backgroundColor}
            onChangeComplete={(color) =>
              setCss((c) => ({ ...c, backgroundColor: color.hex }))
            }
          />
        </div>
        <div>
          <label>Border</label>
          <InputNumber
            value={parseInt(css.borderWidth)}
            min={0}
            onValueChange={(e) =>
              setCss((c) => ({ ...c, borderWidth: (e.value || 1) + "px" }))
            }
            placeholder="Width"
          />
          <Dropdown
            value={css.borderStyle}
            options={borderStyleOptions}
            onChange={(e) => setCss((c) => ({ ...c, borderStyle: e.value }))}
          />
          <SketchPicker
            color={css.borderColor}
            onChangeComplete={(color) =>
              setCss((c) => ({ ...c, borderColor: color.hex }))
            }
          />
        </div>
        <div>
          <label>Padding</label>
          <InputNumber
            value={parseInt(css.padding)}
            min={0}
            onValueChange={(e) =>
              setCss((c) => ({ ...c, padding: (e.value || 4) + "px" }))
            }
          />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Live Preview:</strong>
        <div style={previewStyle}>Sample Cell</div>
      </div>

      <div style={{ marginTop: 8 }}>
        <strong>CSS String (Type width/height here):</strong>
        <InputText
          value={cssText}
          onChange={handleCssTextChange}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}