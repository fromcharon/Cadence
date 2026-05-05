import React from 'react';
import './DashBoard.css';
import { useState, useEffect } from 'react';

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
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/habits/today`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setHabits(data))
      .catch(err => console.error(err));
  }, []);

  // master streak = highest streak number across all habits
  const masterStreak = habits.length > 0 
    ? Math.max(...habits.map(h => h.streak)) 
    : 0;

  const pendingHabits = habits.filter(h => !h.completed_today);
  const doneHabits = habits.filter(h => h.completed_today);
  
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
            <div className="streak-number">{masterStreak}</div>
            <div className="streak-sub">
              {habits.length > 0 
                ? `${doneHabits.length} of ${habits.length} done today`
                : 'no habits yet'}
            </div>
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
            {habits.length === 0 
              ? <p className="today-placeholder">no habits added yet</p>
              : [...doneHabits, ...pendingHabits].map(habit => (
                  <div key={habit.id} className="today-habit-row">
                    <span className="today-habit-name">{habit.name}</span>
                    <span className={`today-badge ${habit.completed_today ? 'badge-done' : 'badge-pending'}`}>
                      {habit.completed_today ? 'done' : 'pending'}
                    </span>
                  </div>
                ))
            }
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;