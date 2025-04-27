
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasscodeProps {
  onSuccess: () => void;
  passcodeLength?: number;
}

const Passcode = ({ onSuccess, passcodeLength = 4 }: PasscodeProps) => {
  const [passcode, setPasscode] = useState<string>("");
  const [savedPasscode, setSavedPasscode] = useState<string | null>(null);
  const [isSettingPasscode, setIsSettingPasscode] = useState<boolean>(false);
  const [confirmPasscode, setConfirmPasscode] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Check if a passcode has been set previously
    const storedPasscode = localStorage.getItem("desyr_passcode");
    if (storedPasscode) {
      setSavedPasscode(storedPasscode);
    } else {
      setIsSettingPasscode(true);
    }
  }, []);

  const handlePasscodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= passcodeLength) {
      setPasscode(value);
      setError("");
    }
  };

  const handleConfirmPasscodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= passcodeLength) {
      setConfirmPasscode(value);
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSettingPasscode) {
      if (passcode.length < passcodeLength) {
        setError(`Passcode must be ${passcodeLength} digits`);
        return;
      }
      
      if (confirmPasscode !== passcode) {
        setError("Passcodes don't match");
        return;
      }
      
      localStorage.setItem("desyr_passcode", passcode);
      setSavedPasscode(passcode);
      setIsSettingPasscode(false);
      onSuccess();
    } else {
      if (passcode === savedPasscode) {
        onSuccess();
      } else {
        setError("Incorrect passcode");
        setPasscode("");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair gold-gradient mb-2">
          {isSettingPasscode ? "Set Your Passcode" : "Enter Passcode"}
        </h1>
        <p className="text-desyr-taupe text-center">
          {isSettingPasscode
            ? "Create a secure passcode to protect your intimate conversations"
            : "Your private space awaits"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <Input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={passcodeLength}
            value={passcode}
            onChange={handlePasscodeChange}
            placeholder={`${passcodeLength}-digit passcode`}
            className="text-center text-xl py-6 border-desyr-soft-gold/30 focus:border-desyr-deep-gold"
            autoComplete="off"
          />
        </div>

        {isSettingPasscode && (
          <div className="mb-4">
            <Input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={passcodeLength}
              value={confirmPasscode}
              onChange={handleConfirmPasscodeChange}
              placeholder="Confirm passcode"
              className="text-center text-xl py-6 border-desyr-soft-gold/30 focus:border-desyr-deep-gold"
              autoComplete="off"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <Button
          type="submit"
          className="w-full gold-button py-6"
          disabled={isSettingPasscode ? passcode.length < passcodeLength || confirmPasscode.length < passcodeLength : passcode.length < passcodeLength}
        >
          {isSettingPasscode ? "Set Passcode" : "Unlock"}
        </Button>
      </form>
    </div>
  );
};

export default Passcode;
