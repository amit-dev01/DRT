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
import './hero.css'
import './motion.css'

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

function Sidebar({ page, setPage, mobileOpen, closeMobile, policyCount }) {
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
        {navItems.map(({ label, icon: Icon, count }) => <button key={label} onClick={() => { setPage(label); closeMobile() }} className={`nav-item ${page === label ? 'active' : ''}`} aria-current={page === label ? 'page' : undefined}>
          <Icon size={17} strokeWidth={1.9} /><span>{label}</span>{(count || label === 'Rate limits') && <span className={`nav-count ${count === 'LIVE' ? 'live-count' : ''}`}>{count === 'LIVE' && <i />}{label === 'Rate limits' ? policyCount : count}</span>}
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
      <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={series === 'requests' ? '#0066cc' : '#86868b'} stopOpacity=".2"/><stop offset="100%" stopColor={series === 'requests' ? '#0066cc' : '#86868b'} stopOpacity="0"/></linearGradient></defs>
      {[12, 42, 72, 102, 132].map(y => <line key={y} x1="0" x2="784" y1={y} y2={y} className="chart-grid" />)}
      <polygon points={`0,140 ${points} 784,140`} fill="url(#chartFill)" />
      <polyline points={points} fill="none" stroke={series === 'requests' ? '#0066cc' : '#86868b'} strokeWidth="2.3" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
      <line x1="644" x2="644" y1="0" y2="140" className="chart-guide" />
      <circle cx="644" cy="13" r="4" fill="#ffffff" stroke={series === 'requests' ? '#0066cc' : '#86868b'} strokeWidth="2.5" />
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

function Overview({ rules, onEdit, onToggle, range, setRange, onViewAll, onTest }) {
  const activeRules = rules.filter(r => r.status === 'Active').length
  return <>
    <section className="product-hero" aria-labelledby="product-hero-title">
      <div className="eyebrow">DRT GATEWAY&nbsp; / &nbsp;DISTRIBUTED RATE LIMITING</div>
      <h1 id="product-hero-title">Global limits.<br /><span>Atomic decisions.</span></h1>
      <p className="product-subheadline">Protect every request with shared Redis state, precise algorithms, and enforcement that stays consistent across every gateway instance.</p>
      <div className="product-hero-actions">
        <button className="primary-button" onClick={onTest}><Play size={14} fill="currentColor" />Run a test request</button>
        <button className="hero-secondary" onClick={() => onViewAll('Rate limits')}>Explore rate limits <ArrowRight size={14} /></button>
      </div>
      <div className="hero-visual"
        onPointerMove={event => {
          if (event.pointerType !== 'mouse') return
          const bounds = event.currentTarget.getBoundingClientRect()
          const x = (event.clientX - bounds.left) / bounds.width - .5
          const y = (event.clientY - bounds.top) / bounds.height - .5
          event.currentTarget.style.setProperty('--tilt-x', `${x * 5}deg`)
          event.currentTarget.style.setProperty('--tilt-y', `${y * -3.5}deg`)
        }}
        onPointerLeave={event => {
          event.currentTarget.style.setProperty('--tilt-x', '0deg')
          event.currentTarget.style.setProperty('--tilt-y', '0deg')
        }}>
        <div className="hero-orbit hero-orbit--one" aria-hidden="true"><i /></div>
        <div className="hero-orbit hero-orbit--two" aria-hidden="true"><i /></div>
        <img src="/images/drt-gateway-3d.png" alt="A 3D gateway appliance connecting distributed services through one blue-lit control point" />
        <div className="hero-image-caption"><span /> SHARED REDIS STATE <i /> ATOMIC LUA ENFORCEMENT</div>
        <div className="hero-callout">
          <span className="hero-callout-icon"><Database size={17} /></span>
          <span className="hero-callout-copy"><strong>Redis decision time</strong><small>Shared across all gateway instances</small></span>
          <span className="hero-callout-value">2.4<small> ms</small></span>
        </div>
      </div>
      <div className="hero-feature-rail">
        <div><span>01</span><strong>Atomic by design</strong><p>Each quota decision runs in one Redis Lua script.</p></div>
        <div><span>02</span><strong>One shared clock</strong><p>Redis time keeps instances aligned under load.</p></div>
        <div><span>03</span><strong>Three algorithms</strong><p>Choose token bucket or either sliding window.</p></div>
      </div>
    </section>
    <div className="overview-section-head" id="control-overview"><div><div className="eyebrow">CONTROL PLANE</div><h2>Overview</h2><p>A real-time view of your API traffic and rate limit policies.</p></div><div className="heading-updated"><span className="status-dot" />Sample metrics <span>·</span> Interactive preview</div></div>
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

function PoliciesPage({ rules, onEdit, onToggle }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All policies')
  const filtered = rules.filter(rule => (filter === 'All policies' || rule.status === filter) && `${rule.name} ${rule.scope} ${rule.algorithm}`.toLowerCase().includes(query.toLowerCase()))
  return <><Heading title="Rate limit policies" subtitle="Create and manage the rules protecting your API from abuse." right={<button className="primary-button" onClick={() => onEdit(null)}><Plus size={15} />Create policy</button>} />
    <div className="policy-summary-row"><div className="summary-tile"><span className="summary-icon mint"><ShieldCheck size={17} /></span><div><strong>{rules.filter(r => r.status === 'Active').length}</strong><small>Active policies</small></div></div><div className="summary-tile"><span className="summary-icon orange"><ShieldAlert size={17} /></span><div><strong>2,281</strong><small>Requests blocked today</small></div></div><div className="summary-tile"><span className="summary-icon blue"><Network size={17} /></span><div><strong>3</strong><small>Identity dimensions</small></div></div></div>
    <section className="panel full-table-panel"><div className="table-toolbar"><div className="search-field"><Search size={16} /><input aria-label="Search policies" placeholder="Search policies..." value={query} onChange={e => setQuery(e.target.value)} /></div><select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter policy status"><option>All policies</option><option>Active</option><option>Paused</option></select><button className="secondary-button"><SlidersHorizontal size={14} />Filters</button></div><RuleTable rules={filtered} onEdit={onEdit} onToggle={onToggle} /></section>
    <div className="info-banner"><span><Sparkles size={16} /></span><div><strong>Protect every request.</strong><p>Policies are enforced atomically across all gateway instances using Redis Lua scripts.</p></div><button onClick={() => onEdit(null)}>Add a policy <ArrowRight size={14} /></button></div>
  </>
}

function ActivityPage({ events, onTest }) {
  const [query, setQuery] = useState('')
  const shown = events.filter(e => `${e.path} ${e.identity} ${e.dimension} ${e.status}`.toLowerCase().includes(query.toLowerCase()))
  return <><Heading title="Live traffic" subtitle="Inspect recent requests flowing through your gateway." right={<button className="secondary-button" onClick={onTest}><Play size={14} />Generate test request</button>} />
    <div className="traffic-toolbar"><div className="live-indicator"><i />Sample event stream <span>·</span> 1.2k req/min</div><div className="traffic-tools"><div className="search-field"><Search size={15} /><input aria-label="Search requests" placeholder="Search requests..." value={query} onChange={e => setQuery(e.target.value)} /></div><select aria-label="Filter by response"><option>All responses</option><option>Allowed</option><option>Rate limited</option></select></div></div>
    <section className="panel activity-panel"><div className="traffic-table-wrap"><table className="traffic-table"><thead><tr><th>TIME</th><th>REQUEST</th><th>IDENTITY</th><th>LIMIT DIMENSION</th><th>STATUS</th><th>LATENCY</th></tr></thead><tbody>{shown.map((event, i) => <tr key={event.id}><td className="time-cell">{event.time}</td><td><span className={`method ${event.method.toLowerCase()}`}>{event.method}</span><code>{event.path}</code></td><td className="identity-cell">{event.identity}</td><td><span className="dimension-chip">{event.dimension}</span></td><td><span className={`response-pill ${event.status === 429 ? 'response-limited' : 'response-allowed'}`}><i />{event.status} {event.status === 429 ? 'Limited' : 'Allowed'}</span></td><td className="latency-cell">{event.latency}</td></tr>)}</tbody></table>{shown.length === 0 && <div className="empty-state">No requests match your search.</div>}</div></section>
    <div className="activity-footnote"><ShieldAlert size={15} /><span>Rate-limited requests are rejected before reaching your upstream service.</span><button>View response headers <ArrowRight size={13} /></button></div>
  </>
}

function RedisPage() {
  return <><Heading title="Redis health" subtitle="Health and performance of the shared rate-limit state store." right={<span className="healthy-badge"><i />All systems operational</span>} />
    <div className="redis-overview-grid"><div className="panel redis-health-card"><div className="health-hero"><div className="health-icon"><Database size={23} /></div><div><span className="eyebrow">REDIS CLUSTER</span><h2>Healthy and responding</h2><p>All nodes are reachable and replicating normally.</p></div><span className="healthy-badge"><i />Healthy</span></div><div className="health-stats"><div><small>Average latency</small><strong>2.4 <em>ms</em></strong><span className="positive-text"><ArrowDownRight size={13} /> 0.3 ms this hour</span></div><div><small>Connected clients</small><strong>148</strong><span>Across 3 gateway instances</span></div><div><small>Memory used</small><strong>12.8 <em>MB</em></strong><span>of 256 MB allocated</span></div></div><div className="memory-meter"><div><span>Memory utilization</span><strong>5.0%</strong></div><div className="meter-track"><i /></div></div></div>
      <div className="panel uptime-card"><div className="panel-title">Availability</div><div className="uptime-value">99.99<span>%</span></div><div className="uptime-caption">Uptime over the last 30 days</div><div className="uptime-bars">{Array.from({ length: 42 }, (_, i) => <i key={i} className={i === 16 ? 'bar-warn' : ''} />)}</div><div className="uptime-legend"><span>30 days ago</span><span><i />Operational</span><span>Today</span></div></div>
    </div><section className="panel nodes-panel"><div className="panel-header"><div><div className="panel-title">Cluster nodes</div><div className="panel-subtitle">Replication status and node performance</div></div><button className="secondary-button"><ArrowRight size={14} />Redis metrics</button></div><div className="node-cards">{[{name:'redis-primary-01',role:'Primary',zone:'us-east-1a',memory:'12.8 MB',latency:'2.1 ms'},{name:'redis-replica-02',role:'Replica',zone:'us-east-1b',memory:'12.6 MB',latency:'2.5 ms'},{name:'redis-replica-03',role:'Replica',zone:'us-east-1c',memory:'12.7 MB',latency:'2.7 ms'}].map(node => <div className="node-card" key={node.name}><div className="node-card-head"><span className="node-check"><Check size={12} /></span><span className="node-status">Online</span><MoreHorizontal size={17} /></div><strong>{node.name}</strong><span className="node-role">{node.role} <i>·</i> {node.zone}</span><div className="node-metrics"><span><small>Latency</small><b>{node.latency}</b></span><span><small>Memory</small><b>{node.memory}</b></span></div></div>)}</div></section>
    <div className="warning-banner"><LockKeyhole size={16} /><div><strong>Redis is the source of truth for rate-limit state.</strong><span> If Redis is unreachable, your gateway uses the configured <code>OPEN</code> failure mode.</span></div><button>Review settings <ArrowRight size={13} /></button></div>
  </>
}

function SettingsPage() {
  const [mode, setMode] = useState('Fail open')
  const [saved, setSaved] = useState(false)
  return <><Heading title="Settings" subtitle="Configure gateway defaults and operational behavior." />
    <div className="settings-grid"><section className="panel settings-panel"><div className="panel-title">Rate limiter defaults</div><p className="panel-subtitle">These settings are read from your Spring Boot application configuration.</p><label className="setting-control"><span><strong>Default algorithm</strong><small>Applied when a policy does not override it</small></span><select defaultValue="Token bucket"><option>Token bucket</option><option>Sliding window log</option><option>Sliding window counter</option></select></label><label className="setting-control"><span><strong>Redis failure mode</strong><small>How the gateway responds when Redis is unavailable</small></span><select value={mode} onChange={e => { setMode(e.target.value); setSaved(false) }}><option>Fail open</option><option>Fail closed</option></select></label><label className="setting-control"><span><strong>Rate-limit response</strong><small>HTTP status returned when a client exceeds its limit</small></span><span className="readonly-value">429 Too Many Requests</span></label><div className="settings-warning"><ShieldAlert size={16} /><span>Changes made in this preview are local only. Set <code>RATE_LIMIT_ALGORITHM</code> and <code>RATE_LIMIT_FAILURE_MODE</code> in your Spring Boot environment to apply them.</span></div><button className="primary-button" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2600) }}>{saved ? <Check size={15} /> : <Check size={15} />}{saved ? 'Preferences saved locally' : 'Save preferences'}</button></section>
      <section className="panel settings-side"><div className="panel-title">Identity dimensions</div><div className="setting-dimension"><span className="dimension-icon"><UserRound size={15} /></span><span><strong>User</strong><small>Authenticated principal or X-User-Id</small></span><span className="dimension-enabled"><i />Enabled</span></div><div className="setting-dimension"><span className="dimension-icon"><Globe2 size={15} /></span><span><strong>IP address</strong><small>Socket peer address</small></span><span className="dimension-enabled"><i />Enabled</span></div><div className="setting-dimension"><span className="dimension-icon"><KeyRound size={15} /></span><span><strong>API key</strong><small>X-API-Key header</small></span><span className="dimension-enabled"><i />Enabled</span></div><div className="settings-warning"><CircleHelp size={16} /><span>Forwarded IP headers are not trusted by default. Configure a trusted proxy before enabling client-IP extraction.</span></div></section></div>
  </>
}

function PolicyModal({ rule, onClose, onSave }) {
  const [name, setName] = useState(rule?.name || '')
  const [scope, setScope] = useState(rule?.scope || '/api/v1/**')
  const [limit, setLimit] = useState(rule?.limit || '100 req / min')
  const [algorithm, setAlgorithm] = useState(rule?.algorithm || 'Token bucket')
  const [error, setError] = useState('')
  function submit(e) { e.preventDefault(); if (!name.trim()) { setError('Give this policy a name.'); return } onSave({ ...(rule || {}), name, scope, limit, algorithm, dimensions: rule?.dimensions || ['IP'], burst: rule?.burst || '20', status: rule?.status || 'Active', id: rule?.id || `RL-${String(Date.now()).slice(-3)}`, color: rule?.color || 'mint' }) }
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}><section className="policy-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><div><span className="eyebrow">POLICY CONFIGURATION</span><h2 id="modal-title">{rule ? 'Edit policy' : 'Create a policy'}</h2></div><IconButton label="Close dialog" onClick={onClose}><X size={18} /></IconButton></div><form onSubmit={submit}><label>Policy name<input autoFocus value={name} onChange={e => { setName(e.target.value); setError('') }} placeholder="e.g. Public API standard" />{error && <small className="field-error">{error}</small>}</label><label>Route pattern<input value={scope} onChange={e => setScope(e.target.value)} placeholder="/api/v1/**" /></label><div className="form-two-col"><label>Algorithm<select value={algorithm} onChange={e => setAlgorithm(e.target.value)}><option>Token bucket</option><option>Sliding window log</option><option>Sliding window counter</option></select></label><label>Request limit<input value={limit} onChange={e => setLimit(e.target.value)} /></label></div><div className="modal-dimensions"><span>IDENTITY DIMENSIONS</span><div><span className="dimension-chip"><Globe2 size={12} />IP</span><span className="dimension-chip"><UserRound size={12} />User</span><span className="dimension-chip"><KeyRound size={12} />API key</span></div></div><div className="modal-footer"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button"><Check size={15} />{rule ? 'Save changes' : 'Create policy'}</button></div></form></section></div>
}

function Toast({ message, onClose }) {
  if (!message) return null
  return <div className="toast"><span><Check size={15} /></span>{message}<button onClick={onClose} aria-label="Dismiss"><X size={14} /></button></div>
}

export function App() {
  const [page, setPage] = useState('Overview')
  const [rules, setRules] = useState(initialRules)
  const [events, setEvents] = useState(seedEvents)
  const [range, setRange] = useState('Last 24 hours')
  const [modalRule, setModalRule] = useState(undefined)
  const [toast, setToast] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const testCount = useMemo(() => events.filter(e => e.id > 5).length, [events])

  function notify(text) { setToast(text); window.clearTimeout(window.toastTimer); window.toastTimer = window.setTimeout(() => setToast(''), 3200) }
  function runTest() {
    const denied = testCount % 4 === 3
    const nextId = Math.max(...events.map(e => e.id)) + 1
    const time = new Date().toLocaleTimeString('en-US', { hour12: false }) + '.' + String(Date.now()).slice(-3)
    const event = { id: nextId, time, method: 'GET', path: '/api/v1/demo', identity: 'demo_•••' + String(nextId).slice(-2), dimension: 'API key', status: denied ? 429 : 200, latency: denied ? '4 ms' : '22 ms' }
    setEvents(prev => [event, ...prev].slice(0, 15))
    notify(denied ? 'Test request rate limited · HTTP 429' : 'Test request allowed · HTTP 200')
  }
  function toggleRule(id) {
    setRules(prev => prev.map(rule => rule.id === id ? { ...rule, status: rule.status === 'Active' ? 'Paused' : 'Active' } : rule))
    const changed = rules.find(rule => rule.id === id)
    notify(`${changed?.name || 'Policy'} ${changed?.status === 'Active' ? 'paused' : 'activated'} in preview`)
  }
  function saveRule(updated) {
    setRules(prev => prev.some(rule => rule.id === updated.id) ? prev.map(rule => rule.id === updated.id ? updated : rule) : [updated, ...prev])
    setModalRule(undefined)
    notify('Policy saved in preview')
  }
  function viewPage(next) { setPage(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return <div className="app-shell">
    <Sidebar page={page} setPage={viewPage} mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} policyCount={rules.length} />
    <div className="app-main"><Topbar onMenu={() => setMobileOpen(true)} onTest={runTest} page={page} />
      <main className="content">
        {page === 'Overview' && <Overview rules={rules} onEdit={setModalRule} onToggle={toggleRule} range={range} setRange={setRange} onViewAll={viewPage} onTest={runTest} />}
        {page === 'Rate limits' && <PoliciesPage rules={rules} onEdit={setModalRule} onToggle={toggleRule} />}
        {page === 'Live traffic' && <ActivityPage events={events} onTest={runTest} />}
        {page === 'Redis health' && <RedisPage />}
        {page === 'Settings' && <SettingsPage />}
        {page === 'API docs' && <><Heading title="API documentation" subtitle="Integrate your services with the DRT gateway." /><div className="panel docs-panel"><div className="docs-icon"><TerminalSquare size={20} /></div><h2>Gateway API reference</h2><p>Requests to <code>/api/**</code> are proxied to your configured upstream and evaluated against enabled rate-limit policies.</p><div className="code-sample"><span>curl -i https://gateway.example.com/api/v1/resource \</span><span>  -H <b>"X-API-Key: your-api-key"</b></span></div><button className="primary-button" onClick={() => viewPage('Overview')}>Back to overview <ArrowRight size={14} /></button></div></>}
        <footer className="page-footer"><span>© 2026 DRT Gateway</span><span className="demo-disclaimer"><i /> UI preview · metrics shown are sample data</span><span>v0.1.0 <span className="footer-dot">·</span> <button onClick={() => notify('You are all caught up')}>System status</button></span></footer>
      </main>
    </div>
    {modalRule !== undefined && <PolicyModal rule={modalRule} onClose={() => setModalRule(undefined)} onSave={saveRule} />}
    <Toast message={toast} onClose={() => setToast('')} />
  </div>
}

const rootElement = document.getElementById('root')
if (rootElement) createRoot(rootElement).render(<React.StrictMode><App /></React.StrictMode>)
