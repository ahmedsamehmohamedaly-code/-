import React from 'react';
import {
  Activity,
  Calculator,
  Dumbbell,
  Flame,
  LayoutDashboard,
  Layers,
  Moon,
  Play,
  Sun,
} from 'lucide-react';
import { Language, TabId, ThemeMode, WeightUnit } from '../types/gym';
import { t } from '../i18n/translations';
import { formatDuration } from '../utils/calculations';

interface NavigationProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  lang: Language;
  onToggleLang: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  unit: WeightUnit;
  onToggleUnit: () => void;
  hasActiveWorkout: boolean;
  activeElapsedSeconds: number;
  onPrimaryAction: () => void;
}

export const Sidebar: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  unit,
  onToggleUnit,
}) => {
  const copy = t(lang);

  const navItems: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: copy.nav.dashboard, icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'workout', label: copy.nav.workout, icon: <Flame className="w-4 h-4" /> },
    { id: 'programs', label: copy.nav.programs, icon: <Layers className="w-4 h-4" /> },
    { id: 'exercises', label: copy.nav.exercises, icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'analytics', label: copy.nav.analytics, icon: <Activity className="w-4 h-4" /> },
    { id: 'tools', label: copy.nav.tools, icon: <Calculator className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 border-e border-slate-200 dark:border-white/8 bg-white dark:bg-[#0F1218] min-h-screen sticky top-0 h-screen">
      <div className="h-16 px-6 flex items-center border-b border-slate-200 dark:border-white/8">
        <button
          onClick={() => onSelectTab('dashboard')}
          className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-md"
        >
          Iron<span className="text-orange-500">Forge</span>
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Main Navigation">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                isActive
                  ? 'bg-orange-500/12 text-orange-600 dark:text-orange-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500'}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-white/8 space-y-2.5">
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={onToggleLang}
            className="min-h-[40px] px-2.5 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors whitespace-nowrap shrink-0"
            title={lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          <button
            onClick={onToggleUnit}
            className="min-h-[40px] px-2.5 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-mono-num font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors whitespace-nowrap shrink-0"
          >
            {unit.toUpperCase()}
          </button>

          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="min-h-[40px] px-2.5 py-2 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
};

export const TopHeader: React.FC<{
  activeTab: TabId;
  lang: Language;
  hasActiveWorkout: boolean;
  activeElapsedSeconds: number;
  onPrimaryAction: () => void;
  onToggleLang: () => void;
  onToggleTheme: () => void;
  theme: ThemeMode;
}> = ({
  activeTab,
  lang,
  hasActiveWorkout,
  activeElapsedSeconds,
  onPrimaryAction,
  onToggleLang,
  onToggleTheme,
  theme,
}) => {
  const copy = t(lang);
  const sectionTitle = copy.nav[activeTab];

  return (
    <header className="sticky top-0 z-30 h-14 lg:h-16 px-4 lg:px-8 border-b border-slate-200 dark:border-white/8 bg-white/90 dark:bg-[#0B0D11]/90 backdrop-blur-md flex items-center justify-between gap-8">
      {/* Zone 1: Brand on mobile / Section title on desktop */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="lg:hidden font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
          Iron<span className="text-orange-500">Forge</span>
        </span>
        <span className="hidden lg:inline-block text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
          {sectionTitle}
        </span>
      </div>

      {/* Zone 2: Minimal mobile utility switchers (hidden on desktop since sidebar holds them) */}
      <div className="flex lg:hidden items-center gap-2 shrink-0">
        <button
          onClick={onToggleLang}
          className="min-h-[40px] min-w-[40px] px-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-200"
        >
          {lang === 'ar' ? 'EN' : 'عربي'}
        </button>
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="min-h-[40px] min-w-[40px] rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Zone 3: Single Primary Action */}
      <div className="hidden lg:flex items-center shrink-0">
        <button
          onClick={onPrimaryAction}
          className="min-h-[40px] px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap shrink-0 shadow-sm shadow-orange-500/20"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>
            {hasActiveWorkout
              ? `${copy.resumeWorkoutCta} · ${formatDuration(activeElapsedSeconds)}`
              : copy.startWorkoutCta}
          </span>
        </button>
      </div>
    </header>
  );
};

export const MobileBottomNav: React.FC<{
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  lang: Language;
  hasActiveWorkout: boolean;
}> = ({ activeTab, onSelectTab, lang, hasActiveWorkout }) => {
  const copy = t(lang);

  const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: copy.nav.dashboard, icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'workout', label: copy.nav.workout, icon: <Flame className="w-5 h-5" /> },
    { id: 'programs', label: copy.nav.programs, icon: <Layers className="w-5 h-5" /> },
    { id: 'exercises', label: copy.nav.exercises, icon: <Dumbbell className="w-5 h-5" /> },
    { id: 'analytics', label: copy.nav.analytics, icon: <Activity className="w-5 h-5" /> },
    { id: 'tools', label: copy.nav.tools, icon: <Calculator className="w-5 h-5" /> },
  ];

  // Keep mobile bottom bar compact <= 64px (well within 15% height cap)
  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 dark:bg-[#0F1218]/95 backdrop-blur-md border-t border-slate-200 dark:border-white/10 grid grid-cols-6 items-center px-1"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-lg transition-colors ${
              isActive
                ? 'text-orange-500 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <span className="relative">
              {tab.icon}
              {tab.id === 'workout' && hasActiveWorkout && (
                <span className="sr-only">Active</span>
              )}
            </span>
            <span className="text-[10px] leading-tight truncate max-w-[54px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
