import React, { useState, useEffect, useMemo } from 'react';
import { Search, Car, Anchor, DollarSign, ShieldCheck, Zap, Scale, Info, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VEHICLES, Vehicle } from './constants';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [purchasePrice, setPurchasePrice] = useState<number | ''>('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    if (!searchTerm) return [];
    return VEHICLES.filter(v => 
      v.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm]);

  const pricing = useMemo(() => {
    if (!selectedVehicle || purchasePrice === '') return null;

    const pPrice = Number(purchasePrice);
    // Ideal price: 25% profit (midpoint of 20-30%)
    let ideal = pPrice * 1.25;
    
    // Rule: Never exceed max price. If it does, adjust to 95% of max.
    if (ideal > selectedVehicle.maxPrice) {
      ideal = selectedVehicle.maxPrice * 0.95;
    }

    const profit = ideal - pPrice;

    // Offers (5% to 15% below ideal, but always with profit)
    const calculateOffer = (discount: number) => {
      let offer = ideal * (1 - discount);
      // Ensure profit (at least 5% over purchase price if discount kills profit)
      if (offer <= pPrice) {
        offer = pPrice * 1.05;
      }
      return offer;
    };

    return {
      ideal,
      profit,
      quick: calculateOffer(0.15),
      balanced: calculateOffer(0.10),
      safe: calculateOffer(0.05),
    };
  }, [selectedVehicle, purchasePrice]);

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setSearchTerm(vehicle.name);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-brand-black text-white font-sans selection:bg-brand-cyan/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-brand-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center border border-brand-cyan/20 shadow-glow-cyan">
              <Anchor className="text-brand-cyan w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">NOVA <span className="text-brand-cyan">NÁUTICA</span></h1>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Dashboard Premium</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-white/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
            Mercado em Tempo Real
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Search Section */}
        <section className="relative">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-cyan transition-colors" />
            <input
              type="text"
              placeholder="Buscar veículo (ex: Audi RS5, Mustang...)"
              className="w-full bg-brand-dark border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-lg focus:outline-none focus:border-brand-cyan/50 focus:ring-4 focus:ring-brand-cyan/5 transition-all placeholder:text-white/20"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
          </div>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-brand-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-40"
              >
                {suggestions.map((v) => (
                  <button
                    key={v.name}
                    onClick={() => handleSelectVehicle(v)}
                    className="w-full px-6 py-4 text-left hover:bg-white/5 flex items-center justify-between group transition-colors border-b border-white/5 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Car className="w-5 h-5 text-white/30 group-hover:text-brand-cyan transition-colors" />
                      <span className="font-medium">{v.name}</span>
                    </div>
                    <span className="text-xs text-white/40 font-mono">{formatCurrency(v.maxPrice)}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {selectedVehicle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Input & Info Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-brand-dark border border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 blur-3xl rounded-full -mr-16 -mt-16" />
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Car className="text-brand-cyan w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedVehicle.name}</h2>
                    <p className="text-sm text-white/40">Limite de Mercado: <span className="text-white/60 font-mono">{formatCurrency(selectedVehicle.maxPrice)}</span></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest">Preço que eu paguei</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-cyan w-5 h-5" />
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xl font-mono focus:outline-none focus:border-brand-cyan/50 transition-all"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
                  <Info className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                  <p className="text-xs text-white/50 leading-relaxed">
                    O cálculo aplica automaticamente uma margem de lucro de 25%. Se o valor exceder o limite de mercado, ele será ajustado para 95% do teto permitido.
                  </p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-7 space-y-6">
              {pricing ? (
                <>
                  {/* Main Ideal Price Card */}
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-brand-dark border-2 border-brand-cyan/30 rounded-3xl p-10 shadow-glow-cyan relative overflow-hidden flex flex-col items-center text-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-cyan/5 to-transparent pointer-events-none" />
                    <span className="text-xs font-bold text-brand-cyan uppercase tracking-[0.3em] mb-4">Preço Ideal de Venda</span>
                    <div className="text-5xl sm:text-7xl font-black text-white tracking-tighter drop-shadow-glow-cyan mb-4">
                      {formatCurrency(pricing.ideal)}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold">
                      <TrendingUp className="w-4 h-4" />
                      Lucro Estimado: {formatCurrency(pricing.profit)}
                    </div>
                  </motion.div>

                  {/* Negotiation Offers */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <OfferCard
                      icon={<Zap className="w-5 h-5 text-orange-400" />}
                      label="Oferta Rápida"
                      price={pricing.quick}
                      desc="Venda imediata"
                      color="orange"
                    />
                    <OfferCard
                      icon={<Scale className="w-5 h-5 text-brand-cyan" />}
                      label="Equilibrada"
                      price={pricing.balanced}
                      desc="Melhor custo-benefício"
                      color="cyan"
                    />
                    <OfferCard
                      icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
                      label="Oferta Segura"
                      price={pricing.safe}
                      desc="Máximo lucro possível"
                      color="emerald"
                    />
                  </div>
                </>
              ) : (
                <div className="h-full min-h-[300px] border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-white/20">
                  <DollarSign className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium">Insira o preço de compra para calcular</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {!selectedVehicle && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-brand-dark border border-white/5 flex items-center justify-center shadow-2xl">
              <Car className="w-10 h-10 text-white/10" />
            </div>
            <div className="max-w-md">
              <h3 className="text-2xl font-bold mb-2">Pronto para negociar?</h3>
              <p className="text-white/40">Selecione um veículo acima para começar a precificação inteligente e dominar o mercado.</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/20 text-xs font-medium uppercase tracking-widest">
        <div className="flex flex-col gap-1">
          <p>© 2026 Nova Náutica Vehicle Pricing System</p>
          <p className="text-brand-cyan/40 normal-case">Página desenvolvida por Kauan Silva</p>
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:text-brand-cyan cursor-pointer transition-colors">Termos</span>
          <span className="hover:text-brand-cyan cursor-pointer transition-colors">Privacidade</span>
          <span className="hover:text-brand-cyan cursor-pointer transition-colors">Suporte</span>
        </div>
      </footer>
    </div>
  );
}

function OfferCard({ icon, label, price, desc, color }: { icon: React.ReactNode, label: string, price: number, desc: string, color: 'orange' | 'cyan' | 'emerald' }) {
  const colorClasses = {
    orange: 'border-orange-500/20 bg-orange-500/5 text-orange-400',
    cyan: 'border-brand-cyan/20 bg-brand-cyan/5 text-brand-cyan',
    emerald: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
  };

  return (
    <div className={`p-6 rounded-2xl border ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} transition-all hover:scale-[1.02]`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</span>
      </div>
      <div className="text-xl font-mono font-bold mb-1">{formatCurrency(price)}</div>
      <p className="text-[10px] text-white/30 font-medium uppercase">{desc}</p>
    </div>
  );
}
