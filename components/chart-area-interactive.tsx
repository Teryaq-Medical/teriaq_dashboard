"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { DashboardService } from "@/services/api.services";
import { useTranslations, useLocale } from "next-intl";

interface ChartAreaInteractiveProps {
  dashboardType: string;
}

const chartConfig = {
  count: {
    label: "Count",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({ dashboardType }: ChartAreaInteractiveProps) {
  const t = useTranslations("dashboard.chart");
  const locale = useLocale();                    // "en" or "ar"
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [chartType, setChartType] = React.useState<"appointments" | "lab_bookings">("appointments");

  // For labs, default to lab_bookings; for others, appointments
  React.useEffect(() => {
    setChartType(dashboardType === "lab" ? "lab_bookings" : "appointments");
  }, [dashboardType]);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await DashboardService.getChartData(chartType, timeRange);
        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [chartType, timeRange]);

  if (dashboardType === "doctor") {
    return null;
  }

  // Dynamic title based on chart type
  const title =
    chartType === "appointments"
      ? t("appointmentsTrend")
      : t("labBookingsTrend");

  // Human‑readable time range label
  const timeRangeLabel =
    timeRange === "90d"
      ? t("last3Months")
      : timeRange === "30d"
      ? t("last30Days")
      : t("last7Days");

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {t("totalForLast")} {timeRangeLabel}
        </CardDescription>
        <CardAction>
          {dashboardType !== "lab" && (
            <ToggleGroup
              type="single"
              value={chartType}
              onValueChange={(val) => val && setChartType(val as any)}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="appointments">
                {t("appointments")}
              </ToggleGroupItem>
              <ToggleGroupItem value="lab_bookings">
                {t("labBookings")}
              </ToggleGroupItem>
            </ToggleGroup>
          )}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label={t("totalForLast")}
            >
              <SelectValue placeholder={t("last3Months")} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                {t("last3Months")}
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                {t("last30Days")}
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                {t("last7Days")}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="h-[250px] flex items-center justify-center">
            {t("loading")}
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            {t("noData")}
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString(locale, {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area
                dataKey="count"
                type="natural"
                fill="url(#fillCount)"
                stroke="var(--color-count)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}