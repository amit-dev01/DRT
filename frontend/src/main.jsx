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

