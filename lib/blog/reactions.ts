export const REACTION_TYPES = ["useful", "love", "fire", "wow", "laugh", "clap"] as const;

export type ReactionType = (typeof REACTION_TYPES)[number];

export type ReactionCounts = Record<ReactionType, number>;

export const REACTION_META: {
  type: ReactionType;
  emoji: string;
  label: string;
  hint: string;
  field: string;
}[] = [
  { type: "useful", emoji: "👍", label: "Useful", hint: "Solid insights", field: "reactionUseful" },
  { type: "love", emoji: "❤️", label: "Love", hint: "You loved this", field: "reactionLove" },
  { type: "fire", emoji: "🔥", label: "Fire", hint: "This hits different", field: "reactionFire" },
  { type: "wow", emoji: "😮", label: "Wow", hint: "Mind opened", field: "reactionWow" },
  { type: "laugh", emoji: "😂", label: "Lol", hint: "Made you laugh", field: "reactionLaugh" },
  { type: "clap", emoji: "👏", label: "Clap", hint: "Standing ovation", field: "reactionClap" }
];

export function emptyReactionCounts(): ReactionCounts {
  return { useful: 0, love: 0, fire: 0, wow: 0, laugh: 0, clap: 0 };
}

export function isReactionType(value: string): value is ReactionType {
  return (REACTION_TYPES as readonly string[]).includes(value);
}

export function sumReactions(counts: ReactionCounts) {
  return REACTION_TYPES.reduce((acc, key) => acc + (counts[key] || 0), 0);
}
