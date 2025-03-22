"use client";

import dynamic from "next/dynamic";

// Dynamically import Monaco Editor to prevent SSR issues
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
const file={
  "Python":{
    filename:"python",
    path:"index.py"

  },
    "Javascript":{
    filename:"javascript",
    path:"index.js"
    
  }
}
const CodeEditor = ({filetype,setCode}) => {
  // Function to register C++ language features
  const handleEditorMount = (editor, monaco) => {
    monaco.languages.register({ id: "cpp" }); // Register C++ language
monaco.languages.setMonarchTokensProvider("cpp", {
  tokenizer: {
    root: [
      [/#include/, "keyword"],
      [
        /\b(int|float|double|char|bool|void|long|short|unsigned|signed)\b/,
        "type",
      ],
      [
        /\b(if|else|for|while|do|return|switch|case|break|continue|goto|default)\b/,
        "keyword",
      ],
      [
        /\b(class|struct|namespace|using|public|private|protected|template|typename)\b/,
        "keyword",
      ],
      [/\b(try|catch|throw|new|delete|operator|sizeof|this)\b/, "keyword"],
      [
        /\b(std::cout|std::cin|std::endl|std::vector|std::map|std::set|std::queue|std::stack|std::unordered_map|std::unordered_set|std::priority_queue|std::pair|std::make_pair|std::tuple|std::get)\b/,
        "variable",
      ],
      [/\/\/.*$/, "comment"],
    ],
  },
});

monaco.languages.registerCompletionItemProvider("cpp", {
  provideCompletionItems: () => ({
    suggestions: [
      {
        label: "main",
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: "int main() {\n\treturn 0;\n}",
        detail: "C++ main function",
      },
      {
        label: "cout",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'std::cout << "$1" << std::endl;',
        detail: "Print to console",
      },
      {
        label: "cin",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "std::cin >> $1;",
        detail: "Input from console",
      },
      {
        label: "vector",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "std::vector<$1> $2;",
        detail: "C++ Vector",
      },
      {
        label: "map",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "std::map<$1, $2> $3;",
        detail: "C++ Map (key-value store)",
      },
      {
        label: "set",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "std::set<$1> $2;",
        detail: "C++ Set (unique elements)",
      },
      {
        label: "unordered_map",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "std::unordered_map<$1, $2> $3;",
        detail: "C++ Unordered Map (hash table)",
      },
      {
        label: "unordered_set",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "std::unordered_set<$1> $2;",
        detail: "C++ Unordered Set",
      },
      {
        label: "pair",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "std::pair<$1, $2> $3;",
        detail: "C++ Pair",
      },
      {
        label: "tuple",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "std::tuple<$1, $2, $3> $4;",
        detail: "C++ Tuple",
      },
      {
        label: "queue",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "std::queue<$1> $2;",
        detail: "C++ Queue",
      },
      {
        label: "stack",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "std::stack<$1> $2;",
        detail: "C++ Stack",
      },
      {
        label: "priority_queue",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "std::priority_queue<$1> $2;",
        detail: "C++ Priority Queue (Max Heap by default)",
      },
      {
        label: "for loop",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "for (int i = 0; i < $1; i++) {\n\t$2\n}",
        detail: "Standard for loop",
      },
      {
        label: "foreach loop",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "for (auto& $1 : $2) {\n\t$3\n}",
        detail: "Range-based for loop",
      },
      {
        label: "lambda",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: "auto $1 = []($2) {\n\t$3\n};",
        detail: "C++ Lambda function",
      },
    ],
  }),
});

  };

  return (
    <div className="w-full flex flex-1 min-h-max max-h-max bg-[#272727] rounded-lg p-4">
      {filetype == "Cpp" ? (
        <>
          <Editor
            height="50vh"
            width="100%"
            theme="vs-dark"
            defaultLanguage="cpp"
            defaultValue="// Start coding in C++"
            onMount={handleEditorMount} // Register language only when editor mounts
            onChange={(value) => {
              setCode(value);
            }}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              wordWrap: "on",
            }}
          />
        </>
      ) : (
        <>
          <Editor
            height="50vh"
            theme="vs-dark"
            path={file[filetype].path}
            onChange={(value) => {
              setCode(value);
            }}
            language={file[filetype].name}
            defaultValue="// Start coding"
          />
        </>
      )}
    </div>
  );
};

export default CodeEditor;
