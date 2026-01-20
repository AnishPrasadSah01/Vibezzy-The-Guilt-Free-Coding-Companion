
export const PHYSICAL_ACTIVITIES = [
  "Go to the kitchen and drink a glass of water",
  "Step outside and get 5 minutes of sunlight",
  "Go touch some grass (literally!)",
  "Do 10 jumping jacks",
  "Stretch your arms above your head for 30 seconds",
  "Look at something 20 feet away for 20 seconds",
  "Roll your shoulders backwards 10 times",
  "Try to touch your toes and hold for 15 seconds",
  "Deep breath in for 4, hold for 4, out for 4",
  "Stand up and do a quick victory dance",
  "Do 10 bodyweight squats",
  "Take 10 slow shoulder rolls (forward)",
  "Do a 20-second neck stretch (each side)",
  "Walk around the room for 1 minute",
  "Shake out your hands + wrists for 20 seconds",
  "Do a 30-second calf stretch (each side)",
  "Do 10 wall push-ups",
  "Do 20 seconds of high knees",
  "Stand tall and take 5 deep belly breaths",
  "Look away from the screen and blink slowly 20 times",
  "Do a gentle spine twist (seated) for 20 seconds each side",
  "Open and close your fists 20 times",
  "Do 10 heel raises",
  "March in place for 45 seconds"
];

export const MENTAL_REFRESHERS = [
  "Box breathing: inhale 4, hold 4, exhale 4, hold 4 (repeat 3x)",
  "Name 5 things you can see, 4 you can feel, 3 you can hear, 2 you can smell, 1 you can taste",
  "Close your eyes and relax your jaw + shoulders for 20 seconds",
  "Write one tiny next step for your task (one sentence)",
  "Do a quick posture reset: feet flat, shoulders down, chin slightly tucked",
  "Pick one bug to ignore for now. Write it down and move on.",
  "Gratitude micro-reset: list 3 small wins from today",
  "Mind sweep: write any distracting thoughts (15 seconds), then return",
  "Slow exhale: inhale 3 seconds, exhale 6 seconds (repeat 5x)",
  "Visual reset: stare at a distant object for 20 seconds",
  "Tension scan: forehead, jaw, neck, shoulders — relax each",
  "Ask: ‘What is the simplest thing that could work?’",
  "Set an intention: ‘During the next focus block, I will ____’",
  "Mini-compassion: ‘It’s okay to go one line at a time.’",
  "Hydration check: sip water and take one slow breath"
];

export const VALIDATION_MESSAGES = [
  "Amazing work, {username}! You completed {sessions} coding sessions!",
  "You did it! Taking breaks makes you a *better* coder.",
  "Your code AND your brain thank you for showing up today!",
  "Session complete! Your discipline is inspiring, {username}.",
  "You prioritized your wellbeing while learning. That's a pro move."
];

const numericGifIndex = (path: string) => {
  const match = path.match(/(\d+)\.gif$/);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
};

const toSortedNumericGifUrls = (
  modules: Record<string, string>,
  minIndex?: number,
  maxIndex?: number
) => {
  return Object.entries(modules)
    .map(([path, url]) => ({ path, url }))
    .filter(({ path }) => {
      const idx = numericGifIndex(path);
      if (!Number.isFinite(idx)) return false;
      if (minIndex !== undefined && idx < minIndex) return false;
      if (maxIndex !== undefined && idx > maxIndex) return false;
      return true;
    })
    .sort((a, b) => numericGifIndex(a.path) - numericGifIndex(b.path))
    .map(({ url }) => url);
};

// Focus block overlay GIFs (images/Motivational Memes/1.gif ... 11.gif)
const MOTIVATION_GIF_MODULES = import.meta.glob<string>('./images/Motivational Memes/*.gif', {
  eager: true,
  query: '?url',
  import: 'default',
});
export const MOTIVATION_GIFS = toSortedNumericGifUrls(MOTIVATION_GIF_MODULES, 1, 11);

// Break session memes (images/Funny Mems/1.gif ... 9.gif)
const FUNNY_MEME_GIF_MODULES = import.meta.glob<string>('./images/Funny Mems/*.gif', {
  eager: true,
  query: '?url',
  import: 'default',
});
export const MEMES = toSortedNumericGifUrls(FUNNY_MEME_GIF_MODULES, 1, 9);
