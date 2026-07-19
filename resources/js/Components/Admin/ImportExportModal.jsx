import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { AlertCircle, Download, FileDown, Loader2, UploadCloud } from "lucide-react";

import Modal from "@/Components/Modal";
import { FrontButton } from "@/Components/Front/Button";

const TEMPLATE_HEADER = ["name", "sku", "brand", "price", "stock"];
const TEMPLATE_EXAMPLE = ["Chinigura Rice, 5kg", "SKU-EXAMPLE01", "Pran", "620", "40"];

function parseCsv(text) {
    const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
    if (lines.length === 0) return { header: [], rows: [] };

    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows = lines.slice(1).map((line) => {
        const cells = line.split(",").map((c) => c.trim());
        return Object.fromEntries(header.map((key, i) => [key, cells[i] ?? ""]));
    });

    return { header, rows };
}

export default function ImportExportModal({ open, onClose }) {
    const inputRef = useRef(null);
    const [parsed, setParsed] = useState(null);
    const [fileName, setFileName] = useState("");
    const [importing, setImporting] = useState(false);
    const [error, setError] = useState("");

    const downloadTemplate = () => {
        const csv = [TEMPLATE_HEADER.join(","), TEMPLATE_EXAMPLE.join(",")].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "dokan-product-import-template.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleFile = (file) => {
        setError("");
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = () => {
            const { header, rows } = parseCsv(String(reader.result));
            if (!header.includes("name") || !header.includes("sku")) {
                setError("The file needs at least \"name\" and \"sku\" columns.");
                setParsed(null);
                return;
            }
            setParsed(rows);
        };
        reader.readAsText(file);
    };

    const confirmImport = () => {
        setImporting(true);
        router.post(
            route("admin.products.import"),
            { rows: parsed },
            {
                preserveScroll: true,
                onFinish: () => setImporting(false),
                onSuccess: () => {
                    setParsed(null);
                    setFileName("");
                    onClose();
                },
                onError: () => setError("Some rows couldn't be imported — check the format and try again."),
            },
        );
    };

    const reset = () => {
        setParsed(null);
        setFileName("");
        setError("");
    };

    return (
        <Modal
            show={open}
            onClose={onClose}
            maxWidth="lg"
            panelClassName="!rounded-2xl !border !border-front-line !bg-front-surface"
        >
            <div className="p-6">
                <h2 className="font-display text-xl font-medium text-front-ink">
                    Import / Export products
                </h2>
                <p className="mt-1 text-sm text-front-muted">
                    Bring in a product list from a spreadsheet, or download your
                    current catalog.
                </p>

                <div className="mt-6 rounded-xl border border-front-line p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-front-ink">Export catalog</p>
                            <p className="text-xs text-front-muted">
                                Download every product as a CSV file
                            </p>
                        </div>
                        <a
                            href={route("admin.products.export")}
                            className="flex items-center gap-1.5 rounded-full border border-front-line px-3 py-1.5 text-xs font-medium text-front-ink hover:border-front-accent hover:text-front-accent"
                        >
                            <Download size={13} />
                            Export CSV
                        </a>
                    </div>
                </div>

                <div className="mt-4 rounded-xl border border-front-line p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-front-ink">Import products</p>
                            <p className="text-xs text-front-muted">
                                Upload a CSV using our template
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={downloadTemplate}
                            className="flex items-center gap-1.5 rounded-full border border-front-line px-3 py-1.5 text-xs font-medium text-front-ink hover:border-front-accent hover:text-front-accent"
                        >
                            <FileDown size={13} />
                            Get template
                        </button>
                    </div>

                    {!parsed ? (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="mt-4 flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-front-line py-8 text-front-muted hover:border-front-accent hover:text-front-accent"
                        >
                            <UploadCloud size={20} />
                            <span className="text-xs">
                                {fileName || "Click to upload a CSV file"}
                            </span>
                        </button>
                    ) : (
                        <div className="mt-4">
                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-xs text-front-muted">
                                    {parsed.length} row{parsed.length === 1 ? "" : "s"} ready from{" "}
                                    {fileName}
                                </p>
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="text-xs text-front-muted hover:text-front-ink"
                                >
                                    Choose a different file
                                </button>
                            </div>
                            <div className="max-h-48 overflow-y-auto rounded-lg border border-front-line">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-front-line text-front-muted">
                                            <th className="px-3 py-2">Name</th>
                                            <th className="px-3 py-2">SKU</th>
                                            <th className="px-3 py-2">Brand</th>
                                            <th className="px-3 py-2">Price</th>
                                            <th className="px-3 py-2">Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parsed.slice(0, 8).map((row, i) => (
                                            <tr key={i} className="border-b border-front-line last:border-b-0">
                                                <td className="px-3 py-2 text-front-ink/85">{row.name}</td>
                                                <td className="px-3 py-2 text-front-muted">{row.sku}</td>
                                                <td className="px-3 py-2 text-front-muted">{row.brand}</td>
                                                <td className="px-3 py-2 text-front-muted">{row.price}</td>
                                                <td className="px-3 py-2 text-front-muted">{row.stock}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <input
                        ref={inputRef}
                        type="file"
                        accept=".csv,text/csv"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files?.[0]) handleFile(e.target.files[0]);
                            e.target.value = "";
                        }}
                    />

                    {error && (
                        <p className="mt-3 flex items-center gap-1.5 text-xs text-red-400">
                            <AlertCircle size={13} />
                            {error}
                        </p>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-front-line px-4 py-2 text-sm font-medium text-front-ink hover:border-front-accent"
                    >
                        Close
                    </button>
                    {parsed && (
                        <FrontButton onClick={confirmImport} disabled={importing}>
                            {importing ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" />
                                    Importing
                                </>
                            ) : (
                                `Import ${parsed.length} product${parsed.length === 1 ? "" : "s"}`
                            )}
                        </FrontButton>
                    )}
                </div>
            </div>
        </Modal>
    );
}
