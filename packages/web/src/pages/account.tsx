import * as React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Divider, Flex, Spinner, Text } from '@chakra-ui/react';
import useUser from '../hooks/UseUser';
import RedirectingPage from '../components/RedirectingPage';
import ProfilesConnector from '../components/account/ProfilesConnector';
import YourProfilesSection from '../components/account/YourProfiles';
import ProfilesSelector from '../components/account/ProfilesSelector';
import { FacebookPage, InstagramProfile } from '../types';

interface AccountPageState {
  profilesState?: {
    facebookPage?: FacebookPage;
    instagramProfile?: InstagramProfile;
  };
  fbAccessToken?: string;
  facebookChecked: boolean;
  instagramChecked: boolean;
}

const DEFAULT_ACCOUNT_PAGE_STATE: AccountPageState = {
  facebookChecked: true,
  instagramChecked: true,
};

const AccountPage = () => {
  const router = useRouter();
  const { user, loading } = useUser();
  const [state, setState] = React.useState<AccountPageState>(
    DEFAULT_ACCOUNT_PAGE_STATE,
  );

  React.useEffect(() => {
    if (!user && !loading) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  React.useEffect(() => {
    if (user) {
      setState({
        ...state,
        profilesState: {
          facebookPage: user.facebookPage,
          instagramProfile: user.instagramProfile,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, setState]);

  if (loading) {
    return <Spinner></Spinner>;
  }
  if (!user) {
    return <RedirectingPage />;
  }

  return (
    <Box minW="full" minH="screen">
      <Head>
        <title>Account | Crystal Ball</title>
      </Head>
      <Box pt={24}>
        <Flex
          flexDir="column"
          px={{ base: 10, lg: 60 }}
          py={10}
          alignItems={{ base: 'center', lg: 'start' }}
        >
          <Divider py={3} />
          <Text fontSize="2xl" fontWeight="bold">
            Your Linked Social Netork profiles
          </Text>
          <YourProfilesSection user={user} />
          <Divider py={3} />
          <Text fontSize="2xl" fontWeight="bold">
            Connect your Social Network profiles
          </Text>
          <ProfilesConnector
            facebookEnabled={!state.profilesState?.facebookPage}
            instagramEnabled={!state.profilesState?.instagramProfile}
            onFacebookConnected={(
              token: string,
              facebookSelected: boolean,
              instagramSelected: boolean,
            ) =>
              setState({
                ...state,
                fbAccessToken: token,
                facebookChecked: facebookSelected,
                instagramChecked: instagramSelected,
              })
            }
          />
          <Divider py={3} />
          {state.fbAccessToken && (
            <ProfilesSelector
              fbAccessToken={state.fbAccessToken}
              displayFacebook={
                state.facebookChecked && !state.profilesState?.facebookPage
              }
              displayInstagram={
                state.instagramChecked && !state.profilesState?.instagramProfile
              }
            />
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default AccountPage;
