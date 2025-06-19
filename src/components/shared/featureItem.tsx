import { ImCheckboxChecked } from "react-icons/im";

interface FeatureItemProps {
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ text })  => {
  return (
    <div className="flex items-center gap-2 text-gold font-medium font-text text-primary">
      <ImCheckboxChecked className="text-gold text-xl" />
      <span className="">{text}</span>
    </div>
  );
};

export default FeatureItem;
