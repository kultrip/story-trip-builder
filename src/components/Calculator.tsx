import React, { useMemo, useState } from "react";
import { Users, DollarSign, BarChart2 } from "lucide-react";

type Props = {
  currency?: string; // default "$"
  defaultUpliftPercent?: number; // e.g. 150
  onRequestReport?: (data: any) => void;
};

const formatCurrency = (v: number, currency = "$") =>
  `${currency}${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function Calculator({
  currency = "$",
  defaultUpliftPercent = 150,
  onRequestReport,
}: Props) {
  const [visits, setVisits] = useState<number>(5000);
  const [leadConv, setLeadConv] = useState<number>(2.0);
  const [salesConv, setSalesConv] = useState<number>(10.0);
  const [avgTicket, setAvgTicket] = useState<number>(1500);
  const [upliftPercent, setUpliftPercent] = useState<number>(defaultUpliftPercent);

  const presets = [
    { label: "Conservative", value: 50 },
    { label: "Expected", value: 150 },
    { label: "Aggressive", value: 250 },
  ];

  const results = useMemo(() => {
    const V = Math.max(0, visits);
    const L = Math.max(0, leadConv) / 100;
    const S = Math.max(0, salesConv) / 100;
    const T = Math.max(0, avgTicket);

    const Leads0 = V * L;
    const Sales0 = Leads0 * S;
    const Revenue0 = Sales0 * T;

    const U = 1 + Math.max(0, upliftPercent) / 100;
    const Leads1 = Leads0 * U;
    const Sales1 = Leads1 * S;
    const Revenue1 = Sales1 * T;

    const DeltaRevenue = Revenue1 - Revenue0;

    return {
      Leads0,
      Sales0,
      Revenue0,
      Leads1,
      Sales1,
      Revenue1,
      DeltaRevenue,
    };
  }, [visits, leadConv, salesConv, avgTicket, upliftPercent]);

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 max-w-5xl mx-auto border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-sm font-medium">
            <BarChart2 className="w-4 h-4 text-primary" />
            Estimate your Kultrip-driven revenue uplift
          </div>
          <h3 className="text-2xl font-semibold mt-3">See how Kultrip could move the needle</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            Adjust your traffic and conversion numbers to preview the monthly and annual uplift. Default uplift = {defaultUpliftPercent}%.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">Sample assumptions</div>
          <div className="mt-2 text-sm text-gray-700">Visits: {visits.toLocaleString()}</div>
          <div className="text-sm text-gray-700">Avg ticket: {formatCurrency(avgTicket, currency)}</div>
        </div>
      </div>

      {/* Form */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" onSubmit={(e) => e.preventDefault()}>
        <label className="flex flex-col">
          <span className="text-sm text-gray-700 flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            Website visits / month
          </span>
          <input
            type="number"
            className="mt-2 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={visits}
            onChange={(e) => setVisits(Number(e.target.value))}
            min={0}
            aria-label="Website visits per month"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700">Conversion to leads (%)</span>
          <input
            type="number"
            className="mt-2 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={leadConv}
            onChange={(e) => setLeadConv(Number(e.target.value))}
            min={0}
            step={0.1}
            aria-label="Conversion to leads percentage"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700">Conversion to sales (%)</span>
          <input
            type="number"
            className="mt-2 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={salesConv}
            onChange={(e) => setSalesConv(Number(e.target.value))}
            min={0}
            step={0.1}
            aria-label="Conversion to sales percentage"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            Average ticket size ({currency})
          </span>
          <input
            type="number"
            className="mt-2 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={avgTicket}
            onChange={(e) => setAvgTicket(Number(e.target.value))}
            min={0}
            aria-label="Average ticket size"
          />
        </label>
      </form>

      {/* Presets & slider */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-sm text-gray-700">Kultrip uplift preset:</span>
          {presets.map((p) => (
            <button
              key={p.value}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-all duration-150 ${
                upliftPercent === p.value
                  ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow"
                  : "bg-white text-gray-700 border-gray-200 hover:shadow-sm"
              }`}
              onClick={() => setUpliftPercent(p.value)}
              type="button"
              aria-pressed={upliftPercent === p.value}
            >
              {p.label} ({p.value}%)
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={500}
            value={upliftPercent}
            onChange={(e) => setUpliftPercent(Number(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-primary to-secondary rounded-lg"
            aria-label="Uplift percent"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Uplift: <span className="font-medium">{upliftPercent}%</span>
            </div>
            <div className="text-xs text-muted-foreground">Projected increase vs baseline</div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <div className="col-span-1 md:col-span-2 p-6 rounded-lg bg-gradient-to-r from-card to-card/50 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Baseline monthly revenue</div>
              <div className="text-2xl font-bold mt-1">{formatCurrency(results.Revenue0, currency)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">With Kultrip</div>
              <div className="text-2xl font-bold text-primary mt-1">{formatCurrency(results.Revenue1, currency)}</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="px-3 py-2 rounded-md bg-white/60 border border-green-100">
              <div className="text-sm text-green-700 font-semibold">+{formatCurrency(results.DeltaRevenue, currency)} / mo</div>
              <div className="text-xs text-gray-500">~{formatCurrency(results.DeltaRevenue * 12, currency)} annual</div>
            </div>

            <div className="px-3 py-2 rounded-md bg-white/40 border border-gray-100">
              <div className="text-sm text-gray-700">Leads / mo</div>
              <div className="text-lg font-medium">{Math.round(results.Leads0)} → {Math.round(results.Leads1)}</div>
            </div>

            <div className="px-3 py-2 rounded-md bg-white/40 border border-gray-100">
              <div className="text-sm text-gray-700">Sales / mo</div>
              <div className="text-lg font-medium">{Math.round(results.Sales0)} → {Math.round(results.Sales1)}</div>
            </div>
          </div>
        </div>

        <aside className="p-6 rounded-lg bg-kultrip-purple/5 border border-kultrip-purple/10 text-center">
          <div className="text-sm text-gray-600">Estimated uplift</div>
          <div className="text-3xl font-bold text-kultrip-purple mt-2">{upliftPercent}%</div>
          <div className="text-xs text-gray-500 mt-2">Use this as a benchmark when talking to clients</div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              className="w-full px-3 py-2 bg-kultrip-purple text-white rounded-md"
              onClick={() =>
                onRequestReport?.({
                  visits,
                  leadConv,
                  salesConv,
                  avgTicket,
                  upliftPercent,
                  results,
                })
              }
              type="button"
            >
              Get my personalized ROI report
            </button>

            <a href="/contact" className="w-full inline-block px-3 py-2 border rounded-md text-sm text-gray-700">
              Schedule a demo
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}