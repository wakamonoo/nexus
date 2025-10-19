"use client";
import NavBar from "@/components/layout/navBar";
import { useContext, useEffect } from "react";
import { LoaderContext } from "@/context/loaderContext";

export default function TermsAndConditions() {
  const { setIsLoading } = useContext(LoaderContext);

  useEffect(() => {
    setIsLoading(false);
  }, []);
  return (
    <>
      <NavBar />
      <div className="bg-brand w-full py-16 p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">
            1. Introduction
          </h1>
          <p className="text-base text-justify">
            Welcome to <strong>Nexus</strong>, an independent, fan-made{" "}
            <strong>Marvel Cinematic Universe</strong> (MCU) community created
            and developed by <strong>Joven Bataller</strong>.
            <br />
            <br />
            By accessing or using <i>nexus-wakamonoo.vercel.app</i>, you agree
            to these <strong>Terms and Conditions</strong> and to my{" "}
            <strong>Privacy Policy</strong>. If you do not agree, please do not
            use this Site.
          </p>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">
            2. Ownership and Legal Disclaimer
          </h1>
          <p className="text-base text-justify">
            This website is a personal, non-commercial fan project built for
            entertainment and educational purposes. I am not affiliated,
            sponsored, or endorsed by <strong>Marvel Studios</strong>,{" "}
            <strong>The Walt Disney Company</strong>, or any of their
            subsidiaries or affiliates.
            <br />
            <br />
            All trademarks, logos, character names, and movie titles remain the
            exclusive property of their respective owners, including{" "}
            <strong>Marvel</strong> and
            <strong>Disney</strong>.
            <br />
            <br />
            All original code, systems, design, and written content belong to
            me, <strong>Joven Bataller</strong>, and are used to provide a space
            for MCU fans to connect, rank titles, and share insights. I make no
            claim of ownership over any <strong>Marvel</strong> or{" "}
            <strong>Disney</strong> intellectual property.
          </p>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">
            3. User Accounts
          </h1>
          <ul className="text-base text-justify">
            Users must sign in through <strong>Google Authentication</strong> to
            interact with community features.
          </ul>
          <br />
          <ul className="text-base text-justify list-disc list-inside">
            Registered users can:{" "}
            <li className="text-sm text-vibe">Create posts and comments</li>
            <li className="text-sm text-vibe">
              Participate in the global chat
            </li>
            <li className="text-sm text-vibe">
              Track MCU titles and mark them as watched or unwatched
            </li>
            <li className="text-sm text-vibe">Rank their favorite titles</li>
            <li className="text-sm text-vibe">
              Update their profile name, photo, and bio
            </li>
          </ul>
          <br />
          <ul className="text-base text-justify">
            Users can delete their accounts at any time, and their personal data
            and activity will be removed from the platform.
          </ul>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">
            4. User Content and Responsibilities
          </h1>
          <ul className="text-base text-justify">
            You are responsible for the content you post, including text,
            images, videos, rankings, and other submissions.
          </ul>
          <br />
          <ul className="text-base text-justify list-disc list-inside">
            You agree <strong>not to upload </strong> or share any material
            that:
            <li className="text-sm text-vibe">
              Violates copyright or intellectual property laws
            </li>
            <li className="text-sm text-vibe">
              Contains harassment, hate speech, or harmful material
            </li>
            <li className="text-sm text-vibe">
              Involves illegal activity or promotes it
            </li>
          </ul>
          <br />
          <ul className="text-base text-justify">
            I reserve the right to remove any content or account that violates
            these rules or disrupts the community space.
          </ul>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">
            5. Copyright and Attribution
          </h1>
          <p className="text-base text-justify">
            All movie posters and promotional artwork are sourced from{" "}
            <strong>The Poster Database (TPDb)</strong> and belong to their
            respective creators.
            <br />
            <br />
            Full credit is given to the original artists. If any artist requests
            removal or correction of their work, I will respond promptly.
          </p>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">
            6. Community Conduct
          </h1>
          <p className="text-base text-justify">
            Nexus is built to foster positive, respectful interaction among MCU
            fans. Any form of harassment, spamming, impersonation, or malicious
            behavior will result in removal of content or account suspension.
          </p>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">
            7. Limitation of Liability
          </h1>
          <p className="text-base text-justify">
            The Site is provided “as is.”
            <br />
            <br />
            I, <strong>Joven Bataller</strong>, am not responsible for any
            damages or data loss resulting from use of the Site, community
            content, or external links.
          </p>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">
            8. Age Requirement
          </h1>
          <p className="text-base text-justify">
            To ensure safety and legal compliance, this Site is intended for
            individuals aged <strong>10 years or older</strong>.
          </p>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">
            9. Modifications
          </h1>
          <p className="text-base text-justify">
            I may update these Terms at any time. Continued use of the Site
            after updates means you accept the revised Terms.
          </p>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">10. Contact</h1>
          <p className="text-base text-justify">
            For questions about these Terms, please{" "}
            <a href="https://nexus-wakamonoo.vercel.app/recommendations">
              <strong>contact me.</strong>
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
