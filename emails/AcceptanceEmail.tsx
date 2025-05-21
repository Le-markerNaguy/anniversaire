import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import { Body } from '@react-email/body';
import { Container } from '@react-email/container';
import { Text } from '@react-email/text';
import { Heading } from '@react-email/heading';
import { Hr } from '@react-email/hr';
interface AcceptanceEmailProps {
  name: string;
}

export const AcceptanceEmail = ({ name }: AcceptanceEmailProps) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: 'Arial, sans-serif' }}>
      <Container style={{ padding: '20px', border: '1px solid #ddd' }}>
        <Heading style={{ color: '#333' }}>Votre demande de participation acceptée !</Heading>
        <Text>Bonjour {name},</Text>
        <Text>
          Nous avons le plaisir de vous informer que votre demande de participation à l'anniversaire a été acceptée.
        </Text>
        <Text>
          Nous sommes ravis de vous compter parmi nous pour célébrer cet événement spécial.
        </Text>
        <Text>À très bientôt !</Text>
        <Hr style={{ margin: '20px 0' }} />
        <Text style={{ fontSize: '12px', color: '#888' }}>Ceci est un email automatique, merci de ne pas y répondre.</Text>
      </Container>
    </Body>
  </Html>
); 