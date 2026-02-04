import React from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4"
    >
      {icon && (
        <div className="text-blue-600">
          {icon}
        </div>
      )}

      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-semibold text-gray-900">
          {value}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
