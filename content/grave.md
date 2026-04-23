# The Grave — Part XI

Content for `src/components/GraveSection.tsx`. Each block below is a
separate editable chunk. The `## blockId` lines must stay intact —
they're the parser's anchors. Everything between them is the content,
and it supports markdown (**bold**, *italic*, `code`, [links](url),
blank-line paragraph breaks).

Data-driven blocks — the six headline stats, the four aging-out-cliff
cards, the Lancet "shadow" list, the Sweden bar chart, the "why they
die" cause cards — live in `GraveSection.tsx` as plain arrays because
they mix numbers with text in a structured way. Don't add prose blocks
here for those; edit them directly in the TSX file.

---

## heroTitle
The final section of the *diagnostic*.

## heroLede
Children who pass through the American foster-care system do not just carry the trauma, the illness, the pipeline, and the abuse.

*They die more. They die earlier. And the gap does not close when they graduate from care.*

Every section before this one asked how we got here. This one is the answer.

## statsHeading
The receipt the American Church has not paid.

## inCareHeading
While they are still in care.

## inCareBody
Over 8.3 million person-years of U.S. foster children tracked from 2003 to 2016, Sakai et al. found a mortality rate of **35.4 per 100,000 person-years** — versus **25.0 per 100,000** in the general child population. Incident rate ratio 1.42. The disparity held across every race category and nearly every age group. For children aged 1–4, the foster-care rate was *nearly double* the general-population rate.

## inCareCalloutBody
Between 2003 and 2016, general-population child mortality fell by 2.5% every year. Foster-care mortality *stayed flat*.

## inCareKicker
The slope of progress bent for everyone except them.

## cliffHeading
The aging-out cliff.

## cliffSub
Turning 18 in foster care is not a graduation. It is an eviction with a candle on it.

## cliffNote
The U.S. Surgeon General lists former foster youth among the populations at highest risk of suicide in America — alongside combat veterans, LGBTQ+ youth, and American Indian / Alaska Native communities.

## shadowHeading
The shadow that doesn't lift.

## shadowBody
The 2022 *Lancet Public Health* meta-analysis pooled 14 prospective cohorts across the U.S., U.K., Sweden, Finland, Canada, and Australia — **3,223,580 individuals** tracked into adulthood.

## shadowQuoteBody
"Child protection systems, social policy, and health services following care graduation are insufficient to mitigate the adverse experiences that might have preceded placement into care and those that might accompany it."

## shadowQuoteCite
Batty et al., *Lancet Public Health* (2022)

## shadowKicker
We pull these children out of harm — and the harm still kills them twenty, thirty, forty years later.

## swedenHeading
The experiment the U.S. system does not cite.

## swedenSub
Sweden keeps population-wide registers. A 2025 study of **21,000 child-welfare cases** compared children removed to foster care against children with *comparable maltreatment history* who were left at home.

## swedenNote
The author's own framing: the gap is driven by suicides that occur *while the removed children are still placed in out-of-home care*. There is a sharp, persistent increase in suicide risk beginning within nine months of the court's decision.

This does not mean foster care is always the wrong answer. It means the American default assumption — *we rescued them; the rest is gravy* — is not supported by the mortality data.

## causesHeading
Why they die.

## causesKicker
The three leading causes of early death among American foster alumni are the three leading causes of early death among combat veterans: **suicide, overdose, and cardiovascular collapse.**

Different trauma. Same body reading the same bill.

## tollHeading
One number.

## tollFigure
Hundreds of thousands.

## tollFrame
American children and foster alumni have died over the last four decades who would still be alive if they had had a home.

## tollMiseryIntro
And they did not just die.

## tollMiseryBody
They were abused in care at four times the general-population rate. They cycled through placements, were medicated into obesity, and carried PTSD at twice the rate of combat veterans. Half of them considered suicide before they could vote.

## tollMiseryKicker
A miserable existence, and then an early grave — and in every case, a good Christian home would have prevented both.

## indictmentLine1
329,000 children are in foster care tonight.

## indictmentLine2
Hundreds of thousands of the ones who came before them died because no one opened a door.

## indictmentQuestion
Why fight so hard for the unborn —
only to abandon the born?
