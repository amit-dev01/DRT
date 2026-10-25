import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, Check, ChevronDown,
  ChevronLeft, ChevronRight, CircleHelp, Clock3, Copy, Cpu, Database, Gauge,
  Globe2, KeyRound, LayoutDashboard, LockKeyhole, Menu, MoreHorizontal,
  Network, Play, Plus, Search, Settings2, Shield, ShieldAlert, ShieldCheck,
  SlidersHorizontal, Sparkles, TerminalSquare, UserRound, X, Zap,
} from 'lucide-react'
import './style.css'
import './accessibility.css'

const initialRules = [
  { id: 'RL-001', name: 'Public API · Standard', scope: 'All routes', algorithm: 'Token bucket', limit: '120 req / min', burst: '20', dimensions: ['IP', 'API key'], status: 'Active', color: 'mint' },
  { id: 'RL-002', name: 'Authenticated users', scope: '/api/v1/**', algorithm: 'Sliding window log', limit: '600 req / hour', burst: '—', dimensions: ['User', 'IP'], status: 'Active', color: 'blue' },
  { id: 'RL-003', name: 'Partner integrations', scope: '/api/partners/**', algorithm: 'Token bucket', limit: '2,400 req / hour', burst: '80', dimensions: ['API key'], status: 'Active', color: 'purple' },
  { id: 'RL-004', name: 'Login protection', scope: '/api/auth/login', algorithm: 'Sliding window counter', limit: '8 req / min', burst: '—', dimensions: ['IP', 'User'], status: 'Active', color: 'orange' },
  { id: 'RL-005', name: 'Webhook ingestion', scope: '/api/webhooks/**', algorithm: 'Sliding window counter', limit: '900 req / min', burst: '—', dimensions: ['API key'], status: 'Paused', color: 'gray' },
]

const seedEvents = [
  { id: 1, time: '12:42:08.421', method: 'POST', path: '/api/v1/orders', identity: 'usr_•••8f2a', dimension: 'User', status: 200, latency: '24 ms' },
  { id: 2, time: '12:42:08.109', method: 'GET', path: '/api/v1/products', identity: 'key_•••91bc', dimension: 'API key', status: 200, latency: '18 ms' },
  { id: 3, time: '12:42:07.884', method: 'POST', path: '/api/auth/login', identity: '203.0.113.42', dimension: 'IP', status: 429, latency: '6 ms' },
  { id: 4, time: '12:42:07.541', method: 'GET', path: '/api/v1/profile', identity: 'usr_•••3c11', dimension: 'User', status: 200, latency: '31 ms' },
  { id: 5, time: '12:42:06.972', method: 'DELETE', path: '/api/v1/sessions', identity: 'key_•••6da0', dimension: 'API key', status: 200, latency: '42 ms' },
]

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Rate limits', icon: SlidersHorizontal, count: '5' },
  { label: 'Live traffic', icon: Activity, count: 'LIVE' },
  { label: 'Redis health', icon: Database },
]

function IconButton({ children, label, onClick, className = '' }) {
  return <button className={`icon-button ${className}`} aria-label={label} onClick={onClick}>{children}</button>
}

function Sidebar({ page, setPage, mobileOpen, closeMobile }) {
  return <>
    {mobileOpen && <button className="mobile-scrim" onClick={closeMobile} aria-label="Close navigation" />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand-row">
        <div className="brand-mark"><Shield size={21} strokeWidth={2.5} /><span /></div>
        <div className="brand-name">drt<span>gateway</span></div>
        <IconButton className="mobile-close" label="Close menu" onClick={closeMobile}><X size={18} /></IconButton>
      </div>
      <button className="workspace-switch">
        <span className="workspace-avatar">A</span>
        <span className="workspace-copy"><strong>Acme workspace</strong><small>Preview environment</small></span>
        <ChevronDown size={15} />
      </button>
      <div className="nav-label">WORKSPACE</div>
      <nav className="main-nav" aria-label="Main navigation">
        {navItems.map(({ label, icon: Icon, count }) => <button key={label} onClick={() => { setPage(label); closeMobile() }} className={`nav-item ${page === label ? 'active' : ''}`}>
          <Icon size={17} strokeWidth={1.9} /><span>{label}</span>{count && <span className={`nav-count ${count === 'LIVE' ? 'live-count' : ''}`}>{count === 'LIVE' && <i />}{count}</span>}
        </button>)}
      </nav>
      <div className="sidebar-divider" />
      <div className="nav-label">CONFIGURATION</div>
      <button className={`nav-item ${page === 'Settings' ? 'active' : ''}`} onClick={() => { setPage('Settings'); closeMobile() }}><Settings2 size={17} /><span>Settings</span></button>
      <button className="nav-item" onClick={() => setPage('API docs')}><TerminalSquare size={17} /><span>API docs</span><ArrowUpRight size={13} className="external-icon" /></button>
      <div className="sidebar-spacer" />
      <div className="redis-mini">
        <div className="redis-mini-top"><span className="status-dot" />Redis cluster<span className="online-text">Healthy</span></div>
        <div className="redis-mini-sub">3 nodes <span>·</span> 2.4 ms avg</div>
        <div className="redis-spark"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
      </div>
      <div className="sidebar-divider" />
      <button className="profile-row">
        <span className="profile-avatar">JD</span><span className="profile-copy"><strong>Jordan Davis</strong><small>Platform admin</small></span><MoreHorizontal size={18} />
      </button>
    </aside>
  </>
}

function Topbar({ onMenu, onTest, page }) {
  return <header className="topbar">
    <div className="topbar-left"><IconButton className="mobile-menu" label="Open menu" onClick={onMenu}><Menu size={19} /></IconButton><div className="breadcrumbs"><span>Control plane</span><ChevronRight size={14} /><strong>{page}</strong></div></div>
    <div className="topbar-right"><div className="environment-pill preview-environment"><i />Preview</div><div className="topbar-separator" />
      <button className="topbar-action help-action"><CircleHelp size={16} />Help center</button>
      <IconButton className="notification-button" label="Notifications"><Bell size={17} /><i /></IconButton>
      <button className="topbar-test" onClick={onTest}><Play size={14} fill="currentColor" /> Test request</button>
    </div>
  </header>
}

function Heading({ title, subtitle, right }) {
  return <div className="page-heading"><div><div className="eyebrow">GATEWAY CONTROL PLANE</div><h1>{title}</h1><p>{subtitle}</p></div>{right}</div>
}

function MetricCard({ label, value, delta, positive, icon: Icon, accent, footnote }) {
  return <article className="metric-card">
    <div className="metric-top"><span>{label}</span><span className={`metric-icon ${accent}`}><Icon size={17} /></span></div>
    <div className="metric-value-row"><strong>{value}</strong><span className={`metric-delta ${positive ? 'positive' : 'negative'}`}>{positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{delta}</span></div>
    <div className="metric-footnote">{footnote}</div>
  </article>
}

function TrafficChart({ range, setRange }) {
  const [series, setSeries] = useState('requests')
  const points = series === 'requests'
    ? '0,98 28,93 56,100 84,83 112,88 140,70 168,75 196,58 224,66 252,47 280,56 308,40 336,52 364,30 392,38 420,18 448,32 476,25 504,40 532,20 560,28 588,10 616,22 644,13 672,29 700,15 728,25 756,8 784,18'
    : '0,115 28,118 56,112 84,120 112,108 140,114 168,103 196,110 224,100 252,108 280,96 308,103 336,88 364,95 392,86 420,98 448,82 476,92 504,76 532,88 560,72 588,84 616,67 644,76 672,61 700,73 728,58 756,67 784,51'
  return <section className="panel chart-panel">
    <div className="panel-header chart-header"><div><div className="panel-title">Request volume</div><div className="panel-subtitle">Traffic processed by the gateway</div></div>
      <div className="chart-controls"><div className="series-toggle"><button onClick={() => setSeries('requests')} className={series === 'requests' ? 'selected' : ''}><i className="legend-dot request-dot" />Requests</button><button onClick={() => setSeries('blocked')} className={series === 'blocked' ? 'selected' : ''}><i className="legend-dot blocked-dot" />Blocked</button></div><select aria-label="Chart time range" value={range} onChange={e => setRange(e.target.value)}><option>Last 24 hours</option><option>Last 7 days</option><option>Last 30 days</option></select></div>
    </div>
    <div className="chart-summary"><strong>{series === 'requests' ? '18,429' : '142'}</strong><span>req / min</span><span className="chart-summary-change"><ArrowUpRight size={13} /> 12.8%</span><span className="chart-summary-note">vs. previous period</span></div>
    <div className="chart-wrap"><div className="chart-y-labels"><span>20k</span><span>15k</span><span>10k</span><span>5k</span><span>0</span></div><svg className="traffic-chart" viewBox="0 0 784 140" preserveAspectRatio="none" role="img" aria-label={`${series} over the last 24 hours`}>
      <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={series === 'requests' ? '#20b486' : '#f59e0b'} stopOpacity=".2"/><stop offset="100%" stopColor={series === 'requests' ? '#20b486' : '#f59e0b'} stopOpacity="0"/></linearGradient></defs>
      {[12, 42, 72, 102, 132].map(y => <line key={y} x1="0" x2="784" y1={y} y2={y} className="chart-grid" />)}
      <polygon points={`0,140 ${points} 784,140`} fill="url(#chartFill)" />
      <polyline points={points} fill="none" stroke={series === 'requests' ? '#18a77b' : '#e89a25'} strokeWidth="2.3" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
      <line x1="644" x2="644" y1="0" y2="140" className="chart-guide" />
      <circle cx="644" cy="13" r="4" fill="white" stroke={series === 'requests' ? '#18a77b' : '#e89a25'} strokeWidth="2.5" />
    </svg><div className="chart-x-labels"><span>12 AM</span><span>4 AM</span><span>8 AM</span><span>12 PM</span><span>4 PM</span><span>8 PM</span><span>Now</span></div></div>
    <div className="chart-bottom-note"><span className="chart-note-icon"><Clock3 size={13} /></span>Peak traffic at <strong>11:42 AM</strong><span className="note-separator">·</span><span>18.4k requests / min</span><button>View analytics <ArrowRight size={13} /></button></div>
  </section>
}

function RuleTable({ rules, onEdit, onToggle, compact = false }) {
  return <div className="table-scroll"><table className="rules-table"><thead><tr><th>POLICY</th><th>ALGORITHM</th><th>LIMIT</th><th>DIMENSIONS</th><th>STATUS</th><th /></tr></thead><tbody>
    {rules.map(rule => <tr key={rule.id}>
      <td><div className="policy-name"><span className={`policy-icon ${rule.color}`}><ShieldCheck size={16} /></span><span><strong>{rule.name}</strong><small>{rule.scope}</small></span></div></td>
      <td><span className="algorithm-label">{rule.algorithm}</span></td>
      <td><strong className="limit-label">{rule.limit}</strong>{rule.burst !== '—' && <small className="burst-label">Burst {rule.burst}</small>}</td>
      <td><div className="dimension-list">{rule.dimensions.map(d => <span key={d} className="dimension-chip">{d === 'User' ? <UserRound size={11} /> : d === 'IP' ? <Globe2 size={11} /> : <KeyRound size={11} />}{d}</span>)}</div></td>
      <td><button className={`status-pill ${rule.status === 'Active' ? 'status-active' : 'status-paused'}`} onClick={() => onToggle(rule.id)}><i />{rule.status}</button></td>
      <td><IconButton label={`Edit ${rule.name}`} onClick={() => onEdit(rule)}><MoreHorizontal size={18} /></IconButton></td>
    </tr>)}
  </tbody></table>{rules.length === 0 && <div className="empty-state">No policies match your search.</div>}</div>
}

function Overview({ rules, onEdit, onToggle, range, setRange, onViewAll }) {
  const activeRules = rules.filter(r => r.status === 'Active').length
  return <>
    <Heading title="Overview" subtitle="A real-time view of your API traffic and rate limit policies." right={<div className="heading-updated"><span className="status-dot" />Sample metrics <span>·</span> Interactive preview</div>} />
    <div className="metrics-grid">
      <MetricCard label="Requests today" value="2.84M" delta="12.8%" positive icon={Activity} accent="mint" footnote="compared to yesterday" />
      <MetricCard label="Allowed requests" value="99.92%" delta="0.4%" positive icon={ShieldCheck} accent="blue" footnote="of total traffic" />
      <MetricCard label="Rate limited" value="2,281" delta="8.2%" positive={false} icon={ShieldAlert} accent="orange" footnote="requests blocked today" />
      <MetricCard label="Gateway latency" value="38 ms" delta="4.1%" positive icon={Zap} accent="purple" footnote="p95 · across 3 regions" />
    </div>
    <div className="main-grid"><TrafficChart range={range} setRange={setRange} /><aside className="side-stack">
      <section className="panel algorithm-panel"><div className="panel-header"><div><div className="panel-title">Active algorithm</div><div className="panel-subtitle">Applied across all policies</div></div><span className="icon-soft"><Settings2 size={16} /></span></div>
        <div className="algorithm-card"><div className="algorithm-emblem"><Gauge size={19} /></div><div><strong>Token bucket</strong><small>Atomic Redis Lua script</small></div><span className="algorithm-live"><i />LIVE</span></div>
        <div className="algorithm-facts"><div><span>Active policies</span><strong>{activeRules} <small>of {rules.length}</small></strong></div><div><span>Default failure mode</span><strong className="failure-open"><i />Fail open</strong></div></div>
        <button className="text-link" onClick={() => onViewAll('Rate limits')}>Manage policies <ArrowRight size={14} /></button>
      </section>
      <section className="panel redis-panel"><div className="panel-header"><div><div className="panel-title">Redis cluster</div><div className="panel-subtitle">Shared limiter state</div></div><span className="healthy-badge"><i />Healthy</span></div>
        <div className="redis-big-stat"><strong>2.4<span>ms</span></strong><small>average response time</small></div><div className="redis-nodes"><div><span className="node-check"><Check size={11} /></span><span>redis-primary-01</span><strong>Leader</strong><small>12.8 MB</small></div><div><span className="node-check"><Check size={11} /></span><span>redis-replica-02</span><strong>Replica</strong><small>12.6 MB</small></div><div><span className="node-check"><Check size={11} /></span><span>redis-replica-03</span><strong>Replica</strong><small>12.7 MB</small></div></div><button className="text-link" onClick={() => onViewAll('Redis health')}>View cluster health <ArrowRight size={14} /></button>
      </section>
    </aside></div>
    <section className="panel policy-panel"><div className="panel-header policy-panel-header"><div><div className="panel-title">Rate limit policies <span className="count-bubble">{rules.length}</span></div><div className="panel-subtitle">Policies currently protecting your APIs</div></div><div className="policy-actions"><button className="secondary-button" onClick={() => onViewAll('Rate limits')}><SlidersHorizontal size={14} />Manage policies</button><button className="primary-button" onClick={() => onEdit(null)}><Plus size={15} />New policy</button></div></div>
      <RuleTable rules={rules.slice(0, 5)} onEdit={onEdit} onToggle={onToggle} />
      <button className="view-all-row" onClick={() => onViewAll('Rate limits')}>View all policies <ArrowRight size={14} /></button>
    </section>
  </>
}

