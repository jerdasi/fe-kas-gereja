// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'quotes': ['error', 'double'],
      '@typescript-eslint/quotes': ['error', 'double']
    }
  }
)
