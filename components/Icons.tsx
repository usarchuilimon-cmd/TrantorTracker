import React from 'react';
import { 
  Briefcase, 
  Package, 
  Factory, 
  CheckCircle, 
  FileText, 
  Landmark, 
  Users, 
  LayoutDashboard, 
  Settings,
  Activity,
  AlertTriangle,
  Clock,
  Check
} from 'lucide-react';

export const IconByName = ({ name, className }: { name: string; className?: string }) => {
  const iconProps = { className };
  
  switch (name) {
    case 'Briefcase': return <Briefcase {...iconProps} />;
    case 'Package': return <Package {...iconProps} />;
    case 'Factory': return <Factory {...iconProps} />;
    case 'CheckCircle': return <CheckCircle {...iconProps} />;
    case 'FileText': return <FileText {...iconProps} />;
    case 'Landmark': return <Landmark {...iconProps} />;
    case 'Users': return <Users {...iconProps} />;
    case 'LayoutDashboard': return <LayoutDashboard {...iconProps} />;
    case 'Settings': return <Settings {...iconProps} />;
    case 'Activity': return <Activity {...iconProps} />;
    case 'AlertTriangle': return <AlertTriangle {...iconProps} />;
    case 'Clock': return <Clock {...iconProps} />;
    case 'Check': return <Check {...iconProps} />;
    default: return <Briefcase {...iconProps} />;
  }
};