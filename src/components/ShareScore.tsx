import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Share2,
  Copy,
  Twitter,
  Facebook,
  MessageSquare,
  Mail,
  Check,
  Camera,
  Download,
  Phone
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface ShareScoreProps {
  playerName: string;
  score: number;
  gameboardRef?: React.RefObject<HTMLDivElement>;
}

const ShareScore: React.FC<ShareScoreProps> = ({ playerName, score, gameboardRef }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // Generate share text
  const shareText = `I scored ${score} points in Snake Game! Can you beat my score?`;
  const shareUrl = window.location.href;

  // Handle copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText} Play at ${shareUrl}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Check if device is mobile
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Handle social media sharing
  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank');
  };

  const shareToWhatsApp = () => {
    // Different URLs for mobile and desktop
    const whatsappUrl = isMobile()
      ? `whatsapp://send?text=${encodeURIComponent(`${shareText} Play at ${shareUrl}`)}`
      : `https://web.whatsapp.com/send?text=${encodeURIComponent(`${shareText} Play at ${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Share via SMS (mobile only)
  const shareBySMS = () => {
    if (isMobile()) {
      const smsUrl = `sms:?body=${encodeURIComponent(`${shareText} Play at ${shareUrl}`)}`;
      window.open(smsUrl, '_blank');
    }
  };

  const shareByEmail = () => {
    const emailUrl = `mailto:?subject=Check out my Snake Game score!&body=${encodeURIComponent(`${shareText} Play at ${shareUrl}`)}`;
    window.open(emailUrl, '_blank');
  };

  // Take screenshot of the game
  const captureScreenshot = async () => {
    if (!gameboardRef?.current) return;

    try {
      setIsCapturing(true);

      // Create a container that includes both the game board and score info
      const container = document.createElement('div');
      container.style.position = 'relative';
      container.style.width = `${gameboardRef.current.offsetWidth}px`;
      container.style.height = `${gameboardRef.current.offsetHeight + 80}px`;
      container.style.backgroundColor = '#f8f9fa';
      container.style.padding = '20px';
      container.style.borderRadius = '12px';
      container.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';

      // Clone the game board
      const gameboardClone = gameboardRef.current.cloneNode(true) as HTMLElement;
      gameboardClone.style.position = 'relative';
      gameboardClone.style.margin = '0 auto';

      // Create score text
      const scoreDiv = document.createElement('div');
      scoreDiv.style.textAlign = 'center';
      scoreDiv.style.marginTop = '20px';
      scoreDiv.style.fontWeight = 'bold';
      scoreDiv.style.fontSize = '24px';
      scoreDiv.style.color = '#6d28d9';
      scoreDiv.textContent = `${playerName}'s Score: ${score}`;

      // Append elements
      container.appendChild(gameboardClone);
      container.appendChild(scoreDiv);

      // Temporarily add to document for html2canvas to work
      document.body.appendChild(container);

      // Capture the container
      const canvas = await html2canvas(container, {
        backgroundColor: null,
        scale: 2, // Higher resolution
        logging: false,
        allowTaint: true,
        useCORS: true
      });

      // Remove temporary container
      document.body.removeChild(container);

      // Convert to image and download
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `snake-game-score-${score}.png`;
      link.click();

      setIsCapturing(false);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      setIsCapturing(false);
      alert('Failed to capture screenshot. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-2 w-full max-w-xs mx-auto">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-1">Share your score!</h3>
        <p className="text-sm text-gray-500">{shareText}</p>
      </div>

      {/* WhatsApp Share Button - Prominent */}
      <Button
        variant="default"
        className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 mb-2"
        onClick={shareToWhatsApp}
      >
        <MessageSquare className="h-5 w-5" />
        Share on WhatsApp
      </Button>

      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-purple-100 hover:bg-purple-200 border-purple-300"
          onClick={copyToClipboard}
          title="Copy to clipboard"
        >
          {isCopied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5 text-purple-700" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-blue-100 hover:bg-blue-200 border-blue-300"
          onClick={shareToTwitter}
          title="Share on Twitter"
        >
          <Twitter className="h-5 w-5 text-blue-500" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-blue-100 hover:bg-blue-200 border-blue-300"
          onClick={shareToFacebook}
          title="Share on Facebook"
        >
          <Facebook className="h-5 w-5 text-blue-700" />
        </Button>

        {isMobile() && (
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-blue-100 hover:bg-blue-200 border-blue-300"
            onClick={shareBySMS}
            title="Share via SMS"
          >
            <Phone className="h-5 w-5 text-blue-600" />
          </Button>
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-red-100 hover:bg-red-200 border-red-300"
          onClick={shareByEmail}
          title="Share by Email"
        >
          <Mail className="h-5 w-5 text-red-600" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-purple-100 hover:bg-purple-200 border-purple-300"
          onClick={captureScreenshot}
          disabled={isCapturing || !gameboardRef}
          title="Take screenshot"
        >
          {isCapturing ?
            <div className="h-5 w-5 border-2 border-purple-700 border-t-transparent rounded-full animate-spin"></div> :
            <Camera className="h-5 w-5 text-purple-700" />
          }
        </Button>
      </div>
    </div>
  );
};

export default ShareScore;
