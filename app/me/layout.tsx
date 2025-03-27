import { PropsWithChildren } from "react";
import {NavMe} from "@/components/navbar";

export default function MeLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid sm:grid-cols-[300px_1fr] gap-6 mt-4 mb-4 sm:px-4 lg:w-[95%] w-full mx-auto">
        <div className='h-fit'>
            <NavMe/>
        </div>
        {children}
    </div>
  );
}
