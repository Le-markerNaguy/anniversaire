import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import { Body } from '@react-email/body';
import { Container } from '@react-email/container';
import { Text } from '@react-email/text';
import { Heading } from '@react-email/heading';
import { Hr } from '@react-email/hr';
import { Section } from '@react-email/section';
import { Img } from '@react-email/img';

interface AcceptanceEmailProps {
  name: string;
  accessCode: string; // Nouvelle prop pour le code d'accès
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  maxWidth: '600px',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#4CAF50',
  textAlign: 'center' as const,
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#333333',
};

const codeStyle = {
  display: 'inline-block',
  padding: '10px 20px',
  backgroundColor: '#f0f0f0',
  borderRadius: '5px',
  fontFamily: 'monospace',
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#4CAF50',
  margin: '15px 0',
};

const hr = {
  borderColor: '#e0e0e0',
  margin: '20px 0',
};

const footer = {
  fontSize: '12px',
  color: '#888888',
  textAlign: 'center' as const,
};

export const AcceptanceEmail = ({ name, accessCode }: AcceptanceEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={{ textAlign: 'center', marginBottom: '20px' }}>
          {/* Vous pouvez ajouter un logo ici si vous en avez un */}
          {/* <Img src="{your_logo_url}" width="100" height="100" alt="Logo" /> */}
        </Section>
        <Heading style={heading}>Votre demande de participation acceptée !</Heading>
        <Text style={paragraph}>Bonjour {name},</Text>
        <Text style={paragraph}>
          Nous avons le plaisir de vous informer que votre demande de participation à l'anniversaire a été acceptée.
        </Text>
        
        <Text style={paragraph}>Voici votre code d'accès unique :</Text>
        <Text style={codeStyle}>{accessCode}</Text>
        
        <Text style={paragraph}>
          Conservez précieusement ce code, il vous sera demandé à votre arrivée.
        </Text>
        
        <Text style={paragraph}>
          Nous sommes ravis de vous compter parmi nous pour célébrer cet événement spécial.
        </Text>
        
        <Text style={paragraph}>À très bientôt !</Text>
        
        <Hr style={hr} />
        <Text style={footer}>Ceci est un email automatique, merci de ne pas y répondre.</Text>
      </Container>
    </Body>
  </Html>
);