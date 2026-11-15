import { getAsset } from '@/assets';
import { CharacterCanvas } from '@/components/character/CharacterCanvas';
import { StageFrame } from '@/components/layout/StageFrame';
import { Button } from '@/components/ui/Button';
import { ItemCard } from '@/components/ui/ItemCard';
import { PreviewThumb } from '@/components/ui/PreviewThumb';
import { TabBar, type TabDef } from '@/components/ui/TabBar';
import { OUTFIT_ITEMS, outfitVariant } from '@/data/catalog';
import { useCharacterStore } from '@/game/store/characterStore';
import { FLOW, useGameStore } from '@/game/store/gameStore';
import { useProgressStore } from '@/game/store/progressStore';
import { playSfx } from '@/utils/sound';
import type { Challenge, OutfitSlot } from '@/game/types';
import { useState } from 'react';

const TABS: Array<TabDef & { slot: OutfitSlot }> = [
  { id: 'dress', label: 'Dresses', slot: 'dress' },
  { id: 'top', label: 'Tops', slot: 'top' },
  { id: 'bottom', label: 'Bottoms', slot: 'bottom' },
  { id: 'swim', label: 'Swim', slot: 'swim' },
  { id: 'outerwear', label: 'Outerwear', slot: 'outerwear' },
  { id: 'shoes', label: 'Shoes', slot: 'shoes' },
];

type DressFilter = 'all' | 'party' | 'club' | 'nigerian' | 'classic';

const DRESS_FILTERS: Array<{ id: DressFilter; label: string }> = [
  { id: 'all', label: 'All Dresses' },
  { id: 'party', label: 'Party' },
  { id: 'club', label: 'Night Club' },
  { id: 'nigerian', label: 'Nigerian' },
  { id: 'classic', label: 'Classic' },
];

export function OutfitStage({ challenge }: { challenge: Challenge }) {
  const next = useGameStore((s) => s.next);
  const back = useGameStore((s) => s.back);
  const outfit = useCharacterStore((s) => s.outfit);
  const setOutfit = useCharacterStore((s) => s.setOutfit);
  const coins = useProgressStore((s) => s.coins);
  const muted = useProgressStore((s) => s.muted);
  const isItemUnlocked = useProgressStore((s) => s.isItemUnlocked);
  const tryUnlockItem = useProgressStore((s) => s.tryUnlockItem);
  const [tab, setTab] = useState('dress');
  const [dressFilter, setDressFilter] = useState<DressFilter>('all');
  const [, setTick] = useState(0);

  const activeSlot = TABS.find((t) => t.id === tab)?.slot ?? 'dress';
  const items = OUTFIT_ITEMS.filter((i) => {
    if (i.category !== activeSlot) return false;
    if (activeSlot !== 'dress' || dressFilter === 'all') return true;
    if (dressFilter === 'party') return i.tags.includes('party') && !i.tags.includes('club');
    if (dressFilter === 'club') return i.tags.includes('club');
    if (dressFilter === 'nigerian') return i.tags.includes('nigerian');
    return !i.tags.includes('party') && !i.tags.includes('club') && !i.tags.includes('nigerian');
  });
  const selection = outfit[activeSlot];

  return (
    <StageFrame
      title={challenge.title}
      subtitle="Wardrobe"
      challenge={challenge}
      onBack={back}
      onNext={next}
      nextLabel="Accessories"
      dots={{ current: FLOW.indexOf('outfit'), total: FLOW.length }}
      defaultZoom="full"
      renderMirror={(zoomMode) => (
        <CharacterCanvas zoomMode={zoomMode} ariaLabel="Your character wearing the selected outfit" />
      )}
      mirrorFooter={
        selection ? (
          <Button variant="ghost" className="w-full" onClick={() => setOutfit(activeSlot, null)}>
            Remove {activeSlot === 'shoes' ? 'shoes' : activeSlot === 'dress' ? 'dress' : activeSlot}
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-4">
        <TabBar tabs={TABS} active={tab} onChange={setTab} ariaLabel="Wardrobe categories" />
        {activeSlot === 'dress' && (
          <div
            role="group"
            aria-label="Dress collections"
            className="flex flex-wrap gap-1.5"
            data-testid="dress-filter-bar"
          >
            {DRESS_FILTERS.map((f) => {
              const active = dressFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setDressFilter(f.id)}
                  data-testid={`dress-filter-${f.id}`}
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
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" data-testid="outfit-grid">
          {items.map((item) => {
            const selected = selection?.itemId === item.id;
            const currentVariant = selected ? selection?.variantId : undefined;
            const unlocked = isItemUnlocked(item);
            return (
              <ItemCard
                key={item.id}
                name={item.name}
                tags={item.tags}
                selected={selected}
                onClick={() => {
                  setOutfit(activeSlot, {
                    itemId: item.id,
                    variantId: currentVariant ?? item.variants[0]?.id,
                  });
                  void playSfx('tap', muted);
                }}
                previewSrc={
                  <PreviewThumbInner
                    id={item.id}
                    variantId={currentVariant ?? item.variants[0]?.id}
                  />
                }
                variants={item.variants.map((v) => ({
                  id: v.id,
                  name: v.name,
                  color: v.colors.primary,
                }))}
                activeVariantId={currentVariant ?? item.variants[0]?.id}
                onVariantClick={(vId) => {
                  setOutfit(activeSlot, { itemId: item.id, variantId: vId });
                  void playSfx('tap', muted);
                }}
                lockedCost={unlocked ? undefined : item.unlock.cost}
                affordable={coins >= (item.unlock.cost ?? 0)}
                onUnlock={() => {
                  if (tryUnlockItem(item)) {
                    void playSfx('sparkle', muted);
                    setOutfit(activeSlot, { itemId: item.id, variantId: item.variants[0]?.id });
                    setTick((t) => t + 1);
                  }
                }}
                testid={`outfit-item-${item.id}`}
              />
            );
          })}
        </div>
      </div>
    </StageFrame>
  );
}

function PreviewThumbInner({ id, variantId }: { id: string; variantId?: string }) {
  const item = OUTFIT_ITEMS.find((i) => i.id === id);
  if (!item) return null;
  const variant = outfitVariant(item, variantId);
  const src = getAsset(item.asset, {
    color: variant?.colors.primary,
    color2: variant?.colors.secondary,
    pattern: variant?.pattern,
  });
  const focusY = item.category === 'shoes' ? 1230 : 540;
  return (
    <PreviewThumb
      src={src}
      focusY={focusY}
      focusX={300}
      zoom={item.category === 'shoes' ? 0.65 : 0.52}
      height={96}
    />
  );
}
