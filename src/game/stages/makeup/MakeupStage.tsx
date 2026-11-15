import { CharacterCanvas } from '@/components/character/CharacterCanvas';
import { StageFrame } from '@/components/layout/StageFrame';
import { Button } from '@/components/ui/Button';
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
      subtitle="Makeup"
      challenge={challenge}
      onBack={back}
      onNext={next}
      nextLabel="Hair ›"
      dots={{ current: FLOW.indexOf('makeup'), total: FLOW.length }}
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="mx-auto w-full max-w-[280px] shrink-0">
          <CharacterCanvas ariaLabel="Your character with makeup applied" />
          <p className="mt-2 text-center text-xs text-ink-soft" aria-live="polite">
            {usedSlots}/{ALL_MAKEUP_SLOTS.length} products applied
          </p>
        </div>
        <div className="flex-1">
          <TabBar tabs={TABS} active={tab} onChange={setTab} ariaLabel="Makeup categories" />
          <div className="mt-3 rounded-3xl border border-line bg-surface p-4 shadow-soft" data-testid={`makeup-panel-${tab}`}>
            {tab === 'base' && <BasePanel />}
            {tab === 'complexion' && (
              <>
                <MakeupSlotRow slot="foundation" onApply={applySelection} />
                <MakeupSlotRow slot="concealer" onApply={applySelection} />
              </>
            )}
            {tab === 'eyes' && (
              <>
                <EyeshadowRow onApply={applySelection} />
                <MakeupSlotRow slot="eyeliner" onApply={applySelection} />
                <MakeupSlotRow slot="mascara" onApply={applySelection} />
              </>
            )}
            {tab === 'lips' && <LipsPanel onApply={applySelection} />}
            {tab === 'presets' && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {MAKEUP_PRESETS.map((preset) => (
                  <Button
                    key={preset.id}
                    variant="soft"
                    className="h-auto flex-col items-start py-3"
                    onClick={() => {
                      for (const [slot, sel] of Object.entries(preset.apply)) {
                        if (sel) setMakeup(slot as MakeupSlot, { itemId: sel.itemId, intensity: sel.intensity ?? 1, finish: sel.finish });
                      }
                      void playSfx('sparkle', muted);
                    }}
                    aria-label={`Apply ${preset.name} preset look`}
                  >
                    <span className="font-semibold text-ink">{preset.name}</span>
                    <span className="text-xs font-normal text-ink-soft">{preset.description}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
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

  return (
    <div className="space-y-4">
      <section aria-label="Skin tone">
        <h3 className="mb-2 text-sm font-semibold text-ink">Skin tone</h3>
        <div className="flex flex-wrap gap-2">
          {SKIN_TONES.map((t) => (
            <SwatchButton key={t.id} color={t.base} label={t.name} selected={skinToneId === t.id} onClick={() => setSkinTone(t.id)} size="lg" />
          ))}
        </div>
      </section>
      <section aria-label="Eye color">
        <h3 className="mb-2 text-sm font-semibold text-ink">Eyes</h3>
        <div className="flex flex-wrap gap-2">
          {EYE_COLORS.map((e) => (
            <SwatchButton key={e.id} color={e.hex} label={`${e.name} eyes`} selected={eyeColorId === e.id} onClick={() => setEyeColor(e.id)} />
          ))}
        </div>
      </section>
      <section aria-label="Face details">
        <h3 className="mb-2 text-sm font-semibold text-ink">Details</h3>
        <div className="flex gap-2">
          <Button variant={freckles ? 'primary' : 'soft'} onClick={toggleFreckles} aria-pressed={freckles}>
            Freckles {freckles ? '✓' : ''}
          </Button>
          <Button variant={beautyMark ? 'primary' : 'soft'} onClick={toggleBeautyMark} aria-pressed={beautyMark}>
            Beauty mark {beautyMark ? '✓' : ''}
          </Button>
        </div>
      </section>
    </div>
  );
}

function MakeupSlotRow({ slot, onApply }: { slot: MakeupSlot; onApply: (slot: MakeupSlot, sel: MakeupSelection | null) => void }) {
  const selection = useCharacterStore((s) => s.makeup[slot]);
  const item = MAKEUP_ITEMS.find((i) => i.slot === slot);
  if (!item) return null;
  const applied = selection !== undefined;
  const intensity = selection?.intensity ?? 1;

  return (
    <div className="mb-4 rounded-2xl border border-line p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-ink">{item.name}</span>
        <Button
          variant={applied ? 'soft' : 'primary'}
          onClick={() => onApply(slot, applied ? null : { itemId: item.id, intensity: 1, variantId: item.variants?.[0]?.id })}
          aria-pressed={applied}
          aria-label={`${applied ? 'Remove' : 'Apply'} ${item.name}`}
        >
          {applied ? 'Remove' : 'Apply'}
        </Button>
      </div>
      {applied && (
        <label className="mt-2 block text-xs text-ink-soft">
          Intensity
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={intensity}
            onChange={(e) => onApply(slot, { ...selection, intensity: Number(e.target.value) })}
            className="mt-1 w-full accent-[var(--c-accent)]"
            aria-label={`${item.name} intensity`}
          />
        </label>
      )}
    </div>
  );
}

function EyeshadowRow({ onApply }: { onApply: (slot: MakeupSlot, sel: MakeupSelection | null) => void }) {
  const selection = useCharacterStore((s) => s.makeup.eyeshadow);
  const items = MAKEUP_ITEMS.filter((i) => i.slot === 'eyeshadow');

  return (
    <div className="mb-4 rounded-2xl border border-line p-3">
      <div className="flex items-center gap-2">
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
                onApply('eyeshadow', selected
                  ? null
                  : { itemId: item.id, variantId: variant?.id, intensity: selection?.intensity ?? 0.6 })
              }
            />
          );
        })}
      </div>
      {selection && (
        <label className="mt-2 block text-xs text-ink-soft">
          Intensity
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={selection.intensity}
            onChange={(e) => onApply('eyeshadow', { ...selection, intensity: Number(e.target.value) })}
            className="mt-1 w-full accent-[var(--c-accent)]"
            aria-label="Eyeshadow intensity"
          />
        </label>
      )}
    </div>
  );
}

function LipsPanel({ onApply }: { onApply: (slot: MakeupSlot, sel: MakeupSelection | null) => void }) {
  const selection = useCharacterStore((s) => s.makeup.lipstick);
  const lipsticks = MAKEUP_ITEMS.filter((i) => i.slot === 'lipstick');

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {lipsticks.map((item) => {
          const variant = item.variants?.[0];
          return (
            <SwatchButton
              key={item.id}
              color={variant?.colors.primary ?? '#ccc'}
              label={item.name}
              selected={selection?.itemId === item.id}
              onClick={() =>
                onApply('lipstick', selection?.itemId === item.id
                  ? null
                  : { itemId: item.id, variantId: variant?.id, intensity: 1, finish: selection?.finish ?? 'satin' })
              }
              size="lg"
            />
          );
        })}
      </div>
      {selection && (
        <div role="group" aria-label="Lip finish">
          <h3 className="mb-2 text-sm font-semibold text-ink">Finish</h3>
          <div className="flex flex-wrap gap-2">
            {FINISHES.map((f) => (
              <Button
                key={f}
                variant={selection.finish === f ? 'primary' : 'soft'}
                className="min-h-[36px] capitalize"
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
