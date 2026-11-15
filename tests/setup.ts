import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Lookbook storage is not available in jsdom — mock for unit tests.
vi.mock('@/utils/idb', () => ({
  idbPutLook: vi.fn(async () => 'mock-key'),
  idbAllLooks: vi.fn(async () => []),
  idbDeleteLook: vi.fn(async () => undefined),
}));
