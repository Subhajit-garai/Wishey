"use client";

import { useState, useRef } from "react";
import {
  FileSpreadsheet,
  Upload,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import type { FolderItem } from "./FolderModal";

interface ParsedRow {
  name: string;
  date: string;
  relation: string;
  specialRating: number;
  folderName: string;
  eventType: string;
  notes: string;
  isValid: boolean;
  errorReason?: string;
}

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: FolderItem[];
  onSuccess: () => void;
}

export function ImportExcelModal({
  isOpen,
  onClose,
  folders,
  onSuccess,
}: ImportExcelModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [defaultFolderId, setDefaultFolderId] = useState<string>("none");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  if (!isOpen) return null;

  // Helper to format date into YYYY-MM-DD
  const normalizeDateStr = (rawVal: any): string => {
    if (!rawVal) return "";
    if (typeof rawVal === "number") {
      // Excel serial date number
      const dateObj = XLSX.SSF.parse_date_code(rawVal);
      if (dateObj) {
        const y = dateObj.y;
        const m = String(dateObj.m).padStart(2, "0");
        const d = String(dateObj.d).padStart(2, "0");
        return `${y}-${m}-${d}`;
      }
    }

    const str = String(rawVal).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      return str;
    }

    // Try parsing date string like MM/DD/YYYY or DD-MM-YYYY
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
      const y = parsed.getFullYear();
      const m = String(parsed.getMonth() + 1).padStart(2, "0");
      const d = String(parsed.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }

    return str;
  };

  // Parse Excel / CSV file
  const handleFileProcess = (file: File) => {
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonRows.length === 0) {
          toast.error("The uploaded file contains no data rows.");
          setParsedRows([]);
          return;
        }

        const rows: ParsedRow[] = jsonRows.map((row, idx) => {
          // Normalize case insensitive keys
          const keys = Object.keys(row);
          const findVal = (keyName: string) => {
            const match = keys.find(
              (k) => k.toLowerCase().replace(/[^a-z0-9]/g, "") === keyName.toLowerCase()
            );
            return match ? row[match] : "";
          };

          const name = String(findVal("name") || findVal("person") || "").trim();
          const rawDate = findVal("date") || findVal("birthday") || findVal("eventdate");
          const date = normalizeDateStr(rawDate);
          const relation = String(findVal("relation") || findVal("relationship") || "Friend").trim();
          const rawRating = findVal("specialrating") || findVal("rating") || findVal("score") || 5;
          const specialRating = Math.min(10, Math.max(1, parseInt(String(rawRating), 10) || 5));
          const folderName = String(findVal("folder") || findVal("foldername") || "").trim();
          const eventType = String(findVal("eventtype") || findVal("type") || "birthday").trim().toLowerCase();
          const notes = String(findVal("notes") || findVal("description") || "").trim();

          let isValid = true;
          let errorReason = "";

          if (!name) {
            isValid = false;
            errorReason = "Missing name";
          } else if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            isValid = false;
            errorReason = "Invalid date (use YYYY-MM-DD)";
          }

          return {
            name,
            date,
            relation,
            specialRating,
            folderName,
            eventType,
            notes,
            isValid,
            errorReason,
          };
        });

        setParsedRows(rows);
        const validCount = rows.filter((r) => r.isValid).length;
        toast.success(`Parsed ${rows.length} rows (${validCount} valid date entries found).`);
      } catch (err: any) {
        console.error("Excel parse error:", err);
        toast.error("Failed to parse Excel file. Please ensure it is a valid .xlsx, .xls, or .csv file.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Download Sample Template
  const handleDownloadSample = () => {
    const sampleData = [
      {
        "Name": "Mom",
        "Date": "1980-05-15",
        "Relation": "Mother",
        "Special Rating": 10,
        "Folder": "Family",
        "Event Type": "birthday",
        "Notes": "Loves flowers and chocolate cake",
      },
      {
        "Name": "John & Sarah",
        "Date": "2020-10-24",
        "Relation": "Best Friend",
        "Special Rating": 9,
        "Folder": "Close Friends",
        "Event Type": "anniversary",
        "Notes": "10th wedding anniversary",
      },
      {
        "Name": "Alex Rivera",
        "Date": "1995-12-04",
        "Relation": "Colleague",
        "Special Rating": 7,
        "Folder": "Work",
        "Event Type": "birthday",
        "Notes": "Office teammate",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Close Ones Dates");
    XLSX.writeFile(workbook, "wishey_dates_sample_template.xlsx");
    toast.success("Sample template downloaded!");
  };

  // Submit parsed rows
  const handleSubmitImport = async () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      toast.error("No valid date rows to import.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/dates/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: validRows,
          defaultFolderId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          data.message || `Successfully imported ${data.importedCount} dates!`
        );
        onSuccess();
        onClose();
      } else {
        toast.error(data.error || "Bulk import failed.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during import.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-background border border-border/60 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Import Dates from Excel / CSV</h3>
              <p className="text-xs text-muted-foreground">
                Upload your spreadsheet to add multiple close ones' dates in bulk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5">
          {/* File Upload Drag & Drop Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileProcess(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? "border-emerald-500 bg-emerald-500/10 scale-[0.99]"
                : "border-border/60 hover:border-emerald-500/50 hover:bg-accent/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileProcess(e.target.files[0]);
                }
              }}
            />

            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-bold">
                {fileName ? fileName : "Click to select or drag & drop Excel / CSV file"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Supports .xlsx, .xls, and .csv files
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadSample();
              }}
              className="mt-1 text-xs font-semibold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download Sample Excel Template
            </Button>
          </div>

          {/* Config: Default Folder */}
          <div className="p-4 rounded-xl bg-accent/30 border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Fallback Folder
              </label>
              <p className="text-xs text-muted-foreground">
                Assigned to dates that do not have a folder specified in the Excel file
              </p>
            </div>

            <select
              value={defaultFolderId}
              onChange={(e) => setDefaultFolderId(e.target.value)}
              className="h-9 px-3 rounded-lg border border-input bg-background text-xs font-semibold focus:outline-none"
            >
              <option value="none">📂 Uncategorized / No Folder</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  📁 {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Parsed Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <span>Excel Preview</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold">
                    {validCount} Valid / {parsedRows.length} Total
                  </span>
                </h4>
              </div>

              <div className="border border-border/50 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-accent/60 sticky top-0 font-bold border-b border-border/40">
                    <tr>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Name</th>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Relation</th>
                      <th className="p-2.5">Rating</th>
                      <th className="p-2.5">Folder</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {parsedRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={row.isValid ? "hover:bg-accent/20" : "bg-rose-500/10"}
                      >
                        <td className="p-2.5 font-bold">
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-500" title={row.errorReason}>
                              <AlertCircle className="w-3.5 h-3.5" /> {row.errorReason}
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 font-bold">{row.name || "—"}</td>
                        <td className="p-2.5">{row.date || "—"}</td>
                        <td className="p-2.5">{row.relation}</td>
                        <td className="p-2.5 font-semibold text-amber-500">{row.specialRating}/10</td>
                        <td className="p-2.5 italic">
                          {row.folderName ? `📁 ${row.folderName}` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmitImport}
            disabled={isSubmitting || validCount === 0}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-md cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importing Dates...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-1.5" />
                Import {validCount} Date(s)
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
