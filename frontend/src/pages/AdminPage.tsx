import { useAdminStats, useGenerateDiscount } from '../features/admin/hooks/useAdmin';
import { LoadingSpinner, ErrorState } from '../shared/components/States';
import { formatPrice, formatDate } from '../shared/utils/helpers';
import {
  TrendingUp, ShoppingBag, Tag, Wallet,
  CheckCircle2, XCircle, Clock, PartyPopper, BarChart3, Gift,
  Blocks
} from 'lucide-react';

export default function AdminPage() {
  const { data: stats, isLoading, error } = useAdminStats();
  const generateMutation = useGenerateDiscount();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState message={(error as Error).message} />;
  if (!stats) return null;

  const { canGenerateNewCode, nextCodeAt } = stats.discountEligibility;
  const progressTarget = nextCodeAt ?? (stats.discountEligibility.codesGenerated + 1) * stats.discountConfig.everyNOrders;
  const progressPct = Math.min(100, (stats.totalOrders / progressTarget) * 100);

  const statCards = [
    {
      id: 'total-orders',
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-primary',
      bg: 'bg-primary/8',
      border: 'border-primary/15',
    },
    {
      id: 'total-revenue',
      label: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/8',
      border: 'border-success/15',
    },
    {
      id: 'items-purchased',
      label: 'Items Purchased',
      value: stats.totalItemsPurchased,
      icon: BarChart3,
      color: 'text-accent',
      bg: 'bg-accent/8',
      border: 'border-accent/15',
    },
    {
      id: 'total-discounts',
      label: 'Discounts Given',
      value: formatPrice(stats.totalDiscountGiven),
      icon: Wallet,
      color: '',
      bg: 'bg-secondary/8',
      border: 'border-secondary/15',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ id, label, value, icon: Icon, color, bg, border }) => (
            <div key={id} className={`bg-white rounded-xl border ${border} shadow-card p-4 sm:p-5 animate-fade-in`}>
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">{label}</p>
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${color}`} />
                </div>
              </div>
              <p className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Generate Discount ───────────────────────────────────────────────── */}
        <div className={`bg-white rounded-xl border shadow-card overflow-hidden ${canGenerateNewCode ? 'border-primary/30' : 'border-border'}`}>
          <div className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${canGenerateNewCode ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground text-base">Generate Discount Code</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {canGenerateNewCode ? (
                      <span className="flex items-center gap-1.5 text-primary font-medium">
                        <PartyPopper className="w-3.5 h-3.5" />
                        {stats.discountEligibility.codesEligible - stats.discountEligibility.codesGenerated} code(s) ready to generate!
                      </span>
                    ) : nextCodeAt ? (
                      `Next code unlocks after Order Number ${nextCodeAt} (Current Order Number: ${stats.totalOrders})`
                    ) : (
                      `Place ${stats.discountConfig.everyNOrders} orders to unlock the first code`
                    )}
                  </p>
                </div>
              </div>

              <button
                id="generate-discount-btn"
                onClick={() => generateMutation.mutate()}
                disabled={!canGenerateNewCode || generateMutation.isPending}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm
                  hover:bg-primary/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-200 shadow-sm hover:shadow-md self-start sm:self-auto shrink-0"
              >
                {generateMutation.isPending ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <Blocks className="w-4 h-4" />
                )}
                Generate Code
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>Order progress</span>
                <span className="font-medium text-foreground">{stats.totalOrders} / {progressTarget} orders</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-primary to-teal-400"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{Math.round(progressPct)}% towards next discount code</p>
            </div>
          </div>
        </div>

        {/* ── Discount Codes Table ──── */}
        <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              <h2 className="font-bold text-foreground text-base">Discount Codes</h2>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="inline-flex items-center gap-1 bg-success/10 text-success border border-success/20 rounded-full px-3 py-1 font-medium">
                <CheckCircle2 className="w-3 h-3" /> {stats.totalDiscountCodesUsed} used
              </span>
              <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground border border-border rounded-full px-3 py-1 font-medium">
                {stats.totalDiscountCodesGenerated - stats.totalDiscountCodesUsed} available
              </span>
            </div>
          </div>

          {stats.discountCodes.length === 0 ? (
            <div className="py-14 text-center text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No discount codes yet</p>
              <p className="text-sm mt-1">Place {stats.discountConfig.everyNOrders} orders to unlock the first one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {['Code', 'Discount', 'Status', 'Created', 'Used At'].map((h) => (
                      <th key={h} className="text-left py-3 px-4 sm:px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats.discountCodes.map((dc) => (
                    <tr key={dc.code} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 sm:px-6">
                        <code className="font-mono text-primary bg-primary/8 border border-primary/15 px-2.5 py-0.5 rounded-md text-xs font-semibold tracking-wide">
                          {dc.code}
                        </code>
                      </td>
                      <td className="py-3 px-4 sm:px-6">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold">
                          {dc.discountPercent}% OFF
                        </span>
                      </td>
                      <td className="py-3 px-4 sm:px-6">
                        {dc.isUsed ? (
                          <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
                            <XCircle className="w-3.5 h-3.5 text-destructive/60" /> Used
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-success text-xs font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Available
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 sm:px-6 text-muted-foreground text-xs whitespace-nowrap">{formatDate(dc.createdAt)}</td>
                      <td className="py-3 px-4 sm:px-6 text-muted-foreground text-xs whitespace-nowrap">
                        {dc.usedAt ? formatDate(dc.usedAt) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
