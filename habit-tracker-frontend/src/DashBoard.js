import React from 'react';
import './DashBoard.css';

const QUOTES = [
  "Small daily improvements are the key to staggering long-term results.",
  "We are what we repeatedly do. Excellence is not an act, but a habit.",
  "Motivation gets you started. Habit keeps you going.",
];

const TIPS = [
  "Habit stacking: link a new habit to one you already do automatically.",
  "Never miss twice. One skip is an accident, two is a new habit.",
  "Make it obvious, make it attractive, make it easy, make it satisfying.",
];

function Dashboard() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];

  return (
    <div className='main-view'>
      <div className='dashboard-wrapper'>
        <div className="dashboard">

          <div className="card card-quote span2">
            <span className="card-label">quote of the day</span>
            <p className="quote-text">"{quote}"</p>
          </div>

          <div className="card card-streak">
            <span className="card-label">master streak</span>
            <div className="streak-number">—</div>
            <div className="streak-sub">connect data next session</div>
          </div>

          <div className='card card-cadence'>
            <span className='cadence-title'>Cadence</span>
          </div>

          <div className="card card-tip">
            <span className="card-label">daily tip</span>
            <p className="tip-text">{tip}</p>
          </div>

          <div className="card card-today span2">
            <span className="card-label">today's habits</span>
            <p className="today-placeholder">backend endpoint coming next session</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;