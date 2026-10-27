/* Gerald's projects. This file is the single source for the home strip and every project page.

   ADDING A PROJECT: copy one block between PROJECTS:START and PROJECTS:END, newest last.
   1. slug      : the page address, e.g. "edge-lab" -> geralds-projects.vercel.app/edge-lab
                  (also add the slug to the "rewrites" list in vercel.json)
   2. name      : the project's real name
   3. title     : the big lowercase title on its page
   4. kind      : a few words on what sort of thing it is
   5. url       : the live site (?utm_source=projects-page is added automatically)
   6. code      : GitHub link, or "" if none
   7. why / what: first person, plain words
   8. covers    : covers/<slug>-tall.jpg (1200x1600 screenshot) and covers/<slug>-wide.jpg (1440x900 at 2x)
   Analytics links are private and are NOT shown on this page. */

window.PROJECTS = [
  /* PROJECTS:START */
  {
    slug: "edge-lab",
    name: "Edge Lab",
    title: "edge lab",
    kind: "Trading-interview games",
    year: "2026",
    url: "https://edgelab-games.vercel.app/",
    code: "",
    why: "When getting to a higher level of anything, you cannot simply rely on talent and gut feeling to retain the excellency you had before. Not when everyone competing for the position is on your level or better, this is a way to stand out in a standardised test format. When everyone has played the game before where does your edge come from?",
    what: "Interactive games for trading-interview prep: market making, ETF arbitrage, Bayes, Kelly sizing and a poker room, plus a Daily Gauntlet with a leaderboard."
  },
  {
    slug: "root-t",
    name: "Root T",
    title: "root t",
    kind: "Option pricing",
    year: "2026",
    url: "https://root-t.vercel.app/",
    code: "https://github.com/geraldchen56-droid/option-pricer",
    why: "The Black-Schoels formula (BS) is one of the most intimidating formulas I have ever had the mind-cluttering pleasure to lay eyes on, in a struggle to break down and model it with comparison to the Monte-Carlo (MS) system on a European call option this was the result.",
    what: "Prices a European call option with 100,000 random simulations, then compares the result live against the Black-Scholes formula across 40 strikes and 20 maturities."
  },
  {
    slug: "irrational-margin",
    name: "The Irrational Margin",
    title: "the irrational margin",
    kind: "Behavioural economics blog",
    year: "2026",
    url: "https://eco-psych-blog-app.vercel.app/",
    code: "",
    why: "After learning about the assumptions within economics regarding “rationality” my interest piqued. Why did economists assume normal civillians make perfect decisions when it rarely happens? To enquire further into this and personally document my findings I developed this blog.",
    what: "A blog of essays on behavioural economics, where psychology meets the way people spend, save and choose."
  },
  {
    slug: "healing-pages",
    name: "The Healing Pages",
    title: "the healing pages",
    kind: "Journal",
    year: "2026",
    url: "https://the-healing-pages.vercel.app/",
    code: "",
    why: "As a neurodivergent individual, the expression of emotions and rash decision making has lead to undesireable outcomes in the past, not saying that I wish to never make a mistake again I want to journal the mistakes I have made, the thoughts I had before. It also is something to do late at night to “wrap the night up” and signal to myself it's time to go to sleep.",
    what: "A daily journal that tracks your streak, pages and word count, shows a calendar of what you've written, and has a recite mode for reading a page out loud."
  },
  {
    slug: "probability-lab",
    name: "IB Probability Lab",
    title: "ib probability lab",
    kind: "IB Maths AA revision",
    year: "2026",
    url: "https://ib-aahl-probability-lab.vercel.app/",
    code: "",
    why: "I wanted to revise IB Maths AA probability properly, and give other students on the course something better than a page of formulas. Mainly it's formatted towards my way of learning one of the most annoying and knowledge based topics in AAHL, unlike calculus where the application of formulas will get the answer. (I will be adding more math topics one by one, starting out with the ones I consider the hardest; Vectors, Differential Equations.)",
    what: "Covers every SL and HL probability (for now) topic with live models you can drag, Casio fx-CG50 and TI-84 keystrokes, and unlimited randomised practice questions with full working."
  },
  {
    slug: "study-tracker",
    name: "Study Tracker",
    title: "study tracker",
    kind: "Study hub",
    year: "2026",
    url: "https://gerald-study-tracker.vercel.app/",
    code: "https://github.com/geraldchen56-droid/study-tracker",
    why: "Personally, studying has always been a matter of discipline, making myself sit at a desk to review and memorise items. To make it both easier to get started with and be consistent I built a tracker that natively on my computer allows me to keep track of everything.",
    what: "Allows students to have a hub where everything study related combined into one spot, to ease the pain of studying."
  },
  {
    slug: "mahjong",
    name: "Mahjong Crash Course",
    title: "mahjong crash course",
    kind: "Mahjong, from scratch",
    year: "2026",
    url: "https://mahjong-crash-course.vercel.app/",
    code: "",
    why: "Since bouncing around major cities from Sichuan and Shenzhen to Sydney then to Shanghai (I don't know why my family seems to love cities with names starting with S) I've always struggled to connect with my Chinese heritage after being in Australia for 12 years. I built this as a way to combat that, to align myself in something I am very proud of which is my family and our traditions.",
    what: "Teaches Chinese and Hong Kong mahjong from scratch with a tile explorer, a hand checker that shows what you're waiting on, a solo practice table, scoring tables and a quiz."
  },
  {
    slug: "nuclear",
    name: "IB Physics Nuclear Summary",
    title: "nuclear summary",
    kind: "IB Physics SL revision",
    year: "2026",
    url: "https://ib-physics-nuclear.vercel.app/",
    code: "",
    why: "My nuclear physics notes were spread across several booklets and I wanted one place to revise IB Physics SL Topic 7.",
    what: "Covers mass defect, binding energy and the BEN curve with three worked calculation methods, fusion and fission, and a 15-point checklist that tracks your progress."
  },
  {
    slug: "ib-planner",
    name: "IB Planner",
    title: "ib planner",
    kind: "Study planner",
    year: "2026",
    url: "https://ib-planner-sooty.vercel.app/",
    code: "",
    why: "My timetable, tasks and exam prep were spread across too many places, so I wanted one page that opens on today's schedule and lets me drag my to-dos into the free blocks.",
    what: "A study planner for the IB with a weekly timetable that locks in your classes, drag-and-drop to-dos, a focus queue that moves you on to the next task, exam and grade tracking, and a 14-day TMUA/TARA exam camp."
  },
  {
    slug: "equilibrium",
    name: "Equilibrium",
    title: "equilibrium",
    kind: "Game theory course",
    year: "2026",
    url: "https://equilibrium-lab.vercel.app/",
    code: "",
    why: "I wanted to learn game theory by building the solver behind every example, not just reading about it.",
    what: "An interactive game theory course where every game is solved live, with two of twelve chapters done so far."
  }
  /* PROJECTS:END */
];
