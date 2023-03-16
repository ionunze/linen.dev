import { Settings, SerializedChannel, SerializedAccount } from '@linen/types';
import { RedirectTo } from './response';
import { appendProtocol } from '@linen/utilities/url';

export function resolveCrawlerRedirect({
  isSubdomainbasedRouting,
  communityName,
  settings,
  channel,
}: {
  isSubdomainbasedRouting: boolean;
  communityName: string;
  settings: Settings;
  channel: SerializedChannel;
}) {
  let url = buildChannelUrl({
    isSubdomainbasedRouting,
    settings,
    communityName,
    channel,
  });

  return {
    redirect: {
      destination: url,
      permanent: false,
    },
  };
}

export function shouldRedirectToDomain({
  account,
  communityName,
  isSubdomainbasedRouting,
}: {
  account: SerializedAccount;
  communityName: string;
  isSubdomainbasedRouting: boolean;
}) {
  if (process.env.SKIP_REDIRECT === 'true') return false;
  return (
    account.premium &&
    !!account.redirectDomain &&
    communityName !== account.redirectDomain &&
    !isSubdomainbasedRouting
  );
}

export function redirectChannelToDomain({
  account,
  communityName,
  settings,
  channel,
}: {
  account: SerializedAccount;
  communityName: string;
  settings: Settings;
  channel: SerializedChannel;
}) {
  return RedirectTo(
    appendProtocol(
      account.redirectDomain +
        buildChannelUrl({
          isSubdomainbasedRouting: true,
          settings,
          communityName,
          channel,
        })
    )
  );
}

export function redirectThreadToDomain({
  account,
  communityName,
  settings,
  threadId,
  slug,
}: {
  account: SerializedAccount;
  communityName: string;
  settings: Settings;
  threadId: string;
  slug?: string;
}) {
  return RedirectTo(
    appendProtocol(
      account.redirectDomain +
        buildThreadUrl({
          isSubdomainbasedRouting: true,
          settings,
          communityName,
          threadId,
          slug,
        })
    )
  );
}

function buildChannelUrl({
  isSubdomainbasedRouting,
  settings,
  communityName,
  channel,
}: {
  isSubdomainbasedRouting: boolean;
  settings: Settings;
  communityName: string;
  channel: SerializedChannel;
}) {
  let url = isSubdomainbasedRouting
    ? ''
    : `/${settings.prefix}/${communityName}`;

  url += `/c/${channel.channelName}`;
  return url;
}

function buildThreadUrl({
  isSubdomainbasedRouting,
  settings,
  communityName,
  threadId,
  slug,
}: {
  isSubdomainbasedRouting: boolean;
  settings: Settings;
  communityName: string;
  threadId: string;
  slug: string | undefined;
}) {
  let url = isSubdomainbasedRouting
    ? ''
    : `/${settings.prefix}/${communityName}`;

  url += `/t/${threadId}` + (slug ? `/${slug}` : ``);
  return url;
}
