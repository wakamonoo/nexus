"use client";
import NavBar from "@/components/layout/essentials/navBar";

const listItemClass =
  "relative pl-5 before:absolute before:left-1 before:top-[0.75em] before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-accent/60";

const sections = [
  {
    number: "01",
    title: "Overview",
    content: (
      <p>
        This Privacy Policy explains how <strong>Nexus</strong> collects, uses,
        and protests information when you use the platform.
      </p>
    ),
  },
  {
    number: "02",
    title: "Information We Collect",
    content: (
      <>
        <p>Depending on how you use Nexus, we may collect:</p>
        <ul className="space-y-2">
          <li className={listItemClass}>
            Google account name, email, profile photo, and account ID
          </li>
          <li className={listItemClass}>
            Optional profile information such as your bio
          </li>
          <li className={listItemClass}>
            Posts, comments, reviews, messages, lists, and rankings
          </li>
          <li className={listItemClass}>
            Watch progress, preferences, and community activity
          </li>
          <li className={listItemClass}>
            Basic authentication and activity timestamps
          </li>
        </ul>
        <p>
          We do not intentionally collect physical addresses, phone numbers, or
          payment information.
        </p>
      </>
    ),
  },
  {
    number: "03",
    title: "How We Use Information",
    content: (
      <>
        <p>Your information is used to:</p>
        <ul className="space-y-2">
          <li className={listItemClass}>Provide and maintain Nexus features</li>
          <li className={listItemClass}>
            Manage accounts, profiles, and personalized features
          </li>
          <li className={listItemClass}>
            Store watch progress, rankings, lists, and community activity
          </li>
          <li className={listItemClass}>
            Maintain security and moderate the community
          </li>
        </ul>
        <p>We do not sell, rent, or trade your personal information.</p>
      </>
    ),
  },
  {
    number: "04",
    title: "Third-Party Services",
    content: (
      <>
        <p>
          Nexus relies on third-party services to operate certain features,
          including:
        </p>
        <ul className="space-y-2">
          <li className={listItemClass}>
            <strong>Firebase Authentication</strong> - account authentication
          </li>
          <li className={listItemClass}>
            <strong>MongoDB Atlas</strong> - account and community data
          </li>
          <li className={listItemClass}>
            <strong>Cloudinary</strong> - image and media storage
          </li>
        </ul>
        <p>
          These services operate under their own privacy policies and terms.
        </p>
      </>
    ),
  },
  {
    number: "05",
    title: "Data Retention & Deletion",
    content: (
      <p>
        You may request deletion of your Nexus account. We will take reasonable
        steps to remove or anonimyze associated personal information and account
        data. Some information may remain temporarily in backups or logs where
        immediate deletion is not technically practical.
      </p>
    ),
  },
  {
    number: "06",
    title: "Data Security",
    content: (
      <p>
        Nexus uses reasonable technical measures to protect your information.
        However, no online service can guarantee complete security. Avoid
        sharing sensitive personal information through public community
        features.
      </p>
    ),
  },
  {
    number: "07",
    title: "Children's Privacy",
    content: (
      <p>
        Nexus is intended for users <strong>10 years of age or older</strong>.
        If we become aware that an account belongs to someone below the
        applicable minimum age, reasonable steps will be taken to remove the
        account and associated personal information.
      </p>
    ),
  },
  {
    number: "08",
    title: "Changes to This Policy",
    content: (
      <p>
        This Privacy Policy may be updated as Nexus and its data practices
        change. Updates will be reflected on this page with a revised{" "}
        <strong>Last Updated</strong> date.
      </p>
    ),
  },
  {
    number: "09",
    title: "Contact",
    content: (
      <p>
        For questions, concerns, or privacy-related requests, please{" "}
        <a href="/recommendations">
          <strong>contact me</strong>
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <NavBar />
      <div className="bg-brand w-full pt-22 p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <header className="mb-12 border-b border-panel pb-10">
          <h1 className="text-2xl font-bold tracking-tight text-vobe">
            Privacy Policy
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 opacity-60">
            How Nexus collects, uses, and protects information when you use the
            platform.
          </p>
          <p className="text-xs">
            Last updated:{" "}
            <strong className="font-medium opacity-60">August 17, 2026</strong>
          </p>
        </header>
        <div className="mb-10 rounded-xl border border-accent/15 bg-accent/4 p-4">
          <p className="text-sm leading-7 opacity-60">
            This policy explains what information Nexus collects and how it is
            used.
          </p>
        </div>
        <div className="divide-y divide-(--color-panel)">
          {sections.map((section) => (
            <section
              key={section.number}
              className="grid grid-cols-[110px_1fr] py-8"
            >
              <div>
                <span className="text-sm font-bold tracking-[0.2em] text-accent/60">
                  {section.number}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="mb4 text-lg font-semibold tracking-tight text-vibe">
                  {section.title}
                </h2>
                <div className="space-y-4 text-base leading-tight text-vibe">
                  {section.content}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
