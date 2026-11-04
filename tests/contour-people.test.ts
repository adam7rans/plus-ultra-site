import assert from "node:assert/strict";
import { test } from "node:test";
import { createPeopleLayer, generatePeopleGroups, personPosition } from "../src/app/components/contour/people.ts";

test("groups include individuals, pairs, trios and twenty people", () => {
  const bounds = { x: 0, y: 0, width: 5000, height: 5000 };
  const groups = generatePeopleGroups(bounds);
  const sizes = new Set(groups.map(group => group.people.length));
  for (const size of [1, 2, 3, 20]) assert(sizes.has(size));
  assert(groups.every(group => group.people.length <= 20));
  assert.equal(new Set(groups.map(group => group.color)).size, 3);
  assert.deepEqual(groups, generatePeopleGroups(bounds));
});

test("overlapping world regions keep identical groups through map rebuilds", () => {
  const original = generatePeopleGroups({ x: 0, y: 0, width: 1440, height: 900 });
  const next = generatePeopleGroups({ x: 960, y: 640, width: 1440, height: 900 });
  const indexed = new Map(original.map(group => [group.id, group]));
  const shared = next.filter(group => indexed.has(group.id));
  assert(shared.length > 0);
  for (const group of shared) assert.deepEqual(group, indexed.get(group.id));
});

function captureLayer() {
  const dots: { world: string; x: number; y: number }[] = [];
  let translateX = 0, translateY = 0;
  const context = {
    save() {}, restore() {}, beginPath() {}, fill() {},
    translate(x: number, y: number) { translateX = x; translateY = y; },
    arc(x: number, y: number) {
      dots.push({ world: `${x}:${y}`, x: x + translateX, y: y + translateY });
    },
  } as unknown as CanvasRenderingContext2D;
  return { context, dots };
}

test("people stay fixed on the terrain as the viewport moves", () => {
  const layer = createPeopleLayer();
  const before = captureLayer(), after = captureLayer();
  const bounds = { x: 200, y: 200, width: 1440, height: 900 };
  const spotlight = { x: 720, y: 450, radius: 10000 };
  layer.draw(before.context, bounds, spotlight);
  layer.draw(after.context, { ...bounds, x: 231, y: 219 }, spotlight);
  const original = new Map(before.dots.map(dot => [dot.world, dot]));
  assert(after.dots.length > 0);
  for (const dot of after.dots) {
    const previous = original.get(dot.world);
    if (!previous) continue;
    assert(Math.abs(dot.x - (previous.x - 31)) < 1e-9);
    assert(Math.abs(dot.y - (previous.y - 19)) < 1e-9);
  }
});

test("people outside the spotlight are culled", () => {
  const layer = createPeopleLayer();
  const capture = captureLayer();
  layer.draw(capture.context, { x: 0, y: 0, width: 1440, height: 900 }, {
    x: -10000, y: -10000, radius: 350,
  });
  assert.equal(capture.dots.length, 0);
});

test("walking groups travel together while keeping individual variation", () => {
  const groups = generatePeopleGroups({ x: 0, y: 0, width: 1440, height: 900 });
  const walking = groups.filter(group => group.walk && group.people.length >= 3);
  assert(walking.length > 0);
  const group = walking.find(group => {
    const before = personPosition(group, group.people[0], 0);
    const after = personPosition(group, group.people[0], 7);
    return Math.hypot(after.x - before.x, after.y - before.y) > 15;
  });
  assert(group);
  const shifts = group.people.map(person => {
    const before = personPosition(group, person, 0), after = personPosition(group, person, 7);
    return { x: after.x - before.x, y: after.y - before.y };
  });
  assert(shifts.every(shift => Math.hypot(shift.x - shifts[0].x, shift.y - shifts[0].y) < 12));
  assert(shifts.some(shift => Math.hypot(shift.x - shifts[0].x, shift.y - shifts[0].y) > 0.1));
});

test("stopped groups mix stationary people with bounded local walkers", () => {
  const groups = generatePeopleGroups({ x: 0, y: 0, width: 1440, height: 900 });
  const group = groups.find(group => !group.walk && group.people.length >= 3);
  assert(group);
  const planted = group.people[0], walker = group.people[1];
  assert(!planted.walk && walker.walk);
  for (const time of [0, 4, 9, 60, 3600]) {
    assert.deepEqual(personPosition(group, planted, time), { x: planted.x, y: planted.y });
    const position = personPosition(group, walker, time);
    assert(Math.hypot(position.x - walker.x, position.y - walker.y) < 25);
  }
  assert.notDeepEqual(personPosition(group, walker, 0), personPosition(group, walker, 9));
});

test("walks remain continuous and deterministic at turns and after long sessions", () => {
  const groups = generatePeopleGroups({ x: 0, y: 0, width: 1440, height: 900 });
  for (const group of groups) {
    for (const person of group.people) {
      for (const time of [-60, -1, 0, 12, 60, 3600]) {
        const current = personPosition(group, person, time);
        const next = personPosition(group, person, time + 0.001);
        assert(Math.hypot(next.x - current.x, next.y - current.y) < 0.05);
        assert.deepEqual(current, personPosition(group, person, time));
        // Walks stay within the neighboring cells included in the viewport cache.
        assert(Math.hypot(current.x - person.x, current.y - person.y) < 100);
      }
    }
  }
});
