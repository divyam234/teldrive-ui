import { memo } from "react";
import { getRouteApi } from "@tanstack/react-router";


import { ApperanceTab } from "./ApperanceTab";
import { GeneralTab } from "./GeneralTab";

const fileRoute = getRouteApi("/_authenticated/settings/$tabId");

export const SettingsTabView = memo(() => {
  const params = fileRoute.useParams();

  switch (params.tabId) {
    case "appearance":
      return <ApperanceTab />;
    case "general":
      return <GeneralTab />;
    default:
      return null;
  }
});
