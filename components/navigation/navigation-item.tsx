"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "../action-tooltip";
import AvatarIcon from "@/assets/AvatarIcon.jpg";

interface NavigationItemProps {
  id: string;
  name: string;
}

export const NavigationItem = ({ id, name }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        onClick={handleClick}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover-h[20px]",
            params?.serverId === id ? "h-[36px]" : "h-8px"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image
            alt={name}
            fill
            src="https://image.spreadshirtmedia.com/image-server/v1/compositions/T347A1PA4306PT17X38Y31D1041847581W17598H17598/views/1,width=550,height=550,appearanceId=1,backgroundColor=FFFFFF,noPt=true/cartoon-characters-womens-t-shirt.jpg"
          />
        </div>
      </button>
    </ActionTooltip>
  );
};
