import React, { useRef, useState } from 'react';
import {
  Bot,
  Check,
  Code2,
  FileText,
  GraduationCap,
  Shield,
  Sparkles,
  Swords,
  UploadCloud,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const focusOptions = [
  'Data Structures',
  'Machine Learning',
  'Java',
  'React',
  'Spring Boot',
  'System Design',
];

const goalOptions = [
  {
    id: 'casual',
    title: 'Casual',
    value: '15m',
    subtitle: 'Steady daily momentum',
  },
  {
    id: 'focused',
    title: 'Focused',
    value: '1 hr',
    subtitle: 'Balanced growth track',
  },
  {
    id: 'grind',
    title: 'Grind',
    value: '3+ hrs',
    subtitle: 'High-intensity progress',
  },
];

const avatarOptions = [
  { id: 'robot', label: 'Robot', icon: Bot },
  { id: 'ninja', label: 'Ninja', icon: Swords },
  { id: 'scholar', label: 'Scholar', icon: GraduationCap },
  { id: 'hacker', label: 'Hacker', icon: Code2 },
  { id: 'guardian', label: 'Guardian', icon: Shield },
];

const OnboardingModal = ({ isOpen, onComplete }) => {
  const { theme, setTheme, themes } = useTheme();

  const [step, setStep] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [selectedFocusAreas, setSelectedFocusAreas] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState('robot');
  const [selectedGoal, setSelectedGoal] = useState('focused');
  const [isHovering, setIsHovering] = useState(false);
  const [learningGoals, setLearningGoals] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const resumeInputRef = useRef(null);

  if (!isOpen) {
    return null;
  }

  const toggleFocusArea = (area) => {
    setSelectedFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((item) => item !== area) : [...prev, area]
    );
  };

  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
    setTheme(themeId);
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleComplete = () => {
    onComplete({
      avatar: selectedAvatar,
      dailyCommitment: selectedGoal,
      focusAreas: selectedFocusAreas,
      learningGoals,
      resumeName: uploadedFile?.name || '',
      theme: selectedTheme,
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsHovering(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setUploadedFile(event.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-primary/20 text-primary-text max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4].map((dot) => (
            <span
              key={dot}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                step === dot ? 'w-8 bg-primary' : 'w-2.5 bg-primary/25'
              }`}
            />
          ))}
        </div>

        <div className="min-h-[390px] transition-all duration-300">
          {step === 1 ? (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-secondary-text">Step 1</p>
                <h2 className="text-2xl font-black mt-1">Customize Your Workspace</h2>
                <p className="text-sm text-secondary-text mt-1">Choose your vibe to personalize the learning environment.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {themes.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleThemeSelect(item.id)}
                    className={`rounded-xl border px-3 py-3 text-sm font-bold transition-all duration-300 ${
                      selectedTheme === item.id
                        ? 'border-primary bg-primary/15 text-primary'
                        : 'border-primary/20 bg-background/45 text-primary-text hover:border-primary/45'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-secondary-text">Step 2</p>
                <h2 className="text-2xl font-black mt-1">What are you studying?</h2>
                <p className="text-sm text-secondary-text mt-1">Pick focus areas and choose an avatar for your profile.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {focusOptions.map((area) => {
                  const isSelected = selectedFocusAreas.includes(area);
                  return (
                    <button
                      key={area}
                      onClick={() => toggleFocusArea(area)}
                      className={`px-3.5 py-2 rounded-full border text-sm font-semibold transition-all duration-300 ${
                        isSelected
                          ? 'border-primary bg-primary text-white'
                          : 'border-primary/20 bg-background/50 text-primary-text hover:border-primary/45'
                      }`}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-secondary-text mb-3">Choose Your Avatar</p>
                <div className="grid grid-cols-5 gap-2">
                  {avatarOptions.map((avatar) => {
                    const Icon = avatar.icon;
                    const isActive = selectedAvatar === avatar.id;
                    return (
                      <button
                        key={avatar.id}
                        onClick={() => setSelectedAvatar(avatar.id)}
                        className={`rounded-xl p-2.5 border transition-all duration-300 flex flex-col items-center gap-1 ${
                          isActive
                            ? 'border-primary bg-primary/15 text-primary'
                            : 'border-primary/20 bg-background/50 text-secondary-text hover:text-primary-text hover:border-primary/45'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-[10px] font-bold truncate w-full">{avatar.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-secondary-text">Step 3</p>
                <h2 className="text-2xl font-black mt-1">Set Your Daily Goal</h2>
                <p className="text-sm text-secondary-text mt-1">This helps us tailor your progress targets and dashboard streaks.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {goalOptions.map((goal) => {
                  const isActive = selectedGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                        isActive
                          ? 'border-primary bg-primary/15'
                          : 'border-primary/20 bg-background/45 hover:border-primary/45'
                      }`}
                    >
                      <p className="text-sm font-black">{goal.title}</p>
                      <p className="text-2xl font-black mt-1 text-primary">{goal.value}</p>
                      <p className="text-xs text-secondary-text mt-2">{goal.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-secondary-text">Step 4</p>
                <h2 className="text-2xl font-black mt-1">Kickstart Your AI Tutor</h2>
                <p className="text-sm text-secondary-text mt-1">Share resume details or learning goals to personalize recommendations.</p>
              </div>

              <div className="rounded-2xl border border-primary/15 bg-background/50 p-4 flex items-start gap-3">
                <div className="p-2 bg-primary/20 rounded-full border border-primary/30 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm font-semibold leading-relaxed text-primary-text">
                  Welcome! Let&apos;s build your personalized curriculum. Tell me about your goals, current subjects, or share your resume.
                </p>
              </div>

              <div
                className={`w-full border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                  isHovering
                    ? 'border-primary bg-primary/10 scale-[1.01]'
                    : 'border-primary/20 bg-background/45 hover:border-primary/50 hover:bg-primary/5'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => resumeInputRef.current?.click()}
              >
                <input
                  ref={resumeInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />

                {uploadedFile ? (
                  <div className="flex flex-col items-center gap-1.5">
                    <FileText className="w-8 h-8 text-primary" />
                    <span className="font-semibold text-sm text-primary-text">{uploadedFile.name}</span>
                    <span className="text-[11px] text-secondary-text">Click to replace</span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className={`w-8 h-8 mb-2 ${isHovering ? 'text-primary' : 'text-secondary-text'}`} />
                    <span className="font-semibold text-sm mb-0.5">Drag &amp; Drop your Resume</span>
                    <span className="text-[11px] text-secondary-text">Supports PDF, DOCX (Max 5MB)</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-4 py-1.5">
                <div className="h-px bg-primary/20 flex-1"></div>
                <span className="text-[10px] font-bold text-secondary-text tracking-wider uppercase">OR TYPE IT OUT</span>
                <div className="h-px bg-primary/20 flex-1"></div>
              </div>

              <textarea
                className="w-full min-h-[110px] text-sm bg-background/50 border border-primary/20 rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/50 text-primary-text placeholder-secondary-text/60 resize-none transition-all"
                placeholder="E.g., I am preparing for placement interviews and I struggle with Operating Systems and DBMS."
                value={learningGoals}
                onChange={(event) => setLearningGoals(event.target.value)}
              />
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-4 py-2 rounded-xl border border-primary/25 bg-background/55 text-sm font-bold text-primary-text disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-sm font-black transition-all duration-300"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-black transition-all duration-300 inline-flex items-center gap-2"
              disabled={!learningGoals.trim() && !uploadedFile}
            >
              <Check className="w-4 h-4" />
              Generate My AI Tutor
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
