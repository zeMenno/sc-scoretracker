## 1. Dark Stage Layout

- [x] 1.1 Update `app/reveal/manual/layout.tsx` to black fullscreen background (match `/reveal`)
- [x] 1.2 Import `reveal.css` in the manual reveal client root; remove `manual-reveal.css`

## 2. Shared Card Leaderboard

- [x] 2.1 Replace `ManualRevealList` with a leaderboard using `RevealLeaderboard` / `RevealCard` (all cards pre-rendered, initially hidden)
- [x] 2.2 Wire card refs so each rank maps to the correct stack index (`teams.length - rank`)

## 3. Step Animation Helpers

- [x] 3.1 Add `lib/reveal/manualRevealStep.ts` with `animateCardReveal` (card entrance, glow, score count-up, particle burst)
- [x] 3.2 Add `animateWinnerGlow` using #1 team color (opacity + scale, no camera/shake/confetti)

## 4. Manual Reveal Experience

- [x] 4.1 Refactor `ManualWhiteReveal` → `ManualRevealExperience` with `reveal-root`, `RevealBackground`, particle container, and winner-glow layer
- [x] 4.2 On spacebar advance, animate newly revealed card(s); block input while animation is in-flight
- [x] 4.3 On final step (#1 revealed), trigger winner screen glow in `teams[0].color` plus larger particle burst for #1
- [x] 4.4 Keep existing reveal order (#N upward, #2+#1 combined on penultimate press) and "Press Space to reveal" hint

## 5. Cleanup and Verification

- [x] 5.1 Delete unused `ManualRevealList.tsx` and `manual-reveal.css` if fully replaced
- [x] 5.2 Confirm `/reveal` cinematic page is unchanged
- [x] 5.3 Manual test: 8-team spacebar sequence, particles per step, winner glow matches #1 color
- [x] 5.4 Run `npm run build` and fix any TypeScript errors
