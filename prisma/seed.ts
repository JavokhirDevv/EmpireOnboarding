import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

type SeedOption = { text: string; correct?: boolean };
type SeedQuestion = { text: string; options: SeedOption[] };
type SeedQuiz = { title: string; passPercent: number; questions: SeedQuestion[] };
type SeedModule = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  estMinutes: number;
  order: number;
  content: string;
  quiz?: SeedQuiz;
};

const modules: SeedModule[] = [
  {
    slug: "welcome-to-empire-national",
    title: "Welcome to Empire National",
    category: "Company & Culture",
    summary: "Who we are, what we haul, and what it means to be part of the team.",
    estMinutes: 8,
    order: 1,
    content: `## Welcome aboard

Empire National is a full-service truckload carrier and brokerage connecting shippers and drivers across the country. As a dispatcher, you are the daily point of contact between our drivers on the road and the customers waiting on their freight — you keep loads moving safely, on time, and profitably.

## Our mission

Move freight reliably, treat drivers like partners, and give customers a dispatch team they can trust. Every load you touch reflects on the company's reputation.

## What we haul

Empire National runs a mixed fleet across several equipment types, including **dry van**, **refrigerated (reefer)**, and **flatbed**, serving regional and long-haul lanes. You'll learn the details of each equipment type in the next section.

## How the team is organized

- **Dispatchers** – plan loads, assign drivers, and are the primary point of contact for drivers during a shift.
- **Driver Managers / Fleet Managers** – handle driver onboarding, performance, and retention.
- **Operations Manager** – oversees the dispatch floor and resolves escalations.
- **Safety & Compliance** – manages DOT compliance, driver qualification files, and incident response.
- **Customer / Sales team** – books freight and manages the shipper relationship.

## What we expect from a dispatcher

- **Clear communication** — with drivers, customers, and your team lead.
- **Ownership** — if a load is yours, you own it from pickup to delivery.
- **Calm under pressure** — breakdowns, delays, and detention happen. React, don't panic.
- **Compliance first** — never ask or allow a driver to run outside of Hours of Service rules to save a load.

You'll spend the next several modules learning our equipment, our dispatch workflow, and the safety rules that keep everyone — drivers and the company — protected. Take your time, and use the quizzes to check your understanding before moving on.`,
  },
  {
    slug: "the-dispatchers-role",
    title: "The Dispatcher's Role",
    category: "Company & Culture",
    summary: "A day in the life of an Empire National dispatcher and how success is measured.",
    estMinutes: 10,
    order: 2,
    content: `## What a dispatcher actually does

A dispatcher is responsible for a group of drivers (a "board") and makes sure each one has a legal, profitable load lined up before their current one delivers. On a typical shift you will:

1. **Check overnight updates** — driver messages, load board activity, and any exceptions from the previous shift.
2. **Plan the board** — confirm every driver has their next load booked or is actively being covered.
3. **Communicate pickup and delivery details** — appointment times, addresses, load numbers, and special instructions.
4. **Track loads in transit** — via check calls and ELD/GPS tracking, watching for delays.
5. **Solve problems in real time** — traffic, breakdowns, detention, weather, and re-routes.
6. **Update the system of record** — so customers and teammates always see accurate, current status.

## How success is measured

- **On-time pickup and delivery percentage**
- **Driver utilization** — minimizing unpaid downtime between loads
- **Communication response time** — how quickly you respond to drivers and customers
- **Compliance** — zero Hours of Service violations caused by dispatch decisions

## The dispatcher/driver relationship

Drivers are our customers too. A dispatcher who is clear, honest, and responsive earns driver trust — and trusted drivers stay longer and perform better. A few ground rules:

- Always give drivers accurate information. Never promise a load isn't confirmed.
- Respect **Hours of Service** limits — it is illegal, not just risky, to pressure a driver to drive past their available hours.
- If plans change, tell the driver as soon as you know — don't let them find out at the dock.

## Escalation path

If you hit a situation you can't resolve — an accident, a serious mechanical breakdown, or a compliance question — loop in your **Fleet Manager** or **Operations Manager** immediately. Speed matters more than trying to handle it alone.`,
    quiz: {
      title: "The Dispatcher's Role — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "What is the primary responsibility of an Empire National dispatcher?",
          options: [
            { text: "Making sure each driver on their board has a legal, profitable next load", correct: true },
            { text: "Negotiating rates directly with shippers" },
            { text: "Performing roadside truck repairs" },
            { text: "Issuing CDL licenses" },
          ],
        },
        {
          text: "Which of these is NOT one of the core success metrics for a dispatcher?",
          options: [
            { text: "On-time pickup and delivery percentage" },
            { text: "Driver utilization" },
            { text: "Number of personal social media followers", correct: true },
            { text: "Communication response time" },
          ],
        },
        {
          text: "If a driver's plans change after a load is booked, when should the dispatcher tell them?",
          options: [
            { text: "As soon as the dispatcher knows", correct: true },
            { text: "Only if the driver asks" },
            { text: "When the driver arrives at the dock" },
            { text: "It's not necessary to tell them" },
          ],
        },
        {
          text: "What should a dispatcher do if a driver is out of Hours of Service but a load is at risk of being late?",
          options: [
            { text: "Respect the Hours of Service limit and adjust the plan", correct: true },
            { text: "Tell the driver to push through since the load is time-sensitive" },
            { text: "Log different hours in the system" },
            { text: "Ignore the issue and hope it resolves itself" },
          ],
        },
        {
          text: "When should a dispatcher escalate to a Fleet Manager or Operations Manager?",
          options: [
            { text: "Only at the end of the week in a summary report" },
            { text: "Never — dispatchers should always resolve issues alone" },
            { text: "Immediately for accidents, serious breakdowns, or compliance questions", correct: true },
            { text: "Only if the customer complains first" },
          ],
        },
      ],
    },
  },
  {
    slug: "trailer-types-101",
    title: "Trailer Types 101",
    category: "Equipment & Trailers",
    summary: "The trailer types in our fleet and what freight each one is built to haul.",
    estMinutes: 12,
    order: 3,
    content: `## Why trailer type matters

Matching the right trailer to the right freight is one of the most important calls a dispatcher makes. Booking the wrong equipment type causes missed pickups, damaged freight, and unhappy customers. Here are the trailer types you'll dispatch most often.

## Dry Van

The most common trailer in trucking — a fully enclosed box, typically 53 feet long. Used for general freight: packaged goods, retail products, non-perishable food, and palletized cargo. Loaded and unloaded from the rear via a dock.

## Refrigerated ("Reefer")

An enclosed trailer with a temperature-controlled unit built into the nose. Used for perishable freight — produce, meat, dairy, pharmaceuticals. Dispatchers must confirm the **set temperature** and whether the unit runs **continuous or cycle mode**, and track fuel for the reefer unit separately from the truck.

## Flatbed

An open trailer with no walls or roof — freight is secured with straps, chains, and tarps instead of being enclosed. Used for lumber, steel, machinery, pipe, and construction materials. Drivers need flatbed-specific securement training and load-specific tarps.

## Step Deck (Drop Deck)

Like a flatbed but with two height levels — a raised front deck and a lower rear deck — allowing taller freight to stay under the legal height limit. Common for tall equipment and machinery.

## Removable Gooseneck (RGN) / Lowboy

A specialized flatbed with a detachable front section, allowing wheeled or tracked equipment to be driven directly onto the trailer. Used for heavy construction and industrial equipment. Often requires permits for oversize/overweight loads.

## Tanker

Hauls liquids or gases in bulk — fuel, chemicals, food-grade liquids like milk or juice. Requires drivers to hold a **Tank Vehicle (N) endorsement**, and food-grade and hazmat tankers have extra handling and cleaning requirements.

## Power Only

No trailer at all — the carrier supplies just the tractor and driver to pull a trailer owned by the shipper or another party (common with drop-and-hook freight or intermodal/container moves).

## Auto Hauler

A specialized open or enclosed trailer built to transport multiple vehicles at once, typically for dealership or auction moves.

## Quick reference

| Trailer Type | Best For |
| --- | --- |
| Dry Van | General, palletized, non-perishable freight |
| Reefer | Temperature-sensitive freight |
| Flatbed | Building materials, machinery |
| Step Deck | Tall freight needing extra clearance |
| RGN / Lowboy | Heavy, wheeled equipment |
| Tanker | Bulk liquids and gases |
| Power Only | Drop-and-hook, shipper-owned trailers |
| Auto Hauler | Vehicle transport |`,
    quiz: {
      title: "Trailer Types 101 — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "Which trailer type is the fully enclosed 53-foot box most commonly used for general freight?",
          options: [
            { text: "Dry Van", correct: true },
            { text: "Flatbed" },
            { text: "Step Deck" },
            { text: "RGN" },
          ],
        },
        {
          text: "A load of fresh produce that must stay refrigerated should be dispatched on which trailer?",
          options: [
            { text: "Power Only" },
            { text: "Reefer", correct: true },
            { text: "Auto Hauler" },
            { text: "Tanker" },
          ],
        },
        {
          text: "What makes a Step Deck trailer different from a standard flatbed?",
          options: [
            { text: "It has two height levels to keep tall freight under the legal height limit", correct: true },
            { text: "It is fully enclosed" },
            { text: "It can only haul liquids" },
            { text: "It has no wheels" },
          ],
        },
        {
          text: "Which trailer type allows wheeled or tracked equipment to be driven directly onto it via a detachable front section?",
          options: [
            { text: "Dry Van" },
            { text: "Reefer" },
            { text: "Removable Gooseneck (RGN) / Lowboy", correct: true },
            { text: "Power Only" },
          ],
        },
        {
          text: "What special driver endorsement is typically required to haul a tanker load?",
          options: [
            { text: "Tank Vehicle (N) endorsement", correct: true },
            { text: "Motorcycle endorsement" },
            { text: "School Bus (S) endorsement" },
            { text: "No special endorsement is needed" },
          ],
        },
      ],
    },
  },
  {
    slug: "truck-types-and-configurations",
    title: "Truck Types & Configurations",
    category: "Equipment & Trailers",
    summary: "Tractor and truck configurations you'll see across the fleet and driver network.",
    estMinutes: 9,
    order: 4,
    content: `## Day Cab vs. Sleeper Cab

- **Day Cab** — no sleeping berth. Used for short-haul, regional routes where the driver returns home or to a terminal nightly.
- **Sleeper Cab** — includes a berth for the driver to rest during required off-duty time. Used for long-haul, over-the-road (OTR) routes where drivers are away for days at a time.

## Straight Truck vs. Tractor-Trailer

- **Straight Truck** — the cab and cargo area are one single unit (no separate trailer). Common for local delivery and box truck routes.
- **Tractor-Trailer** — a separate tractor (the powered unit) pulls a detachable trailer. This is the standard combination for most over-the-road freight.

## Axle configurations

Axle count affects legal weight limits and the type of freight a truck can haul:

- **Tandem axle tractor** — two rear axles on the tractor; the most common setup for van and reefer freight.
- **Tridem / spread axle trailer** — extra axles on the trailer to legally carry heavier loads, common on flatbed and specialized heavy-haul equipment.

## Why this matters for dispatch

When you're booking a load, you need to confirm the truck/trailer combination can legally and physically handle the freight — matching axle configuration to weight, and sleeper vs. day cab to the length of the route. Booking a day-cab driver on a 1,200-mile run sets them up to violate Hours of Service rules, since they have nowhere to legally rest.`,
    quiz: {
      title: "Truck Types & Configurations — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "Which cab type includes a berth for the driver to rest during required off-duty time?",
          options: [
            { text: "Day Cab" },
            { text: "Sleeper Cab", correct: true },
            { text: "Straight Truck" },
            { text: "Auto Hauler" },
          ],
        },
        {
          text: "A day cab driver is best suited for which type of route?",
          options: [
            { text: "A 1,200-mile cross-country run" },
            { text: "A short-haul regional route returning to base nightly", correct: true },
            { text: "A multi-day sleeper run" },
            { text: "International ocean freight" },
          ],
        },
        {
          text: "In a tractor-trailer combination, what is the 'tractor'?",
          options: [
            { text: "The detachable cargo trailer" },
            { text: "The powered unit that pulls the trailer", correct: true },
            { text: "A type of forklift" },
            { text: "The loading dock equipment" },
          ],
        },
        {
          text: "Why does axle configuration matter when booking a load?",
          options: [
            { text: "It affects legal weight limits for the freight", correct: true },
            { text: "It determines the driver's pay rate" },
            { text: "It has no impact on dispatch decisions" },
            { text: "It only matters for reefer loads" },
          ],
        },
      ],
    },
  },
  {
    slug: "load-planning-and-booking",
    title: "Load Planning & Booking",
    category: "Dispatch Workflow",
    summary: "How loads get booked, confirmed, and assigned to a driver from start to finish.",
    estMinutes: 11,
    order: 5,
    content: `## The lifecycle of a load

1. **Load is booked** — sales/customer team confirms the freight, rate, and pickup/delivery windows with the shipper.
2. **Rate confirmation** — a document outlining pickup/delivery locations, appointment times, rate, and load-specific instructions. Always review this before dispatching a driver.
3. **Driver assignment** — dispatcher matches the load to an available, compliant driver with the right trailer type and Hours of Service to make it.
4. **Dispatch to driver** — driver receives pickup details: address, appointment window, load/reference numbers, and special instructions (e.g., "driver assist," "lumper required," "no touch freight").
5. **Pickup confirmation** — driver checks in, loads freight, and confirms the Bill of Lading (BOL) matches what's expected.
6. **In-transit tracking** — dispatcher monitors progress via check calls and ELD/GPS.
7. **Delivery confirmation** — driver delivers, gets the BOL signed, and confirms delivery time back to dispatch.

## Reading a rate confirmation

Every rate confirmation should be checked for:

- **Pickup and delivery addresses and appointment windows**
- **Commodity and weight** (confirms the right trailer type and legal weight)
- **Rate and any accessorial charges** (detention, layover, lumper fees)
- **Special instructions** (temperature settings, tarping requirements, dock hours)

## Matching driver to load

Before assigning a load, confirm:

- The driver has enough **Hours of Service** remaining to make the pickup and delivery appointments legally.
- The **trailer type** matches what the freight requires.
- The driver's **location** allows a reasonable deadhead (empty miles) to pickup.
- Any **compliance holds** (expired medical card, missing inspection) are cleared.

## Common booking mistakes to avoid

- Confirming an appointment time without checking the driver's actual available hours.
- Assigning the wrong trailer type (e.g., a dry van driver for a reefer load).
- Failing to pass along special instructions, leading to a rejected delivery.
- Not confirming detention or lumper policies before the driver arrives, causing disputes at the dock.`,
    quiz: {
      title: "Load Planning & Booking — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "What document outlines pickup/delivery locations, appointment times, rate, and instructions for a load?",
          options: [
            { text: "Bill of Lading" },
            { text: "Rate confirmation", correct: true },
            { text: "Driver qualification file" },
            { text: "Certificate of insurance" },
          ],
        },
        {
          text: "Before assigning a load to a driver, what must a dispatcher confirm about Hours of Service?",
          options: [
            { text: "Nothing — HOS is the driver's responsibility only" },
            { text: "The driver has enough hours remaining to legally make pickup and delivery", correct: true },
            { text: "The driver has been driving for exactly 8 hours" },
            { text: "HOS only matters for reefer loads" },
          ],
        },
        {
          text: "What confirms that the freight loaded matches what was expected at pickup?",
          options: [
            { text: "The Bill of Lading (BOL)", correct: true },
            { text: "The driver's CDL" },
            { text: "The fuel receipt" },
            { text: "The load board posting" },
          ],
        },
        {
          text: "Which of these is a common booking mistake dispatchers should avoid?",
          options: [
            { text: "Confirming an appointment without checking the driver's available hours", correct: true },
            { text: "Reviewing the rate confirmation before dispatching" },
            { text: "Matching trailer type to the freight" },
            { text: "Passing along special instructions to the driver" },
          ],
        },
        {
          text: "What should be confirmed before a driver arrives at a dock with detention or lumper fee policies?",
          options: [
            { text: "Nothing, it can be sorted out afterward" },
            { text: "The detention or lumper policy, to avoid disputes at the dock", correct: true },
            { text: "Only the driver's home address" },
            { text: "The color of the trailer" },
          ],
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
  {
    slug: "hours-of-service-basics",
    title: "Hours of Service (HOS) Basics",
    category: "Safety & Compliance",
    summary: "The FMCSA driving-time rules every dispatcher must respect when planning loads.",
    estMinutes: 12,
    order: 7,
    content: `## Why this matters

Hours of Service (HOS) rules are federal regulations from the FMCSA that limit how long a commercial driver can drive and work before resting. They exist to prevent fatigue-related crashes. A dispatcher who pressures a driver to run outside these limits isn't just risking a fine — they're risking lives, and it can result in the company being placed **out of service**.

## The core rules (property-carrying drivers)

- **11-Hour Driving Limit** — a driver may drive a maximum of 11 hours after 10 consecutive hours off duty.
- **14-Hour Window** — a driver may not drive beyond the 14th consecutive hour after coming on duty, following 10 hours off duty. This window doesn't pause for breaks.
- **30-Minute Break Rule** — a driver must take a 30-minute break after 8 cumulative hours of driving without at least a 30-minute interruption.
- **60/70-Hour Limit** — a driver may not drive after being on duty 60 hours in 7 consecutive days (or 70 hours in 8 days), depending on the carrier's operation. This resets with 34 consecutive hours off duty ("34-hour restart").
- **Sleeper Berth Provision** — sleeper-equipped drivers can split their required 10 hours off duty into two periods (e.g., 7/3 or 8/2 split), as long as neither period is less than 2 hours and they combine to at least 10 hours, with specific rules about which period counts toward the 14-hour window.

## ELDs (Electronic Logging Devices)

Nearly all commercial drivers are required to use an ELD, which automatically records driving time and enforces these limits. Dispatchers can see a driver's available hours in the TMS or ELD dashboard — **always check this before booking an appointment time**, not just when a driver flags a problem.

## What dispatchers must never do

- Ask or pressure a driver to falsify logs.
- Book an appointment time that requires a driver to drive beyond their available hours.
- Ignore a driver's warning that they're low on hours.
- Treat HOS violations as a "cost of doing business" — they are a serious compliance and safety failure.

## When a driver is low on hours

Plan around it: find a legal stopping point, adjust the delivery appointment with the customer, or swap the load to another driver with available hours. It is always the dispatcher's job to solve this within the rules — never the driver's job to break them.`,
    quiz: {
      title: "Hours of Service Basics — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "Under the 11-Hour Driving Limit, how many hours may a driver drive after 10 consecutive hours off duty?",
          options: [
            { text: "8 hours" },
            { text: "11 hours", correct: true },
            { text: "14 hours" },
            { text: "24 hours" },
          ],
        },
        {
          text: "What does the 14-Hour Window rule limit?",
          options: [
            { text: "The total miles a driver can drive in a week" },
            { text: "The window of consecutive hours in which a driver may drive after coming on duty, following 10 hours off", correct: true },
            { text: "The number of stops a driver can make" },
            { text: "The maximum weight a truck can carry" },
          ],
        },
        {
          text: "What is required after 8 cumulative hours of driving without at least a 30-minute interruption?",
          options: [
            { text: "A mandatory 30-minute break", correct: true },
            { text: "An immediate 10-hour reset" },
            { text: "A phone call to dispatch" },
            { text: "Nothing is required" },
          ],
        },
        {
          text: "What allows a driver's on-duty hour limit (60/70-hour rule) to reset?",
          options: [
            { text: "Driving faster to finish early" },
            { text: "34 consecutive hours off duty", correct: true },
            { text: "Switching trailers" },
            { text: "It never resets" },
          ],
        },
        {
          text: "What should a dispatcher do if a driver reports they are low on available hours?",
          options: [
            { text: "Tell them to keep driving to make the appointment" },
            { text: "Ask them to adjust their logs" },
            { text: "Plan around it — find a legal stop, adjust the appointment, or reassign the load", correct: true },
            { text: "Ignore it since ELDs will handle it automatically" },
          ],
        },
      ],
    },
  },
  {
    slug: "dot-compliance-and-documentation",
    title: "DOT Compliance & Documentation",
    category: "Safety & Compliance",
    summary: "Key documents and compliance checks dispatchers should know about, even if Safety owns them.",
    estMinutes: 10,
    order: 8,
    content: `## Dispatch's role in compliance

Compliance is primarily owned by the Safety department, but dispatchers interact with compliance-related documents and rules every day. Knowing the basics helps you avoid booking a driver or load that isn't legally cleared to run.

## Key documents you'll encounter

- **Bill of Lading (BOL)** — the legal document confirming what freight was picked up, from where, and going to where. Signed at pickup and delivery.
- **Rate Confirmation** — the agreement between the carrier and the customer/broker for a specific load's terms.
- **Driver Qualification (DQ) File** — maintained by Safety, includes the driver's CDL, medical certificate, and driving record. A driver with an expired medical card cannot legally drive.
- **Certificate of Insurance (COI)** — proof of the carrier's cargo and liability insurance, sometimes requested by customers before a load.
- **Permits** — required for oversize/overweight loads (common with flatbed, step deck, and RGN freight), and vary by state.

## CDL classes (know the basics)

- **Class A** — required for combination vehicles (tractor-trailer) over 26,001 lbs GVWR — the standard license for most of our OTR drivers.
- **Class B** — for single vehicles over 26,001 lbs GVWR (e.g., straight trucks), not towing a trailer over 10,000 lbs.
- **Endorsements** — additional certifications layered onto a CDL, such as **Hazmat (H)**, **Tanker (N)**, or combined **Tanker/Hazmat (X)**.

## Red flags dispatchers should escalate to Safety

- A driver's medical card or CDL is expiring soon or has expired.
- A load requires an endorsement (e.g., hazmat) the assigned driver doesn't hold.
- An oversize/overweight load doesn't have permits confirmed for the route.
- Any accident, injury, or serious mechanical failure in transit.

## Why this matters

Booking a load with a non-compliant driver or missing documentation can result in the load being turned away at the dock, fines, or a roadside out-of-service order — all of which cost the company money and damage customer trust. When in doubt, ask Safety before dispatching.`,
    quiz: {
      title: "DOT Compliance & Documentation — Knowledge Check",
      passPercent: 80,
      questions: [
        {
          text: "What document is signed at both pickup and delivery to confirm what freight was picked up and delivered?",
          options: [
            { text: "Certificate of Insurance" },
            { text: "Bill of Lading (BOL)", correct: true },
            { text: "Driver Qualification File" },
            { text: "Rate Confirmation" },
          ],
        },
        {
          text: "What happens if a driver's medical certificate has expired?",
          options: [
            { text: "Nothing, it's just a formality" },
            { text: "They cannot legally drive until it's renewed", correct: true },
            { text: "They can still drive for one more week" },
            { text: "Only Safety needs to know, dispatch can ignore it" },
          ],
        },
        {
          text: "Which CDL class is required for most tractor-trailer combination vehicles over 26,001 lbs GVWR?",
          options: [
            { text: "Class A", correct: true },
            { text: "Class B" },
            { text: "Class C" },
            { text: "No CDL is required" },
          ],
        },
        {
          text: "What type of load commonly requires special state permits due to size or weight?",
          options: [
            { text: "Standard dry van freight" },
            { text: "Oversize/overweight flatbed, step deck, or RGN loads", correct: true },
            { text: "Small parcel freight" },
            { text: "Empty trailer moves" },
          ],
        },
        {
          text: "If a load requires a hazmat endorsement and the assigned driver doesn't have one, what should the dispatcher do?",
          options: [
            { text: "Dispatch the load anyway" },
            { text: "Escalate to Safety before dispatching", correct: true },
            { text: "Have the driver drive without the endorsement just this once" },
            { text: "Cancel all future loads for that driver" },
          ],
        },
      ],
    },
  },
];

const glossaryTerms: { term: string; definition: string; order: number }[] = [
  {
    term: "TMS",
    definition:
      "Transportation Management System — the software used to create loads, assign drivers, and track status.",
    order: 1,
  },
  {
    term: "ELD",
    definition:
      "Electronic Logging Device — records a driver's hours of service automatically; replaces paper logbooks.",
    order: 2,
  },
  {
    term: "HOS",
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
    definition:
      "Bill of Lading — the legal document confirming what freight was picked up, from where, and going to where.",
    order: 8,
  },
  {
    term: "OTR",
    definition: "Over-the-Road — long-haul driving where a driver is away from home for multiple days at a time.",
    order: 9,
  },
  {
    term: "Reefer",
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

  for (const m of modules) {
    const created = await prisma.module.upsert({
      where: { slug: m.slug },
      update: {
        title: m.title,
        category: m.category,
        summary: m.summary,
        content: m.content,
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
        await prisma.question.create({
          data: {
            quizId: quiz.id,
            text: q.text,
            order: qIndex,
            options: {
              create: q.options.map((o, oIndex) => ({
                text: o.text,
                isCorrect: !!o.correct,
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
