import NavBar from "@/components/layout/navBar";
import { SiCloudinary, SiMongodb, SiRender, SiVercel } from "react-icons/si";

export default function HeroFund() {
  return (
    <>
      <NavBar />
      <div className="bg-brand w-full py-16 p-4">
        <div>
          <h1 className="text-2xl py-4 text-accent text-center">
            Why I Need Your Support
          </h1>
          <p className="text-base text-justify">
            At the moment, this website runs entirely on free-tier services,
            meaning every part of it is built and maintained with limited
            resources. As the developer behind this project, I’ve poured time
            and effort into making it functional and meaningful, but keeping it
            alive and improving it long-term requires more than just time, it
            needs a bit of funding support too.
          </p>
          <br />
          <ul className="text-base text-justify list-disc list-inside">
            Your donations will directly help me sustain and grow this platform
            by covering essential costs like:
            <li className="text-vibe flex gap-2 p-2">
              <SiRender className="text-2xl" />
              <p>
                <strong>Render</strong> - for stable and reliable server-side
                hosting
              </p>
            </li>
            <li className="text-vibe flex gap-2 p-2">
              <SiMongodb className="text-2xl" />
              <p>
                <strong>MongoDB</strong> - for maintaining a secure and scalable
                database
              </p>
            </li>
            <li className="text-vibe flex gap-2 p-2">
              <SiCloudinary className="text-2xl" />
              <p>
                <strong>Cloudinary</strong> - for cloud-based image and media
                storage
              </p>
            </li>
            <li className="text-vibe flex gap-2 p-2">
              <SiVercel className="text-2xl" />
              <p>
                <strong>Vercel</strong> - for acquiring a proper custom domain
                and deployment resources
              </p>
            </li>
          </ul>
          <br />
          <p className="text-base text-justify">
            Every small contribution helps keep the site running smoothly and
            ensures I can continue improving it, from better performance and new
            features to a more polished experience for everyone.
            <br />
            <br />
            If you’ve found this site useful, enjoyable, or worth supporting,
            consider donating through <strong>PayPal</strong> or{" "}
            <strong>GCash</strong>. Your support means a lot, it keeps the
            project alive and helps it grow.
          </p>
        </div>
        <div className="p-4 flex flex-col gap-2 items-center justify-center">
          <button className="p-2 w-full bg-accent rounded-full cursor-pointer">
            <p className="font-bold text-normal text-base">
              Continue with GCash
            </p>
          </button>
          <button className="p-2 w-full bg-accent rounded-full cursor-pointer">
            <p className="font-bold text-normal text-base">
              Continue with PayPal
            </p>
          </button>
        </div>
      </div>
    </>
  );
}
