import * as React from 'react';
import { Html, Head, Body, Container, Text, Heading, Hr } from '@react-email/components';
interface RejectionEmailProps {
  name: string;
}

export const RejectionEmail = ({ name }: RejectionEmailProps) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: 'Arial, sans-serif' }}>
      <Container style={{ padding: '20px', border: '1px solid #ddd' }}>
        <Heading style={{ color: '#E53E3E' }}>Mise à jour concernant votre demande de participation</Heading>
        <Text>Bonjour {name},</Text>
        <Text>
          Nous vous remercions pour votre intérêt à participer à l'anniversaire.
        </Text>
        <Text>
          Après examen de votre demande, nous sommes au regret de ne pas pouvoir y donner suite pour le moment.
        </Text>
        <Text>
          Nous vous remercions de votre compréhension.
        </Text>
        <Text>Cordialement,</Text>
        <Hr style={{ margin: '20px 0' }} />
        <Text style={{ fontSize: '12px', color: '#888' }}>Ceci est un email automatique, merci de ne pas y répondre.</Text>
      </Container>
    </Body>
  </Html>
); 