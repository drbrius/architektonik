import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),

  // Frontend-Code (läuft im Browser)
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Die Demo-Datenschicht arbeitet bewusst mit einem gemeinsamen, veränderbaren
      // Objekt (MEM) und löst Neu-Rendering über einen Zähler aus. Das ist für die
      // Vorführ-Version korrekt und wird in der Ausbaustufe durch Supabase ersetzt
      // (siehe Anleitung, Etappe D). Diese Regeln würden hier nur Fehlalarme erzeugen:
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
    },
  },

  // Server-Code (läuft auf Vercel, in Node — hier existiert z.B. "process")
  {
    files: ['api/**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },
])
