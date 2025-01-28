import { PropsWithChildren } from "react";
import {NavMe} from "@/components/navbar_me";

export default function MeLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid sm:grid-cols-[300px,1fr] gap-6 mt-4 mb-4 sm:px-4 sm:w-[90%] w-full mx-auto">
        <NavMe/>
        <div>
          {children}
        </div>
    </div>
  );
}
