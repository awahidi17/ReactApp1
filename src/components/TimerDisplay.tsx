import { formatClock } from '../models/focus';

interface TimerDisplayProps {
  seconds: number;
  isRunning: boolean;
  taskName?: string;
}

export function TimerDisplay({ seconds, isRunning, taskName }: TimerDisplayProps) {
  return (
    <section className="card timerCard" aria-live="polite">
      <div className="timerHeaderRow">
        <div>
          <h2>Live Timer</h2>
          <p className="cardSubtext">The timer counts upward while your session is running.</p>
        </div>
        <span className={isRunning ? 'statusBadge statusOn' : 'statusBadge statusOff'}>
          {isRunning ? 'Running' : 'Stopped'}
        </span>
      </div>

      <div className="timerCenter">
        <div className="timerRing">
          <div className="timerInner">
            <span className="timerClock">{formatClock(seconds)}</span>
            <span className="timerSeconds">{seconds} seconds</span>
          </div>
        </div>
      </div>

      <div className="activeTaskPanel">
        <span className="activeTaskLabel">Current Task</span>
        <strong>{taskName || 'No task in progress'}</strong>
      </div>
    </section>
  );
}

export default TimerDisplay;
