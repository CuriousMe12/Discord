interface MemberIdPageParams {
  params: { memberId: string };
}

const MemberIdPage = ({ params }: MemberIdPageParams) => {
  return <div>Member {params.memberId} Id Page</div>;
};

export default MemberIdPage;
