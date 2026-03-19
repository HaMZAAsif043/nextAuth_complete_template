"use client";

import { useState } from "react";

// Simulated API response — GET /api/analytics/leads?range=7w&group=week
const WEEKLY_LEADS: { weekStart: string; weekEnd: string; leads: number }[] = [
    { weekStart: "2026-01-26", weekEnd: "2026-02-01", leads: 431 },
    { weekStart: "2026-02-02", weekEnd: "2026-02-08", leads: 509 },
    { weekStart: "2026-02-09", weekEnd: "2026-02-15", leads: 614 },
    { weekStart: "2026-02-16", weekEnd: "2026-02-22", leads: 573 },
    { weekStart: "2026-02-23", weekEnd: "2026-03-01", leads: 498 },
    { weekStart: "2026-03-02", weekEnd: "2026-03-08", leads: 661 },
    { weekStart: "2026-03-09", weekEnd: "2026-03-15", leads: 735 },
];

function shortDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
    });
}

export default function WeeklyChart() {
    const [hovered, setHovered] = useState<number | null>(null);

    const max = Math.max(...WEEKLY_LEADS.map((d) => d.leads));
    const total = WEEKLY_LEADS.reduce((s, d) => s + d.leads, 0);
    const avg = Math.round(total / WEEKLY_LEADS.length);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    {/* <p className="text-xs font-semibold tracking-widest uppercase text-orange-500 mb-1">
                        Weekly Overview
                    </p> */}
                    <h2 className="text-2xl font-bold text-gray-900 leading-none">
                        Lead Volume
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Past 7 weeks</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400 mb-0.5">7-week avg</p>
                    <p className="text-2xl font-bold text-gray-900 tabular-nums">
                        {avg.toLocaleString()}
                        <span className="text-base font-normal text-gray-400 ml-1">/ wk</span>
                    </p>
                </div>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-3 h-52">
                {WEEKLY_LEADS.map((d, i) => {
                    const heightPct = (d.leads / max) * 100;
                    const isHovered = hovered === i;
                    const isMax = d.leads === max;

                    return (
                        <div
                            key={i}
                            className="flex-1 flex flex-col items-center gap-2 h-full cursor-pointer"
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            {/* Value label */}
                            <div
                                className={`text-sm font-semibold tabular-nums transition-all duration-150 ${isHovered ? "text-orange-600" : "text-transparent"
                                    }`}
                            >
                                {d.leads.toLocaleString()}
                            </div>

                            {/* Bar */}
                            <div className="flex-1 w-full flex items-end">
                                <div
                                    className="w-full rounded-t-lg transition-all duration-200 relative"
                                    style={{
                                        height: `${heightPct}%`,
                                        background: isHovered
                                            ? "linear-gradient(to top, #ea580c, #fb923c)"
                                            : isMax
                                                ? "linear-gradient(to top, #ea580c20, #ea580c40)"
                                                : "linear-gradient(to top, #ea580c10, #ea580c25)",
                                        border: isHovered
                                            ? "1.5px solid #ea580c"
                                            : isMax
                                                ? "1.5px solid #ea580c60"
                                                : "1.5px solid #ea580c20",
                                    }}
                                >
                                    <div
                                        className="absolute top-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200"
                                        style={{
                                            background: isHovered ? "#fde68a" : isMax ? "#ea580c80" : "#ea580c30",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Week label */}
                            <div className="text-center">
                                <p
                                    className={`text-xs font-medium transition-colors duration-150 leading-tight ${isHovered ? "text-orange-500" : "text-gray-400"
                                        }`}
                                >
                                    {shortDate(d.weekStart)}
                                </p>
                                <p className="text-[10px] text-gray-300 leading-tight">
                                    – {shortDate(d.weekEnd)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <p className="text-xs text-gray-300">
                    {shortDate(WEEKLY_LEADS[0].weekStart)} — {shortDate(WEEKLY_LEADS[WEEKLY_LEADS.length - 1].weekEnd)}
                </p>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-yellow-200 to-orange-600" />
                    <p className="text-xs text-gray-400">Leads per week</p>
                </div>
            </div>
        </div>
    );
}