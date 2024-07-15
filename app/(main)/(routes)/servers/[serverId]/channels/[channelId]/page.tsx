interface ChannelIdPageParams {
  params: { channelId: string };
}

const ChannelIdPage = ({ params }: ChannelIdPageParams) => {
  return <div>Channel {params?.channelId} Page is here</div>;
};

export default ChannelIdPage;
