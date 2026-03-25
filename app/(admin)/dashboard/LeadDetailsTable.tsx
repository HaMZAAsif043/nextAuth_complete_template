"use client";

import { useEffect, useState } from "react";
import LeadModal from "@/components/LeadModal";

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

type ApiLead = {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  postCode: string;
  propertyType: string;
  roofType: string;
  electricityBill: string;
  fullAddress?: string;
  createdAt: string;
  status?: string;
  aiScore?: number | null;
};

const DEFAULT_PAGE_SIZE = 10;

export function formatDate(d: string) {
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00` : d;
  return new Date(normalized).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function toUiStatus(value?: string): Status {
  const normalized = (value || "new").toLowerCase();
  if (normalized === "contacted") return "Contacted";
  if (normalized === "qualified") return "Qualified";
  if (normalized === "closed") return "Closed";
  return "New";
}

export default function LeadDetailsTable() {
  // ── input state (live, not yet committed) ──
  const [nameFilter, setNameFilter] = useState("");

  // ── committed API params (only these trigger fetch) ──
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState<"All" | "name" | "date">("All");
  const [sortOrder, setSortOrder] = useState<"All" | "asc" | "desc">("All");
  const [rowsPerPage, setRowsPerPage] = useState<number | "All">(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // ── UI state ──
  const [selected, setSelected] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0); // total count from API

  useEffect(() => {
    let isMounted = true;

    const loadLeads = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (rowsPerPage !== "All") params.append("limit", String(rowsPerPage));
        params.append("page", String(page));
        if (searchQuery) params.append("name", searchQuery);
        if (dateFilter) params.append("date", dateFilter);
        if (sortBy !== "All") params.append("sortBy", sortBy);
        if (sortOrder !== "All") params.append("sortOrder", sortOrder);

        const response = await fetch(`/api/leads?${params.toString()}`, { cache: "no-store" });
        if (!response.ok) return;

        const payload = (await response.json()) as { leads?: ApiLead[]; total?: number };

        const rows = (payload.leads || []).map((lead): Lead => ({
          id: lead.id,
          name: lead.name,
          phone: lead.phoneNumber,
          email: lead.email,
          postcode: lead.postCode,
          propertyType: lead.propertyType,
          roofType: lead.roofType,
          electricityBill: Number(lead.electricityBill) || 0,
          aiScore: typeof lead.aiScore === "number" ? lead.aiScore : 0,
          status: toUiStatus(lead.status),
          submissionDate: lead.createdAt,
          fullAddress: lead.fullAddress,
        }));

        if (isMounted) {
          setLeads(rows);
          setTotal(payload.total ?? rows.length); // fallback to rows.length if API doesn't return total
        }
      } catch {
        // silent
      }
      finally{
        if (isMounted) setLoading(false);
      }
    };

    loadLeads();
    return () => { isMounted = false; };
  }, [rowsPerPage, page, searchQuery, dateFilter, sortBy, sortOrder]);

  // ── pagination (server-driven) ──
  const effectivePageSize = rowsPerPage === "All" ? Math.max(1, total) : rowsPerPage;
  const totalPages = Math.max(1, Math.ceil(total / effectivePageSize));
  const currentPage = Math.min(page, totalPages);

  // ── CSV (downloads current page results from API) ──
  const downloadCSV = () => {
    if (!leads.length) return;

    const headers = ["ID", "Name", "Phone", "Email", "Address", "Property Type", "Roof Type", "Electricity Bill", "Submission Date"];
    const csvRows = leads.map((lead) => [
      lead.id,
      `"${lead.name}"`,
      `"${lead.phone}"`,
      `"${lead.email}"`,
      `"${lead.fullAddress || lead.postcode}"`,
      `"${lead.propertyType}"`,
      `"${lead.roofType}"`,
      lead.electricityBill,
      formatDate(lead.submissionDate),
    ]);

    const csvContent = [headers, ...csvRows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    setNameFilter("");
    setSearchQuery("");
    setDateFilter("");
    setSortBy("All");
    setSortOrder("All");
    setRowsPerPage(DEFAULT_PAGE_SIZE);
    setPage(1);
  };

  return (
    <>
      {selected && <LeadModal lead={selected} onClose={() => setSelected(null)} />}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full">
        <div className="px-6 py-4 flex flex-col gap-3 border-b border-gray-50">

          {/* ── Row 1: search bar + buttons ── */}
          <div className="flex gap-3 w-full">

            {/* Search Input - 50% */}
            <div className="relative" style={{ flex: '0 0 50%' }}>
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Filter by name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchQuery(nameFilter);
                    setPage(1);
                  }
                }}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 text-gray-700 placeholder-gray-300"
              />
            </div>

            {/* Search Button - 10% */}
            <button
              disabled={loading}
              onClick={() => { setSearchQuery(nameFilter); setPage(1); }}
              style={{ flex: '0 0 calc(10% - 6px)' }}
              className="text-xs font-semibold cursor-pointer text-orange-500 hover:text-orange-600 border border-orange-200 hover:border-orange-400 px-3 py-2 rounded-lg transition-all hover:bg-orange-50"
            >
              Search
            </button>

            {/* Reset Button - 10% */}
            <button
              disabled={loading}
              onClick={resetAll}
              style={{ flex: '0 0 calc(10% - 6px)' }}
              className="text-xs font-semibold cursor-pointer text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 px-3 py-2 rounded-lg transition-all hover:bg-gray-50"
            >
              All
            </button>

            {/* Download CSV - 30% */}
            <button
              disabled={loading}
              onClick={downloadCSV}
              style={{ flex: '0 0 calc(30% - 6px)' }}
              className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-semibold"
            >
              Download CSV
            </button>
          </div>

          {/* ── Row 2: date + sort filters ── */}
          <div className="flex gap-2">
            <input
              disabled={loading}
              type="date"
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
              style={{ flex: '0 0 50%' }}
              className="px-3 py-2 text-sm border cursor-pointer border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 text-gray-600 bg-white"
            />
            <select
              disabled={loading}
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as "All" | "name" | "date"); setPage(1); }}
              style={{ flex: '0 0 calc(25% - 4px)' }}
              className="px-3 py-2 text-sm border cursor-pointer border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 text-gray-600 bg-white"
            >
              <option value="All">All</option>
              <option value="name">Name</option>
              <option value="date">Date</option>
            </select>
            <select
              disabled={loading}
              value={sortOrder}
              onChange={(e) => { setSortOrder(e.target.value as "All" | "asc" | "desc"); setPage(1); }}
              style={{ flex: '0 0 calc(25% - 4px)' }}
              className="px-3 py-2 cursor-pointer text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 text-gray-600 bg-white"
            >
              <option value="All">All</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                {["Name", "Phone", "Email", "Address", "Date", ""].map((h, i) => (
                  <th key={i} className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-300">
                    No leads match your filters.
                  </td>
                </tr>
              ) : (
                leads.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-50 hover:bg-orange-50/30 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/40"}`}
                  >
                    <td className="px-6 py-3.5 font-semibold text-gray-800 whitespace-nowrap">{row.name}</td>
                    <td className="px-6 py-3.5 text-gray-500 whitespace-nowrap">{row.phone}</td>
                    <td className="px-6 py-3.5 text-gray-500 whitespace-nowrap">{row.email}</td>
                    <td className="px-6 py-3.5 text-gray-500 max-w-[280px] truncate" title={row.fullAddress || row.postcode}>
                      {row.fullAddress || row.postcode}
                    </td>
                    <td className="px-6 py-3.5 text-gray-400 whitespace-nowrap text-xs">{formatDate(row.submissionDate)}</td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelected(row)}
                        className="text-xs font-semibold cursor-pointer text-orange-500 hover:text-orange-600 border border-orange-200 hover:border-orange-400 px-3 py-1 rounded-lg transition-all hover:bg-orange-50"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="px-6 py-4 border-t border-gray-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-600">
              {total === 0 ? 0 : Math.min((currentPage - 1) * effectivePageSize + 1, total)}–{Math.min(currentPage * effectivePageSize, total)}
            </span>{" "}
            of <span className="font-semibold text-gray-600">{total}</span> leads
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-500">Rows</label>
              <select
                value={String(rowsPerPage)}
                disabled={loading}
                onChange={(e) => {
                  const value = e.target.value;
                  setRowsPerPage(value === "All" ? "All" : Number(value));
                  setPage(1);
                }}
                className="px-2 py-1.5 text-xs border cursor-pointer border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 text-gray-600 bg-white"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="All">All</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:border-orange-300 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 text-xs font-semibold cursor-pointer rounded-lg transition-all ${p === currentPage ? "bg-orange-600 text-white" : "text-gray-500 border border-gray-200 hover:border-orange-300 hover:text-orange-500"
                    }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:border-orange-300 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}