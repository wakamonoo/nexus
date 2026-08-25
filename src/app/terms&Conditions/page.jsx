"use client";
import NavBar from "@/components/layout/essentials/navBar";
import { useContext, useEffect } from "react";
import { LoaderContext } from "@/context/loaderContext";

const listItemClass =
  "relative pl-5 before:absolute before:left-1 before:top-[0.75em] before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-accent/60";

const sections = [
  {
    number: "01",
    title: "Introduction",
    content: (
      <p>
        Welcome to <strong>nexus</strong>, an independet fan community platform
        created and developed by <strong>wakamonoo</strong>. nexus provides
        tools for exploring, tracking, organizing, discussing and discovering
        Marvel-related stories accross different continuities, universes,
        timelines and eras.
        <br />
        <br />
        By accessing or using <i>ournexus.space</i>, you agree to these{" "}
        <strong>Terms and Conditions</strong>. If you do not agree with these
        terms, please fo not use the website.
      </p>
    ),
  },
  {
    number: "02",
    title: "Use of nexus",
    content: (
      <>
        <p>
          nexus provides variety of fan-oriented features, which may include:
        </p>
        <ul className="space-y-2">
          <li className={listItemClass}>Marvel title discovery and information</li>
          <li className={listItemClass}>MCU and Marvel-related watch tracking</li>
          <li className={listItemClass}>Chronological and release-order guides</li>
          <li className={listItemClass}>Marvel-adajacent and multiversal content guides</li>
          <li className={listItemClass}>Personal watch progress and statistics</li>
          <li className={listItemClass}>Custom lists and collections</li>
          <li className={listItemClass}>Reviews and rankings</li>
          <li className={listItemClass}>Community posts and rankings</li>
          <li className={listItemClass}>Global messaging</li>
          <li className={listItemClass}>User profiles and profile customization</li>
          <li className={listItemClass}>Community rankings and leaderboards</li>
          <li className={listItemClass}>Marvel related news and updates</li>
          <li className={listItemClass}>Notifications and other community features</li>
          <li className={listItemClass}>AI assisted features</li>
          <li className={listItemClass}>Exportable watchlists and other user generated materials</li>
        </ul>
        <p>Featurs may be added, modified, limited, or removed at any time.</p>
        <p>
          Information displayed on nexus may contain inaccuracies, omissions, or
          outdated information. nexus does not guarantee that release dates,
          information, or other title information will always be complete or
          accurate.
        </p>
      </>
    ),
  },
  {
    number: "03",
    title: "User Accounts",
    content: (
      <>
        <p>
          Certain nexus features require an account or authentication through
          supported third-party services.
        </p>
        <p>
          You are responsible for maintaining the security of your account and
          for activity performed in it.
        </p>
        <p>Users must not:</p>
        <ul className="space-y-2">
          <li className={listItemClass}>Impersonate another person or organization</li>
          <li className={listItemClass}>Use another person's account without authorization</li>
          <li className={listItemClass}>Attempt to gain unauthorized access to another account</li>
          <li className={listItemClass}>
            Misinterpret themselves for the purpose of deceiving other users
          </li>
          <li className={listItemClass}>
            Attempt to compromise, disrupt, or interfere with nexus or its
            services
          </li>
        </ul>
        <p>
          nexus may restrict, suspend, or terminate accounts that violate these
          Terms or threaten the safety or intergrety of the platform.
        </p>
      </>
    ),
  },
  {
    number: "04",
    title: "User-Generated Content",
    content: (
      <>
        <p>
          Users may submit content including posts, comments, reviews, rankings,
          lists, messages, profile information, images, and other materials
          supported by nexus.
        </p>
        <p>
          You remain responsible for the content you submit and must have the
          necessary rights or permissions to submit it.
        </p>
        <p>You agree not to upload or distribute content that:</p>
        <ul className="space-y-2">
          <li className={listItemClass}>
            Infringes copyright, trademark, or other intellectual property
            rights
          </li>
          <li className={listItemClass}>Contains harassment, threats, hate speech, or targeted abuse</li>
          <li className={listItemClass}>Promotes or facilitates illegal activity</li>
          <li className={listItemClass}>Contains malicious software or harmful code</li>
          <li className={listItemClass}>Attempts to deceive, defraud, or manipulate other users</li>
          <li className={listItemClass}>Impersonates another personn or organization</li>
          <li className={listItemClass}>Contains exessive spam or disruptive material</li>
          <li className={listItemClass}>Attempts to exploit, attack, or compromise nexus or its users</li>
          <li className={listItemClass}>Violates applicable laws or regulations</li>
        </ul>
        <p>
          nexus reserves the right to remove content that violates these Terms
          or is otherwise harmful to the community.
        </p>
      </>
    ),
  },
  {
    number: "05",
    title: "Community Conduct",
    content: (
      <>
        <p>
          nexus is intended to provide a respectful space for Marvel fans to
          discuss stories, share opinions, create lists, participate in
          rankings, and interact with other members.
        </p>
        <p>
          Disagreements regarding stories, characters, rankings, canon,
          continuity, or personal opinions are permitted. However, users are
          expected to interact respectfully.
        </p>
        <p>
          Harassment, targeted abuse, spam, impersonation, malicious behavior,
          coordinated disruption, and attempts to manipulate community systems
          may resul in content removal, feature restrictions, feature
          restrictions, suspension, or account termination.
        </p>
        <p>
          Community rankings, statistics, lists, reviews, and other
          user-generated information represents the opinions and activities of
          individual user and do not necessarily represent the views of nexus.
        </p>
      </>
    ),
  },
  {
    number: "06",
    title: "Messaging & Interactions",
    content: (
      <>
        <p>
          nexus may provide public chat, comments, notifications, and other
          communication features.
        </p>
        <p>Users are responsible for their interactions with other members.</p>
        <p>
          These features must not be used to harass, threaten, scam,
          impersonate, exploit, or otherwise harm another person.
        </p>
        <p>
          Users should avoid sharing sensitive personal information through
          public posts, comments, or messages.
        </p>
      </>
    ),
  },
  {
    number: "07",
    title: "AI-Assisted Features",
    content: (
      <>
        <p>
          nexus may provide AI-assisted features intended to help users
          discover, organize, understand, or interact with Marvel-related
          information.
        </p>
        <p>
          AI-generated responses may contain inaccuracies, incomplete
          information, outdated information, or incorrect interpretations.
        </p>
        <p>
          AI features are provided for informational and entertainment purposes
          and should not be treated as an authoritative source of Marvel canon,
          official announcements, legal information, or other definitive
          information.
        </p>
      </>
    ),
  },
  {
    number: "08",
    title: "Third-Party Services",
    content: (
      <>
        <p>
          nexus may rely on third-party services, APIs, authentication
          providers, hosting providers, media services, databases, and other
          external technologies.
        </p>
        <p>
          These services operate independently and may have their own terms,
          privacy policies, limitations and availability.
        </p>
        <p>
          nexus is not responsible for outages, changes, errors, or policies of
          third party services outside of its reasonable control.
        </p>
      </>
    ),
  },
  {
    number: "09",
    title: "User Content & Licensing",
    content: (
      <>
        <p>You retain ownership of content that you submit to nexus.</p>
        <p>
          By submitting content to nexus, you grant nexus a non-exclusive,
          worldwide, royalty-free license to store, reproduce, process, display,
          and distribute that content as reasonably necessary to operate the
          platform and provide its features.
        </p>
        <p>
          This license does not transfer ownership of your original content to
          nexus.
        </p>
        <p>
          You are responsible for ensuring that the content you submit does not
          infringe the rights of others.
        </p>
      </>
    ),
  },
  {
    number: "10",
    title: "Site Availability",
    content: (
      <>
        <p>
          nexus is provided on an <strong>"as is"</strong> and{" "}
          <strong>"as available"</strong>basis.
        </p>
        <p>
          Whilre reasonable efforts may be made to maintain the site, nexus does
          not guarantee that the platform will always be available,
          uninterrupted, secure, or error-free.
        </p>
        <p>
          Features may be changed, temporarily unavailable, or permanently
          removed.
        </p>
        <p>
          nexus may experience interuptions cause by maintenance, hosting
          limitations, third-party service failures, technicahl issues, or
          circumstances beyond developer's reasonable control.
        </p>
      </>
    ),
  },
  {
    number: "11",
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          To the extent permitted by applicable law, nexus and its developer
          shall not be liable for damages, losses, interruptions, data loss, or
          other consequences resulting from the use of or inability to use the
          site.
        </p>
        <p>This includes, but is not limited to, losses resulting from:</p>
        <ul className="space-y-2">
          <li className={listItemClass}>Website interuptions or downtime</li>
          <li className={listItemClass}>Third-party servuces failure</li>
          <li className={listItemClass}>Loss or corruption of user-generated content</li>
          <li className={listItemClass}>Errors or inaccuracies in information displayed on nexus</li>
          <li className={listItemClass}>Community interactions or user user-generated content</li>
          <li className={listItemClass}>External websites or services</li>
          <li className={listItemClass}>AI-generated information</li>
          <li className={listItemClass}>
            Unauthorized access resulting from circumstances outside the
            reasonable control of nexus
          </li>
        </ul>
        <p>Users access and use of nexus at their own discretion and risk.</p>
      </>
    ),
  },
  {
    number: "12",
    title: "Account Deletion",
    content: (
      <>
        <p>
          Users may request deletion of their nexus account where the relevant
          functionality is availbale.
        </p>
        <p>
          Upon account deletion, nexus will take reasonable steps to remove or
          anonymize personal account information and associated data, subject to
          technical limitations, legal requirements, security needs, and
          legitimate operational requirements.
        </p>
        <p>
          Some information may remain temporarily in backups, logs, or other
          systems where immediate deletion is not technically practical.
        </p>
        <p>
          Community content may be handled separately depending on how that
          content is associated with a deleted account.
        </p>
      </>
    ),
  },
  {
    number: "13",
    title: "Age Requirement",
    content: (
      <p>
        nexus is intended for users who are{" "}
        <strong>10 years of age or older</strong>.
        <br />
        <br />
        Users who are below the minimum age permitted by applicable law in their
        jurisdiction should not create or use an account without the required
        parental or guardian involvement.
        <br />
        <br />
        Parents or guardians are responsible for determaining whether nexus is
        appropriate for a minor under their care.
      </p>
    ),
  },
  {
    number: "14",
    title: "Changes to These Terms",
    content: (
      <p>
        These Terms and Conditions may be updated from time to time to reflect
        changes to nexus, its features, applicable requirements, or the way
        platform operates.
        <br />
        <br />
        When significant changes are made, the updated version may be made
        available through the site.
        <br />
        <br />
        Continued use of nexus after updated Terms become effective constitutes
        acceptance of the revised Terms, to the extent permitted by applicable
        law.
      </p>
    ),
  },
  {
    number: "15",
    title: "Contact",
    content: (
      <p>
        If you have questions, concerns, or other inquiries regarding nexus or
        these Terms and Conditions, please{" "}
        <a href="/recommendations">
          <strong>contact me</strong>
        </a>
        .
      </p>
    ),
  },
];

export default function TermsAndConditions() {
  const { setIsLoading } = useContext(LoaderContext);

  useEffect(() => {
    setIsLoading(false);
  }, []);
  
  return (
    <>
      <NavBar />
      <div className="bg-brand w-full pt-22 p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <header className="mb-12 border-b border-panel pb-10">
          <h1 className="text-2xl font-bold tracking-tight text-vobe">
            Terms & Conditions
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 opacity-60">
            The rules and guidelines governing your use of the nexus community
            and its features.
          </p>
          <p className="text-xs">
            Last updated:{" "}
            <strong className="font-medium opacity-60">August 17, 2026</strong>
          </p>
        </header>
        <div className="mb-10 rounded-xl border border-accent/15 bg-accent/[0.04] p-4">
          <p className="text-sm leading-7 opacity-60">
            Please read these Terms carefully before using nexus. By continuing
            to use the platform, you acknowledge that you have read and agree to
            these Terms.
          </p>
        </div>
        <div className="divide-y divide-[var(--color-panel)]">
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
