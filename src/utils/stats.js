import Cookies from 'js-cookie';

const STATS_COOKIE = 'wordle_stats';

export const getStats = () => {
  const stats = Cookies.get(STATS_COOKIE);
  if (stats) {
    try {
      const parsedStats = JSON.parse(stats);
      // Ensure all properties are present with default values
      return {
        played: parsedStats.played || 0,
        wins: parsedStats.wins || 0,
        streak: parsedStats.streak || 0,
        maxStreak: parsedStats.maxStreak || 0,
        guesses: parsedStats.guesses || [],
      };
    } catch (error) {
      // If parsing fails, reset the stats
      resetStats();
    }
  }
  return { played: 0, wins: 0, streak: 0, maxStreak: 0, guesses: [] };
};

export const updateStats = (guesses, won) => {
  const stats = getStats();
  stats.played += 1;
  if (won) {
    stats.wins += 1;
    stats.streak += 1;
    stats.guesses.push(guesses);
    if (stats.streak > stats.maxStreak) {
      stats.maxStreak = stats.streak;
    }
  } else {
    stats.streak = 0;
  }
  Cookies.set(STATS_COOKIE, JSON.stringify(stats));
};

export const resetStats = () => {
  Cookies.set(STATS_COOKIE, JSON.stringify({ played: 0, wins: 0, streak: 0, maxStreak: 0, guesses: [] }));
};

export const getAverageGuesses = () => {
  const stats = getStats();
  const totalGuesses = stats.guesses.reduce((acc, curr) => acc + curr, 0);
  return (totalGuesses / stats.guesses.length) || 0;
};

export const getGuessDistribution = () => {
  const stats = getStats();
  const distribution = {};
  stats.guesses.forEach(guess => {
    if (!distribution[guess]) {
      distribution[guess] = 0;
    }
    distribution[guess] += 1;
  });
  return distribution;
};
