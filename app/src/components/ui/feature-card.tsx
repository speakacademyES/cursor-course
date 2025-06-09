import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "emerald" | "purple" | "blue";
}

export function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    emerald: {
      border: "hover:border-emerald-500/50",
      bg: "bg-emerald-500/20",
      text: "text-emerald-400"
    },
    purple: {
      border: "hover:border-purple-500/50",
      bg: "bg-purple-500/20",
      text: "text-purple-400"
    },
    blue: {
      border: "hover:border-blue-500/50",
      bg: "bg-blue-500/20",
      text: "text-blue-400"
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 ${colors.border} transition-all group`}>
      <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <div className={colors.text}>
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}