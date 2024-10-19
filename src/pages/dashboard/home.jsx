import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

export function Home() {
  return (
    <div className="mt-12 flex flex-col items-center">
      <Typography variant="h4" className="mb-6">
        ¡Bienvenido a WISE STOCK!
      </Typography>
      <div className="w-full max-w-md">
      <img
            src="/img/wise/wise-stock.jpg"
            alt="Welcome Image"
            className="object-cover w-full h-full"
          />
      </div>
    </div>
  );
}

export default Home;
