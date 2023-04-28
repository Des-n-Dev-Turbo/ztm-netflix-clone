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
