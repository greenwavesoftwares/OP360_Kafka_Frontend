import React, { useState, useEffect, useRef } from "react";
import Prism from "prismjs"; // Import Prism first
import "prismjs/components/prism-sql"; // Then import SQL support
import "prismjs/themes/prism.css"; // Import theme
 
 
if (typeof window !== "undefined") {
    require("prismjs");
}
 
const SqlEditor = () => {
    const [query, setQuery] = useState("");
    const editorRef = useRef(null);
    const highlightedRef = useRef(null);
 
    useEffect(() => {
        if (highlightedRef.current) {
            highlightedRef.current.innerHTML = Prism.highlight(query, Prism.languages.sql, "sql");
        }
    }, [query]);
 
    const handleInput = (event) => {
        setQuery(event.target.innerText);
    };
 
    const handleScroll = () => {
        if (editorRef.current && highlightedRef.current) {
            highlightedRef.current.scrollTop = editorRef.current.scrollTop;
            highlightedRef.current.scrollLeft = editorRef.current.scrollLeft;
        }
    };
 
    return (
        <div>
            <h2>Dynamic SQL Keyword Highlighting</h2>
            <label>Enter SQL Query:</label>
            <div className="editor-container" style={{ position: "relative", width: "100%", maxWidth: "600px" }}>
                <pre
                    ref={highlightedRef}
                    className="highlighted-code"
                    style={{
                        fontFamily: "Consolas, 'Courier New', monospace",
                        fontSize: "16px",
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        padding: "10px",
                        width: "100%",
                        height: "200px",
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                        overflow: "auto",
                        position: "relative",
                        color: "black",
                        zIndex: 1,
                        pointerEvents: "none"
                    }}
                ></pre>
                <div
                    ref={editorRef}
                    contentEditable="true"
                    className="editor"
                    onInput={handleInput}
                    onScroll={handleScroll}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 2,
                        color: "transparent",
                        caretColor: "black",
                        opacity: 0.2,
                        fontFamily: "Consolas, 'Courier New', monospace",
                        fontSize: "16px",
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        padding: "10px",
                        width: "100%",
                        height: "200px",
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                        overflow: "auto"
                    }}
                ></div>
               
            </div>
 
            <style>
                {`
                .token.keyword { color: #0000FF; font-weight: bold; }
                .token.string { color: #FF0000; }
                .token.comment { color: #808080; font-style: italic; }
                .token.number { color:black; }
                `}
            </style>
        </div>
    );
};
 
export default SqlEditor;