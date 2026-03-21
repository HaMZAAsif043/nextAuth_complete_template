"use client"

import { useState } from "react"
import { Clock3, MapPinHouse, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function LeadForm() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        fullAddress: "",
        propertyType: "",
        roofType: "",
        postCode: "",
        electricityBill: "",
        comments: "",
    })

    const [loading, setLoading] = useState(false)
    const [addressLookupLoading, setAddressLookupLoading] = useState(false)
    const [resolvedAddress, setResolvedAddress] = useState<string | null>(null)
    const inputClassName = "h-11 border-orange-200/80 bg-white/95 shadow-[0_1px_0_rgba(0,0,0,0.02)] focus-visible:border-orange-400 focus-visible:ring-orange-100"
    const selectClassName = "h-11 w-full border-orange-200/80 bg-white/95 focus-visible:border-orange-400 focus-visible:ring-orange-100"

    // 2️⃣ Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSelectChange = (id: string, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const lookupAddress = async () => {
        const postCode = formData.postCode.trim()
        if (postCode.length < 4) return

        setAddressLookupLoading(true)
        setResolvedAddress(null)
        try {
            const res = await fetch(`/api/postcode?postCode=${encodeURIComponent(postCode)}`)
            const data = await res.json()

            if (!res.ok || !data.address) return

            setResolvedAddress(data.address)
            setFormData(prev => ({
                ...prev,
                fullAddress: prev.fullAddress.trim() ? prev.fullAddress : data.address,
            }))
        } catch {
            // Keep manual entry fallback when lookup fails.
        } finally {
            setAddressLookupLoading(false)
        }
    }

    // 3️⃣ Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json()
            if (res.ok) {
                toast.success("Thank you for your interest. A suitable solar company will be in contact soon.")
                setFormData({
                    name: "",
                    email: "",
                    phoneNumber: "",
                    fullAddress: "",
                    propertyType: "",
                    roofType: "",
                    postCode: "",
                    electricityBill: "",
                    comments: "",
                })
            } else if (data.fieldErrors && Array.isArray(data.fieldErrors) && data.fieldErrors.length > 0) {
                // Show each field validation error as a separate descriptive toast
                data.fieldErrors.forEach((err: { field: string; message: string }) => {
                    const fieldLabel = err.field
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (s: string) => s.toUpperCase())
                        .trim()
                    toast.error(`${fieldLabel}: ${err.message}`)
                })
            } else {
                toast.error(data.message || "Failed to submit lead.")
            }
        } catch (_error) {
            toast.error("Error submitting lead.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto w-full max-w-3xl">
            <form onSubmit={handleSubmit}>
                <FieldGroup className="gap-6">
                    <div className="grid grid-cols-1 gap-2 rounded-2xl border border-orange-200/80 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 p-3 text-xs text-orange-700 sm:grid-cols-3 sm:text-sm">
                        <p className="flex items-center justify-center gap-1.5 font-medium"><Clock3 className="h-4 w-4" /> Takes 2 minutes</p>
                        <p className="flex items-center justify-center gap-1.5 font-medium"><ShieldCheck className="h-4 w-4" /> Data stays private</p>
                        <p className="flex items-center justify-center gap-1.5 font-medium"><Sparkles className="h-4 w-4" /> Free quote today</p>
                    </div>

                    {/* Lead Details */}
                    <FieldSet className="rounded-2xl border border-orange-100 bg-gradient-to-b from-orange-50/70 to-white p-4 shadow-[0_10px_30px_-24px_rgba(249,115,22,0.55)] md:p-5">
                        <FieldLegend className="flex items-center gap-2 text-gray-900">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">1</span>
                            Lead Details
                        </FieldLegend>
                        <FieldGroup className="grid gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="name" className="text-sm font-semibold text-gray-700">Name</FieldLabel>
                                <Input id="name" value={formData.name} onChange={handleChange} required className={inputClassName} />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email" className="text-sm font-semibold text-gray-700">Email</FieldLabel>
                                <Input id="email" value={formData.email} onChange={handleChange} required className={inputClassName} />
                            </Field>

                            <Field className="md:col-span-2">
                                <FieldLabel htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">Phone Number</FieldLabel>
                                <Input
                                    id="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className={inputClassName}
                                    required
                                />
                            </Field>

                            <Field className="md:col-span-2">
                                <FieldLabel htmlFor="fullAddress" className="text-sm font-semibold text-gray-700">Full Address</FieldLabel>
                                <div className="relative">
                                    <MapPinHouse className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-300" />
                                    <Input
                                        id="fullAddress"
                                        value={formData.fullAddress}
                                        onChange={handleChange}
                                        className="h-11 border-orange-200/80 bg-white/95 pl-9 focus-visible:border-orange-400 focus-visible:ring-orange-100"
                                        placeholder="Street, area, city"
                                        required={!formData.postCode.trim()}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">You can type this manually, or auto-fill using postcode below.</p>
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSeparator className="text-orange-300" />

                    {/* Property Details */}
                    <FieldSet className="rounded-2xl border border-orange-100 bg-gradient-to-b from-orange-50/70 to-white p-4 shadow-[0_10px_30px_-24px_rgba(249,115,22,0.55)] md:p-5">
                        <FieldLegend className="flex items-center gap-2 text-gray-900">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">2</span>
                            Property Details
                        </FieldLegend>
                        <FieldGroup className="grid gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="roofType" className="text-sm font-semibold text-gray-700">Roof Type</FieldLabel>
                                <Input
                                    id="roofType"
                                    value={formData.roofType}
                                    onChange={handleChange}
                                    className={inputClassName}
                                    placeholder="Type your roof type"
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="propertyType" className="text-sm font-semibold text-gray-700">Property Type</FieldLabel>
                                <Select onValueChange={value => handleSelectChange("propertyType", value)}>
                                    <SelectTrigger id="propertyType" className={selectClassName}>
                                        <SelectValue placeholder="Select property type" />
                                    </SelectTrigger>
                                    <SelectContent className="border border-orange-100">
                                        <SelectGroup>
                                            <SelectItem value="residential">Residential</SelectItem>
                                            <SelectItem value="commercial">Commercial</SelectItem>
                                            <SelectItem value="industrial">Industrial</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="postCode" className="text-sm font-semibold text-gray-700">Postcode</FieldLabel>
                                <div className="space-y-2">
                                    <Input
                                        id="postCode"
                                        value={formData.postCode}
                                        onChange={(e) => {
                                            handleChange(e)
                                            setResolvedAddress(null)
                                        }}
                                        onBlur={lookupAddress}
                                        required
                                        className={inputClassName}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={addressLookupLoading || !formData.postCode.trim()}
                                        onClick={lookupAddress}
                                        className="h-8 border-orange-200 bg-white px-3 text-xs text-orange-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                                    >
                                        {addressLookupLoading ? "Finding address..." : "Use postcode to fill address"}
                                    </Button>

                                    {/* Autofill confirmation badge */}
                                    {resolvedAddress && (
                                        <div className="flex items-start gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs">
                                            <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <div className="flex-1 min-w-0">
                                                <span className="font-semibold text-orange-700">Address found: </span>
                                                <span className="text-orange-600 break-words">{resolvedAddress}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setResolvedAddress(null)
                                                    setFormData(prev => ({ ...prev, fullAddress: "" }))
                                                }}
                                                className="flex-shrink-0 text-orange-400 hover:text-orange-600 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="electricityBill" className="text-sm font-semibold text-gray-700">Approx. Electricity Bill (£/month)</FieldLabel>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-orange-400">£</span>
                                    <Input
                                        id="electricityBill"
                                        inputMode="decimal"
                                        value={formData.electricityBill}
                                        onChange={handleChange}
                                        className={`${inputClassName} pl-7`}
                                        placeholder="e.g. 120"
                                        required
                                    />
                                </div>
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSeparator className="text-orange-300" />

                    {/* Comments */}
                    <FieldSet className="rounded-2xl border border-orange-100 bg-gradient-to-b from-orange-50/70 to-white p-4 shadow-[0_10px_30px_-24px_rgba(249,115,22,0.55)] md:p-5">
                        <FieldLegend className="flex items-center gap-2 text-gray-900">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">3</span>
                            Additional Comments
                        </FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="comments" className="text-sm font-semibold text-gray-700">Comments</FieldLabel>
                                <Textarea
                                    id="comments"
                                    value={formData.comments}
                                    onChange={handleChange}
                                    className="min-h-28 resize-none border-orange-200 bg-white/95 focus-visible:border-orange-400 focus-visible:ring-orange-100"
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    {/* Form Buttons */}
                    <Field orientation="horizontal" className="mt-2 gap-3">
                        <Button type="submit" disabled={loading} className="h-11 flex-1 border-orange-500 bg-gradient-to-r from-orange-500 to-amber-500 px-6 text-sm font-semibold text-white shadow-[0_12px_24px_-16px_rgba(245,115,22,0.8)] hover:from-orange-600 hover:to-amber-600 sm:flex-none">
                            {loading ? "Submitting..." : "Get My Free Quote"}
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => {
                                setFormData({
                                    name: "",
                                    email: "",
                                    phoneNumber: "",
                                    fullAddress: "",
                                    propertyType: "",
                                    roofType: "",
                                    postCode: "",
                                    electricityBill: "",
                                    comments: "",
                                })
                            }}
                            className="h-10 border-orange-200 bg-white px-5 text-sm text-orange-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                        >
                            Clear
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    )
}