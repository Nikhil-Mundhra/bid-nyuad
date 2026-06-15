import { describe, it, expect } from 'vitest';
import { serialize } from './serialize';

describe('serialize', () => {
  it('serializes primitives correctly', () => {
    expect(serialize(null)).toBe(null);
    expect(serialize(1)).toBe(1);
    expect(serialize("test")).toBe("test");
    expect(serialize(true)).toBe(true);
  });

  it('serializes dates to ISO strings', () => {
    const date = new Date('2025-05-24T10:00:00.000Z');
    expect(serialize(date)).toBe('2025-05-24T10:00:00.000Z');
  });

  it('serializes objects with toJSON correctly', () => {
    const obj = {
      toJSON() {
        return "custom";
      }
    };
    expect(serialize(obj)).toBe("custom");
  });

  it('serializes arrays correctly', () => {
    const arr = [1, "test", new Date('2025-05-24T10:00:00.000Z')];
    expect(serialize(arr)).toEqual([1, "test", '2025-05-24T10:00:00.000Z']);
  });

  it('deeply serializes objects correctly', () => {
    const obj = {
      a: 1,
      b: {
        c: new Date('2025-05-24T10:00:00.000Z'),
        d: [
          { e: 2 }
        ]
      }
    };
    expect(serialize(obj)).toEqual({
      a: 1,
      b: {
        c: '2025-05-24T10:00:00.000Z',
        d: [
          { e: 2 }
        ]
      }
    });
  });

  it('behaves identically to JSON.parse(JSON.stringify(obj)) for a complex object', () => {
    const date = new Date('2025-05-24T10:00:00.000Z');
    const complexObj = {
      id: "test",
      date,
      nested: {
        arr: [1, date, { toJSON: () => "custom" }],
      }
    };
    const expected = JSON.parse(JSON.stringify(complexObj));
    const result = serialize(complexObj);
    expect(result).toEqual(expected);
  });
});
