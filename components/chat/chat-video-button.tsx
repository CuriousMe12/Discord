"use client";

import { Video, VideoOff } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import qs from "query-string";

export const ChatVideoButton = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isVideo = searchParams?.get("video");

  const handleClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );
    router.push(url);
  };

  const Icon = isVideo ? VideoOff : Video;
  const toolTipLabel = isVideo ? "End video call" : "Start video call";
  return (
    <ActionTooltip side="bottom" label={toolTipLabel}>
      <button
        onClick={handleClick}
        className="hover:opacity-75 transition mr-4"
      >
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};
