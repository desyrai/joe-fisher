
import { UserInfo } from '../types';
import { PersonaSetupModal } from './PersonaSetupModal';

interface PersonaSetupProps {
  userInfo: UserInfo;
  onSave: (userInfo: UserInfo) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const PersonaSetup = (props: PersonaSetupProps) => {
  return <PersonaSetupModal {...props} />;
};

export default PersonaSetup;
