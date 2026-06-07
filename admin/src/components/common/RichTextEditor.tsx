import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write product story or details...",
  disabled = false,
  error,
  label,
}) => {
  return (
    <div className="space-y-1.5 text-left w-full select-none">
      {label && (
        <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase select-none">
          {label}
        </label>
      )}
      
      <div 
        className={cn(
          "rounded-lg overflow-hidden border transition-all duration-200 bg-[#12141a]",
          error 
            ? "border-rose-500 ring-2 ring-rose-500/20" 
            : "border-border focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20",
          disabled && "opacity-40 pointer-events-none"
        )}
      >
        <Editor
          apiKey={import.meta.env.VITE_TINY_API_KEY || "no-api-key"}
          value={value}
          onEditorChange={(content) => onChange(content)}
          disabled={disabled}
          init={{
            height: 260,
            menubar: false,
            placeholder: placeholder,
            skin: "oxide-dark",
            content_css: "dark",
            branding: false,
            promotion: false,
            statusbar: true,
            elementpath: false,
            plugins: [
              "lists", "link", "image", "preview", "anchor",
              "searchreplace", "visualblocks", "code", "fullscreen",
              "media", "table", "help", "wordcount"
            ],
            toolbar: 
              "undo redo | blocks | bold italic forecolor | " +
              "alignleft aligncenter alignright alignjustify | " +
              "bullist numlist outdent indent | removeformat | code help",
            content_style: `
              body { 
                font-family: 'Geist Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
                font-size: 15px; 
                color: #f1f5f9; 
                background-color: #12141a; 
                line-height: 1.6;
                padding: 16px;
              }
              body::before {
                color: #7e8494 !important;
                font-style: italic;
              }
              h3 { color: #c5a880; font-family: serif; font-size: 18px; margin-top: 0; margin-bottom: 8px; }
              h4 { color: #c5a880; font-size: 16px; margin-top: 0; margin-bottom: 6px; }
              ul { list-style-type: disc; margin-left: 20px; margin-bottom: 8px; }
              ol { list-style-type: decimal; margin-left: 20px; margin-bottom: 8px; }
              strong { color: #c5a880; font-weight: 600; }
              p { margin-top: 0; margin-bottom: 8px; }
            `,
          }}
        />
      </div>

      {error && (
        <p className="text-[11px] font-medium text-rose-400 select-none animate-in fade-in slide-in-from-top-1 duration-100">
          {error}
        </p>
      )}
    </div>
  );
};
export default RichTextEditor;
