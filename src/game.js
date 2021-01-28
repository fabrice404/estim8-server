const game = {};

/**
 * Return the current game
 */
const get = () => game;

/**
 * Start voting and remove all players
 */
const reset = () => {
  game.voting = true;
  game.players = [];
};

/**
 * Start voting and reset all players votes
 */
const roundReset = () => {
  game.voting = true;
  game.players.forEach((player) => {
    player.points = null;
  });
};

/**
 * Stop voting
 */
const roundEndVote = () => {
  game.voting = false;
};

/**
 * Add a player to the game
 * @param {string} name
 */
const playerAdd = (name) => {
  let player = game.players.find((p) => p.name === name);
  if (!player) {
    player = { name, points: null };
    game.players.push(player);
  }
  return player;
};

/**
 * Set vote for a player
 * @param {string} name
 * @param {number} points
 */
const playerVote = (name, points) => {
  let player = game.players.find((p) => p.name === name);
  if (!player) {
    player = playerAdd(name);
  }
  player.points = points;
};

/**
 * Websocket message handler
 * @param {string} message
 */
const messageHandler = (message) => {
  const msg = JSON.parse(message);
  switch (msg.type) {
    case 'GAME_NEW': reset(); break;
    case 'PLAYER_ADD': playerAdd(msg.name); break;
    case 'PLAYER_VOTE': playerVote(msg.name, msg.points); break;
    case 'ROUND_END_VOTE': roundEndVote(); break;
    case 'ROUND_RESET': roundReset(); break;
    default: break;
  }
  return JSON.stringify(game);
};

module.exports = {
  get,
  reset,
  messageHandler,
};
