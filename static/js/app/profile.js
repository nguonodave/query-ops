export async function fetchProfile(token) {
    const response = await fetch(`https://${domain}/api/graphql-engine/v1/graphql`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `
        {
          user {
            id
            login
          }
        }
      `
        })
    });

    const result = await response.json();

    if (result.errors) {
        throw new Error("GraphQL error: " + result.errors[0].message);
    }

    return result.data.user[0]; // it's usually an array
}
