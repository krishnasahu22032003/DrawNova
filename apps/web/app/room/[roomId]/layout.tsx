import RoomProviders from "../../../providers/WsProvider";

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoomProviders>
      {children}
    </RoomProviders>
  );
}