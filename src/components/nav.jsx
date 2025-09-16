import {
  FaHome,
  FaSignInAlt,
  FaUser,
} from "react-icons/fa";
import { MdClose, MdInfo, MdMovie } from "react-icons/md";

export default function Nav({ setShowNav, setShowSignIn }) {
  return (
    <div
      onClick={() => setShowNav(false)}
      className="inset-0 z-[80] backdrop-blur-xs flex fixed"
    >
      <div className="fixed right-0 top-0 w-[60%] h-screen bg-panel px-8 py-4">
        <MdClose onClick={() => setShowNav(false)} className="text-2xl" />
        <div className="p-4 mt-4">
          <ul className="flex flex-col gap-4">
            <li>
              <div className="flex gap-2 items-center">
                <FaHome className="text-2xl" />
                <p className="text-base text-normal font-bold">Home</p>
              </div>
            </li>
            <li>
              <div className="flex gap-2 items-center">
                <MdMovie className="text-2xl" />
                <p className="text-base text-normal font-bold">Collection</p>
              </div>
            </li>
            <li>
              <div className="flex gap-2 items-center">
                <MdInfo className="text-2xl" />
                <p className="text-base text-normal font-bold">About</p>
              </div>
            </li>
            <li
              onClick={() => {
                setShowSignIn(true);
                setShowNav(false);
              }}
            >
              <div className="flex gap-2 items-center">
                <FaSignInAlt className="text-2xl" />
                <p className="text-base text-normal font-bold">Login</p>
              </div>
            </li>
            <li>
              <div className="flex gap-2 items-center">
                <FaUser className="text-2xl" />
                <p className="text-base text-normal font-bold">Profile</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
