import { Leftbar } from "@/components/wiki/leftbar";

export default function WikiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-start gap-14">
      <Leftbar />
      <div className="flex-[4]">{children}</div>{" "}
    </div>
  );
}
