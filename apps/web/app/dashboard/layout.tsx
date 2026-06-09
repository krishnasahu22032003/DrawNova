import { WSProvider } from "../../contexts/WSContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <WSProvider>
            {children}
        </WSProvider>
    );
}