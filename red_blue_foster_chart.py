import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

# same dataset
DATA = {
    "Alabama":(4.1,15),"Alaska":(13.9,6),"Arizona":(7.8,2),"Arkansas":(5.5,15),
    "California":(4.7,-12),"Colorado":(2.9,-6),"Connecticut":(3.9,-8),
    "Delaware":(1.8,-8),"Florida":(4.7,5),"Georgia":(3.5,1),"Hawaii":(4.1,-13),
    "Idaho":(3.0,18),"Illinois":(6.4,-6),"Indiana":(7.1,9),"Iowa":(4.7,6),
    "Kansas":(8.6,8),"Kentucky":(7.0,15),"Louisiana":(2.6,11),"Maine":(7.4,-4),
    "Maryland":(2.3,-15),"Massachusetts":(5.5,-14),"Michigan":(3.7,0),
    "Minnesota":(4.5,-3),"Mississippi":(4.4,11),"Missouri":(8.2,9),
    "Montana":(11.2,10),"Nebraska":(6.8,10),"Nevada":(5.2,1),
    "New Hampshire":(3.5,-2),"New Jersey":(1.4,-4),"New Mexico":(3.3,-4),
    "New York":(3.0,-8),"North Carolina":(4.1,1),"North Dakota":(6.9,18),
    "Ohio":(5.0,5),"Oklahoma":(6.7,17),"Oregon":(5.2,-8),"Pennsylvania":(4.3,1),
    "Rhode Island":(7.0,-8),"South Carolina":(3.0,8),"South Dakota":(6.4,15),
    "Tennessee":(5.1,14),"Texas":(3.2,6),"Utah":(1.9,11),"Vermont":(7.1,-17),
    "Virginia":(2.2,-3),"Washington":(4.5,-10),"West Virginia":(16.9,21),
    "Wisconsin":(4.5,0),"Wyoming":(5.4,23),
}

fig, ax = plt.subplots(figsize=(11, 7.5), dpi=150)

for name, (rate, pvi) in DATA.items():
    if pvi >= 5:
        color = "#c0392b"
    elif pvi <= -5:
        color = "#2c5aa0"
    else:
        color = "#8e44ad"
    ax.scatter(pvi, rate, s=60, c=color, alpha=0.85, edgecolor="white", linewidth=0.8, zorder=3)
    # label outliers and extremes only to keep chart clean
    if rate > 7 or rate < 2.5 or name in ("Utah", "New Jersey", "West Virginia", "Alaska", "Vermont", "Montana"):
        ax.annotate(name, (pvi, rate), fontsize=7.5, xytext=(4, 3), textcoords="offset points", color="#2b2b2b")

# best-fit line
import statistics
rates = [v[0] for v in DATA.values()]
pvis  = [v[1] for v in DATA.values()]
n = len(rates)
mr, mp = statistics.mean(rates), statistics.mean(pvis)
slope = sum((r-mr)*(p-mp) for r,p in zip(rates,pvis)) / sum((p-mp)**2 for p in pvis)
intercept = mr - slope*mp
xs = [min(pvis)-2, max(pvis)+2]
ys = [slope*x + intercept for x in xs]
ax.plot(xs, ys, color="#333", linestyle="--", linewidth=1.3, alpha=0.7, zorder=2, label=f"Best fit (slope={slope:+.3f})")

ax.axvline(0, color="#bbb", linewidth=0.8, zorder=1)

ax.set_xlabel("Cook PVI 2024  (← Democratic lean    |    Republican lean →)", fontsize=10)
ax.set_ylabel("Children in foster care, per 1,000 under age 18  (KIDS COUNT 2021)", fontsize=10)
ax.set_title("Foster-care rate × state partisan lean\nPearson r = +0.33   ·   Red-state mean 6.35 vs. Blue-state mean 4.49 per 1,000", fontsize=12, pad=14)

red_patch   = mpatches.Patch(color="#c0392b", label="Red (PVI ≥ +5)")
purple_patch= mpatches.Patch(color="#8e44ad", label="Purple (|PVI| < 5)")
blue_patch  = mpatches.Patch(color="#2c5aa0", label="Blue (PVI ≤ −5)")
ax.legend(handles=[red_patch, purple_patch, blue_patch], loc="upper left", fontsize=9, framealpha=0.92)

ax.grid(True, alpha=0.25, zorder=0)
ax.set_axisbelow(True)

plt.tight_layout()
plt.savefig("/home/user/workspace/red_blue_foster_scatter.png", dpi=180, bbox_inches="tight")
print("Saved.")
