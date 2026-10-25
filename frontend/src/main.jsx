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

