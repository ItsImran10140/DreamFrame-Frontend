/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import StarBorder from "../UI/border";
import SpotlightCard from "../UI/Card";
import { useState, useEffect } from "react";
import { UserAuth } from "./AuthContext";
import { supabase } from "./superbaseClient";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { session, signInUser }: any = UserAuth();
  console.log(session);
  const navigate = useNavigate();

  // Navigate to /hero if user is already authenticated
  useEffect(() => {
    if (session) {
      navigate("/hero");
    }
  }, [session, navigate]);

  // Listen for auth state changes (for OAuth callbacks)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/hero");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  console.log(email, password);

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInUser(email, password);
      if (result.success) {
        navigate("/hero");
      }
    } catch (err) {
      console.error("Error signing in: ", err);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        console.error("Error signing in with Google:", error);
      }
    } catch (err) {
      console.error("Error with Google signin:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/hv.mp4" type="video/mp4" />
        {/* Fallback message instead of broken image */}
        Your browser does not support the video tag.
      </video>
      <div className="relative z-20 flex bg-[#0C0C0C]/95 items-center justify-center min-h-screen text-white">
        <form onSubmit={handleSignIn}>
          <SpotlightCard
            className="custom-spotlight-card w-[500px] h-full"
            spotlightColor="rgba(255, 255, 255, 0.25)"
          >
            <div className="">
              <div className=" flex justify-center mb-10 ">
                <h1 className="text-3xl">LogIn</h1>
              </div>
              <div>
                <StarBorder
                  as="button"
                  className=" w-full mb-2"
                  color="white"
                  speed="5s"
                >
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="text"
                    placeholder="Email"
                    className="w-full h-10 rounded-xl bg-transparent px-3 outline-none"
                  />
                </StarBorder>

                <StarBorder
                  as="button"
                  className=" w-full mb-2"
                  color="white"
                  speed="5s"
                >
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="Password"
                    className="w-full h-10  rounded-xl bg-transparent  px-3 outline-none"
                  />
                </StarBorder>

                <div className="h-[0.75px] my-3 bg-zinc-400/10"></div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="border-[0.75px] border-neutral-700 w-full h-10 rounded-xl mt-2 text-neutral-300 hover:text-neutral-400 hover:bg-neutral-300/20 disabled:opacity-50"
                  >
                    {loading ? "Logging in..." : "LogIn"}
                  </button>
                </div>
                <div className="flex w-full justify-center items-center my-2">
                  <div className="h-[0.75px] bg-zinc-400/10 w-[95%]"></div>
                  <p className="mx-6 text-zinc-400/10">Or</p>
                  <div className="h-[0.75px] bg-zinc-400/10 w-[95%]"></div>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={signInWithGoogle}
                    disabled={loading}
                    className="border w-full h-10 rounded-xl mt-8 flex justify-center items-center bg-neutral-100 disabled:opacity-50"
                  >
                    <div className="flex">
                      <div className="w-5 mr-3">
                        <img
                          src="/google-icon.svg"
                          alt="Google Icons"
                          className="h-full w-full"
                        />
                      </div>
                      <div className="text-zinc-800 font-semibold">
                        {loading ? "Logging in..." : "LogIn with Google"}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              <div className="w-full flex justify-center items-center my-4">
                <div className="flex">
                  <p className="text-neutral-500 mr-2">
                    Don't have a Account ? :{" "}
                  </p>
                  <Link to="/signup">
                    <button className="text-neutral-300">Sign Up</button>
                  </Link>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
