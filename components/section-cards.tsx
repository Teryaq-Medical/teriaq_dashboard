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
import { useTranslations } from "next-intl";

interface SectionCardsProps {
  stats: any;
  dashboardType: string;
}

export function SectionCards({ stats, dashboardType }: SectionCardsProps) {
  const t = useTranslations("dashboard");

  // Admin dashboard
  if (dashboardType === "admin") {
    const cards = [
      {
        label: t("admin.totalDoctors"),
        value: stats?.doctors || 0,
        trend: "+12%",
        trendUp: true,
      },
      {
        label: t("admin.totalHospitals"),
        value: stats?.hospitals || 0,
        trend: "+5%",
        trendUp: true,
      },
      {
        label: t("admin.totalClinics"),
        value: stats?.clinics || 0,
        trend: "+8%",
        trendUp: true,
      },
      {
        label: t("admin.totalLabs"),
        value: stats?.labs || 0,
        trend: "+3%",
        trendUp: true,
      },
      {
        label: t("admin.appointments"),
        value: stats?.appointments || 0,
        trend: "+15%",
        trendUp: true,
      },
      {
        label: t("admin.labBookings"),
        value: stats?.lab_bookings || 0,
        trend: "+10%",
        trendUp: true,
      },
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
                <Badge
                  variant="outline"
                  className={card.trendUp ? "text-green-600" : "text-red-600"}
                >
                  {card.trendUp ? (
                    <IconTrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <IconTrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {card.trend}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.trendUp
                  ? t("admin.trendingUp")
                  : t("admin.trendingDown")}{" "}
                {t("admin.thisPeriod")}
              </div>
              <div className="text-muted-foreground">
                {t("admin.total", { label: card.label.toLowerCase() })}
              </div>
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
            <CardDescription>
              {t("doctor.totalAppointments")}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {stats?.appointments || 0}
            </CardTitle>
          </CardHeader>
          <CardFooter>{t("doctor.upcomingPast")}</CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t("doctor.yourRating")}</CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {stats?.rating || 0} / 5
            </CardTitle>
          </CardHeader>
          <CardFooter>{t("doctor.patientFeedback")}</CardFooter>
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
            <CardDescription>
              {t("hospitalClinic.specialists")}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {stats?.specialists || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>
              {t("hospitalClinic.doctorsOnTeam")}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {stats?.doctors || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>
              {t("hospitalClinic.appointments")}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {stats?.appointments || 0}
            </CardTitle>
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
            <CardDescription>{t("lab.totalLabBookings")}</CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {stats?.bookings || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>{t("lab.pendingReviews")}</CardDescription>
            <CardTitle className="text-2xl font-semibold">0</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return null;
}