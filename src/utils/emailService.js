export const sendWelcomeEmail = async (to, competitionName, competitionLink, selectionLink) => {
    // This is a placeholder function for email sending
    console.log('Sending welcome email to:', to);
    console.log('Competition Name:', competitionName);
    console.log('Competition Link:', competitionLink);
    console.log('Selection Link:', selectionLink);
    
    // In a real application, you would integrate with a backend service or email API here
    return Promise.resolve({ message: 'Email sent successfully (simulated)' });
  };