import { FeedSection } from './FeedSection';

/** The Solution experience — the call to action. A hero section that
 *  names what the whole site has been arguing toward, followed by the
 *  Kids Waiting / State of the System feeds.
 *
 *  The argument behind the argument: you don't owe these children
 *  attention because you're a Christian. You owe them attention because
 *  you — the culture you belong to, the theology you inherited, the
 *  ethical package your tradition either endorsed or failed to oppose —
 *  contributed to the social contagion that took a home from them in
 *  the first place. Standing in the gap isn't charity. It's restitution.
 */
export function SolutionExperience() {
  return (
    <>
      <section className="solution-hero" aria-label="The Solution">
        <div className="solution-rule solution-rule-top" aria-hidden />

        <p className="solution-eyebrow">Part VII · The Solution</p>

        <h1 className="solution-title">Stand in the gap.</h1>

        <p className="solution-lede">
          The argument ends here, and the answer is simple — maybe not
          easy, but simple.
        </p>

        <p className="solution-body">
          <strong>Stand in the gap for these children.</strong> You owe it
          to them, not just because you're a Christian, but because
          you've contributed to the social contagion that took a home
          from them in the first place — the divorces that didn't have
          to happen, the marriages that didn't happen at all, the
          addictions looked away from, the sex severed from covenant and
          children severed from sex, the silence from the pulpit when it
          mattered most. You are downstream of that story and you owe
          its casualties more than a bumper sticker.
        </p>

        <p className="solution-body">
          Somewhere between here and your last Amazon order, there is a
          twelve-year-old girl sleeping in her fourth placement of the
          year. Somewhere there is a sibling group nobody will take
          because keeping them together means three beds instead of
          one. Somewhere there is a teenager aging out in six months
          with no family. They are real. They have names. They live in
          your state, your county, and in many cases a short drive from
          your front door.
        </p>

        <p className="solution-body solution-cta">
          Scroll down. Look them in the face. Then open your spare
          bedroom.
        </p>

        <div className="solution-rule solution-rule-bot" aria-hidden />

        <a className="solution-scroll" href="#solution/feeds">
          <span>The faces. The voices. The system.</span>
          <span className="solution-scroll-arrow" aria-hidden>
            ↓
          </span>
        </a>
      </section>

      <FeedSection selectedFips={null} />
    </>
  );
}
