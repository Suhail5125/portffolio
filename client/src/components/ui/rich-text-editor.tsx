import { useState, useEffect } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { Textarea } from "./textarea";
import { Bold, Italic, List, Heading1, Heading2 } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  className = "",
}: RichTextEditorProps) {
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const handleTextAreaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setSelectionStart(target.selectionStart);
    setSelectionEnd(target.selectionEnd);
  };

  const insertMarkdown = (prefix: string, suffix = prefix) => {
    const newText = value.substring(0, selectionStart) + 
                   prefix + 
                   value.substring(selectionStart, selectionEnd) + 
                   suffix +
                   value.substring(selectionEnd);
    onChange(newText);
  };

  const controls = [
    { icon: Bold, label: "Bold", action: () => insertMarkdown("**") },
    { icon: Italic, label: "Italic", action: () => insertMarkdown("*") },
    { icon: Heading1, label: "Heading 1", action: () => insertMarkdown("# ") },
    { icon: Heading2, label: "Heading 2", action: () => insertMarkdown("## ") },
    { icon: List, label: "List", action: () => insertMarkdown("- ") },
  ];

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex gap-2 mb-2">
        {controls.map((control) => (
          <Button
            key={control.label}
            variant="outline"
            size="sm"
            onClick={control.action}
            title={control.label}
          >
            <control.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleTextAreaSelect}
        placeholder={placeholder}
        className="min-h-[300px] font-mono"
      />
      <p className="mt-2 text-xs text-muted-foreground">
        Use Markdown for formatting. Preview will be shown in public pages.
      </p>
    </Card>
  );
}