// Scripture epigraphs that open each essay section.
//
// Each verse is paired with the section it frames thematically so
// that Scripture opens the argument and a prayer closes it — the
// polemic lives between two acts of faith. Translation is ESV-style
// for consistency but any standard translation works; the idea is
// the verse, not a particular publisher.

export interface Epigraph {
  /** Matches the essay section id (mirror, cradle, convergence, ...). */
  id: string;
  /** The verse text. */
  verse: string;
  /** Canonical reference. */
  reference: string;
}

export const EPIGRAPHS: Record<string, Epigraph> = {
  mirror: {
    id: 'mirror',
    verse:
      'But be doers of the word, and not hearers only, deceiving yourselves.',
    reference: 'James 1:22',
  },
  cradle: {
    id: 'cradle',
    verse:
      'Behold, children are a heritage from the Lord, the fruit of the womb a reward. Blessed is the man who fills his quiver with them.',
    reference: 'Psalm 127:3, 5',
  },
  convergence: {
    id: 'convergence',
    verse: 'For they sow the wind, and they shall reap the whirlwind.',
    reference: 'Hosea 8:7',
  },
  timeline: {
    id: 'timeline',
    verse:
      'Write the vision; make it plain on tablets, that he who runs may read it.',
    reference: 'Habakkuk 2:2',
  },
  substitution: {
    id: 'substitution',
    verse:
      'You tithe mint and dill and cumin, and have neglected the weightier matters of the law: justice and mercy and faithfulness. These you ought to have done, without neglecting the others.',
    reference: 'Matthew 23:23',
  },
  pipeline: {
    id: 'pipeline',
    verse:
      'The Spirit of the Lord God is upon me, because the Lord has anointed me to bring good news to the poor; he has sent me to bind up the brokenhearted, to proclaim liberty to the captives, and the opening of the prison to those who are bound.',
    reference: 'Isaiah 61:1',
  },
  wound: {
    id: 'wound',
    verse:
      'The Lord is near to the brokenhearted and saves the crushed in spirit.',
    reference: 'Psalm 34:18',
  },
  score: {
    id: 'score',
    verse:
      'Bless the Lord, O my soul, and forget not all his benefits — who forgives all your iniquity, who heals all your diseases, who redeems your life from the pit.',
    reference: 'Psalm 103:2–4',
  },
  receipt: {
    id: 'receipt',
    verse:
      'I hate, I despise your feasts, and I take no delight in your solemn assemblies … But let justice roll down like waters, and righteousness like an ever-flowing stream.',
    reference: 'Amos 5:21, 24',
  },
  grave: {
    id: 'grave',
    verse: 'Jesus wept.',
    reference: 'John 11:35',
  },
};
