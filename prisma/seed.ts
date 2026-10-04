import "dotenv/config";
import bcrypt from "bcryptjs";
// Shared client: picks the SQLite or Postgres adapter from DATABASE_URL.
import { prisma } from "../src/lib/prisma";
import { shuffleAnswerOptions } from "../src/lib/quiz-options";

type SeedOption = { text: string; correct?: boolean };
// FILL_BLANK questions put "____" in the text and list every accepted answer
// as an option; MULTIPLE_CHOICE questions mark exactly one option correct.
type SeedQuestion = {
  text: string;
  type?: "MULTIPLE_CHOICE" | "FILL_BLANK";
  options: SeedOption[];
};
type SeedQuiz = { title: string; passPercent: number; questions: SeedQuestion[] };
type SeedModule = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  estMinutes: number;
  order: number;
  content: string;
  department?: "DISPATCH" | "TRACKING" | "HR";
  quiz?: SeedQuiz;
};

const modules: SeedModule[] = [
  {
    slug: "welcome-to-empire-national",
    title: "Welcome to Empire National",
    category: "Company & Culture",
    summary: "Who we are, the equipment we run, and how the team is organized.",
    estMinutes: 8,
    order: 1,
    content: `## Welcome aboard

Empire National specializes in **expedited Sprinter van transportation**, providing fast, reliable, and dedicated freight services across the country. Our dispatchers connect drivers, brokers, and customers to ensure shipments are handled professionally and delivered on time.

Our primary fleet consists of regular Sprinter vans for dedicated and time-sensitive shipments. In addition, we operate a limited number of **53' dry vans** serving specific long-haul lanes:

- North/South Carolina, Georgia, Tennessee, and Virginia ↔ Southern California
- Southern California ↔ Chicago
- Chicago ↔ North/South Carolina, Georgia, and Tennessee

Every shipment we handle is focused on reliability, speed, clear communication, and exceptional service.

## Our mission

Our mission is simple: provide fast, reliable, and dedicated transportation while delivering a high level of service to every customer.

As a dispatcher, your role is critical. You help keep drivers moving, communicate with customers and brokers, manage each shipment from pickup to delivery, and make sure every load is handled professionally.

## What we haul

Empire National operates an exclusive Sprinter van fleet designed for expedited and dedicated freight. Our equipment consists of regular Sprinter vans **without reefer, liftgate, or dock-high capabilities**.

## How the team is organized

- **Dispatchers** – book loads, assign drivers, and are the primary point of contact for drivers during a shift.
- **Tracking Team** – monitors shipments throughout transit and provides location updates every two hours, helping maintain visibility and keeping customers and brokers informed.
- **Human Resources / Driver Support** – handle driver onboarding, performance, and retention.
- **Operations Manager** – oversees the dispatch floor and resolves escalations.
- **Safety & Compliance** – responsible for maintaining regulatory compliance, reviewing driver qualification and safety requirements, monitoring incidents, and helping ensure that drivers and operations follow applicable transportation regulations.`,
    quiz: {
      title: "Welcome to Empire National — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "What type of transportation does Empire National specialize in?",
          options: [
            { text: "Expedited Sprinter van transportation", correct: true },
            { text: "Refrigerated LTL consolidation" },
            { text: "Flatbed heavy haul and oversize freight" },
            { text: "Intermodal rail drayage" },
          ],
        },
        {
          text: "What makes up Empire National's primary fleet?",
          options: [
            { text: "Regular Sprinter vans for dedicated and time-sensitive shipments", correct: true },
            { text: "Refrigerated trailers for produce lanes" },
            { text: "Flatbeds and step decks" },
            { text: "Box trucks with liftgates for residential delivery" },
          ],
        },
        {
          text: "Besides Sprinter vans, what equipment does Empire National operate?",
          options: [
            { text: "A limited number of 53' dry vans on specific long-haul lanes", correct: true },
            { text: "A large fleet of 48' flatbeds nationwide" },
            { text: "Refrigerated Sprinter vans for food shipments" },
            { text: "Owner-operator power only for container work" },
          ],
        },
        {
          text: "Which lane is served by Empire National's 53' dry vans?",
          options: [
            { text: "Southern California to Chicago", correct: true },
            { text: "Miami to New York City" },
            { text: "Seattle to Denver" },
            { text: "Houston to Minneapolis" },
          ],
        },
        {
          text: "Which states run opposite Southern California on our dry van lanes?",
          options: [
            { text: "North/South Carolina, Georgia, Tennessee, and Virginia", correct: true },
            { text: "Ohio, Michigan, and Indiana" },
            { text: "Arizona, Nevada, and Utah" },
            { text: "Maine, Vermont, and New Hampshire" },
          ],
        },
        {
          text: "Which capabilities do Empire National's Sprinter vans NOT have?",
          options: [
            { text: "Reefer, liftgate, and dock-high capability", correct: true },
            { text: "Interstate operating authority" },
            { text: "The ability to run team drivers" },
            { text: "GPS tracking and electronic paperwork" },
          ],
        },
        {
          text: "How is Empire National's mission described?",
          options: [
            { text: "Provide fast, reliable, and dedicated transportation with a high level of service to every customer", correct: true },
            { text: "Be the lowest-priced carrier on every load board" },
            { text: "Operate the largest fleet in the country" },
            { text: "Move only local freight within a single region" },
          ],
        },
        {
          text: "Which team books loads, assigns drivers, and is the primary point of contact for drivers during a shift?",
          options: [
            { text: "Dispatchers", correct: true },
            { text: "Safety & Compliance" },
            { text: "Human Resources / Driver Support" },
            { text: "The Operations Manager" },
          ],
        },
        {
          text: "Who handles driver onboarding, performance, and retention?",
          options: [
            { text: "Human Resources / Driver Support", correct: true },
            { text: "Dispatchers" },
            { text: "Safety & Compliance" },
            { text: "The customer's broker" },
          ],
        },
        {
          text: "Who oversees the dispatch floor and resolves escalations?",
          options: [
            { text: "The Operations Manager", correct: true },
            { text: "The Safety & Compliance team" },
            { text: "The driver on the load" },
            { text: "Human Resources / Driver Support" },
          ],
        },
        {
          text: "Which team monitors shipments in transit and provides location updates every two hours?",
          options: [
            { text: "The Tracking Team", correct: true },
            { text: "Dispatchers" },
            { text: "Safety & Compliance" },
            { text: "Human Resources / Driver Support" },
          ],
        },
        {
          text: "Which team reviews driver qualification and safety requirements and monitors incidents?",
          options: [
            { text: "Safety & Compliance", correct: true },
            { text: "Dispatchers" },
            { text: "The Operations Manager" },
            { text: "Human Resources / Driver Support" },
          ],
        },
        {
          text: "According to this module, what is part of a dispatcher's role?",
          options: [
            { text: "Managing each shipment from pickup to delivery and communicating with customers and brokers", correct: true },
            { text: "Performing maintenance on the Sprinter vans" },
            { text: "Setting fuel prices for the fleet" },
            { text: "Issuing driver qualification files and CDLs" },
          ],
        },
        {
          text: "Empire National specializes in expedited ____ van transportation.",
          type: "FILL_BLANK",
          options: [{ text: "Sprinter" }],
        },
        {
          text: "Alongside the van fleet, the company runs a limited number of 53' ____ vans on specific long-haul lanes.",
          type: "FILL_BLANK",
          options: [{ text: "dry" }],
        },
        {
          text: "Our Sprinter vans have no reefer, no ____, and no dock-high capability.",
          type: "FILL_BLANK",
          options: [{ text: "liftgate" }, { text: "lift gate" }, { text: "lift-gate" }],
        },
        {
          text: "Two of our dry van lanes run to and from ____, the Midwest end of that network.",
          type: "FILL_BLANK",
          options: [{ text: "Chicago" }],
        },
        {
          text: "A dispatcher manages each shipment from pickup all the way to ____.",
          type: "FILL_BLANK",
          options: [{ text: "delivery" }],
        },
      ],
    },
  },
  {
    slug: "key-players-in-the-logistics-chain",
    title: "Key Players in the Logistics Chain",
    category: "Company & Culture",
    summary: "Who owns the money, the freight, and the decisions on every load you dispatch.",
    estMinutes: 10,
    order: 2,
    content: `## Why this matters

In US trucking, every load is a chain of responsibility. Knowing who owns what — money, freight, and decisions — helps you dispatch without mistakes.

## Shipper (Consignor)

- **Who it is:** the company that is shipping the freight (origin).
- **Main responsibilities:** tenders the load, provides pickup details, freight description, and shipping documents.

## Consignee (Receiver)

- **Who it is:** the company that receives the freight (destination).
- **Main responsibilities:** unloads/receives the freight and signs the **POD** (or provides electronic proof).

## Customer

- **Who it is:** the party paying and looking for the full transportation service — this can be the shipper directly, or a broker.

## Broker

- **Who it is:** the intermediary that sells the load to carriers (us).
- **Main responsibilities:** finds capacity, negotiates the rate, issues the **Rate Confirmation (RC)**, and manages shipper/consignee communication.
- **What a dispatcher needs from them:** the RC, pickup/delivery numbers, detention/TONU/layover policy, and the tracking method (check calls vs. tracking link).

## Carrier (Trucking company)

- **Who it is:** the company legally authorized to haul freight under its own DOT/MC authority.
- **Main responsibilities:** provides the equipment and driver, complies with FMCSA rules, and maintains insurance.

## Owner

- **Who it is:** the person or company that owns the trucks and employs or leases the drivers — can be the same as the carrier, or part of it.
- **Main responsibilities:** assigns drivers and equipment, handles the rate instead of the driver, and sometimes keeps communication instead of the driver.

## Driver

- **Who it is:** the person physically moving the load.
- **Main responsibilities:** safe operation, on-time pickup and delivery, check-in, securing the freight, and sending all documents from the shipper and receiver.
- **What a dispatcher needs from them:** current location, remaining hours, status at every milestone (arrived / loaded / rolling), and any issue immediately — breakdown, delay, or refusal.

## Dispatcher (carrier-side)

- **Who it is:** the operations coordinator between the broker/shipper and the driver.
- **Main responsibilities:** load planning and booking, appointment coordination when required, problem solving, accessorial documentation, and keeping track of shipments so everything runs without issues.

## Customs broker (cross-border only)

- **Who it is:** the licensed party that files entry and clearance paperwork for international shipments.
- **Main responsibilities:** ensures customs compliance and release so the shipment can continue.
- **What dispatch and tracking need from them:** clearance status, reference numbers, and what to do if the load is held or inspected.

## Quick rule (important)

| Flow | Path |
| --- | --- |
| **Money** usually flows | Customer / shipper → broker → carrier |
| **Freight** usually flows | Shipper → carrier / driver → consignee |`,
  },
  {
    slug: "types-of-transportation",
    title: "Types of Transportation",
    category: "Freight Fundamentals",
    summary: "FTL, LTL, partial, exclusive use, and the special handling types you will book.",
    estMinutes: 11,
    order: 4,
    content: `## How freight moves in the US

Trucking is the most common mode in the country — about **65% of freight by weight** moves by truck. The service type you book decides how the trailer is filled, how many times the freight is handled, and how it is priced.

| Service | Trailer space | Handling | Typical cost |
| --- | --- | --- | --- |
| **FTL** | The whole trailer, one shipper | Fewest touches | Highest per load, lowest per pound |
| **Partial** | More than LTL, less than a full trailer | Few stops | Between LTL and FTL |
| **LTL** | Shared with other shippers | Terminals and cross-docks | Lowest per shipment |

## FTL (Full Truckload)

One shipper uses the full trailer. Faster and simpler: fewer touches, fewer stops, and lower damage risk.

## LTL (Less-Than-Truckload)

The shipment shares trailer space with other shippers. Best for smaller freight, often 1-6 pallets.

- Usually moves through terminals (cross-docks), so transit can be longer and there are more touch points — a higher risk of delay or damage.
- Pricing depends on **freight class, weight, dimensions, and accessorials** (liftgate, residential, inside delivery).

## Partial (Partial Truckload)

More space than LTL but not a full trailer. Usually fewer stops than LTL and better transit time.

Common when the shipment is too big or heavy for LTL pricing to make sense but still does not fill a 53' trailer. Pricing sits between LTL and FTL and depends on how much trailer space — and weight — the freight occupies.

## Exclusive Use

You pay for the full trailer, so no other freight is loaded even if yours does not fill it. Used for sensitive or high-value freight, strict contamination rules, temperature-sensitive loads, or when the shipper wants maximum security and control. Think of it as **your freight only** — often requested by shippers with special handling requirements.

## Direct (Straight Through)

Point A to Point B with no intermediate stops or terminal handling. Used for urgent freight and strict ETAs, and typically costs more than standard routing.

## Food grade (sanitary loads)

Freight — often food ingredients or packaging — that must move in clean, odor-free, contamination-free equipment with no holes in the trailer.

## Fragile loads

Freight that damages easily: glass, electronics, medical equipment, furniture. It needs extra protection and careful handling. Common requirements:

- **Do Not Stack** and **This Side Up** markings
- Padding, blankets, load bars, and straps
- Careful pallet placement, with no heavy floor-loaded freight stacked on top
- Sometimes exclusive use`,
  },
  {
    slug: "customs-logistics",
    title: "Customs Logistics",
    category: "Freight Fundamentals",
    summary: "What customs does to a load, and the schedule and cost risk it puts on dispatch.",
    estMinutes: 7,
    order: 5,
    content: `## What customs is

Customs is the government authority that controls the flow of goods into and out of a country and collects duties and taxes on imports.

In real transportation terms, customs is a **mandatory stop on the route** — at a border, port, or airport — where freight can be held until documents and inspections are complete.

## Why it matters for dispatch

- **Border equals schedule risk.** Holds and inspections can break your ETA and your delivery appointment.
- **Extra time equals extra cost.** Detention, layover, storage, rework, and broker fees all land on the load.
- **Not every carrier can run it.** Some loads require bonded or in-bond movement, or specific compliance the carrier may not hold.

## Who you work with

The **customs broker** is the licensed party that files entry and clearance paperwork. Dispatch and tracking need three things from them: clearance status, reference numbers, and instructions for what to do if the load is held or inspected. Their place in the wider chain is covered in **Key Players in the Logistics Chain**.`,
  },
  {
    slug: "equipment-types",
    title: "Equipment Types",
    category: "Equipment & Trailers",
    summary: "Dry van, reefer, flatbed, cargo van, Sprinter, box truck, and RGN — what each one hauls.",
    estMinutes: 12,
    order: 6,
    content: `## Why equipment type matters

Matching the right equipment to the freight is one of the most important calls a dispatcher makes. Book the wrong type and you get a refused load, damaged freight, or a truck that cannot physically load at the dock.

Empire National primarily operates **Sprinter vans**, along with a limited number of **53' dry vans** on specific long-haul lanes. The other equipment types mentioned below are not operated by Empire National. However, you may still encounter them when working with brokers, so it is important to recognize and understand the basic differences between them.

## Dry Van

![Tractor and 53-foot dry van trailer](/equipment/dry-van.jpg)

A fully enclosed 53' trailer — the most common equipment in trucking. No temperature control, loaded and unloaded at a dock from the rear.

**Best for:** palletized general freight, retail goods, packaged non-perishables.

## Reefer (Refrigerated)

![Refrigerated truck with a nose-mounted cooling unit](/equipment/reefer.jpg)

An insulated body — a trailer or, as pictured, a straight truck — with a temperature-control unit mounted on the nose. Dispatch must confirm the **set temperature** and whether the unit runs **continuous or cycle** mode, and watch fuel for the reefer unit separately.

**Best for:** produce, meat, dairy, pharmaceuticals, and anything with a temperature requirement.

## Flatbed

![Flatbed with an open deck](/equipment/flatbed.jpg)

An open deck with no walls or roof. Freight is held down with straps, chains, and tarps instead of being enclosed, so the driver needs securement training and the right tarps.

**Best for:** lumber, steel, pipe, machinery, and construction materials.

## Cargo Van

![Standard-roof cargo van](/equipment/cargo-van.jpg)

The smallest unit in expedited freight — a standard-roof van for light, small shipments that need to move now. Loads at ground level, so no dock is required.

**Best for:** a few pallets or less, hot-shot and expedited runs.

## Sprinter Van

![High-roof Sprinter van](/equipment/sprinter-van.jpg)

A high-roof van with more cubic capacity than a cargo van, and Empire National's primary equipment. Ours run **without reefer, liftgate, or dock-high capability** — confirm that before accepting a load that assumes any of them.

**Best for:** dedicated and time-sensitive shipments, team-driver direct runs.

## Box Truck

![Box truck with an enclosed body](/equipment/box-truck.jpg)

A straight truck — cab and enclosed body on one chassis, rather than a tractor pulling a trailer. Many are fitted with a **liftgate**, which lets them deliver where there is no dock.

**Best for:** mid-size shipments, residential and inside delivery, local and regional work.

## RGN (Removable Gooseneck)

![Removable gooseneck lowboy trailer](/equipment/rgn.jpg)

A specialized lowboy whose front section detaches to become a ramp, so wheeled or tracked equipment can drive straight onto a very low deck. Tall and heavy loads often need **oversize or overweight permits** and routing approval.

**Best for:** excavators, dozers, cranes, and other heavy machinery.`,
    quiz: {
      title: "Equipment Types — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "Which equipment is Empire National's primary fleet?",
          options: [
            { text: "Sprinter vans", correct: true },
            { text: "Reefer trailers" },
            { text: "Flatbeds" },
            { text: "RGN lowboys" },
          ],
        },
        {
          text: "What is a dry van?",
          options: [
            { text: "A fully enclosed 53' trailer with no temperature control", correct: true },
            { text: "An open deck trailer with no roof or walls" },
            { text: "An insulated trailer with a cooling unit" },
            { text: "A straight truck with a liftgate" },
          ],
        },
        {
          text: "Which two things must dispatch confirm on a reefer load?",
          options: [
            { text: "The set temperature and whether the unit runs continuous or cycle mode", correct: true },
            { text: "The tarp count and strap rating" },
            { text: "The permit number and escort vehicle" },
            { text: "The liftgate capacity and dock height" },
          ],
        },
        {
          text: "How is freight secured on a flatbed?",
          options: [
            { text: "With straps, chains, and tarps, since there are no walls or roof", correct: true },
            { text: "With a temperature-controlled seal" },
            { text: "By locking the rear doors at the dock" },
            { text: "With a removable gooseneck ramp" },
          ],
        },
        {
          text: "What makes a Sprinter van different from a cargo van?",
          options: [
            { text: "A high roof, giving it more cubic capacity", correct: true },
            { text: "A built-in refrigeration unit" },
            { text: "A detachable front section" },
            { text: "A 53-foot enclosed body" },
          ],
        },
        {
          text: "Which capabilities do Empire National's Sprinter vans NOT have?",
          options: [
            { text: "Reefer, liftgate, and dock-high", correct: true },
            { text: "Team drivers and direct runs" },
            { text: "Interstate authority" },
            { text: "Ground-level loading" },
          ],
        },
        {
          text: "What is a box truck?",
          options: [
            { text: "A straight truck with the cab and enclosed body on one chassis", correct: true },
            { text: "A tractor pulling a 53' enclosed trailer" },
            { text: "An open deck trailer for machinery" },
            { text: "A van with a standard roof" },
          ],
        },
        {
          text: "Why does a liftgate matter on a box truck?",
          options: [
            { text: "It lets the truck deliver where there is no dock", correct: true },
            { text: "It keeps the freight at a set temperature" },
            { text: "It raises the deck height for tall freight" },
            { text: "It replaces straps and chains for securement" },
          ],
        },
        {
          text: "What makes an RGN different from a standard flatbed?",
          options: [
            { text: "Its front section detaches to become a ramp onto a very low deck", correct: true },
            { text: "It is fully enclosed against weather" },
            { text: "It carries a refrigeration unit on the nose" },
            { text: "It loads only at dock height" },
          ],
        },
        {
          text: "Which load would most likely need an RGN?",
          options: [
            { text: "An excavator being moved between job sites", correct: true },
            { text: "Twelve pallets of packaged snacks" },
            { text: "A temperature-controlled produce load" },
            { text: "Two pallets of documents on an expedited run" },
          ],
        },
        {
          text: "A reefer trailer carries a temperature-control unit mounted on its ____.",
          type: "FILL_BLANK",
          options: [{ text: "nose" }, { text: "front" }],
        },
        {
          text: "A box truck fitted with a ____ can deliver where there is no dock.",
          type: "FILL_BLANK",
          options: [{ text: "liftgate" }, { text: "lift gate" }, { text: "lift-gate" }],
        },
        {
          text: "Freight on a flatbed is held down with straps, chains, and ____.",
          type: "FILL_BLANK",
          options: [{ text: "tarps" }, { text: "tarpaulins" }, { text: "tarp" }],
        },
        {
          text: "Oversize machinery on an RGN often requires oversize or overweight ____ before it can move.",
          type: "FILL_BLANK",
          options: [{ text: "permits" }, { text: "permit" }],
        },
      ],
    },
  },
  {
    slug: "driver-communication-and-check-calls",
    title: "Driver Communication & Customer Service Training",
    category: "Dispatch Workflow",
    summary:
      "The criteria every call is graded on, and the phrasing that meets them.",
    estMinutes: 9,
    order: 14,
    content: `## What we grade on a call

Every call is reviewed against these criteria.

| Area | What we check |
| --- | --- |
| **Greeting** | Introduction — your name and the company |
| **Listening** | Confirmation phrases · Human touch (empathy) · Using the customer's name · No interruption · Avoiding dead air |
| **Controlling** | Asking the necessary questions |
| **Solving** | Clear and complete |
| **Tone of voice** | Volume · Pitch (low, high, monotonous) · No mumbling · Friendliness — interest in your voice |
| **Closing a call** | Thank the customer · Offer additional help (inbound calls) · No hanging up |
| **Telephone etiquette** | Small talk · Positive word choice, no imperatives · Avoiding fillers · No noises, loud breathing, singing, or coughing |
| **Procedures** | HOLD · TRANSFER · CALL BACK |
| **Handling difficult customers** | — |

## Introduction (name, company)

Say **your name** and **the name of the company**.

> "Good morning. This is \_\_\_\_\_\_ with Empire National."
>
> "Empire National, this is \_\_\_\_\_\_. How can I help you?"

## Confirmation phrases

Keep the other person hearing that you are following along:

Awesome · great · I see · I understand · sure · okay · alright · sounds good · very well · sounds like a plan · that's right · perfect · absolutely.

## Human touch (empathy)

- "Thank you for explaining your situation. Right now I'm doing my best to figure out the details for you."
- "I'm sorry to hear that. Let me take care of your situation right away."
- "I'm so sorry to hear that. I can assure you that I am able to get this fixed."
- "I know how frustrating it is. I will do my best to help you right now, okay?"
- "I'm really sorry to hear that happened to you. I would be upset as well. I'll take care of your issue right away."
- "Oh, really? I'm so happy to hear that!" — when something good happens.

## Using the customer's name

**Why it matters:**

- Builds trust
- Shows respect
- Draws their attention to the situation
- Keeps warm customers

> **Man, Buddy, Bro and Boss are forbidden.**

If the person introduced themselves, use their name **at least 2–3 times** in the conversation. If you did not catch the name, ask them to repeat it. If you placed the call and the name is in the system, use it.

## No interruption

**Do not interrupt.** If you have already interrupted somebody, add the word "sorry", or the phrase *"I'm sorry for interrupting you."*

## Avoiding dead air

Let the customer know that you are going to need some time to check the information.

- "Give me just a quick second. I will look that up for you, okay?"
- "Thank you for waiting. I'm still working on the information for you."
- "Let me pull it up for you really quick."
- "I'm here with you, okay? Just need some time to pull this up for you."

## Asking the necessary questions

Ask the questions you need:

- "Would you be able to ______?"
- "Do you think you can ______?"
- "May I have your ______?"
- "Do you want me to ______?"
- "Could you say that again please?"
- "To better assist you, may I ask you a couple of questions?"

## Solving — clear and complete

- "What I can offer you is ______."
- "I can suggest ______."
- "What we can do is ______."
- "The best solution in this case would be ______. How does it sound to you?"
- "I can assure you, I am able to resolve this for you."

> If you do not know the solution — **never hang up.** Always do your best to explain what you are going to do.

## Tone of voice

**Volume.** Speak loudly, but do not yell. You need to sound as clear as possible.

**Pitch, mumbling and friendliness.** Do not speak monotonously, and do not mumble — let interest come through in your voice.

## Closing a call

Thank the customer, offer additional help on inbound calls, and never hang up first.

- "Is there anything else that I can help you with?"
- "Please do not hesitate to reach out to me if you need me, okay?"
- "Thank you! Have a great day! Bye bye!"

## Small talk

If the customer makes small talk, answer the question **and ask them one back**.

| Reasons to use small talk | Taboo topics |
| --- | --- |
| 1. To break the ice | Politics |
| 2. To fill dead air (weird pauses) | Religion |
| 3. To keep warm customers | Money and salaries |

::::grid
:::card[Openers]{tone=soft}
"How's your day going?"

"How's your Friday going?"

"How was your weekend?" — with warm customers.
:::

:::card[If they ask you]{tone=soft}
"Doing great! Thank you!"

"So far so good."

"It's Friday already, looking forward to the weekend."

"About to have my morning coffee."

"I have just arrived from vacation."

"Full of energy for the week."
:::
::::

:::card[If the topic turns to politics, religion or race]{tone=high}
Do not answer these questions directly. Use one of these instead:

- "I believe I'm not the right person to answer this question. Is there anything that I can do for you?"
- "If I may, I'd rather not talk about that."
- "I'm not really into this topic. Can we proceed with ______?"
:::

## Positive word choice — no imperatives

| Instead of | Say |
| --- | --- |
| You can't | You can… / What you can do is… / Instead you can… / Here's what we can do. |
| I'll try | I'll do my best. / I will. |
| As I told you | As **we** discussed before. / As we agreed to. |
| I don't know | Let me check. / That's a good question — let me verify that for you. |
| We don't handle this | Let me find the right person to help you. / Let me transfer you to the person in charge — they're in the best position to help you. |
| Someone | The person in charge (by name, if possible) |
| I've sent you a message. I don't know if you received it. | I've sent you a message. Have you received it? *(Ask a question — it avoids weird pauses.)* |

Orders become requests:

| Instead of | Say |
| --- | --- |
| Give me your email | May I have your email please? |
| Tell me | Could you please tell me? / Tell me please. |
| You have to ______ | It would really help if you ______. *(Or avoid "you have to" altogether — people answer it with "No, I don't have to do anything.")* |

## Avoiding fillers

Cut the fillers: *amm, hmmm, eeeemm, I mean,* and the rest.

## No noises on the line

No loud breathing, singing, or coughing. If you need to cough, **use mute** — and if you did not manage to, simply apologize.

## Procedures

### HOLD

::::grid
:::card[Steps]{tone=dark}
1. Give the **timeframe** and the **reason**.
2. Ask for **permission** to put the customer on hold.
3. Wait for the agreement.
4. Check the customer is still there, and thank them for waiting.
5. Present the solution — the reason you put them on hold.
:::

:::card[Phrases]{tone=soft}
**1–2.** "May I put you on hold really quick to check this information?"

**3.** "Thank you." — once they agree.

**4.** "*Name*, are you still there? Thank you for waiting."

**5.** "So, what I have found is ______."
:::
::::

### TRANSFER (warm)

1. Ask who's calling.
2. Give the **reason** for the transfer.
3. Ask for **permission**.
4. Wait for the agreement.
5. **Brief the other party** — who is calling and what the situation is.
6. Transfer.

### CALL BACK

::::grid
:::card[Arranging a call back]{tone=dark}
1. Give the **reason** for the call back.
2. Ask for **permission**.
3. Wait for agreement.
4. Set the **time** for the call back.
5. Confirm the customer's phone number.
6. Keep your promise — **call them back.**
:::

:::card[Phrases]{tone=soft}
"May I call you back in 30 minutes / at 3 pm to provide the solution to this issue?"

"What's your best call back number?"

"Awesome, thank you. I will call you back in ______ / at ______."
:::

:::card[Making a call back]{tone=dark}
1. **Identify** yourself and the company.
2. **Confirm** you are talking to the right person — ask their name if they do not give it.
3. **Explain the reason** for the call back, to remind them.
4. **Ask if now still works** — their plans may have changed.
:::

:::card[Phrases]{tone=soft}
"Good morning, this is ______ from Empire National."

"Am I speaking to ______?"

"I'm calling back regarding ______."

"Do you have a few minutes now to discuss this?"
:::
::::

## Communicating with brokers

**With a non-warm broker:**

- Address them **by their name**.
- If you did not catch the name, kindly ask them to repeat it.
- If you still did not understand and there is no way to ask, use **"sir"** or **"ma'am"**.
- *Man, bro, buddy* are only acceptable when the broker uses them first and does not use your name.
- To turn them warm, start using their name.

> **With a warm broker** whose number Compliance already has — send yours in — the forbidden words are allowed.

Each dispatcher should send in a list of their warm brokers' numbers.`,
    quiz: {
      title: "Driver Communication & Customer Service — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "What must your greeting include?",
          options: [
            { text: "Your name and the name of the company", correct: true },
            { text: "Only the company name" },
            { text: "Only your first name" },
            { text: "The load number" },
          ],
        },
        {
          text: "Which of these is a confirmation phrase?",
          options: [
            { text: "Sounds like a plan", correct: true },
            { text: "Hold on" },
            { text: "Whatever works" },
            { text: "I guess so" },
          ],
        },
        {
          text: "Which phrase shows empathy on a difficult call?",
          options: [
            { text: "I know how frustrating it is. I will do my best to help you right now, okay?", correct: true },
            { text: "That is not our problem." },
            { text: "You will have to call back later." },
            { text: "I already told you what happened." },
          ],
        },
        {
          text: "How often should you use the customer's name once they have introduced themselves?",
          options: [
            { text: "At least 2–3 times in the conversation", correct: true },
            { text: "Once, at the very end" },
            { text: "Every single sentence" },
            { text: "Never — it sounds too familiar" },
          ],
        },
        {
          text: "Which forms of address are forbidden on a call?",
          options: [
            { text: "Man, Buddy, Bro, Boss", correct: true },
            { text: "Sir and Ma'am" },
            { text: "The customer's first name" },
            { text: "Mr. and Ms. with a last name" },
          ],
        },
        {
          text: "Which of these belongs to the Closing a call criteria?",
          options: [
            { text: "Thank the customer, offer additional help, and do not hang up first", correct: true },
            { text: "Ask all the necessary questions" },
            { text: "Avoid dead air while you search" },
            { text: "Keep your pitch low and even" },
          ],
        },
        {
          text: "Avoiding dead air and not interrupting fall under which area?",
          options: [
            { text: "Listening", correct: true },
            { text: "Procedures" },
            { text: "Tone of voice" },
            { text: "Greeting" },
          ],
        },
        {
          text: "The three call procedures we are graded on are HOLD, TRANSFER and ____.",
          type: "FILL_BLANK",
          options: [{ text: "CALL BACK" }, { text: "call back" }, { text: "callback" }],
        },
      ],
    },
  },
  {
    slug: "logistics-fundamentals",
    title: "Logistics Fundamentals",
    category: "Logistics Fundamentals",
    summary: "What logistics actually is, how it differs from supply chain, and the six core functions behind every load.",
    estMinutes: 14,
    order: 3,
    content: `## What is logistics?

**Logistics** is the process of planning, managing, and controlling the flow of goods, services, and information from the point of origin to the point of consumption.

In simple terms, logistics answers one question: *how do you deliver the right product to the right place, at the right time, in the right quantity, and at the lowest possible cost?*

The word originated in the military — armies needed a supply system for food, weapons, ammunition, spare parts, and troop transportation. Those same principles were later adopted by the business world.

Why it matters:

- About **65% of all freight** in the USA is transported by trucks (by weight).
- Logistics costs make up a significant portion of the country's GDP.
- No business can operate without logistics — from a small online store to giants like Amazon and Walmart.
- Effective logistics means lower costs and higher customer satisfaction.

## Logistics vs. Supply Chain

These two terms get used interchangeably, but they are not the same thing.

| Criteria | Supply Chain (SCM) | Logistics |
| --- | --- | --- |
| **Scope** | The entire journey from raw materials to the customer | Moving and storing goods |
| **Focus** | Strategy, coordination between partners | Operational efficiency |
| **Time horizon** | Long-term planning | Day-to-day tasks |
| **Metrics** | Overall efficiency, competitiveness | Transportation cost, delivery timelines |

**Supply Chain Management** is the strategic process covering the entire journey of a product: sourcing raw materials, manufacturing, storage, transportation, selling to the end consumer, and after-sales service.

**Logistics** is the operational part of the supply chain — moving and storing goods, and the day-to-day tasks of routing, warehousing, and tracking.

Remember: logistics is a *part* of the supply chain, but not the entire supply chain.

## Types of logistics

- **Inbound logistics** — the movement of raw materials and components *to* the manufacturer (sourcing, warehouse inventory, quality control of incoming materials).
- **Outbound logistics** — the movement of finished products *from* the manufacturer to the customer (packaging, labeling, route planning, tracking to destination).
- **Reverse logistics** — the movement of goods in the opposite direction, from the customer back (returns, repairs/warranty, recycling and disposal).
- **Third-Party Logistics (3PL)** — a company outsources its logistics to an external provider that handles warehousing, transportation, and packaging.
- **Fourth-Party Logistics (4PL)** — an even higher level of outsourcing, where a provider manages the entire supply chain and coordinates multiple 3PLs.
- **Transport logistics** — the part of logistics responsible for moving freight from point A to point B: mode and equipment selection, routing and timing, capacity and carrier choice, execution and tracking, and cost control. This is the part of logistics dispatchers work in every day.

## Core functions of logistics

Every load you touch sits inside these six functions:

1. **Transportation** — moving freight from origin to destination; usually the largest cost in the load's total expense. Key metrics: on-time pickup/delivery, cost per mile, deadhead, detention, claims rate.
2. **Warehousing** — storing goods until they're needed for shipping or production. Key metrics: dock-to-stock time, picking accuracy, storage cost per unit, shrink/damage.
3. **Inventory management** — keeping the right amount of goods available without overstocking (cash tied up, storage cost) or stockouts (lost sales, service failures). Key metrics: inventory turnover, fill rate, stockout rate, days on hand.
4. **Order fulfillment** — the end-to-end process from order received to delivered and confirmed; this is where most of the customer experience is created. Key metrics: order cycle time, OTIF (on time in full), picking/packing accuracy, returns rate.
5. **Packaging** — protects the product and affects cost, damage, trailer utilization, and handling time. Key metrics: damage rate, packaging cost per shipment, cube utilization.
6. **Tracking & visibility** — monitoring freight in real time and keeping all parties informed; reduces "where's my load?" calls and prevents service failures. Key metrics: on-time performance, exception response time, tracking compliance, customer update quality.`,
    quiz: {
      title: "Logistics Fundamentals — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "What question does logistics ultimately answer?",
          options: [
            {
              text: "How do you deliver the right product to the right place, at the right time, in the right quantity, at the lowest cost?",
              correct: true,
            },
            { text: "How do you manufacture a product as cheaply as possible?" },
            { text: "How do you market a product to the right customer?" },
            { text: "How do you price a product competitively?" },
          ],
        },
        {
          text: "How is logistics best described in relation to the supply chain?",
          options: [
            { text: "Logistics is a part of the supply chain, focused on the operational side", correct: true },
            { text: "Logistics and supply chain are unrelated" },
            { text: "Supply chain is a part of logistics" },
            { text: "They are exactly the same thing" },
          ],
        },
        {
          text: "Which type of logistics describes raw materials moving TO the manufacturer?",
          options: [
            { text: "Inbound logistics", correct: true },
            { text: "Outbound logistics" },
            { text: "Reverse logistics" },
            { text: "4PL" },
          ],
        },
        {
          text: "A customer returns a defective product back to the store. What type of logistics is this?",
          options: [
            { text: "Reverse logistics", correct: true },
            { text: "Inbound logistics" },
            { text: "Outbound logistics" },
            { text: "3PL" },
          ],
        },
        {
          text: "What's the key difference between a 3PL and a 4PL provider?",
          options: [
            { text: "A 4PL manages the entire supply chain and can coordinate multiple 3PLs", correct: true },
            { text: "A 3PL only moves freight by air" },
            { text: "A 4PL never touches transportation" },
            { text: "There is no real difference" },
          ],
        },
        {
          text: "Which core function of logistics is usually the largest cost in a load's total expense?",
          options: [
            { text: "Transportation", correct: true },
            { text: "Packaging" },
            { text: "Inventory management" },
            { text: "Order fulfillment" },
          ],
        },
      ],
    },
  },
  {
    slug: "load-securement-and-handling-equipment",
    title: "Load Securement & Handling Equipment",
    category: "Equipment & Trailers",
    summary: "The tools and gear used to load, secure, and protect freight — liftgates, straps, PPE, and more.",
    estMinutes: 9,
    order: 7,
    content: `## Why this equipment matters

Beyond the truck or van itself, a load often depends on the right handling equipment being available at pickup, at delivery, or on the vehicle. Knowing what each tool does helps you understand a load's requirements and spot when something is missing.

## Loading & unloading tools

### Liftgate

A motorized platform at the back of a truck, used at locations **without a loading dock or forklift**. It raises freight from ground level up to the floor of the truck.

![Liftgate on the back of a truck](/Tools/liftgate.jpeg)

### Pallet jack

A manual tool — also called a pallet truck — used to **move pallets** short distances. The forks slide under the pallet and a hand pump lifts it just off the floor.

![Manual pallet jack](/Tools/palletjack.jpg)

### Forklift

Also called a lift truck. It loads or unloads merchandise packed on pallets (or slip sheets) and can **move it short distances**. Forklifts belong to the facility, not to us — if a location has none, the load needs a liftgate or driver assist.

![Forklift](/Tools/forklift.jpeg)

### Ramp

Used when there is **no loading dock available**, so freight can be rolled or walked into the vehicle from ground level.

![Loading ramp](/Tools/ramp.jpg)

### Dolly / hand dolly

A small wheeled cart used to move heavy boxes, appliances, or freight that cannot easily be carried by hand. A **hand dolly** (upright, two-wheel) tips the load back and rolls it on two wheels; a **platform dolly** (four-wheel) slides under the freight and rolls it flat.

![Hand dolly](/Tools/dolly.jpg)

## Securing freight in transit

### Straps

Hold cargo together and secure it in place during transit — either keeping freight tightly packed to minimize movement, or strapping it to the trailer floor. The flexible, soft material prevents damage to the freight itself.

![Cargo straps](/Tools/straps.jpg)

### Shrink wrap (stretch wrap)

Clear plastic film wound tightly around pallets or grouped items to **stabilize and protect** freight in transit. It prevents shifting, keeps boxes together, and offers basic moisture and dust protection. Standard pallet wrap is typically 18" wide.

![Shrink wrap / stretch wrap](/Tools/shrink.jpg)

### E-tracks (E-track system)

Metal rails mounted on the walls or floor of a trailer or box truck, with slots that accept fittings — straps, rings, hooks. They let cargo be tied down at almost **any position along the rail**, without drilling new anchor points.

![E-track rail mounted in a trailer](/Tools/etracks.jpeg)

### Blankets

Keep commodities dry and warm, and protect freight from **scratches, dents, and vibration** during transit.

### Air ride (air-ride suspension)

A suspension setup that reduces **vibration and shock** in transit. Often required for fragile or high-value freight: electronics, medical equipment, glass, and trade show freight.

## PPE (Personal Protective Equipment)

PPE is clothing or equipment worn to minimize risk to a person's health and safety. It should be used *in addition to* other risk controls, not as a replacement for them. Typical PPE for a truck driver includes:

- A long-sleeved shirt and pants
- A high-visibility shirt or vest when working outside the vehicle
- Safety shoes

![Personal protective equipment](/Tools/ppe.png)`,
    quiz: {
      title: "Load Securement & Handling Equipment — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "What is a liftgate used for?",
          options: [
            { text: "A motorized platform at the back of a truck, for locations without a dock or forklift", correct: true },
            { text: "A manual tool to move pallets" },
            { text: "A rail system for tie-down straps" },
            { text: "A type of trailer suspension" },
          ],
        },
        {
          text: "What's the difference between a hand dolly and a platform dolly?",
          options: [
            {
              text: "A hand dolly tips the load back onto two wheels; a platform dolly slides under the freight and rolls it flat",
              correct: true,
            },
            { text: "A hand dolly is motorized and a platform dolly is not" },
            { text: "There is no difference, they're the same tool" },
            { text: "A platform dolly is only used for liquids" },
          ],
        },
        {
          text: "What does an E-track system allow you to do?",
          options: [
            { text: "Tie down cargo at almost any position along the rail without drilling new anchor points", correct: true },
            { text: "Refrigerate freight during transit" },
            { text: "Weigh the truck at a scale" },
            { text: "Track the shipment's GPS location" },
          ],
        },
        {
          text: "Why is air-ride suspension often required for certain freight?",
          options: [
            { text: "It reduces vibration and shock for fragile or high-value freight", correct: true },
            { text: "It increases the truck's top speed" },
            { text: "It replaces the need for straps" },
            { text: "It is required by law for all Sprinter vans" },
          ],
        },
        {
          text: "PPE should be treated as:",
          options: [
            { text: "An addition to other risk controls, not a replacement for them", correct: true },
            { text: "Optional gear that drivers rarely need" },
            { text: "A replacement for all other safety measures" },
            { text: "Only required for hazmat loads" },
          ],
        },
      ],
    },
  },
  {
    slug: "sprinter-van-dimensions",
    title: "Sprinter Van Dimensions & Load Fit",
    category: "Equipment & Trailers",
    summary:
      "Cargo space, feet-to-inches conversions, and how to tell if freight will actually fit and stack.",
    estMinutes: 8,
    order: 8,
    content: `> **Quick rule: 1 ft = 12 in.** Use inches whenever you compare freight dimensions to van space — brokers and shippers quote both, and one bad conversion books a load that physically will not fit.

## Van cargo space (typical)

| Dimension | Range | Average |
| --- | --- | --- |
| **Length** | 10 ft (120 in) to 16 ft (192 in) | 12 ft (144 in) |
| **Width** | 48–56 in | 53 in |
| **Height** | 48–72 in | 70 in |
| **Payload (load weight)** | 1,500–4,500 lbs | 3,000–4,000 lbs |

## Feet to inches (fast conversions)

| Feet | Inches | Feet | Inches |
| --- | --- | --- | --- |
| 0.1 ft | 1.2 in | 9 ft | 108 in |
| 1 ft | 12 in | 10 ft | 120 in |
| 2 ft | 24 in | 11 ft | 132 in |
| 3 ft | 36 in | 12 ft | 144 in |
| 4 ft | 48 in | 13 ft | 156 in |
| 5 ft | 60 in | 14 ft | 168 in |
| 6 ft | 72 in | 15 ft | 180 in |
| 7 ft | 84 in | 16 ft | 192 in |
| 8 ft | 96 in | | |

> Remember that **every Sprinter van has its own dimensions**. Choose your option **carefully and responsibly**, and check the actual van's specs before you promise a fit.

## Stackable vs non-stackable pallets and skids

**Stackable** means another pallet can be safely placed on top of it **during transit** without damaging the product or crushing the packaging. Typically the shipper has:

- strong cartons or crates and a stable base
- palletized freight with an even top surface (or dunnage)
- a defined **max stack height** and/or **max top-load weight**

**Non-stackable** means **nothing can be placed on top**. Common reasons: fragile product, irregular shape, top-heavy freight, "Do Not Stack" cartons, or risk of crushing.

## Why it matters to you

- **It helps you sell the Sprinter option to the broker.** When the freight is stackable, you can explain that the load still fits in a Sprinter because the pallets or pieces can be stacked safely — as long as weight and height limits are respected.
- **It prevents service failures.** Knowing a load is non-stackable stops drivers and warehouses from placing freight on top and causing claims.

## Quick questions to ask

1. *"Are the pallets stackable?"*
2. *"If non-stackable — is that because of **fragile** product, **irregular shape**, or **no top-load allowed**?"*`,
    quiz: {
      title: "Sprinter Van Dimensions & Load Fit — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "How many inches are in one foot?",
          options: [
            { text: "12 inches", correct: true },
            { text: "10 inches" },
            { text: "16 inches" },
            { text: "24 inches" },
          ],
        },
        {
          text: "What is the average cargo length of a Sprinter van?",
          options: [
            { text: "12 ft (144 in)", correct: true },
            { text: "10 ft (120 in)" },
            { text: "16 ft (192 in)" },
            { text: "8 ft (96 in)" },
          ],
        },
        {
          text: "What is the average cargo width of a Sprinter van?",
          options: [
            { text: "53 in", correct: true },
            { text: "48 in" },
            { text: "56 in" },
            { text: "70 in" },
          ],
        },
        {
          text: "What is the standard cargo height to work with?",
          options: [
            { text: "70 in", correct: true },
            { text: "48 in" },
            { text: "53 in" },
            { text: "96 in" },
          ],
        },
        {
          text: "What payload do we treat as the standard working range?",
          options: [
            { text: "3,000–4,000 lbs", correct: true },
            { text: "1,500–2,000 lbs" },
            { text: "4,500–6,000 lbs" },
            { text: "800–1,200 lbs" },
          ],
        },
        {
          text: "What does it mean when freight is stackable?",
          options: [
            { text: "Another pallet can be safely placed on top of it during transit without damaging the product", correct: true },
            { text: "The pallets can be unloaded without a forklift" },
            { text: "The freight can be loaded on its side to save space" },
            { text: "The shipper will stack it for us at pickup" },
          ],
        },
        {
          text: "Why does stackable freight help you sell the Sprinter option to a broker?",
          options: [
            { text: "The pieces can be stacked safely, so the load still fits within the van's weight and height limits", correct: true },
            { text: "Stackable freight is always lighter than non-stackable freight" },
            { text: "Brokers pay a higher rate for stackable freight" },
            { text: "Stackable freight does not need to be secured in transit" },
          ],
        },
        {
          text: "16 feet converts to ____ inches.",
          type: "FILL_BLANK",
          options: [{ text: "192" }],
        },
        {
          text: "A Sprinter van's payload can reach a maximum of ____ lbs.",
          type: "FILL_BLANK",
          options: [{ text: "4500" }, { text: "4,500" }],
        },
        {
          text: "Nothing may be placed on top of a ____ pallet.",
          type: "FILL_BLANK",
          options: [{ text: "non-stackable" }, { text: "nonstackable" }, { text: "non stackable" }],
        },
      ],
    },
  },
  {
    slug: "hazmat-classes-and-rules",
    title: "Hazmat Classes & Rules",
    category: "Hazmat & Restricted Freight",
    summary: "The 9 hazmat classes, the UN/ID verification rule, and when a hazmat load is a no-go.",
    estMinutes: 10,
    order: 9,
    content: `## A dispatcher's job with hazmat

Hazmat is any material that can pose a risk to health, safety, property, or the environment during transportation. In the U.S., hazmat is regulated primarily under DOT/PHMSA (49 CFR).

As a dispatcher, your job is **not** to classify the product from scratch — your job is to verify what the shipper/broker tendered and make sure the driver/carrier can legally haul it.

According to 49 CFR §172.502/172.504, hazardous materials under 454 kg (1,001 lbs) aggregate gross weight can be transported without a hazmat endorsement. If the load would require a hazmat endorsement, hazmat training/certificate, placards, or any other requirement we can't meet — **we do not haul it**. If there's any doubt, escalate to Safety/Compliance and get confirmation in writing before dispatching.

## Critical rule: verify the UN/ID number

Always verify that the **UN/ID number** on the shipping paperwork, load offer, or quote matches the stated hazard class/division.

- The UN/ID number is a 4-digit identifier (e.g., UN1234) used to identify the substance.
- It is tied to a specific proper shipping name and an assigned hazard class/division (sometimes with subsidiary risks).
- The shipper/broker saying "Class 3" is **not enough** on its own.

If the UN/ID number and class don't match, or the UN/ID is missing, or the proper shipping name is unclear — stop and confirm with the broker/shipper before booking. Treat it as a no-go until clarified.

## The 9 hazmat classes

1. **Explosives** — substances/articles designed to explode, or that may explode under certain conditions (Divisions 1.1–1.6, from mass explosion hazard down to extremely insensitive articles).
2. **Gases** — transported under pressure. Division 2.1 flammable, 2.2 non-flammable/non-toxic, 2.3 toxic.
3. **Flammable liquids** — liquids with flammable vapors (gasoline, solvents, many paints/adhesives).
4. **Flammable solids; spontaneously combustible; dangerous when wet** — solids that ignite easily, self-heat, or react with water.
5. **Oxidizers and organic peroxides** — materials that intensify fire or are highly reactive.
6. **Toxic (poison) and infectious substances** — materials that are poisonous or can cause serious health effects.
7. **Radioactive material** — regulated under strict packaging and labeling requirements.
8. **Corrosives** — materials that can cause severe skin burns or corrode metal (acids, bases).
9. **Miscellaneous dangerous goods** — anything that doesn't fit Classes 1–8, such as lithium batteries, environmentally hazardous substances, and dry ice under certain conditions.

See **What Freight We Can NOT Haul** for Empire National's specific rules on Class 9 items like airbags and lithium batteries, and the penalties for hauling hazmat without a qualified driver.`,
    quiz: {
      title: "Hazmat Classes & Rules — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "What is a dispatcher's actual job when it comes to hazmat freight?",
          options: [
            { text: "Verify what was tendered and confirm the driver/carrier can legally haul it — not classify it from scratch", correct: true },
            { text: "Personally determine the hazmat class of every shipment" },
            { text: "Ignore hazmat paperwork if the broker sounds confident" },
            { text: "Always refuse any load that mentions chemicals" },
          ],
        },
        {
          text: "What is the critical rule when a shipper says a load is 'Class 3'?",
          options: [
            { text: "You must verify the UN/ID number on the paperwork matches that class before booking", correct: true },
            { text: "That statement alone is enough to book the load" },
            { text: "Class 3 loads never require verification" },
            { text: "You should immediately refuse the load" },
          ],
        },
        {
          text: "What does a UN/ID number identify?",
          options: [
            { text: "A specific substance, tied to a proper shipping name and hazard class", correct: true },
            { text: "The truck's DOT number" },
            { text: "The broker's MC number" },
            { text: "The driver's endorsement level" },
          ],
        },
        {
          text: "Under 49 CFR §172.502/172.504, what's the weight threshold often cited for hazmat that can move without endorsement?",
          options: [
            { text: "454 kg (1,001 lbs) aggregate gross weight", correct: true },
            { text: "10 lbs" },
            { text: "10,000 lbs" },
            { text: "There is no weight threshold" },
          ],
        },
        {
          text: "If the UN/ID number and the stated hazard class don't match, what should you do?",
          options: [
            { text: "Stop and confirm with the broker/shipper before booking", correct: true },
            { text: "Book the load anyway since the broker gave a class" },
            { text: "Assume the lower-risk class is correct" },
            { text: "Ask the driver to decide" },
          ],
        },
        {
          text: "Which hazmat class covers lithium batteries and similar miscellaneous dangerous goods?",
          options: [
            { text: "Class 9", correct: true },
            { text: "Class 1" },
            { text: "Class 5" },
            { text: "Class 7" },
          ],
        },
      ],
    },
  },
  {
    slug: "what-freight-we-cannot-haul",
    title: "What Freight We Can NOT Haul",
    category: "Hazmat & Restricted Freight",
    summary: "Six categories Empire National will not book — and the real fines and consequences if the rule is broken.",
    estMinutes: 10,
    order: 10,
    content: `## Why this module matters most

Booking one of these loads by mistake doesn't just risk a bad delivery — it can mean a driver arrested, a six-figure fine, or the company impounded and blacklisted. Know these six categories cold.

## 1. Hazmat

- More than 1,000 lbs of hazmat can only move with a hazmat-qualified driver.
- Exception: Class 9, but **never** take airbags over 500 lbs or lithium batteries over 1,000 lbs.
- It is forbidden to send a non-hazmat driver on a load that requires a hazmat driver.

If DOT stops a non-hazmat driver on a hazmat load: driver fine of **$2,000–$15,000**, a major company fine, the vehicle and freight impounded for at least a few days, and the broker will discover we misrepresented our capability — resulting in a FreightGuard report.

## 2. Tobacco / alcoholic beverages

We do not move tobacco. We do not move alcoholic beverages — these loads require alcohol/tobacco permits in specific states, often can't be obtained online, take significant time and money, and need multiple permits if the load crosses more than one state. Alcohol is also frequently packed in glass, making it a fragile load on top of the permit problem.

If DOT stops a driver without all required permits: **prison sentence up to 1 year**, a major company fine depending on the alcohol type/quantity, and a FreightGuard report.

## 3. Hemp / CBD oil

We do not move hemp or CBD oil — we are not legally authorized to. Hemp requires grower/processor/retailer licenses and documented product testing that brokers typically won't provide. CBD is derived from cannabis and contains THC; in most states it is illegal under federal law to ship products with THC over 0.3%.

If DOT stops a driver transporting CBD oil: a **$10,000 fine**, a prison term of **5 to 99 years**, and a major company fine depending on the amount.

## 4. Medical supplies

This category includes special medication (often high-value and/or requiring precise temperature control), specialized medical equipment (often requiring air-ride, load bars, pads, liftgate), and medical glass — highly fragile and **cannot** be transported in a Sprinter or cargo van.

Real example: a high-value medication load (3-day run) was refused because the driver didn't remove a gas canister from the cargo area before loading — the receiver marked it damaged because the medication smelled like gas. The carrier had to move the freight to a recycling facility and received a **$300,000 fine**.

## 5. Gun parts and ammunition

Transporting gun parts or ammunition requires the company to join CTPAT (Customs-Trade Partnership Against Terrorism) — Empire National does not participate in CTPAT. The driver would also need special documents and licenses we don't provide.

If DOT stops the driver: a prison sentence exceeding 1 year, a major company fine, and increased inspections as a CTPAT-related violation.

## 6. High-value loads

High-value loads are freight valued over **$100,000**. Even if our COI (Certificate of Insurance) shows cargo coverage over $100,000, the freight is actually insured by the *driver's* cargo insurance — and most drivers do not carry cargo insurance over $100,000. If anything happens to the freight, the company may be forced to cover the full value out of pocket (real example in the file: $250,000).`,
    quiz: {
      title: "What Freight We Can NOT Haul — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "Above what weight does hazmat require a hazmat-qualified driver?",
          options: [
            { text: "1,000 lbs", correct: true },
            { text: "100 lbs" },
            { text: "10,000 lbs" },
            { text: "There is no limit as long as it's Class 9" },
          ],
        },
        {
          text: "What is the maximum weight of lithium batteries (Class 9) we will ever take?",
          options: [
            { text: "Under 1,000 lbs", correct: true },
            { text: "Under 500 lbs" },
            { text: "Under 5,000 lbs" },
            { text: "Any weight, since it's an exception class" },
          ],
        },
        {
          text: "Why does Empire National refuse hemp and CBD oil loads?",
          options: [
            { text: "We are not legally authorized to move them, and required licensing/testing docs typically aren't available", correct: true },
            { text: "They are too heavy for a Sprinter van" },
            { text: "They require a liftgate" },
            { text: "They are always LTL freight" },
          ],
        },
        {
          text: "Why can medical glass never go in a Sprinter or cargo van?",
          options: [
            { text: "It is highly fragile and unsuited to that equipment", correct: true },
            { text: "It is classified as hazmat Class 1" },
            { text: "It requires a TWIC card" },
            { text: "It is illegal to transport" },
          ],
        },
        {
          text: "What dollar value defines a 'high-value load' in this module?",
          options: [
            { text: "Over $100,000", correct: true },
            { text: "Over $10,000" },
            { text: "Over $1,000,000" },
            { text: "Over $50,000" },
          ],
        },
        {
          text: "Why is a high-value load risky even if our COI shows coverage over $100,000?",
          options: [
            { text: "The freight is actually insured by the driver's cargo insurance, which is usually much lower", correct: true },
            { text: "Our COI never actually covers cargo" },
            { text: "High-value freight is always hazmat" },
            { text: "The broker is responsible for all losses instead" },
          ],
        },
      ],
    },
  },
  {
    slug: "specialized-loads-and-requirements",
    title: "Specialized Loads & Requirements",
    category: "Hazmat & Restricted Freight",
    summary: "Bonded carrier, TWIC, blind shipments, white glove, residential delivery, and Canada loads.",
    estMinutes: 12,
    order: 11,
    content: `## What "requirements" means

Requirements are extra driver, equipment, or security rules that must be met before accepting a load. If a posting or broker mentions one of these and we can't meet it, treat it as a no-go until confirmed.

## Credentials and access

- **Bonded carrier** — a carrier authorized and financially secured (by a customs bond) to move freight still in customs custody. Required for in-bond moves, certain port/terminal moves, and CBP-controlled freight.
- **TWIC card** — Transportation Worker Identification Credential, required for access to many ports, marine terminals, and secure facilities.
- **TSA card / clearance** — a security clearance used for airport/air cargo access; requirements vary by shipper/facility.
- **Hazmat certificate + endorsement** — the hazmat endorsement (H) on a CDL requires a background check, TSA threat assessment, and state testing; some customers also require company or shipper training.
- **Tanker endorsement (N)** — required for transporting liquids/bulk in tanks.
- **Team drivers** — two drivers running the same truck to meet tight transit or appointment requirements, common on expedited/high-priority freight.
- **US citizen / clean background** — some customers (military bases, certain government/defense loads, secure pharma/electronics) require drivers to be US citizens or permanent residents and pass specific background checks.
- **PPE** — safety gear required by the facility; commonly a safety vest, hard hat, safety glasses, steel-toe boots, gloves, or hearing protection.

## Airport pickup vs. airline warehouse pickup

People say "airport pickup," but freight is usually released from a cargo facility or warehouse. **Airport pickup** (on-airport/terminal area) means pickup on airport property with strict check-in rules, ID/credential checks, and possible access restrictions and wait lines. **Airline warehouse pickup** (off-airport or cargo handler facility) can mean easier access, but still has air-cargo rules — release paperwork, appointment windows, cut-off times.

## Blind and double-blind shipments

These terms describe who is allowed to see the shipper/consignee identity, and are common on brokered freight to protect the broker's relationship and prevent "back-soliciting."

- **Blind shipment (single-blind)** — one side is hidden (either the shipper from the consignee, or the reverse). The carrier/dispatcher typically still gets enough detail to execute pickup/delivery, but may be told not to share the full customer identity with the other party.
- **Double-blind shipment** — both sides are hidden from each other. Communication is usually routed through the broker/3PL.

**Dispatcher rules:** follow the RC instructions exactly (labels, BOL notes, what names can be used, who can be contacted). Never reveal shipper/consignee names, addresses, emails, phone numbers, or PO references if the load is blind or double-blind. If a shipper or receiver asks who the other side is, reply that the shipment is blind per broker instructions and direct them to the broker.

## Inside delivery and white glove

- **Inside delivery** — the driver brings freight inside the building, not just to the dock/door. Common requirements: appointment + call-ahead, liftgate/pallet jack, stairs/elevator rules, limited access hours, and photo/signature proof.
- **Red flag:** if the broker/customer mentions unpacking, assembly, debris removal, or room-of-choice, treat it as **white glove** and confirm pricing before accepting.
- **White glove delivery** — inside delivery plus additional handling beyond dock-to-dock: appointment coordination, room-of-choice placement, unpacking, debris removal, assembly. Required for high-value, fragile, medical, retail, residential, or customer-facing shipments.
- **Pallet break-down (de-palletizing)** — at delivery, the driver removes cartons from the pallet instead of dropping the full pallet as one unit. Needed for receivers without forklift/dock access, retail/store deliveries, residential deliveries, or white-glove scope.

## Residential delivery and trade shows

- **Residential delivery** — delivery to a home instead of a commercial dock. Risky because of limited truck access, limited parking/turnaround, gate codes, and a higher chance of failed delivery without a call-ahead. Typically needs an appointment window, call-ahead, liftgate/driver assist, and a signature.
- **Trade show / convention center pickup or delivery** — often drayage-controlled, with strict receiving hours, staging areas, appointment-only access, and lumper/material handling charges.

## Canada loads (cross-border)

Loads crossing the US–Canada border need a passport/valid ID (US citizen or green card holder driver), a border-eligible driver (no restrictions or felonies), and correct customs documents (commercial invoice, manifests, broker info) — sometimes FAST/CTPAT depending on the lane. Before dispatching: confirm the driver is border-eligible, confirm who the customs broker is, and make sure documents/reference numbers are ready.`,
    quiz: {
      title: "Specialized Loads & Requirements — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "What is a bonded carrier authorized to do?",
          options: [
            { text: "Move freight that is still in customs custody, backed by a customs bond", correct: true },
            { text: "Skip all DOT inspections" },
            { text: "Haul hazmat without an endorsement" },
            { text: "Operate without a DOT number" },
          ],
        },
        {
          text: "In a double-blind shipment, what should you never reveal to either party?",
          options: [
            { text: "The other party's name, address, email, phone number, or PO reference", correct: true },
            { text: "The pickup date" },
            { text: "The equipment type" },
            { text: "The weight of the freight" },
          ],
        },
        {
          text: "What's a red flag that an 'inside delivery' is actually white glove?",
          options: [
            { text: "The broker mentions unpacking, assembly, debris removal, or room-of-choice placement", correct: true },
            { text: "The delivery has an appointment window" },
            { text: "The receiver has a dock" },
            { text: "The freight is palletized" },
          ],
        },
        {
          text: "Why is residential delivery considered higher risk?",
          options: [
            { text: "Limited truck access, parking, gate codes, and a higher chance of a failed delivery without a call-ahead", correct: true },
            { text: "It always requires a hazmat endorsement" },
            { text: "It is illegal in most states" },
            { text: "It never requires a signature" },
          ],
        },
        {
          text: "Before dispatching a Canada load, what must you confirm about the driver?",
          options: [
            { text: "That they are border-eligible (valid ID/passport, no disqualifying restrictions)", correct: true },
            { text: "That they have a TWIC card" },
            { text: "That they hold a tanker endorsement" },
            { text: "That they are a team driver" },
          ],
        },
        {
          text: "What's the difference between a blind shipment and a double-blind shipment?",
          options: [
            { text: "Blind hides one side's identity; double-blind hides both sides from each other", correct: true },
            { text: "Blind hides the rate; double-blind hides the equipment type" },
            { text: "There is no real difference" },
            { text: "Double-blind only applies to hazmat loads" },
          ],
        },
      ],
    },
  },
  {
    slug: "documents-and-carrier-packet",
    title: "Documents & Carrier Packet",
    category: "Documents & Paperwork",
    summary: "RC, BOL, POD, scale tickets, and the compliance documents brokers need before they'll dispatch us a load.",
    estMinutes: 13,
    order: 12,
    content: `## The core shipment documents

- **RC (Rate Confirmation)** — the broker/shipper's confirmation of the agreed load details and rate. It defines pay, requirements, and rules (accessorials, tracking, appointments, cancellation/TONU). Always check: PU/DEL addresses + appointment times, commodity, weight, equipment, reference numbers, detention/layover/TONU policy, tracking method, and billing email.
- **BOL (Bill of Lading)** — the main shipping document, acting as a receipt for the freight. Usually signed by the shipper at pickup and the receiver at delivery. Always check: correct shipper/consignee, piece count/weight, seal (if applicable), and that the driver gets a clean copy.
- **POD (Proof of Delivery)** — proof the load was delivered, often a signed BOL with delivery signature and timestamp. Required to invoice and get paid. Always check: receiver signature, delivery date/time, and any OS&D (Over, Short & Damaged) notes.
- **ANNEX** — an appendix to the driver/contractor agreement, usually containing compensation/pay policy, payment schedule, and deductions/charges. When there's a pay or deduction question, check the Annex section of the Agreement first.
- **Scale tickets (light and heavy)** — a scale ticket is a weigh-station receipt (CAT Scale, state scales, etc.). The **light/empty/tare ticket** is the truck + trailer + fuel/driver without the load; the **heavy/loaded/gross ticket** is the truck with the load. Cargo weight = Gross (heavy) − Tare (light). Scale tickets confirm legal axle weights, reduce the risk of overweight citations and out-of-service orders, and document disputes over weight.

## Reference numbers you'll need often

- **PU number** — required to check in at pickup.
- **DEL number** — required to check in at delivery.
- **PO (Purchase Order)** — the customer's order reference, sometimes required on paperwork or at check-in.

## The carrier packet (compliance documents)

A **carrier packet** (or "carrier setup packet") is the bundle of onboarding/compliance documents a broker collects from a carrier before dispatching a load — it verifies we're legal, insured, and safe to do business with, and sets up payment correctly. Once verified, the broker marks the carrier "set up"/"approved" and can issue an RC.

- **W-9** — IRS tax form confirming our legal business name and Tax ID; needed to set up payment.
- **Operating Authority (MC/FMCSA)** — proof of active authority to haul freight for hire; verified via FMCSA SAFER.
- **COI (Certificate of Insurance)** — proof of insurance (Auto Liability, Cargo, General Liability). Always check: active policy dates, coverage limits, cargo coverage amount, and that the legal name matches the carrier.
- **Carrier Agreement / Broker-Carrier Agreement** — the contract setting payment terms, claims rules, and responsibilities (detention policy, lumper reimbursement rules, etc.).

Empire National's info for carrier packets: **Company name** Empire National Inc. **MC number** 966111. **DOT number** 2878524. **Address** 5045 Hendersonville Rd, Unit. 1, Fletcher, NC 28732.

## Onboarding platforms

Many brokers no longer send a PDF packet — they use online onboarding platforms where the carrier signs in, uploads documents, and e-signs everything in one place:

- **MyCarrierPackets (MCP) / MyCarrierPortal** — the most widely used; one profile many brokers can pull from.
- **RMIS** — Registry Monitoring Insurance Services, compliance + insurance monitoring, used by large brokers.
- **Highway** — a modern carrier identity and fraud-prevention platform, very common today.
- **DAT Onboarding / DAT Carrier Suite** — built into the DAT ecosystem for quick broker–carrier setup.

**Tip:** always confirm where the broker wants the packet returned. If they use MyCarrierPackets, RMIS, or Highway, our profile is usually already there — point them to MC# 966111 / DOT# 2878524 and they can pull everything automatically. This is faster and lowers fraud risk for both sides.`,
    quiz: {
      title: "Documents & Carrier Packet — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "What does the Rate Confirmation (RC) define?",
          options: [
            { text: "The agreed pay, load requirements, and rules like accessorials and TONU policy", correct: true },
            { text: "Only the driver's route" },
            { text: "Only the equipment type" },
            { text: "Only the broker's contact info" },
          ],
        },
        {
          text: "What is required to invoice and get paid on a load?",
          options: [
            { text: "POD (Proof of Delivery)", correct: true },
            { text: "The light scale ticket only" },
            { text: "The Annex" },
            { text: "The W-9" },
          ],
        },
        {
          text: "How do you calculate actual cargo weight from scale tickets?",
          options: [
            { text: "Gross (heavy ticket) minus Tare (light ticket)", correct: true },
            { text: "Gross plus Tare" },
            { text: "Tare divided by Gross" },
            { text: "The heavy ticket alone" },
          ],
        },
        {
          text: "What does a carrier packet verify to a broker?",
          options: [
            { text: "That the carrier is legal, insured, and safe to do business with", correct: true },
            { text: "The driver's personal credit score" },
            { text: "The exact route the driver will take" },
            { text: "The fuel price on a given lane" },
          ],
        },
        {
          text: "What should you check on a COI (Certificate of Insurance)?",
          options: [
            { text: "Active policy dates, coverage limits, cargo coverage amount, and matching legal name", correct: true },
            { text: "Only the expiration date" },
            { text: "Only the broker's name" },
            { text: "Nothing, it's the broker's responsibility" },
          ],
        },
        {
          text: "If a broker uses MyCarrierPackets, RMIS, or Highway, what's the fastest way to get set up?",
          options: [
            { text: "Point them to our MC# and DOT# so they can pull our profile automatically", correct: true },
            { text: "Fax them a paper packet" },
            { text: "Refuse to use online platforms" },
            { text: "Email them a photo of the COI" },
          ],
        },
      ],
    },
  },
  {
    slug: "dat-load-board-and-tracking-tools",
    title: "DAT Load Board & Tracking Tools",
    category: "Finding & Booking Loads",
    summary: "How to search DAT for Sprinter van freight, the standard booking flow, red flags, and common tracking apps.",
    estMinutes: 13,
    order: 13,
    content: `## What DAT is

DAT Load Board (often just "DAT") is an online marketplace where brokers/shippers post loads and carriers/dispatchers search for loads that match their truck and lane — think of it like a job board, but for loads instead of jobs.

**Brokers/3PLs** post loads they need moved. **Carriers/dispatchers** search loads matching their truck and lane. A DAT posting typically shows the lane (pickup city/state → delivery city/state), equipment type, pickup/delivery windows, weight/commodity notes (hazmat, team, liftgate, etc.), rate (sometimes posted, sometimes "call for rate"), and broker contact + reference numbers.

## The basic booking flow

1. Filter for the right lane and equipment.
2. Call or email the broker to confirm all details.
3. Negotiate the rate if needed (see **Rates & Bidding** for the full rules).
4. Broker sends the RC (Rate Confirmation).
5. Dispatch the driver, track the load, and collect the POD.

A load board is lead generation, not a guarantee — always verify the broker and load details (rate, appointments, requirements, payment terms) before accepting.

## DAT visual walkthrough

How to search for loads on a **New Search**.

### 1. Choose Search Loads from the menu

![DAT One New Search screen, with Search Loads selected in the left menu](/Tools/dat1.jpg)

### 2. Complete the form with your truck information

- **Origin** — where your truck is, or will be.
- **DH-O** — deadhead from origin: how far you are willing to drive to pick up a load.
- **Destination** — where you want to go. Enter a city, a state, or the zones you are willing to run to. Leaving it blank is the equivalent of "anywhere".
- **DH-D** — deadhead from destination: how far you are willing to drive from your desired destination. Only required when you enter a *city* as the destination.
- **Load Type** — Full, Partial, or both.
- **Equipment Type** — the equipment you are offering.
- **Length** — the length of your trailer.
- **Weight** — the maximum cargo weight you can haul.
- **Date Range** — the dates you are available to pick up a load.

> **Note:** once the required fields above are filled in, the **Search** button turns blue and you can run the search. To narrow it further, add the filters below.

## Setting up your DAT search for Sprinter van loads

Empire National runs **two separate searches**.

### Search 1 — Sprinter Van equipment only

![DAT search filtered to Sprinter Van equipment](/Tools/sprinterFilter.jpg)

- **Origin** — Z0, Z1, Z2, Z3, Z4, Z5, Z6, Z7, Z8, Z9, ZC, ZE, ZM, ZW
- **DH-O** — 150
- **Destination** — Z0, Z1, Z2, Z3, Z4, Z5, Z6, Z7, Z8, Z9, ZC, ZE, ZM, ZW
- **DH-D** — 150
- **Load Type** — Full and Partial
- **Equipment Type** — Sprinter Van (SV), Sprinter Van Team (SM), Sprinter Van Hazmat (SZ)
- **Length** — blank
- **Weight** — blank
- **Date Range** — a month ahead

### Search 2 — other equipment brokers may post a Sprinter load under

Brokers sometimes post freight that a Sprinter can carry under a different equipment type, so the second search covers those.

![DAT search filtered to the alternative equipment types](/Tools/secondFilter.jpg)

- **Origin** — Z0, Z1, Z2, Z3, Z4, Z5, Z6, Z7, Z8, Z9, ZC, ZE, ZM, ZW
- **DH-O** — 150
- **Destination** — Z0, Z1, Z2, Z3, Z4, Z5, Z6, Z7, Z8, Z9, ZC, ZE, ZM, ZW
- **DH-D** — 150
- **Load Type** — Full and Partial
- **Equipment Type** — Straight Box Truck (SB), Van Hotshot (VH), Van Logistics (VL), Moving Van (MV)
- **Length** — blank
- **Weight** — 4,500 lbs maximum
- **Date Range** — a month ahead

## DAT red flags — treat as a no-go

If a posting includes any of these, do not call, text, or email — treat it as a no-go until independently verified:

- Bonded carrier required.
- 26 ft. box truck (BT) or straight box (SB).
- Dock high / height required.
- Pallet jack (PJ) + liftgate (LG) required.
- Hazmat certificate or endorsement required.
- More than $250,000 of insurance coverage required.
- "No Sprinter Van" / "No SV" noted on the posting.
- Seal required.
- Commodity not covered by our insurance policy (see **What Freight We Can NOT Haul**).
- Dimensions larger than a Sprinter van can fit — always double-check in CRM.
- Broker's email domain is @gmail.com, @yahoo.com, or otherwise doesn't match their company name.

## Tracking applications

Tracking (visibility) platforms let dispatchers, brokers, and shippers monitor a shipment from pickup to delivery — live location/ETA, delay alerts, an auditable timeline of milestones, and support for accessorial disputes. Common platforms in the industry:

- **Macropoint** — carrier/location tracking widely used by brokers, integrates with many TMS systems.
- **Trucker Tools** — driver-facing app for load tracking and capacity.
- **Turvo Tracking** — real-time shipment visibility and collaboration across carriers, brokers, and shippers.
- **Project44** — enterprise visibility platform with automated tracking and ETA.

**Rule of thumb:** if the customer requires a specific tracking method, treat it as a load requirement and confirm the driver can comply *before* you accept the load.`,
    quiz: {
      title: "DAT Load Board & Tracking Tools — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "What's the correct order of the basic DAT booking flow?",
          options: [
            { text: "Filter loads → confirm with broker → negotiate → get RC → dispatch and track", correct: true },
            { text: "Dispatch the driver → find a load → get the RC" },
            { text: "Negotiate first → filter loads → dispatch" },
            { text: "Get the RC → filter loads → confirm with broker" },
          ],
        },
        {
          text: "For the Sprinter van DAT search, what's the deadhead (DH-O / DH-D) setting?",
          options: [
            { text: "150 miles", correct: true },
            { text: "50 miles" },
            { text: "500 miles" },
            { text: "Unlimited" },
          ],
        },
        {
          text: "Which equipment codes are used in the SECOND search (for brokers who might post a Sprinter shipment under a different type)?",
          options: [
            { text: "SB, VH, VL, MV", correct: true },
            { text: "SV, SM, SZ" },
            { text: "RGN, LTL, FTL" },
            { text: "COI, RC, BOL" },
          ],
        },
        {
          text: "A DAT posting requires a broker's email domain to be checked. What's a red flag?",
          options: [
            { text: "The domain is @gmail.com or otherwise doesn't match the broker's company name", correct: true },
            { text: "The domain matches the broker's company name exactly" },
            { text: "The email includes the broker's phone number" },
            { text: "The domain ends in .com" },
          ],
        },
        {
          text: "If a posting requires 'Dock high' and a liftgate, what should you do?",
          options: [
            { text: "Treat it as a no-go — this is a listed DAT red flag", correct: true },
            { text: "Book it immediately, since Sprinters can always meet this" },
            { text: "Only worry about it after pickup" },
            { text: "Ask the driver to improvise" },
          ],
        },
        {
          text: "What should you confirm before accepting a load with a required tracking method?",
          options: [
            { text: "That the driver can actually comply with that specific tracking method", correct: true },
            { text: "Nothing — tracking method never affects booking" },
            { text: "Only the broker's MC number" },
            { text: "The reefer temperature setting" },
          ],
        },
      ],
    },
  },
  {
    slug: "accessorials-and-additional-charges",
    title: "Accessorials & Additional Charges",
    category: "Dispatch Workflow",
    summary: "The extra charges on top of linehaul, and exactly what Empire National pays drivers for each one.",
    estMinutes: 11,
    order: 15,
    content: `## What accessorials are

Accessorials are extra charges on top of the linehaul rate. They apply when a load requires additional time, labor, equipment, risk, or special handling: detention, layover/overnight, TONU (Truck Ordered Not Used), driver assist, loading/unloading labor, residential pickup/delivery, inside delivery/pickup, extra stops, extra miles, and extra/overweight freight.

## What Empire National pays drivers

**TONU (Truck Ordered Not Used)**
- If the driver went less than 50 miles toward pickup: **$50**.
- If the driver went more than 50 miles toward pickup: **$1/mile, max $150**.
- Not paid if the cancellation is due to the driver being late, driver actions/inactions, or a cancellation within 15 minutes of confirmation (or 12 hours before a non-same-day pickup appointment).

**Detention**
- Starts **2 hours** after check-in with Operations, within the confirmed appointment time.
- **$20/hour, max $150.**
- Requires the shipper/receiver to write arrival and departure times on the BOL.
- Not paid if the driver missed the pickup/delivery window (unless it was outside the driver's control).

**Layover / Overnight**
- Overnight or 24-hour layover at PU/DEL: **$150 per 24-hour period.**
- Layover past the first 24 hours: **$150 per additional 24-hour period.**
- Weekend layover: **$300 total.**
- Not paid if the driver arrived late (unless outside their control).

**Loading/Unloading (labor)**
- **$10 per 150 lbs.** Must be authorized by Dispatcher or Operations, and notated on the BOL/POD — otherwise it's not paid.

**Driver assistance (helping with loading/unloading)**
- **$5 per 150 lbs.** Same authorization and BOL/POD notation rule applies.

**Extra weight**
- If actual pickup weight exceeds 1,500 lbs: **+$10 per 100 lbs over 1,500 lbs.**
- The driver may refuse if weight exceeds the vehicle's payload on file.

**Extra miles**
- Paid at the same $/mile rate as the shipment on the RC. Example: $800 / 1,000 mi = $0.80/mi, so extra miles are paid at $0.80/mi.

**Extra stops**
- **$50 per additional stop** beyond what's on the RC.

**Extra space**
- If the actual load size exceeds the stated size, there is **no additional compensation** — the company books the entire space regardless.

## Bid time rule

A driver has **15 minutes** after giving a bid to our company before it expires. If you need more time to work on a load, ask the driver to stand by for 5–10 more minutes — but they're allowed to decline.`,
    quiz: {
      title: "Accessorials & Additional Charges — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "When does detention pay start, and what's the rate?",
          options: [
            { text: "2 hours after check-in, $20/hour up to $150", correct: true },
            { text: "Immediately at check-in, $50/hour" },
            { text: "4 hours after check-in, $10/hour" },
            { text: "Detention is never paid" },
          ],
        },
        {
          text: "What's required for detention to actually be paid?",
          options: [
            { text: "The shipper/receiver must write arrival and departure times on the BOL", correct: true },
            { text: "Nothing, it's automatic" },
            { text: "A phone call to the broker only" },
            { text: "A signed customer service form" },
          ],
        },
        {
          text: "What's the TONU pay if the driver went 80 miles toward pickup before the load was cancelled?",
          options: [
            { text: "$1/mile up to a max of $150", correct: true },
            { text: "A flat $50 regardless of miles driven" },
            { text: "Nothing, TONU only applies under 50 miles" },
            { text: "$1,000 flat" },
          ],
        },
        {
          text: "What's the flat rate for a weekend layover?",
          options: [
            { text: "$300 total", correct: true },
            { text: "$150 total" },
            { text: "$20/hour" },
            { text: "$1,000 total" },
          ],
        },
        {
          text: "What must happen before loading/unloading labor or driver assist charges are paid?",
          options: [
            { text: "It must be authorized by Dispatcher or Operations and notated on the BOL/POD", correct: true },
            { text: "The driver just needs to mention it verbally" },
            { text: "Nothing — it's always paid automatically" },
            { text: "Only the broker needs to approve it" },
          ],
        },
        {
          text: "How long does a driver's bid stay valid before it expires?",
          options: [
            { text: "15 minutes", correct: true },
            { text: "1 hour" },
            { text: "5 minutes" },
            { text: "24 hours" },
          ],
        },
      ],
    },
  },
  {
    slug: "safety-cancellations-and-customer-service",
    title: "Safety, Cancellations & Customer Service",
    category: "Safety & Service",
    summary: "How to handle a forced cancellation without a FreightGuard report, safe blind quoting, and why service quality protects revenue.",
    estMinutes: 11,
    order: 16,
    content: `## FreightGuard: why cancellations are dangerous

**FreightGuard (FG)** is a public report a broker can post about a carrier on freight-industry platforms. It can immediately damage the company's reputation, make it harder to book loads, trigger broker blocks/DNU decisions, lower trust, reduce rate opportunities, and lead to direct financial losses and internal penalties. Some FG situations require immediate escalation to Compliance to prevent the report or respond correctly.

## Steps to take if you're forced to cancel a load

1. **Notify your TL immediately.** Chat your TL (and tag them) and explain why the load has to be cancelled — driver issue, equipment failure, no available option, broker request, accident, weather/road closure, etc.
2. **Try to save the load first**, if the cancellation is on our side. Before calling it a cancellation, look for a replacement option that still meets the RC requirements (PU/DEL times, dims, weight, certifications).
   - **Breakdown on the way to pickup** — find a recovery truck that still meets the pickup appointment, dims, weight, and any special requirements.
   - **Breakdown on the way to delivery** — first confirm whether the freight can be transloaded by hand (no forklift needed). If yes, find the closest available truck that can still meet the delivery window. If no (too heavy/large), arrange a cross-dock service to reload with a forklift onto the recovery truck.
   - Only move to cancellation after recovery options are exhausted.
3. **Communicate with the broker — call first, then email.** Call as soon as you know; every minute of delay reduces the broker's chance to recover the load and increases FreightGuard risk.
   - **Offer help, not just a problem.** If we have a recovery option, present it first (truck, ETA, equipment match). If not, ask if it would help to keep watching and call back if something opens up.
   - **Keep the reason short and honest.** Examples: "Driver's truck went down on the way to pickup," "Driver had a personal emergency," "We could not source compliant equipment in time." No long stories, no detailed blame on the driver.
   - **Don't argue or negotiate the cancellation.** If the broker is upset, let them speak, acknowledge it ("I understand, that's on us"), and move on — arguing increases FG risk.

## Safe blind quoting

**Blind quoting** means giving a rate to the broker before a specific driver/truck is confirmed for the load. It keeps you competitive on hot lanes, but it's also how a load gets booked that can't actually be covered. Before blind quoting, run the load through these five checks:

1. It ships from a popular or high-volume area (check the number of trucks in CRM for that area).
2. Dimensions and weight fit any Sprinter van.
3. No special requirements for the shipment.
4. Delivery lands in a popular or high-demand area, so the driver can get the next load.
5. The pickup timeframe isn't too short, and the shipment isn't truly ASAP.

## Customer service is a dispatcher skill

Dispatch isn't only moving freight — it's managing people, expectations, and problems in real time. Strong customer service:

- **Prevents service failures** — clear communication reduces missed appointments, wrong addresses, wrong equipment, and misunderstandings.
- **Protects revenue** — professional issue handling avoids rate reductions, chargebacks, detention disputes, FreightGuard reports, and broker DNU/blacklist decisions.
- **Keeps loads moving** — proactive updates reduce "where's my truck?" calls and make rescheduling easier when something goes wrong.
- **Improves negotiation outcomes** — a calm, confident tone builds trust and helps you hold the rate and get faster approvals.
- **Strengthens relationships** — brokers and shippers return to dispatchers who are easy to work with, honest, and consistent — meaning more repeat lanes and better-paying loads.
- **Supports the driver** — respectful communication lowers conflict and helps you get accurate ETAs and early problem reports.`,
    quiz: {
      title: "Safety, Cancellations & Customer Service — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "What's the very first step when you're forced to cancel a load?",
          options: [
            { text: "Notify your TL immediately and explain why", correct: true },
            { text: "Call the broker first, before telling anyone internally" },
            { text: "Wait until the pickup time passes" },
            { text: "Email accounting" },
          ],
        },
        {
          text: "Before actually cancelling a load, what should you try first?",
          options: [
            { text: "Look for a recovery option that still meets the RC requirements", correct: true },
            { text: "Immediately notify the broker with no other action" },
            { text: "Wait for the broker to ask what happened" },
            { text: "Nothing — cancel right away to save time" },
          ],
        },
        {
          text: "When communicating a cancellation to the broker, what's the right approach?",
          options: [
            { text: "Call first, keep the reason short and honest, and don't argue if they're upset", correct: true },
            { text: "Send a long detailed email blaming the driver" },
            { text: "Avoid contacting them until they ask" },
            { text: "Argue the point if the broker pushes back" },
          ],
        },
        {
          text: "Which of these is NOT one of the five safe blind-quoting checks?",
          options: [
            { text: "The broker's email domain is a Fortune 500 company", correct: true },
            { text: "Dimensions and weight fit any Sprinter van" },
            { text: "Delivery lands in a popular or high-demand area" },
            { text: "The pickup timeframe isn't unreasonably short" },
          ],
        },
        {
          text: "How does strong customer service protect revenue?",
          options: [
            { text: "It helps avoid rate reductions, chargebacks, detention disputes, and FreightGuard reports", correct: true },
            { text: "It has no real effect on revenue" },
            { text: "It only matters for brand image, not money" },
            { text: "It only affects driver pay" },
          ],
        },
      ],
    },
  },
  {
    slug: "accounting-for-dispatchers",
    title: "Accounting for Dispatchers",
    category: "Accounting & Compliance",
    summary: "Approved payment methods, broker blacklist checks, scam red flags, and how factoring through OTR Capital works.",
    estMinutes: 12,
    order: 17,
    content: `## Payment methods Empire National accepts

- ACH
- Wire
- Zelle — **only** with Accounting department approval
- Payment through **OTR Capital** (our factoring company)
- Check, mailed to 5045 Hendersonville Rd, Unit. 1, Fletcher, NC 28732 — **only** with Accounting department approval

Empire National does not accept any other payment method, no exceptions. We also don't accept payment terms higher than **Net 30**, and we don't accept COD, physical checks outside the approval above, EFS, Cash App, or anything else not approved.

## Before you accept a load: is the broker blacklisted?

1. Check CRM (search by broker name/MC).
2. Ask Nicole (Accounting) or Compliance about other issues.
3. Remember: warm, familiar brokers can be blocked too — don't assume.
4. Never accept a load until the broker is confirmed g2g (good to go).

If you book with a blacklisted broker, Accounting has no jurisdiction over the loss, and **the dispatcher is responsible** for the total charges.

## Scam / fraud red flags

- The broker's email domain doesn't match their real domain/MC.
- Suspected double brokerage — compare the RC to past loads, and ask a manager/accounting.
- A broker "randomly" offers many loads in a single day or week — treat this as a scam signal and check with Accounting.

Note: a broker can also be blocked by other departments — if so, confirm with Compliance.

## What "good" looks like on an RC

- Broker name and contact info are consistent, without odd formatting or mismatched details.
- Carrier shows Empire National Inc (MC 966111 / DOT 2878524).
- Load info is complete: PU/DEL, dates, commodity, equipment.
- No missing or "pending" fields that should be confirmed before dispatch.
- If anything feels off, stop and verify with Accounting/manager before moving forward.

## Filling out a carrier package

- Make sure the broker is approved by OTR or by Nicole to bill direct.
- Ask Accounting (Nicole / Accounting TL) to provide the accounting info requested.
- Only use payment terms/methods approved by Nicole — no term, payment method, or account can be filled in without Accounting's authorization.

## OTR Capital (factoring) vs. direct invoice

**OTR is our factoring company** — prefer it whenever possible. OTR purchases our loads and charges the broker, then sends Empire National daily payments for purchased loads (with a 5% fee). The broker has 90 days to pay OTR, and OTR can offset deductions (late driver, no tracking app, 90-day chargeback).

- **NOA (Notice of Assignment)** — the broker pays OTR directly (OTR is purchasing our load).
- **LOR (Letter of Release)** — Empire National invoices the broker directly.

**Direct invoice** (when OTR isn't used) is when broker verification matters most. Empire National invoices the broker directly by email, terms are more restricted for cash flow, and if the broker doesn't pay or reply after Net 30, we file a claim. A claim won't follow if insurance is missing or expired — never book a broker with pending insurance cancellation. If a broker can't meet Empire National's payment terms, do **not** book unless Nicole or your manager approves.

## Why you might get a chargeback (CB) from Accounting

Changing a broker (B) rate down, or a driver (D) rate up, in the following month can artificially inflate profit — and that's wrong, so Empire National will charge it back. Always notify Accounting about any rate change so the load can be reinvoiced, paid, or deducted correctly.

## What's the worst that can happen?

If the company gets scammed, we lose both the broker's rate and the driver's rate (the driver still gets paid) — and that loss can be charged directly to you. There's also reputation risk (FreightGuard, claims), and scammers can let unpaid balances age before anyone notices. This is why every check in this module exists.`,
    quiz: {
      title: "Accounting for Dispatchers — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "Which payment method does Empire National accept WITHOUT needing special Accounting approval?",
          options: [
            { text: "ACH, Wire, or payment through OTR Capital", correct: true },
            { text: "Zelle, no approval needed" },
            { text: "Physical check to any address" },
            { text: "Cash App" },
          ],
        },
        {
          text: "What's the maximum payment term Empire National accepts from a broker?",
          options: [
            { text: "Net 30", correct: true },
            { text: "Net 60" },
            { text: "Net 90" },
            { text: "There is no maximum" },
          ],
        },
        {
          text: "If you book a load with a blacklisted broker, who is responsible for the total charges?",
          options: [
            { text: "The dispatcher who booked it", correct: true },
            { text: "Accounting, automatically" },
            { text: "The broker's insurance" },
            { text: "No one — it's written off" },
          ],
        },
        {
          text: "What's a scam red flag on a broker's email?",
          options: [
            { text: "The domain doesn't match the broker's real company/MC", correct: true },
            { text: "The email includes a phone number" },
            { text: "The email is signed by a named employee" },
            { text: "The domain matches the broker's company name" },
          ],
        },
        {
          text: "What's the difference between an NOA and an LOR?",
          options: [
            { text: "NOA means the broker pays OTR directly; LOR means Empire National invoices the broker directly", correct: true },
            { text: "NOA is for Canada loads only" },
            { text: "LOR is a type of hazmat certificate" },
            { text: "They are the same document with different names" },
          ],
        },
        {
          text: "Why would Accounting issue a chargeback for changing a rate the following month?",
          options: [
            { text: "Because lowering a broker rate or raising a driver rate later can artificially inflate profit", correct: true },
            { text: "Rate changes are never allowed for any reason" },
            { text: "Only the broker can request rate changes" },
            { text: "Chargebacks only apply to hazmat loads" },
          ],
        },
      ],
    },
  },
];

const trackingModules: SeedModule[] = [
  {
    slug: "welcome-to-the-tracking-team",
    title: "Welcome to the Tracking Team",
    category: "Company & Culture",
    summary: "What the tracking desk does and how it supports dispatch and the customer.",
    estMinutes: 7,
    order: 1,
    department: "TRACKING",
    content: `## What tracking does

The tracking team keeps a live, accurate picture of every load in transit. Where dispatchers plan and book loads, trackers monitor them once they're moving — confirming location, flagging delays early, and making sure the customer always has an up-to-date ETA.

## Why it matters

A late load with no warning damages trust with the customer. A late load that was flagged two hours in advance is just a normal Tuesday. Your job is to be the early-warning system.

## How the team is organized

- **Trackers** — monitor an assigned group of loads each shift, log check calls, and escalate exceptions.
- **Dispatchers** — book and assign loads; hand off to tracking once a driver is en route.
- **Operations Manager** — resolves escalations that trackers can't clear on their own.
- **Customer / Sales team** — relies on tracking updates to keep shippers informed.

## What we expect from a tracker

- **Frequent, accurate updates** — logged in the TMS, not just remembered.
- **Early escalation** — flag a likely delay as soon as you see it, not after the appointment is missed.
- **Clear communication** — with drivers, dispatch, and the customer-facing team.
- **Ownership** — if a load is on your board, you're watching it until it delivers.

The next module covers the day-to-day mechanics: check-call cadence, what to log, and when to escalate.`,
  },
  {
    slug: "check-calls-and-exception-handling",
    title: "Check Calls & Exception Handling",
    category: "Tracking Workflow",
    summary: "The check-call cadence, what to log, and when to escalate a delay.",
    estMinutes: 10,
    order: 2,
    department: "TRACKING",
    content: `## The check-call cadence

- **At pickup** — confirm the driver loaded on time and the BOL matches expectations.
- **Mid-route** — at least once per shift on multi-day runs, more often as the delivery window approaches.
- **Pre-delivery** — confirm ETA against the appointment window with enough lead time to notify the customer of any change.
- **At delivery** — confirm delivery time and that the BOL was signed and returned.

## What counts as an exception

Anything that puts the delivery appointment at risk: traffic, a breakdown, a missed pickup window, a driver going off-route, or simply going quiet past your check-in cadence. Exceptions get logged and escalated — they don't get "waited out."

## Logging standards

Every check call and exception goes in the TMS, not just a text thread. The next shift needs to see exactly what happened without having to ask around. A good log entry has three things: what happened, what you did about it, and what the current ETA is.

## When to escalate

- **To dispatch** — if the driver needs a new plan (reroute, reassignment, HOS issue).
- **To the customer-facing team** — as soon as you know an appointment will be missed, not after it passes.
- **To the Operations Manager** — for anything you can't resolve within your shift: accidents, serious breakdowns, or a driver who's gone unreachable.

## Best practices

- Always give the customer-facing team a real ETA, not an optimistic one.
- Keep a professional, respectful tone with drivers — a good relationship with tracking makes their day easier.
- Never let a load go quiet. A quick "still on schedule" update is better than silence.`,
    quiz: {
      title: "Check Calls & Exception Handling — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "When should a tracker do a check call to confirm the load matches the BOL?",
          options: [
            { text: "At pickup", correct: true },
            { text: "Only at delivery" },
            { text: "Only if the driver calls in" },
            { text: "Never — that's dispatch's job" },
          ],
        },
        {
          text: "Which of these counts as an exception that should be logged and escalated?",
          options: [
            { text: "A driver who has gone quiet past the check-in cadence", correct: true },
            { text: "A driver confirming an on-time delivery" },
            { text: "A normal mid-route check call with no issues" },
            { text: "A completed BOL signature" },
          ],
        },
        {
          text: "Where should every check call and exception be logged?",
          options: [
            { text: "In the TMS, so the next shift can see it", correct: true },
            { text: "In a personal notebook" },
            { text: "Only in a text message thread" },
            { text: "It doesn't need to be logged" },
          ],
        },
        {
          text: "When should the customer-facing team be told a delivery appointment will be missed?",
          options: [
            { text: "As soon as the tracker knows", correct: true },
            { text: "After the appointment has already passed" },
            { text: "Only if the customer asks" },
            { text: "It's not tracking's job to tell them" },
          ],
        },
      ],
    },
  },
];

const hrModules: SeedModule[] = [
  {
    slug: "welcome-to-empire-national-hr",
    title: "Welcome to Empire National HR",
    category: "Company & Culture",
    summary: "The role HR plays across the company and what new HR team members own.",
    estMinutes: 7,
    order: 1,
    department: "HR",
    content: `## What HR does at Empire National

HR supports every person in the building — drivers, dispatchers, trackers, and office staff alike. That means onboarding new hires, maintaining accurate personnel records, answering benefits and policy questions, and making sure the company stays compliant with employment law.

## Why it matters

Dispatch keeps freight moving; HR keeps the company itself running — hiring, records, compliance, and support for every employee's day-to-day questions. A well-run HR desk is often invisible when it's working right, and very visible when it isn't.

## How the team is organized

- **HR Generalists** — handle onboarding, records, and day-to-day employee questions.
- **Recruiting** — sources and screens candidates for open roles.
- **Payroll & Benefits** — administers pay, benefits enrollment, and related questions.
- **HR Manager** — owns policy decisions and handles escalations.

## What we expect from an HR team member

- **Confidentiality** — personnel records and personal information are never shared outside of a legitimate business need.
- **Accuracy** — records that are wrong cause real problems for real people (pay, benefits, compliance).
- **Responsiveness** — employees relying on you for an answer deserve a timely one.
- **Consistency** — policies get applied the same way for everyone.

The next module covers the basics of employee records and the compliance requirements every HR team member should know.`,
  },
  {
    slug: "employee-records-and-compliance-basics",
    title: "Employee Records & Compliance Basics",
    category: "HR Workflow",
    summary: "The core records HR maintains and the confidentiality rules that protect them.",
    estMinutes: 10,
    order: 2,
    department: "HR",
    content: `## Core employee records

- **I-9 (Employment Eligibility Verification)** — completed for every new hire within the legally required window; confirms the employee is authorized to work in the U.S.
- **Personnel file** — application, offer letter, signed policy acknowledgments, and performance records.
- **Driver Qualification (DQ) file** — for driving positions: CDL, medical certificate, and driving record. Owned jointly with Safety.
- **Benefits enrollment records** — health coverage, retirement plan elections, and beneficiary designations.

## Confidentiality rules

Personnel records are private by default. A few ground rules:

- Never discuss one employee's pay, discipline, or personal information with another employee.
- Only share personnel information with someone who has a legitimate business need to know — a manager checking on their own report's status, for example.
- Store and send sensitive documents (SSNs, medical info, ID copies) only through approved, secure channels — never by casual email or chat.
- If you're ever unsure whether you can share something, ask the HR Manager first. It's much easier to release information later than to take it back.

## Compliance basics

- New-hire paperwork (I-9, tax forms, policy acknowledgments) must be completed accurately and on time — missed I-9 deadlines carry real legal risk for the company.
- Personnel files must be kept accurate and current — an outdated file can cause real problems at audit time or when an employee needs something from it.
- Employment law (wage and hour rules, leave policies, anti-discrimination law) applies to every decision HR makes — when in doubt, escalate to the HR Manager rather than guessing.

## When to escalate

Any question involving termination, a legal complaint, a workplace safety incident, or something you're not sure is allowed should go to the HR Manager before you act.`,
    quiz: {
      title: "Employee Records & Compliance Basics — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "What does the I-9 form confirm about a new hire?",
          options: [
            { text: "That they are authorized to work in the U.S.", correct: true },
            { text: "Their salary history" },
            { text: "Their driving record" },
            { text: "Their benefits elections" },
          ],
        },
        {
          text: "Can you discuss one employee's pay or discipline with another employee?",
          options: [
            { text: "No — personnel information is only shared on a need-to-know basis", correct: true },
            { text: "Yes, if they ask nicely" },
            { text: "Yes, as long as it's true" },
            { text: "Only if they work in the same department" },
          ],
        },
        {
          text: "What should you do if you're unsure whether you're allowed to share a piece of personnel information?",
          options: [
            { text: "Ask the HR Manager before sharing it", correct: true },
            { text: "Share it and see what happens" },
            { text: "Only share part of it" },
            { text: "Ignore the request" },
          ],
        },
        {
          text: "Which of these should always be escalated to the HR Manager?",
          options: [
            { text: "A termination or legal complaint", correct: true },
            { text: "A routine benefits enrollment question" },
            { text: "Updating a mailing address" },
            { text: "Filing a completed I-9" },
          ],
        },
      ],
    },
  },
];

const glossaryTerms: { term: string; fullName?: string; definition: string; order: number }[] = [
  {
    term: "TMS",
    fullName: "Transportation Management System",
    definition:
      "Transportation Management System — the software used to create loads, assign drivers, and track status.",
    order: 1,
  },
  {
    term: "ELD",
    fullName: "Electronic Logging Device",
    definition:
      "Electronic Logging Device — records a driver's hours of service automatically; replaces paper logbooks.",
    order: 2,
  },
  {
    term: "HOS",
    fullName: "Hours of Service",
    definition: "Hours of Service — federal rules limiting how long a driver may drive and remain on duty.",
    order: 3,
  },
  {
    term: "Check call",
    definition: "A scheduled call to a driver to confirm location, progress, and any delays.",
    order: 4,
  },
  {
    term: "Rate confirmation",
    definition: "The document confirming the agreed price and terms for hauling a specific load.",
    order: 5,
  },
  {
    term: "Detention",
    definition: "Time a driver is held at a shipper or receiver beyond the agreed free time, often billable.",
    order: 6,
  },
  {
    term: "Deadhead",
    definition: "Miles driven with an empty trailer, typically en route to the next pickup.",
    order: 7,
  },
  {
    term: "BOL",
    fullName: "Bill of Lading",
    definition:
      "Bill of Lading — the legal document confirming what freight was picked up, from where, and going to where.",
    order: 8,
  },
  {
    term: "OTR",
    fullName: "Over-the-Road",
    definition: "Over-the-Road — long-haul driving where a driver is away from home for multiple days at a time.",
    order: 9,
  },
  {
    term: "Reefer",
    fullName: "Refrigerated Trailer",
    definition: "A refrigerated trailer with a built-in temperature-control unit, used for perishable freight.",
    order: 10,
  },
  {
    term: "Lumper",
    definition: "A third-party worker paid to load or unload freight at a dock, and the fee charged for that service.",
    order: 11,
  },
  {
    term: "CDL",
    fullName: "Commercial Driver's License",
    definition: "Commercial Driver's License — required to legally operate most commercial trucks.",
    order: 12,
  },
  {
    term: "Power only",
    definition: "A load where the carrier supplies just the tractor and driver to pull a trailer owned by someone else.",
    order: 13,
  },
  {
    term: "34-hour restart",
    definition: "34 consecutive hours off duty that resets a driver's weekly (60/70-hour) on-duty clock.",
    order: 14,
  },
  {
    term: "Drop and hook",
    definition:
      "Dropping a loaded or empty trailer at a location and hooking up to a different one already there, instead of waiting to be loaded/unloaded.",
    order: 15,
  },
  {
    term: "RC",
    fullName: "Rate Confirmation",
    definition:
      "Document confirming the agreed rate, terms, and load details (PU/DEL info, accessorials, detention/TONU, tracking requirements).",
    order: 16,
  },
  {
    term: "POD",
    fullName: "Proof of Delivery",
    definition: "Proof the load was delivered (often a signed BOL or a separate document); needed for invoicing and getting paid.",
    order: 17,
  },
  {
    term: "POC",
    fullName: "Point of Contact",
    definition: "The person to call at the shipper/receiver for questions about appointments, access, delays, or on-site issues.",
    order: 18,
  },
  {
    term: "TONU",
    fullName: "Truck Ordered Not Used",
    definition:
      "Fee/compensation when the truck/van was dispatched but the load is cancelled or not loaded. Amount/conditions are usually stated in the RC.",
    order: 19,
  },
  {
    term: "FCFS",
    fullName: "First Come, First Served",
    definition: "No set appointment time; loading/unloading is handled in order of arrival.",
    order: 20,
  },
  {
    term: "PU",
    fullName: "Pick Up",
    definition: "Pickup (loading) location/event: address, time window, instructions, contacts.",
    order: 21,
  },
  {
    term: "DEL",
    fullName: "Delivery",
    definition: "Delivery (unloading) location/event: address, time window, instructions, contacts.",
    order: 22,
  },
  {
    term: "SV",
    fullName: "Sprinter Van",
    definition:
      "Equipment type: sprinter van. Common for expedited/last-mile freight; often no ELD/HOS requirement if GVWR is under 10,001 lbs (verify).",
    order: 23,
  },
  {
    term: "CV",
    fullName: "Cargo Van",
    definition: "Equipment type: cargo van (Transit/ProMaster, etc.). Often used for local/last-mile/expedite loads.",
    order: 24,
  },
  {
    term: "BT",
    fullName: "Box Truck",
    definition:
      "Equipment type: box truck (often 16–26 ft). More cube/weight capacity; may require liftgate/pallet jack/straps depending on the load.",
    order: 25,
  },
  {
    term: "10/4",
    definition: "CB/radio slang: \"Message received / OK.\"",
    order: 26,
  },
  {
    term: "TBD",
    fullName: "To Be Determined",
    definition: "Details are not decided yet (time, address, rate, etc.).",
    order: 27,
  },
  {
    term: "ETA",
    fullName: "Estimated Time of Arrival",
    definition: "Expected arrival time at PU/DEL.",
    order: 28,
  },
  {
    term: "G2G / GTG",
    fullName: "Good to Go",
    definition: "Everything is confirmed and okay to proceed.",
    order: 29,
  },
  {
    term: "LG",
    fullName: "Liftgate",
    definition: "Hydraulic lift on the vehicle; often needed for locations without a dock. Usually an accessorial.",
    order: 30,
  },
  {
    term: "PJ",
    fullName: "Pallet Jack",
    definition: "Tool used to move pallets. Sometimes required at PU/DEL; can be listed in load requirements.",
    order: 31,
  },
  {
    term: "MC",
    fullName: "Motor Carrier Number",
    definition: "FMCSA operating authority identifier for for-hire carriers; used for SAFER checks and paperwork.",
    order: 32,
  },
  {
    term: "DOT",
    fullName: "Department of Transportation Number",
    definition: "DOT/FMCSA registration number identifying the carrier/company and its safety history.",
    order: 33,
  },
  {
    term: "QP",
    fullName: "Quick Pay",
    definition: "A faster payment option (usually for a fee), depending on broker/platform terms.",
    order: 34,
  },
  {
    term: "DH",
    fullName: "Deadhead",
    definition: "Empty miles (no freight), typically to pickup or after delivery; important for RPM/profit calculation.",
    order: 35,
  },
  {
    term: "EOD",
    fullName: "End of Day",
    definition:
      "\"By the end of the day.\" Deadline to send/confirm/provide a status update before the day ends (often in a specified time zone — ET/CT/PT).",
    order: 36,
  },
  {
    term: "DNU",
    fullName: "Do Not Use",
    definition:
      "Internal status meaning we should not book or work with this broker/customer/carrier due to risk (nonpayment, fraud, bad history). Always check CRM/Accounting/Compliance before accepting.",
    order: 37,
  },
  {
    term: "RPM",
    fullName: "Rate Per Mile",
    definition:
      "How much you earn per mile. Common calculation: total load pay (linehaul + accessorials) ÷ total miles (loaded + deadhead). Used to evaluate if a load/lane is worth taking.",
    order: 38,
  },
  {
    term: "FMCSA",
    fullName: "Federal Motor Carrier Safety Administration",
    definition:
      "US DOT agency that regulates commercial motor vehicles and carriers (safety rules, HOS/ELD, compliance, inspections). Dispatchers use FMCSA/SAFER data to verify carrier authority and safety info.",
    order: 39,
  },
  {
    term: "GVW",
    fullName: "Gross Vehicle Weight",
    definition:
      "Total actual weight of the vehicle plus load (truck/van + cargo + driver + fuel). Often used with GVWR to determine ELD/HOS applicability, CDL needs, and weight limits.",
    order: 40,
  },
  {
    term: "OOS",
    fullName: "Out of Service",
    definition:
      "FMCSA/DOT enforcement status meaning the driver/vehicle/carrier is not allowed to operate until a specific issue is corrected. Can cause major delays, service failures, and fines — escalate immediately.",
    order: 41,
  },
  {
    term: "TL",
    fullName: "Truckload",
    definition:
      "A single load that typically uses a full trailer or is dedicated to one customer (direct point A to point B with minimal handling). Often contrasted with LTL.",
    order: 42,
  },
  {
    term: "PO",
    fullName: "Purchase Order",
    definition:
      "Customer order/reference number used to identify what is being purchased/shipped. Often required on the BOL/invoices and sometimes at pickup/delivery for check-in.",
    order: 43,
  },
  {
    term: "FAK",
    fullName: "Freight All Kinds",
    definition:
      "Pricing term meaning mixed/assorted commodities are rated as one class or group (commonly in LTL). Used to simplify rating when multiple item types ship together.",
    order: 44,
  },
  {
    term: "CBP",
    fullName: "Customs and Border Protection",
    definition:
      "US federal agency responsible for border security and enforcing import/export laws. For cross-border freight, CBP controls inspections and release/hold decisions.",
    order: 45,
  },
  {
    term: "3PL",
    fullName: "Third-Party Logistics Provider",
    definition:
      "A company that provides outsourced logistics services (transportation, warehousing, distribution). In trucking, a 3PL often acts like a broker/managed transportation provider between shipper and carrier.",
    order: 46,
  },
  {
    term: "LTL",
    fullName: "Less-Than-Truckload",
    definition:
      "A shipment that shares trailer space with other freight (often through a terminal/cross-dock network). Usually priced by class/weight/dimensions.",
    order: 47,
  },
  {
    term: "FTL",
    fullName: "Full Truckload",
    definition: "One shipper uses the full trailer — typically faster transit and fewer touches than LTL.",
    order: 48,
  },
];

const rateRules: { title: string; description: string; critical: boolean; order: number }[] = [
  {
    title: "What makes a rate valid",
    description:
      "A rate is only valid if it includes the lane (origin and destination) and the broker it was quoted to. A rate posted without both of these doesn't count and can't be enforced against other dispatchers.",
    critical: false,
    order: 1,
  },
  {
    title: "Share full information",
    description:
      "When you post a rate, share the full information — lane, broker, and rate. Partial information creates confusion and makes it impossible for the rest of the team to respect it.\n\nExample of a rate that works: \"Chicago, IL - Dallas, TX TQL\" (City, State - City, State Broker). Full information of the load (Price / Lane / Broker) must be included in the SUBJECT LINE of the email. A rate that only has this information in the BODY of the email will NOT be considered valid.\n\nThe broker's name must be written out in full, unless it is the abbreviation of a well-known broker from the following list:\nTotal Quality Logistics - TQL\nPITTSBURGH LOGISTICS SYSTEMS INC - PLS\nIntegrity Express Logistics - IEL\nSimple Logistics - SILO\nKing of Freight - KOF\nLogistics Dynamics Inc - LDI\nAmerican Logistics Group - ALG\nRoute Transportation & Logistics - RTL\nNational Cold Chain Inc - NCC\nAmerican Diamond Logistics - ADL",
    critical: false,
    order: 2,
  },
  {
    title: "Tell the broker before sending the rate",
    description:
      "Never send a rate to a broker before letting the team know first. Announcing it after the fact defeats the purpose of coordinating — someone else may already be working that same broker.",
    critical: true,
    order: 3,
  },
  {
    title: "Match an existing rate",
    description:
      "If another dispatcher already has a rate out on a lane/broker, you can match it — but you must add a \"+\" to show you're bidding at the same rate. Quietly undercutting or duplicating a rate without flagging it is not allowed.",
    critical: true,
    order: 4,
  },
  {
    title: "Bidding at the same time",
    description:
      "When multiple dispatchers are bidding the same rate at the same time, whoever has the most \"+\"s on that rate has priority. This keeps it fair and avoids two people fighting over the same load.",
    critical: false,
    order: 5,
  },
  {
    title: "Lowering a rate to match the broker's counter",
    description:
      "If a broker counters with a lower number, the rate can only be lowered to match if at least 66% of the dispatchers bidding on it agree. One person can't unilaterally drop the rate for everyone else.",
    critical: false,
    order: 6,
  },
  {
    title: "When you're the only one bidding",
    description:
      "If you're the only dispatcher on a rate, you're free to change it as needed — just let the chain know so everyone stays informed, even if no one else is actively involved.",
    critical: false,
    order: 7,
  },
  {
    title: "The 15-minute active window",
    description:
      "A posted rate stays active for 15 minutes. To keep it alive past that, someone needs to reply with a \"+\" or \"up\" to renew it. If no one renews it in time, the rate is considered expired.",
    critical: false,
    order: 8,
  },
  {
    title: "Keeping a rate alive while waiting on the RC",
    description:
      "If you're waiting on the rate confirmation from the broker, keep the rate active in the chain (renew it as needed) so no one else accidentally works the same lane/broker while you're closing it out.",
    critical: false,
    order: 9,
  },
  {
    title: "Undercutting an active rate",
    description:
      "Sending a lower rate on a lane/broker that already has an active rate posted by someone else — without going through the agreement process above — is undercutting. If this happens, the load is automatically reassigned to whoever had the original, valid rate.",
    critical: true,
    order: 10,
  },
  {
    title: "Drivers on hold",
    description:
      "If a driver is on hold for a load, that driver is exclusive to the dispatcher who put them on hold. Other dispatchers should not bid that driver out on other loads while they're on hold.",
    critical: false,
    order: 11,
  },
  {
    title: "Team leader overrides on excessively high rates",
    description:
      "Only a team leader can override and take an excessively high rate — meaning a rate at least $150 above what's reasonable for the lane. In that case, the load must be split between the dispatchers involved, and management will look into why the rate got that high in the first place.",
    critical: true,
    order: 12,
  },
  {
    title: "Breaking the rules",
    description:
      "Rule-breaking (undercutting, hiding information, skipping the broker-notification step, etc.) has consequences. After 3 confirmed strikes, a fine/charge will be applied. These rules exist purely out of respect for other dispatchers, to avoid internal conflict, and to keep things fair for everyone — not to punish people unnecessarily.",
    critical: true,
    order: 13,
  },
];


// Safety Handbook — one page per tab of the source document. Pages are created
// empty; admins fill the body in at /admin/handbook, and a reseed never
// overwrites content that has already been written.
const handbookPages: { slug: string; title: string; summary: string; order: number; content?: string }[] = [
  {
    slug: "1st-page",
    title: "1st page",
    summary:
      "Read and sign before you dispatch — rules, penalties, and where to send your signature.",
    order: 1,
    content: `## !!! IMPORTANT DISCLAIMER !!!

> The information presented in this handbook is **for your protection and benefit**. If no attempt is made to properly study it and to guide your daily professional practice by the information provided below, your dispatching becomes **financially and reputationally harmful** — to you personally, to your colleagues, and to the company as a whole.

We therefore require that all dispatchers follow the rules and guidelines stated in this handbook, and that there is a constant, coordinated effort aimed at implementing our company's policies and guidelines into successful and safe dispatching practice.

That effort is a **shared responsibility between Compliance, TLs, and their teammates.**

## Sign the handbook

After you have had time to study the Safety Handbook, please **sign it**, confirming that:

- You are aware of the rules — all safety regulations are understood.
- All required blocks have been activated in the **DAT directory**.
- You accept that any potential violation will result in **financial and/or other penalties and sanctions**.

## Where to send the signed copy

Send the electronically signed document to:

- dariabr@empirenational.com
- andrew@empirenational.com **or** colewe@empirenational.com
- ryank@empirenational.com
- roman@empirenational.com
- **Your Team Lead**

## Signature

| Date | Dispatcher's full name | Signature |
| --- | --- | --- |
| &nbsp; | &nbsp; | &nbsp; |
`,
  },
  {
    slug: "our-location-departments",
    title: "Our Location + Departments",
    summary:
      "Our office address, what to say about where you are, the main line, and who runs each department.",
    order: 2,
    content: `## Our location

> **Empire National** — 5045 Hendersonville Road, Suite 1, Fletcher, NC 28732

Be aware that almost every broker and driver thinks **that is where you are**. Our customers and drivers do not know — and should not know — where the real offices are. So if a driver asks where you are, do not tell him you are in Kyiv.

You do not have to hide your nationality or origin, but you do have to be prepared in case a driver asks you something personal. If you decide to answer, your legend has to be somehow legit.

- Do not tell them you moved to the USA when you were 6 years old — everyone can hear your accent.
- If you would rather not say Fletcher, you can always say you **work remotely**.
- If you do, pick a realistic place to live (not Manhattan NY or Beverly Hills CA) and learn something about that city.

## Main line

> Empire National main line — **(800) 985-0888**

## Tracking Department

- **Alex Green** — manager
- **Ron Herrington** and **Kenneth Perkins** — TLs, day shift
- **Kyle Pred** — TL, morning shift
- **Nataly Wilson** and **Dustin Roberson** — TLs, night shift

## HR Department

- **Emile Ramos** — manager, MX office
- **Monica Rogers** — manager, UA office

## Compliance Department

- **Nick Saponaro**
- **Ryan King**
- **Daria Brooks**

## Safety Department

- **Vitaliy Kushtan**
- **Cory Peters**
- **Cheyne Main**

## Expedite Department

- **Andrew Jameson** — manager, Kyiv office
- **Nick Brodskiy** — manager, Dnipro office
- **Cole West** — manager, Warsaw office
`,
  },
  {
    slug: "blind-shipment",
    title: "Blind Shipment",
    summary: "What a blind shipment is, and the four rules a driver follows on one.",
    order: 3,
    content: `## What a blind shipment is

A **blind shipment** is a delivery method where the recipient does not know who the sender is. It is often used in B2B scenarios — for example, when a company ships products to clients but wants to hide the manufacturer or supplier.

> **Example.** Company A manufactures products and sells them through Company B. Company B ships the order to the end customer. On the shipment documents, Company A is not mentioned — only Company B appears.

## Blind shipment driver instructions

**Purpose:** deliver the goods without revealing the sender.

### 1. Main rule

- Do not disclose who sent the shipment.
- Deliver directly to the recipient only.

### 2. Documents

- Show only the delivery note, invoice, and packing list.
- Do not share any other information about the sender.

### 3. Contact procedure

- If the recipient has questions, call the dispatcher only.
- Never contact the client or the sender directly.

### 4. Packaging

- Do not remove labels or markings.
- Do not show logos or notes about the company.
- Deliver the shipment exactly as it is.
`,
  },
  {
    slug: "hazmat-loads",
    title: "Hazmat loads",
    summary:
      "Empire National does not haul hazmat — how to spot it and what to do if it turns up after booking.",
    order: 4,
    content: `## The rule

> **Empire National does not haul hazmat shipments.**

Hazardous materials are outside what our fleet runs. Do not book, quote, or accept a load that moves hazmat — there is no exception to clear with a broker.

## What to watch for before booking

A load is hazmat if the freight carries any of the following, whatever the broker calls it on the phone:

- A **UN number** or hazard class on the load details or BOL.
- A requirement for **placards** on the vehicle.
- A requirement that the driver hold a **hazmat endorsement**.
- Commodities such as fuel, compressed gas, paint, solvents, batteries, chemicals, or explosives.

If any of that appears, turn the load down before going further.

## If you find out after booking

Tell your **TL** right away, and loop in **Compliance**. Do not send the driver to pick it up while the question is open.
`,
  },
  { slug: "fake-team", title: "Fake Team", summary: "Spotting and avoiding fake team-driver claims.", order: 5 },
  {
    slug: "fake-rate",
    title: "Fake Rate",
    summary:
      "When the fake rate procedure applies, how to weigh the risk, and the four-step approval chain.",
    order: 6,
    content: `::::grid
:::card[Fake rate is…]{tone=dark}
The fake rate procedure is used **exclusively in critical situations**: a driver who is already on a load, or has the load in the truck, demands an amount significantly higher than the one specified in the contract, refuses to engage in any negotiation, and no other option remains.
:::

:::card{tone=soft}
This approach is taken to **minimize the risk of load cancellation** — drivers may become upset and refuse to take a load during a conversation with HR before completing it.

Dispatchers should make **every effort to prevent** fake rate situations, and any such incident must be **reported to HR with supporting evidence**.
:::
::::

## Weigh the risk first

::::grid
:::card[Risks are too high]{tone=high}
**Load from DAT** — the dispatcher is running a load for a new broker. The driver cannot be changed, because we already gave the broker his information, and the broker's reaction to a driver change is unpredictable.

**After hours** — the driver asked for extra money outside the dispatcher's working hours. No replacement can be found, the Team Lead cannot be involved, and the dispatcher has to make a fast decision.

**Only option** — this driver is the only available option to cover the load, so the dispatcher cannot skip him and cover it with someone else.
:::

:::card[Risks are lower]{tone=low}
**Load from a warm customer** — the dispatcher is running a load for a warm customer, has built good communication with the broker, and can explain the situation and offer a replacement.

**More options** — other drivers are available in that location at a higher rate, so the dispatcher can cover the load at less profit and keep the customer satisfied.
:::
::::

## The procedure of approving a fake rate

::::grid
:::card[Step 1]{tone=step}
Talk to the driver and explain that the rate cannot be changed. Remind him of the rules.
:::

:::card[Step 2]{tone=step}
If the driver insists on a new rate, estimate the risks.
:::

:::card[Step 3]{tone=step}
Report to HR. HR contacts the driver and does everything possible to resolve the situation.
:::

:::card[Step 4]{tone=step}
Approve the fake rate with the **HR manager** and **your Team Lead**.
:::
::::
`,
  },
  {
    slug: "hr-part",
    title: "Compensation Policy",
    summary:
      "How contractors are paid, what gets deducted, and how to report an issue to HR.",
    order: 7,
    content: `> Even if the broker has not paid us, **we still pay the driver according to the contract** — he works with us.

## Reporting issues

If a driver does something against the rules, or if something happens on a load, **write a report and let HR know**.

HR cannot know about a situation if nobody reports it. So if something happens, report it — we need HR aware of every issue.

:::card[Full document]{tone=soft}
The complete policy is below. You can also [download the original document](/docs/compensation-policy.docx) (DOCX) to send to a contractor.
:::

## Compensation Policy

### 1. Mileage Calculation

Shipment distance is calculated based on ZIP-to-ZIP, not exact addresses. Contractor must provide accurate and truthful current location information, including ZIP code, to ensure correct empty mileage calculation. In case of disputes, mileage will be verified using Google Maps.

### 2. Load Availability

Before assigning a load, the Dispatcher must confirm that the Contractor does not have an active load with another company or another Empire National Dispatcher.

### 3. TONU (Truck Ordered, Not Used)

TONU applies when a truck is ordered and the load is later canceled. Contractor is not eligible for TONU if they cancel the load themselves.

If the Contractor travels less than 50 miles toward pickup, compensation is $50. If more than 50 miles are driven, compensation is calculated at $1 per mile, with a maximum of $150.

TONU is not paid if the Contractor arrives late, if the cancellation is caused by the Contractor’s actions or inaction, or if the load is canceled within 15 minutes after confirmation or within 12 hours prior to pickup (for non-same-day appointments).

### 4. Detention

Detention begins 2 hours after the Contractor checks in on time at the facility. Arrival and departure times must be documented on the Bill of Lading.

Compensation is $20 per hour, with a maximum of $150. Detention is not paid if the Contractor misses the appointment due to their own fault or negligence.

### 5. Layover / Overnight

Compensation for overnight stay or the first 24-hour layover is $150. Each additional 24-hour period is also compensated at $150. Weekend layover is compensated at a total of $300.

Layover is not paid if the delay is caused by the Contractor arriving late.

### 6. Loading / Unloading

Loading and unloading is compensated at $10 per 150 lbs. Driver assistance is compensated at $5 per 150 lbs.

These services must be approved in advance by the Dispatcher or Operations and must be documented on the Bill of Lading and Proof of Delivery. Unauthorized services will not be compensated.

### 7. Extra Weight

The base rate includes shipments up to 1,500 lbs. For any weight exceeding this limit, compensation increases by $10 for each additional 100 lbs.

Contractor has the right to refuse a load if it exceeds the vehicle’s declared capacity.

### 8. Extra Space

No additional compensation is provided if the load exceeds the initially stated size, as the Company reserves the full cargo space when booking.

### 9. Extra Miles and Stops

If actual mileage exceeds the mileage stated in the rate confirmation, additional miles are paid at the same per-mile rate. The same rate applies if fewer miles are driven.

Each additional pickup or delivery stop is compensated at $50.

### 10. Escalation

Any issues related to policy violations must be reported to the Driver Support Department.

## Payment Policy

### 1. Payment Schedule

Loads delivered by Wednesday 8:00 EST are paid on Friday via ACH. Payment is issued only after the load is closed and the Company has received payment from the customer.

### 2. Deductions

The Company may apply deductions, chargebacks, or other amounts owed by the Contractor.

### 3. Required Documents

Some customers require a scanned Bill of Lading or original Proof of Delivery for payment. All required documents must be mailed to 4600 Hendersonville Rd Ste. D, Fletcher, NC 28732, and shipping costs are the Contractor’s responsibility.

Contractor must retain all documents for 4 months and provide copies upon request. Payment may be held until all required documents are received.

After mailing the Proof of Delivery, the Contractor must provide a tracking number and send a clear copy to the Company application chat and to bol@empirenational.com.

### 4. Payment Conditions

No advance payments are provided before delivery is completed and the Proof of Delivery is approved by the customer. Payments are made directly to the Contractor, who is responsible for compensating their own employees or agents.

### 5. Submission Requirements

To receive payment, the Contractor must submit a voided check with full banking details, a properly signed Bill of Lading, and any additional required documents.

All documents must be emailed and uploaded to the application chat within 15 minutes after pickup and after delivery.

### 6. Split Loads

If a load is completed by another driver, the first Contractor is paid only after final delivery is completed and the Proof of Delivery is approved by the customer.

### 7. Overpayments

Any overpayment or chargeback will be deducted from future settlements.

### 8. Payment Holds

Payment may be withheld in cases such as missing signatures, incomplete documents, poor-quality scans, incorrect carrier information, late delivery, damages, or any issue requiring customer verification.

### 9. Printing Compensation

The rate includes printing up to five pages. If more than five pages are required, an additional $10 will be paid.

### 10. Quick Pay

Quick Pay is available 24 hours after delivery, subject to Accounting approval. It is processed via ACH with a $50 fee per transaction, and funds are typically received the next business day.

The fee applies per vehicle if multiple units are used. No payment advances are allowed.

### 11. Final Settlement

Final settlement is issued within 45 days after full compliance with contract terms upon termination.

## Deductions Policy

### 1. Lateness

Contractor must notify the Dispatcher in advance about any delay. Late arrival to pickup or delivery results in a 25% rate deduction. Late arrival to a strict appointment results in a 50% rate deduction. Continued lateness may lead to contract termination.

If a Contractor wants to arrive earlier than scheduled, this must be approved by the Dispatcher, otherwise additional charges may apply.

Any delays, accidents, damaged freight, or risks to cargo must be reported immediately to Operations or the Dispatcher, with photo proof provided.

No deduction applies if the delay is necessary to maintain safety.

### 2. Partial Loads (Strictly Prohibited)

All loads are dedicated, meaning no additional freight may be transported at the same time, even if another load is offered by the Company.

If a Contractor performs a partial load, a deduction of up to 100% of the rate will apply, with a minimum charge of $500.

Any unauthorized items in the cargo area may be treated as a partial load and result in full deduction.

### 3. Load Cancellation

Contractor may not cancel a load after confirming acceptance by phone, text, or verbally.

The Dispatcher must send the rate confirmation within 30 minutes. If no rate confirmation or follow-up is provided within that time, the Contractor may cancel without penalty.

Violation results in a $250 cancellation fee and may lead to contract termination. Emergency situations must be supported with proof.

### 4. Documentation Errors & Submission

If the wrong Bill of Lading (BOL) is taken at pickup, the Contractor must return and obtain the correct one. Failure to do so may result in up to a 100% rate deduction or termination.

All documents (BOL, POD, PO) must be submitted in good quality within 15 minutes after delivery.

Failure to provide a valid Proof of Delivery results in a 15% rate deduction and may delay or block payment.

Contractor must keep original documents for 3 months and provide them upon request.

If only the original POD is mailed without sending a copy via email and app chat, a $10 deduction will apply.

### 5. Photo Requirement

Contractor must send high-quality photos of the freight at both pickup and delivery to the app chat and email.

Photos must be sent before contacting Dispatcher or Operations regarding the load.

Failure to provide photos at any stop results in a $10 deduction. Repeated violations may lead to increased charges.

At the time of delivery, the Company app chat must be open on the Contractor’s device.

### 6. Wrong Delivery Location

If a load is delivered to the wrong location without a valid reason, the Contractor may be fined or held responsible for all costs related to redelivery. Photo proof must be provided when applicable.

### 7. Pets Policy

Pets are not allowed in the vehicle without prior approval from Driver Support. Violations result in additional charges.

Service dogs are allowed only if the Company is informed in advance and supporting documents (certificate and doctor’s prescription) are provided upon request. This may limit eligibility for certain loads.

### 8. Driver & Vehicle Registration

All drivers must be registered with the Company before handling any load.

If a Contractor adds a driver or vehicle without providing required documents, a 100% rate deduction will apply, with a minimum charge of $500.

### 9. Cargo Responsibility

Contractor is fully responsible for delivering the load in the same quantity and condition as received.

Any damage to freight must be covered by the Contractor. The Company reserves the right to file a claim with the Contractor’s insurance.

### 10. Compliance & Termination

Failure to follow these rules may result in contract termination.

If the Contractor operates with multiple drivers, all drivers must be informed of and comply with this policy.

## Authorized MC and USDOT Policy

### 1. Active Authority Restriction

The Company does not knowingly assign loads to any Contractor that has active or operating Motor Carrier (MC) authority or a USDOT number registered with the FMCSA.

If the Contractor holds or activates MC authority or a USDOT number at any time, the Company reserves the right to terminate the Agreement immediately.

### 2. Contractor Notification Requirement

The Contractor must immediately notify the Driver Support Department if they obtain, activate, or register MC authority or a USDOT number, either for themselves or their vehicle. Failure to disclose this information may result in termination of the Agreement.

### 3. Prohibited Practices

The Contractor is strictly prohibited from double brokering, subcontracting, or re-brokering any load assigned by the Company. Any violation of this rule may result in immediate termination.

## Rate Confirmation Policy

### 1. Information Accuracy

The Contractor is required to provide complete, accurate, and truthful information at all times. The Contractor must also notify the Dispatcher if they are already assigned to another load, either with another company or another Empire National Dispatcher, before accepting a new assignment.

### 2. Load Acceptance and Rate Agreement

Once the Contractor confirms acceptance of a load verbally, by phone, or by text and agrees to the offered rate, the Contractor is not permitted to change the rate or refuse the load afterward. All confirmations must be clear and final.

### 3. Holding Period After Bid

After placing a bid or confirming interest in a load, the Contractor will be placed on a 15-minute hold period. During this time, the Contractor must not accept any other loads.

If the Dispatcher requires more time or confirms the load, they will inform the Contractor within this 15-minute window. Failure to comply with this rule may result in contract termination.

### 4. Special Facility Requirements

For shipments involving Canada, U.S. military bases, or government facilities, the Contractor must fully comply with all access requirements, including background checks and entry permissions.

If the Contractor is unable to access such facilities due to prior restrictions or criminal history, they must inform Dispatch at the time of load acceptance. Failure to disclose this may result in the Contractor being responsible for all costs associated with re-dispatch or load recovery.

## Recovery Policy

### 1. Breakdown Notification

If the truck experiences a breakdown or any operational issue during transit, the Contractor must immediately notify the Operations Department.

Evidence of the issue must be provided within 30 minutes and may include photos, repair invoices, or any relevant documentation.

### 2. Load Interruption or Non-Completion

If the Contractor accepts a load but is unable to complete delivery due to reasons not caused by external uncontrollable circumstances, the Company reserves the right to charge the Contractor for all recovery-related expenses. Each case will be reviewed individually by the Safety Department. In emergency situations, final decisions will be made based on full case evaluation.

## Non-Applicability of Federal Regulations

The Contractor agrees that the equipment used under this Agreement does not qualify as a Commercial Motor Vehicle under 49 CFR 390.5, as its gross vehicle weight, gross vehicle weight rating, or combined weight rating does not exceed 10,000 pounds.

Based on this classification, the Contractor and the Company are not subject to FMCSA or USDOT regulatory requirements for the operation of this vehicle. Any references in this Agreement to USDOT or FMCSA rules shall not apply to the Contractor’s operations under this lease agreement.

## Passenger Policy

The Contractor is strictly prohibited from allowing any unauthorized passenger in the vehicle while performing services under this Agreement.

If the Contractor chooses to carry a passenger, prior approval is required along with proof of Passenger Accident Insurance that includes both the named driver and the authorized passenger.

An authorized passenger is defined as a non-employee individual who is riding only as a guest and does not receive any form of compensation or employment-related benefit.

If the Contractor proceeds with a passenger without valid insurance coverage, this Agreement will be considered void as of the date of such violation.

Passengers are strictly prohibited from operating the vehicle under any circumstances.

## Contractor Liability and Claims Responsibility

The Contractor agrees to fully defend, indemnify, and hold the Company harmless from any claims, losses, damages, or legal costs, including reasonable attorney fees, arising from the following situations, whether through settlement deductions, escrow/security deposits, or direct reimbursement.

This includes any loss, shortage, or damage to cargo transported under this Agreement, regardless of cause.

The Contractor is also responsible for any damage or loss to Company equipment used during operations, whether caused by the Contractor, their agents, employees, or representatives.

The Contractor is further liable for any bodily injury, death, or property damage occurring during the execution of this Agreement when such incidents are not covered by applicable insurance, are subject to a deductible, or exceed policy limits.

All incidents, including accidents, injuries, cargo damage, shortages, or property damage, must be reported immediately to the Operations Department. A complete written report must be submitted as soon as possible in the form required by the Company and, when applicable, any governmental authority or insurance representative.

## Uninsured / Underinsured Motorist Claims

If employees of the Contractor make claims under the Company’s liability insurance for uninsured or underinsured motorist coverage, and if such claims result in deductibles, uncovered amounts, or partial insurance payment, the Contractor agrees to reimburse the Company for all related costs paid by the Company.
`,
  },
  {
    slug: "claims",
    title: "Claims",
    summary:
      "Load security, documenting cargo damage, and the two claim tracks — under and over $1,000.",
    order: 8,
    content: `## The dispatcher's role in a claim

The dispatcher must remain **actively involved throughout the entire claim resolution process**. They are responsible for maintaining communication with the broker, helping obtain all necessary information, and supporting the Tracking Team until the claim is fully resolved.

The dispatcher should stay in contact with the broker, follow up on outstanding questions or documents, and make sure the broker provides the information needed to investigate and close the claim. Treat claim resolution as a priority and take an active role in moving the case toward closure.

## Cargo delivery and load security

> The most important service we provide is cargo delivery. It is our responsibility to deliver the load **in the same condition in which it was received** at the pick-up location.

The Tracking Team must always pay close attention to load security. If the straps or other securing equipment are not visible in the pictures provided by the driver, the Tracking Team must instruct the driver to properly secure the load and provide updated pictures.

**There are no exceptions to this requirement.** Many things can go wrong during transportation, and an unsecured load creates an unnecessary risk of cargo damage. Proper load securement is one of the key steps in preventing avoidable damage.

## When cargo damage is identified

If the Tracking Team notices any damage to the cargo, the driver must be instructed to **immediately check the cargo with the shipper or receiver** and have the damage documented on the appropriate paperwork.

The Tracking Team must notify the broker about the damage and confirm the situation with them. If the damage was caused by a forklift operator, facility employee, or other personnel at the shipper or receiver location, written confirmation from the shipper or receiver must be included in the paperwork.

> The broker must also confirm **in the email chain, in writing**, that they have no claim against Empire National / Expedited and that we are clear to proceed. Get this in writing even if the broker already confirmed the same thing over the phone.

A claim report must be created for **every** cargo-damage incident — even when the damage clearly was not caused by Empire National / Expedited and the broker confirms there will be no claim against us.

## Documenting cargo damage

1. **Obtain an incident report.** Instruct the driver to get a written incident report from the shipper or receiver documenting what happened and, whenever possible, identifying the cause of the damage.
2. **Take detailed pictures.** Ask the driver for clear pictures of the damaged product from multiple angles, showing both the damage itself and the surrounding condition of the cargo where relevant.
3. **Notify the broker.** Inform the broker as soon as possible and keep communicating until the situation is clarified.
4. **Collect details from the driver.** Ask for a detailed explanation of how the damage occurred — when and where it happened, and who was involved, if known.
5. **Prepare and distribute the report.** Prepare a claim/damage report and send it to:
    - **Safety Team** — claim.expedite@empirenational.com or auto-claim@empireexpedited.com
    - **Office Manager**
    - **HR Representative**
    - **Dispatcher**

The report must include the incident report and all relevant pictures of the freight.

## Determining the next steps

Once we have a general understanding of the situation — what happened, who may be responsible, whether a claim will be filed, and the potential amount involved — the Tracking Team must document the findings and coordinate next steps with the appropriate parties.

The next steps depend on the circumstances of the incident and whether the damage is the responsibility of Empire National / Expedited or another party.

::::grid
:::card[Damages under $1,000]{tone=soft}
Handled by **Tracking and Dispatch** with Accounting. The Safety Department does not take the case. $1,000 is held from the owner-operator, and the claim is paid out of the held funds.
:::

:::card[Damages over $1,000]{tone=dark}
The **Safety Department** takes the case. All available funds are held, the owner goes on Hidden OOS, and the claim is settled through a repayment plan or insurance.
:::
::::

## Damages under $1,000

1. If possible, Tracking asks the shipper or receiver for a copy of the incident report and pictures of the damage.
2. Tracking or Dispatch sends the email to the Claims Expedite chain (claim.expedite@empirenational.com). The Safety Department will **not** handle the issue. Add the accounting team:
    - annaug@empirenational.com
    - nicole@empirenational.com
    - connorgr@empirenational.com
3. Expedite HR should request that Accounting place **$1,000 on hold** for the owner-operator.
4. The booking dispatcher must work with the broker to determine the exact amount of the damage and obtain the supporting documents.
5. If the damage is less than $1,000 — for example $350 — the HR point of contact for the owner-operator must speak with them and explain the claim details.
    - Let the owner-operator know that we have to pay the claim from the held funds.
6. The booking dispatcher arranges for the cargo release to be signed, and makes sure we pay the broker and charge the owner-operator.
7. Release any additional funds that were on hold.
8. Make sure the broker is not retaining more funds than are needed to cover the claim.
    - Accounting can verify whether the broker is holding any funds.
9. Make sure we get paid for the load — the broker needs to pay OTR once the claim is resolved.

## Damages over $1,000

1. If possible, ask the shipper or receiver for a copy of the incident report and pictures of the damage.
2. The booking dispatcher emails the claims.expedite@empirenational.com group to inform the Safety Department.
3. The booking dispatcher must work with the broker to determine the exact amount of the damage and collect the supporting documents. **The dispatcher stays the point of contact** between the broker and the Safety Department.
4. The Expedite HR dispatcher should request that Accounting place **all available funds on hold** for the owner-operator, and should notify the owner-operator about the hold. Use caution if the driver is new or is currently on a load.
    - annaug@empirenational.com
    - nicole@empirenational.com
    - connorgr@empirenational.com
5. Place the owner on **Hidden OOS**.
6. If the damage exceeds $1,000 — for example $3,000 — the Safety Department representative contacts the owner-operator to explain the claim details.
7. Determine whether the owner would rather pay the claim out of pocket than file an insurance claim.
8. If the owner is paying out of pocket, the Safety Department representative must set up a **4–6 week repayment plan** with them.
9. The owner-operator must sign a **Confession of Judgment**.
10. We may need to file a claim with insurance if the owner-operator stops providing services and stops communicating with the company during the repayment process.
11. Any claim **over $5,000** must be filed with the owner-operator's insurance company after speaking with them, unless the owner is wiring the full amount immediately. We cannot sign repayment agreements for amounts this large.
12. If the owner decides to file through insurance, the Safety Department handles it.
13. The Safety Department representative must update all involved parties **at least once per week**.
14. Safety updates go to everyone on the internal team and to the owner-operator. Dispatch updates go to the broker — how often is at the dispatcher's discretion.
15. Hold the maximum available funds, but **no less than $1,000**, until the insurance payout is received. We may need that $1,000 to cover the insurance deductible by sending it to the broker, since the payout may be less than the deductible.

> **Owner-operator contact (updated 6/3/25).** For owners hired by the **MX office**, involve **Emile Ramos** when HR needs to speak with them. For owners hired by the **UA office**, refer to **Monica Rogers**.
`,
  },
  {
    slug: "double-broker-scammer",
    title: "Double-broker / Scammer",
    summary:
      "The 24 signs of a double-broker or non-paying broker, and how to book safely when you see them.",
    order: 9,
    content: `> These are the 24 hints that a broker company is a **double-broker**, a straight-up **scammer**, or a broker that **might not pay us** — or stops paying at some point.

## The 24 warning signs

1. They are **not approved by our factoring company** (OTR Capital — check [crm.empirenational.com/adm/otr](https://crm.empirenational.com/adm/otr)), and they refuse to do Quick Pay or actively dodge it.
2. The broker agent has **no signature block** at the bottom of their email — no cell, no office number, no logo.
3. You call the office or cell **multiple times and nobody picks up**.
4. The **rate confirmation looks sketchy** — strange or hand-made, as if built in Photoshop or Word rather than generated by the integrated CRM that normal brokers use.
5. **Low score on DAT** — 3 stars or below, and/or 3 or fewer reviews. On [directory.dat.com](https://directory.dat.com) you can see the general score and the reports carriers leave about the broker; if those reports show any of the bad signs here, that is a red flag. Five-star reviews that look suspiciously good while the rest of this list is failing are also a flag.
6. The broker agent on the phone has a **very thick non-US accent** (on its own this proves nothing).
7. **Communication and issue resolution take a long time**, because they have to check everything with the broker above them, who checks with their customer — especially slow if any link in that chain goes quiet.
8. They **do not pay TONU, detention, or layover** — they avoid accessorials at all costs with different excuses, or pay a token $50, $75, or $100 where the standard amount should apply.
9. The **BOL shows a different broker company** in the header, and/or lists their broker company as the carrier.
10. The broker asks you to have the driver **check in as a different carrier**, or otherwise misrepresent information to the shipper or customer.
11. The broker **does not know or provide dimensions** — because they booked it somewhere else, e.g. from a large broker like CH Robinson where only weight is listed, for a dry van or box truck load they are now trying to fit into a Sprinter.
12. The broker gives **only a first name**, or a first name plus one initial (for example "Dave" or "Dave V.").
13. The main office is **registered or located in Southern California**, especially Glendale (on its own this proves nothing).
14. The agent's email carries a **"Virus-free. www.avast.com"** footer, and/or the **timestamps are far off from US time zones**.
15. The broker appeared in a **[freightbrokeralert.com](https://freightbrokeralert.com) update from our Compliance team**.
16. The **carrier setup packet came as a PDF or Word document** instead of through an authorized platform such as RMIS, MyCarrierPacket, GoHighway, or DAT Onboard.
17. On a **first-ever booking** with them — when you add them to the CRM as a new company — they **offer no setup, contract, or broker-carrier agreement**. Unless they are a direct customer, they should send some kind of agreement or packet. Push for one and get it signed.
18. **They pay too slowly.** On the main CRM panel (LoadBoard) there are sections for Loads en Route, Loads Delivered, Loads Invoiced, and Loads Paid. If loads with this broker sit in **Loads Invoiced for over a month** without moving to Loads Paid, that is a sign.
19. **The MC number is fresh.** Broadly, the more digits, the younger the company: a 6-digit MC is relatively old (for example 966111), while the newest companies right now start with 16 and have 7 digits (for example MC 1635888).
20. The broker company tries to **book with you using their carrier MC**.
21. The broker has **suspiciously many blind or double-blind shipments**, especially blind pickups in odd locations that do not show up on Google as warehouses or legitimate businesses.
22. Agents use **Gmail, Yahoo, Outlook, or other free public email** — for example davebravologistics@gmail.com.
23. The broker company **has no profile on DAT or Truckstop**.
24. The broker company **has no website**.

> No single factor proves a broker is double-brokering or planning not to pay. But **the more of these you see on one broker, the higher the probability** — so take extra caution before letting dispatchers book with them, or before adding them.

## Extra caution before booking

- Check their **payment background with Accounting**.
- Check them **in our CRM** to see whether anyone at Empire has already run loads with them.
- See whether they **can Quick Pay**.
- **Do not take their loads cheap** — Quick Pay can eat a significant chunk of the margin.
- Expect that **any issue along the way may take a long time** to resolve.
- Book **no more than one load on Quick Pay** with them.
- Keep the **first load low on the broker's gross pay** — see the example below.

:::card[Why the first load should be small]{tone=dark}
A load from CA to NY where the broker pays **$3,000** and the driver gets **$2,900** puts **$2,900 at risk** to gain **$100** — and the driver still has to be paid either way. Quick Pay then eats roughly 3–10% of that $100.

A local load at **$300** broker pay and **$150** driver pay carries far less risk and is fine.
:::

## Paperwork protects us

Make sure a carrier packet or a proper **broker-carrier agreement** is offered by the broker. Once the dispatcher fills it out, send it to **setup@empirenational.com**.

> If we ever file a **claim against the broker's bond** for non-payment, we need that paperwork on hand.
`,
  },
  {
    slug: "nick-saponaro-question",
    title: "Nick Saponaro (question)",
    summary:
      "Watch Nick Saponaro's classes, then his call recordings — the model for handling difficult situations.",
    order: 10,
    content: `> Nick Saponaro's calls are the example to follow when a situation gets difficult.

## Where to start

1. Watch **one to three [classes](https://drive.google.com/drive/folders/1HFIL-lP4wr4ZLgBWM9nzZdie39wFizW4)** with Nick Saponaro first.
2. Then listen to his **[call recordings](https://drive.google.com/drive/folders/1HFIL-lP4wr4ZLgBWM9nzZdie39wFizW4)**.

Both the classes and the recordings sit in the same Drive folder. Work through them in that order — the classes explain the approach, and the recordings show it being used on a live call.
`,
  },
  {
    slug: "insurance-empire-national",
    title: "Insurance - Empire National",
    summary:
      "Our coverages A/B/C, how to read the COI, what to tell a broker about VINs, and how to request a certificate holder.",
    order: 11,
    content: `> If you have any questions about insurance, you can always contact your **TL, your manager, or the Compliance team**.

## The four types of insurance we use

These are the coverages that relate to the trucks.

::::grid
:::card[1. Cargo liability]{tone=soft}
Covers the **freight** we are hauling. If cargo is damaged, this is the coverage that responds.
:::

:::card[2. Auto liability]{tone=soft}
Covers damage and injury the **vehicle causes to others** while it is being operated.
:::

:::card[3. General liability]{tone=soft}
The cheapest and mandatory coverage (around $15 per company). It covers the vehicle when it is **not moving** — parked and someone dents it, or something falls on it.
:::

:::card[4. Physical damage]{tone=soft}
Covers **our own insured vehicle** against accidents and damage. If the vehicle hits another vehicle or an object, this pays for repair or replacement.
:::
::::

## Who insures us

Our Certificate of Insurance (COI) is issued through **AIC Insurance Agency Vancouver**. Three insurers carry our coverage, and on the COI each one is given a letter:

| Letter | Insurer | NAIC # | What it carries |
| --- | --- | --- | --- |
| **A** | Penn-America Insurance Co | 32859 | Commercial general liability |
| **B** | Falls Lake National Insurance Co | 31925 | Automobile liability (any auto) |
| **C** | Travelers Property & Casualty Co of America | 25674 | Cargo and non-owned trailer |

> **How to read the letters.** On the COI, the letter in the left column of each coverage row tells you **which insurer carries that coverage**.

> **NAIC number.** Every insurance company holds a certificate confirming it is a valid insurer. The NAIC number on the COI is that certificate number.

## What our COI shows

Policy period **08/08/2025 – 08/08/2026**. The insured is **Empire National Inc, 4600 Hendersonville Rd Ste D, Fletcher, NC 28732**.

| Coverage | Policy number | Limits |
| --- | --- | --- |
| General liability (A) | PAV0396171 | $1,000,000 each occurrence · $2,000,000 aggregate · $100,000 damage to rented premises · $5,000 medical |
| Automobile liability (B) | NISTK6159837 | $1,000,000 combined single limit · $500,000 UM/UIM |
| Cargo (C) | QT-660-5T752144-TIL-24 | $250,000 · $2,500 deductible · reefer breakdown included |
| Non-owned trailer (C) | QT-660-5T752144-TIL-24 | $80,000 · $2,500 deductible |

## A — General liability

The cheapest insurance, and mandatory — around **$15 per company**. It covers situations where the vehicle **is not moving**: parked and someone dents it, or something falls on it. It applies while the vehicle is stationary and out of service.

## B — Automobile liability

This is the **biggest and most complicated** type of car insurance.

It covers the costs if a truck accident causes someone to **die or get hurt** and they need to go to hospital, and it covers payments to **firefighters and other emergency services**. This is the coverage that applies when the vehicle **was moving** at the time of the incident.

:::card[Any Auto]{tone=dark}
**Any Auto** means that **any truck operating under our MC number** — Sprinters and big trucks alike — is covered under this policy. All VIN numbers are covered without being listed.

With **Scheduled Auto**, by contrast, the specific truck VIN numbers have to be listed on the certificate.
:::

**You can get Any Auto coverage in two ways:**

1. By reporting a **high number of miles driven** — we drive about 200,000 miles per week.
2. Based on **revenue**.

## C — Cargo

Cargo coverage is **$250,000**.

> **Deductible (DED)** is the amount **not** covered by the insurance — you pay all expenses up to that amount yourself. The higher the deductible, the cheaper the insurance, because the insurer takes on less risk.

## What to say when the VIN does not match the insurance

::::grid
:::card[Answer 1]{tone=step}
All of the vehicles in our fleet are insured under the **"Any Auto" clause** stated in our Certificate of Insurance, so there is no need to specify a particular VIN number.
:::

:::card[Answer 2]{tone=step}
On this particular load we are using a **legally contracted owner-operator** working under our MC and authority. They are insured under the "Any Auto" clause in our COI, which does not require us to specify their particular VIN number.
:::

:::card[Answer 3 — optional]{tone=step}
If necessary, we can send a **copy of their contract** to prove that this unit is legally and operationally tied to our MC and insurance.
:::

:::card[Keep it short]{tone=high}
Do not answer every question a broker asks. If you do respond, keep it **very short**, so they have no opening for follow-up questions.

Say it with confidence: *"Yes, we have ANY AUTO insurance, it covers this driver, everything will be fine."*
:::
::::

**Two definitions that come up in these conversations:**

- **Non-commercial truck** — a truck that weighs 10,000 pounds and does not carry hazmat loads. We do not have to put stickers on it.
- **Non-company vehicle** — not a company-owned vehicle, but it operates under our MC number, and that is fine.

> We have been in business for almost ten years, we work with top brokers — C.H. Robinson, RXO, XPO, TQL, Nolan, Armstrong — and we always aim to service our customers the best way possible. If anything happens, we do right by our partners.

## How to get a COI with a specific certificate holder

To get an updated COI naming a certain company as the certificate holder, send a request to **certs@aicinsagency.com** containing:

1. A **subject line** with the company name and the type of request — for example: *Updated COI + Certificate holder for Axle Logistics*.
2. A **short explanation in the body** with the details of the company being added.

:::card[Example body]{tone=soft}
Kindly help us to get a certificate of insurance with the below details as a Certificate holder:

Axle Logistics
835 N Central Street
Knoxville, TN 37917
:::

## Who to contact

- **Insurance agency:** AIC Insurance Agency Vancouver — 201 NE Park Plaza Drive, Suite 110, Vancouver, WA 98684
- **Agent:** Yelena Stepanyuk — 360-450-2211 · ystepanyuk@aicinsagency.com
- **Certificate requests:** certs@aicinsagency.com
- **Inside Empire:** your TL, your manager, or the Compliance team
`,
  },
  {
    slug: "general-dnu-guidelines",
    title: "GENERAL DNU GUIDELINES",
    summary:
      "Check both DNU tabs in the blacklist before every bid, and who to tell when a DNU situation comes up.",
    order: 12,
    content: `> **Mandatory.** To avoid unnecessary DNU violations, **all dispatchers must use our extension** and check the two main tabs before bidding on any load.

## Before you bid on a load

1. Open the [Expedite Blacklist — Empire National Inc](https://docs.google.com/spreadsheets/d/1d7FbJTPEW23BGqE-e9tROdveVGI-Dvb3fkTqirqtrmk/edit).
2. Check the **DNU list** tab.
3. Check the **Agents DNU** tab.
4. Search with the quick key **Ctrl + F** in the search bar.

Both tabs get checked — a broker company can be clear while the individual agent is not.

## If you hear about a DNU situation

Whenever you are told — **over the phone or by email** — that we have a DNU situation:

- **Notify your colleagues in Rates immediately.**
- **Let Daria Brooks and Ryan King know**, with all the details of the situation.

> Pass on every detail you have. A DNU that only one dispatcher knows about is a DNU the rest of the floor can still walk into.
`,
  },
  {
    slug: "freightguard-threat",
    title: "Freightguard Threat",
    summary:
      "What to do the moment a FreightGuard threat appears, who to email, and how to handle the conversation.",
    order: 13,
    content: `:::card[FreightGuard alert notification]{tone=high}
As soon as you become aware of a **FreightGuard threat** — or that we might receive one if we do not comply with a broker's request — **immediately inform your TL and the Compliance team**.

**Do not** try to explain or resolve the problem on your own.
:::

## Send the email

After you have notified your TL and Compliance, send an email to **fg.threat@empirenational.com**.

| Field | What goes in it |
| --- | --- |
| **To** | fg.threat@empirenational.com |
| **CC** | Your TL · your manager · Nick Saponaro · Ryan King · Daria Brooks |
| **Subject** | **FREIGHTGUARD** + company name + MC # |
| **Body** | Everything you know — **brief and specific** |

:::card[Example]{tone=soft}
**Subject:** FREIGHTGUARD Threat FTL / Shram Logistics Solutions MC 636302 / Current Load Alpharetta, GA 02/16

Hello,

No need for Nick to get involved at the moment. I will let you know how the delivery goes tomorrow.

The broker has threatened us, stating: *"If this load arrives at delivery with ANY evidence of partial, you will not be paid at all, and we will report you in every possible way. The load must look exactly like it did in the pictures and must have the seal intact."*

The broker might be suspicious of consolidation because the load could not be delivered on time today at 06:30. The freight was loaded and ready to go; however, we did not have a driver available to cover the delivery.

The load cannot be delivered in the original trailer from the Fletcher, NC terminal, because that trailer remained in Des Plaines, IL.

The situation is further complicated by the fact that when the broker requested a photo of the sealed trailer, a photo of trailer 2509 — unrelated to this freight, and with a different seal — was sent to the broker.
:::

Notice what the example does: it states **who threatened us**, **quotes the threat word for word**, and then lays out **what actually happened**, in order, without excuses.

## How to handle the conversation

You need to be prepared for situations like this and know how to respond.

- **Stay calm and focused.** Acknowledge the issue, apologize where appropriate, and concentrate on a practical solution.
- **Look forward, not back.** Instead of dwelling on what went wrong, think about what alternatives you can offer to fix it.
- **Listen carefully.** Stay polite, patient, and empathetic, with a calm and confident tone of voice.
- **Do not argue.** Do not try to prove that we handled the situation correctly. Your priority is to de-escalate and find a way forward.
- **Never take it personally** or respond emotionally. Ask yourself: *"What can I do now to resolve this, and what can I do differently next time?"*
- **If a broker asks us to stay away, respect it.** Apologize, confirm that we will, and end the call before the situation escalates further.
- **Escalate early.** If the issue is difficult or needs support, involve your Team Lead immediately so you can work out the right solution together.

> Always do your best to maintain and improve your own and the company's reputation — with brokers, with drivers, and with anyone else.
`,
  },
  { slug: "most-frequently-asked-dnu-questions", title: "Most frequently asked DNU questions", summary: "Common questions about Do Not Use decisions.", order: 14 },
  {
    slug: "mandatory-tl-notifications",
    title: "Mandatory TL Notifications Checklist",
    summary:
      "The 17 situations where a dispatcher must notify their TL immediately, in the chatbox or in person.",
    order: 15,
    content: `> Dispatchers must notify their **TL immediately** in every situation below. Notifications **must be made in the chatbox and/or in person**.

## Notify your TL when…

1. **You need to cancel a load.**
2. **You cannot find an option 15 minutes after receiving the rate confirmation.**
3. **You are unable to reach a driver for 60 minutes or more** — during transit, or when you need confirmation during the bidding process.
4. **You cannot reach a driver who has an owner.** The owner resists, the number is wrong, nobody picks up, a person with a different name answers, or you need to speak with the driver directly and cannot. The same applies to any failure to contact unregistered drivers.
5. **A driver cannot get loaded or unloaded because of equipment issues** — the load will not fit, the facility is not dock height, there is no forklift, driver assist is required but the load is too heavy, and so on.
6. **A driver threatens not to unload, not to drop the load, or to leave the facility** without authorization.
7. **A driver will not be paid for a load, or the rate is reduced** by any amount — whether by the broker or by the dispatcher.
8. **A broker, shipper, or receiver complains that the driver used their own MC or their own stickers.**
9. **Damage to the vehicle, the load, or the facility** at any point during the load.
10. **Motor vehicle accidents, injuries, or legal problems** of any kind.
11. **A FreightGuard threat, or a blacklist / DNU threat.**
12. **Problems with documents or access requirements** of any kind — border crossing, military background checks, TSA/TWIC, and similar.
13. **A recovery or a serious delay** — the driver is sick, a family emergency, bad weather, road closures.
14. **A driver engages in untrustworthy behavior** — double brokering, unauthorized partial, and so on.
15. **A broker claims to have sent a rate confirmation** or another important document that you never received.
16. **Any bad surprise** that could make a broker go crazy or damage the company's reputation.
17. **A broker gets angry** for any reason, justified or not.

> Knowing and making these notifications is the **responsibility of the dispatcher**, and is an obligatory part of basic dispatcher training.
`,
  },
  {
    slug: "load-booking-safety-checklist",
    title: "Load Booking Safety Checklist",
    summary:
      "What to verify before you accept a rate con, right after booking, and while the load runs.",
    order: 16,
    content: `> Before you consider a load **booked and in the system**, double-check the points below. A few minutes here prevents most of the problems that show up later.

## Before you accept the rate confirmation

1. **Make sure your driver can actually do the load** — equipment, certifications, and a rate calculated on the correct information. Even if you found the option through texting or the CRM, confirm everything **by phone** before accepting a rate con:
    - Ask the driver directly: **"Are you empty and ready to go?"** — even when our system shows an *AVAILABLE* status.
    - Always get at least a **rough ETA**. If the driver has prior commitments on other loads, find out when they can really haul your cargo.
    - Always double-check the driver's **current location and drop-off location**, especially when dealing with an owner. It may differ from what our system displays.

2. **Make sure the broker knows the exact dims of your equipment.** However small the dims are, make sure the broker knows the equipment is a **Sprinter** (unless you are using something else). If the load description says "box truck" or anything other than Sprinter — on the load board, the rate con, anywhere — confirm with the broker that our equipment is **not dock height** and has **no liftgate or pallet jack**.

3. **Make sure you have received your rate con.** If it is missing, check every folder — spam, updates — and notify your TL.

4. **Double-check the rate con before you sign.** Rate, pickup and delivery times, weight, dims, pallets, special requirements — now is the time. Once you sign, most non-warm brokers will not take responsibility for charges they can escape through a loophole in a signed rate con. Only hit send when you are willing to own what you signed.

:::card[If the numbers do not add up]{tone=high}
If you catch a driver in a lie, or find discrepancies in their answers, **report it to your TL** and be very careful.

It is **your responsibility** to verify every important load detail. A driver may quote you a rate while not actually meeting a crucial requirement — pickup and delivery time, truck dimensions, and so on.
:::

## Once the load is booked

5. **Update your driver in the CRM** before someone else starts using them.

6. **Make sure the driver has been properly dispatched** with the correct information — including the **correct driver rate** and instructions **not to touch the load without authorization** from the dispatcher. Otherwise the driver will want to charge extra for loading by hand.

7. **Make sure the load is properly entered in the CRM and the Expedite spreadsheet** — correct driver info, correct tracking team info, correct rates, correct pickup and delivery times and locations, load weight and pallets, and the properly filled rate con attached.

8. **Check the email for your assigned tracking team** and make sure every relevant broker agent is on the chain. The agent on your rate con often works with an assistant or two; leaving them off the chain causes communication breakdowns that lead to late pickups and deliveries.

## While the load runs

9. **Update the broker yourself on the important events** — pickups, deliveries, problems — whenever you can. Tracking does this too, but your participation improves safety and raises the chance of turning that broker into a warm one.

10. **When problems develop, the window to solve them can be very short.** Do not depend on tracking to fix the problem or to notify you in time.

> Whatever happens on the load, good or bad, becomes part of your professional reputation. **The broker will not care who messed the load up — they will blame you.**
`,
  },
  {
    slug: "confidentiality-and-internal-policies",
    title: "Confidentiality and Internal Information",
    summary:
      "What must never be shared with drivers or brokers, and who to ask when you are unsure.",
    order: 17,
    content: `> **Do not share screenshots from our CRM** with drivers or brokers, and do not disclose any internal or confidential information to them.

## What stays internal

Never share externally:

- Our **internal processes**
- The **RATES system**
- The **driver rating system**, and any individual **driver's score**
- Any other **tools and procedures** that are not intended to be shared outside the company

## When you are not sure

:::card[Ask first]{tone=high}
If you are unsure whether a piece of information can be shared, **check with your Team Lead before you provide it**.

Asking costs a minute. Sharing something that should have stayed internal cannot be undone.
:::
`,
  },
];

async function main() {
  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? "admin@empirenational.com").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "EmpireAdmin!2026";

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Empire National Admin",
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      title: "Onboarding Administrator",
    },
  });
  console.log(`Admin account ready: ${adminEmail}`);

  const demoPasswordHash = await bcrypt.hash("Dispatcher!2026", 10);
  await prisma.user.upsert({
    where: { email: "demo.dispatcher@empirenational.com" },
    update: {},
    create: {
      name: "Demo Dispatcher",
      email: "demo.dispatcher@empirenational.com",
      passwordHash: demoPasswordHash,
      role: "DISPATCHER",
      title: "New Dispatcher",
    },
  });
  console.log("Demo dispatcher account ready: demo.dispatcher@empirenational.com");

  const demoTrackingPasswordHash = await bcrypt.hash("Tracking!2026", 10);
  await prisma.user.upsert({
    where: { email: "demo.tracking@empirenational.com" },
    update: {},
    create: {
      name: "Demo Tracker",
      email: "demo.tracking@empirenational.com",
      passwordHash: demoTrackingPasswordHash,
      role: "TRACKING",
      title: "New Tracker",
    },
  });
  console.log("Demo tracking account ready: demo.tracking@empirenational.com");

  const demoHrPasswordHash = await bcrypt.hash("HumanResources!2026", 10);
  await prisma.user.upsert({
    where: { email: "demo.hr@empirenational.com" },
    update: {},
    create: {
      name: "Demo HR Specialist",
      email: "demo.hr@empirenational.com",
      passwordHash: demoHrPasswordHash,
      role: "HR",
      title: "New HR Specialist",
    },
  });
  console.log("Demo HR account ready: demo.hr@empirenational.com");

  for (const m of [...modules, ...trackingModules, ...hrModules]) {
    const created = await prisma.module.upsert({
      where: { slug: m.slug },
      update: {
        title: m.title,
        category: m.category,
        summary: m.summary,
        content: m.content,
        department: m.department ?? "DISPATCH",
        estMinutes: m.estMinutes,
        order: m.order,
        published: true,
      },
      create: {
        slug: m.slug,
        title: m.title,
        category: m.category,
        summary: m.summary,
        content: m.content,
        department: m.department ?? "DISPATCH",
        estMinutes: m.estMinutes,
        order: m.order,
        published: true,
      },
    });

    if (m.quiz) {
      const quiz = await prisma.quiz.upsert({
        where: { moduleId: created.id },
        update: { title: m.quiz.title, passPercent: m.quiz.passPercent },
        create: {
          moduleId: created.id,
          title: m.quiz.title,
          passPercent: m.quiz.passPercent,
        },
      });

      // Reset questions so the seed script is idempotent.
      await prisma.question.deleteMany({ where: { quizId: quiz.id } });

      for (const [qIndex, q] of m.quiz.questions.entries()) {
        const isFillBlank = q.type === "FILL_BLANK";
        // Seed data lists the correct answer first; shuffle so it lands in a
        // different slot per question. Fill-blank answers keep their order —
        // they're all accepted variants, not slots.
        const options = isFillBlank ? q.options : shuffleAnswerOptions(q.text, q.options);

        await prisma.question.create({
          data: {
            quizId: quiz.id,
            text: q.text,
            type: q.type ?? "MULTIPLE_CHOICE",
            order: qIndex,
            options: {
              create: options.map((o, oIndex) => ({
                text: o.text,
                isCorrect: isFillBlank ? true : !!o.correct,
                order: oIndex,
              })),
            },
          },
        });
      }
    }

    console.log(`Seeded module: ${created.title}`);
  }

  // Reset and reseed the glossary every run so the seed file stays the
  // source of truth (mirrors how quiz questions are reset per module above).
  await prisma.glossaryTerm.deleteMany({});
  await prisma.glossaryTerm.createMany({ data: glossaryTerms });
  console.log(`Seeded ${glossaryTerms.length} glossary terms.`);

  for (const page of handbookPages) {
    await prisma.handbookPage.upsert({
      where: { slug: page.slug },
      // Content is left alone on reseed — only title, blurb, and order are managed here.
      update: { title: page.title, summary: page.summary, order: page.order },
      create: { ...page, content: page.content ?? "" },
    });
  }
  console.log(`Handbook pages ready: ${handbookPages.length}`);

  const existingRateRules = await prisma.rateRule.count();
  if (existingRateRules === 0) {
    await prisma.rateRule.createMany({ data: rateRules });
    console.log(`Seeded ${rateRules.length} rate rules.`);
  } else {
    console.log("Rate rules already exist — skipping seed.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
