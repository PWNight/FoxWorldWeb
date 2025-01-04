import { PropsWithChildren } from "react";

export default function BlogLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col items-start justify-center pt-8 pb-10 mx-auto">
      {children}
    </div>
  );
}
