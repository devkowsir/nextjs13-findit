export const NAME_REGEX = /^[A-Za-z0-9_]{3,20}$/;
export const USERNAME_REGEX = /[a-zA-Z][a-z0-9A-Z-_]*[a-zA-Z0-9]$/;
export const INFINITE_SCROLLING_PAGINATION_RESULTS = 5;
export const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
});
export const GeneralPostingRules = [
  "Remember the human",
  "Behave like you would in real life",
  "Look for the original source of content",
  "Search for duplicates before posting",
  "Read the community’s description",
];
