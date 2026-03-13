"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
        propertyType: "",
        roofType: "",
        postCode: "",
        electricityBill: "",
        comments: "",
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    // 2️⃣ Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSelectChange = (id: string, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    // 3️⃣ Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json()
            if (res.ok) {
                setMessage("Lead submitted successfully!")
                setFormData({
                    name: "",
                    email: "",
                    phoneNumber: "",
                    propertyType: "",
                    roofType: "",
                    postCode: "",
                    electricityBill: "",
                    comments: "",
                })
            } else {
                setMessage(data.message || "Failed to submit lead.")
            }
        } catch (_error) {
            setMessage("Error submitting lead.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    {/* Lead Details */}
                    <FieldSet>
                        <FieldLegend>Lead Details</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <Input id="name" value={formData.name} onChange={handleChange} required />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input id="email" value={formData.email} onChange={handleChange} required />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                                <Input
                                    id="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSeparator />

                    {/* Property Details */}
                    <FieldSet>
                        <FieldLegend>Property Details</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="roofType">Roof Type</FieldLabel>
                                <Select onValueChange={value => handleSelectChange("roofType", value)}>
                                    <SelectTrigger id="roofType">
                                        <SelectValue placeholder="Select roof type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="tile">Tile</SelectItem>
                                            <SelectItem value="metal">Metal</SelectItem>
                                            <SelectItem value="flat">Flat</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="propertyType">Property Type</FieldLabel>
                                <Select onValueChange={value => handleSelectChange("propertyType", value)}>
                                    <SelectTrigger id="propertyType">
                                        <SelectValue placeholder="Select property type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="residential">Residential</SelectItem>
                                            <SelectItem value="commercial">Commercial</SelectItem>
                                            <SelectItem value="industrial">Industrial</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="postCode">Postcode</FieldLabel>
                                <Input id="postCode" value={formData.postCode} onChange={handleChange} required />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="electricityBill">Approx. Electricity Bill ($)</FieldLabel>
                                <Input
                                    id="electricityBill"
                                    value={formData.electricityBill}
                                    onChange={handleChange}
                                    required
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSeparator />

                    {/* Comments */}
                    <FieldSet>
                        <FieldLegend>Additional Comments</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="comments">Comments</FieldLabel>
                                <Textarea
                                    id="comments"
                                    value={formData.comments}
                                    onChange={handleChange}
                                    className="resize-none"
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    {/* Form Buttons */}
                    <Field orientation="horizontal" className="gap-2 mt-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Submitting..." : "Submit"}
                        </Button>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </Field>

                    {/* Message */}
                    {message && <p className="mt-2 text-sm text-blue-600">{message}</p>}
                </FieldGroup>
            </form>
        </div>
    )
}