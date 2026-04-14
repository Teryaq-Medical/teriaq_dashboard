"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionCardsProps {
  stats: any;
  dashboardType: string;
}

export function SectionCards({ stats, dashboardType }: SectionCardsProps) {
  // Admin dashboard
  if (dashboardType === "admin") {
    const cards = [
      { label: "Total Doctors", value: stats?.doctors || 0, trend: "+12%", icon: <IconTrendingUp />, trendUp: true },
      { label: "Total Hospitals", value: stats?.hospitals || 0, trend: "+5%", icon: <IconTrendingUp />, trendUp: true },
      { label: "Total Clinics", value: stats?.clinics || 0, trend: "+8%", icon: <IconTrendingUp />, trendUp: true },
      { label: "Total Labs", value: stats?.labs || 0, trend: "+3%", icon: <IconTrendingUp />, trendUp: true },
      { label: "Appointments", value: stats?.appointments || 0, trend: "+15%", icon: <IconTrendingUp />, trendUp: true },
      { label: "Lab Bookings", value: stats?.lab_bookings || 0, trend: "+10%", icon: <IconTrendingUp />, trendUp: true },
    ];
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {cards.map((card, idx) => (
          <Card key={idx} className="@container/card">
            <CardHeader>
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline" className={card.trendUp ? "text-green-600" : "text-red-600"}>
                  {card.icon}
                  {card.trend}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.trendUp ? "Trending up" : "Trending down"} this period
              </div>
              <div className="text-muted-foreground">Total {card.label.toLowerCase()}</div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // Doctor dashboard
  if (dashboardType === "doctor") {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Total Appointments</CardDescription>
            <CardTitle className="text-2xl font-semibold">{stats?.appointments || 0}</CardTitle>
          </CardHeader>
          <CardFooter>Your upcoming and past appointments</CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Your Rating</CardDescription>
            <CardTitle className="text-2xl font-semibold">{stats?.rating || 0} / 5</CardTitle>
          </CardHeader>
          <CardFooter>Based on patient feedback</CardFooter>
        </Card>
      </div>
    );
  }

  // Hospital/Clinic dashboard
  if (dashboardType === "hospital" || dashboardType === "clinic") {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Specialists</CardDescription>
            <CardTitle className="text-2xl font-semibold">{stats?.specialists || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Doctors on Team</CardDescription>
            <CardTitle className="text-2xl font-semibold">{stats?.doctors || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Appointments</CardDescription>
            <CardTitle className="text-2xl font-semibold">{stats?.appointments || 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Lab dashboard
  if (dashboardType === "lab") {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Total Lab Bookings</CardDescription>
            <CardTitle className="text-2xl font-semibold">{stats?.bookings || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Pending Reviews</CardDescription>
            <CardTitle className="text-2xl font-semibold">0</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return null;
}