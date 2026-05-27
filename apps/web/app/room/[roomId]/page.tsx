interface RoomPageProps {
  params: {
    roomId: string;
  };
}

export default function RoomPage({
  params,
}: RoomPageProps) {
  return (
    <div>
      Room ID:
      {params.roomId}
    </div>
  );
}