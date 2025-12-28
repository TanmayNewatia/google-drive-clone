import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export const HeaderIconButton = ({
  item,
}: {
  item: {
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    size: number;
  };
}) => {
  return (
    <button className="p-2 hover:bg-[#303134] rounded-full transition-colors">
      <item.icon size={item.size} />
    </button>
  );
};
