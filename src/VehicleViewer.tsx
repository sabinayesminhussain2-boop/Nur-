import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useLayoutEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
const Scene = lazy(() => import("./Viewer"));
export type SceneStatus = "loading" | "ready" | "fallback";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}
class RenderBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export default function VehicleViewer({
  image,
  name,
  onStatus,
  ...settings
}: {
  id: string;
  color: string;
  wheel: string;
  interior: string;
  lighting: string;
  view: string;
  revision: number;
  image: string;
  name: string;
  onStatus: (status: SceneStatus) => void;
}) {
  const [available, setAvailable] = useState(supportsWebGL);
  const [isLoading, setIsLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [retrying, setRetrying] = useState(false);
  const failed = useCallback(() => {
    setAvailable(false);
    onStatus("fallback");
  }, [onStatus]);
  const ready = useCallback(() => {
    setIsLoading(false);
    onStatus("ready");
  }, [onStatus]);
  useLayoutEffect(() => {
    setIsLoading(true);
    onStatus(available ? "loading" : "fallback");
  }, [available, settings.id, onStatus]);
  const retry = async () => {
    setRetrying(true);
    if (!supportsWebGL()) {
      setRetrying(false);
      return;
    }
    try {
      const module = await import("./Viewer");
      module.clearVehicle(settings.id);
      setAttempt((n) => n + 1);
      setAvailable(true);
      onStatus("loading");
    } catch {
      failed();
    } finally {
      setRetrying(false);
    }
  };
  const fallback = (
    <div className="fallback" role="status">
      <img src={image} alt={`${name} studio concept render`} />
      <div>
        <strong>STUDIO VIEW</strong>
        <p>
          Interactive 3D is unavailable. This render does not change with your
          paint or wheel selections. You can still explore this vehicle and save
          your configuration.
        </p>
        <button className="text-button" onClick={retry} disabled={retrying}>
          {retrying ? "CHECKING 3D…" : "RETRY 3D VIEW"} ↗
        </button>
      </div>
    </div>
  );
  if (!available) return fallback;
  return (
    <>
      {isLoading && (
        <div className="scene-loading" role="status">
          <span>
            PREPARING YOUR MACHINE
            <span className="loading-track" />
          </span>
        </div>
      )}
      <RenderBoundary key={attempt} fallback={fallback} onFailure={failed}>
        <Suspense fallback={null}>
          <Scene {...settings} onReady={ready} onFailure={failed} />
        </Suspense>
      </RenderBoundary>
    </>
  );
}
