import { useState, useCallback } from 'react';
import styles from './AIBar.module.css';

interface Props {
  onGenerate: (idea: string, key: string) => void;
  onReset: () => void;
  isLoading: boolean;
  isCustomActive: boolean;
  error: string | null;
  progressChars: number;
}

export default function AIBar({ onGenerate, onReset, isLoading, isCustomActive, error, progressChars }: Props) {
  const [idea, setIdea] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('anthropic_key') ?? '');
  const [showKey, setShowKey] = useState(() => !localStorage.getItem('anthropic_key'));

  const handleKeyChange = useCallback((val: string) => {
    setApiKey(val);
    localStorage.setItem('anthropic_key', val);
  }, []);

  const handleGenerate = useCallback(() => {
    if (!idea.trim() || !apiKey.trim() || isLoading) return;
    onGenerate(idea.trim(), apiKey.trim());
  }, [idea, apiKey, isLoading, onGenerate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate();
    },
    [handleGenerate],
  );

  const canGenerate = idea.trim().length > 0 && apiKey.trim().length > 0 && !isLoading;
  const keyIsSet = apiKey.trim().length > 0;

  return (
    <div className={styles.bar}>
      <div className={styles.row}>
        <span className={styles.label}>AI GENERATE</span>
        <input
          className={styles.ideaInput}
          type="text"
          placeholder="Describe your project… e.g. a ride-sharing app for college campuses"
          value={idea}
          onChange={e => setIdea(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button
          className={`${styles.keyToggle} ${keyIsSet ? styles.keySet : styles.keyMissing}`}
          onClick={() => setShowKey(v => !v)}
          title="Configure Anthropic API key"
        >
          {keyIsSet ? '✓ Key' : '🔑 Key'}
        </button>
        <button
          className={`${styles.generateBtn} ${isLoading ? styles.loading : ''}`}
          onClick={handleGenerate}
          disabled={!canGenerate}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner} />
              {progressChars > 0 ? `Receiving… ${(progressChars / 1000).toFixed(1)}k` : 'Generating…'}
            </>
          ) : (
            '▶ Generate'
          )}
        </button>
        {isCustomActive && (
          <button className={styles.resetBtn} onClick={onReset} title="Reset to default content">
            ✕ Reset
          </button>
        )}
      </div>

      {showKey && (
        <div className={styles.keyRow}>
          <span className={styles.keyLabel}>Anthropic API Key</span>
          <input
            className={styles.keyInput}
            type="password"
            placeholder="sk-ant-..."
            value={apiKey}
            onChange={e => handleKeyChange(e.target.value)}
            autoComplete="off"
          />
          <button
            className={styles.keyDone}
            onClick={() => setShowKey(false)}
            disabled={!keyIsSet}
          >
            Save
          </button>
          <span className={styles.keyHint}>Stored in browser localStorage only · never sent anywhere else</span>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}
      {isCustomActive && !error && (
        <div className={styles.activeLabel}>Custom SDLC active — content tailored to your project</div>
      )}
    </div>
  );
}
