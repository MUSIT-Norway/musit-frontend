// @flow

// The value of clientCommitSha will be overwritten by the gitlab CI process
// using sed. See the .gitlab-ci.yml file to see the command being used.
const clientCommitSha = 'LOCAL_DEVELOPMENT';

const gitlabBaseUrl = 'https://gitlab.com/MUSIT-Norway';
const clientRepoUrl = gitlabBaseUrl + '/musit-frontend';
const backendRepoUrl = gitlabBaseUrl + '/musit';

export type VersionInfo = {
  sha: string,
  url?: string
};

type BackendInfo = {
  commitSha: string
};

function getBackendCommitSha(buildInfo: BackendInfo) {
  if (buildInfo && buildInfo.commitSha) {
    return buildInfo.commitSha;
  }
  return '';
}

export function frontendVersion(): VersionInfo {
  if (clientCommitSha.length === 40) {
    const url = clientRepoUrl + '/commit/' + clientCommitSha;
    return { sha: clientCommitSha, url: url };
  }
  return { sha: clientCommitSha };
}

export function backendVersion(buildInfo: BackendInfo): VersionInfo {
  const sha = getBackendCommitSha(buildInfo);
  if (sha.length === 40) {
    const url = backendRepoUrl + '/commit/' + sha;
    return { sha: sha, url: url };
  }
  return { sha: sha };
}
