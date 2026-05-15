// mobile/src/styles/global.js
// Global shared stylesheet tokens

import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

export const globalStyles = StyleSheet.create({
  // ── Containers ──────────────────────────────────────────────────────────────
  screen: { flex: 1, backgroundColor: COLORS.bgDark },
  screenContent: { flex: 1, padding: 20, paddingTop: 56, paddingBottom: 100 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  // ── Cards ───────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardLarge: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // ── Text ────────────────────────────────────────────────────────────────────
  pageTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  bodyText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  caption: { fontSize: 12, color: COLORS.textMuted },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
  errorText: { fontSize: 12, color: COLORS.danger, marginTop: 4 },

  // ── Inputs ──────────────────────────────────────────────────────────────────
  input: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputError: { borderColor: COLORS.danger },

  // ── Buttons ─────────────────────────────────────────────────────────────────
  btnPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  btnPrimaryText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  btnSecondary: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnSecondaryText: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  btnDanger: { backgroundColor: COLORS.danger, borderRadius: 14, padding: 16, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },

  // ── Navigation ──────────────────────────────────────────────────────────────
  backBtn: {
    width: 40, height: 40,
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // ── Badges ──────────────────────────────────────────────────────────────────
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgePrimary: { backgroundColor: COLORS.primaryBg },
  badgeSuccess: { backgroundColor: COLORS.successBg },
  badgeDanger: { backgroundColor: COLORS.dangerBg },
  badgeWarning: { backgroundColor: COLORS.warningBg },

  // ── Separators ──────────────────────────────────────────────────────────────
  separator: { height: 1, backgroundColor: COLORS.border },
  spacer8: { height: 8 },
  spacer16: { height: 16 },
  spacer24: { height: 24 },
});
