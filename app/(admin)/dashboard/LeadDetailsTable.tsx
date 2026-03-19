"use client";

import { useState, useMemo } from "react";
import LeadModal from "@/components/LeadModal";
// --- Types ---
type Status = "New" | "Contacted" | "Qualified" | "Closed";
export type Lead = {
    id: number;
    name: string;
    phone: string;
    email: string;
    postcode: string;
    propertyType: string;
    roofType: string;
    electricityBill: number;
    aiScore: number;
    status: Status;
    submissionDate: string;
    fullAddress?: string;
};

const LEADS: Lead[] = [
    { id: 1, name: "James Thornton", phone: "07700 900123", email: "james.thornton@email.co.uk", postcode: "SW1A 1AA", propertyType: "Detached", roofType: "Pitched Tile", electricityBill: 210, aiScore: 91, status: "Qualified", submissionDate: "2026-03-19" },
    { id: 2, name: "Priya Mehta", phone: "07700 900456", email: "priya.mehta@email.co.uk", postcode: "E1 6RF", propertyType: "Semi-Detached", roofType: "Flat", electricityBill: 185, aiScore: 78, status: "Contacted", submissionDate: "2026-03-18" },
    { id: 3, name: "Oliver Bennett", phone: "07700 900789", email: "oliver.bennett@email.co.uk", postcode: "M1 1AE", propertyType: "Terraced", roofType: "Pitched Slate", electricityBill: 140, aiScore: 55, status: "New", submissionDate: "2026-03-18" },
    { id: 4, name: "Sophia Williams", phone: "07700 900321", email: "sophia.williams@email.co.uk", postcode: "B1 1BB", propertyType: "Detached", roofType: "Pitched Tile", electricityBill: 320, aiScore: 96, status: "Qualified", submissionDate: "2026-03-17" },
    { id: 5, name: "Ethan Clarke", phone: "07700 900654", email: "ethan.clarke@email.co.uk", postcode: "LS1 1BA", propertyType: "Bungalow", roofType: "Flat", electricityBill: 95, aiScore: 42, status: "Closed", submissionDate: "2026-03-17" },
    { id: 6, name: "Amelia Foster", phone: "07700 900987", email: "amelia.foster@email.co.uk", postcode: "BS1 1AA", propertyType: "Semi-Detached", roofType: "Pitched Tile", electricityBill: 175, aiScore: 83, status: "Contacted", submissionDate: "2026-03-16" },
    { id: 7, name: "Noah Patel", phone: "07700 900147", email: "noah.patel@email.co.uk", postcode: "CF10 1EP", propertyType: "Detached", roofType: "Pitched Slate", electricityBill: 260, aiScore: 88, status: "Qualified", submissionDate: "2026-03-16" },
    { id: 8, name: "Isabella Morgan", phone: "07700 900258", email: "isabella.morgan@email.co.uk", postcode: "EH1 1YZ", propertyType: "Terraced", roofType: "Flat", electricityBill: 110, aiScore: 61, status: "New", submissionDate: "2026-03-15" },
    { id: 9, name: "Liam Robinson", phone: "07700 900369", email: "liam.robinson@email.co.uk", postcode: "G1 1AA", propertyType: "Bungalow", roofType: "Pitched Tile", electricityBill: 155, aiScore: 74, status: "Contacted", submissionDate: "2026-03-15" },
    { id: 10, name: "Charlotte Davies", phone: "07700 900741", email: "charlotte.davies@email.co.uk", postcode: "NE1 1ST", propertyType: "Detached", roofType: "Pitched Slate", electricityBill: 290, aiScore: 93, status: "Qualified", submissionDate: "2026-03-14" },
    { id: 11, name: "Harry Wilson", phone: "07700 900852", email: "harry.wilson@email.co.uk", postcode: "OX1 1BP", propertyType: "Semi-Detached", roofType: "Pitched Tile", electricityBill: 165, aiScore: 69, status: "New", submissionDate: "2026-03-14" },
    { id: 12, name: "Grace Thompson", phone: "07700 900963", email: "grace.thompson@email.co.uk", postcode: "PE1 1JA", propertyType: "Terraced", roofType: "Flat", electricityBill: 130, aiScore: 48, status: "Closed", submissionDate: "2026-03-13" },
    { id: 13, name: "Jack Anderson", phone: "07700 900174", email: "jack.anderson@email.co.uk", postcode: "PL1 1AA", propertyType: "Detached", roofType: "Pitched Tile", electricityBill: 240, aiScore: 87, status: "Qualified", submissionDate: "2026-03-13" },
    { id: 14, name: "Lily Jackson", phone: "07700 900285", email: "lily.jackson@email.co.uk", postcode: "RG1 1AA", propertyType: "Bungalow", roofType: "Pitched Slate", electricityBill: 200, aiScore: 79, status: "Contacted", submissionDate: "2026-03-12" },
    { id: 15, name: "George White", phone: "07700 900396", email: "george.white@email.co.uk", postcode: "SO14 1AA", propertyType: "Semi-Detached", roofType: "Flat", electricityBill: 120, aiScore: 53, status: "New", submissionDate: "2026-03-12" },
    { id: 16, name: "Mia Harris", phone: "07700 900417", email: "mia.harris@email.co.uk", postcode: "TN1 1AA", propertyType: "Detached", roofType: "Pitched Tile", electricityBill: 310, aiScore: 94, status: "Qualified", submissionDate: "2026-03-11" },
    { id: 17, name: "Alfie Martin", phone: "07700 900528", email: "alfie.martin@email.co.uk", postcode: "WA1 1AA", propertyType: "Terraced", roofType: "Pitched Slate", electricityBill: 145, aiScore: 66, status: "Contacted", submissionDate: "2026-03-11" },
    { id: 18, name: "Poppy Garcia", phone: "07700 900639", email: "poppy.garcia@email.co.uk", postcode: "YO1 9WX", propertyType: "Bungalow", roofType: "Flat", electricityBill: 90, aiScore: 38, status: "Closed", submissionDate: "2026-03-10" },
    { id: 19, name: "Freddie Lee", phone: "07700 900750", email: "freddie.lee@email.co.uk", postcode: "AB10 1AB", propertyType: "Detached", roofType: "Pitched Tile", electricityBill: 275, aiScore: 90, status: "Qualified", submissionDate: "2026-03-10" },
    { id: 20, name: "Daisy Walker", phone: "07700 900861", email: "daisy.walker@email.co.uk", postcode: "BN1 1AA", propertyType: "Semi-Detached", roofType: "Pitched Slate", electricityBill: 190, aiScore: 72, status: "New", submissionDate: "2026-03-09" },
];

const DEFAULT_PAGE_SIZE = 8;

const STATUS_STYLES: Record<Status, string> = {
    New: "bg-blue-50 text-blue-600 border border-blue-100",
    Contacted: "bg-amber-50 text-amber-600 border border-amber-100",
    Qualified: "bg-green-50 text-green-600 border border-green-100",
    Closed: "bg-gray-100 text-gray-500 border border-gray-200",
};

function scoreColor(score: number) {
    if (score >= 85) return "text-green-600";
    if (score >= 60) return "text-amber-500";
    return "text-red-400";
}

function scoreBg(score: number) {
    if (score >= 85) return "bg-green-50";
    if (score >= 60) return "bg-amber-50";
    return "bg-red-50";
}

export function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
    return (
        <span className={`ml-1 inline-flex flex-col leading-none ${active ? "text-orange-500" : "text-gray-300"}`}>
            <span className={`text-[8px] leading-none ${active && dir === "asc" ? "text-orange-500" : ""}`}>▲</span>
            <span className={`text-[8px] leading-none ${active && dir === "desc" ? "text-orange-500" : ""}`}>▼</span>
        </span>
    );
}

export default function LeadDetailsTable() {
    const [nameFilter, setNameFilter] = useState("");
    const [nameDraft, setNameDraft] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [dateDraft, setDateDraft] = useState("");
    const [sortBy, setSortBy] = useState<"All" | "name" | "date">("All");
    const [sortOrder, setSortOrder] = useState<"All" | "asc" | "desc">("All");
    const [rowsPerPage, setRowsPerPage] = useState<number | "All">(DEFAULT_PAGE_SIZE);
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Lead | null>(null);

    const filtered = useMemo(() => {
        let rows = [...LEADS];

        const q = nameFilter.toLowerCase();
        if (q) {
            rows = rows.filter(r => r.name.toLowerCase().includes(q));
        }

        if (dateFilter) {
            rows = rows.filter(r => r.submissionDate === dateFilter);
        }

        if (sortBy !== "All" && sortOrder !== "All") {
            const dir = sortOrder === "asc" ? 1 : -1;
            rows.sort((a, b) => {
                if (sortBy === "name") {
                    return a.name.localeCompare(b.name) * dir;
                }

                return (new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime()) * dir;
            });
        }

        return rows;
    }, [nameFilter, dateFilter, sortBy, sortOrder]);

    const effectivePageSize = rowsPerPage === "All" ? Math.max(1, filtered.length) : rowsPerPage;
    const totalPages = Math.max(1, Math.ceil(filtered.length / effectivePageSize));
    const currentPage = Math.min(page, totalPages);
    const pageRows = filtered.slice((currentPage - 1) * effectivePageSize, currentPage * effectivePageSize);

    function handleFilterChange() { setPage(1); }

    return (
        <>
            {selected && <LeadModal lead={selected} onClose={() => setSelected(null)} />}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full">                
                <div className="px-6 py-4 flex flex-col gap-3 border-b border-gray-50">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                        <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Filter by name"
                            value={nameDraft}
                            onChange={e => setNameDraft(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 text-gray-700 placeholder-gray-300"
                        />
                    </div>

                        <input
                            type="date"
                            value={dateDraft}
                            onChange={e => {
                                const value = e.target.value;
                                setDateDraft(value);
                                setDateFilter(value);
                                handleFilterChange();
                            }}
                            className="w-full px-3 py-2 text-sm border  cursor-pointer border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 text-gray-600 bg-white"
                        />

                        <select
                        value={sortBy}
                        onChange={e => { setSortBy(e.target.value as "All" | "name" | "date"); handleFilterChange(); }}
                        className="px-3 py-2 text-sm border cursor-pointer border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 text-gray-600 bg-white"
                    >
                        <option value="All">All</option>
                        <option value="name">Name</option>
                        <option value="date">Date</option>
                    </select>

                        <select
                        value={sortOrder}
                        onChange={e => { setSortOrder(e.target.value as "All" | "asc" | "desc"); handleFilterChange(); }}
                        className="px-3 py-2 cursor-pointer text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 text-gray-600 bg-white"
                    >
                        <option value="All">All</option>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setNameFilter(nameDraft);
                                handleFilterChange();
                            }}
                            className="text-xs font-semibold cursor-pointer text-orange-500 hover:text-orange-600 border border-orange-200 hover:border-orange-400 px-3 py-2 rounded-lg transition-all hover:bg-orange-50"
                        >
                            Search
                        </button>
                        <button
                            onClick={() => {
                                setNameDraft("");
                                setDateDraft("");
                                setNameFilter("");
                                setDateFilter("");
                                setSortBy("All");
                                setSortOrder("All");
                                setRowsPerPage(DEFAULT_PAGE_SIZE);
                                setPage(1);
                            }}
                            className="text-xs font-semibold cursor-pointer text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 px-3 py-2 rounded-lg transition-all hover:bg-gray-50"
                        >
                            All
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-50">
                                {["Name", "Phone", "Email", "Date", ""].map((h, i) => (
                                    <th
                                        key={i}
                                        className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-400 whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {pageRows.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-300">
                                        No leads match your filters.
                                    </td>
                                </tr>
                            ) : pageRows.map((row, i) => (
                                <tr
                                    key={row.id}
                                    className={`border-b border-gray-50 hover:bg-orange-50/30 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/40"}`}
                                >
                                    <td className="px-6 py-3.5 font-semibold text-gray-800 whitespace-nowrap">{row.name}</td>
                                    <td className="px-6 py-3.5 text-gray-500 whitespace-nowrap">{row.phone}</td>
                                    <td className="px-6 py-3.5 text-gray-500 whitespace-nowrap">{row.email}</td>
                                   
                                    <td className="px-6 py-3.5 text-gray-400 whitespace-nowrap text-xs">{formatDate(row.submissionDate)}</td>
                                    <td className="px-6 py-3.5 whitespace-nowrap cursor">
                                        <button
                                            onClick={() => setSelected(row)}
                                            className="text-xs font-semibold cursor-pointer text-orange-500 hover:text-orange-600 border border-orange-200 hover:border-orange-400 px-3 py-1 rounded-lg transition-all hover:bg-orange-50"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-gray-400">
                        Showing <span className="font-semibold text-gray-600">{Math.min((currentPage - 1) * effectivePageSize + 1, filtered.length)}–{Math.min(currentPage * effectivePageSize, filtered.length)}</span> of <span className="font-semibold text-gray-600">{filtered.length}</span> leads
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-gray-500">Rows</label>
                            <select
                                value={String(rowsPerPage)}
                                onChange={e => {
                                    const value = e.target.value;
                                    setRowsPerPage(value === "All" ? "All" : Number(value));
                                    setPage(1);
                                }}
                                className="px-2 py-1.5 text-xs border cursor-pointer border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 text-gray-600 bg-white"
                            >
                                <option value="5">5</option>
                                <option value="8">8</option>
                                <option value="12">12</option>
                                <option value="20">20</option>
                                <option value="All">All</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:border-orange-300 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            ← Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-8 h-8 text-xs font-semibold cursor-pointer rounded-lg transition-all ${p === currentPage
                                        ? "bg-orange-600 text-white"
                                        : "text-gray-500 border border-gray-200 hover:border-orange-300 hover:text-orange-500"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 text-xs font-semibold  curosor-pointer text-gray-500 border border-gray-200 rounded-lg hover:border-orange-300 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Next →
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}