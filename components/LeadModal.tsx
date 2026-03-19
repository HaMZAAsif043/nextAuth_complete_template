
import {Lead,formatDate} from "@/app/(admin)/dashboard/LeadDetailsTable";

export default function LeadModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            <div
                className="relative bg-white rounded-2xl border border-gray-100 shadow-xl w-full max-w-lg p-6 z-10"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <p className="text-xs font-semibold tracking-widest uppercase text-orange-500 mb-0.5">Lead Detail</p>
                        <h3 className="text-xl font-bold text-gray-900">{lead.name}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-300 cursor-pointer hover:text-gray-500 text-xl leading-none mt-1">✕</button>
                </div>

                <div className="flex items-center gap-3 mb-5">
                    {/* <div className={`px-3 py-1.5 rounded-lg ${scoreBg(lead.aiScore)} flex items-center gap-1.5`}>
                        <span className="text-xs text-gray-500">AI Score</span>
                        <span className={`text-base font-bold ${scoreColor(lead.aiScore)}`}>{lead.aiScore}</span>
                    </div> */}
                    {/* <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[lead.status]}`}>
                        {lead.status}
                    </span> */}
                    <span className="text-xs text-gray-400 ml-auto">{formatDate(lead.submissionDate)}</span>
                </div>

                {/* Detail grid */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    {[
                        { label: "Phone", value: lead.phone },
                        { label: "Email", value: lead.email },
                        { label: "Postcode", value: lead.postcode },
                        { label: "Property Type", value: lead.propertyType },
                        { label: "Roof Type", value: lead.roofType },
                        { label: "Electricity Bill", value: `£${lead.electricityBill}/mo` },
                        { label: "Full Address", value: lead.fullAddress || "Not provided", span: true },
                    ].map(({ label, value, span }) => (
                        <div key={label} className={span ? "col-span-2" : ""}>
                            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-0.5">{label}</p>
                            <p className="text-gray-800 font-medium">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-5 pt-4 border-t border-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}