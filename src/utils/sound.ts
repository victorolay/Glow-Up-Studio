/**
 * Sound service. Effect sources are not bundled yet — the registry maps each
 * cue to a future placeholder_ asset; until a source exists the call is a
 * silent no-op (AGENT.md §9: never autoplay loud audio; mute respected).
 */
export type SfxName = 'tap' | 'success' | 'sparkle' | 'shutter' | 'swipe';

const SFX_SOURCES: Record<SfxName, string | undefined> = {
  tap: undefined, // placeholder_audio_tap
  success: undefined, // placeholder_audio_success
  sparkle: undefined, // placeholder_audio_sparkle
  shutter: undefined, // placeholder_audio_shutter
  swipe: undefined, // placeholder_audio_swipe
};

const volume: Record<SfxName, number> = {
  tap: 0.4,
  success: 0.6,
  sparkle: 0.5,
  shutter: 0.6,
  swipe: 0.35,
};

export async function playSfx(name: SfxName, muted: boolean): Promise<void> {
  const src = SFX_SOURCES[name];
  if (!src || muted) return;
  try {
    const { Howl } = await import('howler');
    new Howl({ src: [src], volume: volume[name] }).play();
  } catch {
    // Audio unavailable (or blocked) — visuals still carry the feedback.
  }
}
