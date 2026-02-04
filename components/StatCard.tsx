
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel: string;
  icon: React.ReactNode;
  gradient: string;
  delay?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sublabel, icon, gradient, delay = '0s' }) => {
  return (
    <div 
      className="glass-card rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 group animate-fade-in opacity-0"
      style={{ animation: `fadeIn 0.6s ease-out forwards ${delay}` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">{label}</span>
      </div>
      <p className="text-3xl font-bold text-white mb-2 tracking-tight">{value}</p>
      <p className="text-xs text-blue-200/60 font-medium">{sublabel}</p>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default StatCard;
