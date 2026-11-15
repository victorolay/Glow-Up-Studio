import { CharacterCanvas } from '@/components/character/CharacterCanvas';
import { StageFrame } from '@/components/layout/StageFrame';
import { Button } from '@/components/ui/Button';
import { ItemCard } from '@/components/ui/ItemCard';
import { PreviewThumb } from '@/components/ui/PreviewThumb';
import { TabBar, type TabDef } from '@/components/ui/TabBar';
import { getAsset } from '@/assets';
import { OUTFIT_ITEMS, outfitVariant } from '@/data/catalog';
import { FLOW, useGameStore } from '@/game/store/gameStore';
import { useCharacterStore } from '@/game/store/characterStore';
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
  const [, setTick] = useState(0);

  const activeSlot = TABS.find((t) => t.id === tab)?.slot ?? 'dress';
  const items = OUTFIT_ITEMS.filter((i) => i.category === activeSlot);
  const selection = outfit[activeSlot];

  return (
    <StageFrame
      title={challenge.title}
      subtitle="Outfit"
      challenge={challenge}
      onBack={back}
      onNext={next}
      nextLabel="Accessories ›"
      dots={{ current: FLOW.indexOf('outfit'), total: FLOW.length }}
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="mx-auto w-full max-w-[280px] shrink-0">
          <CharacterCanvas ariaLabel="Your character wearing the selected outfit" />
          {selection && (
            <Button variant="ghost" className="mt-1 w-full" onClick={() => setOutfit(activeSlot, null)}>
              Remove {activeSlot === 'shoes' ? 'shoes' : activeSlot === 'dress' ? 'dress' : activeSlot}
            </Button>
          )}
        </div>
        <div className="flex-1">
          <TabBar tabs={TABS} active={tab} onChange={setTab} ariaLabel="Wardrobe categories" />
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3" data-testid="outfit-grid">
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
                    setOutfit(activeSlot, { itemId: item.id, variantId: currentVariant ?? item.variants[0]?.id });
                    void playSfx('tap', muted);
                  }}
                  previewSrc={
                    <PreviewThumbInner id={item.id} variantId={currentVariant ?? item.variants[0]?.id} />
                  }
                  variants={item.variants.map((v) => ({ id: v.id, name: v.name, color: v.colors.primary }))}
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
      height={84}
    />
  );
}
