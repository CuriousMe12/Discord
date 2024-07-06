import { currentProfile } from "@/lib/current-profile";

interface ServerSidebarProps {
  serverId: String;
}

const ServerSidebar = ({ serverId }: ServerSidebarProps) => {
  const profile = currentProfile();
  return <div>Channels Here...</div>;
};

export default ServerSidebar;
