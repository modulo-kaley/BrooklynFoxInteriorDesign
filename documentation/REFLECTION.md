# CPRG 306 D | Web Development 2 | Final Project Self-Reflection

| **Student Name** | **Submission Date** |
| --- | --- |
| Kaley Wood | April 20, 2026 |

---

## 1. Project Links

**GitHub Repository URL**
<https://github.com/modulo-kaley/BrooklynFoxInteriorDesign/tree/main>

**Deployed Web Application URL**
<https://brooklyn-fox-interior-design.vercel.app>

---

## 2. Most Significant Accomplishment

> *Agent based or tools based? What is more "useful"?*

### What did I hope to gain

I used this final project to run an experiment:
 Can I take what I know about Web Development and AI integration (like MCP connection to Figma) to complete this project?

 'branch-claude' runs an agent facilitated workflow with project documentation and agent guardrails outlines based on Microsoft's Project Nighthawk.

 'branch-kaley' runs workflow of Use a tool, run a prompt cross referenced with documentation, and finally human-reviewed workflow.

### Why this Workflow

 1. My upcoming study abroad in Porto, Portugal offers the chance to operate on a small team as (likely) a lead developer, with a quick turnaround between project onset and MVP pitch.

 2. It's no surprise that AI is workflows are popular and commonplace in industry. I wanted to see what it would be like to keep up, maintain, and human review a project with a specific outcome. It's one can of worms to let AI "run" it's another can of worms altogether to steer the ship.

 3. I am cautiously optimistic about AI capabilities and aim to be intentional about AI use. I thought by comparing and reflecting I'd learn something new

### What did I learn (about myself)

I prefer to lead the workflow.

Maybe it's the size of the project or the knowledge I currently stand to gain but the full agent ran workflow took away the joy of the process.

When I was leading the workflow I found myself asking more questions, learning about the tools, and interacting with the local build throughout the process.
Agents are nice if you want to send in the sniper, but if there is still ideation left I don't know if offers enough "call and response." At least not the way I had the agents currently setup to work.

---

## 3. Challenges Faced & How You Overcame Them

> You MUST identify real challenges — 'no challenges' will lose marks. Focus on what you did about them, not just that they existed.

### Challenge One

Image file size, image blur, image fit...
What a journey this was. I think I went into it with the mindset that "the files will just be imported"... but it really isn't that simple.

The initial problem was one un-trackable image because the file size was beyond GitHub's allowance.
I explored a few angles of looking into this problem:

- File type switch - png

- Pillow - python - this worked for the initial problem of one large un-committable file but then many images were still rendering slow on runtime

The final outcome:
Build Time: downscale-image.mjs script > turns 5-10 MB photoshop exports into 200 - 400 KB files > saves to public/images
Run Time: next/image scoops at request time > generates responsive srcsets, lazy-loading below-the-fold tiles > swaps JPEG out for AVIF or WebP

Note: These solutions are not as clean as there are locally

### Challenge Two

> It felt like a challenge but then it turned into a moment of natural learning

I was given the client's content in a google drive and manually downloaded the files.
As I was organizing the files and renaming them according to the album they were part of I couldn't figure out why they weren't showing up in branch-kaley (they only showed in branch-claude).

It took me a fair bit of searching through files and blank stares to figure out that in order for a worktree to be initiated each branch is saved in a separate folder with it's own git tracking (magic).

---

## 4. Project Adjustments and Unresolved Issues

### Features that weren't added

1. No custom not-found.js (unbranded 404)
2. No OpenGraph / social preview metadata in layout.js
3. No favicon

### Why These Features Should be Included

I think all features listed above are important for the use case of this website.
An interior designer's portfolio is meant to be shared, viewed, appreciated and all elements of the viewing experience needs to considered.

1. Use Case: Ideally in the case of an outage a branded 404 page would fill a gap by offering a sneak peek of the client's work - in a thoughtful way.
2. Use Case: If the portfolio website is shared via text or socials, it's important that the content preview gives a positive first impression to the viewer.
3. Use Case: A favicon is an easy way to share consistent branding to increase brand recognition and a lack of a favicon

### Why these features weren't added

These features are a product of learning in real time.

I didn't think about these elements of the project until further along in the build and for the purposes of this sprint I decided not to include them. I am glad I was able to recognize the importance of these features for not only this project but (hopefully) for future.

I didn't add these to the project scope because I wanted to pay more attention to successfully rendering the images (which took several more steps than I anticipated) and appropriate routing within each "album."
*A real life example of a nice-to-have*

## Agentic Workflow: Challenge - Not Yet Overcome

Documentation was a (slight) nightmare. Since during the main creation session I had no way of knowing what really happened unless I wanted to go back through the entire codebase in one swoop. I guess I could've prompted for more in-depth documentation or asked for handovers at logical branch commits - I just didn't think of it.

### Multiple Challenges

- No handover or mid-session documentation

- Lack of trust in the deliverance of my initial plan - I thought perhaps the agent structure I was basing this setup on was a misuse

#### Reevaluation Plan

I have a feeling that using an agentic workflow is better for research-based work rather than task based. I think I will give one more crack at this workflow though and see if there is anything about the documentation or agent setup that I can enhance to smooth things over

---

## 5. Most Important Development Learnings

### Tools Used

 > **1. Figma - VS Code and Claude Code MCP**
    Connect designs directly from Figma into VS Code with Claude Code funcitonality.
    This was a game changer for this project.
    Since this project is essentially a design piece I spent some time figuring out ways to use the initial designs rather than recreating them.
    <https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server>
 > **2. Sharp**
    The typical use case for this high speed Node-API module is to convert large images in common formats
    to smaller, web-friendly JPEG, PNG, WebP, GIF and AVIF images of varying dimensions.
    <https://github.com/lovell/sharp>
 > **3. Motion**
    There was a point in the design where I had to decide if I cared about making all of the prototype animations happen, and that is when Motion came to save the day.
    <https://motion.dev/docs/react>
 >**Vinyl Homepage Popup**
    CSS would have worked for this, the record would've just jiggled noticeably on a persistent hover (the record was gettin' jiggy with it).
    Motion's magic redirects the record smoothly - making this a nice-to-have.

```javascript
.tile .vinyl {
transition: transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.tile:hover .vinyl { transform: translateY(-58%) rotate(8deg); }
```

> ***Navigation Record Rotation**
    The VinylNavLink component: Each onMouseEnter increments a counter, animate={{ rotate: spins* 360 }} lets motion tween forward by 360° each time.
    Why CSS wouldn't make the magic happen alone:
    :hover { transform: rotate(360deg) } + transition → it reverses on unhover. Fails the "no unwind" requirement.
    @keyframes spin triggered by :hover → plays forward once, but CSS animations don't cleanly restart on re-hover without a class-toggle-and-force-reflow JS hack.

```javascript
      {/*
        motion.div with `animate` watching a value:
          animate={{ rotate: spins * 360 }}
            → whenever `spins` changes, motion interpolates the rotate
              property from wherever it currently is to the new target.
              spins=1 → rotate to 360°
              spins=2 → rotate to 720° (another full turn forward)
              ...and so on.

        transition controls how fast + with what curve:
          duration: 0.9     → nine-tenths of a second per spin
          ease: [0.22, 1, 0.36, 1]
            → a cubic-bezier curve. Those four numbers are the two control
              points of a bezier (x1, y1, x2, y2). This particular one
              starts fast and eases out smoothly at the end — think of a
              record spinning up and then coasting to a stop.
      */}
```

> **4. Colorful Comments**
    This is my new best friend in VS Code!
    Nicholas Irvine showed me this extension and now I include a guide on commenting that includes colour!
    <https://marketplace.visualstudio.com/items?itemName=ParthR2031.colorful-comments>

### Skills Learnt

- **Skill 1:**

> **Writing in Markdown**
    I really like the look of documentation in GitHub so I spent some time exploring markdown structure and created my reflection as an markdown.
    I use markdowns so often I thought it'd be good for me to learn more about the formatting and I figured this way I could link my reflection directly into the repo for future sprints/self reflection.

- **Skill 2:**

> **Agent orchestration**
    Although the Nighthawk project was already setup and ready to ride, it was configured for a different use case.
    I spent some time putting together project documentation, as well as agent guardrails with Claude so the agent pipelines would work in conjunction appropriately for web development.

- **Skill 3:**

> **Using Worktrees**
    Use Case: Running claude-branch and kaley-branch simultaneously
    This was the first time I've ever had to work in multiple branches so I did some research on initiating that workflow and eventually set up
    a worktree. I quickly learnt what the local working tree was all about when I was uploading images to one branch and not the other. In hindsight I should've just worked within main for the base config.
    *This skill still feels like it's in the early stages*

---

## 6. Self-Assigned Grade

> My Grade:  31.5/40
    Given Marks: 36.5
    Deducted Marks: 85

## Reasoning for grade

### Custom Section - Deducted Marks - 5

> AI Integration
    Although there were a lot of benefits to my intentional workflow and the thoughtfulness around this experiment for my own learning.
    I am certain there are still pieces of the code that are slightly beyond me. I didn't spend enough time interacting with the data file - which is arguably the most important element (especially considering future builds).
    I think these marks docked represent both responsibility and cautiousness around these workflows as a junior developer.

### Quality of Code - Given Marks - 7

> Maintainability, consistent standards, usage of react + next features, clarity...

Upgrade from Original Plan: Clean Next.js App Router structure with a smart [album]/[track] dynamic-route refactor

`generateStaticParams` for Pre-Rendered State: Rendering ahead of time for speed felt like a must-have and a easy fix for slow loading images (amongst the other fixes mentioned)

`"use client"` for Interactive Components: Another variable to add speed for onload and keep animation fluid.

Design Must-Haves: next/image with proper sizes (informs browser what image dimensions to fetch), next/font for Poppins (inlined rather than fetched).
It was important to me to follow the prototype as much as possible.

Personal Must-Have: Comments are plain-English and explain why (e.g., the flex-wrap centering note in the six-grid layout).
I'm a busy gal and want to make sure when I circle back to this project for further updates I can reorient myself

### Quality of Code - Deducted Marks - 3

> Maintainability, consistent standards, usage of react + next features, clarity...

Website does not render properly on Mobile - completely missed that

These nice-to-haves were mentioned in a previous section and will be accounted for in a future sprint, but can still make a difference within the current project
 No custom not-found.js (unbranded 404)
 No OpenGraph / social preview metadata in layout.js
 No favicon

```javascript
// ? Before launch: add an openGraph image + proper favicon set so the
// site looks like itself when someone drops the link in a chat.
export const metadata = {
  title: "Brooklyn Fox — Interior Designer",
  description:
    "Portfolio of Brooklyn Fox, Interior Designer. Three completed projects presented as a guided visual journey.",
};
```

### 2. Usability & Interface - Given Marks - 9.5

> Primary user flows, management of unintended use, user feedback

Comprehensive, user-friendly flow followed: I really can't take credit for this design but I was successful in recreating it.

No zoom on hover & fit/fill: These were some design choices I did make. Within the original flow I found the auto-zoom on hover to be dizzying so I had images render on click. Then I was gifted the blurry image side quest which I navigated by offering a fit/fill toggle for the user to zoom in and out. I have ideas for ways to make this more user friendly but for now it's still a win.

Navigation Adjustments: I added text on navigation for clarity and book-ended each flow with vinyls routing to the homepage.

### 2. Usability & Interface - Deducted Marks - 0.5

> Primary user flows, management of unintended use, user feedback

I think there are some adjustments that could be made for a cleaner zoom process with less focus on clicking - to be determined what that looks like though.

### 3. Feature Implementation - Given Marks - 10

> Did you meet your project brief criteria? How did you manage scope?

I completed all scoped aspects of the project - yes there is room for improvement and additions but as far as scoped things are looking quite good.
I was grateful that the prototype created a specific scope outline for this project and I made some out-of-scope design calls to add more user-friendly elements to the porfolio.

### 4. Code Security & Error Handling - Marks Given - 10

> User vs dev facing error handling, protecting auth and forms

The scope of this project - in my humble and/or naive opinion - already limits risk

- no env variable to worry about

- no authentication process or user login data

- no forms / user input

- no database

- everything pre-rendered at build time

> This is both a blessing and differs my learning outcomes
