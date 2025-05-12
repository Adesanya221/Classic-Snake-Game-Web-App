import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { User, Calendar, Trophy, ArrowRight, Upload, Camera, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface WelcomeScreenProps {
  onStart: (playerName: string, playerAge: number, playerImage?: string) => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const [playerName, setPlayerName] = useState('');
  const [playerAge, setPlayerAge] = useState(10);
  const [playerImage, setPlayerImage] = useState<string | null>(null);
  const [isNameValid, setIsNameValid] = useState(false);
  const [sliderProgress, setSliderProgress] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animation states
  const [showWelcome, setShowWelcome] = useState(false);
  const [showImageField, setShowImageField] = useState(false);
  const [showNameField, setShowNameField] = useState(false);
  const [showAgeField, setShowAgeField] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Staggered animations when component mounts
  useEffect(() => {
    // Staggered animations
    setTimeout(() => setShowWelcome(true), 300);
    setTimeout(() => setShowImageField(true), 600);
    setTimeout(() => setShowNameField(true), 900);
    setTimeout(() => setShowAgeField(true), 1200);
    setTimeout(() => setShowButton(true), 1500);

    // Focus the name input after animation
    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 1000);

    // Animate the slider
    const timer = setInterval(() => {
      setSliderProgress(prev => {
        if (prev < 100) return prev + 1;
        clearInterval(timer);
        return 100;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  // Validate player name
  useEffect(() => {
    setIsNameValid(playerName.trim().length > 0);
  }, [playerName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNameValid) {
      onStart(playerName, playerAge, playerImage || undefined);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPlayerImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = () => {
    setPlayerImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Generation range helper functions
  const getGenerationLabel = (age: number): string => {
    const birthYear = new Date().getFullYear() - age;
    if (birthYear >= 2013) return 'Gen Alpha';
    if (birthYear >= 1997) return 'Gen Z';
    if (birthYear >= 1981) return 'Millennial';
    if (birthYear >= 1965) return 'Gen X';
    if (birthYear >= 1946) return 'Baby Boomer';
    return 'Silent Generation';
  };

  const getGenerationColor = (age: number): string => {
    const birthYear = new Date().getFullYear() - age;
    if (birthYear >= 2013) return '#F43F5E'; // Bright Rose
    if (birthYear >= 1997) return '#8B5CF6'; // Purple
    if (birthYear >= 1981) return '#3B82F6'; // Blue
    if (birthYear >= 1965) return '#10B981'; // Green
    if (birthYear >= 1946) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  const getGenerationGradient = (age: number): string => {
    const birthYear = new Date().getFullYear() - age;
    if (birthYear >= 2013) return '#F43F5E, #FB7185';
    if (birthYear >= 1997) return '#8B5CF6, #C084FC';
    if (birthYear >= 1981) return '#3B82F6, #60A5FA';
    if (birthYear >= 1965) return '#10B981, #34D399';
    if (birthYear >= 1946) return '#F59E0B, #FBBF24';
    return '#EF4444, #F87171';
  };

  const getGenerationDescription = (age: number): string => {
    const birthYear = new Date().getFullYear() - age;
    if (birthYear >= 2013) return 'Gen Alpha (born 2013-present): The first generation born entirely in the 21st century. These digital natives are growing up with AI, touchscreens, and voice assistants as part of their everyday life.';
    if (birthYear >= 1997) return 'Gen Z (born 1997-2012): Digital natives who value authenticity, social justice, and have never known a world without the internet.';
    if (birthYear >= 1981) return 'Millennials (born 1981-1996): The first generation to come of age in the new millennium, known for embracing technology and valuing experiences.';
    if (birthYear >= 1965) return 'Gen X (born 1965-1980): The "latchkey generation" known for independence, adaptability, and bridging analog and digital worlds.';
    if (birthYear >= 1946) return 'Baby Boomers (born 1946-1964): Post-WWII generation known for economic prosperity, social change, and competitive spirit.';
    return 'Silent Generation (born 1928-1945): Known for their resilience, work ethic, and traditional values after growing up during the Great Depression and WWII.';
  };

  return (
    <div
      className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_60px_rgba(128,90,213,0.6)] p-10 flex flex-col items-center gap-8 border border-white/20 transition-all duration-700 w-[min(90vw,550px)]"
      style={{
        transform: `scale(${isHovered ? 1.02 : 1})`,
        boxShadow: isHovered ? '0 30px 80px rgba(168,85,247,0.7)' : '0 20px 60px rgba(128,90,213,0.6)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating orbs */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-20 blur-xl animate-pulse"
        style={{ animationDuration: '7s' }}></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl animate-pulse"
        style={{ animationDuration: '10s' }}></div>
      <div className="absolute top-1/3 -left-16 w-24 h-24 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-full opacity-10 blur-xl animate-pulse"
        style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-1/4 -right-12 w-20 h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-10 blur-xl animate-pulse"
        style={{ animationDuration: '12s' }}></div>

      {/* Title with animation */}
      <div
        className={`relative w-full transform transition-all duration-1000 ${showWelcome ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center relative z-10">
          Welcome to Snake Game!
        </h1>
      </div>

      <div className="w-full space-y-10 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Profile Image Upload with Animation */}
          <div
            className={`flex flex-col items-center transform transition-all duration-700 ${showImageField ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <div className="mb-4 text-center">
              <h2 className="text-xl font-medium text-purple-700 mb-2 flex items-center justify-center gap-2">
                <Camera className="w-5 h-5 text-purple-500" />
                Your Profile Picture
              </h2>
              <p className="text-sm text-gray-500">Add a profile picture or use our placeholder</p>
            </div>

            <div
              className="relative group"
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              <div
                className={`relative w-32 h-32 rounded-full overflow-hidden transition-all duration-300 ${isImageHovered ? 'shadow-[0_0_25px_rgba(168,85,247,0.6)]' : 'shadow-lg'}`}
                style={{ transform: isImageHovered ? 'scale(1.05)' : 'scale(1)' }}
              >
                <Avatar className="w-full h-full">
                  <AvatarImage src={playerImage || undefined} alt="Profile" className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-4xl flex items-center justify-center">
                    {playerName ? playerName.charAt(0).toUpperCase() : '👤'}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-opacity duration-300 ${isImageHovered ? 'opacity-100' : 'opacity-0'}`}
                  onClick={triggerFileInput}
                >
                  {playerImage ? (
                    <div className="flex flex-col items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20 p-1 absolute top-1 right-1 h-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Upload className="w-6 h-6 text-white mb-1" />
                      <span className="text-white text-xs">Change</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-6 h-6 text-white mb-1" />
                      <span className="text-white text-xs">Upload</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Name Field with Animation */}
          <div
            className={`space-y-4 transform transition-all duration-700 ${showNameField ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}
          >
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-purple-500" />
              <Label htmlFor="playerName" className="text-xl font-medium text-purple-700">
                Your Name
              </Label>
            </div>

            <div
              className={`relative rounded-xl overflow-hidden transition-all duration-500 ${isInputFocused ? 'shadow-[0_0_25px_rgba(168,85,247,0.5)]' : 'shadow-md'}`}
              style={{
                transform: isInputFocused ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <Input
                ref={nameInputRef}
                id="playerName"
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                className="w-full pl-5 pr-12 py-4 text-lg border-2 border-purple-200 focus:border-purple-500 rounded-xl transition-all duration-500"
              />

              <div
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-500 ${isNameValid ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-90'}`}
              >
                <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 pl-2 transition-all duration-300">
              This will be displayed on the scoreboard
            </p>
          </div>

          {/* Age Field with Generation Dropdown */}
          <div
            className={`space-y-4 transform transition-all duration-700 ${showAgeField ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <Label htmlFor="playerAge" className="text-xl font-medium text-purple-700">
                Your Age & Generation
              </Label>
            </div>

            <div className="relative">
              <select
                id="playerAge"
                value={playerAge}
                onChange={(e) => setPlayerAge(parseInt(e.target.value))}
                className="w-full pl-5 pr-12 py-4 text-lg border-2 border-purple-200 focus:border-purple-500 rounded-xl transition-all duration-300 bg-white appearance-none cursor-pointer shadow-md hover:shadow-lg focus:shadow-lg"
                style={{
                  borderColor: `${getGenerationColor(playerAge)}50`,
                  boxShadow: `0 4px 6px ${getGenerationColor(playerAge)}20`
                }}
              >
                {Array.from({ length: 100 }, (_, i) => i + 5).map((age) => {
                  const birthYear = new Date().getFullYear() - age;
                  const generation = getGenerationLabel(age);
                  const isGenAlpha = birthYear >= 2013;
                  return (
                    <option
                      key={age}
                      value={age}
                      style={{
                        fontWeight: isGenAlpha ? 'bold' : 'normal',
                      }}
                    >
                      {age} years old ({generation}){isGenAlpha ? ' ✨' : ''}
                    </option>
                  );
                })}
              </select>

              {/* Custom dropdown arrow */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transition-colors duration-300"
                  viewBox="0 0 20 20"
                  fill={getGenerationColor(playerAge)}
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Generation indicator */}
            <div
              className="flex items-center justify-between p-3 rounded-lg shadow-sm transition-colors duration-300"
              style={{
                backgroundColor: `${getGenerationColor(playerAge)}10`,
                borderLeft: `3px solid ${getGenerationColor(playerAge)}`
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getGenerationColor(playerAge) }}
                ></div>
                <span
                  className="font-medium"
                  style={{ color: getGenerationColor(playerAge) }}
                >
                  {getGenerationLabel(playerAge)}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                Born {new Date().getFullYear() - playerAge}
              </span>
            </div>

            {/* Generation description */}
            <div
              className="text-sm text-gray-600 p-3 rounded-lg bg-white/50 border border-gray-100 shadow-sm"
            >
              {getGenerationDescription(playerAge)}
            </div>
          </div>

          {/* Button with Animation */}
          <div
            className={`pt-4 relative transform transition-all duration-700 ${showButton ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-md transition-all duration-500"
              style={{
                opacity: isButtonHovered ? 0.9 : 0.7,
                transform: isButtonHovered ? 'scale(1.05)' : 'scale(1)'
              }}
            ></div>

            <Button
              type="submit"
              disabled={!isNameValid}
              className="relative w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 rounded-xl text-xl font-medium shadow-lg transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              style={{
                transform: isButtonHovered && isNameValid ? 'scale(1.03)' : 'scale(1)',
                boxShadow: isButtonHovered && isNameValid ? '0 10px 25px rgba(168,85,247,0.5)' : '0 4px 6px rgba(168,85,247,0.25)'
              }}
            >
              <span>Start Game</span>
              <ArrowRight className={`w-5 h-5 transition-all duration-500 ${isButtonHovered && isNameValid ? 'translate-x-1' : 'translate-x-0'}`} />
            </Button>
          </div>
        </form>
      </div>

      <div
        className={`text-center text-sm text-gray-500 mt-4 transform transition-all duration-1000 ${showButton ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <div className="flex items-center justify-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <p>High scores are saved locally</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
