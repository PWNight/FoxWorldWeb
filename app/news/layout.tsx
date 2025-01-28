import { PropsWithChildren } from "react";

export default function BlogLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col items-start justify-center pt-8 pb-10 lg:w-[95%] sm:[95%] md:[75%] mx-auto px-4">
      {children}
    </div>
  );
}
