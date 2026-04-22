import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/** Top-level boundary so a Mapbox / asset failure doesn't blank the
 *  whole page — the argument still reads even if the map crashes. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    // Surface in the console for debugging; no external reporting.
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-fallback" role="alert">
          <div className="error-fallback-inner">
            <p className="error-fallback-eyebrow">Something broke on the map.</p>
            <h1>But the argument is the same.</h1>
            <p className="error-fallback-body">
              <strong>368,000</strong> American children are in foster care
              tonight. <strong>70,418</strong> are legally free and waiting
              for a forever family. There are roughly <strong>380,000
              Christian congregations</strong>. One family per church ends
              the waitlist five times over.
              <br /><br />
              <em>American Christianity is in debt. They are in debt to
              all of the children. Crystal clear.</em>
            </p>
            <p className="error-fallback-retry">
              <button type="button" onClick={() => location.reload()}>
                Reload and try again
              </button>
              {' '}
              <span>—</span>
              {' '}
              <code>{String(this.state.error.message || this.state.error)}</code>
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
