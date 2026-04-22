/** Full citations for every dataset and claim on the site.
 *  Rendered at the bottom of every non-landing mode so nothing is
 *  hidden — every chart, every choropleth, every "the map matches"
 *  sentence has a line of provenance here.
 */
export function Sources() {
  return (
    <section className="sources" aria-label="Sources">
      <header className="sources-header">
        <h2 className="sources-title">Sources</h2>
        <p className="sources-lede">
          Every claim on this site draws from a public dataset or a peer-published
          report. The raw data lives below, with direct links. Where values are
          modeled or approximated, we say so.
        </p>
      </header>

      <div className="sources-grid">
        <section className="source-group">
          <h3>Foster care &amp; adoption</h3>
          <ul>
            <li>
              <strong>AFCARS Report #30 (FY2023)</strong> — U.S. Dept. of Health
              &amp; Human Services, Children's Bureau. Point-in-time census of
              368,530 children in care; 70,418 waiting for adoption; 34,817
              legally free; roughly 700,000 who passed through the system
              during the year. Also the source for the per-state
              &ldquo;Clinically Diagnosed Disability Condition&rdquo; counts. State
              reporting of that field is uneven.{' '}
              <a
                href="https://www.acf.hhs.gov/cb/data-research/adoption-fostercare"
                target="_blank"
                rel="noopener noreferrer"
              >
                acf.hhs.gov/cb/data-research
              </a>
            </li>
            <li>
              <strong>HHS ASPE — Children with Disabilities in Foster Care</strong>.
              Source for the &ldquo;24&ndash;44% of foster children have special
              health-care needs&rdquo; range cited in the Mirror.{' '}
              <a
                href="https://aspe.hhs.gov/topics/children-families"
                target="_blank"
                rel="noopener noreferrer"
              >
                aspe.hhs.gov
              </a>
            </li>
            <li>
              <strong>The Imprint 2024 Foster Home Survey</strong>. Source for the
              drop from ~220,000 licensed foster homes to 195,404 in four years,
              and the &ldquo;48 states lost a quarter of their group-care providers&rdquo;
              figure.{' '}
              <a
                href="https://imprintnews.org/youth-services-insider/fewer-foster-youth-homes-2023-imprint-survey-finds/"
                target="_blank"
                rel="noopener noreferrer"
              >
                imprintnews.org
              </a>
            </li>
            <li>
              <strong>NCMEC 2024 Impact Report</strong>. 23,160 children reported
              missing from foster care in 2024. Source for the &ldquo;86% of
              trafficking victims reported to NCMEC were in the child welfare
              system&rdquo; statistic.{' '}
              <a
                href="https://www.missingkids.org/footer/about/annual-report"
                target="_blank"
                rel="noopener noreferrer"
              >
                missingkids.org
              </a>
            </li>
            <li>
              <strong>FBI Operation Cross Country</strong>. Multi-city trafficking
              recovery operations; source for &ldquo;six of every ten children
              recovered came from foster or group homes.&rdquo;{' '}
              <a
                href="https://www.fbi.gov/news/press-releases"
                target="_blank"
                rel="noopener noreferrer"
              >
                fbi.gov/news
              </a>
            </li>
          </ul>
        </section>

        <section className="source-group">
          <h3>The foster-to-crime pipeline</h3>
          <ul>
            <li>
              <strong>Bald, Chyn, Humlum &amp; Stephenson (2022)</strong> — NBER
              working paper / CEPR summary. Source for the "~1 in 5 U.S.
              prison inmates is a former foster child" headline and for the
              causal finding that, for the marginal child, foster placement
              reduces arrest / conviction / incarceration vs. being left
              home.{' '}
              <a
                href="https://cepr.org/voxeu/columns/foster-care-prison-pipeline"
                target="_blank"
                rel="noopener noreferrer"
              >
                cepr.org/voxeu
              </a>
            </li>
            <li>
              <strong>Chapin Hall Midwest Evaluation of the Adult Functioning
              of Former Foster Youth</strong> (University of Chicago). 732 youth
              followed from age 17 to 26 across IL, IA, WI. Source for the
              "70% arrested by 26" / "~81% of males" figure, the 7%
              currently-incarcerated-at-interview number, and the 55% pregnant
              by 19 / 71% by 21 figures.{' '}
              <a
                href="https://ocfcpacourts.us/wp-content/uploads/2020/06/Midwest_Evaluation_of_the_Adult_Functioning_001015.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Midwest Study PDF
              </a>
            </li>
            <li>
              <strong>Foster care, permanency, and risk of prison entry</strong>
              — Journal of Research in Crime and Delinquency (NIH PMC).
              Prospective study of WA foster youth. Source for the prison-entry
              table by exit type (adopted 3.2%, aged out 8.6%, reunified 13.2%,
              runaway 19.1%, juvenile detention 48.2%).{' '}
              <a
                href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8975219/"
                target="_blank"
                rel="noopener noreferrer"
              >
                pmc.ncbi.nlm.nih.gov
              </a>
            </li>
            <li>
              <strong>Children and Youth Services Review (2025)</strong> —
              longitudinal analysis. Source for the "42% lifetime incarceration
              rate by age 20" figure.{' '}
              <a
                href="https://www.sciencedirect.com/science/article/abs/pii/S0145213425002248"
                target="_blank"
                rel="noopener noreferrer"
              >
                sciencedirect.com
              </a>
            </li>
            <li>
              <strong>The Criminal Law Practitioner, American University</strong>
              — &ldquo;The Foster-Care-to-Prison Pipeline: A Road to Incarceration.&rdquo;
              Source for the "5+ placements → 90% criminal-legal involvement"
              finding and the "50%+ juvenile-justice encounter by 17" figure.{' '}
              <a
                href="https://www.crimlawpractitioner.org/post/the-foster-care-to-prison-pipeline-a-road-to-incarceration"
                target="_blank"
                rel="noopener noreferrer"
              >
                crimlawpractitioner.org
              </a>
            </li>
            <li>
              <strong>American Journal of Public Health</strong> (NIH PMC)
              on foster-care homelessness outcomes. Source for the "22–30%
              experience homelessness during transition" and "31–46% homeless
              by 26" figures.{' '}
              <a
                href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3969135/"
                target="_blank"
                rel="noopener noreferrer"
              >
                pmc.ncbi.nlm.nih.gov/AJPH
              </a>
            </li>
            <li>
              <strong>Dworsky &amp; Courtney — Teen pregnancy among young
              women in foster care</strong> (NIH PMC / Guttmacher Institute).
              Source for the "foster females pregnant at 50% vs. 20% general
              population by 19" figure.{' '}
              <a
                href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3902972/"
                target="_blank"
                rel="noopener noreferrer"
              >
                pmc.ncbi.nlm.nih.gov/Dworsky
              </a>
            </li>
            <li>
              <strong>Iowa HHS — Human Trafficking Safety of Children in
              Foster Care</strong>. Source for the "~60% of child
              sex-trafficking victims recovered in 2013 FBI raid came from
              foster care or group homes" figure.{' '}
              <a
                href="https://hhs.iowa.gov/media/6797"
                target="_blank"
                rel="noopener noreferrer"
              >
                hhs.iowa.gov
              </a>
            </li>
            <li>
              <strong>Loyola Children's Legal Rights Journal</strong> on
              child welfare and sex trafficking. Confirms the FBI 60%, NCMEC
              86%, and Connecticut 86-of-88 trafficking-victim figures.{' '}
              <a
                href="https://lawecommons.luc.edu/cgi/viewcontent.cgi?article=1160&context=clrj"
                target="_blank"
                rel="noopener noreferrer"
              >
                lawecommons.luc.edu
              </a>
            </li>
            <li>
              <strong>Annie E. Casey Foundation — Cost Avoidance</strong>.
              Source for the "$250 billion over a decade" taxpayer-cost
              figure and the per-cohort justice-system / lost-earnings /
              teen-parenthood breakdown.{' '}
              <a
                href="https://www.aecf.org/resources/cost-avoidance-the-business-case-for-investing-in-youth-aging-out-of-foster"
                target="_blank"
                rel="noopener noreferrer"
              >
                aecf.org
              </a>
            </li>
            <li>
              <strong>Casey Family Programs (2024)</strong> — pregnant-and-parenting
              foster youth programs. Source for the intergenerational
              foster-removal cycle referenced as &ldquo;continuity of involvement.&rdquo;{' '}
              <a
                href="https://www.casey.org/pregnant-parenting-strategies/"
                target="_blank"
                rel="noopener noreferrer"
              >
                casey.org
              </a>
            </li>
            <li>
              <strong>Alternative Family Services — Foster-Youth
              Homelessness Statistics</strong>. Secondary synthesis used for the
              "29% of unhoused youth have been in foster care" and "75% of
              SF Bay Area unhoused youth came through foster / juvenile
              justice" figures.{' '}
              <a
                href="https://www.afs4kids.org/blog/35-foster-youth-homelessness-statistics-you-should-know/"
                target="_blank"
                rel="noopener noreferrer"
              >
                afs4kids.org
              </a>
            </li>
            <li>
              <strong>The Imprint — decriminalize young people who grew
              up in foster care</strong>. Source for framing context on the
              transition-window arrest / incarceration numbers.{' '}
              <a
                href="https://imprintnews.org/top-stories/decriminalize-young-people-who-grew-up-in-foster-care/246740"
                target="_blank"
                rel="noopener noreferrer"
              >
                imprintnews.org
              </a>
            </li>
          </ul>
        </section>

        <section className="source-group">
          <h3>Poverty, health &amp; substance use</h3>
          <ul>
            <li>
              <strong>U.S. Census SAIPE</strong> (Small Area Income &amp; Poverty
              Estimates). Source for the county-level child-poverty choropleth
              (Chapter IV) and all state poverty figures. Variable
              SAEPOVRT0_17_PT.{' '}
              <a
                href="https://www.census.gov/programs-surveys/saipe.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                census.gov/saipe
              </a>
            </li>
            <li>
              <strong>U.S. Census ACS 5-year</strong>. Source for population
              denominators and disability prevalence (S1810_C03_001E) used in the
              Misery Index composite.{' '}
              <a
                href="https://www.census.gov/programs-surveys/acs"
                target="_blank"
                rel="noopener noreferrer"
              >
                census.gov/acs
              </a>
            </li>
            <li>
              <strong>CDC WONDER</strong> &mdash; multiple cause of death,
              12-mo ending 2024, ICD-10 X40&ndash;X44, X60&ndash;X64, X85,
              Y10&ndash;Y14. Source for state drug-overdose totals and the
              national 107,941 figure.{' '}
              <a
                href="https://wonder.cdc.gov/"
                target="_blank"
                rel="noopener noreferrer"
              >
                wonder.cdc.gov
              </a>
            </li>
            <li>
              <strong>CDC Provisional County-Level Drug Overdose Deaths</strong>.
              Source for the county overdose choropleth (Chapter V).{' '}
              <a
                href="https://www.cdc.gov/nchs/nvss/drug-poisoning-mortality.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                cdc.gov/nchs
              </a>
            </li>
            <li>
              <strong>CDC BRFSS 2022</strong> &mdash; adult obesity prevalence
              (BMI &ge; 30). State-level; Chapter IX choropleth.{' '}
              <a
                href="https://www.cdc.gov/obesity/data/prevalence-maps.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                cdc.gov/obesity
              </a>
            </li>
            <li>
              <strong>CDC NVSS 2022</strong> &mdash; crude divorce rate per
              1,000 population. CA, HI, IN, MN, NM, OK don't report to NVSS;
              those state values are best-available estimates from state vital
              records.{' '}
              <a
                href="https://www.cdc.gov/nchs/nvss/marriage-divorce.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                cdc.gov/nchs/nvss
              </a>
            </li>
            <li>
              <strong>CDC NCHS 2022</strong> &mdash; births to unmarried women by
              state, NVSR 72-1.{' '}
              <a
                href="https://www.cdc.gov/nchs/data/nvsr/nvsr72/nvsr72-01.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                cdc.gov/nchs/nvsr
              </a>
            </li>
            <li>
              <strong>County Health Rankings &amp; Roadmaps</strong>. University
              of Wisconsin Population Health Institute. Source for the
              &ldquo;poor-health days&rdquo; and &ldquo;health outcomes&rdquo; signals
              folded into the Misery Index.{' '}
              <a
                href="https://www.countyhealthrankings.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                countyhealthrankings.org
              </a>
            </li>
            <li>
              <strong>Purdue / Ferraro (2006)</strong> &mdash; &ldquo;Religion
              and Obesity in American Adults.&rdquo; Source for the
              denominational obesity table (Baptists 30%, Jews 1%, Muslims
              0.7%) in Chapter IX.{' '}
              <a
                href="https://journals.sagepub.com/doi/10.1177/002214650604700203"
                target="_blank"
                rel="noopener noreferrer"
              >
                journals.sagepub.com
              </a>
            </li>
          </ul>
        </section>

        <section className="source-group">
          <h3>Religion &amp; culture</h3>
          <ul>
            <li>
              <strong>2020 U.S. Religion Census</strong> &mdash; Christian
              congregations by state, ~380,000 nationally. Source for every
              &ldquo;churches per child&rdquo; and complicity calculation.{' '}
              <a
                href="https://www.usreligioncensus.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                usreligioncensus.org
              </a>
            </li>
            <li>
              <strong>Pew Research Religious Landscape Study</strong>. State-level
              &ldquo;% highly religious&rdquo; (composite of daily prayer, weekly
              attendance, importance of religion, belief in God with absolute
              certainty). Source for the Mirror (Chapter VIII).{' '}
              <a
                href="https://www.pewresearch.org/religion/religious-landscape-study/"
                target="_blank"
                rel="noopener noreferrer"
              >
                pewresearch.org
              </a>
            </li>
            <li>
              <strong>Pornhub Insights &mdash; State of the Union (2014&ndash;2019)</strong>.
              Average session duration by U.S. state. This is the
              authoritative public source for what the data shows because
              Pornhub owns the telemetry. Mississippi ranked #1 every year.{' '}
              <a
                href="https://www.pornhub.com/insights/united-states"
                target="_blank"
                rel="noopener noreferrer"
              >
                pornhub.com/insights
              </a>
            </li>
            <li>
              <strong>Barna Research &mdash; faith and fostering</strong>. Source
              for practicing-Christian adoption / fostering rates cited in the
              Solution chapter.{' '}
              <a
                href="https://www.barna.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                barna.com
              </a>
            </li>
          </ul>
        </section>

        <section className="source-group">
          <h3>Environment</h3>
          <ul>
            <li>
              <strong>EPA EJScreen 2024</strong>. Environmental Justice screening
              tool; source for PM2.5, diesel particulate matter, lead-paint
              share, superfund-proximity, air-toxics cancer risk used in the
              Pollution chapter.{' '}
              <a
                href="https://www.epa.gov/ejscreen"
                target="_blank"
                rel="noopener noreferrer"
              >
                epa.gov/ejscreen
              </a>
            </li>
            <li>
              <strong>EPA AQS annual PM2.5</strong>. Air Quality System
              state-level annual means for fine particulate pollution.{' '}
              <a
                href="https://www.epa.gov/aqs"
                target="_blank"
                rel="noopener noreferrer"
              >
                epa.gov/aqs
              </a>
            </li>
            <li>
              <strong>WHO Air Quality Guidelines (2021)</strong>. 9 µg/m³ annual
              PM2.5 safe-limit reference used in Chapter VI.{' '}
              <a
                href="https://www.who.int/publications/i/item/9789240034228"
                target="_blank"
                rel="noopener noreferrer"
              >
                who.int
              </a>
            </li>
          </ul>
        </section>

        <section className="source-group">
          <h3>Geography &amp; places of worship</h3>
          <ul>
            <li>
              <strong>HIFLD All Places of Worship</strong>. Homeland
              Infrastructure Foundation-Level Data; points for every U.S.
              congregation. Source for the &ldquo;churches are right there&rdquo;
              overlay.{' '}
              <a
                href="https://hifld-geoplatform.hub.arcgis.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                hifld-geoplatform
              </a>
            </li>
            <li>
              <strong>OpenStreetMap / Overpass API</strong>. Supplementary
              church locations where HIFLD is thin. Patched in where coverage
              gaps appear.{' '}
              <a
                href="https://www.openstreetmap.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                openstreetmap.org
              </a>
            </li>
            <li>
              <strong>us-atlas (topojson/us-atlas)</strong>. 10m U.S. state +
              county TopoJSON boundaries. Mike Bostock / Observable.{' '}
              <a
                href="https://github.com/topojson/us-atlas"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/topojson/us-atlas
              </a>
            </li>
            <li>
              <strong>Mapbox GL JS</strong>. Map rendering, Albers USA
              projection, vector tiles.{' '}
              <a
                href="https://docs.mapbox.com/mapbox-gl-js/"
                target="_blank"
                rel="noopener noreferrer"
              >
                mapbox.com
              </a>
            </li>
          </ul>
        </section>

        <section className="source-group">
          <h3>Directory &amp; feeds</h3>
          <ul>
            <li>
              <strong>State foster / adoption directories</strong>. State-agency
              photolistings, Heart Gallery affiliates, and active private
              recruitment orgs. Compiled per-state; see{' '}
              <code>public/data/state-orgs.json</code>.
            </li>
            <li>
              <strong>AdoptUSKids photolisting</strong>. National photolisting;
              the Kids Waiting feed uses AdoptUSKids' YouTube channel alongside
              state Heart Gallery channels.{' '}
              <a
                href="https://www.adoptuskids.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                adoptuskids.org
              </a>
            </li>
            <li>
              <strong>YouTube RSS feeds</strong>. Kids Waiting videos embed
              directly from the originating orgs' channels &mdash; we never
              re-host children's faces or voices.
            </li>
            <li>
              <strong>Podcast RSS feeds</strong>. State-of-the-system cards
              pull from published foster-care podcasts (The Forgotten,
              Creating A Family, The Imprint Weekly, etc.).
            </li>
          </ul>
        </section>

        <section className="source-group sources-notes">
          <h3>Modeling notes</h3>
          <ul>
            <li>
              Where a state value in the underlying <code>states.ts</code>{' '}
              table is scaled from a national aggregate rather than pulled from
              a per-state table, the row is flagged{' '}
              <code>_modeledMissing: true</code>. This applies to{' '}
              <code>missingFromCare</code> (NCMEC publishes a national total,
              state breakdowns are approximated from foster-care census share)
              and any field marked as such in the data file.
            </li>
            <li>
              The <strong>Foster Disability</strong> counts in Chapter II apply
              a per-state share to AFCARS foster-care census. AFCARS
              state-level reporting of &ldquo;Clinically Diagnosed Disability
              Condition&rdquo; is widely acknowledged to be inconsistent &mdash;
              some states flag mental-health diagnoses and IEPs aggressively,
              others barely at all &mdash; so the state choropleth reads as the
              scale of the disabled subset, not a ranking of which states
              neglect disabled kids most.
            </li>
            <li>
              The <strong>Misery Index</strong> is a composite: z-scores of
              child poverty, drug-overdose rate, poor-health days, and
              disability, summed per county. Higher = worse. When the full
              composite file isn't present, the map falls back to a two-signal
              approximation from poverty + overdose, which is directionally
              the same ranking.
            </li>
            <li>
              The <strong>Complicity</strong> score is{' '}
              <code>percentile(misery) + percentile(churchesPer10k) - 100</code>.
              Positive values indicate high misery AND high church presence
              &mdash; the specific charge American Christianity has to answer.
              Negative values indicate low church presence in high-misery
              counties; the argument there is different.
            </li>
            <li>
              Pollution state values are seeded from EPA AQS 2022 annual means
              and refreshed on each deploy by{' '}
              <code>scripts/fetch-ejscreen.mjs</code>. When the fetcher fails,
              the seeded values remain in place.
            </li>
            <li>
              The <strong>Pipeline</strong> map chapter projects adult inmates
              per 1,000 state children as{' '}
              <code>fosterCare × 0.20 / childPop × 1,000</code>. The 20% is the
              BJS &ldquo;~1 in 5 U.S. prisoners is a former foster child&rdquo;
              headline applied as a flat forward-projection to the current
              foster census. State-to-state ranking therefore tracks the
              Chapter I baseline by construction; what differs is the stake
              being named: not how many kids are in care, but how many of
              them are being walked toward a prison cell.
            </li>
          </ul>
        </section>
      </div>
    </section>
  );
}
