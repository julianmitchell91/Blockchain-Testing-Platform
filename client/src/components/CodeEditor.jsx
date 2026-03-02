import Editor from "@monaco-editor/react";

export default function CodeEditor({ value, onChange, readOnly = false }) {
  function handleEditorDidMount(editor, monaco) {
    monaco.editor.defineTheme("chaincoderDark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A9955" },
        { token: "keyword", foreground: "C586C0" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
        { token: "type", foreground: "4EC9B0" },
      ],
      colors: {
        "editor.background": "#0d1117",
        "editor.foreground": "#e6edf3",
        "editor.lineHighlightBackground": "#161b22",
        "editorLineNumber.foreground": "#484f58",
        "editorLineNumber.activeForeground": "#e6edf3",
        "editor.selectionBackground": "#264f78",
        "editor.inactiveSelectionBackground": "#264f7844",
      },
    });
    monaco.editor.setTheme("chaincoderDark");
  }

  return (
    <div className="h-full rounded-lg overflow-hidden border border-gray-800">
      <Editor
        height="100%"
        defaultLanguage="sol"
        language="sol"
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          wordWrap: "on",
          readOnly,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
}
