// Prayers for meditation at the close of each essay section.

export interface Prayer {
  /** Matches the essay section id (mirror, cradle, convergence, ...) */
  id: string;
  /** One-line theme — used as the eyebrow above the title. */
  theme: string;
  /** Prayer's given title. */
  title: string;
  /** Prayer body. Double-newline separates paragraphs. */
  body: string;
}

export const PRAYERS: Record<string, Prayer> = {
  mirror: {
    id: 'mirror',
    theme: 'For the gap between the creed and the life',
    title: 'Act of Contrition Inspired by the Gospels',
    body: `Lord, I have sinned against you.

I have not loved you with my whole heart, I have not loved my neighbor as myself. I have said "Lord, Lord," and not done what you said. I have called myself yours while living as if I were my own.

Forgive me, Father. Let your Word judge me before the world does. Give me a heart that does not only confess the faith but obeys it, a mind renewed, a life that matches the creed I recite.

Through Christ our Lord. Amen.`,
  },

  cradle: {
    id: 'cradle',
    theme: 'For the unborn, the newborn, and the orphaned',
    title: 'A Prayer for Children',
    body: `Lord Jesus, you who faithfully visit the Church and the history of mankind — source and lover of Life — we adore and bless you.

Reawaken in us respect for every unborn life. Make us capable of seeing in the fruit of the maternal womb the miraculous work of the Creator. Open our hearts to generously welcoming every child that comes into life.

Bless all families, sanctify the union of spouses, render fruitful their love. Console the married couples who suffer because they are unable to have children, and in your goodness, provide for them.

Teach us all to care for orphaned and abandoned children, so they may experience the warmth of your Charity, the consolation of your divine Heart. Amen.`,
  },

  convergence: {
    id: 'convergence',
    theme: 'For the revolution we welcomed inside the sanctuary',
    title: 'Act of Contrition Inspired by Psalm 51',
    body: `Have mercy on me, O God, in your goodness; in your abundant compassion, blot out my offenses.

Wash me thoroughly from my guilt, and cleanse me from my sin.

A clean heart create for me, O God; renew within me a steadfast spirit.

Cast me not out from your presence, and take not your Holy Spirit from me.

Restore to me the joy of your salvation, and sustain in me a willing spirit. Then I will teach transgressors your ways, and sinners shall return to you. Amen.`,
  },

  timeline: {
    id: 'timeline',
    theme: 'For four hundred years of speaking, shrugging, and silence',
    title: 'A Prayer for Repentance and Renewal',
    body: `Most merciful God, we confess that we have sinned against you in thought, word, and deed, by what we have done and by what we have left undone.

We have not loved you with our whole heart; we have not loved our neighbors as ourselves.

We are truly sorry, and we humbly repent. For the sake of your Son Jesus Christ, have mercy on us and forgive us, that we may delight in your will and walk in your ways, to the glory of your Name.

Renew your Church, O Lord, beginning with me. Amen.`,
  },

  substitution: {
    id: 'substitution',
    theme: 'For what the American Church built instead of the table',
    title: 'Prayer of the Prodigal Son',
    body: `Father, I have sinned against heaven and against you. I am no longer worthy to be called your son.

I took the inheritance you gave me — the gospel, the Spirit, the mandate to care for the widow and the orphan — and I spent it on myself. I built what I wanted to build. I fed what I wanted to feed. I left the children on your doorstep and called it someone else's job.

I come home now, not asking for what I deserve, but for mercy.

Put the ring of sonship back on my hand, not so I can boast of it, but so I can carry water, set the table, open the door for the next child you send.

Through Jesus Christ, our Lord. Amen.`,
  },

  pipeline: {
    id: 'pipeline',
    theme: 'For the children the system walks toward prison',
    title: 'Prisons Week Prayer',
    body: `Lord, you offer freedom to all people.

We pray for those in prison. Break the bonds of fear and isolation that exist. Support with your love prisoners and their families and friends, prison staff and all who care.

Heal those who have been wounded by the actions of others, especially the victims of crime.

Help us to forgive one another, to act justly, love mercy and walk humbly together with Christ in his strength and in his Spirit, now and every day. Amen.`,
  },

  wound: {
    id: 'wound',
    theme: 'For the child whose foster father has a key to her room',
    title: 'Prayer for Healing Victims of Abuse',
    body: `God of endless love, ever caring, ever strong, always present, always just — you gave your only Son to save us by the blood of his cross.

Gentle Jesus, shepherd of peace, join to your own suffering the pain of all who have been hurt in body, mind, and spirit by those who betrayed the trust placed in them. Hear the cries of our brothers and sisters who have been gravely harmed, and the cries of those who love them.

Soothe their restless hearts with hope, steady their shaken spirits with faith. Grant them justice for their cause, enlightened by your truth.

Holy Spirit, comforter of hearts, heal your people's wounds and transform brokenness into wholeness. Grant us the courage and wisdom, humility and grace, to act with justice.

We ask this through Christ, our Lord. Amen.`,
  },

  score: {
    id: 'score',
    theme: 'For the bodies that carry the bill',
    title: 'Prayer for Healing of Body and Soul',
    body: `Lord Jesus Christ, by your five wounds, which you bore for us on the cross, have mercy on these your sick servants.

Heal them of all bodily illness, and cleanse them of all sin and spiritual infirmity.

Restore them to full health, that they may serve you with a grateful heart — and where healing in this life does not come, grant them your peace, your presence, and the sure hope of the resurrection, when every tear will be wiped away and the old order of things — sickness, suffering, and death — will pass away.

Through Christ our Lord. Amen.`,
  },

  receipt: {
    id: 'receipt',
    theme: 'For the map that does not match the creed',
    title: 'A Prayer for Our Cities, Counties, and States',
    body: `Lord of every land and every family, you set the borders of the nations and you number the hairs of every child.

We confess that we have drawn lines on maps and imagined they reflect your heart. We have called our side righteous and the other side lost, while children on both sides of every line have slept tonight without a parent.

Forgive us for arguing about the color of the state when the children in it are without a home.

Give us eyes to see what the data sees, and then eyes to see past it — to the particular child, on the particular street, in the particular county, whose life our abstractions overlook.

Make your Church the body that shows up in both red counties and blue ones, in opioid hollows and commuter suburbs, in Appalachian trailers and New Jersey apartments.

Through Christ our Lord, who crossed every boundary to reach us. Amen.`,
  },

  grave: {
    id: 'grave',
    theme: 'For those who did not make it',
    title: 'A Prayer for Those Who Did Not Make It',
    body: `Lord of life and Lord of the grave —

we confess to you the children whose names we never learned. The ones who were born into harm, taken into state care, and did not live to adulthood. The ones who died before their first birthday, and the ones who took their own lives before their twentieth. The ones who overdosed at twenty-two, who were buried by caseworkers because their families could not be found, who slept their last night in a placement to which you had called one of your churches — and no one went.

You number every hair and every sparrow, and you did not lose count of them.

Receive them, Lord, into the rest they never had on earth. Let the arms that held them in the last moment be yours, even if no human arms were there. Where justice for them is still possible, raise it up. Where it is no longer possible, let your own judgment be their defense.

And for us who are still alive and still have time — do not let us sit through one more sermon about the family without remembering the children who had none. Break our hearts over the bodies your Church did not bury, so that we will fight to keep the next ones alive. Send us — not tomorrow, not when the building campaign ends, not when the schedule clears — but now, to the ones who are still with us.

Through Jesus Christ, who was himself born into danger, fled into exile as a child, and is called in Hebrews 4:15 a high priest able to sympathize with every weakness. Amen.`,
  },
};
