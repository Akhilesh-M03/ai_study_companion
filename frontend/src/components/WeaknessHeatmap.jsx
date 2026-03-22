import React, { useState } from 'react';

// --- MOCK DATA ---
const mockHeatmapData = [
  { subject: 'Math', topic: 'Integration', strength: 25 },
  { subject: 'Math', topic: 'Derivatives', strength: 75 },
  { subject: 'Math', topic: 'Trigonometry', strength: 50 },
  { subject: 'Physics', topic: 'Kinematics', strength: 90 },
  { subject: 'Physics', topic: 'Optics', strength: 15 },
  { subject: 'Physics', topic: 'Thermodynamics', strength: 60 },
  { subject: 'Chemistry', topic: 'Organic', strength: 40 },
  { subject: 'Chemistry', topic: 'Inorganic', strength: 80 },
  { subject: 'Chemistry', topic: 'Physical', strength: 20 },
  { subject: 'Biology', topic: 'Genetics', strength: 70 },
  { subject: 'CS', topic: 'Algorithms', strength: 85 },
  { subject: 'CS', topic: 'Data Structures', strength: 55 },
  { subject: 'CS', topic: 'Databases', strength: 30 },
  { subject: 'Math', topic: 'Limits', strength: 10 },
  { subject: 'Physics', topic: 'Waves', strength: 65 },
];

const WeaknessHeatmap = ({ items = mockHeatmapData }) => {
  const data = items;
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const getColor = (strength) => {
    if (strength <= 30) return 'bg-red-800 text-white';
    if (strength <= 70) return 'bg-yellow-400 text-black';
    return 'bg-green-800 text-white';
  };
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {data.map((item, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`
              relative h-16 rounded-xl flex items-center justify-center 
              cursor-default transition-all duration-300 shadow-sm
              ${getColor(item.strength)}
              ${index === hoveredIndex ? 'scale-[1.03] shadow-md z-40' : 'hover:scale-[1.03] z-10 hover:z-40'}
            `}
          >
            <span className="text-xs font-bold px-2 text-center truncate w-full tracking-wide pointer-events-none">
              {item.topic}
            </span>
            
            {/* Tooltip */}
            <div 
              className={`
                absolute z-50 bottom-full mb-3 left-1/2 -translate-x-1/2 
                transition-all duration-300 ease-out pointer-events-none
                w-52 p-3.5 bg-card/95 backdrop-blur-md border border-white/10 
                rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]
                flex flex-col gap-1
                ${index === hoveredIndex ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}
              `}
            >
              <div className="font-bold text-sm mb-1">
                <span className="text-primary">{item.subject}:</span> <span className="text-primary-text">{item.topic}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs font-medium text-secondary-text">
                <span>Proficiency:</span> 
                <span className="text-primary-text font-bold text-sm">{item.strength}%</span>
              </div>
              
              {/* Status Indicator */}
              <div className="mt-1 flex items-center">
                {item.strength <= 30 && <span className="text-red-400 font-bold text-xs flex items-center gap-1.5"><span className="text-sm">⚠️</span> Needs focus!</span>}
                {item.strength > 30 && item.strength <= 70 && <span className="text-yellow-400 font-bold text-xs flex items-center gap-1.5"><span className="text-sm">⚡</span> On track</span>}
                {item.strength > 70 && <span className="text-green-400 font-bold text-xs flex items-center gap-1.5"><span className="text-sm">✨</span> Mastered!</span>}
              </div>
              
              {/* Tooltip Arrow Desktop */}
              <div className="absolute top-[98%] left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white/10 drop-shadow-sm"></div>
              <div className="absolute top-[96%] left-1/2 -translate-x-1/2 border-[7px] border-transparent border-t-card/95"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-secondary-text justify-end">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-800 rounded-sm shadow-sm"></div> Weak (0-30%)</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-yellow-400 rounded-sm shadow-sm"></div> Average (31-70%)</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-800 rounded-sm shadow-sm"></div> Strong (71-100%)</div>
      </div>
    </div>
  );
};

export default WeaknessHeatmap;
