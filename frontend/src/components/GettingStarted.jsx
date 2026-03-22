import React, { useState } from 'react';
import { UploadCloud, Bot, Sparkles, FileText } from 'lucide-react';
import bgImage from '../assets/getting-started-bg.jpg';
import { useTheme } from '../context/ThemeContext';

const GettingStarted = ({ onComplete }) => {
  const { theme } = useTheme();
  const isLight = theme.includes('light');

  const [learningGoals, setLearningGoals] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [file, setFile] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate generation delay
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  return (
    <div 
      className="h-screen w-full relative flex items-center justify-center font-sans text-primary-text transition-colors duration-300 overflow-hidden text-sm md:text-base"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Glassmorphic Theme Overlay */}
      <div
        className={`absolute inset-0 z-0 ${
          isLight ? 'bg-white/8 backdrop-blur-[1.5px]' : 'bg-background/80 backdrop-blur-[2px]'
        }`}
      ></div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-lg bg-card/80 backdrop-blur-xl border border-primary/20 p-6 md:p-8 rounded-3xl shadow-2xl mx-4 animate-in fade-in zoom-in duration-500">
        
        {/* AI Greeting Bubble */}
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2 bg-primary/20 rounded-full border border-primary/30 shrink-0">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded-2xl rounded-tl-none p-3 px-4 max-w-[85%] text-sm">
            <p className="leading-relaxed text-primary-text drop-shadow-sm font-medium">
              Welcome! Tell me about yourself or share a resume so I can customize your learning path.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Drag & Drop Upload Zone */}
          <div 
            className={`w-full border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              isHovering 
                ? 'border-primary bg-primary/10 scale-[1.02]' 
                : 'border-primary/20 bg-background/50 hover:border-primary/50 hover:bg-primary/5'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('resumeUpload').click()}
          >
            <input 
              type="file" 
              id="resumeUpload" 
              className="hidden" 
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file ? (
              <div className="flex flex-col items-center gap-1.5">
                <FileText className="w-8 h-8 text-primary" />
                <span className="font-semibold text-sm text-primary">{file.name}</span>
                <span className="text-[10px] text-secondary-text">Click to replace</span>
              </div>
            ) : (
              <>
                <UploadCloud className={`w-8 h-8 mb-2 ${isHovering ? 'text-primary' : 'text-secondary-text'}`} />
                <span className="font-semibold text-sm mb-0.5">Drag & Drop your Resume</span>
                <span className="text-[10px] text-secondary-text">Supports PDF, DOCX (Max 5MB)</span>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-primary/20 flex-1"></div>
            <span className="text-[10px] font-bold text-secondary-text tracking-wider uppercase">OR TYPE IT OUT</span>
            <div className="h-px bg-primary/20 flex-1"></div>
          </div>

          {/* Auto-expanding Input Area */}
          <div className="relative">
            <textarea
              className="w-full min-h-[90px] text-sm bg-background/50 border border-primary/20 rounded-2xl p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-primary/50 text-primary-text placeholder-secondary-text/60 resize-none transition-all custom-scrollbar"
              placeholder="E.g., I'm a 3rd-year CS student with a 8.5 CGPA aiming for GATE 2025. I struggle with Operating Systems but I'm strong in Data Structures..."
              value={learningGoals}
              onChange={(e) => setLearningGoals(e.target.value)}
            />
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            disabled={!learningGoals.trim() && !file}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              learningGoals.trim() || file
                ? 'bg-primary hover:bg-secondary text-white shadow-[0_0_20px_var(--color-primary)] hover:shadow-[0_0_30px_var(--color-secondary)] hover:-translate-y-1'
                : 'bg-background/80 text-secondary-text/50 cursor-not-allowed border border-primary/10'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Generate My AI Tutor
          </button>
        </form>

      </div>
    </div>
  );
};

export default GettingStarted;