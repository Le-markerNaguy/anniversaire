import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
  } from '@react-email/components';
  
  interface SlackConfirmEmailProps {
    validationCode?: string;
  }
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';
  
  export const SlackConfirmEmail = ({
    validationCode,
  }: SlackConfirmEmailProps) => (
    <Html>
      <Head />
      <Body className="bg-white my-0 mx-auto font-['-apple-system','BlinkMacSystemFont','Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue','sans-serif']">
        <Preview>Confirm your email address</Preview>
        <Container className="my-0 mx-auto py-0 px-5">
          <Section className="mt-8">
            <Img
              src={`${baseUrl}/static/slack-logo.png`}
              width="120"
              height="36"
              alt="Slack"
            />
          </Section>
          <Heading className="text-[#1d1c1d] text-4xl font-bold my-[30px] mx-0 p-0 leading-[42px]">
            Confirm your email address
          </Heading>
          <Text className="text-xl leading-7 mb-[30px]">
            Your confirmation code is below - enter it in your open browser window
            and we'll help you get signed in.
          </Text>
  
          <Section className="bg-[rgb(245,244,245)] rounded mb-[30px] py-10 px-[10px]">
            <Text className="text-3xl text-center align-middle">{validationCode}</Text>
          </Section>
  
          <Text className="text-black text-sm leading-6">
            If you didn't request this email, there's nothing to worry about, you
            can safely ignore it.
          </Text>
  
          <Section>
            <Row className="mb-8 pl-2 pr-2 block">
              <Column className="w-[66%]">
                <Img
                  src={`${baseUrl}/static/slack-logo.png`}
                  width="120"
                  height="36"
                  alt="Slack"
                />
              </Column>
              <Column>
                <Section>
                  <Row>
                    <Column>
                      <Link href="/">
                        <Img
                          src={`${baseUrl}/static/slack-twitter.png`}
                          width="32"
                          height="32"
                          alt="Slack"
                          className="inline ml-8"
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href="/">
                        <Img
                          src={`${baseUrl}/static/slack-facebook.png`}
                          width="32"
                          height="32"
                          alt="Slack"
                          className="inline ml-8"
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href="/">
                        <Img
                          src={`${baseUrl}/static/slack-linkedin.png`}
                          width="32"
                          height="32"
                          alt="Slack"
                          className="inline ml-8"
                        />
                      </Link>
                    </Column>
                  </Row>
                </Section>
              </Column>
            </Row>
          </Section>
  
          <Section>
            <Link
              className="text-[#b7b7b7] underline"
              href="https://slackhq.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Our blog
            </Link>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              className="text-[#b7b7b7] underline"
              href="https://slack.com/legal"
              target="_blank"
              rel="noopener noreferrer"
            >
              Policies
            </Link>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              className="text-[#b7b7b7] underline"
              href="https://slack.com/help"
              target="_blank"
              rel="noopener noreferrer"
            >
              Help center
            </Link>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              className="text-[#b7b7b7] underline"
              href="https://slack.com/community"
              target="_blank"
              rel="noopener noreferrer"
              data-auth="NotApplicable"
              data-linkindex="6"
            >
              Slack Community
            </Link>
            <Text className="text-xs text-[#b7b7b7] leading-[15px] text-left mb-[50px]">
              ©2022 Slack Technologies, LLC, a Salesforce company. <br />
              500 Howard Street, San Francisco, CA 94105, USA <br />
              <br />
              All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
  
  SlackConfirmEmail.PreviewProps = {
    validationCode: 'DJZ-TLX',
  } as SlackConfirmEmailProps;
  
  export default SlackConfirmEmail;