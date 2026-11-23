import { MathUtils, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SphereGeometry, SRGBColorSpace, TextureLoader, WebGLRenderer, type Texture } from "three";

export type Pano = {
  /** Loads an equirectangular image and faces the camera to `yaw` degrees (0 is the image centre, positive is right). */
  show(src: string, yaw: number): Promise<void>;
  /** Pause or resume rendering (offscreen, hidden tab). */
  setActive(active: boolean): void;
  nudge(degrees: number): void;
  destroy(): void;
};

/** A minimal 360° viewer: one textured sphere, drag to look, slow drift when idle. It renders only while active, at a
    capped pixel ratio, so it stays cheap on phones. Throws if WebGL is unavailable; the caller keeps its poster. */
export function createPano(canvas: HTMLCanvasElement, options: { fov: number; drift: boolean; onHeading?: (degrees: number) => void; onInteract?: () => void }): Pano {
  const renderer = new WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
  renderer.outputColorSpace = SRGBColorSpace;
  const scene = new Scene();
  const camera = new PerspectiveCamera(options.fov, 1, 1, 1000);
  const geometry = new SphereGeometry(500, 64, 40);
  geometry.scale(-1, 1, 1); // view from inside
  const material = new MeshBasicMaterial({ color: 0xffffff });
  scene.add(new Mesh(geometry, material));
  const loader = new TextureLoader();

  let yaw = 0, pitch = 0, velocity = 0, active = false, frame = 0, dragging = false, idleSince = performance.now(), lastX = 0, lastY = 0, texture: Texture | null = null, lastHeading = NaN, dead = false;
  const coarse = matchMedia("(pointer: coarse)").matches;

  const resize = () => {
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.5 : 1.75));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Hold the horizontal field of view steady on tall screens so the room never feels zoomed in.
    camera.fov = camera.aspect < 1 ? Math.min(100, options.fov / Math.max(.62, camera.aspect) * .82) : options.fov;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  const render = () => {
    // Image centre (yaw 0) sits on the sphere's -X axis after the inside-out flip.
    const phi = MathUtils.degToRad(90 - pitch), theta = MathUtils.degToRad(yaw + 180);
    camera.lookAt(500 * Math.sin(phi) * Math.cos(theta), 500 * Math.cos(phi), 500 * Math.sin(phi) * Math.sin(theta));
    renderer.render(scene, camera);
    const heading = Math.round(yaw);
    if (heading !== lastHeading) { lastHeading = heading; options.onHeading?.(yaw); }
  };
  const loop = (now: number) => {
    if (!active || dead) return;
    if (!dragging) {
      if (Math.abs(velocity) > .002) { yaw += velocity; velocity *= .94; idleSince = now; }
      else if (options.drift && now - idleSince > 2600) yaw += .012; // about 0.7° a second
    }
    render();
    frame = requestAnimationFrame(loop);
  };

  const down = (event: PointerEvent) => { dragging = true; velocity = 0; lastX = event.clientX; lastY = event.clientY; canvas.setPointerCapture(event.pointerId); canvas.dataset.dragging = "true"; options.onInteract?.(); };
  const move = (event: PointerEvent) => {
    if (!dragging) return;
    const dx = event.clientX - lastX, dy = event.clientY - lastY;
    lastX = event.clientX; lastY = event.clientY;
    const speed = camera.fov / Math.max(320, canvas.clientHeight);
    yaw -= dx * speed; velocity = -dx * speed;
    if (event.pointerType === "mouse") pitch = MathUtils.clamp(pitch + dy * speed, -32, 32);
  };
  const up = (event: PointerEvent) => { dragging = false; idleSince = performance.now(); canvas.dataset.dragging = "false"; if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId); };
  const key = (event: KeyboardEvent) => {
    const step = event.key === "ArrowLeft" ? -12 : event.key === "ArrowRight" ? 12 : 0;
    if (!step) return;
    event.preventDefault(); velocity = step / 12; idleSince = performance.now(); options.onInteract?.();
  };
  const lost = (event: Event) => { event.preventDefault(); active = false; cancelAnimationFrame(frame); };
  canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);
  canvas.addEventListener("keydown", key); canvas.addEventListener("webglcontextlost", lost);

  return {
    async show(src, toYaw) {
      const next = await loader.loadAsync(src);
      if (dead) { next.dispose(); return; }
      next.colorSpace = SRGBColorSpace;
      next.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      texture?.dispose(); texture = next;
      material.map = next; material.needsUpdate = true;
      yaw = toYaw; pitch = -4; velocity = 0; idleSince = performance.now();
      resize(); render();
    },
    setActive(next) {
      if (next === active || dead) return;
      active = next; cancelAnimationFrame(frame);
      if (active) frame = requestAnimationFrame(loop);
    },
    nudge(degrees) { velocity = degrees / 12; idleSince = performance.now(); },
    destroy() {
      dead = true; active = false; cancelAnimationFrame(frame); observer.disconnect();
      canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("keydown", key); canvas.removeEventListener("webglcontextlost", lost);
      texture?.dispose(); geometry.dispose(); material.dispose(); renderer.dispose();
    },
  };
}
