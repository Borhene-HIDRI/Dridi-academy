"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

export default function PaymentTimeline({ payments }: { payments: any[] }) {
  if (!payments || payments.length === 0) {
    return null;
  }

  // Convert payments to date objects
  const parsed = payments.map(p => ({
    ...p,
    date: new Date(p.month + "-01")  // Convert "2025-08" to "2025-08-01"
  }))

  // Sort chronologically
  const sorted = parsed.sort((a, b) => a.date.getTime() - b.date.getTime())

  // Current month
  const now = new Date()
  const current = new Date(now.getFullYear(), now.getMonth(), 1)

  // Build 7-month window
  function addMonths(date: Date, months: number) {
    return new Date(date.getFullYear(), date.getMonth() + months, 1)
  }

  const windowMonths = [
    addMonths(current, -3),
    addMonths(current, -2),
    addMonths(current, -1),
    addMonths(current, 0),
    addMonths(current, 1),
    addMonths(current, 2),
    addMonths(current, 3),
  ]

  // Match available payment statuses with these months
  const timeline = windowMonths.map(winMonth => {
    const match = sorted.find(
      p => p.date.getFullYear() === winMonth.getFullYear() &&
           p.date.getMonth() === winMonth.getMonth()
    )

    return {
      month: winMonth.toISOString().slice(0, 7), // "2025-08"
      status: match?.status ?? "unknown"
    }
  })

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>Payment Timeline</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {timeline.map((p, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b border-zinc-800 pb-2"
            >
              <span className="text-zinc-300">{p.month}</span>

              <Badge
                className={
                  p.status === "paid"
                    ? "bg-green-600"
                    : p.status === "unpaid"
                    ? "bg-red-600"
                    : "bg-zinc-600"
                }
              >
                {p.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
