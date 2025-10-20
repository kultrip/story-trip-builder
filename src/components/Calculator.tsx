import React, { useMemo, useState } from "react";

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
    <section className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold mb-2">Estimate your Kultrip-driven revenue uplift</h3>
      <p className="text-sm text-gray-600 mb-4">
        Toggle Kultrip on to model a lift in lead conversion. Default uplift = {defaultUpliftPercent}%. 
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col">
          <span className="text-sm text-gray-700">Website visits / month</span>
          <input
            type="number"
            className="mt-1 p-2 border rounded"
            value={visits}
            onChange={(e) => setVisits(Number(e.target.value))}
            min={0}
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700">Conversion to leads (%)</span>
          <input
            type="number"
            className="mt-1 p-2 border rounded"
            value={leadConv}
            onChange={(e) => setLeadConv(Number(e.target.value))}
            min={0}
            step={0.1}
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700">Conversion to sales (%)</span>
          <input
            type="number"
            className="mt-1 p-2 border rounded"
            value={salesConv}
            onChange={(e) => setSalesConv(Number(e.target.value))}
            min={0}
            step={0.1}
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700">Average ticket size ({currency})</span>
          <input
            type="number"
            className="mt-1 p-2 border rounded"
            value={avgTicket}
            onChange={(e) => setAvgTicket(Number(e.target.value))}
            min={0}
          />
        </label>
      </div>

      <div className="mb-4">
        <span className="text-sm text-gray-700 mr-2">Kultrip uplift preset:</span>
        {presets.map((p) => (
          <button
            key={p.value}
            className={`mr-2 mb-2 px-3 py-1 rounded border ${
              upliftPercent === p.value ? "bg-kultrip-purple text-white" : "bg-white"
            }`}
            onClick={() => setUpliftPercent(p.value)}
          >
            {p.label} ({p.value}%)
          </button>
        ))}
        <div className="mt-2">
          <input
            type="range"
            min={0}
            max={500}
            value={upliftPercent}
            onChange={(e) => setUpliftPercent(Number(e.target.value))}
          />
          <div className="text-sm text-gray-600 mt-1">Uplift: {upliftPercent}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-xs text-gray-500">Baseline monthly revenue</div>
          <div className="text-xl font-bold">{formatCurrency(results.Revenue0, currency)}</div>

          <div className="text-xs text-gray-500 mt-3">Kultrip monthly revenue (with uplift)</div>
          <div className="text-xl font-bold">{formatCurrency(results.Revenue1, currency)}</div>

          <div className="text-sm text-green-600 mt-2">
            +{formatCurrency(results.DeltaRevenue, currency)} / month
          </div>
          <div className="text-xs text-gray-500">~{formatCurrency(results.DeltaRevenue * 12, currency)} annual uplift</div>
        </div>

        <div className="p-4 rounded border">
          <div className="text-sm text-gray-600">Leads / month</div>
          <div className="text-lg font-medium">{Math.round(results.Leads0)} → {Math.round(results.Leads1)}</div>

          <div className="text-sm text-gray-600 mt-3">Sales / month</div>
          <div className="text-lg font-medium">{Math.round(results.Sales0)} → {Math.round(results.Sales1)}</div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          className="px-4 py-2 bg-kultrip-purple text-white rounded"
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
        >
          Get my personalized ROI report
        </button>

        <a href="/contact" className="px-4 py-2 border rounded text-sm self-center">
          Schedule a demo
        </a>
      </div>
    </section>
  );
}
