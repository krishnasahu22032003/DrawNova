import { WSProvider } from "../../context/WSContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <WSProvider>
            {children}
        </WSProvider>
    );
}