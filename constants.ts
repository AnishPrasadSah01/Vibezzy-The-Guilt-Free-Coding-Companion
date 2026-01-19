
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
  "Stand up and do a quick victory dance"
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
