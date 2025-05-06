import type { TimeRangeButtonProps } from "../types/cryptoTypes";

const TimeRangeButton = ({
  range,
  label,
  currentRange,
  onClick,
}: TimeRangeButtonProps) => {
  return (
    <button
      onClick={() => onClick(range)}
      className={`px-4 py-2 rounded-md cursor-pointer ${
        currentRange === range ? "bg-blue-500 text-white" : "bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
};

export default TimeRangeButton;
