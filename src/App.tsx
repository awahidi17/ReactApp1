import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { FocusControls } from './components/FocusControls';
import { SessionList } from './components/SessionList';
import { TimerDisplay } from './components/TimerDisplay';
import type { FocusSession } from './models/focus';
import { formatClock, formatDuration } from './models/focus';

export default function App() {
  // Stores the task currently typed into the input.
  const [taskInput, setTaskInput] = useState<string>('');

  // Controls whether the timer is actively running.
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Tracks elapsed time for the active session.
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Locks in the task name when a session begins.
  const [activeTaskName, setActiveTaskName] = useState<string>('');

  // Keeps all completed sessions for list rendering.
  const [sessions, setSessions] = useState<FocusSession[]>([]);

  // Holds the timestamp for the current session start.
  const startTimeRef = useRef<number | null>(null);

  // Quick summary values derived from completed sessions.
  const totalFocusedSeconds = useMemo(
    () => sessions.reduce((sum, session) => sum + session.durationSeconds, 0),
    [sessions]
  );

  const longestSession = useMemo(
    () => sessions.reduce((max, session) => Math.max(max, session.durationSeconds), 0),
    [sessions]
  );

  function startSession() {
    const trimmedTask = taskInput.trim();
    if (!trimmedTask || isRunning) return;

    setIsRunning(true);
    setElapsedSeconds(0);
    setActiveTaskName(trimmedTask);
    startTimeRef.current = Date.now();
  }

  function stopSession() {
    if (!isRunning) return;

    const endAt = Date.now();
    const startAt = startTimeRef.current ?? endAt;
    const finalDuration = Math.max(0, Math.floor((endAt - startAt) / 1000));

    const completedSession: FocusSession = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : String(endAt),
      taskName: activeTaskName || taskInput.trim() || 'Untitled Task',
      durationSeconds: finalDuration,
      startAt,
      endAt,
    };

    setSessions((previousSessions) => [completedSession, ...previousSessions]);
    setIsRunning(false);
    setElapsedSeconds(0);
    setTaskInput('');
    setActiveTaskName('');
    startTimeRef.current = null;
  }

  // Updates the timer while a session is running.
  useEffect(() => {
    if (!isRunning) return;

    const updateElapsedTime = () => {
      if (!startTimeRef.current) return;
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    };

    updateElapsedTime();
    const intervalId = window.setInterval(updateElapsedTime, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning]);

  return (
    <div className="appShell">
      <div className="ambientGlow ambientGlowOne" aria-hidden="true" />
      <div className="ambientGlow ambientGlowTwo" aria-hidden="true" />

      <div className="appFrame">
        <header className="heroCard">
          <div>
            <p className="eyebrow">React + TypeScript Focus Tracker</p>
            <h1 className="heroTitle">Focus Tracker</h1>
            <p className="heroText">
              Start a session, watch the timer run live, and keep a clean log of completed work.
            </p>
          </div>

          <div className="heroStats">
            <article className="miniStat">
              <span className="miniStatLabel">Completed Sessions</span>
              <strong>{sessions.length}</strong>
            </article>
            <article className="miniStat">
              <span className="miniStatLabel">Total Focus Time</span>
              <strong>{formatDuration(totalFocusedSeconds)}</strong>
            </article>
            <article className="miniStat">
              <span className="miniStatLabel">Longest Session</span>
              <strong>{formatDuration(longestSession)}</strong>
            </article>
          </div>
        </header>

        <main className="contentGrid">
          <section className="leftColumn">
            <FocusControls
              taskInput={taskInput}
              isRunning={isRunning}
              onTaskChange={setTaskInput}
              onStart={startSession}
              onStop={stopSession}
            />

            <TimerDisplay
              seconds={elapsedSeconds}
              isRunning={isRunning}
              taskName={activeTaskName}
            />

            <section className="summaryCard">
              <div className="summaryHeader">
                <h2>Daily Snapshot</h2>
                <span className={isRunning ? 'pill pillLive' : 'pill'}>
                  {isRunning ? 'Session Active' : 'Ready'}
                </span>
              </div>

              <div className="summaryGrid">
                <article className="summaryBlock">
                  <span>Active Task</span>
                  <strong>{activeTaskName || 'No task running'}</strong>
                </article>
                <article className="summaryBlock">
                  <span>Current Timer</span>
                  <strong>{formatClock(elapsedSeconds)}</strong>
                </article>
                <article className="summaryBlock">
                  <span>Total Completed Time</span>
                  <strong>{formatDuration(totalFocusedSeconds)}</strong>
                </article>
                <article className="summaryBlock">
                  <span>Latest Duration</span>
                  <strong>
                    {sessions.length > 0 ? formatDuration(sessions[0].durationSeconds) : '00:00'}
                  </strong>
                </article>
              </div>
            </section>
          </section>

          <aside className="rightColumn">
            <section className="insightCard">
              <h2>Focus Tips</h2>
              <ul className="tipList">
                <li>Use short task names so each session log stays easy to scan.</li>
                <li>Stop the timer as soon as you finish to keep durations accurate.</li>
                <li>Review your session history to see where your time is going.</li>
              </ul>
            </section>

            <SessionList sessions={sessions} />
          </aside>
        </main>

        <footer className="footer">
          <small>Built with Vite, React, and TypeScript by Ahmad Wahidi.</small>
        </footer>
      </div>
    </div>
  );
}
