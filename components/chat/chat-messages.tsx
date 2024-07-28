"use client";

import { useChatQuery } from "@/hooks/use-chat-hook";
import ChatWelcome from "./chat-welcome";
import { CircleChevronDown, Loader2, ServerCrash } from "lucide-react";
import { ElementRef, Fragment, useEffect, useRef } from "react";
import { Member, Message, Profile } from "@prisma/client";
import ChatItem from "./chat-item";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket-hook";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { ActionTooltip } from "../action-tooltip";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

type MessageWithMemberWithProfile = Message & {
  member: Member & { profile: Profile };
};

const DATE_FORMAT = "d MMM yyyy, HH:mm";

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  useChatSocket({
    queryKey,
    addKey,
    updateKey,
  });

  const [atBottom, oldHeight] = useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !!hasNextPage,
    count: data?.pages?.[0]?.items?.length,
  });

  const handleScrollBottom = () => {
    bottomRef?.current?.scrollIntoView();
  };

  useEffect(() => {
    handleScrollBottom();
  }, [bottomRef, chatId]);

  useEffect(() => {
    if (!chatRef.current) return;
    const newHeight = chatRef.current.scrollHeight;
    const newTop = newHeight - oldHeight;
    if (hasNextPage) chatRef.current.scrollTop = newTop;
  }, [oldHeight, data]);

  if (status !== "error" && status !== "success") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome name={name} type={type} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-10 w-10 text-zinc-500 animate-spin my-4" />
          ) : (
            ""
          )}
        </div>
      )}
      {!atBottom && (
        <ActionTooltip label="Go to bottom">
          <CircleChevronDown
            onClick={handleScrollBottom}
            className="w-7 h-7 absolute bottom-20 right-8 z-50 cursor-pointer text-zinc-500 hover:text-zinc-800
        dark:hover:text-zinc-100 transition
       dark:text-zinc-400  rounded-full"
          />
        </ActionTooltip>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
