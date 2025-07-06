type Token = {
  type:
    | "text"
    | "bold"
    | "italic"
    | "code"
    | "codeBlock"
    | "newline"
    | "list"
    | "header"
    | "blockquote"
    | "strikethrough"
    | "image"
    | "table"
    | "taskList"
    | "horizontalRule"
    | "inlineMath"
    | "blockMath";
  content: string;
  level?: number;
  items?: string[];
  alignments?: string[];
  checked?: boolean;
};

const styles = {
  container:
    "prose prose-slate dark:prose-invert max-w-none prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-white text-white",
  heading: (level: number) => {
    const base = "scroll-m-20 tracking-tight text-white";
    const sizes = [
      "text-4xl font-bold lg:text-5xl",
      "text-3xl font-semibold",
      "text-2xl font-semibold",
      "text-xl font-semibold",
      "text-lg font-medium",
      "text-base font-medium",
    ];
    return `${base} ${sizes[level - 1] || sizes[5]}`;
  },
  paragraph: "leading-7 [&:not(:first-child)]:mt-6 text-white",
  code: "relative rounded bg-secondary/20 px-1.5 py-0.5 font-mono text-sm font-semibold text-white",
  codeBlock: "rounded-md border border-secondary/30 bg-secondary/10 p-4 font-mono text-sm overflow-x-auto text-white",
  blockquote:
    "mt-6 border-l-4 border-primary/50 pl-6 italic bg-secondary/10 py-2 text-white [&>*]:text-white",
  list: {
    ul: "my-6 ml-6 list-disc [&>li]:mt-2 marker:text-white",
    ol: "my-6 ml-6 list-decimal [&>li]:mt-2 marker:text-white",
    li: "[&>p]:m-0 [&>ul]:mt-2 [&>ol]:mt-2 text-white",
  },
  table:
    "my-6 w-full overflow-y-auto text-white [&_th]:px-4 [&_th]:py-2 [&_td]:px-4 [&_td]:py-2 [&_th]:bg-secondary/20 [&_tr]:border-b [&_tr]:hover:bg-secondary/10 [&_th]:text-white",
  taskList:
    "my-6 space-y-2 text-white [&>li]:flex [&>li]:items-center [&>li]:space-x-2 [&_input]:h-4 [&_input]:w-4 [&_input]:accent-primary",
  hr: "my-8 border-t border-white/20",
  link: "font-medium text-white underline underline-offset-4 hover:text-white/80 transition-colors",
  img: "my-4 rounded-lg border border-secondary/30 shadow-sm",
};

export function renderMarkdown(markdown: string): string {
  if (!markdown) return "";

  const lines = markdown.split("\n");
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLanguage = "";
  let inTable = false;
  let tableRows: string[] = [];
  let tableAlignments: string[] = [];
  let inTaskList = false;
  let inBlockMath = false;
  let blockMathContent: string[] = [];
  let html = "";

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trimEnd();

    if (line.match(/^[-*_]{3,}$/)) {
      html += `<hr class="${styles.hr}">`;
      continue;
    }

    if (line.startsWith("$$")) {
      if (inBlockMath) {
        html += renderBlockMath(blockMathContent.join("\n"));
        blockMathContent = [];
        inBlockMath = false;
      } else {
        inBlockMath = true;
      }
      continue;
    }

    if (inBlockMath) {
      blockMathContent.push(line);
      continue;
    }

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        html += renderCodeBlock(codeBlockContent.join("\n"), codeBlockLanguage);
        codeBlockContent = [];
        codeBlockLanguage = "";
        inCodeBlock = false;
      } else {
        codeBlockLanguage = line.substring(3).trim();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    const tableSeparatorMatch = line.match(/^\|?([-:|\s]+)\|?$/);
    if (tableSeparatorMatch && tableRows.length === 1) {
      tableAlignments = tableSeparatorMatch[1].split("|").map((col) => {
        const trimmed = col.trim();
        if (trimmed.startsWith(":") && trimmed.endsWith(":")) return "center";
        if (trimmed.endsWith(":")) return "right";
        return "left";
      });
      continue;
    }

    const tableRowMatch = line.match(/^\|(.+)\|$/);
    if (tableRowMatch) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      tableRows.push(line);
      continue;
    } else if (inTable) {
      html += renderTable(tableRows, tableAlignments);
      inTable = false;
      tableRows = [];
      tableAlignments = [];
    }

    const taskMatch = line.match(/^\s*[-*] \[(.)\]\s+(.+)$/);
    if (taskMatch) {
      if (!inTaskList) {
        html += '<ul class="space-y-2 my-4">';
        inTaskList = true;
      }
      const checked = taskMatch[1].toLowerCase() === "x";
      const content = taskMatch[2];
      html += `<li class="${styles.taskList.replace("[&>li]:", "")}">
        <input type="checkbox" ${checked ? "checked" : ""} disabled
               class="h-4 w-4 rounded border-primary text-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50">
        <span class="${checked ? "line-through opacity-50" : ""}">
          ${parseInlineMarkdown(content)}
        </span>
      </li>`;
      continue;
    } else if (inTaskList) {
      html += "</ul>";
      inTaskList = false;
    }

    const headerMatch = line.match(/^(#{1,6})\s+(.+?)(?:\s+#*)?$/);
    if (headerMatch) {
      const level = Math.min(headerMatch[1].length, 6);
      const content = headerMatch[2].trim();
      const id = content
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/^-+|-+$/g, "");

      const headerClasses = getHeaderClasses(level);
      html += `<h${level} id="${id}" class="${headerClasses}">
        ${parseInlineMarkdown(content)}
      </h${level}>`;
      continue;
    }

    const blockquoteMatch = line.match(/^(>+)\s*(.*)/);
    if (blockquoteMatch) {
      const level = blockquoteMatch[1].length;
      const content = blockquoteMatch[2];
      const blockquoteClasses = styles.blockquote;
      let blockquoteHtml = `<blockquote class="${blockquoteClasses}">`;
      for (let j = 1; j < level; j++) {
        blockquoteHtml += `<blockquote class="border-l-2 border-blue-300 pl-3 mt-2">`;
      }
      blockquoteHtml += parseInlineMarkdown(content);
      for (let j = 1; j < level; j++) {
        blockquoteHtml += "</blockquote>";
      }
      blockquoteHtml += "</blockquote>";

      html += blockquoteHtml;
      continue;
    }

    const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      const indent = listMatch[1].length;
      const marker = listMatch[2];
      const content = listMatch[3];
      const isOrdered = /\d+\./.test(marker);
      const listType = isOrdered ? "ol" : "ul";
      const listClasses = isOrdered ? styles.list.ol : styles.list.ul;

      const prevLine = i > 0 ? lines[i - 1] : "";
      const isNewList = !prevLine.match(/^\s*[-*+]\s+|^\s*\d+\.\s+/);

      if (isNewList) {
        html += `<${listType} class="${listClasses}">`;
      }

      html += `<li class="${styles.list.li}">${parseInlineMarkdown(content)}</li>`;

      const nextLine = i < lines.length - 1 ? lines[i + 1] : "";
      const isEndList = !nextLine.match(/^\s*[-*+]\s+|^\s*\d+\.\s+/);

      if (isEndList) {
        html += `</${listType}>`;
      }
      continue;
    }

    if (line.trim() === "") {
      continue;
    } else {
      const nextLine = i < lines.length - 1 ? lines[i + 1] : "";
      const prevLine = i > 0 ? lines[i - 1] : "";
      const shouldWrapInP = !line.match(/^(#{1,6}|>|\s*[-*+]|\s*\d+\.|\||```)/);

      if (shouldWrapInP) {
        if (prevLine.trim() === "" || i === 0) {
          html += `<p class="${styles.paragraph}">${parseInlineMarkdown(line)}`;

          if (
            nextLine.trim() !== "" &&
            !nextLine.match(/^(#{1,6}|>|\s*[-*+]|\s*\d+\.|\||```)/)
          ) {
            html += " ";
          } else {
            html += "</p>";
          }
        } else if (
          nextLine.trim() === "" ||
          i === lines.length - 1 ||
          nextLine.match(/^(#{1,6}|>|\s*[-*+]|\s*\d+\.|\||```)/)
        ) {
          html += `${parseInlineMarkdown(line)}</p>`;
        } else {
          html += `${parseInlineMarkdown(line)} `;
        }
      }
    }
  }

  if (inTaskList) html += "</ul>";
  if (inTable) html += renderTable(tableRows, tableAlignments);
  if (inBlockMath) html += renderBlockMath(blockMathContent.join("\n"));
  if (inCodeBlock)
    html += renderCodeBlock(codeBlockContent.join("\n"), codeBlockLanguage);

  return html.trim();
}

function renderCodeBlock(content: string, language: string): string {
  const displayLanguage = language || "plaintext";
  const languageLabel = getLanguageLabel(displayLanguage);

  return `
    <div class="relative my-6 overflow-hidden rounded-lg border bg-card">
      <div class="flex items-center justify-between bg-muted/50 px-4 py-2 border-b">
        <span class="text-xs font-mono opacity-50">${languageLabel}</span>
        <button class="copy-button text-xs opacity-50 hover:text-foreground transition-colors" data-code="${escapeHtml(content)}">
          Copy
        </button>
      </div>
      <pre class="${styles.codeBlock}"><code class="language-${displayLanguage}">${escapeHtml(content)}</code></pre>
    </div>
  `;
}

function renderBlockMath(content: string): string {
  return `
    <div class="my-6 overflow-hidden rounded-lg border bg-card p-4">
      <div class="overflow-x-auto text-center">
        ${escapeHtml(content)}
      </div>
    </div>
  `;
}

function parseInlineMarkdown(text: string): string {
  if (!text) return "";

  let result = escapeHtml(text);

  result = result.replace(
    /`([^`]+)`/g,
    `<code class="${styles.code}">$1</code>`
  );

  result = result.replace(
    /\$([^$]+)\$/g,
    '<span class="inline-block rounded bg-muted px-1.5 py-0.5 font-mono text-sm">$1</span>'
  );

  result = result.replace(
    /!\[([^\]]*)\]\(([^\s"]+)(?:\s+"([^"]+)")?\)/g,
    (_, alt, src, title) =>
      `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" ${
        title ? `title="${escapeHtml(title)}"` : ""
      }
       class="${styles.img}">`
  );

  result = result.replace(
    /\[([^\]]+)\]\(([^\s"]+)(?:\s+"([^"]+)")?\)/g,
    (_, text, url, title) =>
      `<a href="${escapeHtml(url)}" ${
        title ? `title="${escapeHtml(title)}"` : ""
      }
       target="_blank" rel="noopener noreferrer"
       class="${styles.link}">${escapeHtml(text)}</a>`
  );

  result = result.replace(
    /~~([^~]+)~~/g,
    '<del class="text-bg-secondary">$1</del>'
  );
  result = result.replace(
    /\*\*\*([^*]+?)\*\*\*/g,
    '<strong class="font-bold"><em class="italic">$1</em></strong>'
  );
  result = result.replace(
    /___([^_]+?)___/g,
    '<strong class="font-bold"><em class="italic">$1</em></strong>'
  );

  result = result.replace(
    /\*\*([^*]+?)\*\*/g,
    '<strong class="font-bold">$1</strong>'
  );
  result = result.replace(
    /__([^_]+?)__/g,
    '<strong class="font-bold">$1</strong>'
  );

  result = result.replace(/\*([^*]+?)\*/g, '<em class="italic">$1</em>');
  result = result.replace(/_([^_]+?)_/g, '<em class="italic">$1</em>');

  return result;
}

function escapeHtml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderTable(rows: string[], alignments: string[]): string {
  if (rows.length === 0) return "";

  const headerRow = rows[0]
    .split("|")
    .map((cell) => cell.trim())
    .filter(Boolean);
  const dataRows = rows.slice(1).map((row) =>
    row
      .split("|")
      .map((cell) => cell.trim())
      .filter(Boolean)
  );

  let tableHtml = `
    <div class="my-6 overflow-x-auto rounded-lg border border-bg-secondary">
      <table class="min-w-full divide-y divide-bg-secondary">
        <thead class="bg-bg-secondary">
          <tr>
  `;

  headerRow.forEach((cell, i) => {
    const align = alignments[i] || "left";
    const alignClass =
      align === "center"
        ? "text-center"
        : align === "right"
          ? "text-right"
          : "text-left";
    tableHtml += `
      <th class="px-6 py-3 ${alignClass} text-xs font-medium text-bg-secondary uppercase tracking-wider">
        ${parseInlineMarkdown(cell)}
      </th>
    `;
  });

  tableHtml += `
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-bg-secondary">
  `;

  dataRows.forEach((row, rowIndex) => {
    const rowBg = rowIndex % 2 === 0 ? "bg-white" : "bg-bg-secondary";
    tableHtml += `<tr class="${rowBg}">`;

    row.forEach((cell, i) => {
      const align = alignments[i] || "left";
      const alignClass =
        align === "center"
          ? "text-center"
          : align === "right"
            ? "text-right"
            : "text-left";
      tableHtml += `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-bg-secondary ${alignClass}">
          ${parseInlineMarkdown(cell)}
        </td>
      `;
    });

    tableHtml += "</tr>";
  });

  tableHtml += `
      </tbody>
    </table>
  </div>
  `;

  return tableHtml;
}

function getHeaderClasses(level: number): string {
  return styles.heading(level);
}

function getLanguageLabel(language: string): string {
  const languageMap: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    jsx: "JSX",
    tsx: "TSX",
    html: "HTML",
    css: "CSS",
    scss: "SCSS",
    json: "JSON",
    yaml: "YAML",
    yml: "YAML",
    markdown: "Markdown",
    md: "Markdown",
    bash: "Bash",
    sh: "Shell",
    python: "Python",
    py: "Python",
    java: "Java",
    c: "C",
    cpp: "C++",
    csharp: "C#",
    php: "PHP",
    ruby: "Ruby",
    go: "Go",
    rust: "Rust",
    sql: "SQL",
    xml: "XML",
    plaintext: "Text",
  };

  return languageMap[language.toLowerCase()] || language.toUpperCase();
}

export function addCopyToClipboardScript(): string {
  return `
    <script>
      function copyToClipboard(button) {
        const codeBlock = button.closest('.group').querySelector('code');
        const text = codeBlock.textContent || codeBlock.innerText;

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(button);
          }).catch(() => {
            fallbackCopyTextToClipboard(text, button);
          });
        } else {
          fallbackCopyTextToClipboard(text, button);
        }
      }

      function fallbackCopyTextToClipboard(text, button) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          showCopyFeedback(button);
        } catch (err) {
          console.error('Copy failed:', err);
        }

        document.body.removeChild(textArea);
      }

      function showCopyFeedback(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';

        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 2000);
      }
    </script>
  `;
}
