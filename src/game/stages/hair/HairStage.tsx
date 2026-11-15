import { CharacterCanvas } from '@/components/character/CharacterCanvas';
import { StageFrame } from '@/components/layout/StageFrame';
import { Button } from '@/components/ui/Button';
import { PreviewThumb } from '@/components/ui/PreviewThumb';
import { SwatchButton } from '@/components/ui/SwatchButton';
import { HAIR_COLORS } from '@/data/items/customization';
import { HAIR_ITEMS } from '@/data/items/hair';
import { FLOW, useGameStore } from '@/game/store/gameStore';
import { useCharacterStore } from '@/game/store/characterStore';
import { useProgressStore } from '@/game/store/progressStore';
import { getAsset } from '@/assets';
import { playSfx } from '@/utils/sound';
import type { Challenge, Parting } from '@/game/types';

const PARTINGS: Parting[] = ['left', 'center', 'right'];

export function HairStage({ challenge }: { challenge: Challenge }) {
  const next = useGameStore((s) => s.next);
  const back = useGameStore((s) => s.back);
  const hair = useCharacterStore((s) => s.hair);
  const setHairStyle = useCharacterStore((s) => s.setHairStyle);
  const setHairColor = useCharacterStore((s) => s.setHairColor);
  const setParting = useCharacterStore((s) => s.setParting);
  const setShine = useCharacterStore((s) => s.setShine);
  const muted = useProgressStore((s) => s.muted);

  const currentColor = hair.colorCustom ?? HAIR_COLORS.find((c) => c.id === hair.variantId)?.base ?? '#6b4230';

  return (
    <StageFrame
      title={challenge.title}
      subtitle="Hair"
      challenge={challenge}
      onBack={back}
      onNext={next}
      nextLabel="Outfit ›"
      dots={{ current: FLOW.indexOf('hair'), total: FLOW.length }}
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="mx-auto w-full max-w-[280px] shrink-0">
          <CharacterCanvas ariaLabel="Your character with selected hairstyle" />
        </div>
        <div className="flex-1 space-y-4">
          <section aria-label="Hair styles" data-testid="hair-styles">
            <h2 className="mb-2 text-sm font-semibold text-ink">Styles</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {HAIR_ITEMS.map((item) => {
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
                    className={`rounded-2xl border p-2 text-left transition ${
                      selected ? 'border-accent ring-2 ring-accent/40' : 'border-line bg-surface'
                    }`}
                  >
                    <PreviewThumb src={getAsset(item.asset, { color: currentColor, hairBack: false })} focusY={105} zoom={0.85} height={72} />
                    <span className="mt-1 block text-xs font-semibold text-ink">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-label="Hair color">
            <h2 className="mb-2 text-sm font-semibold text-ink">Color</h2>
            <div className="flex flex-wrap items-center gap-2">
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
              <label className="ml-1 flex min-h-[44px] items-center gap-2 text-xs text-ink-soft" aria-label="Custom hair color">
                Custom
                <input
                  type="color"
                  value={hair.colorCustom ?? currentColor}
                  onChange={(e) => setHairColor({ colorCustom: e.target.value })}
                  className="h-9 w-9 cursor-pointer rounded-full border border-line bg-transparent p-0"
                />
              </label>
            </div>
          </section>

          <section aria-label="Hair details">
            <h2 className="mb-2 text-sm font-semibold text-ink">Details</h2>
            <div className="flex flex-wrap gap-2">
              {PARTINGS.map((p) => (
                <Button
                  key={p}
                  variant={hair.parting === p ? 'primary' : 'soft'}
                  className="min-h-[36px] capitalize"
                  onClick={() => setParting(p)}
                  aria-pressed={hair.parting === p}
                >
                  {p} part
                </Button>
              ))}
              <Button
                variant={hair.shine ? 'primary' : 'soft'}
                className="min-h-[36px]"
                onClick={() => setShine(!hair.shine)}
                aria-pressed={hair.shine}
              >
                ✨ Shine {hair.shine ? 'on' : 'off'}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </StageFrame>
  );
}
