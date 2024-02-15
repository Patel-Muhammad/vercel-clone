import React, { useState } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { MdOutlineContentCopy } from "react-icons/md";
import Confetti from "react-confetti";
import { RotatingLines } from "react-loader-spinner";


function App() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [domain, setDomain] = useState("");
  const [deployedUrl, setDeployedUrl] = useState("");
  const [confetti, setConfetti] = useState(false);

  const onChangeAnything = (e, setTheChangeValue) => {
    setDeployedUrl("");
    setTheChangeValue(e.target.value);
  };

  const validate = (url, domain) => {
    if (!url || !domain) {
      toast.error("Please fill in the fields");
      return false;
    }
    if (domain.includes(" ") || url.includes(" ") || url.includes(".")) {
      toast.error("Domain cannot contain spaces or dot");
      return false;
    }
    if (!url.startsWith("https://github.com")) {
      toast.error("URL must start with https://github.com");
      return false;
    }
    return true;
  };

  const copyUrlLink = () => {
    navigator.clipboard.writeText(deployedUrl);
    toast.success("Link copied to clipboard");
    setTimeout(() => {
      toast.info("It may take a few minutes for the link to work");
    }, 2000);
  };

  const callConfetti = () => {
    setTimeout(() => {
      setConfetti(false);
    }, 5000);
  };

  const onclick = () => {
    setDeployedUrl("");
    setUrl(url.trim().toLowerCase());
    setDomain(domain.trim().toLowerCase());

    if (validate(url, domain)) {
      setLoading(true);
      axios
        .post(`${process.env.BACKEND_URL}/api/project`, {
          gitURL: url,
          slug: domain,
        })
        .then((res) => {
          toast.info("Validation passed, deploying...");
          setTimeout(() => {
            setDeployedUrl(`${domain}.deployfor.me`);
            setLoading(false);
            setConfetti(true);
            callConfetti();
            toast.success("Your project is live!");
          }, 10000);
        })
        .catch((err) => {
          toast.error("An error occurred. Please try again later");
          setLoading(false);
        });
    }
  };

  return (
    <div className="bg-image">
      <div className="heading text-nowrap font-black text-4xl absolute left-1/2 top-56 md:top-40 md:text-6xl">
        deployfor.me 🚀
      </div>
      <div className="input-container w-[85vw] h-[40vh] md:h-[45vh] md:w-[50vw] card glow">
        <label className="md:text-3xl text-xl font-bold">Host your React.JS project</label>
        <div className="flex flex-col justify-between items-center w-4/5">
          <div className="w-full md:flex-row flex-col flex items-start md:items-center justify-between mb-6">
            <div className="md:text-xl mr-3">Project URL: </div>
            <input
              onChange={(e) => onChangeAnything(e, setUrl)}
              type="url"
              placeholder="https://github.com/profile/react-project"
              className="h-1 md:w-3/4 mt-1 md:mt-0  md:h-10 w-100 md:p-5 p-2 border rounded flex-1"
            />
          </div>
          <div className="w-full md:flex-row flex-col flex items-start md:items-center justify-between mb-6 relative">
            <div className="md:text-xl mr-3">Custom domain: </div>
            <input
              onChange={(e) => onChangeAnything(e, setDomain)}
              type="text"
              placeholder="mycoolproject"
              className="h-1 md:w-3/4 mt-1 md:mt-0   md:h-10 w-100 md:p-5 p-2 border rounded flex-1"
            />
            <div className=" absolute -bottom-6 right-0">.deployfor.me</div>
          </div>
        </div>
        <button
          onClick={onclick}
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-gray-100"
          } text-black w-full flex items-center justify-center text-xl font-bold`}
        >
          {loading ? (
            <RotatingLines
              visible={true}
              height="20"
              strokeColor="black"
              width="20"
              color="black"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{color:"black"}}
              wrapperClass="text-black"
            />
          ) : (
            <span className="flex items-center justify-center">
              <span className="mr-1">Deploy</span>
            </span>
          )}
        </button>
      </div>
      {deployedUrl && (
        <div className="p-5  md:w-[50vw] w-[85vw] md:h-14 absolute left-1/2 bottom-32 dep-cls flex items-center justify-between card">
          <code>https://{domain}.deployfor.me</code> 
          <div className="cursor-pointer" onClick={copyUrlLink}>
            <MdOutlineContentCopy />
          </div>
        </div>
      )}
      <div>
        {" "}
        <ToastContainer theme="dark" position="top-center" />
      </div>
      {/* confetti with full screen with and height */}
      {confetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          gravity={0.4}
          recycle={false}
        />
      )}
    </div>
  );
}

export default App;
