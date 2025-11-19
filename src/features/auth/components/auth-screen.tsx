"use client";

import { useState } from "react";
import { SignInFlow } from "../types";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";
import Image from "next/image";

export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen space-y-6 px-4 bg-[#3C0753]">
      <Image
        src="/Vector.png"
        alt="Top Right"
        className="absolute top-0 right-0 h-screen pointer-events-none"
        style={{
          width: "auto",
          objectFit: "contain",
          objectPosition: "top right",
          zIndex: 0,
        }}
        width={100}
        height={100}
      />
      <div className="bottom-0 left-0 w-1/4 h-1/3  pointer-events-none" style={{ zIndex: 0 }}>
        <img
          src="/BGG.png"
          alt="Bottom Left"
          className="absolute bottom-0 left-0 w-1/4 h-1/2"
          style={{
            objectFit: "cover",
          }}
        />
      </div>

      <div className="md:h-auto md:w-[420px] relative z-10">
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};
