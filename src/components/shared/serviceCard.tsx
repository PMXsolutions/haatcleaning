import { GiFoundryBucket, GiBroom, GiWindow, GiVacuumCleaner, GiMirrorMirror, GiFireplace, GiHomeGarage, GiBunkBeds, GiCobweb } from "react-icons/gi";
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import { MdOutlineLocalLaundryService, MdOutlineChair, MdOutlineRoofing } from "react-icons/md";
import { FaKitchenSet , FaRug} from "react-icons/fa6";
import { BiCloset,  } from "react-icons/bi";
import { LuToilet, LuTrees } from "react-icons/lu";

interface ServiceCardProps {
  icon: 'floor' | 'dusting' | 'appliance'
  | 'window' 
  | 'vacuum' 
  | 'laundry' 
  | 'mirror' 
  | 'kitchen' 
  | 'fireplace' 
  | 'closet' 
  | 'bathroom' 
  | 'garage' 
  | 'exterior' 
  | 'bed' 
  | 'furniture' 
  | 'carpet' 
  | 'ceiling' 
  | 'cobweb' 
  | 'floor' 
  | 'dusting' 
  | 'appliance';   
  title: string;
  description: string;
}

const iconMap = {
  floor: GiFoundryBucket,
  dusting: GiBroom,
  appliance: HiClipboardDocumentCheck,
  window: GiWindow,
  vacuum: GiVacuumCleaner,
  laundry: MdOutlineLocalLaundryService,
  mirror: GiMirrorMirror,
  kitchen: FaKitchenSet,
  fireplace: GiFireplace,
  closet: BiCloset,
  bathroom: LuToilet,
  garage: GiHomeGarage,
  exterior: LuTrees,
  bed: GiBunkBeds,
  furniture: MdOutlineChair,
  carpet: FaRug,
  ceiling: MdOutlineRoofing,
  cobweb: GiCobweb,
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => {
  const IconComponent = iconMap[icon];
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-4">
        <IconComponent className="w-16 h-16 text-gold" />
      </div>
      <h3 className="text-xl font-bold text-primary font-text mb-2">{title}</h3>
      <p className="text-primary font-text">{description}</p>
    </div>
  );
};

