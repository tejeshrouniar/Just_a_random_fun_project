import { useState } from 'react';

type NodeInfo = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
  color: string;
};

const botNodes: NodeInfo[] = [
  {
    id: 'start',
    eyebrow: 'EVENT',
    title: 'Match begins',
    description: 'Your bot wakes up and scans the arena.',
    icon: '✳',
    color: 'mint',
  },
  {
    id: 'enemy',
    eyebrow: 'SENSE',
    title: 'Enemy in range?',
    description: 'Check for opponents within 5 tiles.',
    icon: '⌁',
    color: 'blue',
  },
  {
    id: 'attack',
    eyebrow: 'ACTION',
    title: 'Attack weakest',
    description: 'Target the nearby bot with the least health.',
    icon: '↗',
    color: 'orange',
  },
  {
    id: 'roam',
    eyebrow: 'ACTION',
    title: 'Explore for parts',
    description: 'Move toward the nearest upgrade.',
    icon: '✣',
    color: 'purple',
  },
];

const initialPrompt = 'If an enemy is nearby, attack the weakest one. Otherwise, look for upgrades.';

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    grid: 'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z',
    layers: 'm12 3 9 5-9 5-9-5 9-5z M3 12l9 5 9-5 M3 16l9 5 9-5',
    trophy: 'M8 21h8 M12 17v4 M7 4h10v5a5 5 0 0 1-10 0V4z M7 6H4v2a4 4 0 0 0 4 4 M17 6h3v2a4 4 0 0 1-4 4',
    book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z M4 5.5v16 M8 7h8 M8 11h7',
    settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 3.1-.2-.1a1.7 1.7 0 0 0-1.9.2l-.2.1h-3.5l-.1-.2a1.7 1.7 0 0 0-1.6-1.1h-.3a1.7 1.7 0 0 0-1.6 1.1l-.1.2-3.2-1.8.1-.2a1.7 1.7 0 0 0-.2-1.9l-.1-.2v-3.5l.2-.1a1.7 1.7 0 0 0 1.1-1.6v-.3a1.7 1.7 0 0 0-1.1-1.6L5 9.1l1.8-3.2.2.1a1.7 1.7 0 0 0 1.9-.2l.2-.1h3.5l.1.2a1.7 1.7 0 0 0 1.6 1.1h.3a1.7 1.7 0 0 0 1.6-1.1l.1-.2 3.2 1.8-.1.2a1.7 1.7 0 0 0 .2 1.9l.1.2v3.5l-.2.1a1.7 1.7 0 0 0-1.1 1.6v.3z',
    play: 'm8 5 12 7-12 7V5z',
    plus: 'M12 5v14 M5 12h14',
    sparkle: 'm12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z',
    share: 'M12 16V4 M7 9l5-5 5 5 M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6',
    close: 'M18 6 6 18 M6 6l12 12',
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[name] ?? paths.grid} /></svg>;
}

function App() {
  const [selectedNode, setSelectedNode] = useState('enemy');
  const [prompt, setPrompt] = useState(initialPrompt);
  const [toast, setToast] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const activeNode = botNodes.find((node) => node.id === selectedNode) ?? botNodes[1];

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  }

  function runTest() {
    setIsRunning(true);
    showToast('Practice run complete · 8 turns survived');
    window.setTimeout(() => setIsRunning(false), 1500);
  }

  function saveDraft() {
    window.localStorage.setItem('bot-forge-draft', JSON.stringify({ prompt, selectedNode }));
    showToast('Draft saved on this device');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="Bot Forge home">
          <span className="brand-mark"><span /></span>
          <span className="brand-word">bot<span>forge</span><sup>✳</sup></span>
        </a>

        <div className="workspace-switcher">
          <div className="workspace-avatar">S</div>
          <div className="workspace-copy"><span>WORKSPACE</span><strong>Solo workshop</strong></div>
          <span className="chevron">⌄</span>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <p className="nav-label">WORKSHOP</p>
          <a className="nav-item active" href="#builder"><Icon name="grid" /><span>Bot builder</span><span className="nav-dot" /></a>
          <a className="nav-item" href="#blueprints"><Icon name="layers" /><span>My blueprints</span><span className="nav-count">04</span></a>
          <a className="nav-item" href="#arena"><Icon name="trophy" /><span>Arena</span></a>
          <p className="nav-label nav-label-spaced">LEARN</p>
          <a className="nav-item" href="#guides"><Icon name="book" /><span>Quick guides</span><span className="nav-arrow">↗</span></a>
        </nav>

        <div className="sidebar-bottom">
          <div className="level-card">
            <div className="level-top"><span>BUILDER LEVEL</span><span>03</span></div>
            <div className="level-title">Curious tinkerer <span>✦</span></div>
            <div className="level-track"><span /></div>
            <p>240 <i>/</i> 400 XP to next level</p>
          </div>
          <a className="nav-item settings-link" href="#settings"><Icon name="settings" /><span>Settings</span></a>
          <div className="profile-row"><div className="profile-avatar">J</div><div className="profile-copy"><strong>justy.codes</strong><span>Free account</span></div><button className="more-button" aria-label="More account options">···</button></div>
        </div>
      </aside>

      <main className="main-content" id="top">
        <header className="topbar">
          <div className="crumbs"><span>Workshop</span><span className="slash">/</span><strong>Bot builder</strong></div>
          <div className="topbar-right"><span className="saved-indicator"><span /> UI prototype</span><button className="icon-button" aria-label="Share blueprint" onClick={() => showToast('Sharing will be available soon')}><Icon name="share" /></button><button className="user-mini" aria-label="Open profile">J</button></div>
        </header>

        <section className="page-heading" id="builder">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" /> YOUR WORKSHOP <span className="eyebrow-index">01 / 03</span></div>
            <h1>Build a bot.<br /><span>Give it a little brain.</span></h1>
            <p className="heading-copy">No code required. Connect a few ideas, run a test, and see what your bot gets up to.</p>
          </div>
          <button className="button button-dark" onClick={() => showToast('Your new blueprint is ready to name')}><Icon name="plus" /> New blueprint</button>
        </section>

        <section className="builder-toolbar" aria-label="Blueprint controls">
          <div className="blueprint-title"><div className="bot-face">◉</div><div><strong>Scrap Scout <span className="edit-pencil">✎</span></strong><span><i className="status-dot" /> Draft blueprint <span className="tiny-divider">·</span> Edited just now</span></div></div>
          <div className="toolbar-actions"><button className="button button-quiet" onClick={saveDraft}>Save draft</button><button className={`button button-primary ${isRunning ? 'running' : ''}`} onClick={runTest}><Icon name="play" /> {isRunning ? 'Testing...' : 'Run a test'}</button></div>
        </section>

        <section className="builder-layout">
          <div className="canvas-panel">
            <div className="canvas-head"><div><span className="canvas-title">BOT LOGIC</span><span className="canvas-subtitle">Drag blocks in. Connect the dots.</span></div><div className="canvas-tools"><button aria-label="Zoom out">−</button><span>100%</span><button aria-label="Zoom in">+</button><span className="tool-divider" /><button aria-label="Center canvas">⌗</button></div></div>
            <div className="canvas-workspace">
              <div className="canvas-grid" />
              <svg className="connector-layer" viewBox="0 0 760 490" preserveAspectRatio="none" aria-hidden="true">
                <path className="wire wire-main" d="M190 102 C240 102 220 202 273 202" />
                <path className="wire wire-main" d="M440 202 C492 202 473 115 525 115" />
                <path className="wire wire-alt" d="M440 220 C490 220 473 335 525 335" />
                <circle className="wire-node" cx="190" cy="102" r="4" /><circle className="wire-node" cx="273" cy="202" r="4" />
              </svg>
              <div className="logic-node node-start" onClick={() => setSelectedNode('start')} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && setSelectedNode('start')}>
                <div className="node-top"><span className="node-icon mint-icon">✳</span><span className="node-type">EVENT</span><button aria-label="More event options">···</button></div><strong>Match begins</strong><small>When the round starts</small><span className="node-output" />
              </div>
              <div className={`logic-node node-check ${selectedNode === 'enemy' ? 'selected' : ''}`} onClick={() => setSelectedNode('enemy')} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && setSelectedNode('enemy')}>
                <div className="node-top"><span className="node-icon blue-icon">⌁</span><span className="node-type">CHECK</span><button aria-label="More check options">···</button></div><strong>Enemy in range?</strong><small>Within 5 tiles · Any target</small><span className="node-input" /><span className="node-output node-output-top" /><span className="node-output node-output-bottom" /><span className="branch-label yes-label">YES</span><span className="branch-label no-label">NO</span>
              </div>
              <div className="logic-node node-attack" onClick={() => setSelectedNode('attack')} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && setSelectedNode('attack')}>
                <div className="node-top"><span className="node-icon orange-icon">↗</span><span className="node-type">ACTION</span><button aria-label="More attack options">···</button></div><strong>Attack weakest</strong><small>Use basic attack</small><span className="node-input" />
              </div>
              <div className="logic-node node-roam" onClick={() => setSelectedNode('roam')} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && setSelectedNode('roam')}>
                <div className="node-top"><span className="node-icon purple-icon">✣</span><span className="node-type">ACTION</span><button aria-label="More explore options">···</button></div><strong>Explore for parts</strong><small>Move toward nearest upgrade</small><span className="node-input" />
              </div>
              <button className="canvas-add" onClick={() => showToast('Choose a block from the library to add it')}><Icon name="plus" /> Add a block</button>
              <div className="canvas-hint"><span className="hint-sparkle">✦</span><span>Tap a block to see what it does</span></div>
              <div className="canvas-minimap"><div className="mini-node mini-one" /><div className="mini-node mini-two" /><div className="mini-node mini-three" /><div className="mini-node mini-four" /><span /></div>
            </div>
            <div className="canvas-footer"><span><span className="footer-status" /> 4 blocks <span className="tiny-divider">·</span> 3 connections</span><span>Built with curiosity <span className="heart">♥</span></span></div>
          </div>

          <aside className="side-panel">
            <div className="panel-tabs"><button className="panel-tab active">Block library</button><button className="panel-tab">Details</button></div>
            <div className="panel-intro"><div><h2>Make it yours</h2><p>Start with a block, or tell the co-builder what you have in mind.</p></div><span className="sparkle-badge"><Icon name="sparkle" /></span></div>
            <div className="ai-prompt-box"><div className="ai-prompt-label"><span className="ai-live-dot" /> AI CO-BUILDER <span className="soon-label">COMING SOON</span></div><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} aria-label="Describe your bot strategy" /><div className="prompt-footer"><span>Describe a strategy in your own words</span><button disabled aria-label="Send prompt"><span>↑</span></button></div></div>
            <div className="selected-block"><div className="selected-block-heading"><div className="selected-icon"><span className={`${activeNode.color}-text`}>{activeNode.icon}</span></div><div><span className="selected-type">SELECTED {activeNode.eyebrow}</span><strong>{activeNode.title}</strong></div><button aria-label="Open block menu">···</button></div><p>{activeNode.description}</p><div className="setting-row"><span>Trigger threshold</span><strong>{activeNode.id === 'enemy' ? '5 tiles' : 'Default'} <span>⌄</span></strong></div><div className="setting-row"><span>Target priority</span><strong>{activeNode.id === 'attack' ? 'Lowest health' : 'Nearest'} <span>⌄</span></strong></div></div>
            <div className="block-library"><div className="library-head"><span>BLOCK LIBRARY</span><button>Browse all <span>↗</span></button></div><div className="library-cards"><button className="library-card"><span className="library-icon blue-icon">⌁</span><span><strong>Sense</strong><small>Notice the arena</small></span><span className="library-plus">+</span></button><button className="library-card"><span className="library-icon orange-icon">↗</span><span><strong>Act</strong><small>Make a move</small></span><span className="library-plus">+</span></button></div></div>
            <div className="tip-card"><span className="tip-icon">✦</span><p><strong>Little tip</strong> A bot that knows when to run can last longer than one that only knows how to fight.</p><button aria-label="Dismiss tip">×</button></div>
          </aside>
        </section>

        <section className="bottom-row" id="arena">
          <div className="arena-card"><div className="arena-art"><div className="arena-orbit orbit-one" /><div className="arena-orbit orbit-two" /><div className="arena-bot bot-left">◈</div><div className="arena-bot bot-right">⌘</div><span className="arena-vs">VS</span><span className="arena-star star-one">✦</span><span className="arena-star star-two">✳</span></div><div className="arena-copy"><span className="section-kicker">YOUR NEXT STEP</span><h2>Ready for a tiny test run?</h2><p>Try your bot against a practice opponent. No pressure, just science.</p></div><button className="button button-outline" onClick={runTest}>Enter practice arena <span>↗</span></button></div>
          <div className="progress-card"><div className="progress-heading"><div><span className="section-kicker">BOT BUILDER PATH</span><h2>Small steps, smart bots.</h2></div><span className="progress-emblem">✳</span></div><div className="path-steps"><div className="path-step done"><span>✓</span><div><strong>Meet your blocks</strong><small>3 min <i>·</i> Complete</small></div></div><div className="path-step current"><span>02</span><div><strong>Make a first decision</strong><small>5 min <i>·</i> Up next</small></div><b>→</b></div><div className="path-step"><span>03</span><div><strong>Test in the arena</strong><small>Coming up</small></div></div></div></div>
        </section>

        <footer className="page-footer"><span>BOT FORGE <span className="footer-asterisk">✳</span> MAKE SOMETHING CLEVER</span><span>Early build <i>·</i> Made for curious minds</span></footer>
      </main>
      {toast && <div className="toast"><span>✦</span>{toast}<button onClick={() => setToast('')} aria-label="Dismiss notification"><Icon name="close" /></button></div>}
    </div>
  );
}

export default App;
