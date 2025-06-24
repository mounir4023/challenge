/*
import React from 'react'

export default function Dashboard() {
  return (
    <div>Dashboard</div>
  )
}
*/

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function ThemePreview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Alert>
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>
              This is a simple alert styled by bg-card and text-muted-foreground.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Destructive Alert</AlertTitle>
            <AlertDescription>
              This is a destructive alert using text-destructive.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {[
            "primary",
            "primary-foreground",
            "secondary",
            "secondary-foreground",
            "accent",
            "accent-foreground",
            "muted",
            "muted-foreground",
            "destructive",
            "destructive-foreground",
            "background",
            "foreground",
            "border",
            "ring",
            "card",
            "card-foreground",
          ].map((name) => (
            <div
              key={name}
              className="flex flex-col items-center gap-1 p-2 rounded border"
              style={{ backgroundColor: `var(--${name})`, color: `var(--${name.includes("foreground") ? "background" : "foreground"})` }}
            >
              <div className="rounded-full size-8 border border-black/10" style={{ backgroundColor: `var(--${name})` }} />
              <code className="text-xs">--{name}</code>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}