import type { FormEvent } from 'react';

interface FocusControlsProps {
  taskInput: string;
  isRunning: boolean;
  onTaskChange: (value: string) => void;
  onStart: () => void;
  onStop: () => void;
}

export function FocusControls({
  taskInput,
  isRunning,
  onTaskChange,
  onStart,
  onStop,
}: FocusControlsProps) {
  const canStart = taskInput.trim() !== '' && !isRunning;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canStart) {
      onStart();
    }
  }

  return (
    <section className="card controlsCard">
      <div className="cardHeader">
        <h2>Start a New Session</h2>
        <p>Enter a task name and begin tracking your focus time.</p>
      </div>

      <form className="controlsForm" onSubmit={handleSubmit}>
        <label className="label" htmlFor="taskName">
          Task Name
        </label>
        <input
          id="taskName"
          className="input"
          type="text"
          value={taskInput}
          onChange={(event) => onTaskChange(event.target.value)}
          placeholder="Example: Study Chapter 3"
          disabled={isRunning}
        />

        <div className="buttonRow">
          <button className="btn primaryBtn" type="submit" disabled={!canStart}>
            Start
          </button>
          <button className="btn secondaryBtn" type="button" onClick={onStop} disabled={!isRunning}>
            Stop
          </button>
        </div>
      </form>
    </section>
  );
}

export default FocusControls;
