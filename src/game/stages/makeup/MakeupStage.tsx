import { CharacterCanvas } from '@/components/character/CharacterCanvas';
import { StageFrame } from '@/components/layout/StageFrame';
import { Button } from '@/components/ui/Button';
import { CheckIcon } from '@/components/ui/Icons';
import { SwatchButton } from '@/components/ui/SwatchButton';
import { TabBar, type TabDef } from '@/components/ui/TabBar';
import { ALL_MAKEUP_SLOTS } from '@/data/config/scoring';
import { EYE_COLORS, SKIN_TONES } from '@/data/items/customization';
import { MAKEUP_ITEMS, MAKEUP_PRESETS } from '@/data/items/makeup';
import { FLOW, useGameStore } from '@/game/store/gameStore';
import { useCharacterStore, type MakeupSelection } from '@/game/store/characterStore';
import { useProgressStore } from '@/game/store/progressStore';
import { playSfx } from '@/utils/sound';
import type { Challenge, LipFinish, MakeupSlot } from '@/game/types';
import { useState } from 'react';

const TABS: TabDef[] = [
  { id: 'base', label: 'Base' },
  { id: 'complexion', label: 'Complexion' },
  { id: 'eyes', label: 'Eyes' },
  { id: 'lips', label: 'Lips' },
  { id: 'presets', label: 'Presets' },
];

const FINISHES: LipFinish[] = ['matte', 'satin', 'gloss', 'stain'];

export function MakeupStage({ challenge }: { challenge: Challenge }) {
  const next = useGameStore((s) => s.next);
  const back = useGameStore((s) => s.back);
  const makeup = useCharacterStore((s) => s.makeup);
  const muted = useProgressStore((s) => s.muted);
  const [tab, setTab] = useState('base');

  const setMakeup = useCharacterStore((s) => s.setMakeup);
  const applySelection = (slot: MakeupSlot, selection: MakeupSelection | null) => {
    void playSfx('tap', muted);
    setMakeup(slot, selection);
  };

  const usedSlots = ALL_MAKEUP_SLOTS.filter((s) => makeup[s]).length;

  return (
    <StageFrame
      title={challenge.title}
      subtitle="Makeup & Complexion"
      challenge={challenge}
      onBack={back}
      onNext={next}
      nextLabel="Hair"
      dots={{ current: FLOW.indexOf('makeup'), total: FLOW.length }}
      defaultZoom="face"
      renderMirror={(zoomMode) => (
        <CharacterCanvas zoomMode={zoomMode} ariaLabel="Your character with makeup applied" />
      )}
      mirrorFooter={
        <p className="text-center text-xs font-medium tabular-nums text-ink-soft" aria-live="polite">
          {usedSlots} of {ALL_MAKEUP_SLOTS.length} makeup products applied
        </p>
      }
    >
      <div className="space-y-4">
        <TabBar tabs={TABS} active={tab} onChange={setTab} ariaLabel="Makeup categories" />
        <div
          className="rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5"
          data-testid={`makeup-panel-${tab}`}
        >
          {tab === 'base' && <BasePanel />}
          {tab === 'complexion' && (
            <div className="space-y-3">
              <MakeupSlotRow slot="foundation" onApply={applySelection} />
              <MakeupSlotRow slot="concealer" onApply={applySelection} />
            </div>
          )}
          {tab === 'eyes' && (
            <div className="space-y-3">
              <EyeshadowRow onApply={applySelection} />
              <MakeupSlotRow slot="eyeliner" onApply={applySelection} />
              <MakeupSlotRow slot="mascara" onApply={applySelection} />
            </div>
          )}
          {tab === 'lips' && <LipsPanel onApply={applySelection} />}
          {tab === 'presets' && (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {MAKEUP_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    for (const [slot, sel] of Object.entries(preset.apply)) {
                      if (sel) {
                        setMakeup(slot as MakeupSlot, {
                          itemId: sel.itemId,
                          intensity: sel.intensity ?? 1,
                          finish: sel.finish,
                        });
                      }
                    }
                    void playSfx('sparkle', muted);
                  }}
                  aria-label={`Apply ${preset.name} preset look`}
                  className="flex flex-col items-start rounded-xl border border-line bg-surface p-3.5 text-left transition hover:border-accent/50 hover:bg-surface-2/40 focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <span className="text-sm font-semibold text-ink">{preset.name}</span>
                  <span className="mt-1 text-xs text-ink-soft">{preset.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </StageFrame>
  );
}

/* ---------- Panels ---------- */

function BasePanel() {
  const skinToneId = useCharacterStore((s) => s.skinToneId);
  const setSkinTone = useCharacterStore((s) => s.setSkinTone);
  const eyeColorId = useCharacterStore((s) => s.eyeColorId);
  const setEyeColor = useCharacterStore((s) => s.setEyeColor);
  const freckles = useCharacterStore((s) => s.freckles);
  const toggleFreckles = useCharacterStore((s) => s.toggleFreckles);
  const beautyMark = useCharacterStore((s) => s.beautyMark);
  const toggleBeautyMark = useCharacterStore((s) => s.toggleBeautyMark);
  const resetMuse = useCharacterStore((s) => s.resetMuse);

  const activeToneName = SKIN_TONES.find((t) => t.id === skinToneId)?.name ?? 'Honey';
  const activeEyeName = EYE_COLORS.find((e) => e.id === eyeColorId)?.name ?? 'Brown';

  return (
    <div className="space-y-5">
      <section aria-label="Skin tone">
        <div className="mb-2.5 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-ink">Skin Tone</h3>
          <span className="text-xs font-medium text-ink-soft">{activeToneName}</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {SKIN_TONES.map((t) => (
            <SwatchButton
              key={t.id}
              color={t.base}
              label={t.name}
              selected={skinToneId === t.id}
              onClick={() => setSkinTone(t.id)}
              size="lg"
            />
          ))}
        </div>
      </section>

      <section aria-label="Eye color">
        <div className="mb-2.5 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-ink">Eye Color</h3>
          <span className="text-xs font-medium text-ink-soft">{activeEyeName}</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {EYE_COLORS.map((e) => (
            <SwatchButton
              key={e.id}
              color={e.hex}
              label={`${e.name} eyes`}
              selected={eyeColorId === e.id}
              onClick={() => setEyeColor(e.id)}
            />
          ))}
        </div>
      </section>

      <section aria-label="Face details">
        <div className="mb-2.5 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-ink">Natural Details</h3>
          <span className="text-[11px] font-medium text-ink-soft">Saved to your Muse</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={freckles ? 'primary' : 'soft'}
              onClick={toggleFreckles}
              aria-pressed={freckles}
            >
              {freckles && <CheckIcon className="h-4 w-4" />}
              <span>Freckles</span>
            </Button>
            <Button
              variant={beautyMark ? 'primary' : 'soft'}
              onClick={toggleBeautyMark}
              aria-pressed={beautyMark}
            >
              {beautyMark && <CheckIcon className="h-4 w-4" />}
              <span>Beauty Mark</span>
            </Button>
          </div>
          <Button variant="ghost" onClick={resetMuse}>
            Reset Muse
          </Button>
        </div>
      </section>
    </div>
  );
}

function MakeupSlotRow({
  slot,
  onApply,
}: {
  slot: MakeupSlot;
  onApply: (slot: MakeupSlot, sel: MakeupSelection | null) => void;
}) {
  const selection = useCharacterStore((s) => s.makeup[slot]);
  const item = MAKEUP_ITEMS.find((i) => i.slot === slot);
  if (!item) return null;
  const applied = selection !== undefined;
  const intensity = selection?.intensity ?? 1;

  return (
    <div className="rounded-xl border border-line bg-surface-2/30 p-3.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-ink">{item.name}</span>
        <Button
          variant={applied ? 'soft' : 'primary'}
          onClick={() =>
            onApply(
              slot,
              applied ? null : { itemId: item.id, intensity: 1, variantId: item.variants?.[0]?.id },
            )
          }
          aria-pressed={applied}
          aria-label={`${applied ? 'Remove' : 'Apply'} ${item.name}`}
        >
          {applied ? 'Remove' : 'Apply'}
        </Button>
      </div>
      {applied && (
        <label className="mt-3 block text-xs text-ink-soft">
          <div className="flex items-center justify-between">
            <span>Intensity</span>
            <span className="font-semibold tabular-nums text-ink">
              {Math.round(intensity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={intensity}
            onChange={(e) => onApply(slot, { ...selection, intensity: Number(e.target.value) })}
            className="mt-1.5 h-7 w-full cursor-pointer accent-[var(--c-accent)]"
            aria-label={`${item.name} intensity`}
          />
        </label>
      )}
    </div>
  );
}

function EyeshadowRow({
  onApply,
}: {
  onApply: (slot: MakeupSlot, sel: MakeupSelection | null) => void;
}) {
  const selection = useCharacterStore((s) => s.makeup.eyeshadow);
  const items = MAKEUP_ITEMS.filter((i) => i.slot === 'eyeshadow');
  const activeItem = items.find((i) => i.id === selection?.itemId);

  return (
    <div className="rounded-xl border border-line bg-surface-2/30 p-3.5">
      <div className="mb-2.5 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-ink">Eyeshadow</span>
        <span className="text-xs font-medium text-ink-soft">
          {activeItem ? activeItem.name : 'Bare lid'}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        {items.map((item) => {
          const variant = item.variants?.[0];
          const selected = selection?.itemId === item.id;
          return (
            <SwatchButton
              key={item.id}
              color={variant?.colors.primary ?? '#ccc'}
              label={item.name}
              selected={selected}
              onClick={() =>
                onApply(
                  'eyeshadow',
                  selected
                    ? null
                    : {
                        itemId: item.id,
                        variantId: variant?.id,
                        intensity: selection?.intensity ?? 0.6,
                      },
                )
              }
            />
          );
        })}
      </div>
      {selection && (
        <label className="mt-3 block text-xs text-ink-soft">
          <div className="flex items-center justify-between">
            <span>Pigment intensity</span>
            <span className="font-semibold tabular-nums text-ink">
              {Math.round(selection.intensity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={selection.intensity}
            onChange={(e) =>
              onApply('eyeshadow', { ...selection, intensity: Number(e.target.value) })
            }
            className="mt-1.5 h-7 w-full cursor-pointer accent-[var(--c-accent)]"
            aria-label="Eyeshadow intensity"
          />
        </label>
      )}
    </div>
  );
}

function LipsPanel({
  onApply,
}: {
  onApply: (slot: MakeupSlot, sel: MakeupSelection | null) => void;
}) {
  const selection = useCharacterStore((s) => s.makeup.lipstick);
  const lipsticks = MAKEUP_ITEMS.filter((i) => i.slot === 'lipstick');
  const activeLip = lipsticks.find((i) => i.id === selection?.itemId);

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2.5 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-ink">Lip Color</h3>
          <span className="text-xs font-medium text-ink-soft">
            {activeLip ? activeLip.name : 'Bare lip'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {lipsticks.map((item) => {
            const variant = item.variants?.[0];
            return (
              <SwatchButton
                key={item.id}
                color={variant?.colors.primary ?? '#ccc'}
                label={item.name}
                selected={selection?.itemId === item.id}
                onClick={() =>
                  onApply(
                    'lipstick',
                    selection?.itemId === item.id
                      ? null
                      : {
                          itemId: item.id,
                          variantId: variant?.id,
                          intensity: 1,
                          finish: selection?.finish ?? 'satin',
                        },
                  )
                }
                size="lg"
              />
            );
          })}
        </div>
      </div>

      {selection && (
        <div role="group" aria-label="Lip finish">
          <h3 className="mb-2 text-sm font-semibold text-ink">Finish</h3>
          <div className="flex flex-wrap gap-2">
            {FINISHES.map((f) => (
              <Button
                key={f}
                variant={selection.finish === f ? 'primary' : 'soft'}
                className="capitalize"
                onClick={() => onApply('lipstick', { ...selection, finish: f })}
                aria-pressed={selection.finish === f}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
