import React from "react";

interface StatCardProps {
  value: string;
  label: string;
  gradient: string;
}

export function StatCard({ value, label, gradient }: StatCardProps) {
  return (
    <div className="text-center">
      <div
        className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
      >
        {value}
      </div>
      <div className="text-gray-400 mt-1">{label}</div>
    </div>
  );
}
