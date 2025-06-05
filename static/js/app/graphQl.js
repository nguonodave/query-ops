import { domain } from "./main.js";

export async function fetchUserProfile(token) {
  const query = `
    {
      user {
        id
        login
        attrs
      }
    }
  `;

  const response = await fetch(`https://${domain}/api/graphql-engine/v1/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

//   console.log(result)
//   console.log(result.data)
//   console.log(result.data.user[0])

  return result.data.user[0];
}
