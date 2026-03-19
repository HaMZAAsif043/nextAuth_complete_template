"use client";

import { useState } from "react";

// Simulated API response — GET /api/analytics/leads?range=7d
const RAW_LEADS: { date: string; leads: number }[] = [
    { date: "2026-03-13", leads: 93 },
    { date: "2026-03-14", leads: 107 },
    { date: "2026-03-15", leads: 119 },
    { date: "2026-03-16", leads: 124 },
    { date: "2026-03-17", leads: 118 },
    { date: "2026-03-18", leads: 109 },
    { date: "2026-03-19", leads: 117 },
];

function formatLabel(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
    });
}

function buildPath(pts: { x: number; y: number }[]) {
    if (pts.length < 2) return "";
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
        const cpx = (pts[i - 1].x + pts[i].x) / 2;
        d += ` C${cpx},${pts[i - 1].y} ${cpx},${pts[i].y} ${pts[i].x},${pts[i].y}`;
    }
    return d;
}

const data = RAW_LEADS.map((d) => ({ ...d, label: formatLabel(d.date) }));

export default function DailyChart() {
    const [hovered, setHovered] = useState<number | null>(null);

    const W = 700;
    const H = 200;
    const PAD = { top: 16, right: 16, bottom: 36, left: 52 };
    const cW = W - PAD.left - PAD.right;
    const cH = H - PAD.top - PAD.bottom;

    const max = Math.max(...data.map((d) => d.leads));
    const min = Math.min(...data.map((d) => d.leads));
    const span = max - min || 1;

    const pts = data.map((d, i) => ({
        x: PAD.left + (i / (data.length - 1)) * cW,
        y: PAD.top + cH - ((d.leads - min) / span) * cH,
        ...d,
    }));

    const line = buildPath(pts.map((p) => ({ x: p.x, y: p.y })));
    const area =
        line +
        ` L${pts[pts.length - 1].x},${PAD.top + cH} L${pts[0].x},${PAD.top + cH} Z`;

    const yTicks = Array.from({ length: 4 }, (_, i) =>
        Math.round(min + (span / 3) * i)
    );

    const hp = hovered !== null ? pts[hovered] : null;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full h-full">
            {/* Header */}
            <div className="mb-6">
                {/* <p className="text-xs font-semibold tracking-widest uppercase text-orange-500 mb-1">
                    Daily Overview
                </p> */}
                <h2 className="text-2xl font-bold text-gray-900 leading-none">
                    Lead Volume
                </h2>
                <p className="text-sm text-gray-400 mt-1">Past 7 days</p>
            </div>

            {/* Chart */}
            <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full"
                style={{ height: 200 }}
                onMouseLeave={() => setHovered(null)}
            >
                <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ea580c" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#fde68a" />
                        <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                </defs>

                {/* Y grid + labels */}
                {yTicks.map((v, i) => {
                    const y = PAD.top + cH - ((v - min) / span) * cH;
                    return (
                        <g key={i}>
                            <line
                                x1={PAD.left} y1={y}
                                x2={W - PAD.right} y2={y}
                                stroke="#f3f4f6" strokeWidth={1}
                            />
                            <text
                                x={PAD.left - 8} y={y + 5}
                                textAnchor="end" fontSize={13} fill="#9ca3af"
                            >
                                {v}
                            </text>
                        </g>
                    );
                })}

                {/* X labels */}
                {pts.map((p, i) => (
                    <text
                        key={i}
                        x={p.x} y={H - 4}
                        textAnchor="middle" fontSize={13} fill="#9ca3af"
                    >
                        {p.label}
                    </text>
                ))}

                {/* Area */}
                <path d={area} fill="url(#areaFill)" />

                {/* Line */}
                <path
                    d={line}
                    fill="none"
                    stroke="url(#lineStroke)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Hover zones */}
                {pts.map((p, i) => {
                    const x0 = i === 0 ? PAD.left : (p.x + pts[i - 1].x) / 2;
                    const x1 = i === pts.length - 1 ? W - PAD.right : (p.x + pts[i + 1].x) / 2;
                    return (
                        <rect
                            key={i}
                            x={x0} y={PAD.top}
                            width={x1 - x0} height={cH}
                            fill="transparent"
                            onMouseEnter={() => setHovered(i)}
                        />
                    );
                })}

                {/* Hover dot + tooltip */}
                {hp && (
                    <>
                        <line
                            x1={hp.x} y1={PAD.top}
                            x2={hp.x} y2={PAD.top + cH}
                            stroke="#e5e7eb" strokeDasharray="3,3"
                        />
                        <circle cx={hp.x} cy={hp.y} r={4} fill="#ea580c" stroke="white" strokeWidth={2} />
                        {(() => {
                            const tx = hp.x > W - 130 ? hp.x - 125 : hp.x + 10;
                            const ty = hp.y < PAD.top + 50 ? hp.y + 8 : hp.y - 50;
                            return (
                                <g>
                                    <rect x={tx} y={ty} width={118} height={42} rx={6} fill="white" stroke="#e5e7eb" strokeWidth={1} />
                                    <text x={tx + 10} y={ty + 16} fontSize={12} fill="#6b7280">{hp.label}</text>
                                    <text x={tx + 10} y={ty + 33} fontSize={14} fontWeight="600" fill="#ea580c">
                                        {hp.leads} leads
                                    </text>
                                </g>
                            );
                        })()}
                    </>
                )}
            </svg>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <p className="text-xs text-gray-300">
                    {data[0].label} — {data[data.length - 1].label}
                </p>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-yellow-200 to-orange-600" />
                    <p className="text-xs text-gray-400">Leads per day</p>
                </div>
            </div>
        </div>
    );
}