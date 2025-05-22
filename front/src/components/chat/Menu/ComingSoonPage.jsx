import React from 'react';
import styled from 'styled-components';

// Create a styled wrapper component for the coming soon page
const ComingSoonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background-color: #128C7E; /* WhatsApp green color */
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
`;

const ProgressBar = styled.div`
  width: 80%;
  max-width: 400px;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 70%; /* Progress percentage */
    background-color: white;
    border-radius: 4px;
  }
`;

const NotificationForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
`;

const EmailInput = styled.input`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 24px;
  margin-bottom: 10px;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  background-color: #25D366; /* WhatsApp light green */
  color: white;
  border: none;
  border-radius: 24px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #1EA355;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  margin-top: 2rem;
  gap: 20px;
`;

const SocialIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: #128C7E;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
`;

// WhatsApp Clone Coming Soon Page Component
const ComingSoonPage = () => {
  return (
    <ComingSoonWrapper>
      <Logo>WhatsClone</Logo>
      
      <Title>Coming Soon</Title>
      <Subtitle>
        We're working hard to bring you a new messaging experience. 
        Our WhatsApp clone will be ready shortly!
      </Subtitle>
      
      <ProgressBar />
      
      <NotificationForm>
        <EmailInput 
          type="email" 
          placeholder="Enter your email for updates" 
          required 
        />
        <SubmitButton type="submit">Notify Me</SubmitButton>
      </NotificationForm>
      
      <SocialLinks>
        <SocialIcon>f</SocialIcon>
        <SocialIcon>t</SocialIcon>
        <SocialIcon>in</SocialIcon>
      </SocialLinks>
    </ComingSoonWrapper>
  );
};

export default ComingSoonPage;

// If you want to export the wrapper separately
export { ComingSoonWrapper };