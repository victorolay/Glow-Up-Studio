import { getAsset } from '@/assets';
import { CharacterCanvas } from '@/components/character/CharacterCanvas';
import { StageFrame } from '@/components/layout/StageFrame';
import { Button } from '@/components/ui/Button';
import { SparkleIcon } from '@/components/ui/Icons';
import { PreviewThumb } from '@/components/ui/PreviewThumb';
import { SwatchButton } from '@/components/ui/SwatchButton';
import { HAIR_COLORS } from '@/data/items/customization';
import { HAIR_ITEMS } from '@/data/items/hair';
import { useCharacterStore } from '@/game/store/characterStore';
import { FLOW, useGameStore } from '@/game/store/gameStore';
import { useProgressStore } from '@/game/store/progressStore';
import { playSfx } from '@/utils/sound';
import type { Challenge, HairItem, Parting } from '@/game/types';
import { useState } from 'react';

const PARTINGS: Parting[] = ['left', 'center', 'right'];

type HairFilter = 'all' | 'wigs' | 'braids' | 'curly' | 'short' | 'updo';

const HAIR_FILTERS: Array<{ id: HairFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'wigs', label: 'Wigs & Long' },
  { id: 'braids', label: 'Braids & Locs' },
  { id: 'curly', label: 'Curly & Afro' },
  { id: 'short', label: 'Bobs & Short' },
  { id: 'updo', label: 'Updos & Ponies' },
];

function matchesHairFilter(item: HairItem, filter: HairFilter): boolean {
  if (filter === 'all') return true;
  const id = item.id;
  if (filter === 'braids') {
    return (
      id.includes('braid') ||
      id.includes('loc') ||
      id.includes('twist') ||
      id.includes('shuku')
    );
  }
  if (filter === 'curly') {
    return (
      id.includes('curly') ||
      id.includes('afro') ||
      id.includes('pineapple') ||
      id.includes('wash-go') ||
      id.includes('tapered')
    );
  }
  if (filter === 'short') {
    return (
      id.includes('bob') ||
      id.includes('lob') ||
      id.includes('crop') ||
      id.includes('finger') ||
      id.includes('tapered')
    );
  }
  if (filter === 'updo') {
    return (
      id.includes('bun') ||
      id.includes('updo') ||
      id.includes('pony') ||
      id.includes('topknot') ||
      id.includes('chignon') ||
      id.includes('pineapple') ||
      id.includes('shuku')
    );
  }
  return (
    id.includes('silk-press') ||
    id.includes('hollywood') ||
    id.includes('lacefront') ||
    id.includes('butterfly') ||
    id.includes('long-waves') ||
    id.includes('half-up') ||
    id.includes('wet-look')
  );
}

export function HairStage({ challenge }: { challenge: Challenge }) {
  const next = useGameStore((s) => s.next);
  const back = useGameStore((s) => s.back);
  const hair = useCharacterStore((s) => s.hair);
  const setHairStyle = useCharacterStore((s) => s.setHairStyle);
  const setHairColor = useCharacterStore((s) => s.setHairColor);
  const setParting = useCharacterStore((s) => s.setParting);
  const setShine = useCharacterStore((s) => s.setShine);
  const muted = useProgressStore((s) => s.muted);
  const [filter, setFilter] = useState<HairFilter>('all');

  const activeColorDef = HAIR_COLORS.find((c) => c.id === hair.variantId);
  const currentColor = hair.colorCustom ?? activeColorDef?.base ?? '#6b4230';
  const activeColorName = hair.colorCustom ? 'Custom Shade' : (activeColorDef?.name ?? 'Chestnut');
  const filteredStyles = HAIR_ITEMS.filter((item) => matchesHairFilter(item, filter));

  return (
    <StageFrame
      title={challenge.title}
      subtitle="Hair Studio"
      challenge={challenge}
      onBack={back}
      onNext={next}
      nextLabel="Outfit"
      dots={{ current: FLOW.indexOf('hair'), total: FLOW.length }}
      defaultZoom="full"
      renderMirror={(zoomMode) => (
        <CharacterCanvas zoomMode={zoomMode} ariaLabel="Your character with selected hairstyle" />
      )}
    >
      <div className="space-y-6">
        <section aria-label="Hair styles" data-testid="hair-styles">
          <div className="mb-2.5 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-ink">Wigs &amp; Hairstyles</h2>
            <span className="text-xs font-medium tabular-nums text-ink-soft">
              {filteredStyles.length} styles
            </span>
          </div>
          <div
            role="group"
            aria-label="Hair style categories"
            className="mb-3 flex flex-wrap gap-1.5"
            data-testid="hair-filter-bar"
          >
            {HAIR_FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-accent ${
                    active
                      ? 'border-accent bg-accent text-white shadow-sm'
                      : 'border-line bg-surface text-ink-soft hover:border-accent/50 hover:text-ink'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {filteredStyles.map((item) => {
              const selected = hair.styleId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setHairStyle(item.id);
                    void playSfx('tap', muted);
                  }}
                  aria-pressed={selected}
                  className={`rounded-2xl border p-2.5 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-accent ${
                    selected
                      ? 'border-accent bg-surface ring-2 ring-accent/35 shadow-soft'
                      : 'border-line bg-surface hover:border-accent/40 hover:shadow-soft'
                  }`}
                >
                  <PreviewThumb
                    src={getAsset(item.asset, { color: currentColor, hairBack: false })}
                    focusY={110}
                    zoom={0.82}
                    height={84}
                  />
                  <span className="mt-2 block truncate text-xs font-semibold text-ink">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section
          aria-label="Hair color"
          className="rounded-2xl border border-line bg-surface p-4 shadow-soft"
        >
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-ink">Color</h2>
            <span className="text-xs font-medium text-ink-soft">{activeColorName}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {HAIR_COLORS.map((c) => (
              <SwatchButton
                key={c.id}
                color={c.base}
                label={c.name}
                selected={!hair.colorCustom && hair.variantId === c.id}
                onClick={() => setHairColor({ variantId: c.id, colorCustom: undefined })}
                size="lg"
              />
            ))}
            <label
              className="ml-1 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-line bg-surface-2/40 px-3 text-xs font-semibold text-ink hover:bg-surface-2"
              aria-label="Custom hair color"
            >
              <span>Custom</span>
              <input
                type="color"
                value={hair.colorCustom ?? currentColor}
                onChange={(e) => setHairColor({ colorCustom: e.target.value })}
                className="h-6 w-6 cursor-pointer rounded-full border border-line bg-transparent p-0"
              />
            </label>
          </div>
        </section>

        <section
          aria-label="Hair details"
          className="rounded-2xl border border-line bg-surface p-4 shadow-soft"
        >
          <h2 className="mb-3 text-sm font-semibold text-ink">Parting & Finish</h2>
          <div className="flex flex-wrap items-center gap-2">
            {PARTINGS.map((p) => (
              <Button
                key={p}
                variant={hair.parting === p ? 'primary' : 'soft'}
                className="capitalize"
                onClick={() => setParting(p)}
                aria-pressed={hair.parting === p}
              >
                {p} part
              </Button>
            ))}
            <Button
              variant={hair.shine ? 'primary' : 'soft'}
              onClick={() => setShine(!hair.shine)}
              aria-pressed={hair.shine}
            >
              <SparkleIcon className="h-4 w-4" />
              <span>Gloss Shine: {hair.shine ? 'On' : 'Off'}</span>
            </Button>
          </div>
        </section>
      </div>
    </StageFrame>
  );
}
