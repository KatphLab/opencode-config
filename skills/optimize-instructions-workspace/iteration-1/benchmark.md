# Benchmark: optimize-instructions

- All assertions are preservation checks; they verify that optimization did not drop required behavior.
- Timing/token data from subagent notifications was not available in this harness, so benchmark timing is recorded as 0 and token proxy uses output character count.
- Several assertions pass in both configurations, so human review should focus on whether the with-skill outputs are clearer and less overfit than baseline.
