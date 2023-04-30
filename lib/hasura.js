async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

export async function isNewUser(token, did) {
  const operationsDoc = `
  query IsNewUser($did: String!) {
    users(where: {issuer: {_eq: $did }}) {
      email
      id
      issuer
    }
  }
`;

  const response = await queryHasuraGQL(operationsDoc, 'IsNewUser', { did }, token);
  return response?.data?.users?.length === 0;
}

export async function createNewUser(token, metadata) {
  const operationsDoc = `
  mutation CreateNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
      }
    }
  }
`;

  const { issuer, email, publicAddress } = metadata;

  const response = await queryHasuraGQL(
    operationsDoc,
    'CreateNewUser',
    {
      issuer,
      email,
      publicAddress,
    },
    token
  );
  return response;
}

export async function findVideoIdByUser(token, userId, videoId) {
  const operationsDoc = `
  query FindVideoIdByUserId($userId: String!, $videoId: String!) {
    stats(where: { userId: {_eq: $userId}, videoId: {_eq: $videoId }}) {
      id
      userId
      videoId
      favourited
      watched
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    'FindVideoIdByUserId',
    {
      videoId,
      userId,
    },
    token
  );

  return response?.data?.stats;
}

export async function createNewStats(token, { favourited, userId, watched, videoId }) {
  const operationsDoc = `
    mutation InsertStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
      insert_stats_one(
        object: {
          favourited: $favourited, 
          userId: $userId, 
          watched: $watched, 
          videoId: $videoId
        }) {
          favourited
          id
          userId
        }
      }
  `;

  const response = await queryHasuraGQL(operationsDoc, 'InsertStats', { favourited, userId, watched, videoId }, token);

  return response;
}

export async function updateStats(token, { favourited, userId, watched, videoId }) {
  const operationsDoc = `
    mutation UpdateStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
      update_stats(
        _set: {watched: $watched, favourited: $favourited}, 
        where: {
          userId: {_eq: $userId}, 
          videoId: {_eq: $videoId}
        }) {
        returning {
          favourited,
          userId,
          watched,
          videoId
        }
      }
    }
  `;

  const response = await queryHasuraGQL(operationsDoc, 'UpdateStats', { favourited, userId, watched, videoId }, token);

  return response;
}

export async function getWatchedVideos(userId, token) {
  const operationsDoc = `
  query watchedVideos($userId: String!) {
    stats(where: {
      watched: {_eq: true}, 
      userId: {_eq: $userId},
    }) {
      videoId
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    'watchedVideos',
    {
      userId,
    },
    token
  );

  return response?.data?.stats;
}

export async function getFavouritedVideos(userId, token) {
  const operationsDoc = `
  query watchedVideos($userId: String!) {
    stats(where: {
      favourited: {_eq: 1}, 
      userId: {_eq: $userId},
    }) {
      videoId
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    'watchedVideos',
    {
      userId,
    },
    token
  );

  return response?.data?.stats;
}
