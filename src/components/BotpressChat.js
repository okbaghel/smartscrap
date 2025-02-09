'use client'; // Ensures client-side rendering

import { useEffect, useState } from 'react';

const BotpressChat = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load the Botpress Inject script
        const script = document.createElement('script');
        script.src = "https://cdn.botpress.cloud/webchat/v2/inject.js";
        script.async = true;
        script.onload = () => {
            window.botpressWebChat.init({
                botId: '9e7ed542-b6db-4047-a380-5629fa8640ca', // Replace with your bot ID
                host: 'https://cdn.botpress.cloud/webchat/v2',
                configUrl: 'https://files.bpcontent.cloud/2025/02/08/07/20250208075106-EUB1SIG2.json',
                showPoweredBy: false, // Removes Botpress branding
                stylesheet: "https://webchat-styling.botpress.app/theme.css"
            });
            setIsLoaded(true);
        };

        document.body.appendChild(script);

        return () => {
            // Cleanup: Remove the script when the component unmounts
            document.body.removeChild(script);
        };
    }, []);

    const toggleChat = () => {
        if (isLoaded && window.botpressWebChat) {
            window.botpressWebChat.toggle();
        } else {
            console.warn("Botpress chat is not loaded yet.");
        }
    };

    return (
        <button
            className="chat-button"
            onClick={toggleChat}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
            }}
        >
            💬
        </button>
    );
};

export default BotpressChat;
