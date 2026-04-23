// Prayers for meditation at the close of each essay section.

export interface Prayer {
  /** Matches the essay section id (mirror, cradle, convergence, ...) */
  id: string;
  /** One-line theme — used as the eyebrow above the title. */
  theme: string;
  /** Prayer's given title. */
  title: string;
  /** Prayer body. Double-newline separates paragraphs; single newline
   *  preserves a verse-style line break within a paragraph. */
  body: string;
}

export const PRAYERS: Record<string, Prayer> = {
  mirror: {
    id: 'mirror',
    theme: 'For the gap between the creed and the life',
    title: 'An Act of Contrition Inspired by the Gospels',
    body: `Lord Jesus, you opened the eyes of the blind, healed the sick, forgave the sinful woman, and after Peter's denial confirmed him in your love.

Listen to my prayer: forgive all my sins, renew your love in my heart, help me to live in perfect unity with my fellow Christians that I may proclaim your saving power to all the world. Amen.`,
  },

  cradle: {
    id: 'cradle',
    theme: 'For the unborn, the newborn, and the orphaned',
    title: 'Prayer for Children',
    body: `Lord Jesus, you who faithfully visit and fulfill with your Presence the Church and the history of mankind; you who in the miraculous Sacrament of your Body and Blood render us participants in divine Life and allow us a foretaste of the joy of eternal Life; we adore and bless you. Prostrated before you, source and lover of Life, truly present and alive among us, we beg you: reawaken in us respect for every unborn life, make us capable of seeing in the fruit of the maternal womb the miraculous work of the Creator, open our hearts to generously welcoming every child that comes into life. Bless all families, sanctify the union of spouses, render fruitful their love. Accompany the choices of legislative assemblies with the light of your Spirit, so that peoples and nations may recognize and respect the sacred nature of life, of every human life. Guide the work of scientists and doctors, so that all progress contributes to the integral well-being of the person, and no one endures suppression or injustice. Give creative charity to administrators and economists, so they may intuit and promote sufficient conditions so that young families can serenely embrace the birth of new children. Console the married couples who suffer because they are unable to have children and, in your goodness, provide for them. Teach us all to care for orphaned or abandoned children, so they may experience the warmth of your Charity, the consolation of your divine Heart. Amen.`,
  },

  convergence: {
    id: 'convergence',
    theme: 'For the revolution we welcomed inside the sanctuary',
    title: 'Act of Contrition Inspired by Psalm 51',
    body: `Have mercy on me, O God, in your goodness; in your abundant compassion, blot out my offenses. Wash me thoroughly from my guilt, and cleanse me from my sin. A clean heart create for me, O God; renew within me a steadfast spirit. Cast me not out from your presence, and take not your holy Spirit from me. Restore to me the joy of your salvation, and sustain in me a willing spirit. Then I will teach transgressors your ways, and sinners shall return to you. Amen.`,
  },

  timeline: {
    id: 'timeline',
    theme: 'For four hundred years of speaking, shrugging, and silence',
    title: 'Prayer for Repentance and Renewal of the Soul',
    body: `"Be transformed by the renewal of your mind." — Romans 12:2

Lord God, my soul longs for renewal. I am tired of sin and spiritual dryness. I ask You to renew my mind, my heart, and my spirit. Wash away everything that does not belong to You. Fill me again with Your peace and joy. Restore my love for prayer and my desire for holiness. Make me new in Christ and help me live according to Your will each day. I surrender my life to Your transforming grace. Amen.`,
  },

  substitution: {
    id: 'substitution',
    theme: 'For what the American Church built instead of the table',
    title: 'An Act of Contrition Inspired by the Gospels',
    body: `Father of mercy, like the prodigal son I return to you and say: "I have sinned against you and am no longer worthy to be called your child."

Christ Jesus, Savior of the world, I pray with the repentant thief to whom you promised Paradise: "Lord, remember me in your kingdom."

Holy Spirit, fountain of love, I call on you with trust: "Purify my heart, and help me to walk as a child of light." Amen.`,
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
    body: `God of endless love, ever caring, ever strong, always present, always just: You gave your only Son to save us by the blood of his cross.

Gentle Jesus, shepherd of peace, join to your own suffering the pain of all who have been hurt in body, mind, and spirit by those who betrayed the trust placed in them. Hear the cries of our brothers and sisters who have been gravely harmed, and the cries of those who love them.

Soothe their restless hearts with hope, steady their shaken spirits with faith. Grant them justice for their cause, enlightened by your truth.

Holy Spirit, comforter of hearts, heal your people's wounds and transform brokenness into wholeness. Grant us the courage and wisdom, humility and grace, to act with justice. Breathe wisdom into our prayers and labors. Grant that all harmed by abuse may find peace in justice.

We ask this through Christ, our Lord. Amen.`,
  },

  score: {
    id: 'score',
    theme: 'For the bodies that carry the bill',
    title: 'Prayer for Healing of Body and Soul',
    body: `Lord Jesus Christ, by your five wounds, which you bore for us on the cross, have mercy on this sick servant, heal him/her of all bodily illness, and cleanse him/her of all sin and spiritual infirmity. Restore him/her to full health, that he/her may serve you with a grateful heart. Amen.`,
  },

  receipt: {
    id: 'receipt',
    theme: 'For the map that does not match the creed',
    title: 'Prayer for Our Country',
    body: `Almighty God,
bless our nation
and make it true
to the ideas of freedom and justice
and brotherhood for all who make it great.

Guard us from war,
from fire and wind,
from compromise, fear, confusion.

Be close to our president and our statesmen;
give them vision and courage,
as they ponder decisions affecting peace
and the future of the world.

Make me more deeply aware of my heritage;
realizing not only my rights
but also my duties
and responsibilities as a citizen.

Make this great land
and all its people
know clearly Your will,
that they may fulfill
the destiny ordained for us
in the salvation of the nations,
and the restoring of all things in Christ. Amen.`,
  },

  grave: {
    id: 'grave',
    theme: 'For those who did not make it',
    title: 'Prayer for the Dead',
    body: `In your hands, O Lord,
we humbly entrust our brothers and sisters.
In this life you embraced them with your tender love;
deliver them now from every evil
and bid them eternal rest.

The old order has passed away:
welcome them into paradise,
where there will be no sorrow, no weeping or pain,
but fullness of peace and joy
with your Son and the Holy Spirit
forever and ever. Amen.`,
  },

  graveDepths: {
    id: 'graveDepths',
    theme: 'Out of the depths',
    title: 'Psalm 130 — De Profundis',
    body: `Out of the depths I call to you, LORD;
Lord, hear my cry!
May your ears be attentive
to my cry for mercy.

If you, LORD, keep account of sins,
Lord, who can stand?
But with you is forgiveness
and so you are revered.

I wait for the LORD,
my soul waits
and I hope for his word.
My soul looks for the Lord
more than sentinels for daybreak.
More than sentinels for daybreak,
let Israel hope in the LORD,
For with the LORD is mercy,
with him is plenteous redemption.

And he will redeem Israel
from all its sins.`,
  },
};
