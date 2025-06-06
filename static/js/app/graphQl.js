import { domain } from "./main.js";

export async function fetchUserProfile(token) {
  const query = `
    {
      user {
        # Basic Identification
        login
        attrs
        auditRatio
        
        # XP Data (for line graph)
        xpTransactions: transactions(
          where: {type: {_eq: "xp"}},
          order_by: {createdAt: asc}
        ) {
          amount
          createdAt
        }
        
        # Audit Data (for audit ratio pie chart)
        auditTransactions: transactions(
          where: {type: {_in: ["up", "down"]}}
        ) {
          type
          amount
        }
        
        # Project Data (for pass/fail pie chart)
        progresses(
          where: {object: {type: {_eq: "project"}}},
          order_by: {createdAt: desc}
        ) {
          grade
          object {
            name
          }
        }
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
