"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

const DoubleClickLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const handleDoubleClick = useCallback(() => {
    router.push(href);
  }, [href, router]);

  console.log("Double Click Link:", href);

  return (
    <span onDoubleClick={handleDoubleClick} style={{ cursor: "pointer" }}>
      {children}
    </span>
  );
};

export default DoubleClickLink;
