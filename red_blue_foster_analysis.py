"""
Foster-care rate × state partisan lean.

Rate per 1,000 children in foster care: KIDS COUNT / AFCARS 2021 (the KVC PDF's
state ranking).  2021 is the last year the Annie E. Casey Foundation published
the 50-state rate table used in the KVC extract cited in our sources; state-
level rates for 2023 are still in the KIDS COUNT data center but only the West
Virginia / national summary values were available in the web extract, so we
use the full 2021 table to preserve a complete 50-state comparison.

Partisan lean: 2024 Cook PVI as compiled by World Population Review
(https://worldpopulationreview.com/state-rankings/red-states).  Negative =
Democratic lean (D+), positive = Republican lean (R+).
"""
import statistics

# state: (foster-care rate per 1,000 kids, 2021 KIDS COUNT), (Cook PVI 2024)
# Source: KIDS COUNT / AFCARS 2021 table (KVC Health Systems PDF)
# Source: Cook PVI 2024 (World Population Review, 270toWin)
DATA = {
    # state                rate   pvi
    "Alabama":            (4.1,  +15),
    "Alaska":             (13.9, +6),
    "Arizona":            (7.8,  +2),
    "Arkansas":           (5.5,  +15),
    "California":         (4.7,  -12),
    "Colorado":           (2.9,  -6),
    "Connecticut":        (3.9,  -8),
    "Delaware":           (1.8,  -8),
    "Florida":            (4.7,  +5),
    "Georgia":            (3.5,  +1),
    "Hawaii":             (4.1,  -13),
    "Idaho":              (3.0,  +18),
    "Illinois":           (6.4,  -6),
    "Indiana":            (7.1,  +9),
    "Iowa":               (4.7,  +6),
    "Kansas":             (8.6,  +8),
    "Kentucky":           (7.0,  +15),
    "Louisiana":          (2.6,  +11),
    "Maine":              (7.4,  -4),
    "Maryland":           (2.3,  -15),
    "Massachusetts":      (5.5,  -14),
    "Michigan":           (3.7,  0),
    "Minnesota":          (4.5,  -3),
    "Mississippi":        (4.4,  +11),
    "Missouri":           (8.2,  +9),
    "Montana":            (11.2, +10),
    "Nebraska":           (6.8,  +10),
    "Nevada":             (5.2,  +1),
    "New Hampshire":      (3.5,  -2),
    "New Jersey":         (1.4,  -4),
    "New Mexico":         (3.3,  -4),
    "New York":           (3.0,  -8),
    "North Carolina":     (4.1,  +1),
    "North Dakota":       (6.9,  +18),
    "Ohio":               (5.0,  +5),
    "Oklahoma":           (6.7,  +17),
    "Oregon":             (5.2,  -8),
    "Pennsylvania":       (4.3,  +1),
    "Rhode Island":       (7.0,  -8),
    "South Carolina":     (3.0,  +8),
    "South Dakota":       (6.4,  +15),
    "Tennessee":          (5.1,  +14),
    "Texas":              (3.2,  +6),
    "Utah":               (1.9,  +11),
    "Vermont":            (7.1,  -17),
    "Virginia":           (2.2,  -3),
    "Washington":         (4.5,  -10),
    "West Virginia":      (16.9, +21),
    "Wisconsin":          (4.5,  0),
    "Wyoming":            (5.4,  +23),
}

rates = [v[0] for v in DATA.values()]
pvis  = [v[1] for v in DATA.values()]

# Pearson r
n = len(DATA)
mr, mp = statistics.mean(rates), statistics.mean(pvis)
cov = sum((r - mr) * (p - mp) for r, p in zip(rates, pvis)) / n
sr = statistics.pstdev(rates)
sp = statistics.pstdev(pvis)
r_pearson = cov / (sr * sp)

# Spearman (rank) for robustness
def rank(xs):
    idx = sorted(range(len(xs)), key=lambda i: xs[i])
    ranks = [0.0] * len(xs)
    i = 0
    while i < len(xs):
        j = i
        while j + 1 < len(xs) and xs[idx[j + 1]] == xs[idx[i]]:
            j += 1
        avg = (i + j) / 2 + 1  # 1-indexed average rank
        for k in range(i, j + 1):
            ranks[idx[k]] = avg
        i = j + 1
    return ranks

rr = rank(rates)
pr = rank(pvis)
mrr, mpr = statistics.mean(rr), statistics.mean(pr)
cov_s = sum((a - mrr) * (b - mpr) for a, b in zip(rr, pr)) / n
sr_r  = statistics.pstdev(rr)
sp_r  = statistics.pstdev(pr)
r_spearman = cov_s / (sr_r * sp_r)

# Group means: red (PVI >= +5), purple (|PVI| < 5), blue (PVI <= -5)
red   = [r for r, p in zip(rates, pvis) if p >=  5]
blue  = [r for r, p in zip(rates, pvis) if p <= -5]
purple= [r for r, p in zip(rates, pvis) if -5 < p < 5]

print(f"n = {n}")
print(f"Mean foster rate per 1,000 kids: {mr:.2f}")
print(f"Mean PVI: {mp:+.2f}")
print()
print(f"Pearson r  (rate × PVI): {r_pearson:+.3f}")
print(f"Spearman ρ (rate × PVI): {r_spearman:+.3f}")
print()
print(f"Red  states (PVI ≥ +5, n={len(red)}):   mean rate = {statistics.mean(red):.2f}  median = {statistics.median(red):.2f}")
print(f"Purple      (|PVI| < 5, n={len(purple)}): mean rate = {statistics.mean(purple):.2f}  median = {statistics.median(purple):.2f}")
print(f"Blue states (PVI ≤ -5, n={len(blue)}):   mean rate = {statistics.mean(blue):.2f}  median = {statistics.median(blue):.2f}")
print()

# Top 10 highest-rate states
sorted_by_rate = sorted(DATA.items(), key=lambda kv: -kv[1][0])
print("Top 10 states by foster-care rate:")
for name, (rate, pvi) in sorted_by_rate[:10]:
    lean = "R" if pvi > 0 else ("D" if pvi < 0 else "Even")
    print(f"  {name:20s} {rate:5.1f} / 1,000   Cook PVI {pvi:+d} ({lean})")
print()

print("Bottom 10 states by foster-care rate:")
for name, (rate, pvi) in sorted_by_rate[-10:]:
    lean = "R" if pvi > 0 else ("D" if pvi < 0 else "Even")
    print(f"  {name:20s} {rate:5.1f} / 1,000   Cook PVI {pvi:+d} ({lean})")
print()

# Outliers: red states with low rates, blue states with high rates
print("Counter-examples — red states with LOW rates (rate < 4, PVI >= +5):")
for name, (rate, pvi) in DATA.items():
    if pvi >= 5 and rate < 4:
        print(f"  {name}: {rate} / 1,000, PVI {pvi:+d}")
print()

print("Counter-examples — blue states with HIGH rates (rate > 5, PVI <= -5):")
for name, (rate, pvi) in DATA.items():
    if pvi <= -5 and rate > 5:
        print(f"  {name}: {rate} / 1,000, PVI {pvi:+d}")
