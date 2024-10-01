import React, { useState, useEffect } from "react";
import axios from "axios";
import all from "../data/all.png";
import done from "../data/done.png";
import expired from "../data/expired.png";
import remaining from "../data/remaining.png";

const Card = ({ count, image }) => {
  return (
    <div
      className="p-4 sm:p-6 text-white rounded-lg shadow-lg flex flex-col items-center"
      style={{ backgroundColor: getColorForImage(image) }}
    >
      <img
        src={image}
        alt="Todo status"
        className="w-20 h-20 sm:w-20 sm:h-20 mb-4"
      />
      <div className="text-xl sm:text-2xl text-black">{count}</div>
    </div>
  );
};

const getColorForImage = (image) => {
  if (image.includes("all.png")) return "bg-blue-500";
  if (image.includes("done.png")) return "bg-green-500";
  if (image.includes("expired.png")) return "bg-red-500";
  if (image.includes("remaining.png")) return "bg-yellow-500";
  return "bg-gray-500";
};

const Dash = ({ todoCounts }) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card count={todoCounts.totalTodos} image={all} />
        <Card count={todoCounts.completedCount} image={done} />
        <Card count={todoCounts.expiredCount} image={expired} />
        <Card count={todoCounts.remainingCount} image={remaining} />
      </div>
    </div>
  );
};

export default Dash;
