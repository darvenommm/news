export const USERNAME_CONSTRAINTS = {
  minLength: 6,
  maxLength: 32,

  getPattern(): RegExp {
    return new RegExp(`[a-zA-Z_]{1}[a-zA-Z0-9_]{${this.minLength - 1},${this.maxLength - 1}}`);
  },

  getBeautifulPatternView(): string {
    return this.getPattern().toString().replaceAll('/', '');
  },
} as const;

export const PASSWORD_CONSTRAINTS = {
  minLength: 6,
  maxLength: 32,
} as const;
