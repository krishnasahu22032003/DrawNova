"use client";

import { useState } from "react";

import DashboardHeader from "../../components/DashboardHeader";
import { ToolBar } from "../../components/ToolBar";
import { Canvas } from "../../components/Canvas";
import { Tool } from "../../types/ToolTypes";

const Page = () => {
  const [
    selectedTool,
    setSelectedTool,
  ] = useState<Tool>(
    "select"
  );

  return (
    <div className="h-screen">
      <DashboardHeader />

      <Canvas
        selectedTool={
          selectedTool
        }
      />

      <ToolBar
        selectedTool={
          selectedTool
        }
        setSelectedTool={
          setSelectedTool
        }
      />
    </div>
  );
};

export default Page;