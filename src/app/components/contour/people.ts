interface WalkingRoute {
  radius: number;
  duration: number;
  phase: number;
  heading: number;
  stretch: number;
}
export interface MapPerson { x: number; y: number; walk?: WalkingRoute }
export interface PeopleGroup {
  id: string;
  color: string;
  people: MapPerson[];
  walk?: WalkingRoute;
}
export interface WorldBounds { x: number; y: number; width: number; height: number }
interface Spotlight { x: number; y: number; radius: number }

const CELL_SIZE = 240;
const GROUP_SIZES = [1, 1, 2, 2, 3, 3, 5, 8, 12, 20];
const COLORS = ["#78dfff", "#ffd078", "#d5a4ff"];
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const WAYPOINTS = [[-0.7, -0.3], [0.55, -0.5], [0.8, 0.45], [-0.45, 0.55]];

function createRoute(random: () => number, radius: number, duration: number): WalkingRoute {
  return {
    radius, duration, phase: random() * duration * 4,
    heading: random() * Math.PI * 2, stretch: 0.55 + random() * 0.45,
  };
}

/** Short rests at each waypoint, with gradual starts, turns and stops. */
function routeOffset(route: WalkingRoute | undefined, seconds: number) {
  if (!route) return { x: 0, y: 0 };
  const progress = (seconds + route.phase) / route.duration;
  const leg = Math.floor(progress);
  const fraction = progress - leg;
  const walking = Math.max(0, Math.min(1, (fraction - 0.12) / 0.8));
  const blend = walking * walking * (3 - 2 * walking);
  const waypoint = ((leg % WAYPOINTS.length) + WAYPOINTS.length) % WAYPOINTS.length;
  const from = WAYPOINTS[waypoint];
  const to = WAYPOINTS[(waypoint + 1) % WAYPOINTS.length];
  const x = (from[0] + (to[0] - from[0]) * blend) * route.radius;
  const y = (from[1] + (to[1] - from[1]) * blend) * route.radius * route.stretch;
  return {
    x: x * Math.cos(route.heading) - y * Math.sin(route.heading),
    y: x * Math.sin(route.heading) + y * Math.cos(route.heading),
  };
}

/** Sample absolute map time so hovering, resizing and cache rebuilds never reset a walk. */
export function personPosition(group: PeopleGroup, person: MapPerson, seconds: number) {
  const groupOffset = routeOffset(group.walk, seconds);
  const localOffset = routeOffset(person.walk, seconds);
  return { x: person.x + groupOffset.x + localOffset.x, y: person.y + groupOffset.y + localOffset.y };
}

function cellRandom(column: number, row: number) {
  let state = (Math.imul(column, 374761393) ^ Math.imul(row, 668265263) ^ 27182) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function cellBounds({ x, y, width, height }: WorldBounds) {
  return [
    Math.floor(x / CELL_SIZE) - 1, Math.floor(y / CELL_SIZE) - 1,
    Math.floor((x + width) / CELL_SIZE) + 1, Math.floor((y + height) / CELL_SIZE) + 1,
  ];
}

/** World-coordinate seeds keep groups unchanged when terrain tiles rebuild. */
export function generatePeopleGroups(bounds: WorldBounds): PeopleGroup[] {
  const [left, top, right, bottom] = cellBounds(bounds);
  const groups: PeopleGroup[] = [];
  for (let row = top; row <= bottom; row++) {
    for (let column = left; column <= right; column++) {
      const random = cellRandom(column, row);
      if (random() < 0.12) continue;
      const x = (column + 0.2 + random() * 0.6) * CELL_SIZE;
      const y = (row + 0.2 + random() * 0.6) * CELL_SIZE;
      const count = GROUP_SIZES[Math.floor(random() * GROUP_SIZES.length)];
      const color = COLORS[Math.floor(random() * COLORS.length)];
      const rotation = random() * Math.PI * 2;
      const walkingGroup = random() < 0.45;
      const walk = walkingGroup ? createRoute(random, 45 + random() * 40, 14 + random() * 10) : undefined;
      const people = Array.from({ length: count }, (_, index) => {
        const distance = index === 0 ? 0 : 10 * Math.sqrt(index) + random() * 2;
        const angle = rotation + index * GOLDEN_ANGLE + random() * 0.2;
        // Stopped groups keep a few people planted while others stroll nearby.
        const strolling = walkingGroup || index === 1 || (index > 1 && random() < 0.4);
        const localWalk = strolling
          ? createRoute(random, walkingGroup ? 1.5 + random() * 2 : 7 + random() * 9, 5 + random() * 6)
          : undefined;
        return { x: x + Math.cos(angle) * distance, y: y + Math.sin(angle) * distance, walk: localWalk };
      });
      groups.push({ id: `${column}:${row}`, color, people, walk });
    }
  }
  return groups;
}

/** Cache only the cells around the visible viewport, rather than an infinite map. */
export function createPeopleLayer() {
  let cacheKey = "";
  let groups: PeopleGroup[] = [];
  return {
    draw(context: CanvasRenderingContext2D, bounds: WorldBounds, spot: Spotlight, seconds = 0) {
      const key = cellBounds(bounds).join(":");
      if (key !== cacheKey) {
        groups = generatePeopleGroups(bounds);
        cacheKey = key;
      }
      context.save();
      context.translate(-bounds.x, -bounds.y);
      for (const group of groups) {
        context.fillStyle = group.color;
        context.shadowColor = group.color;
        context.shadowBlur = 5;
        for (const person of group.people) {
          const position = personPosition(group, person, seconds);
          const screenX = position.x - bounds.x, screenY = position.y - bounds.y;
          if (Math.hypot(screenX - spot.x, screenY - spot.y) > spot.radius + 8) continue;
          context.beginPath();
          context.arc(position.x, position.y, 2.6, 0, Math.PI * 2);
          context.fill();
        }
      }
      context.restore();
    },
  };
}
