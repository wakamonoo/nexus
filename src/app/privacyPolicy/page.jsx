"use client";
import NavBar from "@/components/layout/navBar";
import { useContext, useEffect } from "react";
import { LoaderContext } from "@/context/loaderContext";

export default function PrivacyPolicy() {
  const { setIsLoading } = useContext(LoaderContext);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <NavBar />
      <div className="bg-brand w-full py-16 p-4">
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">1. Overview</h1>
          <p className="text-base text-justify">
            This Privacy Policy explains how I collect, use, and protect
            personal information from users of the Nexus community.
          </p>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">
            2. Information I Collect
          </h1>
          <p className="text-base text-justify">
            When you register or use Nexus, I collect the following:
          </p>
          <br />
          <ul className="text-base text-justify list-disc list-inside">
            Personal Information:
            <li className="text-sm text-vibe">Google account name</li>
            <li className="text-sm text-vibe">Email address</li>
            <li className="text-sm text-vibe">Profile photo</li>
            <li className="text-sm text-vibe">Optional user bio</li>
          </ul>
          <ul className="text-base text-justify list-disc list-inside">
            Activity Information:
            <li className="text-sm text-vibe">
              Posts, comments, and chat messages
            </li>
            <li className="text-sm text-vibe">
              MCU titles tracked or marked as watched
            </li>
            <li className="text-sm text-vibe">
              Rankings and personal preference
            </li>
            <li className="text-sm text-vibe">Interaction logs</li>
          </ul>
          <ul className="text-base text-justify list-disc list-inside">
            Technical Information:
            <li className="text-sm text-vibe">
              Google account ID (for authentication)
            </li>
            <li className="text-sm text-vibe">
              Basic timestamps for login and activity
            </li>
          </ul>
          <br />
          <p className="text-base text-justify">
            I do not collect addresses, phone numbers, or payment information.
          </p>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">
            3. How I Use Your Information
          </h1>
          <ul className="text-base text-justify list-disc list-inside">
            Your information is used only to:
            <li className="text-sm text-vibe">
              Provide access to community features
            </li>
            <li className="text-sm text-vibe">
              Allow you to track and rank MCU titles
            </li>
            <li className="text-sm text-vibe">
              Maintain your personalized profile and account
            </li>
            <li className="text-sm text-vibe">
              Moderate content for community safety and integrity
            </li>
          </ul>
          <br />
          <p className="text-base text-justify">
            I do not sell, rent, or trade your information.
          </p>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">
            4. Data Storage and Third-Party Services
          </h1>
          <ul className="text-base text-justify list-disc list-inside">
            I rely on secure, trusted providers for authentication, storage, and
            media hosting:
            <li className="text-sm text-vibe">
              <strong>Firebase Authentication (Google)</strong>: user login and
              verification
            </li>
            <li className="text-sm text-vibe">
              <strong>MongoDB Atlas</strong>: database for storing user activity
              and profile data
            </li>
            <li className="text-sm text-vibe">
              <strong> Cloudinary</strong>: image and video storage
            </li>
          </ul>
          <br />
          <p className="text-base text-justify">
            Each provider follows its own strict security and privacy standards.
          </p>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">
            5. Data Retention and Deletion
          </h1>
          <p className="text-base text-justify">
            You may delete your account at any time. When you do, your personal
            data, posts, and rankings are permanently removed. Temporary backups
            may exist briefly before full deletion for technical consistency.
          </p>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">
            6. Data Security
          </h1>
          <p className="text-base text-justify">
            I implement reasonable technical measures to protect your data.
            However, no system is completely secure. Please be mindful of the
            information you share publicly.
          </p>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">
            7. Children’s Privacy
          </h1>
          <p className="text-base text-justify">
            Nexus is not directed toward children under 10 years old. If I
            discover that a user under 10 has registered, I will remove their
            account and delete all related data.
          </p>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">
            8. Changes to This Policy
          </h1>
          <p className="text-base text-justify">
            I may update this Privacy Policy from time to time. Any changes will
            be reflected on this page with an updated “Last Updated” date..
          </p>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-left">9. Contact</h1>
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
