import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { shuffleAnswerOptions } from "../src/lib/quiz-options";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

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
    order: 3,
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
    order: 4,
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
    order: 5,
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

![Standard-roof cargo van](/equipment/cargo-van.png)

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
    title: "Driver Communication & Check Calls",
    category: "Dispatch Workflow",
    summary: "How and when dispatchers stay in touch with drivers throughout a load.",
    estMinutes: 8,
    order: 6,
    content: `## Why check calls matter

A check call is a scheduled touchpoint between dispatcher and driver to confirm status: location, ETA, and any issues. Consistent check calls let you catch problems — traffic, breakdowns, delays — early enough to fix them before they impact the customer.

## Standard check-call cadence

- **At dispatch** — confirm the driver received and understood the load details.
- **At pickup** — confirm freight is loaded and BOL matches expectations.
- **Mid-route** — at least once per shift on multi-day runs, or per company policy for shorter runs.
- **Pre-delivery** — confirm ETA against the appointment window with enough lead time to notify the customer of any change.
- **At delivery** — confirm delivery time and that the BOL was signed and returned.

## Communication tools

- **ELD / in-cab messaging** — for structured location and status updates.
- **Phone and SMS** — for real-time conversations, especially urgent issues.
- **TMS (Transportation Management System)** — the system of record where dispatchers log every update so the whole team can see current status.

## Best practices

- Always log the outcome of a check call in the TMS, not just in a text thread — the next shift needs to see it too.
- If a driver reports they'll miss an appointment, notify the customer-facing team **immediately**, not after the appointment has already passed.
- Keep a professional, respectful tone — drivers are working long hours alone on the road, and a good relationship with dispatch makes their day easier.
- Never ignore a driver message. Even a quick acknowledgment ("got it, checking now") keeps trust intact.`,
    quiz: {
      title: "Driver Communication & Check Calls — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "What is a 'check call'?",
          options: [
            { text: "A scheduled touchpoint to confirm a driver's location, ETA, and any issues", correct: true },
            { text: "A call to verify the driver's CDL number" },
            { text: "A customer complaint call" },
            { text: "A call made only when a load is cancelled" },
          ],
        },
        {
          text: "Where should the outcome of a check call be recorded?",
          options: [
            { text: "Nowhere, it doesn't need to be tracked" },
            { text: "Only in a personal notebook" },
            { text: "In the TMS, so the whole team can see current status", correct: true },
            { text: "Only in a text message thread" },
          ],
        },
        {
          text: "If a driver reports they will miss a delivery appointment, what should the dispatcher do?",
          options: [
            { text: "Wait until after the appointment time to say anything" },
            { text: "Notify the customer-facing team immediately", correct: true },
            { text: "Do nothing, it's the driver's problem" },
            { text: "Cancel the load" },
          ],
        },
        {
          text: "Which of these is NOT a typical check-call point in a load's lifecycle?",
          options: [
            { text: "At dispatch" },
            { text: "At pickup" },
            { text: "At delivery" },
            { text: "Only after the invoice is paid", correct: true },
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

  const existingTerms = await prisma.glossaryTerm.count();
  if (existingTerms === 0) {
    await prisma.glossaryTerm.createMany({ data: glossaryTerms });
    console.log(`Seeded ${glossaryTerms.length} glossary terms.`);
  } else {
    console.log("Glossary already has terms — skipping seed.");
  }

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
