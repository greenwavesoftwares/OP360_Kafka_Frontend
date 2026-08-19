import React, {
  useImperativeHandle,
  useRef,
  forwardRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import Editor from '@monaco-editor/react';
import { InputSwitch } from 'primereact/inputswitch';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';

// 👇 Theme values
const THEMES = {
  LIGHT: 'vs',
  DARK: 'vs-dark',
};

const STORAGE_KEY = 'monaco_editor_theme';

// 🎯 Main Monaco Script Runner component
const MonacoScriptRunner = forwardRef(({ value, onChange,expressionType,disabledArea }, ref) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
//   const [theme, setTheme] = useState(THEMES.DARK);
const [theme, setTheme] = useState(() => {
  return localStorage.getItem(STORAGE_KEY) || THEMES.DARK;
});
  const [placeholders, setPlaceholders] = useState({});
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [output, setOutput] = useState('');

  // 🔌 Expose insertAtCursor method to parent (e.g., PickListDemo)
  useImperativeHandle(ref, () => ({
    insertAtCursor: (text) => {
      const editor = editorRef.current;
      const monaco = monacoRef.current;
      if (!editor || !monaco) return;

      const position = editor.getPosition();
      const range = new monaco.Range(
        position.lineNumber,
        position.column,
        position.lineNumber,
        position.column
      );

      editor.executeEdits(null, [
        {
          range,
          text,
          forceMoveMarkers: true,
        },
      ]);

      editor.setPosition({
        lineNumber: position.lineNumber,
        column: position.column + text.length,
      });

      editor.focus();
      onChange(editor.getValue());
    },
  }));

  // 📥 Extract placeholders from {{ }}
// 📥 Extract placeholders from {{ }} or { { } } (with spaces)
const extractPlaceholders = (text) => {
  // ✅ Escape braces: \{ and \}
  const regex = /\{\s*\{\s*(.*?)\s*\}\s*\}/g;
  const matches = [...text.matchAll(regex)];
  const found = {};
  matches.forEach((match) => {
    const key = match[1].trim();
    if (key) found[key] = ''; // Only add non-empty keys
  });
  return found;
};

  // ▶️ Run Button
  const handleRun = () => {
    const found = extractPlaceholders(value);
    setPlaceholders(found);
    setShowInputDialog(true);
  };

  // ✅ Execute code via eval()
// ✅ Execute code via eval()


// ✅ Execute code via eval()
const handleExecute = () => {
  let replaced = value;

  Object.entries(placeholders).forEach(([key, val]) => {
    // ✅ Escape special regex characters in key and allow spaces between braces
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`{\\s*{\\s*${escapedKey}\\s*}\\s*}`, 'g');
    
    // Determine if value is number or string
    const numVal = parseFloat(val);
    let replacement;
    
    if (!isNaN(numVal) && val.trim() !== '') {
      // ✅ Valid number
      replacement = numVal;
    } else if ((val.startsWith("'") && val.endsWith("'")) || 
               (val.startsWith('"') && val.endsWith('"'))) {
      // ✅ Already quoted string
      replacement = val;
    } else {
      // ✅ Unquoted string - add quotes
      replacement = `'${val}'`;
    }
    
    replaced = replaced.replace(regex, replacement);
  });

  try {
    const result = eval(replaced);
    setOutput(`✅ Output:\n${result}`);
  } catch (err) {
    let message = `❌ ${err.name}: ${err.message}`;
    const stackLine = err.stack?.match(/<anonymous>:(\d+):(\d+)/);
    if (stackLine) {
      const lineNumber = parseInt(stackLine[1]);
      const codeLine = replaced.split('\n')[lineNumber - 1];
      message += `\n📍 Line ${lineNumber}: ${codeLine}`;
    }
    setOutput(message);
  }

  setShowInputDialog(false);
  setShowResultDialog(true);
};


  // ✨ Auto format code using Monaco
  const handleFormat = () => {
    editorRef.current?.getAction('editor.action.formatDocument')?.run();
  };

  // 🌗 Handle theme toggle
 const handleThemeToggle = (isDark) => {
  const selectedTheme = isDark ? THEMES.DARK : THEMES.LIGHT;
  setTheme(selectedTheme);
  localStorage.setItem(STORAGE_KEY, selectedTheme);
};

  return (
    <div>
      {/* Theme Toggle + Format */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
          alignItems: "center",
        }}
      >
        <span className="font-bold text-sm">
          {disabledArea
            ? "Logic Editor (return true or false)"
            : "Logic Editor"}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Tag
            icon={theme === THEMES.DARK ? "pi pi-moon" : "pi pi-sun"}
            severity={theme === THEMES.DARK ? "info" : "warning"}
            value={theme === THEMES.DARK ? "Dark" : "Light"}
          />
          <i className="pi pi-sun" />
          <InputSwitch
            checked={theme === THEMES.DARK}
            onChange={(e) => handleThemeToggle(e.value)}
          />
          <i className="pi pi-moon" />
        </div>

        {/* <Button
          label="Format Code"
          icon="pi pi-align-left"
          className="p-button-secondary"
          onClick={handleFormat}
        /> */}
      </div>

      {/* Monaco Editor */}
      <div style={{ border: " 1px solid #dbe0e9" }}>
        <Editor
          height={"100vh"}
          defaultLanguage="javascript"
          value={value}
          onChange={(v) => onChange(v || "")}
          theme={theme}
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            monacoRef.current = monaco;

            // Optional: auto-format on load
            setTimeout(() => {
              editor.getAction("editor.action.formatDocument").run();
            }, 300);
          }}
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            wordWrap: "on",
            autoClosingBrackets: "always",
            formatOnType: true,
            formatOnPaste: true,
            tabSize: 2,
            detectIndentation: false,
          }}
        />
      </div>
      {/* Run Script */}
      {expressionType === "Expression" && (
        <Button
          disabled={!value?.trim()}
          label="Run Script"
          icon="pi pi-play"
          className="p-button-success"
          style={{ marginTop: "1rem" }}
          onClick={handleRun}
        />
      )}

      {/* Placeholder Input Dialog */}
      <Dialog
        header="Enter Placeholder Values"
        visible={showInputDialog}
        onHide={() => setShowInputDialog(false)}
        footer={
          <Button label="Execute" icon="pi pi-check" onClick={handleExecute} />
        }
      >
        {Object.keys(placeholders).length === 0 ? (
          <p>No placeholders found.</p>
        ) : (
          Object.entries(placeholders).map(([key, val]) => (
            <div key={key} style={{ marginBottom: "1rem" }}>
              <label htmlFor={key}>{key}</label>
              <InputText
                id={key}
                value={val}
                onChange={(e) =>
                  setPlaceholders((prev) => ({
                    ...prev,
                    [key]: e.target.value,
                  }))
                }
                style={{ width: "100%" }}
              />
            </div>
          ))
        )}
      </Dialog>

      {/* Output Dialog */}
      <Dialog
        header="Execution Result"
        visible={showResultDialog}
        onHide={() => setShowResultDialog(false)}
        style={{ width: "50vw" }}
      >
        <pre>{output}</pre>
      </Dialog>
    </div>
  );
});

MonacoScriptRunner.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MonacoScriptRunner;