import { CharacterCanvas } from '@/components/character/CharacterCanvas';
import { StageFrame } from '@/components/layout/StageFrame';
import { Button } from '@/components/ui/Button';
import { ItemCard } from '@/components/ui/ItemCard';
import { PreviewThumb } from '@/components/ui/PreviewThumb';
import { TabBar, type TabDef } from '@/components/ui/TabBar';
import { getAsset } from '@/assets';
import { ACCESSORY_ITEMS } from '@/data/items/accessories';
import { FLOW, useGameStore } from '@/game/store/gameStore';
import { useCharacterStore } from '@/game/store/characterStore';
import { useProgressStore } from '@/game/store/progressStore';
import { playSfx } from '@/utils/sound';
import type { AccessorySlot, Challenge } from '@/game/types';
import { useState } from 'react';

const TABS: Array<TabDef & { slot: AccessorySlot }> = [
  { id: 'glasses', label: 'Glasses', slot: 'glasses' },
  { id: 'hat', label: 'Hats', slot: 'hat' },
  { id: 'scarf', label: 'Scarves', slot: 'scarf' },
  { id: 'necklace', label: 'Necklaces', slot: 'necklace' },
  { id: 'earrings', label: 'Earrings', slot: 'earrings' },
  { id: 'bag', label: 'Bags', slot: 'bag' },
  { id: 'hairAccessory', label: 'Hair', slot: 'hairAccessory' },
  { id: 'watch', label: 'Watches', slot: 'watch' },
  { id: 'belt', label: 'Belts', slot: 'belt' },
  { id: 'hosiery', label: 'Tights', slot: 'hosiery' },
  { id: 'gloves', label: 'Gloves', slot: 'gloves' },
  { id: 'anklet', label: 'Anklets', slot: 'anklet' },
];

/** Focus point per accessory slot for the cropped preview. */
const FOCUS: Record<AccessorySlot, { y: number; x: number; zoom: number }> = {
  glasses: { y: 134, x: 300, zoom: 0.85 },
  hat: { y: 60, x: 300, zoom: 0.7 },
  scarf: { y: 380, x: 300, zoom: 0.6 },
  necklace: { y: 335, x: 300, zoom: 0.7 },
  earrings: { y: 160, x: 251, zoom: 0.95 },
  bag: { y: 610, x: 430, zoom: 0.6 },
  hairAccessory: { y: 102, x: 374, zoom: 0.95 },
  watch: { y: 608, x: 176, zoom: 0.95 },
  belt: { y: 485, x: 300, zoom: 0.55 },
  hosiery: { y: 850, x: 300, zoom: 0.45 },
  gloves: { y: 610, x: 176, zoom: 0.9 },
  anklet: { y: 1210, x: 251, zoom: 0.95 },
};

export function AccessoriesStage({ challenge }: { challenge: Challenge }) {
  const next = useGameStore((s) => s.next);
  const back = useGameStore((s) => s.back);
  const accessories = useCharacterStore((s) => s.accessories);
  const setAccessory = useCharacterStore((s) => s.setAccessory);
  const coins = useProgressStore((s) => s.coins);
  const muted = useProgressStore((s) => s.muted);
  const isItemUnlocked = useProgressStore((s) => s.isItemUnlocked);
  const tryUnlockItem = useProgressStore((s) => s.tryUnlockItem);
  const [tab, setTab] = useState('glasses');
  const [, setTick] = useState(0);

  const activeSlot = TABS.find((t) => t.id === tab)?.slot ?? 'glasses';
  const items = ACCESSORY_ITEMS.filter((i) => i.slot === activeSlot);
  const selection = accessories[activeSlot];

  return (
    <StageFrame
      title={challenge.title}
      subtitle="Accessories"
      challenge={challenge}
      onBack={back}
      onNext={next}
      nextLabel="Photo Studio ›"
      dots={{ current: FLOW.indexOf('accessories'), total: FLOW.length }}
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="mx-auto w-full max-w-[280px] shrink-0">
          <CharacterCanvas ariaLabel="Your character wearing selected accessories" />
          {selection && (
            <Button variant="ghost" className="mt-1 w-full" onClick={() => setAccessory(activeSlot, null)}>
              Remove accessory
            </Button>
          )}
        </div>
        <div className="flex-1">
          <TabBar tabs={TABS} active={tab} onChange={setTab} ariaLabel="Accessory categories" />
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Button
              variant={selection ? 'soft' : 'primary'}
              className="h-auto flex-col py-3"
              onClick={() => setAccessory(activeSlot, null)}
              aria-pressed={!selection}
              data-testid={`accessory-none-${activeSlot}`}
            >
              <span className="text-lg" aria-hidden="true">
                ⭘
              </span>
              None
            </Button>
            {items.map((item) => {
              const selected = selection?.itemId === item.id;
              const unlocked = isItemUnlocked(item);
              const variant = item.variants?.[0];
              return (
                <ItemCard
                  key={item.id}
                  name={item.name}
                  tags={item.tags}
                  selected={selected}
                  onClick={() => {
                    setAccessory(activeSlot, { itemId: item.id, variantId: variant?.id });
                    void playSfx('tap', muted);
                  }}
                  previewSrc={
                    <PreviewThumb
                      src={getAsset(item.asset, { color: variant?.colors.primary, color2: variant?.colors.secondary })}
                      focusY={FOCUS[activeSlot].y}
                      focusX={FOCUS[activeSlot].x}
                      zoom={FOCUS[activeSlot].zoom}
                      height={84}
                    />
                  }
                  variants={item.variants?.map((v) => ({ id: v.id, name: v.name, color: v.colors.primary }))}
                  activeVariantId={selected ? selection?.variantId ?? variant?.id : undefined}
                  onVariantClick={(vId) => setAccessory(activeSlot, { itemId: item.id, variantId: vId })}
                  lockedCost={unlocked ? undefined : item.unlock.cost}
                  affordable={coins >= (item.unlock.cost ?? 0)}
                  onUnlock={() => {
                    if (tryUnlockItem(item)) {
                      void playSfx('sparkle', muted);
                      setAccessory(activeSlot, { itemId: item.id, variantId: variant?.id });
                      setTick((t) => t + 1);
                    }
                  }}
                  testid={`accessory-item-${item.id}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </StageFrame>
  );
}
