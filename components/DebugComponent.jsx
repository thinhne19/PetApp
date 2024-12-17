import React, { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";

const DebugComponent = () => {
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded) {
      console.log("Debug Log: User Signed In:", isSignedIn);
    }
  }, [isLoaded, isSignedIn, user]);

  return null; // Chỉ sử dụng để debug
};

export default DebugComponent;
