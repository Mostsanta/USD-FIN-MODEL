import React, { useState, useMemo, useRef } from 'react';
import {
  Calculator,
  Calendar,
  RotateCcw,
  Share2,
  TrendingUp,
  Users,
  DollarSign,
  Briefcase,
  Target,
  AlertTriangle,
  ChevronRight,
  Info,
  Layers,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Moon,
  Sun,
  Palette,
  Plus,
  Trash2,
  Download,
  FileText,
  Image as ImageIcon,
  Save,
  FolderOpen,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import * as htmlToImage from 'html-to-image';

// --- Types & Constants ---

interface MonthlyData {
  month: number;
  clients: number;
  revenue: number;
  expenses: number;
  profit: number;
  accumulatedProfit: number;
  capital: number;
  marketingBudget: number;
}

const THEMES = {
  blue: {
    primary: 'bg-blue-600',
    text: 'text-blue-600',
    border: 'border-blue-600',
    ring: 'focus:ring-blue-500/20',
    accent: 'bg-blue-50',
    chart: '#2563eb',
    gradient: 'from-blue-600/20',
  },
  emerald: {
    primary: 'bg-emerald-600',
    text: 'text-emerald-600',
    border: 'border-emerald-600',
    ring: 'focus:ring-emerald-500/20',
    accent: 'bg-emerald-50',
    chart: '#10b981',
    gradient: 'from-emerald-600/20',
  },
  rose: {
    primary: 'bg-rose-600',
    text: 'text-rose-600',
    border: 'border-rose-600',
    ring: 'focus:ring-rose-500/20',
    accent: 'bg-rose-50',
    chart: '#e11d48',
    gradient: 'from-rose-600/20',
  },
  amber: {
    primary: 'bg-amber-600',
    text: 'text-amber-600',
    border: 'border-amber-600',
    ring: 'focus:ring-amber-500/20',
    accent: 'bg-amber-50',
    chart: '#d97706',
    gradient: 'from-amber-600/20',
  },
  indigo: {
    primary: 'bg-indigo-600',
    text: 'text-indigo-600',
    border: 'border-indigo-600',
    ring: 'focus:ring-indigo-500/20',
    accent: 'bg-indigo-50',
    chart: '#4f46e5',
    gradient: 'from-indigo-600/20',
  },
};

type ThemeKeys = keyof typeof THEMES;

// --- Components ---

const InputCard = ({
  label,
  value,
  onChange,
  icon: Icon,
  suffix = '',
  description = '',
  type = 'number',
  error = '',
  warning = '',
  tooltip = '',
  theme = THEMES.blue,
  isDark = false,
}: {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  icon?: any;
  suffix?: string;
  description?: string;
  type?: string;
  error?: string;
  warning?: string;
  tooltip?: string;
  theme?: typeof THEMES.blue;
  isDark?: boolean;
}) => (
  <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-xl p-4 transition-all hover:border-slate-300 shadow-sm relative overflow-hidden group`}>
    {error && <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />}
    {!error && warning && <div className="absolute top-0 left-0 w-full h-1 bg-amber-400" />}
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-500'} uppercase tracking-widest`}>{label}</span>
        {suffix && <span className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'} font-medium`}>({suffix})</span>}
      </div>
      {tooltip && (
        <div className="relative group/tooltip">
          <HelpCircle size={12} className={`${isDark ? 'text-slate-700' : 'text-slate-300'} hover:text-blue-500 cursor-help transition-colors`} />
          <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-[9px] rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-20 shadow-xl pointer-events-none">
            {tooltip}
            <div className="absolute right-2 top-full w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-800"></div>
          </div>
        </div>
      )}
    </div>
    <div className="relative">
      {Icon && <Icon size={14} className={`absolute left-3 top-3 ${error ? 'text-red-400' : warning ? 'text-amber-500' : isDark ? 'text-slate-600' : 'text-slate-400'}`} />}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} border ${error ? 'border-red-500' : warning ? 'border-amber-400' : 'border-slate-200'} rounded-lg ${Icon ? 'pl-9' : 'px-3'} py-2.5 focus:outline-none ${!error && !warning && (isDark ? 'focus:ring-2 focus:ring-slate-700' : theme.ring)} transition-all font-semibold text-sm`}
      />
    </div>
    {error ? (
      <p className="mt-2 text-[10px] text-red-500 font-bold tracking-tight leading-tight flex items-center gap-1">
        <AlertTriangle size={10} />
        {error}
      </p>
    ) : warning ? (
      <p className="mt-2 text-[10px] text-amber-600 font-bold tracking-tight leading-tight flex items-center gap-1">
        <Info size={10} />
        {warning}
      </p>
    ) : (
      description && <p className="mt-2 text-[10px] text-slate-400 font-medium tracking-tight leading-tight">{description}</p>
    )}
  </div>
);

const MetricBlock = ({
  label,
  value,
  colorClass = 'text-slate-800',
  subValue = '',
  isDark = false,
}: {
  label: string;
  value: string;
  colorClass?: string;
  subValue?: string;
  isDark?: boolean;
}) => (
  <div className={`p-6 border-r last:border-r-0 ${isDark ? 'border-slate-800' : 'border-slate-100'} flex-1 min-w-[140px]`}>
    <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'} uppercase font-bold mb-1.5 tracking-wider`}>{label}</div>
    <div className={`text-2xl font-bold tracking-tight ${isDark && colorClass.includes('text-slate-800') ? 'text-slate-200' : colorClass}`}>{value}</div>
    {subValue && <div className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-500'} font-medium mt-1.5`}>{subValue}</div>}
  </div>
);

const AdviceItem = ({
  title,
  suggestions,
  icon: Icon,
  variant = 'warning',
  isDark = false,
}: {
  title: string;
  suggestions: string[];
  icon: any;
  variant?: 'warning' | 'error' | 'info';
  isDark?: boolean;
}) => {
  const lightColors = {
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    error: 'border-rose-200 bg-rose-50 text-rose-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800',
  };

  const darkColors = {
    warning: 'border-amber-900/50 bg-amber-950/20 text-amber-500',
    error: 'border-rose-900/50 bg-rose-950/20 text-rose-500',
    info: 'border-blue-900/50 bg-blue-950/20 text-blue-500',
  };

  const currentColors = isDark ? darkColors[variant] : lightColors[variant];

  return (
    <div className={`p-5 rounded-xl border ${currentColors} shadow-sm transition-all hover:shadow-md`}>
      <div className="flex items-center gap-2 mb-3 font-bold text-sm tracking-tight capitalize">
        <Icon size={18} className="shrink-0" />
        {title}
      </div>
      <div className="space-y-2">
        {suggestions.map((s, i) => (
          <div key={i} className="flex gap-2 text-xs opacity-90 leading-relaxed font-medium">
            <span className="mt-0.5 shrink-0 opacity-50">→</span>
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  // Inputs
  const [marketingBudget, setMarketingBudget] = useState('100000');
  const [startingCapital, setStartingCapital] = useState('200000');
  const [initialExpenses, setInitialExpenses] = useState('150000');
  const [fixedExpenses, setFixedExpenses] = useState('0');
  const [reinvestmentPercent, setReinvestmentPercent] = useState(10);
  const [arpu, setArpu] = useState('1000');
  const [cac, setCac] = useState('2000');
  const [variableCost, setVariableCost] = useState('150');
  const [lifetime, setLifetime] = useState(3);
  const [chartPeriod, setChartPeriod] = useState(12);
  const [initialClients, setInitialClients] = useState(0);
  const [fundingRounds, setFundingRounds] = useState<{ id: string; amount: string; month: number }[]>([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  // Theme state
  const [themeKey, setThemeKey] = useState<ThemeKeys>('blue');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = THEMES[themeKey];

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<Record<string, string>>({});

  const validateAll = (
    mb: string,
    sc: string,
    ie: string,
    fe: string,
    rev: string,
    costAcq: string,
    vCost: string,
    lt: number
  ) => {
    const newErrors: Record<string, string> = {};
    const newWarnings: Record<string, string> = {};

    const checkBasic = (name: string, val: string) => {
      const num = Number(val);
      if (val.trim() === '') return 'Required';
      if (isNaN(num)) return 'Invalid number';
      if (num < 0) return 'Negative value';
      return '';
    };

    newErrors.marketingBudget = checkBasic('mb', mb);
    newErrors.startingCapital = checkBasic('sc', sc);
    newErrors.initialExpenses = checkBasic('ie', ie);
    newErrors.fixedExpenses = checkBasic('fe', fe);
    newErrors.arpu = checkBasic('rev', rev);
    newErrors.cac = checkBasic('costAcq', costAcq);
    newErrors.variableCost = checkBasic('vCost', vCost);

    // Filter out empty errors
    Object.keys(newErrors).forEach(k => !newErrors[k] && delete newErrors[k]);

    // Cross-field dependencies
    const numMB = Number(mb);
    const numSC = Number(sc);
    const numIE = Number(ie);
    const numARPU = Number(rev);
    const numCAC = Number(costAcq);
    const numVC = Number(vCost);

    if (!newErrors.initialExpenses && !newErrors.startingCapital) {
      if (numIE > numSC) {
        newWarnings.initialExpenses = 'Exceeds starting capital';
      }
    }

    if (!newErrors.variableCost && !newErrors.arpu) {
      if (numVC >= numARPU && numARPU > 0) {
        newErrors.variableCost = 'Exceeds revenue (negative margins)';
      }
    }

    if (!newErrors.cac && !newErrors.arpu && !newErrors.variableCost) {
      const ltv = (numARPU - numVC) * lt;
      if (numCAC > ltv && ltv > 0) {
        newWarnings.cac = 'Acquisition cost > expected LTV';
      }
    }

    if (!newErrors.marketingBudget && !newErrors.initialExpenses && !newErrors.startingCapital) {
      if (numMB + numIE > numSC) {
        newWarnings.marketingBudget = 'Budget + setup costs > treasury';
      }
    }

    setErrors(newErrors);
    setWarnings(newWarnings);
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, name: string) => (val: string) => {
    setter(val);
    
    // Using a simple object to simulate current state for validation since setter is async
    const currentValues = {
      marketingBudget,
      startingCapital,
      initialExpenses,
      fixedExpenses,
      arpu,
      cac,
      variableCost,
      lifetime
    };
    (currentValues as any)[name] = val;

    validateAll(
      currentValues.marketingBudget,
      currentValues.startingCapital,
      currentValues.initialExpenses,
      currentValues.fixedExpenses,
      currentValues.arpu,
      currentValues.cac,
      currentValues.variableCost,
      currentValues.lifetime
    );
  };

  const addFundingRound = () => {
    const nextMonth = fundingRounds.length > 0 ? Math.max(...fundingRounds.map(r => r.month)) + 6 : 6;
    setFundingRounds([
      ...fundingRounds,
      { id: Math.random().toString(36).substr(2, 9), amount: '50000', month: Math.min(nextMonth, chartPeriod) }
    ]);
    showFeedback('New funding round added');
  };

  const updateFundingRound = (id: string, field: 'amount' | 'month', value: string | number) => {
    setFundingRounds(fundingRounds.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeFundingRound = (id: string) => {
    setFundingRounds(fundingRounds.filter(r => r.id !== id));
    showFeedback('Funding round removed');
  };

  const showFeedback = (msg: string) => {
    setLastActionMessage(msg);
    setTimeout(() => setLastActionMessage(null), 3000);
  };

  const getMonthIndexFromDate = (targetDateStr: string) => {
    const start = new Date(startDate);
    const target = new Date(targetDateStr);
    const diffMonths = (target.getFullYear() - start.getFullYear()) * 12 + (target.getMonth() - start.getMonth());
    return Math.max(0, diffMonths);
  };

  const getDateFromMonthIndex = (monthIdx: number) => {
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + monthIdx);
    return d.toISOString().split('T')[0];
  };

  const chartRef = useRef<HTMLDivElement>(null);

  const exportToCSV = () => {
    const data = calculations.chartData;
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(v => typeof v === 'number' ? v.toFixed(2) : v).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FinCalc_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPNG = async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(chartRef.current, {
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
        style: {
          borderRadius: '16px',
        },
        pixelRatio: 2 // High quality
      });
      const link = document.createElement("a");
      link.download = `FinCalc_Chart_${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export image:', error);
    }
  };

  const saveState = () => {
    const stateToSave = {
      marketingBudget,
      startingCapital,
      initialExpenses,
      fixedExpenses,
      reinvestmentPercent,
      arpu,
      cac,
      variableCost,
      lifetime,
      chartPeriod,
      initialClients,
      fundingRounds,
      startDate,
      themeKey,
      isDarkMode,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('fincalc_saved_state', JSON.stringify(stateToSave));
    alert('Financial model saved successfully to your browser!');
  };

  const loadState = () => {
    const saved = localStorage.getItem('fincalc_saved_state');
    if (!saved) {
      alert('No saved state found.');
      return;
    }

    try {
      const s = JSON.parse(saved);
      if (s.marketingBudget !== undefined) setMarketingBudget(s.marketingBudget);
      if (s.startingCapital !== undefined) setStartingCapital(s.startingCapital);
      if (s.initialExpenses !== undefined) setInitialExpenses(s.initialExpenses);
      if (s.fixedExpenses !== undefined) setFixedExpenses(s.fixedExpenses);
      if (s.reinvestmentPercent !== undefined) setReinvestmentPercent(s.reinvestmentPercent);
      if (s.arpu !== undefined) setArpu(s.arpu);
      if (s.cac !== undefined) setCac(s.cac);
      if (s.variableCost !== undefined) setVariableCost(s.variableCost);
      if (s.lifetime !== undefined) setLifetime(s.lifetime);
      if (s.chartPeriod !== undefined) setChartPeriod(s.chartPeriod);
      if (s.initialClients !== undefined) setInitialClients(s.initialClients);
      if (s.fundingRounds !== undefined) setFundingRounds(s.fundingRounds);
      if (s.startDate !== undefined) setStartDate(s.startDate);
      if (s.themeKey !== undefined) setThemeKey(s.themeKey);
      if (s.isDarkMode !== undefined) setIsDarkMode(s.isDarkMode);
      alert('Scenario loaded successfully!');
    } catch (e) {
      console.error('Failed to load state:', e);
      alert('Failed to load saved state. The data might be corrupted.');
    }
  };

  // Calculations
  const calculations = useMemo(() => {
    const mb = Number(marketingBudget) || 0;
    const sc = Number(startingCapital) || 0;
    const ie = Number(initialExpenses) || 0;
    const fe = Number(fixedExpenses) || 0;
    const revPerClient = Number(arpu) || 0;
    const costPerAcq = Number(cac) || 2000; // prevent divide by zero
    const varCost = Number(variableCost) || 0;

    // Unit Economics
    const newClientsPerMo = costPerAcq > 0 ? Math.floor(mb / costPerAcq) : 0;
    const marginPerClientMo = revPerClient - varCost;
    const ltv = marginPerClientMo * lifetime;
    const ltvCac = costPerAcq > 0 ? ltv / costPerAcq : 0;
    const payback = marginPerClientMo > 0 ? costPerAcq / marginPerClientMo : Infinity;
    const paybackPercentOfLifetime = lifetime > 0 ? (payback / lifetime) * 100 : 0;

    // Projection
    const data: MonthlyData[] = [];
    let currentCapital = sc - ie;
    let currentClients = Number(initialClients) || 0;
    let accumulatedProfit = 0;
    let firstProfitMonth = -1;
    let deathMonth = -1;

    for (let m = 0; m <= chartPeriod; m++) {
      // Add funding from rounds scheduled for this month
      fundingRounds.forEach(round => {
        if (round.month === m) {
          currentCapital += Number(round.amount) || 0;
        }
      });

      const prevMonthData = data[m - 1];
      const reinvestAmount = prevMonthData && prevMonthData.profit > 0 ? (prevMonthData.profit * reinvestmentPercent) / 100 : 0;
      const currentMarketingBudget = mb + reinvestAmount;
      
      const newClients = costPerAcq > 0 ? Math.floor(currentMarketingBudget / costPerAcq) : 0;
      // Growth/Churn
      const churnRate = 1 / Math.max(1, lifetime);
      const churnedClients = Math.floor(currentClients * churnRate);
      
      if (m > 0) {
        currentClients = currentClients + newClients - churnedClients;
      }

      const revenue = currentClients * revPerClient;
      const vExpenses = currentClients * varCost;
      const totalExpenses = currentMarketingBudget + vExpenses + fe;
      const profit = revenue - totalExpenses;
      
      accumulatedProfit += profit;
      currentCapital += profit;

      if (profit > 0 && firstProfitMonth === -1) firstProfitMonth = m;
      if (currentCapital < 0 && deathMonth === -1) deathMonth = m;

      data.push({
        month: m,
        clients: currentClients,
        revenue: revenue / 1000, // k$
        expenses: totalExpenses / 1000, // k$
        profit: profit / 1000, // k$
        accumulatedProfit: accumulatedProfit / 1000, // k$
        capital: currentCapital / 1000, // k$
        marketingBudget: currentMarketingBudget / 1000, // k$
      });
    }

    const lastMonth = data[data.length - 1];

    return {
      unit: {
        cac: costPerAcq,
        arpu: revPerClient,
        margin: marginPerClientMo,
        ltv,
        ltvCac,
        payback,
        paybackPercent: paybackPercentOfLifetime,
      },
      lastMonth: {
        clients: lastMonth.clients,
        revenue: lastMonth.revenue,
        expenses: lastMonth.expenses,
        profit: lastMonth.profit,
        capital: lastMonth.capital,
        deathMonth,
        firstProfitMonth,
      },
      chartData: data,
      currentInitialCap: sc - ie,
      newClientsPerMo,
    };
  }, [
    marketingBudget,
    startingCapital,
    initialExpenses,
    fixedExpenses,
    reinvestmentPercent,
    arpu,
    cac,
    variableCost,
    lifetime,
    chartPeriod,
    initialClients,
  ]);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    compactDisplay: 'short',
    maximumFractionDigits: 0,
  });

  const kFormatter = (val: number) => `$${Math.round(val)}k`;

  const reset = () => {
    setMarketingBudget('100000');
    setStartingCapital('200000');
    setInitialExpenses('150000');
    setFixedExpenses('0');
    setReinvestmentPercent(10);
    setArpu('1000');
    setCac('2000');
    setVariableCost('150');
    setLifetime(3);
    setChartPeriod(12);
    setInitialClients(0);
    setFundingRounds([]);
    setErrors({});
    setWarnings({});
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col lg:flex-row font-sans selection:bg-blue-500/30 transition-colors duration-300`}>
      {/* Sidebar: Inputs */}
      <aside className={`w-full lg:w-80 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-r shadow-sm flex flex-col p-6 lg:h-screen lg:sticky lg:top-0 overflow-y-auto transition-colors duration-300`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${theme.primary} rounded-lg text-white shadow-lg shadow-blue-500/20`}>
              <Calculator size={24} />
            </div>
            <div>
              <h1 className={`text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>FinCalc Pro</h1>
              <p className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} font-bold uppercase tracking-wider`}>USD Model v2.0</p>
            </div>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'} transition-all`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="space-y-4 flex-1">
          {/* Theme Switcher */}
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'} border mb-2`}>
            <div className="flex items-center gap-2 mb-3">
              <Palette size={12} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
              <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-widest`}>Visual Theme</span>
            </div>
            <div className="flex items-center gap-2">
              {(Object.keys(THEMES) as ThemeKeys[]).map((tk) => (
                <button
                  key={tk}
                  onClick={() => setThemeKey(tk)}
                  className={`w-6 h-6 rounded-full ${THEMES[tk].primary} border-2 ${themeKey === tk ? (isDarkMode ? 'border-white' : 'border-slate-800') : 'border-transparent'} transition-all hover:scale-110 active:scale-95`}
                />
              ))}
            </div>
          </div>

          <InputCard
            label="Marketing Budget"
            suffix="$/mo"
            value={marketingBudget}
            onChange={handleInputChange(setMarketingBudget, 'marketingBudget')}
            icon={Target}
            error={errors.marketingBudget}
            warning={warnings.marketingBudget}
            tooltip="Monthly spend on advertising and lead generation. Healthy range: 5-20% of target revenue."
            description={`${calculations.newClientsPerMo} new clients/mo`}
            theme={theme}
            isDark={isDarkMode}
          />
          <InputCard
            label="Starting Capital"
            suffix="$"
            value={startingCapital}
            onChange={handleInputChange(setStartingCapital, 'startingCapital')}
            icon={Briefcase}
            error={errors.startingCapital}
            warning={warnings.startingCapital}
            tooltip="Initial cash amount available in your business treasury before any launch expenses."
            description={`Balance: ${formatter.format(calculations.currentInitialCap)}`}
            theme={theme}
            isDark={isDarkMode}
          />
          <InputCard
            label="Initial Expenses"
            suffix="$"
            value={initialExpenses}
            onChange={handleInputChange(setInitialExpenses, 'initialExpenses')}
            icon={TrendingUp}
            error={errors.initialExpenses}
            warning={warnings.initialExpenses}
            tooltip="Total one-time setup costs (licenses, equipment, development) paid before generating revenue."
            theme={theme}
            isDark={isDarkMode}
          />
          <InputCard 
             label="Fixed Expenses" 
             suffix="$/mo" 
             value={fixedExpenses} 
             onChange={handleInputChange(setFixedExpenses, 'fixedExpenses')} 
             icon={Layers} 
             error={errors.fixedExpenses}
             warning={warnings.fixedExpenses}
             tooltip="Recurring monthly overhead (rent, payroll, server costs) regardless of customer volume."
             theme={theme}
             isDark={isDarkMode}
          />
          
          <div className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4 shadow-inner`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} uppercase tracking-widest`}>Reinvestment</span>
                <span className={`${theme.text} text-[10px] font-bold`}>{reinvestmentPercent}%</span>
              </div>
              <div className="relative group/tooltip">
                <HelpCircle size={12} className={`${isDarkMode ? 'text-slate-700' : 'text-slate-300'} hover:text-blue-500 cursor-help transition-colors`} />
                <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-[9px] rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-20 shadow-xl pointer-events-none">
                  Percentage of monthly net profit that is automatically added to the next month's Marketing Budget to fuel growth.
                  <div className="absolute right-2 top-full w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-800"></div>
                </div>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={reinvestmentPercent}
              onChange={(e) => {
                const val = Number(e.target.value);
                setReinvestmentPercent(val);
                validateAll(marketingBudget, startingCapital, initialExpenses, fixedExpenses, arpu, cac, variableCost, lifetime);
              }}
              className={`w-full ${isDarkMode ? 'accent-slate-400' : 'accent-blue-600'} cursor-pointer h-1.5 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded-full appearance-none transition-all hover:bg-slate-300`}
            />
            <p className={`mt-2 text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} font-medium tracking-tight`}>from profit → marketing</p>
          </div>

          <InputCard 
            label="Revenue / Client" 
            suffix="$/mo" 
            value={arpu} 
            onChange={handleInputChange(setArpu, 'arpu')} 
            icon={DollarSign} 
            error={errors.arpu} 
            warning={warnings.arpu}
            tooltip="Average Revenue Per User. The gross amount a single paying customer generates each month."
            theme={theme}
            isDark={isDarkMode}
          />
          <InputCard 
             label="CAC" 
             suffix="$" 
             value={cac} 
             onChange={handleInputChange(setCac, 'cac')} 
             icon={Users} 
             error={errors.cac} 
             warning={warnings.cac}
             tooltip="Customer Acquisition Cost. A best practice is to keep CAC less than 1/3 of the total Lifetime Value (LTV)."
             theme={theme}
             isDark={isDarkMode}
          />
          <InputCard 
             label="Cost / Client" 
             suffix="$/mo" 
             value={variableCost} 
             onChange={handleInputChange(setVariableCost, 'variableCost')} 
             icon={DollarSign} 
             error={errors.variableCost} 
             warning={warnings.variableCost}
             tooltip="Variable software/support costs per client. Example: hosting fees, transaction processing, or SMS alerts."
             theme={theme}
             isDark={isDarkMode}
          />
          
          {/* Funding Rounds Section */}
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} border space-y-3 relative overflow-hidden`}>
            <AnimatePresence>
              {lastActionMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-x-0 top-0 flex justify-center z-10"
                >
                  <div className={`px-3 py-1 mt-1 rounded-full text-[9px] font-bold ${isDarkMode ? 'bg-slate-700 text-emerald-400' : 'bg-white text-emerald-600'} shadow-sm border border-emerald-500/20`}>
                    {lastActionMessage}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} uppercase tracking-widest`}>Funding Rounds</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${theme.primary} text-white font-bold`}>{fundingRounds.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative group/tooltip">
                  <HelpCircle size={12} className={`${isDarkMode ? 'text-slate-700' : 'text-slate-300'} hover:text-blue-500 cursor-help transition-colors`} />
                  <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-[9px] rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-20 shadow-xl pointer-events-none">
                    External capital injections (VC, loans, grants) at specific months. These increase your treasury balance.
                    <div className="absolute right-2 top-full w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-800"></div>
                  </div>
                </div>
                <button
                  onClick={addFundingRound}
                  className={`p-1 rounded-md ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:text-white' : 'bg-white text-slate-400 hover:text-blue-600'} border ${isDarkMode ? 'border-slate-600' : 'border-slate-200'} transition-all`}
                  title="Add Funding Round"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-[9px] font-extrabold ${isDarkMode ? 'text-slate-600' : 'text-slate-400'} uppercase tracking-tighter`}>Model Start Date</label>
              <div className={`relative flex items-center ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-lg px-2.5 py-1.5`}>
                <Calendar size={10} className={`${isDarkMode ? 'text-slate-700' : 'text-slate-300'} shrink-0`} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`flex-1 bg-transparent text-[10px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} focus:outline-none pl-2`}
                />
              </div>
            </div>
            
            {fundingRounds.length === 0 && (
              <p className={`text-[9px] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'} italic text-center py-2`}>No scheduled funding rounds</p>
            )}

            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {fundingRounds.map((round) => (
                  <motion.div
                    key={round.id}
                    layout
                    initial={{ opacity: 0, height: 0, x: -10 }}
                    animate={{ opacity: 1, height: 'auto', x: 0 }}
                    exit={{ opacity: 0, height: 0, x: 20, transition: { duration: 0.2 } }}
                    className={`flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'} border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} shadow-sm group overflow-hidden`}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-1 group/input">
                        <span className={`text-[9px] font-bold ${isDarkMode ? 'text-slate-600' : 'text-slate-400'} shrink-0 w-3`}>$</span>
                        <input
                          type="number"
                          value={round.amount}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => updateFundingRound(round.id, 'amount', e.target.value)}
                          className={`w-full bg-transparent text-[11px] font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'} focus:outline-none`}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-[9px] font-bold ${isDarkMode ? 'text-slate-600' : 'text-slate-400'} shrink-0 w-3 uppercase`}>Date</span>
                        <input
                          type="date"
                          value={getDateFromMonthIndex(round.month)}
                          onChange={(e) => updateFundingRound(round.id, 'month', getMonthIndexFromDate(e.target.value))}
                          className={`w-full bg-transparent text-[10px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} focus:outline-none cursor-pointer hover:${theme.text}`}
                        />
                        <span className={`text-[8px] font-bold px-1 rounded ${isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>M{round.month}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFundingRound(round.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Internal Metrics Controls */}
          <div className={`space-y-4 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-wider`}>Current Clients: {initialClients}</label>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={initialClients}
                onChange={(e) => setInitialClients(Number(e.target.value))}
                className={`w-full ${isDarkMode ? 'accent-slate-400' : theme.primary.replace('bg-', 'accent-')} cursor-pointer h-1.5 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full appearance-none transition-all`}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-wider`}>Lifetime: {lifetime} mo</label>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={lifetime}
                onChange={(e) => setLifetime(Number(e.target.value))}
                className={`w-full ${isDarkMode ? 'accent-slate-400' : theme.primary.replace('bg-', 'accent-')} cursor-pointer h-1.5 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full appearance-none transition-all`}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-wider`}>Chart Period: {chartPeriod} mo</label>
              </div>
              <input
                type="range"
                min="6"
                max="36"
                value={chartPeriod}
                onChange={(e) => setChartPeriod(Number(e.target.value))}
                className={`w-full ${isDarkMode ? 'accent-slate-400' : theme.primary.replace('bg-', 'accent-')} cursor-pointer h-1.5 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full appearance-none transition-all`}
              />
            </div>
          </div>
        </div>

        <div className={`mt-8 pt-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'} flex flex-col gap-2`}>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={exportToCSV}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border ${isDarkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-50 text-slate-600'} transition-all text-[10px] font-bold shadow-sm`}
              >
                <FileText size={12} />
                CSV Data
              </button>
              <button
                onClick={exportToPNG}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border ${isDarkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-50 text-slate-600'} transition-all text-[10px] font-bold shadow-sm`}
              >
                <ImageIcon size={12} />
                PNG Chart
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={saveState}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border ${isDarkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-50 text-slate-600'} transition-all text-[10px] font-bold shadow-sm bg-emerald-500/5 hover:border-emerald-500/30`}
              >
                <Save size={12} className="text-emerald-500" />
                Save Scenario
              </button>
              <button
                onClick={loadState}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border ${isDarkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-50 text-slate-600'} transition-all text-[10px] font-bold shadow-sm bg-blue-500/5 hover:border-blue-500/30`}
              >
                <FolderOpen size={12} className="text-blue-500" />
                Load Scenario
              </button>
            </div>

            <button
              onClick={reset}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border ${isDarkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-50 text-slate-600'} transition-all text-xs font-bold shadow-sm`}
            >
              <RotateCcw size={14} />
              Reset All
            </button>
            <button className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg ${theme.primary} hover:opacity-90 transition-all text-xs font-bold text-white shadow-lg shadow-blue-600/10`}>
              <Share2 size={14} />
              Share Report
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 p-6 lg:p-10 overflow-x-hidden space-y-8 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'} transition-colors duration-300`}>
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className={`text-3xl font-extrabold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'} tracking-tight`}>Executive Dashboard</h2>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>Model Status: {calculations.lastMonth.capital > 0 ? (
              <span className="text-emerald-500">Solvent</span>
            ) : (
              <span className="text-rose-500">Deficit</span>
            )}</p>
          </div>
          <div className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-300 bg-slate-900 border-slate-800' : 'text-slate-400 bg-white border-slate-200'} uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border shadow-sm`}>
            Automated Analysis Report
          </div>
        </header>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Unit Economics Card */}
          <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all`}>
            <div className={`${isDarkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50/80 border-slate-200'} border-b px-6 py-4 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Users size={16} className={theme.text} />
                <h3 className={`text-[10px] font-extrabold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-widest text-xs`}>Unit Economics</h3>
              </div>
              <ChevronRight size={14} className={isDarkMode ? 'text-slate-700' : 'text-slate-300'} />
            </div>
            <div className={`grid grid-cols-2 md:grid-cols-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <MetricBlock label="CAC" value={formatter.format(calculations.unit.cac)} colorClass="text-rose-600" isDark={isDarkMode} />
              <MetricBlock label="ARPU" value={formatter.format(calculations.unit.arpu)} colorClass={theme.text} isDark={isDarkMode} />
              <MetricBlock label="Margin" value={formatter.format(calculations.unit.margin)} colorClass="text-emerald-600" isDark={isDarkMode} />
              <MetricBlock label="LTV" value={formatter.format(calculations.unit.ltv)} colorClass={isDarkMode ? "text-slate-200" : "text-slate-800"} isDark={isDarkMode} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <MetricBlock 
                label="LTV / CAC ratio" 
                value={`${calculations.unit.ltvCac.toFixed(1)}x`} 
                colorClass={calculations.unit.ltvCac >= 3 ? 'text-emerald-600' : 'text-rose-600'}
                subValue={calculations.unit.ltvCac >= 3 ? '✓ Robust business model' : '✗ Economics need attention (target ≥ 3x)'}
                isDark={isDarkMode}
              />
              <MetricBlock 
                label="Payback" 
                value={`${calculations.unit.payback.toFixed(1)} mo`} 
                colorClass="text-indigo-600"
                subValue={`${calculations.unit.paybackPercent.toFixed(0)}% of total lifetime`}
                isDark={isDarkMode}
              />
            </div>
          </div>

          {/* Business Vital Signs Card */}
          <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all`}>
            <div className={`${isDarkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50/80 border-slate-200'} border-b px-6 py-4 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Briefcase size={16} className={theme.text} />
                <h3 className={`text-[10px] font-extrabold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-widest text-xs`}>Business Projections (Month {chartPeriod})</h3>
              </div>
              <ChevronRight size={14} className={isDarkMode ? 'text-slate-700' : 'text-slate-300'} />
            </div>
            <div className={`grid grid-cols-2 md:grid-cols-3 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <MetricBlock label="Revenue" value={kFormatter(calculations.lastMonth.revenue)} isDark={isDarkMode} />
              <MetricBlock label="Monthly Burn" value={kFormatter(calculations.lastMonth.expenses)} isDark={isDarkMode} />
              <MetricBlock label="Profitability" value={kFormatter(calculations.lastMonth.profit)} colorClass={calculations.lastMonth.profit > 0 ? theme.text : "text-rose-600"} isDark={isDarkMode} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3">
              <MetricBlock label="Total Capital" value={kFormatter(calculations.lastMonth.capital)} colorClass={calculations.lastMonth.capital > 0 ? "text-emerald-600" : "text-rose-600"} isDark={isDarkMode} />
              <MetricBlock label="Current Clients" value={calculations.lastMonth.clients.toString()} colorClass="text-indigo-600" isDark={isDarkMode} />
              <MetricBlock 
                label="Break-Even" 
                value={calculations.lastMonth.firstProfitMonth !== -1 ? `M${calculations.lastMonth.firstProfitMonth}` : 'N/A'} 
                colorClass="text-emerald-600"
                subValue={calculations.lastMonth.firstProfitMonth !== -1 ? "Profitably operating" : "Capital heavy"}
                isDark={isDarkMode}
              />
            </div>
            {calculations.lastMonth.deathMonth !== -1 && (
              <div className={`${isDarkMode ? 'bg-rose-950/20 border-rose-900/50 text-rose-500' : 'bg-rose-50 border-rose-100 text-rose-700'} p-4 flex items-center gap-3 text-xs font-bold border-t`}>
                <AlertTriangle size={18} className="shrink-0" />
                Critical: Capital depletion estimated at month M{calculations.lastMonth.deathMonth}. Immediate intervention required.
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Growth Chart Area */}
        <div 
          ref={chartRef}
          className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-2xl p-8 shadow-sm transition-all`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
              <h3 className={`text-xl font-extrabold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'} flex items-center gap-2`}>
                <TrendingUp className={theme.text} size={24} />
                Financial Performance Forecast
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} mt-1.5 font-bold uppercase tracking-wider`}>
                Full Year Projection based on current unit economics
              </p>
            </div>
            <div className={`flex flex-wrap gap-4 text-[9px] font-extrabold ${isDarkMode ? 'text-slate-400 bg-slate-800/50 border-slate-700' : 'text-slate-500 bg-slate-50 border-slate-200'} uppercase tracking-widest p-3 rounded-xl border`}>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500" /> Customers</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> Revenue</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /> Expenses</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Profit</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> Capital</div>
            </div>
          </div>

          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={calculations.chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#1e293b" : "#e2e8f0"} vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke={isDarkMode ? "#475569" : "#94a3b8"} 
                  tick={{ fontSize: 11, fontWeight: 600 }} 
                  axisLine={false} 
                  tickLine={false}
                  dy={15}
                  tickFormatter={(val) => `M${val}`}
                />
                <YAxis 
                  stroke={isDarkMode ? "#475569" : "#94a3b8"} 
                  tick={{ fontSize: 11, fontWeight: 600 }} 
                  axisLine={false} 
                  tickLine={false}
                  dx={-10}
                  tickFormatter={(v) => `$${v}k`} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#0f172a' : '#fff', 
                    border: `1px solid ${isDarkMode ? '#1e293b' : '#e2e8f0'}`, 
                    borderRadius: '16px', 
                    fontSize: '13px', 
                    padding: '16px', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }} 
                  itemStyle={{ fontWeight: 600, padding: '2px 0' }}
                  labelStyle={{ color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Line type="monotone" dataKey="clients" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: isDarkMode ? '#0f172a' : '#fff' }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="revenue" stroke={theme.chart} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: isDarkMode ? '#0f172a' : '#fff' }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: isDarkMode ? '#0f172a' : '#fff' }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: isDarkMode ? '#0f172a' : '#fff' }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="capital" stroke="#f59e0b" strokeWidth={4} strokeDasharray="6 6" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className={`mt-10 p-6 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-xl space-y-4 transition-all`}>
             <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                <Info size={14} className={theme.text} />
                Visual Legend & Reference
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-[11px]">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-1 shrink-0" />
                  <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}><strong className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>Total Customers</strong> — active and paying users</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                  <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}><strong className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>Revenue Volume</strong> — gross monthly billings ($k)</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
                  <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}><strong className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>Operating Expenses</strong> — burn including ads ($k)</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}><strong className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>Net Profit</strong> — bottom line profitability ($k)</span>
                </div>
                <div className="flex gap-3 col-span-1 md:col-span-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                  <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}><strong className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>Treasury Capital</strong> — remaining cash assets (tracked by dashed orange line)</span>
                </div>
             </div>
          </div>
        </div>

        {/* Insight Analytics & Recommendations */}
        <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-2xl p-8 shadow-sm transition-all`}>
           <div className="flex items-center gap-3 mb-10">
              <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-100'} p-2.5 rounded-xl border`}>
                <Target className={theme.text} size={24} />
              </div>
              <div>
                <h3 className={`text-xl font-extrabold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'} tracking-tight`}>Key Insights & Strategic Guidance</h3>
                <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} font-bold uppercase tracking-wider`}>AI-Powered Model Audit</p>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Data Summary Column */}
              <div className="space-y-4">
                <div className={`flex items-center justify-between py-3 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Unit Margin:</span>
                  <span className={`text-sm font-extrabold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'} font-mono`}>
                    {formatter.format(calculations.unit.margin)} <span className="text-[10px] text-emerald-600">({((calculations.unit.margin/calculations.unit.arpu)*100).toFixed(0)}%)</span>
                  </span>
                </div>
                <div className={`flex items-center justify-between py-3 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated LTV:</span>
                  <span className={`text-sm font-extrabold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'} font-mono`}>{formatter.format(calculations.unit.ltv)} <span className="text-[10px] text-slate-400 font-bold uppercase ml-1">over {lifetime} mo</span></span>
                </div>
                <div className={`flex items-center justify-between py-3 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Runway Health:</span>
                  <span className={`text-sm font-extrabold font-mono ${calculations.lastMonth.capital > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {calculations.lastMonth.capital > 0 ? "Healthy Balance" : "Negative Equity"} ({formatter.format(calculations.lastMonth.capital * 1000)})
                  </span>
                </div>
                <div className={`flex items-center justify-between py-3 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Model Scalability:</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-extrabold font-mono ${calculations.unit.ltvCac >= 3 ? "text-emerald-600" : "text-rose-600"}`}>
                      {calculations.unit.ltvCac.toFixed(2)}x Ratio
                    </span>
                    {calculations.unit.ltvCac >= 3 ? <CheckCircle2 size={16} className="text-emerald-600" /> : <XCircle size={16} className="text-rose-600" />}
                  </div>
                </div>
                <div className={`mt-8 p-5 rounded-xl ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} border`}>
                   <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} leading-relaxed uppercase tracking-wider`}>
                     Strategic Verdict: <span className={`${isDarkMode ? 'text-slate-200' : 'text-slate-800'} lowercase first-letter:uppercase`}>{calculations.unit.ltvCac < 3 ? "Immediate focus on improving unit margins or drastically reducing acquisition costs is recommended before scaling spend." : "The core business model demonstrates high capital efficiency and is primed for accelerated marketing investment."}</span>
                   </p>
                </div>
              </div>

              {/* Action Roadmap Column */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.25em] mb-4">Action Pipeline</h4>
                
                <AnimatePresence mode="popLayout">
                  {calculations.unit.ltvCac < 3 && (
                    <motion.div key="ltv-cac-advice" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                      <AdviceItem 
                        title="Optimize LTV/CAC Ratio" 
                        icon={AlertTriangle} 
                        isDark={isDarkMode}
                        suggestions={[
                          "Refine pricing strategy with anchor points to increase average order volume.",
                          "Identify high-intent acquisition channels with lower friction to decrease CAC.",
                          "Deploy retention automations to extend the average customer lifetime."
                        ]}
                      />
                    </motion.div>
                  )}

                  {calculations.unit.payback > 3 && (
                    <motion.div key="payback-advice" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <AdviceItem 
                        title="Accelerate Payback Cycle" 
                        variant="info"
                        icon={RotateCcw} 
                        isDark={isDarkMode}
                        suggestions={[
                          "Prioritize organic growth loops and SEO-driven inbound traffic.",
                          "Optimize checkout conversion rates to drive efficiency in paid funnels."
                        ]}
                      />
                    </motion.div>
                  )}

                  {(calculations.lastMonth.deathMonth !== -1 || calculations.lastMonth.capital < 0) && (
                    <motion.div key="cashflow-advice" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <AdviceItem 
                        title="Cash Flow Emergency" 
                        variant="error"
                        icon={AlertTriangle} 
                        isDark={isDarkMode}
                        suggestions={[
                          "Injection Required: the current burn rate exceeds your capitalized runway.",
                          "Cost Rationalization: Audit non-essential fixed expenses immediately.",
                          "Pivotal Shift: accelerate profitable cohorts to subsidize earlier growth."
                        ]}
                      />
                    </motion.div>
                  )}

                  {calculations.unit.ltvCac >= 4 && (
                    <motion.div key="scaling-advice" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <AdviceItem 
                        title="Scalability Confirmed" 
                        variant="info"
                        icon={TrendingUp} 
                        isDark={isDarkMode}
                        suggestions={[
                          "Aggressive Capital Deployment: scale marketing spend in 20% weekly increments.",
                          "Increase team bandwidth to handle expected increase in customer volume."
                        ]}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
           </div>
        </div>

        {/* Dynamic Interactive Footer */}
        <footer className={`pt-16 pb-10 text-center border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
           <div className={`flex items-center justify-center gap-2.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} text-[10px] font-extrabold uppercase tracking-[0.3em]`}>
             Financial Intelligence Systems <span className={isDarkMode ? 'text-slate-300' : 'text-slate-800'}>FinCalc v2.4</span>
           </div>
           <p className={`mt-5 text-[11px] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'} max-w-xl mx-auto leading-loose font-medium px-4`}>
             Projections are algorithmic estimates based on primary inputs. Financial results are subject to market volatility and execution risk. For professional strategic use only.
           </p>
        </footer>
      </main>
    </div>
  );
}
