import type { FocusSession } from '../models/focus';
import { formatClock, formatDuration } from '../models/focus';

interface SessionListProps {
  sessions: FocusSession[];
}

export function SessionList({ sessions }: SessionListProps) {
  return (
    <section className="card sessionsCard">
      <div className="cardHeader">
        <h2>Completed Sessions</h2>
        <p>Each finished session is logged with the task name and duration.</p>
      </div>

      {sessions.length === 0 ? (
        <div className="emptyState">
          <strong>No sessions completed yet.</strong>
          <p>Start your first focus session to build your history.</p>
        </div>
      ) : (
        <ul className="sessionList">
          {sessions.map((session) => (
            <li key={session.id} className="sessionItem">
              <div className="sessionTopRow">
                <strong className="sessionTask">{session.taskName}</strong>
                <span className="sessionDuration">{formatClock(session.durationSeconds)}</span>
              </div>
              <div className="sessionMeta">
                <span>{session.durationSeconds} seconds</span>
                <span>•</span>
                <span>{formatDuration(session.durationSeconds)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default SessionList;
