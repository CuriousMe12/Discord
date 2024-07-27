import { useEffect, useState } from "react";

interface ChatScrollProps {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
}

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps): [boolean, number] => {
  const [initialised, setInitialised] = useState<boolean>(false);
  const [atBottom, setAtBottom] = useState<boolean>(true);
  const [currentHeight, setCurrentHeight] = useState<number>(0);

  // for fetching new data on scroll top
  useEffect(() => {
    const topDiv = chatRef?.current;

    const handleBottom = () => {
      if (!topDiv) {
        setAtBottom(true);
        return;
      }
      const scrollTop = topDiv?.scrollTop;
      const clientHeight = topDiv?.clientHeight;
      const scrollHeight = topDiv?.scrollHeight;
      const scrollBottom = scrollHeight - scrollTop - clientHeight;
      setAtBottom(scrollBottom < 100 ? true : false);
    };

    const handleScroll = () => {
      if (!topDiv) return;
      const scrollTop = topDiv?.scrollTop;
      const scrollHeight = topDiv?.scrollHeight;
      if (topDiv && scrollTop === 0 && shouldLoadMore) {
        setCurrentHeight(scrollHeight);
        loadMore();
      }
      handleBottom();
    };

    topDiv?.addEventListener("scroll", handleScroll);

    return () => topDiv?.removeEventListener("scroll", handleScroll);
  }, [chatRef, loadMore, shouldLoadMore]);

  // for moving at last after getting new message
  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef?.current;

    const shouldAutoScroll = () => {
      // chat just started
      if (!initialised && bottomDiv) {
        setInitialised(true);
        return true;
      }

      if (!topDiv) return false;

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      return distanceFromBottom <= 100;
    };

    if (shouldAutoScroll())
      setTimeout(() => {
        bottomRef?.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
  }, [bottomRef, chatRef, count, initialised]);

  return [atBottom, currentHeight];
};
